
import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CrlvService, ExtractedCrlvData } from './crlv.service';

@Controller('crlv')
@UseGuards(JwtAuthGuard)
export class CrlvController {
  constructor(private readonly crlvService: CrlvService) {}

  @Post('extract')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
      },
    }),
  )
  async extract(
  @UploadedFile() file: Express.Multer.File,
  ) : Promise<ExtractedCrlvData> {
    if (!file) {
      throw new BadRequestException('Envie um arquivo CRLV.');
    }

    return this.crlvService.extractData(file);
  }
}
