import { jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CrlvController } from './crlv.controller';
import { CrlvService } from './crlv.service';

describe('CrlvController', () => {
  let controller: CrlvController;

  const crlvService = {
    extractData: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrlvController],
      providers: [
        {
          provide: CrlvService,
          useValue: crlvService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CrlvController>(CrlvController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('rejeita quando nenhum arquivo é enviado', async () => {
    await expect(
      controller.extract(undefined as unknown as Express.Multer.File),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(crlvService.extractData).not.toHaveBeenCalled();
  });

  it('encaminha o arquivo ao serviço e retorna os dados extraídos', async () => {
    const file = {
      originalname: 'crlv.pdf',
      mimetype: 'application/pdf',
      buffer: Buffer.from('teste'),
      size: 5,
    } as Express.Multer.File;

    const extractedData = {
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
    };

    crlvService.extractData.mockResolvedValue(extractedData);

    await expect(controller.extract(file)).resolves.toEqual(extractedData);
    expect(crlvService.extractData).toHaveBeenCalledWith(file);
  });

  it('propaga erros lançados pelo serviço', async () => {
    crlvService.extractData.mockRejectedValue(
      new Error('Falha simulada'),
    );

    await expect(
      controller.extract({
        buffer: Buffer.from('teste'),
        mimetype: 'application/pdf',
        size: 5,
      } as Express.Multer.File),
    ).rejects.toThrow('Falha simulada');
  });
});
