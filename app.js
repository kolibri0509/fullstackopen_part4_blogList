const express = require('express')
require('express-async-errors')
const app = express()
const blogsRouter = require('./controllers/router')
const authorsRouter = require('./controllers/authors')
const loginRouter = require('./controllers/login')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

mongoose.set('strictQuery', false)
console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(middleware.tokenUserExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)

module.exports = app