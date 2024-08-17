import mongoose from 'mongoose';

export const connectToDB = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'Auth-System'
        })
        console.log(`MongoDB Connected: ${res.connection.host}`);
    } catch (error) {
        console.log("Error connecting to MongoDB: " + error.message);
        process.exit(1);
    }
}