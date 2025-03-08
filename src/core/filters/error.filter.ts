import { type ExceptionFilter, Catch, type ArgumentsHost } from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // console.log("exception", exception);
    // console.log("response", response);

    let message = exception.response?.message || null;

    if (!message) {
      message = exception.response;
    }

    if (!message) {
      message = exception.message;
    }

    // convert all message to array
    if (typeof message === 'string') {
      message = [message];
    }

    if (exception.status === 429) {
      message = 'Too many requests';
    }
    const errorResponse: Response<any> = {
      statusCode: exception.status || 500,
      success: false,
      error: exception.response?.error,
      message: message,
    };
    // console.log("errorResponse", errorResponse);
    response.status(exception.status || 500).json(errorResponse);
  }
}

export interface Response<T> {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
}
