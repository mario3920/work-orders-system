import * as usersRepository from './usersRepository.js';

export async function getUserById(id: number) {
  const user = await usersRepository.findUserById(id);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}