/**
 * Base de todos os erros de negócio. Não depende de HTTP.
 * A tradução para status HTTP acontece na camada de apresentação
 * (DomainExceptionFilter).
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}