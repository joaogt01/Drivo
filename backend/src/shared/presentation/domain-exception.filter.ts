import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../domain/domain-error';
import { DOMAIN_ERROR_STATUS } from './http-status.map';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const status = DOMAIN_ERROR_STATUS[error.code] ?? 400;

    host.switchToHttp().getResponse<Response>().status(status).json({
      statusCode: status,
      error: error.code,
      message: error.message,
    });
  }
}