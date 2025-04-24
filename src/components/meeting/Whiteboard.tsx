
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface WhiteboardProps {
  isTeacher: boolean;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ isTeacher }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [background, setBackground] = useState('blank');
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<any>(null);

  const colors = [
    '#000000', // Black
    '#F97316', // Saffron
    '#9B87F5', // Purple
    '#4F772D', // Green
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#F59E0B', // Yellow
  ];
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions to match its container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Clear and fill with white
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply background if needed
        applyBackground(background);
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    setCtx(context);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);
  
  // Apply background when it changes
  useEffect(() => {
    if (!ctx) return;
    applyBackground(background);
  }, [background, ctx]);
  
  const applyBackground = (type: string) => {
    if (!ctx || !canvasRef.current) return;
    
    const { width, height } = canvasRef.current;
    
    // Clear existing background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 0.5;
    
    switch (type) {
      case 'grid':
        // Draw grid
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
        // Draw lined paper
        const lineHeight = 30;
        ctx.beginPath();
        for (let y = lineHeight; y <= height; y += lineHeight) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
        break;
        
      case 'dots':
        // Draw dot grid
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
        // Draw graph paper
        const graphSize = 20;
        
        // Draw light grid
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
        
        // Draw darker grid for every 5 lines
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
        // Blank white background
        break;
    }
  };
  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
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
      // Store starting point for shape drawing
      setCurrentShape({ start: point });
    }
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx || !isDrawing || !isTeacher) return;
    
    const currentPoint = getPoint(e);
    
    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else if (['rect', 'circle', 'line'].includes(tool) && currentShape) {
      // For shapes, we'll preview the shape while dragging
      const { start } = currentShape;
      
      // Create a copy of the canvas to preserve existing drawings
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Restore the canvas to its state before this shape preview
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
  };
  
  const endDrawing = () => {
    if (!ctx || !isTeacher) return;
    ctx.closePath();
    setIsDrawing(false);
    setCurrentShape(null);
  };
  
  const getPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };
  
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current || !isTeacher) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    applyBackground(background);
  };

  return (
    <div className="flex flex-col h-full">
      {isTeacher && (
        <div className="bg-white border-b flex flex-wrap items-center p-2 gap-2">
          <Tabs defaultValue="draw" className="w-auto">
            <TabsList>
              <TabsTrigger value="draw">Draw</TabsTrigger>
              <TabsTrigger value="shapes">Shapes</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
            </TabsList>
            
            <TabsContent value="draw" className="flex items-center space-x-2 pt-2">
              <ToggleGroup type="single" value={tool} onValueChange={(val) => val && setTool(val)}>
                <ToggleGroupItem value="pencil" aria-label="Pencil">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </ToggleGroupItem>
                <ToggleGroupItem value="eraser" aria-label="Eraser">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
                </ToggleGroupItem>
              </ToggleGroup>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm">Size:</span>
                <Slider
                  value={[lineWidth]}
                  min={1}
                  max={20}
                  step={1}
                  className="w-32"
                  onValueChange={(vals) => setLineWidth(vals[0])}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-8 h-8 p-0" style={{ backgroundColor: color }}>
                    <span className="sr-only">Open color picker</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-2">
                  <div className="grid grid-cols-7 gap-2">
                    {colors.map((c) => (
                      <Button
                        key={c}
                        className="w-6 h-6 p-0 rounded-md"
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                      >
                        <span className="sr-only">Select color {c}</span>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </TabsContent>
            
            <TabsContent value="shapes" className="flex items-center space-x-2 pt-2">
              <ToggleGroup type="single" value={tool} onValueChange={(val) => val && setTool(val)}>
                <ToggleGroupItem value="line" aria-label="Line">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                </ToggleGroupItem>
                <ToggleGroupItem value="rect" aria-label="Rectangle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
                </ToggleGroupItem>
                <ToggleGroupItem value="circle" aria-label="Circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                </ToggleGroupItem>
              </ToggleGroup>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm">Size:</span>
                <Slider
                  value={[lineWidth]}
                  min={1}
                  max={20}
                  step={1}
                  className="w-32"
                  onValueChange={(vals) => setLineWidth(vals[0])}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-8 h-8 p-0" style={{ backgroundColor: color }}>
                    <span className="sr-only">Open color picker</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-2">
                  <div className="grid grid-cols-7 gap-2">
                    {colors.map((c) => (
                      <Button
                        key={c}
                        className="w-6 h-6 p-0 rounded-md"
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                      >
                        <span className="sr-only">Select color {c}</span>
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </TabsContent>
            
            <TabsContent value="background" className="flex items-center space-x-2 pt-2">
              <ToggleGroup type="single" value={background} onValueChange={(val) => val && setBackground(val)}>
                <ToggleGroupItem value="blank" aria-label="Blank">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Grid">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
                </ToggleGroupItem>
                <ToggleGroupItem value="lines" aria-label="Lines">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M8 4v16"/><path d="M16 4v16"/></svg>
                </ToggleGroupItem>
                <ToggleGroupItem value="dots" aria-label="Dots">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="5" r="1"/><circle cx="19" cy="19" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="19" r="1"/></svg>
                </ToggleGroupItem>
                <ToggleGroupItem value="graph" aria-label="Graph">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </ToggleGroupItem>
              </ToggleGroup>
            </TabsContent>
          </Tabs>
          
          <div className="ml-auto">
            <Button variant="outline" onClick={clearCanvas}>
              Clear Canvas
            </Button>
          </div>
        </div>
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
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
};

export default Whiteboard;
