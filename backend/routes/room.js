const express = require('express')
const { protect } = require('../middleware/auth')

const {
    create,
    getAll,
    getById,
    update,
    deleteById
} = require('../controllers/room')

const router = express.Router()

router.post('/create', protect, create)

router.get('/', protect, getAll)

router.get('/:id', getById)

router.put('/update/:id', protect, update)

router.delete('/delete/:id', protect, deleteById)

module.exports = router