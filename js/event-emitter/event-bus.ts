import { EventEmitter } from 'node:events'

export const eventEmitter = new EventEmitter()

eventEmitter.on('POST_CREATED', (data) => {
	console.log('POST_CREATED', data)
})
