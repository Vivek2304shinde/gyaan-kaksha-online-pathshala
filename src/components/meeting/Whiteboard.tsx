
import { useState } from 'react';
import { WhiteboardProps } from './whiteboard/types';
import { useCanvas } from './whiteboard/useCanvas';
import { useDrawing } from './whiteboard/useDrawing';
import WhiteboardToolbar from './whiteboard/WhiteboardToolbar';

const Whiteboard: React.FC<WhiteboardProps> = ({ isTeacher }) => {
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [background, setBackground] = useState('blank');
  const [currentShape, setCurrentShape] = useState<any>(null);

  const {
    canvasRef,
    ctx,
    isDrawing,
    setIsDrawing,
    lastPoint,
    setLastPoint,
    applyBackground
  } = useCanvas(background);

  const {
    startDrawing: startDraw,
    draw: drawShape,
    endDrawing: endDraw,
    clearCanvas: clear
  } = useDrawing({
    ctx,
    tool,
    color,
    lineWidth,
    isTeacher
  });

  const handleStartDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    startDraw(e, setIsDrawing, setLastPoint, setCurrentShape);
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    drawShape(e, isDrawing, lastPoint, currentShape, setLastPoint, applyBackground, background);
  };

  const handleEndDrawing = () => {
    endDraw(setIsDrawing, setCurrentShape);
  };

  const handleClearCanvas = () => {
    clear(applyBackground, background);
  };

  return (
    <div className="flex flex-col h-full">
      {isTeacher && (
        <WhiteboardToolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          background={background}
          setBackground={setBackground}
          onClear={handleClearCanvas}
        />
      )}
      
      {!isTeacher && (
        <div className="bg-white border-b p-3">
          <p className="text-center text-neutral-dark">
            You are viewing the teacher's whiteboard
          </p>
        </div>
      )}
      
      <div className="flex-1 relative overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDraw}
          onMouseUp={handleEndDrawing}
          onMouseOut={handleEndDrawing}
          onTouchStart={handleStartDrawing}
          onTouchMove={handleDraw}
          onTouchEnd={handleEndDrawing}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
};

export default Whiteboard;
