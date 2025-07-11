import { eventEmitter } from './event-bus'
import { app } from './server'
import request from 'supertest'

describe.skip('GET "/" 요청에 대해서', () => {
	it('Hello World 문자열을 리턴한다', async () => {
		const response = await request(app).get('/')

		expect(response.status).toEqual(200)
		expect(response.type).toEqual('text/html')
		expect(response.text).toEqual('Hello World!')
	})
})

describe.skip('POST "/event" 요청에 대해서', () => {
	beforeAll(() => {
		eventEmitter
	})

	it('POST_CREATED 이벤트를 발급 하고 Event emitted 문자열을 리턴한다', async () => {
		const response = await request(app).post('/event')

		expect(response.status).toEqual(200)
		expect(response.type).toEqual('text/html')
		expect(response.text).toEqual('Event emitted')
	})
})
