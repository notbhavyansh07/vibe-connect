import React from 'react';

interface RadarChart5DProps {
  values: [number, number, number, number, number]; // 0 - 100 for [Music, Energy, Gaming, DeepTalks, Night]
  comparisonValues?: [number, number, number, number, number];
  size?: number;
  isLoading?: boolean;
}

export const RadarChart5D: React.FC<RadarChart5DProps> = ({
  values,
  comparisonValues,
  size = 260,
  isLoading = false,
}) => {
  const center = size / 2;
  const radius = (size / 2) * 0.72;

  // 5 Trait Labels positioned at 5 Pentagon Vertices (Angles: -90, -18, 54, 126, 198 deg)
  const labels = [
    { name: 'MUSIC', angle: -90, xOffset: 0, yOffset: -12 },
    { name: 'ENERGY', angle: -18, xOffset: 16, yOffset: 0 },
    { name: 'GAMING', angle: 54, xOffset: 12, yOffset: 14 },
    { name: 'DEEP TALKS', angle: 126, xOffset: -12, yOffset: 14 },
    { name: 'NIGHT OWL', angle: 198, xOffset: -16, yOffset: 0 },
  ];

  const getCoordinates = (angleDeg: number, valPercent: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (radius * Math.max(10, Math.min(100, valPercent))) / 100;
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad),
    };
  };

  // Generate polygon points string
  const primaryPoints = values
    .map((val, idx) => {
      const coords = getCoordinates(labels[idx].angle, val);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  const comparisonPoints = comparisonValues
    ? comparisonValues
        .map((val, idx) => {
          const coords = getCoordinates(labels[idx].angle, val);
          return `${coords.x},${coords.y}`;
        })
        .join(' ')
    : null;

  // Grid concentric pentagons
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} className="overflow-visible select-none" role="img" aria-label="5-Dimensional Vibe Vector Radar Chart">
        
        {/* Concentric Guide Pentagons */}
        {gridLevels.map((lvl, lIdx) => {
          const gridPoints = labels
            .map((lbl) => {
              const coords = getCoordinates(lbl.angle, lvl * 100);
              return `${coords.x},${coords.y}`;
            })
            .join(' ');

          return (
            <polygon
              key={lIdx}
              points={gridPoints}
              fill={lIdx === gridLevels.length - 1 ? 'rgba(0, 240, 255, 0.02)' : 'none'}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray={lIdx < 3 ? '2 2' : undefined}
            />
          );
        })}

        {/* Axis Lines radiating from center */}
        {labels.map((lbl, idx) => {
          const coords = getCoordinates(lbl.angle, 100);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              stroke="rgba(0, 240, 255, 0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* Radar Sweep Beam (Scanning during computation) */}
        {isLoading && (
          <g className="animate-radar-sweep origin-center">
            <line
              x1={center}
              y1={center}
              x2={center + radius}
              y2={center}
              stroke="#00f0ff"
              strokeWidth="2"
              className="opacity-80 shadow-md shadow-cyan-400"
            />
            <path
              d={`M ${center} ${center} L ${center + radius} ${center} A ${radius} ${radius} 0 0 0 ${center + radius * Math.cos(-Math.PI / 4)} ${center + radius * Math.sin(-Math.PI / 4)} Z`}
              fill="url(#radarGradient)"
              className="opacity-40"
            />
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 240, 255, 0)" />
                <stop offset="100%" stopColor="rgba(0, 240, 255, 0.5)" />
              </linearGradient>
            </defs>
          </g>
        )}

        {/* Comparison Polygon (e.g. Matched Twin) */}
        {comparisonPoints && (
          <polygon
            points={comparisonPoints}
            fill="rgba(255, 77, 109, 0.15)"
            stroke="#ff4d6d"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        )}

        {/* User Active Vibe Polygon */}
        <polygon
          points={primaryPoints}
          fill="rgba(0, 240, 255, 0.25)"
          stroke="#00f0ff"
          strokeWidth="2.5"
          className="transition-all duration-300 ease-out"
        />

        {/* Vector Points / Vertices Glow Dots */}
        {values.map((val, idx) => {
          const coords = getCoordinates(labels[idx].angle, val);
          return (
            <circle
              key={idx}
              cx={coords.x}
              cy={coords.y}
              r="4.5"
              fill="#00f0ff"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-300 ease-out shadow-lg"
            />
          );
        })}

        {/* Text Labels at Vertices */}
        {labels.map((lbl, idx) => {
          const coords = getCoordinates(lbl.angle, 115);
          return (
            <text
              key={idx}
              x={coords.x + lbl.xOffset}
              y={coords.y + lbl.yOffset}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[9px] font-mono fill-slate-300 font-bold uppercase tracking-wider"
            >
              {lbl.name}
            </text>
          );
        })}
      </svg>

      {/* Telemetry Footer Legend */}
      <div className="flex items-center gap-4 mt-2 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
          <span>{isLoading ? '[SCANNING_VECTOR_NODES...]' : 'YOUR 5D VECTOR'}</span>
        </div>
        {comparisonPoints && !isLoading && (
          <div className="flex items-center gap-1.5 text-pink-400">
            <span className="w-2 h-2 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50" />
            <span>MATCH VECTOR</span>
          </div>
        )}
      </div>
    </div>
  );
};
