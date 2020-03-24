# Mon Petit Bac

"Mon Petit Bac" is a categories game made in Node, Vue.js and with websockets.

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
Go into the `front` folder, and do `npm install`
