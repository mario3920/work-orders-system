import type { FastifyInstance } from 'fastify';
import * as employeesService from './employeesServices.js';

export async function employeesRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    const id = Number(request.params.id);

    return employeesService.getEmployeeById(id);
  });
}