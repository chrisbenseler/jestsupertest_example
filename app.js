const express = require('express')
const mongoose = require('mongoose')

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const User = require('./models/User')
const Post = require('./models/Post')

const app = express()

app.set('host', process.env.EXPRESS_HOST || '0.0.0.0')
app.set('port', process.env.EXPRESS_PORT || 8080)

const JWTSECRET  = process.env.EXPRESS_JWTSECRET || 'askncd90asujcsaknc29ues'

const mongodbUri = process.env.MONGOURL || 'mongodb://localhost:27017/nodejs_jestsupertestmongodb_example'
mongoose.connect(mongodbUri, { useNewUrlParser: true })
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully')
})
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error. Please make sure MongoDB is running.')
  process.exit()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

//add user to request if valid token is found
app.use( async (req, res, next) => {

    if(!req.headers['authorization'])
        return next()
    
    const bearer = req.headers['authorization'].split('Bearer ')[1]
    try {
        const decoded = await jwt.verify(bearer, JWTSECRET)
        const user = await User.findOne({ _id: decoded.id }, { password: 0 } )
        if(user)
            req.user = user
        next()
    } catch(e) {
        next()
    }
})

const isAuthenticated = (req, res, next) => {
    if(!req.user)
        res.status(401).json({ message: 'User must be authenticated' })
    next()
}

app.post('/users/signup', async (req, res, next) => {
    const { email, password } = req.body
    if(password != req.body.confirmPassword)
        res.status(403).json({status: 'NOK' })
    const u = new User({  email, password })
    try {
        await u.save()
        res.json({status: "ok" })
    } catch(e) {
        next(e)
    }
})

app.post('/users/signin', async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(401).json({status: "NOK" })
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch) {
            const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
            const token = jwt.sign({ id: user._id, exp }, JWTSECRET)
            const { id, name } = user
            res.status(200).json({
                id, name, token
            })
        } else {
            res.stattus(401).json({status: "NOK" })
        }
    })
})

app.post('/posts', isAuthenticated, async (req, res, next) => {
    const { title, content } = req.body
    const p = new Post({  title, content, user: req.user })
    try {
        await p.save()
        res.json(p)
    } catch(e) {
        next(e)
    }
})




if(process.env.NODE_ENV !== 'test')  {

    app.listen(app.get('port'), () => {
        console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'))
        console.log('Press CTRL-C to stop\n')
    })
}

module.exports = app