import type { FastifyInstance } from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import type { AuthTokenPayload } from './auth.types.js';
import { login } from './authServices.js';
import { loginSchema } from './schemas/login.schema.js';

export async function authRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<JsonSchemaToTsProvider>();

  server.post('/login', { schema: loginSchema }, async (request, reply) => {
    const user = await login(request.body);
    let payload: AuthTokenPayload;

    if (user.role === 'CLIENT') {
      payload = {
        sub: String(user.id),
        role: user.role,
        clientId: user.clientId,
      };
    } else if (user.role === 'EMPLOYEE') {
      payload = {
        sub: String(user.id),
        role: user.role,
        employeeId: user.employeeId,
      };
    } else {
      payload = {
        sub: String(user.id),
        role: user.role,
      };
    }

    const accessToken = await reply.jwtSign(payload);

    return reply.send({
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user,
    });
  });
}
