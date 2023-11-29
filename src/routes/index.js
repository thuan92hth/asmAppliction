const siteRouter = require('./site')

function router(app) {
  
   
    app.use('/',siteRouter)
   
}
module.exports = router