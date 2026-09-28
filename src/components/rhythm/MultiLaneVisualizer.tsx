import React, { useRef, useState, useEffect } from 'react';
import { ResultantOutput, DurationBlock } from '../../core/rhythm/types';
import { Eye, Info } from 'lucide-react';

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

  // Track previous progress to disable transition when looping back to 0
  const prevProgressRef = useRef<number>(0);
  const isLoopingRef = useRef<boolean>(false);

  useEffect(() => {
    // If progress wrapped around from high to near-zero, disable tweening
    if (playheadProgress < prevProgressRef.current && prevProgressRef.current > 0.5) {
      isLoopingRef.current = true;
    } else {
      isLoopingRef.current = false;
    }
    prevProgressRef.current = playheadProgress;
  }, [playheadProgress]);

  const { totalLength, lanes, measureBars, mode } = resultant;

  // Visual layout dimensions
  const laneHeight = 50;
  const laneGap = 12;
  const numLanes = lanes.length;
  // Ensure readable width per tick
  const tickWidth = Math.max(40, Math.min(68, 850 / totalLength));
  const svgWidth = totalLength * tickWidth;
  const svgHeight = numLanes * (laneHeight + laneGap) + 38;

  const measureLineXs = measureBars.map((barTick) => barTick * tickWidth);

  const allCutTicks = Array.from(
    new Set(lanes.flatMap((l) => l.attackTicks))
  ).sort((x, y) => x - y);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 shadow-sm space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#c84b31]" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Multi-Lane Comparative Graph
          </h2>
          <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300 font-bold">
            {mode === 'fractioned' ? 'Fractioned Model' : mode === 'trinomial' ? '3-Part Model' : 'Binary Model'}
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-600"></span>
            <span className="text-slate-700">Gen a</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-600"></span>
            <span className="text-slate-700">Gen b</span>
          </div>
          {mode === 'trinomial' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-600"></span>
              <span className="text-slate-700">Gen c</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#c84b31]"></span>
            <span className="text-slate-700">Resultant r</span>
          </div>
          <div className="flex items-center gap-1 text-[#c84b31]">
            <span className="px-1 text-[11px] bg-[#fdf0ec] border border-[#c84b31] rounded">
              &gt;
            </span>
            <span>Accent</span>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Graph Viewport - CENTERED */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto rounded-xl bg-slate-50 border-2 border-slate-300 p-3 select-none flex justify-center items-center"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          className="overflow-visible block mx-auto"
        >
          {/* Atomic pulse grid vertical ticks */}
          {Array.from({ length: totalLength + 1 }).map((_, tick) => {
            const x = tick * tickWidth;
            return (
              <g key={`grid-tick-${tick}`}>
                <line
                  x1={x}
                  y1={16}
                  x2={x}
                  y2={svgHeight - 16}
                  stroke="#cbd5e1"
                  strokeWidth={tick % 4 === 0 ? 1.5 : 1}
                  strokeDasharray={tick % 4 === 0 ? undefined : '2,2'}
                />
                <text
                  x={x}
                  y={svgHeight - 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Dotted cut guidelines */}
          {allCutTicks.map((cutTick) => {
            const x = cutTick * tickWidth;
            return (
              <line
                key={`cut-${cutTick}`}
                x1={x}
                y1={20}
                x2={x}
                y2={svgHeight - 20}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.6}
              />
            );
          })}

          {/* Lanes and Duration Blocks */}
          {lanes.map((lane, laneIdx) => {
            const y = 22 + laneIdx * (laneHeight + laneGap);
            const isResultant = lane.id === 'resultant';
            const baseColor =
              lane.id === 'a'
                ? '#0284c7' // sky-600
                : lane.id === 'b'
                ? '#e11d48' // rose-600
                : lane.id === 'c'
                ? '#7c3aed' // purple-600
                : '#c84b31'; // terracotta

            return (
              <g key={lane.id}>
                {/* Lane Track Background */}
                <rect
                  x={0}
                  y={y}
                  width={svgWidth}
                  height={laneHeight}
                  rx={8}
                  fill="#ffffff"
                  stroke="#e2e8f0"
                  strokeWidth={1.5}
                />

                {/* Lane Label */}
                <text
                  x={6}
                  y={y - 5}
                  fill="#1e293b"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {lane.name}
                </text>

                {/* Blocks */}
                {lane.blocks.map((block, bIdx) => {
                  const blockX = block.startTick * tickWidth;
                  const blockW = Math.max(4, block.duration * tickWidth - 3);
                  const isHovered = hoveredBlock?.index === block.index && hoveredBlock?.generatorSource === block.generatorSource;
                  const isBlockActive = activeTick >= block.startTick && activeTick < block.startTick + block.duration;

                  return (
                    <g
                      key={`${lane.id}-block-${bIdx}`}
                      onMouseEnter={() => setHoveredBlock(block)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={blockX}
                        y={y + 3}
                        width={blockW}
                        height={laneHeight - 6}
                        rx={6}
                        fill={baseColor}
                        fillOpacity={isBlockActive ? 1.0 : isHovered ? 0.9 : isResultant ? 0.85 : 0.65}
                        stroke={isBlockActive ? '#0f172a' : baseColor}
                        strokeWidth={isBlockActive ? 2.5 : 1}
                      />

                      {/* Integer duration label inside block */}
                      {blockW > 18 && (
                        <text
                          x={blockX + blockW / 2}
                          y={y + laneHeight / 2 + 5}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="800"
                          fontFamily="monospace"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {block.duration}
                        </text>
                      )}

                      {/* Accent caret (>) */}
                      {block.isAccented && (
                        <g>
                          <circle
                            cx={blockX + 7}
                            cy={y + 11}
                            r={3.5}
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

          {/* Metric measure dividers */}
          {measureLineXs.map((mX, mIdx) => (
            <g key={`measure-${mIdx}`}>
              <line
                x1={mX}
                y1={16}
                x2={mX}
                y2={svgHeight - 16}
                stroke="#0f172a"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <text
                x={mX + 4}
                y={18}
                fill="#334155"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="700"
              >
                Bar {mIdx + 1}
              </text>
            </g>
          ))}

          {/* Real-time Hardware Playhead Cursor - Teleport without tweening on loop */}
          <g
            style={{
              transform: `translateX(${playheadProgress * svgWidth}px)`,
              transition: isLoopingRef.current ? 'none' : 'transform 0.05s linear',
            }}
          >
            <line
              x1={0}
              y1={10}
              x2={0}
              y2={svgHeight - 12}
              stroke="#0f172a"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <polygon
              points="-6,10 6,10 0,18"
              fill="#0f172a"
            />
            <polygon
              points={`-6,${svgHeight - 12} 6,${svgHeight - 12} 0,${svgHeight - 20}`}
              fill="#0f172a"
            />
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#c84b31]" />
          <span>
            {hoveredBlock ? (
              <span className="text-slate-900">
                Block: <strong className="text-[#c84b31]">{hoveredBlock.duration}</strong> units (ticks {hoveredBlock.startTick}–{hoveredBlock.startTick + hoveredBlock.duration})
                {hoveredBlock.isAccented ? ' • Accented Attack' : ''}
              </span>
            ) : (
              <span>Hover or tap any duration block to inspect exact time boundaries</span>
            )}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 sm:mt-0 font-bold">
          Playhead: <strong className="text-slate-900">{activeTick}</strong> / {totalLength} ticks
        </div>
      </div>
    </div>
  );
};
