
import * as serviceOrdersRepository from './serviceOrdersRepository.js';

export async function createServiceOrder(
  data: Parameters<typeof serviceOrdersRepository.createServiceOrder>[0],
) {
  return serviceOrdersRepository.createServiceOrder(data);
}

export async function getAllServiceOrders() {
  return serviceOrdersRepository.findAllServiceOrders();
}

export async function getServiceOrderById(id: number) {
  const order = await serviceOrdersRepository.findServiceOrderById(id);

  if (!order) {
    throw new Error('Service order not found');
  }

  return order;
}

export async function updateServiceOrder(
  id: number,
  data: Parameters<typeof serviceOrdersRepository.updateServiceOrder>[1],
) {
  const order = await serviceOrdersRepository.findServiceOrderById(id);

  if (!order) {
    throw new Error('Service order not found');
  }

  if (order.status !== 'PENDING') {
    throw new Error('Only pending service orders can be updated');
  }

  return serviceOrdersRepository.updateServiceOrder(id, data);
}

export async function deleteServiceOrder(id: number) {
  const order = await serviceOrdersRepository.findServiceOrderById(id);

  if (!order) {
    throw new Error('Service order not found');
  }

  if (order.status !== 'PENDING') {
    throw new Error('Only pending service orders can be deleted');
  }

  return serviceOrdersRepository.deleteServiceOrder(id);
}

export async function processServiceOrder(id: number) {
  const order = await serviceOrdersRepository.startServiceOrderProcessing(id);

  if (!order) {
    throw new Error(
      'Service order not found or is not available for processing',
    );
  }

  return order;
}

export async function cancelServiceOrder(id: number) {
  const order = await serviceOrdersRepository.cancelServiceOrder(id);

  if (!order) {
    throw new Error(
      'Service order not found or cannot be canceled',
    );
  }

  return order;
}
