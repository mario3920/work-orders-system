import type { FastifyInstance } from 'fastify';
import * as serviceOrdersService from './serviceOrdersServices.js';

export async function serviceOrdersRoutes(app: FastifyInstance) {
  // Create service order
  app.post('/', async (request, reply) => {
    const order = await serviceOrdersService.createServiceOrder(
      request.body as Parameters<
        typeof serviceOrdersService.createServiceOrder
      >[0],
    );

    return reply.status(201).send(order);
  });

  // List service orders
  app.get('/', async () => {
    return serviceOrdersService.getAllServiceOrders();
  });

  // Get service order by ID
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    const id = Number(request.params.id);

    return serviceOrdersService.getServiceOrderById(id);
  });

  // Update service order
  app.put<{ Params: { id: string } }>('/:id', async (request) => {
    const id = Number(request.params.id);

    return serviceOrdersService.updateServiceOrder(
      id,
      request.body as Parameters<
        typeof serviceOrdersService.updateServiceOrder
      >[1],
    );
  });

  // Delete service order
  app.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = Number(request.params.id);

    await serviceOrdersService.deleteServiceOrder(id);

    return reply.status(204).send();
  });

  // Process service order
  app.post<{ Params: { id: string } }>('/:id/process', async (request) => {
    const id = Number(request.params.id);

    return serviceOrdersService.processServiceOrder(id);
  });

  // Cancel service order
  app.post<{ Params: { id: string } }>('/:id/cancel', async (request) => {
    const id = Number(request.params.id);

    return serviceOrdersService.cancelServiceOrder(id);
  });
}
