const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')

const register = asyncHandler(async (req, res) => {
    const { username } = req.body

    if(!!!username) {
        res.status(400)
        throw new Error('Please, enter an username')
    }

    const invalidUsername = await User.findOne({ username: username})

    if(invalidUsername) {
        res.status(406)
        throw new Error('Username already in use')
    }

    const user = await User.create({ username })

    if(user) {
        res.status(201).json({
            id: user._id,
            username: user.username,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

const login = asyncHandler(async (req, res) => {
    const { username } = req.body

    if(!!!username) {
        res.status(400)
        throw new Error('Please, enter an username')
    }

    const user = await User.findOne({ username: username})

    if(!!!user) {
        res.status(404)
        throw new Error('User with username ' + username + ' not found')
    }

    res.status(200).json({
        id: user._id,
        username: username,
        token: generateToken(user._id)
    })
})

const edit = asyncHandler(async (req, res) => {
    const { username } = req.body
    const userId = req.user._id

    if(!!!username) {
        res.status(400)
        throw new Error('Username field is required')
    }

    const user = await User.findOneAndUpdate({ _id: userId }, { username: username }, { new: true})

    if(!!!user) {
        res.status(404)
        throw new Error('User not found')
    } else {
        res.status(200).json(user)
    }
})

const upsert = asyncHandler(async (req, res) => {
    const { username } = req.body

    if(!!!username) {
        res.status(400)
        throw new Error('Please, enter an username')
    }

    const user = await User.findOne({ username })

    if(!!user) {
        res.status(200).json({
            id: user._id,
            username: username,
            token: generateToken(user._id)
        })
    } else {
        const createdUser = await User.create({ username })

        if(createdUser) {
            res.status(201).json({
                id: createdUser._id,
                username: createdUser.username,
                token: generateToken(createdUser._id)
            })
        } else {
            res.status(400)
            throw new Error('Invalid user data')
        }
    }

})

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET
    return jwt.sign({ id }, secret, {
        expiresIn: '30d'
    })
}

module.exports = {
    register,
    login,
    edit,
    upsert
}