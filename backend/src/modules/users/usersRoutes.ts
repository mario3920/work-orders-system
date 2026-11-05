import type { FastifyInstance } from 'fastify';
import * as usersService from './usersServices.js';

export async function usersRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    const id = Number(request.params.id);

    return usersService.getUserById(id);
  });
}