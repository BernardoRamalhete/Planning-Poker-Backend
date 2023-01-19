const express  = require('express')
const WebSocket = require('ws')
const http = require('http')
const path = require('path')

const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const mongoUri = process.env.MONGO_URI
const mongoose = require('mongoose')
const { errorHandler } = require('./middleware/error') 
const cors = require('cors')

mongoose.set('strictQuery', true)
mongoose
    .connect(mongoUri)
    .then(() => console.log('Connected to Mongo DB'))
    .catch((e) => {
            throw new Error({message: e})
    })
const userRouter = require('./routes/user')
const roomRouter = require('./routes/room')


const app = express()

const server = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/room', roomRouter)


app.use(errorHandler)

server.listen(port, () => {
    console.log('Listening on port ' + port)
})

const { websocketController } = require('./controllers/websocket')

const wsServer = new WebSocket.Server({ server })

wsServer.on('connection', websocketController)
