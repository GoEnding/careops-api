import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/** MySQL duplicate entry */
const ER_DUP_ENTRY = 1062;

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      response
        .status(status)
        .json(
          typeof body === 'object' && body !== null
            ? body
            : { statusCode: status, message: body },
        );
      return;
    }

    if (exception instanceof QueryFailedError) {
      const driverError = (exception as QueryFailedError & {
        driverError?: { errno?: number };
      }).driverError;
      if (driverError?.errno === ER_DUP_ENTRY) {
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: '이미 사용 중인 값입니다.',
        });
        return;
      }
    }

    this.logger.error(
      exception instanceof Error ? exception.stack : String(exception),
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '서버 오류가 발생했습니다.',
    });
  }
}
