import React, { useState, useEffect } from 'react';

interface TerminalProps {
  data: object;
}

export const Terminal: React.FC<TerminalProps> = ({ data }) => {
  const [text, setText] = useState('');
  const fullText = JSON.stringify(data, null, 2);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setText((prev) => {
        if (prev.length >= fullText.length) {
          clearInterval(intervalId);
          return prev;
        }
        return prev + fullText.charAt(prev.length);
      });
    }, 20);

    return () => clearInterval(intervalId);
  }, [fullText]);

  return (
    <div className="w-full h-full rounded-md border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs font-mono text-zinc-500">config.json — ro@sys:~/</div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 font-mono text-xs sm:text-sm md:text-sm leading-relaxed overflow-auto flex-1">
        <pre className="text-zinc-300">
          <span className="text-purple-400">const</span>{' '}
          <span className="text-blue-400">engineer</span> = {text}
          <span className="animate-blink w-2 h-4 bg-zinc-400 inline-block align-middle ml-1"></span>
        </pre>
      </div>
    </div>
  );
};
