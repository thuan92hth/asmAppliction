const mongoose = require('mongoose')


async function connect(){
    try {
        await mongoose.connect('mongodb://127.0.0.1/f8_education_dev',{
            useNewUrlParser: false,
            useUnifiedTopology: true
           
        })
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Connect failed');
    }
}
module.exports ={connect}