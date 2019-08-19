const Router = require('express')
const messageController = require('@controllers/messageController')
const authenticationMiddleware = require('@util/authenticationMiddleware')

const router = Router()

router.get('/', (req, res) => { res.send('root') })

router.use('/', authenticationMiddleware)

router.get('/ping', (req, res) => res.send('pong'))

router.get('/messages', messageController.getMessages)
router.post('/messages', messageController.createMessage)

module.exports = router
