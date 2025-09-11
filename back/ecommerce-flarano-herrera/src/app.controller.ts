import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Endpoint raíz de la API' })
  @ApiResponse({ 
    status: 200, 
    description: 'API funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        status: { type: 'string' },
        timestamp: { type: 'string' },
        version: { type: 'string' }
      }
    }
  })
  getRoot() {
    return {
      message: 'API de E-commerce funcionando correctamente',
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check de la aplicación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Aplicación saludable',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        uptime: { type: 'number' },
        timestamp: { type: 'string' }
      }
    }
  })
  getHealth() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
