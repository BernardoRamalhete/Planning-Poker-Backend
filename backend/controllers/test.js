const asyncHandler = require('express-async-handler')

const getTest = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: 'Using a controller now 8)'
    })
})

const updateTest = asyncHandler(async (req, res) => {
    res.status(201).json({
        message: "Updating a test",
        id: req.params.id
    })
})

const deleteTest = asyncHandler(async (req, res) => {
    res.status(201).json({
        message: "Deleting a test",
        id: req.params.id
    })
})

module.exports = {
    getTest,
    updateTest,
    deleteTest
}