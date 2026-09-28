const {Server}=require("socket.io")
const jwt=require("jsonwebtoken")

let io;

const initializeSocket=(server)=>{
    io=new Server(server,{
        cors:{
            origin:process.env.CLIENT_URL || "*",
            methods:["GET","POST","PUT","DELETE"],
        },
    })

    // Authenticate socket connections using JWT
    io.use(async(socket,next)=>{
        try {
            const token=socket.handshake.auth.token
            if(!token){
                return next(new Error("Authentication error: No token provided"))
            }
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            socket.userId=decoded.id
            next()
        } catch (err) {
            next(new Error("Authentication error: Invalid token"))
        }
    })

    io.on("connection",(socket)=>{
        console.log(`Socket connected: ${socket.id} | User: ${socket.userId}`)

        // Join user-specific room
        socket.join(`user:${socket.userId}`)

        socket.on("disconnect",()=>{
            console.log(`Socket disconnected: ${socket.id} | User: ${socket.userId}`)
        })
    })

    return io
}

const getIO=()=>{
    if(!io){
        throw new Error("Socket.IO not initialized")
    }
    return io
}

module.exports={initializeSocket,getIO}
