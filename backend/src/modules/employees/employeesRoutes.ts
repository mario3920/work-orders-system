import type { FastifyInstance } from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import * as employeesService from './employeesServices.js';
import {
  employeeParamsSchema,
  employeesPaginationSchema,
} from './schemas/employeeParams.schema.js';
import { updateEmployeeSchema } from './schemas/updateEmployee.schema.js';

export async function employeesRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<JsonSchemaToTsProvider>();

  server.get('/', { schema: employeesPaginationSchema }, async (request) => {
    const page = request.query.page ?? 1;

    return employeesService.getAllEmployees(page);
  });

  server.get('/:id', { schema: employeeParamsSchema }, async (request) => {
    const id = Number(request.params.id);

    return employeesService.getEmployeeById(id);
  });

  server.patch('/:id', { schema: updateEmployeeSchema }, async (request) => {
    const id = Number(request.params.id);

    return employeesService.updateEmployee(id, request.body);
  });

  server.delete(
    '/:id',
    { schema: employeeParamsSchema },
    async (request, reply) => {
      const id = Number(request.params.id);

      await employeesService.deactivateEmployee(id);

      return reply.status(204).send();
    },
  );
}
