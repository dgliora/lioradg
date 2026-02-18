import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  verificationToken?: string
  verificationExpiry?: Date
}) {
  const hashedPassword = await hashPassword(data.password)
  
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'USER',
      verificationToken: data.verificationToken,
      verificationExpiry: data.verificationExpiry,
    },
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

