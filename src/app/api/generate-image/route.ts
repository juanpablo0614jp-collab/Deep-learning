import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import {
  DEMO_IMAGE_USED_COOKIE,
  DEMO_IMAGE_USER_ID_COOKIE,
  MAX_IMAGE_GENERATIONS,
} from "@/lib/demo-image-limit";

const generationUsage = new Map<string, number>();

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

type GenerateImageRequestBody = {
  prompt?: unknown;
};

function getOpenAIErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";
  const message =
    error instanceof Error ? error.message : "Error desconocido al generar";

  if (code === "billing_hard_limit_reached") {
    return "Tu cuenta de OpenAI alcanzó el límite de facturación. Revisa Billing antes de generar más imágenes.";
  }

  if (code === "insufficient_quota") {
    return "Tu cuenta de OpenAI no tiene cuota disponible para generar imágenes en este momento.";
  }

  if (message.toLowerCase().includes("billing hard limit")) {
    return "Tu cuenta de OpenAI alcanzó el límite de facturación. Revisa Billing antes de generar más imágenes.";
  }

  return "No se pudo generar la imagen. Intenta de nuevo.";
}

function createErrorResponse(
  message: string,
  status: number,
  userId?: string,
  usedCount?: number,
) {
  const response = NextResponse.json(
    {
      error: message,
      generationsRemaining:
        typeof usedCount === "number"
          ? Math.max(0, MAX_IMAGE_GENERATIONS - usedCount)
          : undefined,
    },
    { status },
  );

  if (userId) {
    response.cookies.set(DEMO_IMAGE_USER_ID_COOKIE, userId, cookieOptions);
  }

  if (typeof usedCount === "number") {
    response.cookies.set(
      DEMO_IMAGE_USED_COOKIE,
      String(usedCount),
      cookieOptions,
    );
  }

  return response;
}

function getSafeCookieCount(value: string | undefined) {
  const parsedValue = Number(value ?? "0");

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return Math.min(MAX_IMAGE_GENERATIONS, Math.floor(parsedValue));
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return createErrorResponse(
      "Falta configurar OPENAI_API_KEY en el servidor.",
      500,
    );
  }

  let body: GenerateImageRequestBody;

  try {
    body = (await request.json()) as GenerateImageRequestBody;
  } catch {
    return createErrorResponse("La solicitud no es válida.", 400);
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return createErrorResponse("Debes escribir un prompt antes de generar.", 400);
  }

  if (prompt.length > 1000) {
    return createErrorResponse(
      "El prompt es demasiado largo para esta demo.",
      400,
    );
  }

  const cookieStore = await cookies();
  const headerUserId = request.headers.get("x-demo-user-id")?.trim();
  const cookieUserId = cookieStore.get(DEMO_IMAGE_USER_ID_COOKIE)?.value?.trim();
  const userId = headerUserId || cookieUserId || crypto.randomUUID();

  const memoryCount = generationUsage.get(userId) ?? 0;
  const cookieCount = getSafeCookieCount(
    cookieStore.get(DEMO_IMAGE_USED_COOKIE)?.value,
  );
  const usedCount = Math.max(memoryCount, cookieCount);

  if (usedCount >= MAX_IMAGE_GENERATIONS) {
    return createErrorResponse(
      "Ya alcanzaste el límite de 2 imágenes para esta demo.",
      429,
      userId,
      usedCount,
    );
  }

  try {
    const openai = new OpenAI({
      apiKey,
    });

    const result = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "low",
      output_format: "jpeg",
      output_compression: 70,
      moderation: "auto",
      user: userId,
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return createErrorResponse(
        "No se pudo generar la imagen. Intenta de nuevo.",
        502,
        userId,
        usedCount,
      );
    }

    const nextUsedCount = usedCount + 1;
    generationUsage.set(userId, nextUsedCount);

    const response = NextResponse.json({
      imageDataUrl: `data:image/jpeg;base64,${imageBase64}`,
      generationsUsed: nextUsedCount,
      generationsRemaining: Math.max(
        0,
        MAX_IMAGE_GENERATIONS - nextUsedCount,
      ),
      userId,
    });

    response.cookies.set(DEMO_IMAGE_USER_ID_COOKIE, userId, cookieOptions);
    response.cookies.set(
      DEMO_IMAGE_USED_COOKIE,
      String(nextUsedCount),
      cookieOptions,
    );

    return response;
  } catch (error) {
    const safeError =
      error instanceof Error ? error.message : "Error desconocido al generar";
    const friendlyMessage = getOpenAIErrorMessage(error);

    console.error("[generate-image]", safeError);

    return createErrorResponse(
      friendlyMessage,
      502,
      userId,
      usedCount,
    );
  }
}
