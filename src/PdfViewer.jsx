// src/PdfViewer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Import the worker that matches your installed pdfjs-dist
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function PdfViewer({ pdfPath, className = 'h-64 w-full', maxWidth = 800 }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(300);
  const [error, setError] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const target = Math.min(cw, maxWidth);
      setWidth(Math.max(200, target));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [maxWidth]);

  if (error) {
    return (
      <div ref={containerRef} className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-red-500">Failed to load PDF preview</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${className} flex items-center justify-center bg-gray-100 relative overflow-hidden`}>
      <Document
        file={pdfPath}
        loading={<div className="text-gray-500">Loading PDF...</div>}
        noData={<div className="text-gray-500">No PDF file</div>}
        onLoadError={(err) => { console.error('react-pdf load error:', err); setError(true); }}
        onSourceError={(err) => { console.error('react-pdf source error:', err); setError(true); }}
      >
        <Page
          pageNumber={1}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}
