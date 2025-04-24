
import { useRef, useState, useEffect } from 'react';
import { BackgroundType, Point } from './types';

export const useCanvas = (background: BackgroundType) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        applyBackground(background);
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    setCtx(context);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const applyBackground = (type: BackgroundType) => {
    if (!ctx || !canvasRef.current) return;
    
    const { width, height } = canvasRef.current;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 0.5;
    
    switch (type) {
      case 'grid':
        const gridSize = 20;
        ctx.beginPath();
        for (let x = 0; x <= width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
        break;
        
      case 'lines':
        const lineHeight = 30;
        ctx.beginPath();
        for (let y = lineHeight; y <= height; y += lineHeight) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
        break;
        
      case 'dots':
        const dotSpacing = 20;
        const dotSize = 1;
        ctx.fillStyle = '#E5E7EB';
        for (let x = dotSpacing; x <= width; x += dotSpacing) {
          for (let y = dotSpacing; y <= height; y += dotSpacing) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
        
      case 'graph':
        const graphSize = 20;
        
        ctx.beginPath();
        for (let x = 0; x <= width; x += graphSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += graphSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
        
        ctx.strokeStyle = '#D1D5DB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= width; x += graphSize * 5) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += graphSize * 5) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
        break;
      
      default:
        break;
    }
  };

  useEffect(() => {
    if (!ctx) return;
    applyBackground(background);
  }, [background, ctx]);

  return {
    canvasRef,
    ctx,
    isDrawing,
    setIsDrawing,
    lastPoint,
    setLastPoint,
    applyBackground
  };
};
