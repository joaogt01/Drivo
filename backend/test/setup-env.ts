// O ConfigModule.forRoot valida ao importar o AppModule, antes de qualquer
// beforeAll. Por isso as variáveis precisam existir via setupFiles.
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ??= 'segredo-de-teste-e2e';
process.env.GEMINI_API_KEY ??= 'chave-gemini-de-teste';