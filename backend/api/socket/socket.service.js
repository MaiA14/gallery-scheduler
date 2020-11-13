const socket = null;
const io = null;

const connectSockets = (io) => {
    this.io = io;

    this.io.on('connection', socket => {
        this.socket = socket;

        console.log('connects to socket')

        this.socket.on('join gallery', photo => {
            console.log(photo)

            if (this.socket.myTopic) {
                this.socket.leave(socket.myTopic)
            }
            this.socket.join(photo)
            this.socket.myTopic = photo;
        })
    })
}

const sendJob = (gif, jobId) => {
    this.io.to(this.socket.myTopic).emit('add photo', gif);
}

module.exports = {
    connectSockets,
    sendJob
}