import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('roles', ['EMPLOYEE', 'CLIENT', 'ADMIN']);

export const employmentStatusEnum = pgEnum('employment_status', [
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
]);

export const serviceOrderPriorityEnum = pgEnum('service_orders_priorities', [
  'LOW',
  'NORMAL',
  'HIGH',
  'CRITICAL',
]);

export const serviceOrderStatusEnum = pgEnum('service_orders_status', [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELED',
]);

const timestamps = {
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
};

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: text('password_hash').notNull(),
    role: roleEnum('role').notNull(),
    active: boolean('active').default(true).notNull(),
    ...timestamps,
  },
  (table) => [unique('users_email_unique').on(table.email)],
);

export const clients = pgTable(
  'clients',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    ...timestamps,
  },
  (table) => [
    unique('clients_user_id_unique').on(table.userId),
    index('clients_name_idx').on(table.name),
  ],
);

export const employees = pgTable(
  'employees',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    employeeCode: varchar('employee_code', { length: 50 }).notNull(),
    employmentStatus: employmentStatusEnum('employment_status')
      .default('ACTIVE')
      .notNull(),
    hiredAt: timestamp('hired_at', {
      withTimezone: true,
    }).notNull(),
    terminatedAt: timestamp('terminated_at', {
      withTimezone: true,
    }),
    ...timestamps,
  },
  (table) => [
    unique('employees_user_id_unique').on(table.userId),
    unique('employees_employee_code_unique').on(table.employeeCode),
    index('employees_name_idx').on(table.name),
    index('employees_employment_status_idx').on(table.employmentStatus),
  ],
);

export const serviceOrders = pgTable(
  'service_orders',
  {
    id: serial('id').primaryKey(),
    clientId: integer('client_id')
      .notNull()
      .references(() => clients.id),
    description: text('description').notNull(),
    priority: serviceOrderPriorityEnum('priority').default('NORMAL').notNull(),
    status: serviceOrderStatusEnum('status').default('PENDING').notNull(),
    responsibleId: integer('responsible_id').references(() => employees.id),
    ...timestamps,
  },
  (table) => [
    index('service_orders_client_id_idx').on(table.clientId),
    index('service_orders_responsible_id_idx').on(table.responsibleId),
    index('service_orders_status_idx').on(table.status),
    index('service_orders_priority_idx').on(table.priority),
    index('service_orders_created_at_idx').on(table.createdAt),
  ],
);
