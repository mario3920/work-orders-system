import { db, pool } from './connection.js';
import { clients, employees, serviceOrders, users } from './schema.js';

const CLIENT_COUNT = 50;
const EMPLOYEE_COUNT = 50;
const SERVICE_ORDER_COUNT = 50;
const SEED_PASSWORD = 'seed-only-placeholder';

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function getServiceOrderStatus(index: number) {
  if (index < 30) return 'PENDING' as const;
  if (index < 35) return 'PROCESSING' as const;
  if (index < 40) return 'COMPLETED' as const;
  if (index < 45) return 'FAILED' as const;
  return 'CANCELED' as const;
}

async function seed() {
  try {
    await db.transaction(async (tx) => {
      const userData = Array.from(
        { length: CLIENT_COUNT + EMPLOYEE_COUNT },
        (_, index) => {
          const isClient = index < CLIENT_COUNT;
          const profileIndex = isClient ? index : index - CLIENT_COUNT;
          const number = String(profileIndex + 1).padStart(2, '0');

          return {
            email: isClient
              ? `seed.client${number}@example.com`
              : `seed.employee${number}@example.com`,
            passwordHash: SEED_PASSWORD,
            role: isClient ? ('CLIENT' as const) : ('EMPLOYEE' as const),
            active: profileIndex % 7 !== 0,
            createdAt: daysAgo(100 - profileIndex),
            updatedAt: daysAgo(100 - profileIndex),
          };
        },
      );

      const insertedUsers = await tx
        .insert(users)
        .values(userData)
        .returning({ id: users.id, role: users.role });

      const clientUsers = insertedUsers.filter((user) => user.role === 'CLIENT');
      const employeeUsers = insertedUsers.filter(
        (user) => user.role === 'EMPLOYEE',
      );

      const clientData = clientUsers.map((user, index) => ({
        userId: user.id,
        name: `Cliente de Teste ${String(index + 1).padStart(2, '0')}`,
        phone: `8599${String(index + 1).padStart(7, '0')}`,
        createdAt: daysAgo(90 - index),
        updatedAt: daysAgo(90 - index),
      }));

      const insertedClients = await tx
        .insert(clients)
        .values(clientData)
        .returning({ id: clients.id });

      const employeeData = employeeUsers.map((user, index) => {
        const employmentStatus =
          index % 10 === 0
            ? ('SUSPENDED' as const)
            : index % 6 === 0
              ? ('INACTIVE' as const)
              : ('ACTIVE' as const);

        return {
          userId: user.id,
          name: `Funcionario de Teste ${String(index + 1).padStart(2, '0')}`,
          phone: `8598${String(index + 1).padStart(7, '0')}`,
          employeeCode: `EMP-${String(index + 1).padStart(4, '0')}`,
          employmentStatus,
          hiredAt: daysAgo(500 - index * 5),
          terminatedAt:
            employmentStatus === 'INACTIVE' ? daysAgo(30 + index) : null,
          createdAt: daysAgo(80 - index),
          updatedAt: daysAgo(80 - index),
        };
      });

      const insertedEmployees = await tx
        .insert(employees)
        .values(employeeData)
        .returning({ id: employees.id });

      const priorities = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'] as const;
      const descriptions = [
        'Manutencao preventiva',
        'Verificacao tecnica',
        'Substituicao de componente',
        'Inspecao geral',
        'Ajuste e calibracao',
      ];

      const serviceOrderData = Array.from(
        { length: SERVICE_ORDER_COUNT },
        (_, index) => ({
          clientId: insertedClients[index % insertedClients.length]!.id,
          description: `Ordem de servico de teste ${String(index + 1).padStart(2, '0')} - ${descriptions[index % descriptions.length]}.`,
          priority: priorities[index % priorities.length],
          status: getServiceOrderStatus(index),
          responsibleId:
            index % 5 === 0
              ? null
              : insertedEmployees[index % insertedEmployees.length]!.id,
          createdAt: daysAgo(60 - index),
          updatedAt: daysAgo(60 - index),
          // Duas ordens pendentes removidas logicamente para testar o filtro.
          deletedAt: index === 28 || index === 29 ? daysAgo(2) : null,
        }),
      );

      await tx.insert(serviceOrders).values(serviceOrderData);

      console.log('Seed concluido:');
      console.log(`- Users: ${insertedUsers.length} (50 CLIENT, 50 EMPLOYEE)`);
      console.log(`- Clients: ${insertedClients.length}`);
      console.log(`- Employees: ${insertedEmployees.length}`);
      console.log(`- Service orders: ${serviceOrderData.length}`);
      console.log('- Status das ordens: 30 PENDING, 5 de cada outro status');
      console.log('- Password placeholder: seed-only-placeholder');
    });
  } catch (error) {
    console.error('Erro ao executar seed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

await seed();
