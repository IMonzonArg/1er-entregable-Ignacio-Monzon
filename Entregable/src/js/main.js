const socket = io()

socket.emit('movimiento', "Ca7")

socket.emit('rendirse', "Me he rendido")

socket.emit('mensaje-jugador', (info) => {
        console.log(info)
    })

socket.on('rendirse', info => {
    console.log(info)
})

