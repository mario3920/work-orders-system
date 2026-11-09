import type { FastifyInstance } from 'fastify';
import * as serviceOrdersService from './serviceOrdersServices.js';
import { createServiceOrderSchema } from './schemas/createServiceOrder.schema.js';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { updateServiceOrderSchema } from './schemas/updateServiceOrder.schema.js';
import {
  serviceOrderPaginationSchema,
  serviceOrderParamsPaginationSchema,
  serviceOrderParamsSchema,
} from './schemas/serviceOrderParams.schema.js';

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

  server.get('/', { schema: serviceOrderPaginationSchema }, async (request) => {
    return serviceOrdersService.getAllServiceOrders(request.query);
  });

  server.get('/:id', { schema: serviceOrderParamsSchema }, async (request) => {
    const id = Number(request.params.id);

    return serviceOrdersService.getServiceOrderById(id);
  });

  server.get(
    '/client/:id',
    { schema: serviceOrderParamsPaginationSchema },
    async (request) => {
      const id = Number(request.params.id);
      return serviceOrdersService.getAllServiceOrdersByClient(
        id,
        request.query,
      );
    },
  );

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
