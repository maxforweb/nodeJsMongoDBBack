export default class UserDto  {
    emial: string;
    id: string;
    isActivated: boolean;

    constructor( model: any ){
        this.emial = model.email;
        this.id = model._id;
        this.isActivated =  model.confirmed;
    }
}