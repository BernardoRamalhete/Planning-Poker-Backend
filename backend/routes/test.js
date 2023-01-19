const express = require('express')

const { 
    getTest,
    updateTest,
    deleteTest
 } = require('../controllers/test')

const router = express.Router()


router.get('/', getTest)

router.route('/:id').put(updateTest).delete(deleteTest)


module.exports = router