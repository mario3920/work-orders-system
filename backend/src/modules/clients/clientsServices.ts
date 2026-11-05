import * as clientsRepository from './clientsRepository.js';

export async function getClientById(id: number) {
  const client = await clientsRepository.findClientById(id);

  if (!client) {
    throw new Error('Client not found');
  }

  return client;
}
