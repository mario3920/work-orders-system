import { AppError } from '../../errors/AppError.js';
import * as serviceOrdersRepository from './serviceOrdersRepository.js';
import * as clientsRepository from '../clients/clientsRepository.js';
import * as employeeRepository from '../employees/employeesRepository.js';
import type { CreateServiceOrderInput } from './schemas/createServiceOrder.schema.js';
import type { UpdateServiceOrderInput } from './schemas/updateServiceOrder.schema.js';

export async function createServiceOrder(data: CreateServiceOrderInput) {
  const client = await clientsRepository.findClientWithUserById(data.clientId);
  if (!client) {
    throw new AppError('Client not found', 404);
  }
  if (!client.user.active) {
    throw new AppError('Client is inactive', 409);
  }
  if (data.responsibleId != null) {
    const responsible = await employeeRepository.findEmployeeWithUserById(
      data.responsibleId,
    );

    if (!responsible) {
      throw new AppError('Responsible not found', 404);
    }
    if (responsible.employmentStatus !== 'ACTIVE' || !responsible.user.active) {
      throw new AppError('Responsible is inactive', 409);
    }
  }
  return serviceOrdersRepository.createServiceOrder(data);
}

export async function getAllServiceOrders(page: number) {
  return serviceOrdersRepository.findAllServiceOrders(page);
}

export async function getAllServiceOrdersByClient(
  clientId: number,
  page: number,
) {
  return serviceOrdersRepository.findAllServiceOrdersByClient(clientId, page);
}

export async function getServiceOrderById(id: number) {
  const order = await serviceOrdersRepository.findServiceOrderById(id);

  if (!order) {
    throw new AppError('Service order not found', 404);
  }

  return order;
}

export async function updateServiceOrder(
  id: number,
  data: UpdateServiceOrderInput,
) {
  const order = await serviceOrdersRepository.updateServiceOrder(id, data);

  if (!order) {
    throw new AppError('Service order not found or cannot be updated', 409);
  }

  return order;
}

export async function deleteServiceOrder(id: number) {
  const order = await serviceOrdersRepository.deleteServiceOrder(id);

  if (!order) {
    throw new AppError('Service order not found or cannot be deleted', 409);
  }

  return order;
}

export async function processServiceOrder(id: number) {
  let order = await serviceOrdersRepository.startServiceOrderProcessing(id);

  if (!order) {
    throw new AppError(
      'Service order not found or unavailable for processing.',
      409,
    );
  }

  const processingTime = Math.floor(Math.random() * 7000) + 3000;

  await new Promise((resolve) => setTimeout(resolve, processingTime));

  if (processingTime < 5000) {
    order = await serviceOrdersRepository.updateServiceOrderStatus(
      id,
      'FAILED',
    );
  } else {
    order = await serviceOrdersRepository.updateServiceOrderStatus(
      id,
      'COMPLETED',
    );
  }

  if (!order) {
    throw new AppError('Failed to update service order status', 500);
  }

  return order;
}

export async function cancelServiceOrder(id: number) {
  const order = await serviceOrdersRepository.cancelServiceOrder(id);

  if (!order) {
    throw new AppError('Service order not found or cannot be canceled', 409);
  }

  return order;
}
