import * as clientsRepository from './clientsRepository.js';
import { AppError } from '../../errors/AppError.js';
import type { UpdateClientInput } from './schemas/updateClient.schema.js';

export async function getAllClients(page: number) {
  return clientsRepository.findAllClients(page);
}

export async function getClientById(id: number) {
  const client = await clientsRepository.findClientById(id);

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  return client;
}

export async function updateClient(id: number, data: UpdateClientInput) {
  const client = await clientsRepository.updateClient(id, data);

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  return client;
}
