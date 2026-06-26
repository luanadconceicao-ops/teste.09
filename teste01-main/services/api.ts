type User = {
  id: number;
  nome: string;
  genero: 'F' | 'M';
  tipo?: 'convidado';
  login: string;
  senha: string;
};

const users: User[] = [
  {
    id: 1,
    nome: 'Maria',
    genero: 'F',
    login: 'mulher@exemplo.com',
    senha: '1234',
  },
  {
    id: 2,
    nome: 'João',
    genero: 'M',
    login: 'homem@exemplo.com',
    senha: '1234',
  },
];

const api = {
  post: async (path: string, body: { login: string; senha: string }) => {
    return new Promise<{ data: { id: number; nome: string; genero: 'F' | 'M' } }>((resolve, reject) => {
      setTimeout(() => {
        if (path === '/auth/login') {
          const user = users.find(
            (item) => item.login.toLowerCase() === body.login.toLowerCase() && item.senha === body.senha
          );

          if (!user) {
            reject({ response: { data: { error: 'Usuário não encontrado ou senha inválida' } } });
            return;
          }

          resolve({ data: { id: user.id, nome: user.nome, genero: user.genero } });
          return;
        }

        reject({ response: { data: { error: 'Rota não encontrada' } } });
      }, 600);
    });
  },
};

export default api;
