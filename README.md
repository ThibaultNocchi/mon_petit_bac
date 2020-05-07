# Mon Petit Bac

<p align="center">
  <img src="./logo.svg" />
</p>

<p align="center">
  "Mon Petit Bac" is a categories game made in Node, Vue.js and with websockets.
</p>

## Deployment

You'll need to have `node` and `npm` installed on your machine. Then, clone the project on your host: `https://github.com/ThibaultNocchi/mon_petit_bac.git`

### Backend
Go into the `back` folder, and do `npm install`. Wait for it to complete, and then you can run `node index.js`.

You can change the server port by editing this line in `index.js`:
```javascript
const wss = new WebSocket.Server({ port: 8081 })
```
Note that you'll then have to change the hardcoded server port in the frontend.

### Frontend
Go into the `front` folder, do `npm install` and `npx vue-cli-service build`. Launch the front HTTP server with `npx http-server dist/ -p 8080 --proxy "http://localhost:8080?"` (you can specify any port you want, but both in the -p and --proxy must match) or just put the `dist` folder behind any other HTTP server.

If you changed the backend port, you can change specify it in `src/main.js`:
```javascript
let socketUrl = "ws://" + window.location.hostname + ":8081";
```

You can now open `http://localhost:8080` or whatever adress and port you set to reach the application

### Attributions
Pen icon in the logo made by Icongeek26 from www.flaticon.com
