const Course = require('../models/Course')
const {mutipleMongooseToObject} = require('../../util/mongoose')
class SiteController{
    index(req,res)
    {
        Course.find({})
        .then(courses=> res.render('home',{
            courses: mutipleMongooseToObject(courses)
        }))
       
    }

    
}
module.exports = new SiteController;