import React from 'react';
import { User } from '../services/api';
import MemoryGame from './MemoryGame';
import QuizGame from './QuizGame';
import DrawingGame from './DrawingGame';
import PuzzleGame from './PuzzleGame';
import './Games.css';

type Props = {
  usuario: User;
  gameId: string;
  onBack: () => void;
};

export default function GameDetailScreen({ usuario, gameId, onBack }: Props) {
  switch (gameId) {
    case 'memoria':
      return <MemoryGame onBack={onBack} />;
    case 'quiz':
      return <QuizGame onBack={onBack} />;
    case 'desenho':
      return <DrawingGame onBack={onBack} />;
    case 'puzzle':
      return <PuzzleGame onBack={onBack} />;
    default:
      return (
        <div className="game-container">
          <button type="button" className="back-button" onClick={onBack}>
            ← Voltar
          </button>
          <h2>Jogo não encontrado</h2>
          <p>Por favor, selecione um jogo válido.</p>
        </div>
      );
  }
}
