import mongoose from 'mongoose';

const connectToDatabase = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error(
            'MONGODB_URI environment variable is required but not set!'
        );
    }
    mongoose
        .connect(uri)
        .then(() => console.log('MongoDB connected successfully'))
        .catch((e) => console.log('Error connecting to MongoDB:', e));
};

export default connectToDatabase;
