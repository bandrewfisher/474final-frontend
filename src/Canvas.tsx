import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

interface CanvasProps {
  className?: string;
}

const Canvas = ({ className }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paint, setPaint] = useState(false);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);

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

  const stopPainting = async () => {
    setPaint(false);

    if (ctx) {
      const { data } = await axios.post('http://localhost:5000/recognize', {
        drawing: ctx.canvas.toDataURL(),
      });
      setGuesses(data);
    }
  };

  const sketch = (event: MouseEvent) => {
    if (!paint || !ctx) return;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = 'square';
    ctx.strokeStyle = 'black';
    ctx.moveTo(coord.x, coord.y);
    getPosition(ctx.canvas, event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.stroke();
    setGuesses([]);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    setCtx(context);
    context.beginPath();
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.stroke();
  }, [canvasRef]);

  return (
    <>
      <canvas
        height="128"
        width="128"
        ref={canvasRef}
        className={`border border-solid border-black ${className}`}
        onMouseDown={e => startPainting(e.nativeEvent)}
        onMouseUp={stopPainting}
        onMouseMove={e => sketch(e.nativeEvent)}
        onMouseLeave={stopPainting}
      />
      <button
        className="bg-blue-400 text-white rounded px-3 py-1"
        type="button"
        onClick={clearCanvas}
      >
        Clear
      </button>
      <div className="mt-3">
        {guesses.length === 0
          ? "Draw an image to see the model's prediction"
          : `Model's prediction: ${guesses[0]}`}
      </div>
    </>
  );
};

Canvas.defaultProps = {
  className: '',
};

export default Canvas;
