import React, { useState, useRef } from 'react';
import { ArchitectureNode } from '../types';

export const ArchitectureDiagram: React.FC<{ nodes: ArchitectureNode[] }> = ({ nodes }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setDragStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - dragStartX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const nodeWidth = 120;
  const nodeHeight = 40;
  const xGap = 50;
  const startXPos = 20;
  const centerY = 50;

  const totalWidth = startXPos + nodes.length * (nodeWidth + xGap);
  const height = 140;

  return (
    <div
      ref={scrollContainerRef}
      className="w-full relative overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      tabIndex={0}
      role="group"
      aria-label={`Architecture diagram, ${nodes.length} nodes, scrolls horizontally`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <svg width={Math.max(totalWidth, 200)} height={height} className="font-mono text-xs block">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" className="fill-zinc-300 dark:fill-zinc-600" />
          </marker>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.1" />
          </filter>
        </defs>

        {nodes.map((node, i) => {
          const x = startXPos + i * (nodeWidth + xGap);
          const y = centerY - nodeHeight / 2;
          const isLast = i === nodes.length - 1;
          const isHovered = hoveredIndex === i;

          return (
            <g
              key={i}
              className="group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Connection Line */}
              {!isLast && (
                <line
                  x1={x + nodeWidth}
                  y1={centerY}
                  x2={x + nodeWidth + xGap - 5}
                  y2={centerY}
                  className="stroke-zinc-200 dark:stroke-zinc-800 transition-colors"
                  strokeWidth="1.5"
                  markerEnd="url(#arrow)"
                  strokeDasharray="4 2"
                />
              )}

              {/* Node Rectangle */}
              <rect
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                rx="6"
                className={`
                          transition-all duration-200 
                          ${
                            isHovered
                              ? 'fill-zinc-50 dark:fill-zinc-900 stroke-emerald-500 dark:stroke-emerald-500 stroke-2'
                              : 'fill-white dark:fill-zinc-950 stroke-zinc-300 dark:stroke-zinc-700'
                          }
                        `}
                filter={isHovered ? 'url(#shadow)' : ''}
              />

              {/* Connection Points */}
              {!isLast && (
                <circle
                  cx={x + nodeWidth}
                  cy={centerY}
                  r="2"
                  className="fill-zinc-300 dark:fill-zinc-700"
                />
              )}
              {i > 0 && (
                <circle cx={x} cy={centerY} r="2" className="fill-zinc-300 dark:fill-zinc-700" />
              )}

              {/* Status Dot */}
              <circle
                cx={x + 12}
                cy={y + 12}
                r="3"
                className={`
                      ${
                        node.type === 'database'
                          ? 'fill-blue-500'
                          : node.type === 'service'
                            ? 'fill-emerald-500'
                            : node.type === 'gateway'
                              ? 'fill-orange-500'
                              : node.type === 'queue'
                                ? 'fill-purple-500'
                                : 'fill-zinc-500'
                      }
                    `}
              />

              {/* Label */}
              <text
                x={x + nodeWidth / 2}
                y={y + nodeHeight / 2}
                dy="0.3em"
                textAnchor="middle"
                className={`
                          pointer-events-none font-mono text-[10px] uppercase tracking-tight font-medium transition-colors
                          ${isHovered ? 'fill-zinc-900 dark:fill-zinc-100 font-bold' : 'fill-zinc-600 dark:fill-zinc-400'}
                        `}
              >
                {node.name}
              </text>

              {/* Info Icon (Visible on Hover) */}
              <g
                transform={`translate(${x + nodeWidth - 16}, ${y + 8})`}
                className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              >
                <circle r="6" cx="4" cy="4" className="fill-zinc-100 dark:fill-zinc-800" />
                <text
                  x="4"
                  y="4"
                  dy="0.3em"
                  textAnchor="middle"
                  className="text-[8px] font-bold fill-zinc-500"
                >
                  i
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 transition-all duration-200 ease-out"
          style={{
            left: `${startXPos + hoveredIndex * (nodeWidth + xGap) + nodeWidth / 2}px`,
            top: `${centerY + nodeHeight / 2 + 15}px`,
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-zinc-900 dark:border-b-zinc-100 mb-[-1px]"></div>
            <div className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[11px] px-3 py-2 rounded-md shadow-xl border border-zinc-700 dark:border-zinc-300 w-48 text-center">
              <div className="font-bold mb-1 font-mono uppercase text-emerald-400 dark:text-emerald-600 text-[10px]">
                {nodes[hoveredIndex].name}
              </div>
              <div className="text-zinc-300 dark:text-zinc-700 leading-snug font-sans">
                {nodes[hoveredIndex].details}
              </div>
              {nodes[hoveredIndex].type && (
                <div className="mt-2 pt-1 border-t border-zinc-700 dark:border-zinc-200 w-full text-[9px] text-zinc-500 dark:text-zinc-400 uppercase font-mono">
                  Type: {nodes[hoveredIndex].type}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
