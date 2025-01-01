import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <explanation>
import { HttpAdapterHost } from "@nestjs/core";

/**
 * Catches all exceptions thrown by the application and sends an appropriate HTTP response.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Creates an instance of `AllExceptionsFilter`.
   *
   * @param {HttpAdapterHost} httpAdapterHost - the HTTP adapter host
   */
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Catches an exception and sends an appropriate HTTP response.
   *
   * @param {*} exception - the exception to catch
   * @param {ArgumentsHost} host - the arguments host
   * @returns {void}
   */
  catch(exception: any, host: ArgumentsHost): void {
    // Log the exception.
    this.logger.error(exception);

    console.dir(exception);

    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest();
    // Construct the response body.
    const responseBody = {
      success: false,
      statusCode: httpStatus,
      error: exception.code,
      message: exception.message,
      description: exception.description,
      timestamp: new Date().toISOString(),
      traceId: request.id,
    };

    // Send the HTTP response.
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
