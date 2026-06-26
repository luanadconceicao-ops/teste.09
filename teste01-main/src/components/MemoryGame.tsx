import React, { useState, useEffect } from 'react';
import './Games.css';

type Props = {
  onBack: () => void;
};

const emojis = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎬'];

export default function MemoryGame({ onBack }: Props) {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
      }
      setTimeout(() => setFlipped([]), 600);
      setMoves((prev) => prev + 1);
    }
  }, [flipped, cards, matched]);

  const handleCardClick = (id: number) => {
    if (flipped.includes(id) || matched.includes(id)) return;
    setFlipped([...flipped, id]);
  };

  const isWon = matched.length === cards.length;

  return (
    <div className="game-container">
      <button type="button" className="back-button" onClick={onBack}>
        ← Voltar
      </button>
      <h2>Jogo da Memória</h2>
      <p>Movimentos: {moves}</p>

      <div className="memory-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className="memory-card"
            onClick={() => handleCardClick(card.id)}
            disabled={isWon}
          >
            {flipped.includes(card.id) || matched.includes(card.id) ? card.emoji : '?'}
          </button>
        ))}
      </div>

      {isWon && (
        <div className="game-win">
          <h3>🎉 Você venceu!</h3>
          <p>Movimentos: {moves}</p>
          <button type="button" className="primary-button" onClick={() => window.location.reload()}>
            Jogar novamente
          </button>
        </div>
      )}
    </div>
  );
}
