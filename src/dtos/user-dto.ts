import { UserModelInterface } from "../types/User";

export default class UserDto {
	email: string;
	id: string;
	isActivated: boolean;
	name: string;
	phone: string;
	lastName: string;
	avatar: string;

	constructor(model: UserModelInterface) {
		this.email = model.email;
		this.id = model._id;
		this.isActivated = model.confirmed;
		this.name = model.fullName;
		this.phone = model.phone ? model.phone : '';
		this.lastName = model.lastName ? model.lastName : '';
		this.avatar = model.avatar ? model.avatar : '';
	}
}
