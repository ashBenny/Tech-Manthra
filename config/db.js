const mongoose = require('mongoose');

const connectDatabase = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false
        });
        console.log(`Connected to MongoDB : ${conn.connection.host}`)   
    } catch (error) {
        console.log(error)
        process.exit(1)
    };
};

module.exports = connectDatabase;