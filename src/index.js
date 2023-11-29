const express = require('express')
const morgan = require('morgan')
const {engine} = require('express-handlebars')
const path = require('path')
const app = express()
const route = require('./routes')
const User = require('./app/models/User')
const Course = require('./app/models/Course')
const db = require('./config/db')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')

const { mutipleMongooseToObject} = require('./util/mongoose')
const {  mongooseToObject} = require('./util/mongoose')

// cookie parser
app.use(cookieParser())

//formidable

//sass
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'))
// template engine

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

// middleware
app.use(express.urlencoded({
    extended:true
}))
// method-override
app.use(methodOverride('_method'))
// GET login
app.get('/login',(req,res)=>{
   res.render('authen/login', {layout:false})
})

// post login
app.post('/login',(req,res)=>{
   var username = req.body.username
   var password = req.body.password
 
   User.findOne({
        username: username,
        password:password,


   })
   .then(data=>{
     
      var token= jwt.sign({
         _id: data._id,
      },'mk')
       return res.json({
        message: 'thanh cong',
        token:token
       })
   })
   .catch(err=>{
      console.log(err)
        res.status(500).json('loi server')
   })
})
const checkLogin = (req,res,next)=>{
   //check login
   try {
      var token = req.cookies.token
      var idUser =jwt.verify(token,'mk')
      User.findOne({
         _id:idUser
      })
      .then(data=>{
         
         if(data){
            
            req.data = data
            
            next()
         }
         else{
            res.json('not Permisson')
         }
      })
      .catch(err=>{

      })
    
   } catch (error) {
     console.log(error)
   }
}
var checkStudent =(req,res,next)=>{
   var role = req.data.role
   if(role === 'student'|| role === 'trainer'|| role==='manager'){
      next()
   }
   else{
      res.json('not permisson')
   }
}
var checkTeacher =(req,res,next)=>{
   var role = req.data.role
   if(role === 'trainer'|| role === 'training'|| role==='manager'){
      next()
   }
   else{
      res.json('not permisson')
   }
}
var checkManager =(req,res,next)=>{
   var role = req.data.role
   
   if(role==='manager'){
      next()
   }
   else{
      res.json('not permisson')
   }
}

// course manager
app.get('/admin',checkLogin,(req,res,next)=>{
   var token = req.cookies.token;
   var decodeToken = jwt.verify(token,"mk");
   User.find({_id: decodeToken._id}).then(function(data) {
      
      if(data.length == 0){
         return res.redirect('/login');
      }
      else{
         if(data[0].role === 'manager' || data[0].role === 'training' || data[0].role === 'trainer'){
            res.params =data
           next()
         }
         else{
            return res.redirect('/login');
         }
      }
   })
},(req,res,next)=>{

  Course.find({})
      .then(courses=> res.render('admin/manager',{
         courses: mutipleMongooseToObject(courses),
         username: mutipleMongooseToObject(res.params),
         layout:false
      }))
      .catch(next)
  
  
})

// [Get]/ create
app.get('/create',checkLogin,(req,res,next)=>{
   res.render('courses/create',{layout:false})
})
// [Post]/ Store
app.post('/store',(req,res,next)=>{
   // console.log(req.body)
   const course = new Course(req.body)
      course.save()
      .then(()=> res.redirect('/admin'))
      .catch(error=>{console.log(error)})
})
// [GET]/ courses/:id/edit
app.get('/courses/:id/edit',checkLogin,(req,res,next)=>{
   Course.findById(req.params.id)
      .then(course=>res.render('courses/update',{
         course: mongooseToObject(course),
         layout:false
      }))
      .catch()
   
})
// [PUT]/ courses/:id
app.put("/courses/:id",checkLogin,(req,res,next)=>{
   Course.updateOne({_id: req.params.id},req.body)
      .then(()=> res.redirect('/admin'))
      .catch(next)
})
// [delete]/ courses/:id
app.delete("/courses/:id",checkLogin,checkTeacher,(req,res,next)=>{
   Course.deleteOne({_id: req.params.id})
      .then(()=> res.redirect('back'))
      .catch(next)
})
// [Get]/ employees
app.get('/employees',checkLogin,(req,res,next)=>{
   var token = req.headers.cookie.split("=")[1];
   var decodeToken = jwt.verify(token,"mk");
   User.find({_id: decodeToken._id}).then(function(data) {
      console.log(data)
      if(data.lenth == 0){
         return res.redirect('/login');
      }
      else{
         if(data[0].role == 'manager'){
            next()
         }
         else{
            return res.json({
               error:true,
               message: "you do not have access"

            })
         }
      }
   })
},(req,res,next)=>{
   User.find({grade: "employee"})
   .then(employees=> res.render('admin/employee',{
      employees: mutipleMongooseToObject(employees),
      layout:false
   }))
   .catch(err=>{
      console.log(err)
   })
})
// create employee
app.get('/create/employee',checkLogin,(req,res,next)=>{
   res.render('employee/create',{layout:false})
})
// [Post]/ employee
app.post('/store/employee',checkLogin,(req,res,next)=>{
   const user = new User(req.body)
      user.save()
      .then(()=> res.redirect('/employees'))
      .catch(error=>{console.log(error)})
})
// [GET]/store/employee/:id/edit
app.get('/store/employee/:id/edit',checkLogin,(req,res,next)=>{
   User.findById(req.params.id)
      .then(users=>res.render('employee/update',{
         users: mongooseToObject(users),
         layout:false
      }))
      .catch()
})
// [PUT]/store/employee/:id
app.put("/store/employee/:id",checkLogin,(req,res,next)=>{
   User.updateOne({_id: req.params.id},req.body)
      .then(()=> res.redirect('/employees'))
      .catch(next)
})
// [delete]/ courses/:id
app.delete("/store/employee/:id",checkLogin,checkTeacher,(req,res,next)=>{
   User.deleteOne({_id: req.params.id})
      .then(()=> res.redirect('back'))
      .catch(next)
})
// connect DB
db.connect()
// routes init
route(app)

app.listen(3000)