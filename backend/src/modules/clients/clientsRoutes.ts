import type { FastifyInstance } from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import * as clientsService from './clientsServices.js';
import {
  clientParamsSchema,
  clientsPaginationSchema,
} from './schemas/clientParams.schema.js';
import { updateClientSchema } from './schemas/updateClient.schema.js';

export async function clientsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<JsonSchemaToTsProvider>();

  server.get('/', { schema: clientsPaginationSchema }, async (request) => {
    const page = request.query.page ?? 1;

    return clientsService.getAllClients(page);
  });

  server.get('/:id', { schema: clientParamsSchema }, async (request) => {
    const id = Number(request.params.id);

    return clientsService.getClientById(id);
  });

  server.patch('/:id', { schema: updateClientSchema }, async (request) => {
    const id = Number(request.params.id);

    return clientsService.updateClient(id, request.body);
  });
}
