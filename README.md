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

Default port is `8081`, but you can call `node index.js -p PORT_NUMBER` to specify a port.
Note that you'll then have to change the used server address in the backend.

You can also specify a secure server by specifying the path to a cert and key file as is:
`node index.js --cert /path/to/cert.pem --key /path/to/key.pem`

Note that with a secure websocket server, the address starts with `wss://` instead of `ws://`.

You can call `node index.js -h` to see these options.

### Frontend

Go into the `front` folder, do `npm install` and `npx vue-cli-service build`. Launch the front HTTP server with `npx http-server dist/ -p 8080 --proxy "http://localhost:8080?"` (you can specify any port you want, but both in the -p and --proxy must match) or just put the `dist` folder behind any other HTTP server.

By default, the client will try to reach the backend at `ws://HOST:8081` where `HOST` is the URL of the client.
If reaching the client at `example.com`, by defaut it will try reaching `ws://example.com:8081`.

To change the URL and / or port of the backend, add a `.env.local` in the `front` folder with the path to the backend:

```
VUE_APP_BACK_HOST=ws://backend.example.com:9000
```

You can now open `http://localhost:8080` or whatever adress and port you set to reach the application

### Attributions

Pen icon in the logo made by Icongeek26 from www.flaticon.com
