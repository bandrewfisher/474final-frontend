import React, { useRef, useState, useEffect } from 'react';

interface CanvasProps {
  className?: string;
}

const Canvas = ({ className }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paint, setPaint] = useState(false);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const getPosition = (canvas: HTMLCanvasElement, event: MouseEvent) => {
    setCoord({
      x: event.clientX - canvas.offsetLeft,
      y: event.clientY - canvas.offsetTop,
    });
  };

  const startPainting = (event: MouseEvent) => {
    if (!ctx) return;

    setPaint(true);
    getPosition(ctx.canvas, event);
  };

  const stopPainting = () => setPaint(false);

  const sketch = (event: MouseEvent) => {
    if (!paint || !ctx) return;
    ctx.beginPath();

    ctx.lineWidth = 5;

    // Sets the end of the lines drawn
    // to a round shape.
    ctx.lineCap = 'round';

    ctx.strokeStyle = 'green';

    // The cursor to start drawing
    // moves to this coordinate
    ctx.moveTo(coord.x, coord.y);

    // The position of the cursor
    // gets updated as we move the
    // mouse around.
    getPosition(ctx.canvas, event);

    // A line is traced from start
    // coordinate to this coordinate
    ctx.lineTo(coord.x, coord.y);

    // Draws the line.
    ctx.stroke();
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    setCtx(context);
  }, [canvasRef]);

  return (
    <canvas
      height="128"
      width="128"
      ref={canvasRef}
      className={`border border-solid border-black ${className}`}
      onMouseDown={e => startPainting(e.nativeEvent)}
      onMouseUp={stopPainting}
      onMouseMove={e => sketch(e.nativeEvent)}
    />
  );
};

Canvas.defaultProps = {
  className: '',
};

export default Canvas;
