import type { FastifyInstance } from 'fastify';
import * as serviceOrdersService from './serviceOrdersServices.js';
import { createServiceOrderSchema } from './schemas/createServiceOrder.schema.js';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { updateServiceOrderSchema } from './schemas/updateServiceOrder.schema.js';
import { AppError } from '../../errors/AppError.js';
import {
  serviceOrderPaginationSchema,
  serviceOrderParamsPaginationSchema,
  serviceOrderParamsSchema,
} from './schemas/serviceOrderParams.schema.js';
import {
  assertClientAccess,
  authenticate,
  authorizeRoles,
} from '../../auth/authGuards.js';

export async function serviceOrdersRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<JsonSchemaToTsProvider>();

  server.post(
    '/',
    {
      schema: createServiceOrderSchema,
      preHandler: [authenticate, authorizeRoles('ADMIN', 'EMPLOYEE', 'CLIENT')],
    },
    async (request, reply) => {
      if (
        request.user.role === 'CLIENT' &&
        request.body.responsibleId != null
      ) {
        throw new AppError('Clients cannot assign an order responsible', 403);
      }

      const data =
        request.user.role === 'CLIENT'
          ? { ...request.body, clientId: request.user.clientId }
          : request.body;
      const order = await serviceOrdersService.createServiceOrder(data);

      return reply.status(201).send(order);
    },
  );

  server.get(
    '/',
    {
      schema: serviceOrderPaginationSchema,
      preHandler: [authenticate, authorizeRoles('ADMIN', 'EMPLOYEE')],
    },
    async (request) => {
      return serviceOrdersService.getAllServiceOrders(request.query);
    },
  );

  server.get(
    '/:id',
    {
      schema: serviceOrderParamsSchema,
      preHandler: authenticate,
    },
    async (request) => {
      const id = Number(request.params.id);
      const order = await serviceOrdersService.getServiceOrderById(id);
      assertClientAccess(request, order.clientId);
      return order;
    },
  );

  server.get(
    '/client/:id',
    {
      schema: serviceOrderParamsPaginationSchema,
      preHandler: authenticate,
    },
    async (request) => {
      const id = Number(request.params.id);
      assertClientAccess(request, id);
      return serviceOrdersService.getAllServiceOrdersByClient(
        id,
        request.query,
      );
    },
  );

  server.patch(
    '/:id',
    {
      schema: updateServiceOrderSchema,
      preHandler: authenticate,
    },
    async (request) => {
      const id = Number(request.params.id);
      const currentOrder = await serviceOrdersService.getServiceOrderById(id);
      assertClientAccess(request, currentOrder.clientId);

      if (
        request.user.role === 'CLIENT' &&
        Object.keys(request.body).some((key) => key !== 'description')
      ) {
        throw new AppError(
          'Clients can only update the order description',
          403,
        );
      }

      return serviceOrdersService.updateServiceOrder(id, request.body);
    },
  );

  server.delete(
    '/:id',
    {
      schema: serviceOrderParamsSchema,
      preHandler: [authenticate, authorizeRoles('ADMIN', 'EMPLOYEE', 'CLIENT')],
    },
    async (request, reply) => {
      const id = Number(request.params.id);
      const order = await serviceOrdersService.getServiceOrderById(id);
      assertClientAccess(request, order.clientId);

      await serviceOrdersService.deleteServiceOrder(id);

      return reply.status(204).send();
    },
  );

  server.post(
    '/:id/process',
    {
      schema: serviceOrderParamsSchema,
      preHandler: [authenticate, authorizeRoles('ADMIN', 'EMPLOYEE')],
    },
    async (request) => {
      const id = Number(request.params.id);

      return serviceOrdersService.processServiceOrder(id);
    },
  );

  server.post(
    '/:id/cancel',
    {
      schema: serviceOrderParamsSchema,
      preHandler: authenticate,
    },
    async (request) => {
      const id = Number(request.params.id);
      const order = await serviceOrdersService.getServiceOrderById(id);
      assertClientAccess(request, order.clientId);

      return serviceOrdersService.cancelServiceOrder(id);
    },
  );
}
