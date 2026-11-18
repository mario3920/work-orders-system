import type { FastifyInstance } from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import * as employeesService from './employeesServices.js';
import {
  employeeParamsSchema,
  employeesPaginationSchema,
} from './schemas/employeeParams.schema.js';
import { updateEmployeeSchema } from './schemas/updateEmployee.schema.js';
import {
  assertEmployeeAccess,
  authenticate,
  authorizeRoles,
} from '../../auth/authGuards.js';

export async function employeesRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<JsonSchemaToTsProvider>();

  server.get(
    '/',
    {
      schema: employeesPaginationSchema,
      preHandler: [authenticate, authorizeRoles('ADMIN', 'EMPLOYEE')],
    },
    async (request) => {
      const page = request.query.page ?? 1;

      return employeesService.getAllEmployees(page);
    },
  );

  server.get(
    '/:id',
    {
      schema: employeeParamsSchema,
      preHandler: [authenticate, authorizeRoles('ADMIN', 'EMPLOYEE')],
    },
    async (request) => {
      const id = Number(request.params.id);
      assertEmployeeAccess(request, id);

      return employeesService.getEmployeeById(id);
    },
  );

  server.patch(
    '/:id',
    {
      schema: updateEmployeeSchema,
      preHandler: [authenticate, authorizeRoles('ADMIN', 'EMPLOYEE')],
    },
    async (request) => {
      const id = Number(request.params.id);
      assertEmployeeAccess(request, id);

      return employeesService.updateEmployee(id, request.body);
    },
  );

  server.delete(
    '/:id',
    {
      schema: employeeParamsSchema,
      preHandler: [authenticate, authorizeRoles('ADMIN')],
    },
    async (request, reply) => {
      const id = Number(request.params.id);

      await employeesService.deactivateEmployee(id);

      return reply.status(204).send();
    },
  );
}
