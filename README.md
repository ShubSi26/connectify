# <img src="https://github.com/ShubSi26/connectify/blob/main/connectify/src/assets/logo.png" alt="Connectify" width="35" /> Connectify

![](https://github.com/ShubSi26/connectify/blob/main/images/homepage.jpg)
Deployment - https://connectify.devshubh.live

More images - [Click Here](https://github.com/ShubSi26/connectify/tree/main/images)

# Technology Used
<img src="https://skillicons.dev/icons?i=mongodb,express,react,nodejs,tailwind,vite,ts,js,cloudflare,npm,docker " /> <img src = "https://jwt.io/img/pic_logo.svg" width = 50px> <img src = "https://zod.dev/_next/image?url=%2Flogo%2Flogo-glow.png&w=640&q=100" width = 50px>

|`mongodb`|`express`|`react`|`nodejs`|`tailwindcss`|`vite`|`typescript`|`cloudflare`|`javascript`|`Docker`|`JWT`|`ZOD`|
|---|---|---|---|---|---|---|---|---|---|---|---|

# Architecture

![](https://github.com/ShubSi26/connectify/blob/main/images/hld.png)

# Key Features
- ### Peer-to-Peer Video Calling with WebRTC
  Connectify leverages WebRTC to establish a direct peer-to-peer video and audio connection between users. This ensures low-latency, high-quality communication without routing media through a server, making the experience faster and more secure.
- ###  Real-Time Signaling via WebSocket
  For initiating and managing video calls, Connectify uses a WebSocket connection to handle the signaling process. This real-time, bidirectional communication channel ensures that connection requests, answers, and ICE candidates are exchanged quickly and reliably.
- ### Secure Authentication with JWT and Cookies
  Authentication is handled through JSON Web Tokens (JWT) stored in HTTP-only cookies, offering a secure and stateless login system. This setup prevents common attacks like XSS and allows for persistent sessions across browser refreshes.
- ### Email-Based User Discovery and Requests
  Users can find each other by email and send connection requests, making it easy to connect with known contacts. This feature simplifies the onboarding process and creates a social aspect to the platform, promoting repeated use and easy expansion of the user base.
- ### Custom Domain & Cloudflare Deployment
  The application is deployed using Cloudflare on a custom domain, which improves performance with global CDN caching and enhances security with DDoS protection and SSL support. This ensures users experience fast and secure access from anywhere in the world.
