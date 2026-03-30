import { useId } from "react";

type NetworkDiagramProps = {
  layers: readonly number[];
  animate?: boolean;
  labels?: readonly string[];
  className?: string;
  activeLayerIndex?: number;
};

type NodePoint = {
  x: number;
  y: number;
  layerIndex: number;
  nodeIndex: number;
};

export function NetworkDiagram({
  layers,
  animate = false,
  labels,
  className = "",
  activeLayerIndex,
}: NetworkDiagramProps) {
  const gradientId = useId();
  const width = 860;
  const height = 300;
  const radius = 12;
  const paddingX = 96;
  const paddingY = 44;
  const maxNodes = Math.max(...layers);

  const points: NodePoint[][] = layers.map((nodes, layerIndex) => {
    const x =
      layers.length === 1
        ? width / 2
        : paddingX + (layerIndex * (width - paddingX * 2)) / (layers.length - 1);

    return Array.from({ length: nodes }, (_, nodeIndex) => {
      const y =
        nodes === 1
          ? height / 2
          : paddingY + (nodeIndex * (height - paddingY * 2)) / (nodes - 1);

      return { x, y, layerIndex, nodeIndex };
    });
  });

  return (
    <div
      className={`panel-surface relative overflow-hidden rounded-[1.75rem] border border-white/60 p-4 sm:p-5 ${className}`}
    >
      <div className="soft-orb left-6 top-6 h-20 w-20 bg-cyan-300/30" />
      <div className="soft-orb bottom-6 right-6 h-16 w-16 bg-emerald-300/35" />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative h-[240px] w-full overflow-visible sm:h-[280px]"
        role="img"
        aria-label="Diagrama de una red neuronal"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.48)" />
            <stop offset="100%" stopColor="rgba(20, 184, 166, 0.64)" />
          </linearGradient>
        </defs>

        {points.slice(0, -1).map((layerPoints, layerIndex) =>
          layerPoints.flatMap((point) =>
            points[layerIndex + 1].map((nextPoint) => (
              (() => {
                const isFocusedLine =
                  activeLayerIndex === undefined
                    ? false
                    : layerIndex === activeLayerIndex ||
                      layerIndex + 1 === activeLayerIndex;

                return (
              <line
                key={`${point.layerIndex}-${point.nodeIndex}-${nextPoint.layerIndex}-${nextPoint.nodeIndex}`}
                x1={point.x}
                y1={point.y}
                x2={nextPoint.x}
                y2={nextPoint.y}
                className={
                  animate || isFocusedLine
                    ? "network-line network-line-active"
                    : "network-line"
                }
                style={{
                  stroke: animate || isFocusedLine ? `url(#${gradientId})` : undefined,
                  animationDelay: `${layerIndex * 160}ms`,
                  opacity: isFocusedLine || activeLayerIndex === undefined ? 1 : 0.55,
                }}
              />
                );
              })()
            )),
          ),
        )}

        {points.map((layerPoints, layerIndex) =>
          layerPoints.map((point) => {
            const ratio = maxNodes > 1 ? point.nodeIndex / (maxNodes - 1) : 0.5;
            const isFocusedNode =
              activeLayerIndex === undefined || activeLayerIndex === layerIndex;

            return (
              <g
                key={`${point.layerIndex}-${point.nodeIndex}`}
                style={{ animationDelay: `${layerIndex * 190}ms` }}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={radius + 10}
                  fill={`rgba(34, 211, 238, ${0.06 + ratio * 0.06})`}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={radius}
                  className={
                    animate || isFocusedNode
                      ? "network-node network-node-active"
                      : "network-node"
                  }
                />
              </g>
            );
          }),
        )}
      </svg>

      {labels ? (
        <div
          className="mt-4 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}
        >
          {labels.map((label) => (
            <div
              key={label}
              className={[
                "signal-label rounded-full px-3 py-2 text-center text-[0.7rem] font-medium tracking-[0.18em] uppercase transition-all",
                activeLayerIndex === undefined
                  ? "text-slate-500"
                  : labels.indexOf(label) === activeLayerIndex
                    ? "border-teal-500/30 bg-teal-500/[0.12] text-teal-700"
                    : "text-slate-400",
              ].join(" ")}
            >
              {label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
