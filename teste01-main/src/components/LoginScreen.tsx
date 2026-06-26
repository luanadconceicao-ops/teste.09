import React, { useState } from 'react';
import { login } from '../services/api';
import logo from '../logo.png';
import './LoginScreen.css';

type Props = {
  onLogin: (user: ReturnType<typeof login> extends Promise<infer U> ? U : never) => void;
};

type Mode = 'login' | 'register' | 'recover';

export default function LoginScreen({ onLogin }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [loginText, setLoginText] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [genero, setGenero] = useState<'F' | 'M'>('M');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setError('');
    setMessage('');
    setLoginText('');
    setSenha('');
    setConfirmSenha('');
    setCodigo('');
    setNome('');
    setCpf('');
    setNascimento('');
    setGenero('M');
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const isValidCpf = (value: string) => {
    const cpfValue = value.replace(/\D/g, '');
    if (cpfValue.length !== 11 || /^([0-9])\1{10}$/.test(cpfValue)) return false;

    const calculateCheckDigit = (digits: number[], factor: number) => {
      const total = digits.reduce((sum, digit) => sum + digit * factor--, 0);
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const numbers = cpfValue.split('').map(Number);
    const firstCheck = calculateCheckDigit(numbers.slice(0, 9), 10);
    const secondCheck = calculateCheckDigit(numbers.slice(0, 10), 11);
    return numbers[9] === firstCheck && numbers[10] === secondCheck;
  };

  const isValidBirthDate = (value: string) => {
    if (!value) return false;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !Number.isNaN(date.getTime()) && date <= today;
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const normalizedLogin = loginText.trim();
    const normalizedSenha = senha.trim();

    if (!normalizedLogin || !normalizedSenha) {
      setError('Preencha e-mail/telefone e senha');
      return;
    }

    if (codigo === '180') {
      setError('Central 180: central180@mulheres.gov.br | Ligue 180');
      return;
    }
    if (codigo === '190') {
      setError('Alerta: Ajuda acionada! Permaneça calma.');
      return;
    }

    setLoading(true);
    try {
      const usuario = await login(normalizedLogin, normalizedSenha);
      onLogin(usuario);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!nome.trim() || !cpf || !nascimento || !loginText.trim() || !senha || !confirmSenha) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!isValidCpf(cpf)) {
      setError('CPF inválido. Verifique os números e tente novamente.');
      return;
    }

    if (!isValidBirthDate(nascimento)) {
      setError('Data de nascimento inválida ou futura. Escolha uma data passada.');
      return;
    }

    if (senha !== confirmSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setMessage('Conta criada com sucesso! Agora faça login.');
    setMode('login');
    setSenha('');
    setConfirmSenha('');
    setCpf('');
    setNascimento('');
  };

  const handleRecoverSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!loginText) {
      setError('Informe seu e-mail ou telefone para recuperar a senha');
      return;
    }

    setMessage('Enviamos um link de recuperação para o seu e-mail/telefone.');
    setMode('login');
    setLoginText('');
  };

  const entrarComoConvidado = () => {
    onLogin({
      id: 0,
      nome: 'Visitante',
      genero: 'M',
      login: 'convidado',
      senha: 'convidado',
      tipo: 'convidado'
    });
  };

  return (
    <div className="screen login-screen">
      <div className="card">
        <div className="login-header">
          <div className="logo-wrapper">
            <img src={logo} alt="Etervalis" className="login-logo" />
          </div>
          <div>
            <h1>Etervalis</h1>
          </div>
        </div>

        {message && <div className="info-message">{message}</div>}
        {error && <div className="error">{error}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              placeholder="Nome ou telefone"
              value={loginText}
              onChange={(event) => setLoginText(event.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
            />
            <input
              type="text"
              placeholder="Código de acesso (opcional)"
              value={codigo}
              onChange={(event) => setCodigo(event.target.value)}
            />
            <button type="submit" disabled={loading} className="primary-button">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
            <div className="form-row two-columns">
              <input
                type="text"
                placeholder="CPF"
                value={cpf}
                maxLength={14}
                onChange={(event) => setCpf(formatCpf(event.target.value))}
              />
              <input
                type="date"
                placeholder="Data de nascimento"
                value={nascimento}
                onChange={(event) => setNascimento(event.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <select value={genero} onChange={(event) => setGenero(event.target.value as 'F' | 'M')}>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
            </select>
            <input
              type="text"
              placeholder="E-mail ou telefone"
              value={loginText}
              onChange={(event) => setLoginText(event.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
            />
            <input
              type="password"
              placeholder="Confirme a senha"
              value={confirmSenha}
              onChange={(event) => setConfirmSenha(event.target.value)}
            />
            <button type="submit" className="primary-button">Criar conta</button>
          </form>
        )}

        {mode === 'recover' && (
          <form onSubmit={handleRecoverSubmit}>
            <input
              type="text"
              placeholder="E-mail ou telefone"
              value={loginText}
              onChange={(event) => setLoginText(event.target.value)}
            />
            <button type="submit" className="primary-button">Recuperar senha</button>
          </form>
        )}

        <div className="login-actions">
          {mode !== 'login' && (
            <button type="button" className="nav-button" onClick={() => { resetForm(); setMode('login'); }}>
              Voltar ao login
            </button>
          )}

          {mode === 'login' && (
            <>
              <button type="button" className="action-button accent" onClick={() => { resetForm(); setMode('register'); }}>
                Criar nova conta
              </button>
              <button type="button" className="action-button secondary" onClick={() => { resetForm(); setMode('recover'); }}>
                Esqueci minha senha
              </button>
            </>
          )}
        </div>

        <button className="guest-button" type="button" onClick={entrarComoConvidado}>
          Entrar como convidado
        </button>
      </div>
    </div>
  );
}
