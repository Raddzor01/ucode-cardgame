

import controller from "../controllers/socketController.js";

export default function socketRouter(io, socket) {
    let userData = {};
    socket.on("getUserData", (data) => {
        userData = controller.getUserData(io, socket, data);
    });
}