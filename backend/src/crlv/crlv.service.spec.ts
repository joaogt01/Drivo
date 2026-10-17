import { jest } from '@jest/globals';
import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const generateContentMock = jest.fn();

jest.unstable_mockModule('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: generateContentMock,
    },
  })),
  Type: {
    OBJECT: 'OBJECT',
    STRING: 'STRING',
  },
}));

describe('CrlvService', () => {
  let service: import('./crlv.service').CrlvService;

  const configService = {
    getOrThrow: jest.fn().mockReturnValue('test-api-key'),
  } as unknown as ConfigService;

  const validFile = {
    size: 1024,
    mimetype: 'application/pdf',
    buffer: Buffer.from('documento de teste'),
  } as Express.Multer.File;

  const validResponse = {
    brand: ' Toyota ',
    model: ' Corolla ',
    year: '2022',
    modelYear: '2023',
    plate: 'abc1d23',
    renavam: '12345678901',
    chassis: 'abcdefghijklmnopq',
    color: ' Prata ',
    fuel: 'Flex',
    vehicleType: 'Automóvel',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    generateContentMock.mockResolvedValue({
      text: JSON.stringify(validResponse),
    });

    service = new (await import('./crlv.service')).CrlvService(
      configService,
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('extrai e normaliza os dados retornados pela IA', async () => {
    const result = await service.extractData(validFile);

    expect(result).toEqual({
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      modelYear: 2023,
      plate: 'ABC1D23',
      renavam: '12345678901',
      chassis: 'ABCDEFGHIJKLMNOPQ',
      color: 'Prata',
      fuel: 'Flex',
      vehicleType: 'Automóvel',
    });

    expect(generateContentMock).toHaveBeenCalledTimes(1);
  });

  it('rejeita arquivo ausente', async () => {
    await expect(
      service.extractData(undefined as unknown as Express.Multer.File),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(generateContentMock).not.toHaveBeenCalled();
  });

  it('rejeita arquivo maior que 10 MB', async () => {
    await expect(
      service.extractData({
        ...validFile,
        size: 10 * 1024 * 1024 + 1,
      } as Express.Multer.File),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(generateContentMock).not.toHaveBeenCalled();
  });

  it('rejeita formato de arquivo não permitido', async () => {
    await expect(
      service.extractData({
        ...validFile,
        mimetype: 'text/plain',
      } as Express.Multer.File),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(generateContentMock).not.toHaveBeenCalled();
  });

  it('retorna null para anos inválidos', async () => {
    generateContentMock.mockResolvedValue({
      text: JSON.stringify({
        ...validResponse,
        year: '1800',
        modelYear: 'invalido',
      }),
    });

    const result = await service.extractData(validFile);

    expect(result.year).toBeNull();
    expect(result.modelYear).toBeNull();
  });

  it('retorna valores vazios para campos com tipos inesperados', async () => {
    generateContentMock.mockResolvedValue({
      text: JSON.stringify({
        ...validResponse,
        brand: 123,
        model: null,
      }),
    });

    const result = await service.extractData(validFile);

    expect(result.brand).toBe('');
    expect(result.model).toBe('');
  });

  it('trata resposta vazia da IA como indisponibilidade do serviço', async () => {
    generateContentMock.mockResolvedValue({ text: '' });

    await expect(
      service.extractData(validFile),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('trata erro da API ou JSON inválido como indisponibilidade', async () => {
    generateContentMock.mockRejectedValue(new Error('API indisponível'));

    await expect(
      service.extractData(validFile),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
