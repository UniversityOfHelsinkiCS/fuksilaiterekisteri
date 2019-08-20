const Router = require('express')
const userController = require('@controllers/userController')
const studentController = require('@controllers/studentController')
const authenticationMiddleware = require('@util/authenticationMiddleware')

const router = Router()

router.get('/', (req, res) => { res.send('root') })

router.use('/', authenticationMiddleware)

router.get('/ping', (req, res) => res.send('pong'))

router.post('/login', userController.getUser)
router.post('/request_device', userController.requestDevice)
router.post('/claim_device', userController.claimDevice)

router.get('/student/:studentNumber', studentController.getStudent)

router.use('*', (req, res) => res.sendStatus(404))

module.exports = router
