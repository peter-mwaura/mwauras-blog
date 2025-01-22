import mongoose, { Types, Document } from 'mongoose';

// Define a TypeScript interface for the User document
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string; // Optional since `select: false` excludes it by default
    createdAt: Date;
    isPremium: boolean;
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
});

export default (mongoose.models.User as mongoose.Model<IUser>) ||
    mongoose.model<IUser>('User', UserSchema);
