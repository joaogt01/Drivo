import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type } from '@google/genai';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export interface ExtractedCrlvData {
  brand: string;
  model: string;
  year: number | null;
  modelYear: number | null;
  plate: string;
  renavam: string;
  chassis: string;
  color: string;
  fuel: string;
  vehicleType: string;
}

@Injectable()
export class CrlvService {
  private readonly logger = new Logger(CrlvService.name);
  private readonly genAI: GoogleGenAI;

  constructor(configService: ConfigService) {
    this.genAI = new GoogleGenAI({
      apiKey: configService.getOrThrow<string>('GEMINI_API_KEY'),
    });
  }

  async extractData(
    file: Express.Multer.File,
  ): Promise<ExtractedCrlvData> {
    if (!file) {
      throw new BadRequestException('Envie um arquivo CRLV.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        'O arquivo deve ter no máximo 10 MB.',
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato inválido. Envie um PDF, JPEG, PNG ou WebP.',
      );
    }

    const prompt = `
Você é um assistente de extração de dados de documentos veiculares brasileiros.

Analise o arquivo fornecido e extraia somente informações que estejam
visíveis e legíveis no documento CRLV.

Regras:
- Não invente nem deduza informações ausentes.
- Para campos ausentes ou ilegíveis, retorne uma string vazia.
- "year" é o ano de fabricação.
- "modelYear" é o ano do modelo.
- Preserve os números de identificação exatamente como aparecem.
- Retorne apenas os campos solicitados no formato JSON.
- O documento pode conter dados pessoais. Não retorne nenhum campo
  pessoal além dos dados veiculares listados.
`;

    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: file.mimetype,
              data: file.buffer.toString('base64'),
            },
          },
          { text: prompt },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              brand: { type: Type.STRING },
              model: { type: Type.STRING },
              year: { type: Type.STRING },
              modelYear: { type: Type.STRING },
              plate: { type: Type.STRING },
              renavam: { type: Type.STRING },
              chassis: { type: Type.STRING },
              color: { type: Type.STRING },
              fuel: { type: Type.STRING },
              vehicleType: { type: Type.STRING },
            },
            required: [
              'brand',
              'model',
              'year',
              'modelYear',
              'plate',
              'renavam',
              'chassis',
              'color',
              'fuel',
              'vehicleType',
            ],
          },
        },
      });

      const text = response.text;

      if (!text) {
        throw new Error('O Gemini não retornou dados.');
      }

      const extracted = JSON.parse(text) as Record<string, unknown>;

      return {
        brand: this.stringValue(extracted.brand),
        model: this.stringValue(extracted.model),
        year: this.yearValue(extracted.year),
        modelYear: this.yearValue(extracted.modelYear),
        plate: this.stringValue(extracted.plate).toUpperCase(),
        renavam: this.stringValue(extracted.renavam),
        chassis: this.stringValue(extracted.chassis).toUpperCase(),
        color: this.stringValue(extracted.color),
        fuel: this.stringValue(extracted.fuel),
        vehicleType: this.stringValue(extracted.vehicleType),
      };
     } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      if (error instanceof Error) {
        this.logger.error(
          `Falha ao extrair CRLV: ${error.name}: ${error.message}`,
        );
      } else {
        this.logger.error(
          'Falha ao extrair CRLV: erro desconhecido.',
        );
      }

      throw new ServiceUnavailableException(
        'Não foi possível interpretar o documento. Tente novamente com uma imagem mais nítida ou um PDF legível.',
      );
    }
  }

  private stringValue(value: unknown): string {
    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  }

  private yearValue(value: unknown): number | null {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return null;
    }

    const parsed = Number(value);

    if (
      !Number.isInteger(parsed) ||
      parsed < 1900 ||
      parsed > new Date().getFullYear() + 2
    ) {
      return null;
    }

    return parsed;
  }
}
