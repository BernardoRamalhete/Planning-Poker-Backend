const asyncHandler = require('express-async-handler')
const Room = require('../models/room')

const create = asyncHandler(async (req, res) => {
    const { timerInSeconds, cards } = req.body
    const userId = req.user._id

    if(!!!cards) {
        res.status(400)
        throw new Error('Please, select some cards')
    }

    const room = await Room.create({
        author: userId,
        cards,
        timerInSeconds,
    })

    if(room) {
        res.status(201).json(room)
    } else {
        res.status(400)
        throw new Error('Invalid room data')
    }
})

const getAll = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const rooms = await Room.find({ author: userId})

    res.status(200).json(rooms)
})

const getById = asyncHandler(async (req, res) => {
    const roomId = req.params.id

    const room = await Room.findOne({_id: roomId})

    if(!!room) {
        res.status(200).json(room)
    } else {
        res.status(404)
        throw new Error('Could not find room with id ' + roomId)
    }
})

const update = asyncHandler(async (req, res) => {
    const roomId = req.params.id
    const newRoomData = req.body

    const updatedRoom = await Room.findOneAndUpdate({ _id: roomId }, newRoomData, { new: true })

    if(updatedRoom) {
        res.status(200).json(updatedRoom)
    } else {
        res.status(404)
        throw new Error(`Couldn't find room with id ${roomId}`)
    }
})

const deleteById = asyncHandler(async (req, res) => {
    const roomId = req.params.id
    const userId = req.user._id

    const room = await Room.findById(roomId)

    if(!!room) {
        if(room.author.equals(userId)) {
            await Room.deleteOne({ _id: roomId })
        
            const success = await Room.countDocuments({ _id: roomId }) === 0
        
            if(success) {
                res.status(200).json({
                    success: true
                })
            } else {
                res.status(500)
                throw new Error("We had a problem deleting this room, please try again later")
            }
        } else {
            res.status(401)
            throw new Error('Not authorized')
        }
    } else {
        res.status(404)
        throw new Error("Couldn\'t find room with id " + roomId)
    }
    
})


module.exports = {
    create,
    getAll,
    getById,
    update,
    deleteById
}