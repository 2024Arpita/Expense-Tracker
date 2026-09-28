import {createContext,useContext,useEffect,useRef} from "react"
import {io} from "socket.io-client"
import {BASE_URL} from "../utils/apiPaths"
import {UserContext} from "./UserContext"
import toast from "react-hot-toast"

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext=createContext(null)

const SocketProvider=({children})=>{
    const {user}=useContext(UserContext)
    const socketRef=useRef(null)

    useEffect(()=>{
        const token=localStorage.getItem("authToken")

        if(!user || !token){
            // Cleanup socket when user logs out
            if(socketRef.current){
                socketRef.current.disconnect()
                socketRef.current=null
            }
            return
        }

        // Don't reconnect if already connected
        if(socketRef.current?.connected) return

        const socket=io(BASE_URL,{
            auth:{token},
            reconnection:true,
            reconnectionAttempts:5,
            reconnectionDelay:1000,
        })

        socket.on("connect",()=>{
            console.log("Socket connected:",socket.id)
        })

        socket.on("budget:warning",(data)=>{
            toast(data.message,{
                icon:"⚠️",
                duration:6000,
                style:{
                    background:"#fef3c7",
                    color:"#92400e",
                    border:"1px solid #f59e0b",
                },
            })
        })

        socket.on("budget:exceeded",(data)=>{
            toast.error(data.message,{
                duration:8000,
                style:{
                    background:"#fee2e2",
                    color:"#991b1b",
                    border:"1px solid #ef4444",
                },
            })
        })

        socket.on("connect_error",(err)=>{
            console.error("Socket connection error:",err.message)
        })

        socket.on("disconnect",(reason)=>{
            console.log("Socket disconnected:",reason)
        })

        socketRef.current=socket

        return ()=>{
            socket.disconnect()
            socketRef.current=null
        }
    },[user])

    return(
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
