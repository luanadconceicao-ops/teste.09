import React, { useState, useEffect } from 'react';
import './Games.css';

type Props = {
  onBack: () => void;
};

interface PuzzlePiece {
  id: number;
  position: { x: number; y: number };
  placed: boolean;
}

const PUZZLE_SIZE = 16; // 4x4 puzzle
const emojis = ['🌿', '🌺', '🌸', '🌼', '🌻', '🌷', '🌹', '🏵️', '💐', '🎋', '🎍', '🍃', '🍀', '🌾', '🌱', '🌵'];

export default function PuzzleGame({ onBack }: Props) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [placed, setPlaced] = useState(0);
  const [totalPieces] = useState(PUZZLE_SIZE);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const newPieces = Array.from({ length: totalPieces }, (_, i) => ({
      id: i,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      placed: false,
    }));
    setPieces(newPieces);
  }, [totalPieces]);

  useEffect(() => {
    if (!started || placed === totalPieces) return;

    const interval = window.setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [started, placed, totalPieces]);

  const handleStartGame = () => {
    setStarted(true);
  };

  const handlePlacePiece = (id: number) => {
    if (!started) return;

    setPieces((prev) =>
      prev.map((piece) =>
        piece.id === id ? { ...piece, placed: true } : piece
      )
    );
    setPlaced((prev) => prev + 1);
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedPiece(id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPiece !== null) {
      handlePlacePiece(draggedPiece);
      setDraggedPiece(null);
    }
  };

  const isWon = started && placed === totalPieces;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      <div className="puzzle-header">
        <button type="button" className="back-button" onClick={onBack}>
          ← Voltar
        </button>
        <h2>🧩 Quebra-cabeça Floral</h2>
        {started && <p className="puzzle-timer">⏱️ {formatTime(time)}</p>}
      </div>

      {!started ? (
        <div className="puzzle-start-screen">
          <div className="puzzle-info">
            <h3>Bem-vindo ao Quebra-cabeça!</h3>
            <p>Você tem 16 peças florais para colocar no lugar certo.</p>
            <p className="puzzle-description">
              Clique ou arraste as peças da área de espera para os espaços do quebra-cabeça.
            </p>
            <div className="puzzle-difficulty">
              <p>Dificuldade: <strong>Intermediário</strong></p>
              <p>Peças: <strong>16 peças (4x4)</strong></p>
            </div>
            <button type="button" className="primary-button" onClick={handleStartGame}>
              🎮 Começar jogo
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="puzzle-progress">
            Peças colocadas: {placed} de {totalPieces}
          </p>

          <div className="puzzle-board" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            <div className="puzzle-canvas">
              {Array.from({ length: 4 }, (_, row) =>
                Array.from({ length: 4 }, (_, col) => {
                  const idx = row * 4 + col;
                  const piece = pieces[idx];
                  return (
                    <div key={`slot-${idx}`} className="puzzle-slot">
                      {piece?.placed && <span className="puzzle-piece">{emojis[idx]}</span>}
                    </div>
                  );
                })
              )}
            </div>

            <div className="puzzle-pieces">
              {pieces.map((piece) =>
                !piece.placed && (
                  <button
                    key={piece.id}
                    type="button"
                    className="puzzle-piece-btn"
                    onClick={() => handlePlacePiece(piece.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece.id)}
                  >
                    {emojis[piece.id]}
                  </button>
                )
              )}
            </div>
          </div>

          {isWon && (
            <div className="game-win">
              <h3>🎉 Parabéns!</h3>
              <p>Você completou o quebra-cabeça em {formatTime(time)}!</p>
              <div className="puzzle-stats">
                <p>Tempo: <strong>{formatTime(time)}</strong></p>
                <p>Peças: <strong>{totalPieces}</strong></p>
              </div>
              <button type="button" className="primary-button" onClick={() => window.location.reload()}>
                🔄 Jogar novamente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
