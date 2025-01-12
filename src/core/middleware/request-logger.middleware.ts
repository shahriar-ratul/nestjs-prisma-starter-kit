import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction, response } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, body } = req;
    const requestStartTime = new Date().getTime();

    this.logger.log(`[REQ] ${method} ${originalUrl} ${JSON.stringify(body)}`);

    const originalResponseEndRef = res.end;
    const chunkBuffers: Buffer[] = [];

    res.end = (...chunks: any[]) => {
      for (const chunk of chunks) {
        if (chunk) chunkBuffers.push(Buffer.from(chunk));
      }
      return originalResponseEndRef.apply(res, chunks);
    };

    res.on("finish", () => {
      const statusCode = res.statusCode;
      const userAgent = req.get("user-agent") || "";
      const responseTime = new Date().getTime();
      const duration = responseTime - requestStartTime;

      try {
        let body = Buffer.concat(chunkBuffers).toString("utf8");
        if (body.endsWith("utf8")) {
          body = body.slice(0, -4);
        }

        if (statusCode === 401 || statusCode === 404 || statusCode === 405) {
          this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
        } else {
          this.logger.log(`[${req.method}] ${req.url} - ${statusCode}`);
          this.logger.log(`{
            method: ${method},
            ip: ${ip},
            originalUrl: ${originalUrl},
            url: ${req.url},
            statusCode: ${statusCode},
            userAgent: ${userAgent},
            duration: ${duration} ms,
            body: ${JSON.stringify(body)}
          }`);
        }
      } catch (error) {
        this.logger.warn(`Failed to parse response body: ${error}`);
      }
    });

    next();
  }
}
