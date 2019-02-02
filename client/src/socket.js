import io from "socket.io-client";
// const socket = io(":5000", { secure: true, reconnect: true });
const socket = io();

export default socket;
