const express = require('express')
const { protect } = require('../middleware/auth')
const { 
    register,
    login,
    edit,
    upsert
 } = require('../controllers/user')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/', upsert)
router.put('/update', protect, edit)

module.exports = router