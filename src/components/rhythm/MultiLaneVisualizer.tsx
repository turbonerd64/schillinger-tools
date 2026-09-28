import React, { useRef, useState, useEffect } from 'react';
import { ResultantOutput, DurationBlock } from '../../core/rhythm/types';
import { Eye, Info, Sparkles } from 'lucide-react';

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
    if (playheadProgress < prevProgressRef.current && prevProgressRef.current > 0.5) {
      isLoopingRef.current = true;
    } else {
      isLoopingRef.current = false;
    }
    prevProgressRef.current = playheadProgress;
  }, [playheadProgress]);

  const { totalLength, lanes, measureBars, mode } = resultant;

  // Visual layout dimensions
  const laneHeight = 56;
  const laneGap = 14;
  const numLanes = lanes.length;
  // Dynamic tick width
  const tickWidth = Math.max(46, Math.min(76, 920 / totalLength));
  const svgWidth = totalLength * tickWidth;
  const svgHeight = numLanes * (laneHeight + laneGap) + 42;

  const measureLineXs = measureBars.map((barTick) => barTick * tickWidth);

  const allCutTicks = Array.from(
    new Set(lanes.flatMap((l) => l.attackTicks))
  ).sort((x, y) => x - y);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-[#c84b31]" />
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Rhythm Architecture &amp; Resultant Wave
              <span className="text-xs font-mono text-slate-800 bg-[#fdf0ec] px-2.5 py-0.5 rounded-full border border-[#c84b31]/40 font-bold">
                {mode === 'fractioned' ? 'Fractioned Model' : mode === 'trinomial' ? '3-Part Model' : 'Binary Model'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              Interference of independent periodicities generating the resultant rhythm
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-sky-600"></span>
            <span className="text-slate-800">Gen a</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-600"></span>
            <span className="text-slate-800">Gen b</span>
          </div>
          {mode === 'trinomial' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-purple-600"></span>
              <span className="text-slate-800">Gen c</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#c84b31]"></span>
            <span className="text-slate-900">Resultant r</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#c84b31]">
            <span className="px-1.5 py-0.5 text-xs bg-[#fdf0ec] border-2 border-[#c84b31] rounded-md font-extrabold">
              &gt;
            </span>
            <span>Accent</span>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Graph Viewport - CENTERED */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto rounded-xl bg-slate-50 border-2 border-slate-300 p-4 select-none flex justify-center items-center"
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
                  strokeWidth={tick % 4 === 0 ? 2 : 1}
                  strokeDasharray={tick % 4 === 0 ? undefined : '2,2'}
                />
                <text
                  x={x}
                  y={svgHeight - 4}
                  fill="#475569"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="700"
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
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="3,3"
                opacity={0.5}
              />
            );
          })}

          {/* Lanes and Duration Blocks */}
          {lanes.map((lane, laneIdx) => {
            const y = 24 + laneIdx * (laneHeight + laneGap);
            const isResultant = lane.id === 'resultant';
            const baseColor =
              lane.color ||
              (lane.id === 'a'
                ? '#0284c7'
                : lane.id.startsWith('b')
                ? '#e11d48'
                : lane.id === 'c'
                ? '#7c3aed'
                : '#c84b31');

            return (
              <g key={lane.id}>
                {/* Lane Track Background */}
                <rect
                  x={0}
                  y={y}
                  width={svgWidth}
                  height={laneHeight}
                  rx={10}
                  fill="#ffffff"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                />

                {/* Lane Label */}
                <text
                  x={8}
                  y={y - 6}
                  fill="#0f172a"
                  fontSize="13"
                  fontWeight="800"
                  fontFamily="monospace"
                >
                  {lane.name}
                </text>

                {/* Blocks */}
                {lane.blocks.map((block, bIdx) => {
                  const blockX = block.startTick * tickWidth;
                  const blockW = Math.max(6, block.duration * tickWidth - 3);
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
                        rx={8}
                        fill={baseColor}
                        fillOpacity={isBlockActive ? 1.0 : isHovered ? 0.95 : isResultant ? 0.9 : 0.75}
                        stroke={isBlockActive ? '#0f172a' : baseColor}
                        strokeWidth={isBlockActive ? 3 : 1}
                      />

                      {/* Integer duration label inside block */}
                      {blockW > 18 && (
                        <text
                          x={blockX + blockW / 2}
                          y={y + laneHeight / 2 + 5}
                          fill="#ffffff"
                          fontSize="16"
                          fontWeight="900"
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
                            cx={blockX + 9}
                            cy={y + 13}
                            r={4}
                            fill="#ffffff"
                          />
                          <text
                            x={blockX + 20}
                            y={y + 18}
                            fill="#ffffff"
                            fontSize="15"
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
                strokeWidth={3}
                strokeLinecap="round"
              />
              <text
                x={mX + 6}
                y={18}
                fill="#0f172a"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="800"
              >
                Bar {mIdx + 1}
              </text>
            </g>
          ))}

          {/* Real-time Hardware Playhead Cursor - Instant teleport on wrap */}
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
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <polygon
              points="-8,10 8,10 0,20"
              fill="#0f172a"
            />
            <polygon
              points={`-8,${svgHeight - 12} 8,${svgHeight - 12} 0,${svgHeight - 22}`}
              fill="#0f172a"
            />
          </g>
        </svg>
      </div>

      {/* Footer Info with larger text */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm font-mono text-slate-700 bg-slate-100 p-3.5 rounded-xl border border-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#c84b31]" />
          <span>
            {hoveredBlock ? (
              <span className="text-slate-900 font-bold">
                Selected Block: <strong className="text-[#c84b31]">{hoveredBlock.duration}</strong> units (ticks {hoveredBlock.startTick}–{hoveredBlock.startTick + hoveredBlock.duration})
                {hoveredBlock.isAccented ? ' • Accented Attack (Coincidence of Phase)' : ''}
              </span>
            ) : (
              <span>Hover or tap any duration block to inspect exact time boundaries</span>
            )}
          </span>
        </div>
        <div className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-0 font-bold">
          Playhead: <strong className="text-slate-900">{activeTick}</strong> / {totalLength} ticks
        </div>
      </div>
    </div>
  );
};
