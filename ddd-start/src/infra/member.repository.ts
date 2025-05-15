import {Orderer} from "../orderer";
import {Member} from "../member";

export interface MemberRepository {
    findByOrderer(orderer: Orderer): Member;
    findById(id: number): Member;
}
