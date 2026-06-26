import React, { useEffect, useState } from 'react';
import LoginScreen from './components/LoginScreen';
import DashboardMulher from './components/DashboardMulher';
import DashboardHomem from './components/DashboardHomem';
import GamesScreen from './components/GamesScreen';
import GameDetailScreen from './components/GameDetailScreen';
import SplashScreen from './components/SplashScreen';
import { User } from './services/api';

export default function App() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [screen, setScreen] = useState<'splash' | 'login' | 'mulher' | 'homem' | 'games' | 'game'>('splash');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleLogin = (user: User) => {
    setUsuario(user);
    if (user.genero === 'F') {
      setScreen('mulher');
    } else {
      setScreen('homem');
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setScreen('login');
    setSelectedGame(null);
  };

  const handleOpenGames = () => {
    setScreen('games');
  };

  const handleSelectGame = (gameId: string) => {
    setSelectedGame(gameId);
    setScreen('game');
  };

  const handleBackToDashboard = () => {
    if (!usuario) {
      setScreen('login');
      return;
    }
    setScreen(usuario.genero === 'F' ? 'mulher' : 'homem');
    setSelectedGame(null);
  };

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setScreen('login');
    }, 2600);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      {screen === 'splash' && <SplashScreen />}
      {screen === 'login' && <LoginScreen onLogin={handleLogin} />}
      {screen === 'mulher' && usuario && (
        <DashboardMulher usuario={usuario} onLogout={handleLogout} onOpenGames={handleOpenGames} />
      )}
      {screen === 'homem' && usuario && (
        <DashboardHomem usuario={usuario} onLogout={handleLogout} onOpenGames={handleOpenGames} />
      )}
      {screen === 'games' && usuario && (
        <GamesScreen usuario={usuario} onBack={handleBackToDashboard} onSelectGame={handleSelectGame} />
      )}
      {screen === 'game' && usuario && selectedGame && (
        <GameDetailScreen usuario={usuario} gameId={selectedGame} onBack={handleBackToDashboard} />
      )}
    </div>
  );
}
