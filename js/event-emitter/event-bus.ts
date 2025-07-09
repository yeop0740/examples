import { PrismaClient } from './generated/prisma'
import { EventEmitter } from 'node:events'

export const eventEmitter = new EventEmitter()
const prisma = new PrismaClient({
	log: ['query']
})

eventEmitter.on('POST_CREATED', async (data) => {
	console.log('POST_CREATED', data)
	await prisma.$executeRaw`SELECT pg_sleep(1)`
})
