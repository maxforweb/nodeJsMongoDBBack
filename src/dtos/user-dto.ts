import { IUser } from "../models/User";

export default class UserDto  {
    email: string;
    id: string;
    isActivated: boolean;
    name: string;
    phone: string;
    lastName: string;
    

    constructor( model: IUser ){
        this.email = model.email;
        this.id = model._id;
        this.isActivated =  model.confirmed;
        this.name = model.fullName;
        this.phone = model.phone ? model.phone : '';
        this.lastName = model.lastName ? model.lastName : '';
    }
}