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
    default:"https://verbose-tribble-x7q9gx44w6vhqww-3000.app.github.dev"
})

export const wsURL = atom({
    key:"ws",
    default:"wss://verbose-tribble-x7q9gx44w6vhqww-3000.app.github.dev"
})