import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IToken extends Document {
	user: IUser | string;
	token: string;
}

const TokenSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	token: {
		type: String,
		required: true,
	},
});

const TokenModel = mongoose.model<IToken>('Token', TokenSchema);

export default TokenModel;
