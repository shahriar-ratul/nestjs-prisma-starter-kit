import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: 200,
        success: true,
        data: data,
      })),
    );
  }
}

export interface Response<T> {
  statusCode: number;
  success: boolean;
  data: T;
}
