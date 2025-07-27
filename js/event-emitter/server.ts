import express, { Request, Response } from 'express'
import { eventEmitter } from './event-bus'
// import { Client } from 'pg'

export const app = express()

// const client = new Client()
// await client.connect()

// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
// console.log(res.rows[0].message) // Hello world!

app.get('/', (req: Request, res: Response) => {
	res.status(200).send('Hello World!')
})

app.post('/event', (req: Request, res: Response) => {
	eventEmitter.emit('POST_CREATED', 'Hello World!')
	res.send('Event emitted')
})
