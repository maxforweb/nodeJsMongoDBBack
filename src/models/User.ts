import mongoose, { Schema, Document} from 'mongoose'
import isEmail from 'validator/lib/isEmail';

export interface IUser extends Document {
    email: string;
    fullName: string;
    lastName: string;
    password: string;
    confirmed?: boolean;
    phone?: string;
    avatar?: string;
    confirm_hash?: string;
    last_seen?: Date;
    reset_hash?: string;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: "Email is required",
        validate: [isEmail, "Invalid Email"],
        unique: true
    },
    avatar: String,
    fullName: {
        type: String,
        required: "Fullname is required"
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirm_hash: String,
    reset_hash: String,
    last_seen: Date,
    
}, {
    timestamps: true,
})

const UserModel = mongoose.model<IUser>( "User" , UserSchema)


export default UserModel;