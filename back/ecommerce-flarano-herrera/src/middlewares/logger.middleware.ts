import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = req;
    
    // Log request
    this.logger.log(
      `Request: ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${headers['user-agent'] || 'Unknown'}`
    );

    // Intercept response
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      
      if (statusCode >= 400) {
        this.logger.error(
          `Response: ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`
        );
      } else {
        this.logger.log(
          `Response: ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`
        );
      }
    });

    next();
  }
}
