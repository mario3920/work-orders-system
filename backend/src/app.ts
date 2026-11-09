import Fastify from 'fastify';
import { pool } from './db/connection.js';
import { usersRoutes } from './modules/users/usersRoutes.js';
import { employeesRoutes } from './modules/employees/employeesRoutes.js';
import { clientsRoutes } from './modules/clients/clientsRoutes.js';
import { serviceOrdersRoutes } from './modules/serviceOrders/serviceOrdersRoutes.js';
import { registerErrorHandler } from './errors/errorHandler.js';

export function buildApp() {
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

  app.register(usersRoutes, { prefix: '/api/users' });
  app.register(clientsRoutes, { prefix: '/api/clients' });
  app.register(employeesRoutes, { prefix: '/api/employees' });
  app.register(serviceOrdersRoutes, { prefix: '/api/orders' });

  return app;
}
