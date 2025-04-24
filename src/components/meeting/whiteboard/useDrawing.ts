
import { useCallback } from 'react';
import { Point, WhiteboardTool } from './types';

interface UseDrawingProps {
  ctx: CanvasRenderingContext2D | null;
  tool: WhiteboardTool;
  color: string;
  lineWidth: number;
  isTeacher: boolean;
}

export const useDrawing = ({
  ctx,
  tool,
  color,
  lineWidth,
  isTeacher
}: UseDrawingProps) => {
  const getPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = ctx?.canvas;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, [ctx]);

  const startDrawing = useCallback((
    e: React.MouseEvent | React.TouchEvent,
    setIsDrawing: (value: boolean) => void,
    setLastPoint: (point: Point) => void,
    setCurrentShape: (shape: any) => void
  ) => {
    if (!ctx || !isTeacher) return;
    
    const point = getPoint(e);
    setLastPoint(point);
    setIsDrawing(true);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (tool === 'pencil') {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    } else if (['rect', 'circle', 'line'].includes(tool)) {
      setCurrentShape({ start: point });
    }
  }, [ctx, isTeacher, tool, color, lineWidth, getPoint]);

  const draw = useCallback((
    e: React.MouseEvent | React.TouchEvent,
    isDrawing: boolean,
    lastPoint: Point,
    currentShape: any | null,
    setLastPoint: (point: Point) => void,
    applyBackground: (type: string) => void,
    background: string
  ) => {
    if (!ctx || !isDrawing || !isTeacher) return;
    
    const currentPoint = getPoint(e);
    
    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else if (['rect', 'circle', 'line'].includes(tool) && currentShape) {
      const { start } = currentShape;
      
      applyBackground(background);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      
      if (tool === 'rect') {
        ctx.rect(
          start.x,
          start.y,
          currentPoint.x - start.x,
          currentPoint.y - start.y
        );
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(currentPoint.x - start.x, 2) + Math.pow(currentPoint.y - start.y, 2)
        );
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
      } else if (tool === 'line') {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
      }
      
      ctx.stroke();
    }
    
    setLastPoint(currentPoint);
  }, [ctx, isTeacher, tool, color, lineWidth, getPoint]);

  const endDrawing = useCallback((
    setIsDrawing: (value: boolean) => void,
    setCurrentShape: (shape: any) => void
  ) => {
    if (!ctx || !isTeacher) return;
    ctx.closePath();
    setIsDrawing(false);
    setCurrentShape(null);
  }, [ctx, isTeacher]);

  const clearCanvas = useCallback((applyBackground: (type: string) => void, background: string) => {
    if (!ctx || !isTeacher || !ctx.canvas) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    applyBackground(background);
  }, [ctx, isTeacher]);

  return {
    startDrawing,
    draw,
    endDrawing,
    clearCanvas
  };
};
