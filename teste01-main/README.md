# Etervalis

Site de demonstração de permissões por gênero para TCC.

## Como rodar no navegador

1. Instale as dependências:

```bash
npm install
```

2. Inicie o app em modo web:

```bash
npm run dev
```

3. Abra o endereço exibido pelo Vite no navegador.

## Usuários de teste

- mulher@exemplo.com / 1234 → dashboard mulher
- homem@exemplo.com / 1234 → dashboard homem
- Entrar como convidado → dashboard homem (modo jogos)

## Observações

- Este projeto é um site React usando Vite.
- Não há banco de dados; o login é simulado em `src/services/api.ts`.
