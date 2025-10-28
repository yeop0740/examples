from locust import HttpUser, task

class PurchaseUser(HttpUser):
	@task
	def purchase(self):
		response = self.client.post("/purchase1", json={"accountId": 1})
