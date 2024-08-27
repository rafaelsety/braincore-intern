import { v4 as uuidv4 } from "uuid";

const clientMap = new Map();

let onlineUsers = 0;

const server = Bun.serve<{ username: string }>({
  port: 8080,
  fetch(req, server) {
    if (
      server.upgrade(req, {
        data: { username: "User_" + Math.random().toString(16).slice(12) },
      })
    ) {
      return;
    }
    const url = new URL(req.url);
    let path = url.pathname;
    if (path === "/") {
      return new Response(Bun.file("./public/index.html"));
    }
    if (path.startsWith("/")) {
      path = `./public${path}`;
    }
    return new Response(Bun.file(path));
  },
  websocket: {
    open(ws) {
      const clientId = uuidv4();
      const username = ws.data.username;
      clientMap.set(ws, { clientId, username });
      console.log(`Client Connected: ${clientId}`);
      ws.send(`Client Connected: ${username}`);

      //Display Online users
      onlineUsers++;
      ws.send(`Online Users: ${onlineUsers}`);
      ws.send("Welcome to the server");

      //Display new clients
      ws.subscribe("usersConnected");
      ws.publish("usersConnected", `${username} - is online`);

      //Broadcast message publicly
      ws.subscribe("broadcastMsg");

      const clientInfoMsg = {
        clientId: clientId,
        username: username,
      };
      ws.send(JSON.stringify(clientInfoMsg));
      const userList = Array.from(clientMap.values()).map((info) => {
        return {
          clientId: info.clientId,
          username: info.username,
        };
      });
      ws.subscribe("userList");
      server.publish("userList", JSON.stringify(userList));
    },
    close(ws) {
      const clientInfo = clientMap.get(ws);
      const clientId = clientInfo ? clientInfo.clientId : "unknown";
      const username = clientInfo ? clientInfo.username : "unknown";
      console.log(`Client Disconnected: ${clientId}`);
      clientMap.delete(ws);

      //Update the connected clients
      onlineUsers--;
      ws.send(`Online Users: ${onlineUsers}`);

      //Display disconnected client
      server.publish("usersConnected", `${username} - has left the chat`);

      const userList = Array.from(clientMap.values()).map(
        (info) => info.username
      );
      server.publish("userList", JSON.stringify(userList));
      ws.unsubscribe("See you");
    },
    message(ws, msg) {
      const clientInfo = clientMap.get(ws);
      const clientId = clientInfo ? clientInfo.clientId : "unknown";
      const username = clientInfo ? clientInfo.username : "unknown";
      const ackMsg = ws.send("Message delivered");

      //Broadcast message publicly
      server.publish(
        "broadcastMsg",
        JSON.stringify({
          type: "broadcastMsg",
          data: `${username} says : ${msg}`,
        })
      );
      if (ackMsg > 0) {
        //Message successfully delivered
        console.log(`Acknowledgement sent to client ${clientId}: ${msg}`);
      } else {
        //Message failed to delivered
        console.error(
          `Failed to deliver acknowledgement to client ${clientId}: ${msg}`
        );
      }
    },
  },
});
console.log(`Listening on localhost: ${server.port}`);
