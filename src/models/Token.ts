import mongoose, { Schema, Document } from 'mongoose';
import { UserSchema } from '../types/User';

export interface IToken extends Document {
	user: UserSchema | string;
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
