export class Password {
	#password: string;

	constructor(password: string) {
		this.#password = password;
	}

	match(password: string) {
		return this.#password === password;
	}
}
