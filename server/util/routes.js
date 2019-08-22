const Router = require('express')
const userController = require('@controllers/userController')
const studentController = require('@controllers/studentController')
const authenticationMiddleware = require('@util/authenticationMiddleware')
const { checkAdmin } = require('@util/adminMiddleware')
const { checkDistributor } = require('@util/distributorMiddleware')

const router = Router()

router.get('/', (req, res) => { res.send('root') })

router.use('/', authenticationMiddleware)

router.get('/ping', (req, res) => res.send('pong'))

router.post('/login', userController.getUser)
router.post('/request_device', userController.requestDevice)
router.post('/claim_device', checkDistributor, userController.claimDevice)
router.get('/user', checkAdmin, userController.getAllUsers)
router.post('/user/:id/staff', checkAdmin, userController.toggleStaff)
router.post('/user/:id/distributor', checkAdmin, userController.toggleDistributor)

router.get('/student/:studentNumber', checkDistributor, studentController.getStudent)
router.post('/student/:studentNumber/eligible', checkAdmin, studentController.markStudentEligible)

router.use('*', (req, res) => res.sendStatus(404))

module.exports = router
