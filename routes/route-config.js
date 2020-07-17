const authRoute = require('./api/auth')
const indexRoute = require('./index')
const userRoute = require('./users')

module.exports = (app)=>{
    app.use('/auth',authRoute)
    .use('/', indexRoute)
    .use('/users', userRoute);
}