import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      tap(data => {
        const log = {
          timestamp: new Date(startTime),
          remoteAddress: request.socket.remoteAddress,
          method: request.method,
          path: request.route.path,
          params: request.params,
          body: request.body,
          httpVersion: request.httpVersion,
          processingTime: `${Date.now() - startTime}ms`,
          response: {
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
            data: data,
          },
        };
        this.logger.log(JSON.stringify(log, null, 2));
      }),
      catchError(error => {
        const log = {
          timestamp: new Date(startTime),
          remoteAddress: request.socket.remoteAddress,
          method: request.method,
          path: request.route.path,
          params: request.params,
          body: request.body,
          httpVersion: request.httpVersion,
          error: error,
        };
        this.logger.error(log);
        throw new Error(error);
      })
    );
  }
}
