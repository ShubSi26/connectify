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

export const apiURL = atom({
    key:"api",
    default:"."
})

export const wsURL = atom({
    key:"ws",
    default:"wss://connectify.devshubh.live"
})