import { Member } from './member';

export class Orderer {
	#member: Member;

	constructor(member: Member) {
		this.#member = member;
	}

	get member() {
		return this.#member;
	}
}
