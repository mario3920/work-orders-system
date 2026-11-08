import type { FastifyInstance } from 'fastify';
import * as serviceOrdersService from './serviceOrdersServices.js';
import { createServiceOrderSchema } from './schemas/createServiceOrder.schema.js';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { updateServiceOrderSchema } from './schemas/updateServiceOrder.schema.js';
import { serviceOrderParamsSchema } from './schemas/serviceOrderParams.schema.js';
import { listServiceOrdersSchema } from './schemas/listServiceOrders.schema.js';

export async function serviceOrdersRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<JsonSchemaToTsProvider>();

  server.post(
    '/',
    { schema: createServiceOrderSchema },
    async (request, reply) => {
      const order = await serviceOrdersService.createServiceOrder(request.body);

      return reply.status(201).send(order);
    },
  );

  server.get('/', { schema: listServiceOrdersSchema }, async () => {
    return serviceOrdersService.getAllServiceOrders();
  });

  server.get('/:id', { schema: serviceOrderParamsSchema }, async (request) => {

    const id = Number(request.params.id);

    return serviceOrdersService.getServiceOrderById(id);
  });

  server.patch(
    '/:id',
    { schema: updateServiceOrderSchema },
    async (request) => {
      const id = Number(request.params.id);

      return serviceOrdersService.updateServiceOrder(id, request.body);
    },
  );

  server.delete(
    '/:id',
    { schema: serviceOrderParamsSchema },
    async (request, reply) => {
      const id = Number(request.params.id);

      await serviceOrdersService.deleteServiceOrder(id);

      return reply.status(204).send();
    },
  );

  server.post(
    '/:id/process',
    { schema: serviceOrderParamsSchema },
    async (request) => {
      const id = Number(request.params.id);

      return serviceOrdersService.processServiceOrder(id);
    },
  );

  server.post(
    '/:id/cancel',
    { schema: serviceOrderParamsSchema },
    async (request) => {
      const id = Number(request.params.id);

      return serviceOrdersService.cancelServiceOrder(id);
    },
  );
}
