const REQUIRED = ['DATABASE_URL', 'JWT_SECRET', 'GEMINI_API_KEY'] as const;

const DEFAULTS = {
  PORT: '3001',
  JWT_EXPIRES_IN: '1d',
  CORS_ORIGIN: 'http://localhost:3000',
  GEMINI_MODEL: 'gemini-3.8-flash',
} as const;

/**
 * Falha na inicialização se faltar variável obrigatória e aplica
 * valores padrão às opcionais. Valor vazio ("") conta como ausente,
 * o que acontece quando o docker-compose repassa uma variável não definida.
 */
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const missing = REQUIRED.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}.`,
    );
  }

  const withDefaults = Object.fromEntries(
    Object.entries(DEFAULTS).map(([key, fallback]) => [
      key,
      config[key] || fallback,
    ]),
  );

  return { ...config, ...withDefaults };
}