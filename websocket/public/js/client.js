const ws = new WebSocket("ws://localhost:8080");

const btn = document.getElementById("btn");
const inputMsg = document.getElementById("txtMessage");

let clientId;

btn.addEventListener("click", (event) => {
  const msg = inputMsg.value;
  // const msgTemplate = document.getElementById("msg_template").innerHTML;
  // const msgContainer = document.getElementById("msg_container");
  // const html = ejs.render(msgTemplate, { message: msg });
  // msgContainer.insertAdjacentHTML("beforeend", html);

  ws.send(msg);
  inputMsg.value = "";
  inputMsg.focus();
  event.preventDefault();
});

ws.addEventListener("message", (e) => {
  const msg = e.data;
  try {
    const users = JSON.parse(msg);
    if (users.type === "broadcastMsg") {
      const msgTemplate = document.getElementById("msg_template").innerHTML;
      const msgContainer = document.getElementById("msg_container");
      const html = ejs.render(msgTemplate, { message: users.data });
      msgContainer.insertAdjacentHTML("beforeend", html);
    }

    if (users.clientId) {
      clientId = users.clientId;
      return;
    }

    if (Array.isArray(users)) {
      users.forEach((user) => {
        if (user.clientId === clientId) {
          user.self = true;
          user.username = `${user.username} (self)`;
        }
      });
      users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });

      const userListTemplate =
        document.getElementById("userList_template").innerHTML;
      const userContainer = document.getElementById("user_container");
      const html = ejs.render(userListTemplate, { users });
      userContainer.innerHTML = html;
      return;
    }
  } catch (e) {
    console.log(msg);
  }
});
