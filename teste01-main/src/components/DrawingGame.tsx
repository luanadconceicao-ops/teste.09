import React, { useRef, useEffect, useState } from 'react';
import './Games.css';

type Props = {
  onBack: () => void;
};

export default function DrawingGame({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4CAF50');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([...history, imageData]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveHistory();

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    }

    ctx.lineWidth = brushSize;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
  };

  const undo = () => {
    if (history.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    const previousState = newHistory.pop();

    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
    } else {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    setHistory(newHistory);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = link;
    a.download = `drawing-${Date.now()}.png`;
    a.click();
    window.alert('Desenho salvo com sucesso! 🎨');
  };

  return (
    <div className="game-container">
      <div className="drawing-header">
        <button type="button" className="back-button" onClick={onBack}>
          ← Voltar
        </button>
        <h2>🎨 Desenho Criativo</h2>
      </div>

      <div className="drawing-toolbar">
        <div className="toolbar-section">
          <label>
            <span>Ferramenta:</span>
            <select value={tool} onChange={(e) => setTool(e.target.value as 'pen' | 'eraser')}>
              <option value="pen">✏️ Caneta</option>
              <option value="eraser">🧹 Borracha</option>
            </select>
          </label>
        </div>

        <div className="toolbar-section">
          <label>
            <span>Cor:</span>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} disabled={tool === 'eraser'} />
          </label>
        </div>

        <div className="toolbar-section">
          <label>
            <span>Tamanho: {brushSize}px</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="toolbar-section">
          <button type="button" className="toolbar-button" onClick={undo} disabled={history.length === 0}>
            ↶ Desfazer
          </button>
          <button type="button" className="toolbar-button" onClick={clearCanvas}>
            🗑️ Limpar
          </button>
          <button type="button" className="toolbar-button save" onClick={saveDrawing}>
            💾 Salvar
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={450}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className="drawing-tips">
        <p>💡 Dica: Use diferentes cores e tamanhos para criar um desenho único!</p>
      </div>
    </div>
  );
}
