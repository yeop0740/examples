import { app } from './server'

const port = 3001

const server = app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

const gracefulShutdown = () => {
	console.log('Received shutdown signal, shutting down gracefully...')
	server.close(async () => {
		console.log('Closed out remaining connections.')
		// 여기에 데이터베이스 연결 종료 등 리소스 정리 코드를 추가할 수 있습니다.
		// await client.end()
		process.exit(0)
	})

	// 강제 종료 타이머
	setTimeout(() => {
		console.error(
			'Could not close connections in time, forcefully shutting down',
		)
		process.exit(1)
	}, 10000) // 10초
}

// 앱 종료 시그널 리스닝
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
