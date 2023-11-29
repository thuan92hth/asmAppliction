const mongoose  = require('mongoose')
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const User = new Schema({
    username:{type:String , maxLength:255},
    password:{type:String,maxLength:255},
    role:{type:String,maxLength:255},
    grade:{type:String,maxLength:255},
    slug:{type:String, slug:'username'},
})
module.exports = mongoose.model('User',User)