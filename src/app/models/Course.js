const mongoose  = require('mongoose')
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Course = new Schema({
    name:{type:String , maxLength:255},
    class:{type:String,maxLength:255},
    time:{type:String,maxLength:255},
    day:{type:String,maxLength:255},
    description:{type:String,maxLength:255},
    thumbnail:{type:String,maxLength:255},
    slug:{type:String, slug:'name'},
})
module.exports = mongoose.model('Course',Course)