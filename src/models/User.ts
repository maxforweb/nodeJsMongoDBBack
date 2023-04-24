import mongoose, { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { UserSchema } from '../types/User';
mongoose.set('debug', true);

const UserSchema = new Schema<UserSchema>(
	{
		email: {
			type: String,
			required: true,
			validate: [isEmail, 'Invalid Email'],
			unique: true,
		},
		avatar: String,
		fullName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
		confirm_hash: String,
		reset_hash: String,
		last_seen: Date,
	},
	{
		timestamps: true,
	}
);

const UserModel = model<UserSchema>('User', UserSchema);

export default UserModel;
