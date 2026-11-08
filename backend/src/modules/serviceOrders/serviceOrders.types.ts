export type UpdateServiceOrderData = {
  description?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  responsibleId?: number | null;
};

export type ServiceOrderFinalStatus = 'COMPLETED' | 'FAILED';