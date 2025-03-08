import { type ArgumentsHost, Catch, type ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { BadRequestException } from '../exceptions/bad-request.exception';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: ValidationError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;

    // Extract all validation error messages
    const errorMessages = this.extractErrors(exception);
    const path = httpAdapter.getRequestUrl(request);

    // Create a custom error response
    const err = BadRequestException.VALIDATION_ERROR('Validation errors occurred');
    const responseBody = {
      success: false,
      statusCode: httpStatus,
      description: err.description,
      message: errorMessages,
      timestamp: new Date().toISOString(),
      traceId: request.id, // Ensure `traceId` exists in the request
      path,
    };

    // Log the validation errors and the request path
    this.logger.verbose(`Validation errors: ${errorMessages.join(', ')}`);
    this.logger.verbose(`Request path: ${path}`);

    // Send the custom error response
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  /**
   * Recursively extracts all validation error messages.
   * @param exception - The validation error object.
   * @returns An array of error messages.
   */
  private extractErrors(exception: ValidationError): string[] {
    const errors: string[] = [];

    if (exception.constraints) {
      // Add all constraint messages
      errors.push(...Object.values(exception.constraints));
    }

    if (exception.children && exception.children.length > 0) {
      // Recursively extract errors from child validations
      for (const child of exception.children) {
        errors.push(...this.extractErrors(child));
      }
    }

    return errors;
  }
}
