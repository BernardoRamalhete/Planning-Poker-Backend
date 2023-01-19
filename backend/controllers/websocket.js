// const clients = new Map()
const clientsByRoom = {
    temp: new Map()
}
const roomsState = new Map()

const websocketController = (ws, request, client) => {

    clientsByRoom['temp'].set(ws, {})
    console.table(clientsByRoom.temp)

    ws.send(JSON.stringify({
        command: 'connected',
        data: null
    }))
    
    ws.on('message', (messageAsString) => {
        const messageContent = JSON.parse(messageAsString)
        
        if(messageContent.command) {

            switch(messageContent.command) {
                case 'update room state': {
                    const roomId = messageContent.data.id
                    const roomState = {
                        ...messageContent.data.info, 
                        updated_at: new Date()
                    }

                    if(roomState.state[0] == 'report') {
                        roomState['updated_at'] = null
                    }
                    roomsState.set(roomId, roomState)
                    if(roomId in clientsByRoom) {
                        Array.from(clientsByRoom[roomId].keys()).forEach((client) => {
                            if(client != ws) {
                                client.send(
                                    JSON.stringify({
                                        command: 'sync room',
                                        data: roomsState.get(roomId)
                                    })
                                )
                            }
                        })
                    }
                }
                    break;
                case 'update final decision': 
                    const roomId = messageContent.data.id
                    Array.from(clientsByRoom[roomId].keys()).forEach((client) => {
                        client.send(
                            JSON.stringify(
                                {
                                    command: 'update final decision',
                                    data: { card: messageContent.data.card }
                                }
                            )
                        )
                    })
                    break;
                case 'store user and send room state': {
                        const roomId = messageContent.data.roomId
                        if(!(roomId in clientsByRoom)) {
                            clientsByRoom[roomId] = new Map()
                        }

                        clientsByRoom[roomId].set(ws, messageContent.data.user)
                        
                        if(clientsByRoom['temp'].has(ws)) {
                            clientsByRoom['temp'].delete(ws)
                        }
                        
                        Array.from(clientsByRoom[roomId].keys()).forEach((client) => {
                            Array.from(clientsByRoom[roomId].values()).forEach((clientData) => {
                                client.send(
                                    JSON.stringify({
                                        command: 'upsert user',
                                        data: clientData
                                    })
                                )
                            })
                        })

                        ws.send(
                            JSON.stringify({
                                command: 'sync room',
                                data: roomsState.get(roomId)
                            })
                        )
                    }
                    break;
                case 'send card selection': {
                        const userData = messageContent.data.user
                        const roomId = messageContent.data.roomId

                        clientsByRoom[roomId].set(ws, userData)

                        Array.from(clientsByRoom[roomId].keys()).forEach((client) => {
                            client.send(
                                JSON.stringify({
                                    command: 'upsert user',
                                    data: userData
                                })
                            )
                        })
                    }
                    break;
                case 'bye bye': {
                    console.log('bye bye')
                    const roomId = messageContent.data.roomId
                    if(roomId in clientsByRoom) {
                        clientsByRoom[roomId].delete(ws)
                        if(clientsByRoom[roomId].size === 0) {
                            delete clientsByRoom[roomId]
                            roomsState.delete(roomId)
                        }
                    }
                }
                    break;
                default: console.log('Unknown command: ', messageContent.command)
            }

        } else {
            console.log('Missing command key: ', messageContent)
        }
    })
}

module.exports = {
    websocketController
}