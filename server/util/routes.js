const Router = require('express')
const messageController = require('@controllers/messageController')
const userController = require('@controllers/userController')
const authenticationMiddleware = require('@util/authenticationMiddleware')

const router = Router()

router.get('/', (req, res) => { res.send('root') })

router.use('/', authenticationMiddleware)

router.get('/ping', (req, res) => res.send('pong'))

router.post('/login', userController.getUser)
router.post('/device_request', userController.requestDevice)

router.get('/messages', messageController.getMessages)
router.post('/messages', messageController.createMessage)

router.use('*', (req, res) => res.sendStatus(404))

module.exports = router
