import { jest } from '@jest/globals';
import { ArgumentsHost } from '@nestjs/common';
import { DomainError } from '../domain/domain-error';
import { DomainExceptionFilter } from './domain-exception.filter';
import { DOMAIN_ERROR_STATUS } from './http-status.map';

class TestError extends DomainError {
  readonly code = 'TEST_ERROR';
  constructor() {
    super('falha de teste');
  }
}

describe('DomainExceptionFilter', () => {
  const json = jest.fn();
  const response = { status: jest.fn().mockReturnValue({ json }) };
  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;

  const filter = new DomainExceptionFilter();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete DOMAIN_ERROR_STATUS['TEST_ERROR'];
  });

  it('responde 400 quando o código não está mapeado', () => {
    filter.catch(new TestError(), host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'TEST_ERROR',
      message: 'falha de teste',
    });
  });

  it('usa o status mapeado para o código do erro', () => {
    DOMAIN_ERROR_STATUS['TEST_ERROR'] = 409;

    filter.catch(new TestError(), host);

    expect(response.status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 409, message: 'falha de teste' }),
    );
  });

  it('preserva o nome da classe no erro', () => {
    expect(new TestError().name).toBe('TestError');
  });
});