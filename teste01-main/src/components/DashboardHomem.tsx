import React from 'react';
import { HelpCircle, Puzzle } from 'lucide-react';
import { User } from '../services/api';
import './Dashboard.css';

type Props = {
  usuario: User;
  onLogout: () => void;
  onOpenGames: () => void;
};

export default function DashboardHomem({ usuario, onLogout, onOpenGames }: Props) {
  const jogos = [
    { id: 'quiz', Icon: HelpCircle, nome: 'Quiz da Floresta', desc: 'Teste seus conhecimentos' },
    { id: 'puzzle', Icon: Puzzle, nome: 'Quebra-cabeça', desc: 'Monte as peças' },
  ];

  return (
    <div className="screen dashboard-screen dashboard-homem-screen">
      <section className="header-card">
        <div className="header-card-top">
          <span className="section-label accent-label">Bem-vindo</span>
          <button onClick={onLogout} className="logout">
            Sair
          </button>
        </div>

        <div className="header-card-main">
          <div>
            <h2>Olá, {usuario.nome}!</h2>
            <p className="header-note">Seu espaço de jogos está pronto. Escolha um desafio e comece a jogar.</p>
          </div>
          <span className="badge convidado">Modo jogos</span>
        </div>
      </section>

      <section className="games-panel">
        <div className="games-panel-header">
          <div>
            <span className="section-label">Jogos</span>
            <h3 className="games-title">Selecione seu próximo jogo</h3>
          </div>
          <button type="button" className="games-cta" onClick={onOpenGames}>
            Ver todos os jogos
          </button>
        </div>

        <div className="games-card-grid">
          {jogos.map((jogo) => (
            <div key={jogo.id} className="game-card">
              <div className="icon">
                <jogo.Icon size={22} />
              </div>
              <div>
                <strong className="title">{jogo.nome}</strong>
                <p className="desc">{jogo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {usuario.tipo === 'convidado' && (
        <div className="convite-card convite-card-clean">
          <strong>Acesso de visitante</strong>
          <p>Você já pode jogar agora mesmo sem cadastro. Crie conta se quiser recursos extras de proteção.</p>
        </div>
      )}
    </div>
  );
}
