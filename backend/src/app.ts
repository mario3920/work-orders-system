import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { pool } from './db/connection.js';
import { authRoutes } from './auth/authRoutes.js';
import { usersRoutes } from './modules/users/usersRoutes.js';
import { employeesRoutes } from './modules/employees/employeesRoutes.js';
import { clientsRoutes } from './modules/clients/clientsRoutes.js';
import { serviceOrdersRoutes } from './modules/serviceOrders/serviceOrdersRoutes.js';
import { registerErrorHandler } from './errors/errorHandler.js';

export function buildApp() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || Buffer.byteLength(jwtSecret, 'utf8') < 32) {
    throw new Error('JWT_SECRET must be set to a secret of at least 32 bytes');
  }

  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
    ajv: {
      customOptions: {
        removeAdditional: false,
      },
    },
  });

  app.addHook('onClose', async () => {
    app.log.info('Closing database connection pool...');
    await pool.end();
  });

  app.get('/api/health', async () => {
    return { status: 'ok' };
  });

  registerErrorHandler(app);

  app.register(jwt, {
    secret: jwtSecret,
    sign: {
      algorithm: 'HS256',
      expiresIn: 3600,
    },
    verify: {
      algorithms: ['HS256'],
    },
  });

  app.register(usersRoutes, { prefix: '/api/users' });
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(clientsRoutes, { prefix: '/api/clients' });
  app.register(employeesRoutes, { prefix: '/api/employees' });
  app.register(serviceOrdersRoutes, { prefix: '/api/orders' });

  return app;
}
