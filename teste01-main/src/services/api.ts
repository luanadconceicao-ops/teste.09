export type TrustContact = {
  id: string;
  name: string;
  phone: string;
  relationship: 'amiga' | 'mãe' | 'irmã' | 'familiar' | 'outra';
  code: string;
};

export type User = {
  id: number;
  nome: string;
  genero: 'F' | 'M';
  tipo?: 'convidado';
  login: string;
  senha: string;
  phone?: string;
  trustContacts?: TrustContact[];
  emergencyAlerts?: Array<{ date: string; status: string }>;
  locationSharing?: boolean;
};

const users: User[] = [
  {
    id: 1,
    nome: 'Maria',
    genero: 'F',
    login: 'mulher@exemplo.com',
    senha: '1234',
    phone: '(11) 98765-4321',
    trustContacts: [],
    emergencyAlerts: [],
    locationSharing: false,
  },
  {
    id: 2,
    nome: 'João',
    genero: 'M',
    login: 'homem@exemplo.com',
    senha: '1234',
  },
];

export async function login(login: string, senha: string): Promise<User> {
  const normalizedLogin = login.trim().toLowerCase();
  const normalizedSenha = senha.trim();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (item) => item.login.toLowerCase() === normalizedLogin && item.senha === normalizedSenha
      );
      if (!user) {
        reject(new Error('Usuário não encontrado ou senha inválida'));
        return;
      }
      resolve(user);
    }, 500);
  });
}

export function validateInviteCode(code: string): boolean {
  const cleanCode = code.trim().toUpperCase();
  return /^CONV-[A-F0-9]{6}$/.test(cleanCode);
}

export function sendEmergencyAlert(
  usuario: User,
  contacts: TrustContact[],
  location?: { latitude: number; longitude: number; address: string },
  message?: string
): { success: boolean; count: number; timestamp: string } {
  const timestamp = new Date().toLocaleString('pt-BR');
  const baseMessage = message || 'Estou em uma situação de emergência e preciso de ajuda.';

  const messageBody = `
${baseMessage}

📍 Localização: ${location?.address || 'Localização não disponível'}
${location ? `🗺️ Mapa: https://maps.google.com/?q=${location.latitude},${location.longitude}` : ''}
📱 Telefone: ${usuario.phone || 'Não informado'}
🕐 Data/Hora: ${timestamp}

Por favor, entre em contato comigo o mais rápido possível.
  `;

  if (contacts.length === 0) {
    return { success: false, count: 0, timestamp };
  }

  contacts.forEach((contact) => {
    const whatsappMessage = encodeURIComponent(messageBody);
    const phoneNumber = contact.phone.replace(/\D/g, '');
    console.log(`[ALERTA ENVIADO] Para: ${contact.name} (${contact.phone})`);
    console.log(`Mensagem: ${messageBody}`);
  });

  if (usuario.emergencyAlerts) {
    usuario.emergencyAlerts.push({ date: timestamp, status: 'Alerta enviado' });
  }

  return { success: true, count: contacts.length, timestamp };
}
