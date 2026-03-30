# Laboratorio Visual de Deep Learning

Mini aplicación web educativa construida con Next.js, React, TypeScript y Tailwind CSS para explicar de forma visual:

- redes neuronales y perceptrón multicapa
- conceptos básicos de deep learning
- diferencias entre redes tradicionales y redes generativas

La experiencia está pensada para clase con estudiantes principiantes. No usa fórmulas ni teoría densa. La idea es aprender explorando la interfaz.

## Tecnologías

- Next.js con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `lucide-react`
- `openai`

## Estructura pedagógica

La app vive en una sola página principal con navegación interna, progreso visual y reinicio de demo.

### 1. IA que reconoce

Muestra cómo una IA tradicional observa pistas y clasifica un patrón.

### 2. De una neurona a una red

Explica visualmente el paso de una neurona simple a una red con varias capas.

### 3. ¿Qué es deep learning?

Permite descubrir que más capas significan más etapas para analizar un problema.

### 4. Reconocer vs crear

Compara una IA tradicional con una IA generativa.

La columna generativa ahora usa una ruta API interna para llamar al modelo de imágenes de OpenAI y generar una imagen real a partir de un prompt.

### 5. Mini quiz final

Refuerza las ideas clave con preguntas cortas.

### 6. Cierre

Resume los aprendizajes principales.

## Instalación

Requisitos recomendados:

- Node.js 20 o superior
- npm 10 o superior

Instala dependencias con:

```bash
npm install
```

## Configuración de `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto con esta variable:

```bash
OPENAI_API_KEY=tu_api_key_aqui
```

Importante:

- Nunca expongas esta key en el frontend.
- La app usa la key solo en la ruta backend interna.
- No subas `.env.local` al repositorio.

También puedes usar `.env.example` como referencia.

## Ejecución local

Inicia el entorno de desarrollo con:

```bash
npm run dev
```

Luego abre:

```bash
http://localhost:3000
```

## Validación

Lint:

```bash
npm run lint
```

Compilación de producción:

```bash
npm run build
```

## Despliegue en Vercel

La app está lista para desplegarse como proyecto estándar de Next.js.

Pasos rápidos:

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Vercel detectará automáticamente Next.js.
4. Configura `OPENAI_API_KEY` en `Project Settings > Environment Variables`.
5. Publica.

Importante:

- La misma variable `OPENAI_API_KEY` debe existir también en Vercel.
- Nunca debes exponer esa key en componentes cliente, logs del navegador o archivos públicos.

## Cómo funciona la generación de imágenes

- La sección 4 envía el prompt a `src/app/api/generate-image/route.ts`.
- La ruta llama al SDK oficial de OpenAI desde el servidor.
- Se usa una sola imagen por solicitud.
- Se usa tamaño cuadrado y configuración conservadora para demo.
- La respuesta vuelve al frontend como imagen embebida para mostrarse dentro de la tarjeta existente.

## Límite de 2 generaciones por usuario

Esta demo limita a cada usuario a un máximo de 2 imágenes.

Se aplica en dos niveles:

- Frontend: guarda el conteo en `localStorage`, muestra el contador visible y deshabilita el botón cuando llega a 0.
- Backend: refuerza el límite con un identificador simple por usuario y validación adicional en la ruta API. Si se supera el límite, responde con error `429`.

Es una restricción ligera pensada para clase y demostración, no una solución de producción.

## Organización del código

Archivos principales:

- `src/app/page.tsx`: entrada de la aplicación
- `src/components/learning-lab.tsx`: composición general de la demo
- `src/components/sections/recognize-vs-create-section.tsx`: sección 4 con generación real de imágenes
- `src/app/api/generate-image/route.ts`: ruta API interna para OpenAI
- `src/lib/demo-image-limit.ts`: constantes compartidas del límite de generaciones
- `src/components/sections/*`: resto de secciones pedagógicas

## Fuentes usadas para la integración de OpenAI

- Guía oficial de generación de imágenes:
  https://platform.openai.com/docs/guides/image-generation?lang=javascript
- API oficial de imágenes:
  https://platform.openai.com/docs/api-reference/images
