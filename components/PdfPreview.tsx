'use client';

import { TextConfig } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Use local worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export function PdfPreview({ 
  eventId, 
  config 
}: { 
  eventId: string, 
  config: TextConfig, 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/events/${eventId}/preview?config=${encodeURIComponent(JSON.stringify(config))}`)
        .then(res => {
          if (res.ok) return res.arrayBuffer();
          throw new Error('Failed to generate preview');
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
    }, 800);

    return () => clearTimeout(timer);
  }, [eventId, config.x, config.y, config.fontSize, config.fontFamily, config.color]);

  return (
    <div className="relative border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900 w-full min-h-[400px] flex items-center justify-center transition-all duration-300">
      {loading && (
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm ${hasContent ? 'bg-black/50' : 'bg-zinc-900'}`}>
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <div className="text-blue-500 text-sm font-medium animate-pulse">Generating Preview...</div>
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto"
        style={{ display: hasContent ? 'block' : 'none' }}
      />
      
      {!hasContent && !loading && (
        <div className="text-zinc-500 flex flex-col items-center justify-center">
          <p>No template uploaded yet</p>
        </div>
      )}
    </div>
  );
}
