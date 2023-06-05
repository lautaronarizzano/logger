import { Server } from 'socket.io'
import express from 'express'
import __mainDirname, { addLogger } from './utils/utils.js'
import errorHandler from './middlewares/errors/errors.js'
import config from './config/config.js'
import session from 'express-session'
import chatRouter from './routes/web/chat.router.js'
import productsRouter from './routes/api/products.router.js'
import cartsRouter from './routes/api/carts.router.js'
import viewsRouter from './routes/web/views.router.js'
import sessionsRouter from './routes/api/sessions.router.js'
import mockProductsRouter from './routes/api/mockproducts.router.js'
import loggerRouter from './routes/api/logger.router.js'
import usersRouter from './routes/api/users.router.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
// import Chats from './dao/dbManagers/chat.js'
// import messageModel from './dao/models/messageModel.js'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import cookieParser from 'cookie-parser'
import messagesManager from './controllers/chat.controller.js'
import CustomError from './services/errors/CustomError.js'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'


// const chatManager = new Chats()

const app = express()

const error = new CustomError()

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion del proyecto de ecommerce',
            description: 'API pensada para resolver el proceso del ecommerce'
        }
    },
    apis: [`${__mainDirname}/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__mainDirname}/public`))

app.use(cookieParser());

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
        mongoOptions: { useNewUrlParser: true },
        ttl: 3600
    }),
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: true
}));

//config passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//config de nuestras vistas
app.engine('handlebars', handlebars.engine())
app.set('views', `${__mainDirname}/views`)
app.set('view engine', 'handlebars')

app.use(addLogger)
app.use(errorHandler)
app.use('/chat', chatRouter)
app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/auth', sessionsRouter)
app.use('/mockingproducts', mockProductsRouter)
app.use('/loggerTest', loggerRouter)
app.use('/api/users', usersRouter)

const server = app.listen(Number(config.port), () => console.log(`Server running on port ${config.port}`))

const io = new Server(server)

// const messages = await chatManager.getMessages()

// io.on('connection', socket => {
//     socket.on('message', async data => {
//         messages.push(data)
//             await messageModel.create(data)
//             try {
//             await chatManager.addMessage(data)
//             const messages = await chatManager.getMessages().toObject()
//             console.log(messages)
//             io.emit('messageLogs', messages)
//             } catch (error) {
//                 console.log(error)
//             }

//     })
// })

io.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado. ID: ${socket.id}`)

    socket.on("message", async ({ user, message }) => {
        await messagesManager.addMessage({user, message})
        const messages = await messagesManager.getAll()

        io.emit("messageLogs", messages)
    })

    socket.on("authenticated", async (user) => {
        const messages = await messagesManager.getAll()
        socket.emit("messageLogs", messages)
        socket.broadcast.emit("newUserConnected", user)
    })
})

export { io }