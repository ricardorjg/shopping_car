const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const { unknownEndPoint, errorHandler } = require('./utils/middleware')

const itemRouter = require('./controllers/Item')
const userRouter = require('./controllers/User')

const app = express()

console.log(`connecting to ${config.MONGODB_URI}`)

mongoose
    .connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('connected to MongoDB'))
    .catch(error => console.log('error connecting to MongoDB', error.message))

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

app.use('/api/users', userRouter)
app.use('/api/items', itemRouter)

app.use(unknownEndPoint)
app.use(errorHandler)

module.exports = app
