import mongoose from 'mongoose';

const connectDB = async function()
{
    try {

     const connection = await mongoose.connect(`${process.env.MONGO_URI}`);
     console.log(`MongoDB connected !! `)  
    } catch (error) {
        console.log(`error in connecting DataBase`);
        throw(error);
    }
}

export default connectDB;