'use client';

import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export function PdfCanvasViewer({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    setLoading(true);
    setHasContent(false);

    fetch(src)
      .then(res => {
        if (res.ok) return res.arrayBuffer();
        throw new Error('Failed to load PDF');
      })
      .then(async (buffer) => {
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 2 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport } as any).promise;
        setHasContent(true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [src]);

  return (
    <div className="relative w-full min-h-[400px] flex items-center justify-center bg-zinc-900 rounded-md overflow-hidden transition-all duration-300">
      {loading && (
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm ${hasContent ? 'bg-black/50' : 'bg-zinc-900'}`}>
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <div className="text-blue-500 text-sm font-medium animate-pulse">Loading PDF...</div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        style={{ display: hasContent ? 'block' : 'none' }}
      />
      {!hasContent && !loading && (
        <div className="text-zinc-500 text-center">Failed to load PDF</div>
      )}
    </div>
  );
}
