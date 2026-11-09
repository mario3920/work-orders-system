import type { FastifyInstance } from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import * as usersService from './usersServices.js';
import {
  userParamsSchema,
  usersPaginationSchema,
} from './schemas/userParams.schema.js';
import { createUserSchema } from './schemas/createUser.schema.js';
import { updateUserSchema } from './schemas/updateUser.schema.js';

export async function usersRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<JsonSchemaToTsProvider>();

  server.post('/', { schema: createUserSchema }, async (request, reply) => {
    const user = await usersService.createUser(request.body);

    return reply.status(201).send(user);
  });

  server.get('/', { schema: usersPaginationSchema }, async (request) => {
    const page = request.query.page ?? 1;

    return usersService.getAllUsers(page);
  });

  server.get('/:id', { schema: userParamsSchema }, async (request) => {
    const id = Number(request.params.id);

    return usersService.getUserById(id);
  });

  server.patch('/:id', { schema: updateUserSchema }, async (request) => {
    const id = Number(request.params.id);

    return usersService.updateUser(id, request.body);
  });

  server.delete(
    '/:id',
    { schema: userParamsSchema },
    async (request, reply) => {
      const id = Number(request.params.id);

      await usersService.deactivateUser(id);

      return reply.status(204).send();
    },
  );
}
