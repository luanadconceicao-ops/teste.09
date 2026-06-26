import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Award, ShieldCheck, Clock3, MapPin, ShieldAlert, Phone, Share2, Mail, MessageSquare, Clipboard, HelpCircle, Puzzle, Megaphone, X, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { User, TrustContact, validateInviteCode, sendEmergencyAlert } from '../services/api';
import './Dashboard.css';

type Props = {
  usuario: User;
  onLogout: () => void;
  onOpenGames: () => void;
};

function generateEmergencyCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generateInviteCode(email: string) {
  const hash = email
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(16)
    .slice(-6)
    .toUpperCase();
  return `CONV-${hash}`;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function DashboardMulher({ usuario, onLogout, onOpenGames }: Props) {
  const [denuncia, setDenuncia] = useState('');
  const [timer, setTimer] = useState(180);
  const [showTrophyPanel, setShowTrophyPanel] = useState(false);
  const [contactCode, setContactCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelationship, setContactRelationship] = useState<'amiga' | 'mãe' | 'irmã' | 'familiar' | 'outra'>('amiga');
  const [contacts, setContacts] = useState<TrustContact[]>([]);
  const [inviteMessage, setInviteMessage] = useState('');
  const [locationSharing, setLocationSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const emergencyCode = useMemo(() => generateEmergencyCode(), []);
  const inviteCode = useMemo(() => generateInviteCode(usuario.login), [usuario.login]);

  const jogos = [
    { id: 'quiz', Icon: HelpCircle, title: 'Quiz', desc: 'Teste seus conhecimentos' },
    { id: 'puzzle', Icon: Puzzle, title: 'Quebra-cabeça', desc: 'Monte as peças' },
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimer((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setInviteMessage('Geolocalização não suportada pelo navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({
          latitude,
          longitude,
          address: `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`,
        });
        setLocationSharing(true);
        setInviteMessage('Localização compartilhada com sucesso.');
      },
      () => {
        setInviteMessage('Permissão para acessar localização foi negada.');
      }
    );
  };

  const handleAddContact = () => {
    const cleanCode = contactCode.trim().toUpperCase();

    if (!cleanCode || !contactName.trim() || !contactPhone.trim()) {
      setInviteMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!validateInviteCode(cleanCode)) {
      setInviteMessage('Código de convite inválido. Formato esperado: CONV-XXXXXX');
      return;
    }

    if (contacts.some((contact) => contact.code === cleanCode)) {
      setInviteMessage('Este código já foi adicionado.');
      return;
    }

    const newContact: TrustContact = {
      id: Date.now().toString(),
      name: contactName.trim(),
      phone: contactPhone,
      relationship: contactRelationship,
      code: cleanCode,
    };

    setContacts((prev) => [...prev, newContact]);
    setInviteMessage(`Contato ${contactName} adicionado com sucesso.`);
    setContactCode('');
    setContactName('');
    setContactPhone('');
    setContactRelationship('amiga');
    setShowAddContactForm(false);
  };

  const handleRemoveContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
    setInviteMessage('Contato removido com sucesso.');
  };

  const handleEmergencyAlert = () => {
    if (contacts.length === 0) {
      setInviteMessage('Adicione contatos de confiança antes de enviar um alerta.');
      return;
    }

    const result = sendEmergencyAlert(usuario, contacts, currentLocation || undefined, emergencyMessage);

    if (result.success) {
      setAlertSent(true);
      setInviteMessage(`Alerta enviado para ${result.count} contato(s) com sucesso!`);
      setTimeout(() => setAlertSent(false), 5000);
    } else {
      setInviteMessage('Erro ao enviar alerta. Tente novamente.');
    }
  };

  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  return (
    <div className="screen dashboard-screen dashboard-mulher-screen">
      <header className="welcome-card header-smooth">
        <div className="welcome-avatar">
          <span>{usuario.nome.slice(0, 2).toUpperCase()}</span>
        </div>
        <div className="welcome-info">
          <p className="welcome-label">Olá, <span>{usuario.nome}</span></p>
          <h2>Bem-vinda de volta</h2>
          <p className="welcome-note">Sua conta está ativa e pronta para utilizar todos os recursos.</p>
          <div className="welcome-details">
            <div className="detail-pill">
              <span className="detail-title">Status</span>
              <strong>Conta ativa</strong>
            </div>
            <div className="detail-pill">
              <span className="detail-title">Pontuação</span>
              <strong>200 pontos</strong>
            </div>
          </div>
        </div>
        <div className="welcome-actions">
          <button type="button" className="logout secondary-button-alt" onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      <section className="section section-primary">
        <div className="section-top">
          <div>
            <p className="section-label">Jogos</p>
            <h3 className="section-title">Escolha seu próximo desafio</h3>
          </div>
          <button type="button" className="games-cta" onClick={() => onOpenGames()}>
            Ver todos
          </button>
        </div>

        <div className="games-grid">
          {jogos.map((jogo) => (
            <div key={jogo.id} className="game-card game-card-simple">
              <div className="card-icon"><jogo.Icon size={24} /></div>
              <div>
                <p className="card-label">{jogo.title}</p>
                <p className="card-desc">{jogo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-summary">
        <div className="status-card">
          <div>
            <p className="card-label">Troféu garantido</p>
            <h4>200 pontos</h4>
            <p className="card-desc">Acompanhe seu desempenho e veja mais recursos.</p>
          </div>
          <button type="button" className="secondary-button" onClick={() => setShowTrophyPanel((prev) => !prev)}>
            {showTrophyPanel ? 'Ocultar recursos' : 'Ver recursos'}
          </button>
        </div>
      </section>

      {showTrophyPanel && (
        <section className="section section-trophy-panel">
          <div className="section-header">
            <div>
              <p className="section-label">Recursos do Troféu</p>
              <h3 className="section-title">Central de suporte</h3>
              <p className="section-note">Acesse recursos e faça denúncias diretamente no painel do Troféu.</p>
            </div>
            <button type="button" className="secondary-button" onClick={() => setShowTrophyPanel(false)}>
              Fechar painel
            </button>
          </div>

          <div className="resources-grid">
            <div className="resource-card">
              <div className="card-heading">
                <p className="card-label">Código secreto</p>
                <span className="status-pill">Protegido</span>
              </div>
              <div className="resource-value">{emergencyCode}</div>
              <p className="card-desc">Compartilhe apenas com pessoas de confiança.</p>
            </div>
            <div className="resource-card">
              <div className="card-heading">
                <p className="card-label">Tempo protegido</p>
                <span className="status-pill">Ativo</span>
              </div>
              <div className="resource-value">{minutes}:{seconds}</div>
              <p className="card-desc">Seu recurso de tempo está em execução.</p>
            </div>
            <div className="resource-card">
              <div className="card-heading">
                <p className="card-label">Localização</p>
                <span className="status-pill">Referência</span>
              </div>
              <p className="card-desc">Rua João Silva, 123 · São Paulo - SP</p>
            </div>
            <div className="resource-card resource-alert-card">
              <div className="card-heading">
                <p className="card-label">Emergência</p>
                <span className="status-pill">Linha direta</span>
              </div>
              <p className="card-desc">Contato imediato com as autoridades em caso de risco.</p>
              <button 
                type="button" 
                className="alert-button" 
                onClick={() => {
                  if (contacts.length > 0) {
                    handleEmergencyAlert();
                  }
                  window.location.href = 'tel:190';
                }}
              >
                Ligar 190
              </button>
            </div>
          </div>

          <div className="invite-panel">
            <div className="invite-card">
              <div className="card-heading">
                <div>
                  <p className="card-label">Compartilhar com amigas</p>
                  <p className="card-desc">Envie seu código de convite exclusivo para convidar novas usuárias ao app.</p>
                </div>
                <span className="status-pill">{contacts.length} contatos</span>
              </div>

              <div className="invite-code-block">
                <div className="invite-code-label">Código de convite</div>
                <div className="invite-code-value">{inviteCode}</div>
                <div className="invite-code-actions">
                  <button type="button" className="secondary-button" onClick={() => {
                    navigator.clipboard.writeText(inviteCode);
                    setInviteMessage('Código copiado para a área de transferência.');
                  }}>
                    Copiar código
                  </button>
                  <button type="button" className="secondary-button" onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Convite Etervalis',
                        text: `Use meu código ${inviteCode} para se cadastrar no app.`,
                      }).catch(() => {
                        navigator.clipboard.writeText(inviteCode);
                        setInviteMessage('Compartilhamento nativo indisponível. Código copiado.');
                      });
                    } else {
                      navigator.clipboard.writeText(inviteCode);
                      setInviteMessage('Compartilhamento nativo não suportado. Código copiado.');
                    }
                  }}>
                    Compartilhar
                  </button>
                </div>
                {inviteMessage && <p className="invite-message">{inviteMessage}</p>}
              </div>
            </div>

            <div className="contacts-card">
              <div className="card-heading">
                <div>
                  <p className="card-label">Contatos de confiança</p>
                  <p className="card-desc">Adicione pessoas de confiança para receber alertas em caso de emergência.</p>
                </div>
              </div>

              {!showAddContactForm ? (
                <button
                  type="button"
                  className="secondary-button invite-add-button"
                  onClick={() => setShowAddContactForm(true)}
                >
                  <Plus size={18} /> Adicionar contato
                </button>
              ) : (
                <div className="invite-form-expanded">
                  <input
                    type="text"
                    className="invite-input"
                    placeholder="Nome do contato"
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                  />
                  <input
                    type="text"
                    className="invite-input"
                    placeholder="Telefone"
                    value={contactPhone}
                    onChange={(event) => setContactPhone(formatPhone(event.target.value))}
                  />
                  <select
                    className="invite-input"
                    value={contactRelationship}
                    onChange={(event) => setContactRelationship(event.target.value as any)}
                  >
                    <option value="amiga">Amiga</option>
                    <option value="mãe">Mãe</option>
                    <option value="irmã">Irmã</option>
                    <option value="familiar">Familiar</option>
                    <option value="outra">Outro vínculo</option>
                  </select>
                  <input
                    type="text"
                    className="invite-input"
                    placeholder="Código de convite (CONV-XXXXXX)"
                    value={contactCode}
                    onChange={(event) => setContactCode(event.target.value.toUpperCase())}
                  />
                  <div className="form-actions">
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleAddContact}
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setShowAddContactForm(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="contact-list">
                {contacts.length === 0 ? (
                  <div className="empty-contact-card">
                    <p>Nenhum contato adicionado ainda.</p>
                    <p>Adicione pessoas de confiança para receber alertas de emergência.</p>
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact.id} className="contact-row-expanded">
                      <div className="contact-info">
                        <div className="contact-avatar">{contact.name.slice(0, 2).toUpperCase()}</div>
                        <div>
                          <p className="contact-name">{contact.name}</p>
                          <p className="contact-detail"><Phone size={14} /> {contact.phone}</p>
                          <p className="contact-detail">Vínculo: {contact.relationship}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="contact-remove"
                        onClick={() => handleRemoveContact(contact.id)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="emergency-alert-section">
            <div className="emergency-card">
              <div className="card-heading">
                <div>
                  <p className="card-label">Alerta de emergência</p>
                  <p className="card-desc">Envie uma mensagem automática para seus contatos de confiança com sua localização.</p>
                </div>
              </div>

              <div className="emergency-form">
                <div className="location-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={locationSharing}
                      onChange={(e) => {
                        if (e.target.checked) {
                          requestLocation();
                        } else {
                          setLocationSharing(false);
                          setCurrentLocation(null);
                        }
                      }}
                    />
                    Compartilhar localização
                  </label>
                  {locationSharing && currentLocation && (
                    <p className="location-status">✓ Localização ativa: {currentLocation.address}</p>
                  )}
                </div>

                <textarea
                  className="denuncia-textarea"
                  placeholder="Mensagem de emergência (opcional)"
                  value={emergencyMessage}
                  onChange={(event) => setEmergencyMessage(event.target.value)}
                />

                <button
                  type="button"
                  className="alert-button emergency-alert-button"
                  onClick={handleEmergencyAlert}
                  disabled={contacts.length === 0}
                >
                  <AlertTriangle size={18} /> Enviar alerta de emergência
                </button>

                {alertSent && (
                  <div className="alert-success">
                    <CheckCircle size={18} /> Alerta enviado com sucesso para seus contatos!
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="trophy-support-grid">
            <div className="denuncia-card">
              <div className="card-heading">
                <p className="card-label">Denúncia rápida</p>
              </div>
              <p className="card-desc">Use este canal integrado ao Troféu para relatar sua situação com discrição.</p>
              <textarea
                className="denuncia-textarea denuncia-textarea-card"
                placeholder="Descreva sua situação..."
                value={denuncia}
                onChange={(event) => setDenuncia(event.target.value)}
              />
              <div className="support-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    if (!denuncia.trim()) {
                      window.alert('Descreva a denúncia antes de enviar.');
                      return;
                    }
                    window.alert('Denúncia enviada com sucesso! Obrigada pela sua coragem.');
                    setDenuncia('');
                  }}
                >
                  Enviar denúncia
                </button>
              </div>
            </div>

            <div className="support-summary-card">
              <div className="card-heading">
                <p className="card-label">Atalhos de apoio</p>
              </div>
              <p className="card-desc">Acesso rápido aos contatos essenciais de suporte.</p>
              <div className="quick-contacts quick-contacts-card">
                <button type="button" className="quick-contact" onClick={() => window.location.href = 'tel:180'}>
                  <span>Mulher</span>
                  <strong>180</strong>
                </button>
                <button type="button" className="quick-contact" onClick={() => window.location.href = 'tel:192'}>
                  <span>Ambulância</span>
                  <strong>192</strong>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
