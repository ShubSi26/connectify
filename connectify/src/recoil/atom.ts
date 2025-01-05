import {atom} from 'recoil';


export const logined = atom({
    key:"logined",
    default:false
})

export const user = atom({
    key:"user",
    default:{
        name:"",
        email:"",
        _id:""
    }
})

export const websocketstate = atom<WebSocket|null>({
    key:"websocketstate",
    default:null
})

export const WebRtcState = atom<RTCPeerConnection | null >({
    key: "WebRtcState",
    default: null, 
});

export const callerid = atom<String | null>({
    key:"caller",
    default:null,
})

export const apiURL = atom({
    key:"api",
    default:"https://api-connectify.onrender.com"
})

export const wsURL = atom({
    key:"ws",
    default:"wss://api-connectify.onrender.com"
})