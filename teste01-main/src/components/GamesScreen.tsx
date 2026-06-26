import React from 'react';
import { User } from '../services/api';
import './GamesScreen.css';

type Props = {
  usuario: User;
  onBack: () => void;
  onSelectGame: (gameId: string) => void;
};

const jogos = [
  { id: 'quiz', icon: '❓', nome: 'Quiz da Floresta', desc: 'Teste seus conhecimentos', cor: '#2196F3' },
  { id: 'puzzle', icon: '🧩', nome: 'Quebra-cabeça', desc: 'Monte as peças', cor: '#9C27B0' },
];

export default function GamesScreen({ usuario, onBack, onSelectGame }: Props) {
  return (
    <div className="screen games-screen">
      <div className="games-header">
        <button type="button" className="games-back" onClick={onBack}>
          ← Voltar
        </button>
        <div className="games-heading">
          <p className="section-label">Jogos</p>
          <h2>Selecione seu próximo jogo</h2>
          <p className="subtitle">Acesse rapidamente e divirta-se sem precisar criar conta</p>
        </div>
        <div style={{ width: 48 }} />
      </div>

      <div className="games-grid">
        {jogos.map((jogo) => (
          <button
            type="button"
            key={jogo.id}
            className="games-card"
            style={{
              '--card-color': jogo.cor,
              '--card-color-light': jogo.cor + '40',
              '--icon-bg': jogo.cor + '18',
              '--tag-bg': jogo.cor + '12',
              '--tag-color': jogo.cor,
            } as React.CSSProperties}
            onClick={() => onSelectGame(jogo.id)}
          >
            <div className="games-icon">{jogo.icon}</div>
            <div className="games-title">{jogo.nome}</div>
            <div className="games-desc">{jogo.desc}</div>
            <div className="games-tag">
              Jogar
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
