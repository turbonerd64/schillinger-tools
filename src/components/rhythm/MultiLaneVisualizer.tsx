import React, { useRef, useState } from 'react';
import { ResultantOutput, DurationBlock } from '../../core/rhythm/types';
import { Eye, Info, Volume2 } from 'lucide-react';

interface MultiLaneVisualizerProps {
  resultant: ResultantOutput;
  playheadProgress: number; // 0.0 to 1.0
  activeTick: number;
}

export const MultiLaneVisualizer: React.FC<MultiLaneVisualizerProps> = ({
  resultant,
  playheadProgress,
  activeTick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBlock, setHoveredBlock] = useState<DurationBlock | null>(null);

  const { totalLength, lanes, measureBars, mode } = resultant;

  // Visual layout dimensions
  const laneHeight = 52;
  const laneGap = 14;
  const numLanes = lanes.length;
  // Dynamic width based on cycle length to ensure crisp readability
  // At least 36px per unit tick
  const tickWidth = Math.max(38, Math.min(68, 900 / totalLength));
  const svgWidth = totalLength * tickWidth;
  const svgHeight = numLanes * (laneHeight + laneGap) + 40;

  // Calculate measure line X coordinates
  const measureLineXs = measureBars.map((barTick) => barTick * tickWidth);

  // Attack cut guide lines (all attack ticks from all lanes)
  const allCutTicks = Array.from(
    new Set(lanes.flatMap((l) => l.attackTicks))
  ).sort((x, y) => x - y);

  return (
    <div className="bg-schillinger-card rounded-2xl border border-schillinger-border p-5 shadow-xl space-y-4">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-schillinger-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-schillinger-resultant" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Multi-Lane Comparative Graph
          </h2>
          <span className="text-[11px] font-mono text-schillinger-textMuted bg-schillinger-bg px-2 py-0.5 rounded border border-schillinger-border">
            {mode === 'fractioned' ? 'Fractioned Model' : mode === 'trinomial' ? '3-Part Model' : 'Binary Model'}
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-schillinger-accentA"></span>
            <span className="text-gray-300">Gen a</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-schillinger-accentB"></span>
            <span className="text-gray-300">Gen b</span>
          </div>
          {mode === 'trinomial' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-schillinger-accentC"></span>
              <span className="text-gray-300">Gen c</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-schillinger-resultant"></span>
            <span className="text-gray-300">Resultant r</span>
          </div>
          <div className="flex items-center gap-1.5 text-schillinger-resultant font-bold">
            <span className="px-1 text-[11px] bg-schillinger-resultant/20 border border-schillinger-resultant/40 rounded">
              &gt;
            </span>
            <span>Accent</span>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Graph Viewport */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-hidden rounded-xl bg-schillinger-bg/95 border border-schillinger-border/80 p-3 select-none relative scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          className="overflow-visible block"
          style={{ minWidth: '100%' }}
        >
          <defs>
            {/* Soft glow filter for accents */}
            <filter id="accentGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Atomic pulse grid vertical ticks (Lane 3 / background) */}
          {Array.from({ length: totalLength + 1 }).map((_, tick) => {
            const x = tick * tickWidth;
            return (
              <g key={`grid-tick-${tick}`}>
                <line
                  x1={x}
                  y1={16}
                  x2={x}
                  y2={svgHeight - 16}
                  stroke="#1c2333"
                  strokeWidth={tick % 4 === 0 ? 1.5 : 1}
                  strokeDasharray={tick % 4 === 0 ? undefined : '2,2'}
                />
                {/* Tick index label at bottom */}
                <text
                  x={x}
                  y={svgHeight - 4}
                  fill="#5a6a85"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Dotted cut guidelines dropping through resultant */}
          {allCutTicks.map((cutTick) => {
            const x = cutTick * tickWidth;
            return (
              <line
                key={`cut-${cutTick}`}
                x1={x}
                y1={20}
                x2={x}
                y2={svgHeight - 20}
                stroke="#37445c"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.4}
              />
            );
          })}

          {/* Lanes and Duration Blocks */}
          {lanes.map((lane, laneIdx) => {
            const y = 24 + laneIdx * (laneHeight + laneGap);

            return (
              <g key={lane.id}>
                {/* Lane Track Background */}
                <rect
                  x={0}
                  y={y}
                  width={svgWidth}
                  height={laneHeight}
                  rx={8}
                  fill="#111622"
                  stroke="#1f2737"
                  strokeWidth={1}
                />

                {/* Lane Label Tag */}
                <text
                  x={8}
                  y={y - 6}
                  fill={lane.color}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {lane.name}
                </text>

                {/* Duration Blocks */}
                {lane.blocks.map((block, bIdx) => {
                  const blockX = block.startTick * tickWidth;
                  const blockW = Math.max(4, block.duration * tickWidth - 3); // 3px visual gap
                  const isHovered = hoveredBlock?.index === block.index && hoveredBlock?.generatorSource === block.generatorSource;
                  const isBlockActive = activeTick >= block.startTick && activeTick < block.startTick + block.duration;

                  return (
                    <g
                      key={`${lane.id}-block-${bIdx}`}
                      onMouseEnter={() => setHoveredBlock(block)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      className="cursor-pointer transition-transform"
                    >
                      <rect
                        x={blockX}
                        y={y + 3}
                        width={blockW}
                        height={laneHeight - 6}
                        rx={6}
                        fill={lane.color}
                        fillOpacity={isBlockActive ? 0.95 : isHovered ? 0.85 : 0.4}
                        stroke={lane.color}
                        strokeWidth={isBlockActive ? 2.5 : isHovered ? 2 : 1}
                        className="transition-all duration-100"
                      />

                      {/* Integer duration printed in center of block */}
                      {blockW > 18 && (
                        <text
                          x={blockX + blockW / 2}
                          y={y + laneHeight / 2 + 5}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="700"
                          fontFamily="monospace"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {block.duration}
                        </text>
                      )}

                      {/* Accent caret (>) on coincidence of phase */}
                      {block.isAccented && (
                        <g filter="url(#accentGlow)">
                          <circle
                            cx={blockX + 7}
                            cy={y + 11}
                            r={3}
                            fill="#ffffff"
                          />
                          <text
                            x={blockX + 16}
                            y={y + 15}
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="900"
                            fontFamily="monospace"
                            pointerEvents="none"
                          >
                            &gt;
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Metric measure dividers (solid vertical bars) */}
          {measureLineXs.map((mX, mIdx) => (
            <g key={`measure-${mIdx}`}>
              <line
                x1={mX}
                y1={16}
                x2={mX}
                y2={svgHeight - 16}
                stroke="#64748b"
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.85}
              />
              <text
                x={mX + 4}
                y={18}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="600"
              >
                Bar {mIdx + 1}
              </text>
            </g>
          ))}

          {/* Real-time Hardware Playhead Cursor */}
          <g
            style={{
              transform: `translateX(${playheadProgress * svgWidth}px)`,
              transition: 'transform 0.04s linear',
            }}
          >
            <line
              x1={0}
              y1={10}
              x2={0}
              y2={svgHeight - 12}
              stroke="#ffffff"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Playhead handle top marker */}
            <polygon
              points="-6,10 6,10 0,18"
              fill="#ffffff"
            />
            {/* Playhead handle bottom marker */}
            <polygon
              points="-6,${svgHeight - 12} 6,${svgHeight - 12} 0,${svgHeight - 20}"
              fill="#ffffff"
            />
          </g>
        </svg>
      </div>

      {/* Interactive Duration Inspector Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-schillinger-textMuted bg-schillinger-panel/60 p-2.5 rounded-xl border border-schillinger-border/60">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-schillinger-resultant" />
          <span>
            {hoveredBlock ? (
              <span className="text-white">
                Selected Block: <strong className="text-schillinger-resultant">{hoveredBlock.duration}</strong> units (from tick {hoveredBlock.startTick} to {hoveredBlock.startTick + hoveredBlock.duration})
                {hoveredBlock.isAccented ? ' • Accented Attack (Phase Coincidence)' : ''}
              </span>
            ) : (
              <span>Hover or tap any duration block to inspect exact time boundaries</span>
            )}
          </span>
        </div>
        <div className="text-[11px] text-gray-400 mt-1 sm:mt-0">
          Current Playhead: <strong className="text-white">{activeTick}</strong> / {totalLength} ticks
        </div>
      </div>
    </div>
  );
};
