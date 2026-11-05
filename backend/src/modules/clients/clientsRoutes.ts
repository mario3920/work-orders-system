import type { FastifyInstance } from 'fastify';
import * as clientsService from './clientsServices.js';

export async function clientsRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    const id = Number(request.params.id);

    return clientsService.getClientById(id);
  });
}
