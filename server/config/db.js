const mongoose = require('mongoose');
const connectDB = async () => {

    try{
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(prorcess.env.MONGODB_URI);
        console.log(`Database Connected Successfully: ${conn.connection.host}`);
    }

    catch(error){
        console.log(error);
    }
}

module.exports = connectDB;