import axios from 'axios'

describe('Event API', () => {
	it('정상 동작하는지 확인', async () => {
		const response = await axios.post('http://localhost:3001/event')
		expect(response.status).toBe(200)
	})

	it('should handle 20 concurrent requests to /event', async () => {
		const promises = []
		for (let i = 0; i < 6; i++) {
			promises.push(axios.post('http://localhost:3001/event'))
		}

		const responses = await Promise.all(promises)
		console.dir(
			responses.map((response) => response.data),
			{ depth: null },
		)

		for (const response of responses) {
			expect(response.status).toBe(200)
			const text = await response.data
			expect(text).toBe('Event emitted')
		}
	}, 30000) // Increase timeout for this test
})
