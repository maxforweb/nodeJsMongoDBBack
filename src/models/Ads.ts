import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';


export interface IAd extends Document {
    owner:   IUser | string,
    title: string,
    description: string,
    img: string,
    price: string,
    address: string,
    area: string
}

const AdSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    title: {
        type: String,
        require: "title is required",
    },
    description: {
        type: String,
    },
    img: String,
    price: {
        type: String,
        require: "price is required",
    },
    address: {
        type: String,
        require: "address is required",
    },
    area: String,

}, {
    timestamps: true
})

const AdModel = mongoose.model<IAd>( "Ad" , AdSchema );

export default AdModel;