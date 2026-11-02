import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  const base = {
    DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
    JWT_SECRET: 'segredo',
    GEMINI_API_KEY: 'chave',
  };

  it('lista todas as variáveis obrigatórias ausentes', () => {
    expect(() => validateEnv({ JWT_SECRET: 'x' })).toThrow(
      'DATABASE_URL, GEMINI_API_KEY',
    );
  });

  it('trata string vazia como ausente', () => {
    expect(() => validateEnv({ ...base, JWT_SECRET: '' })).toThrow(
      'JWT_SECRET',
    );
  });

  it('aplica valores padrão às opcionais', () => {
    expect(validateEnv(base)).toEqual(
      expect.objectContaining({
        PORT: '3001',
        JWT_EXPIRES_IN: '1d',
        CORS_ORIGIN: 'http://localhost:3000',
        GEMINI_MODEL: 'gemini-3.8-flash',
      }),
    );
  });

  it('mantém valores informados e substitui opcionais vazias', () => {
    const result = validateEnv({
      ...base,
      JWT_EXPIRES_IN: '2h',
      GEMINI_MODEL: '',
    });

    expect(result.JWT_EXPIRES_IN).toBe('2h');
    expect(result.GEMINI_MODEL).toBe('gemini-3.8-flash');
  });
});