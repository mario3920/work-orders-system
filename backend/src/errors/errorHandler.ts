import type { FastifyInstance, FastifyError } from 'fastify';
import { AppError } from './AppError.js';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode = error instanceof AppError
      ? error.statusCode
      : error.statusCode ?? 500;

    request.log.error(
      {
        err: error.message,
        statusCode,
        method: request.method,
        url: request.url,
      },
      'Request failed',
    );

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        message: 'Validation error',
        details: error.validation.map((validationError) => ({
          field: validationError.instancePath,
          message: validationError.message,
        })),
      });
    }

    return reply.status(statusCode).send({
      message: 'Internal server error',
    });
  });

  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      message: 'Route not found',
    });
  });
}