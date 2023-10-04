import controller from "../controllers/socketController.js";

export default function socketRouter(io, socket) {
    let userData = {};

    socket.on("getUserData", async (data) => {
        userData = await controller.getUserData(io, socket, data);
    });

    socket.on("findGame", async (data) => {
        userData = await controller.findGame(io, socket, data, userData);
    });

    socket.on("connectToRoom", (data) => {
        userData = controller.connectToRoom(io, socket, data, userData);
    });

    socket.on("cancelSearch", async (data) => {
        await controller.cancelSearch(io, socket, data);
    });

    socket.on("disconnect", async () => {
        await controller.disconnect(io, socket, userData);
    });

    socket.on("endTurn", async () => {
       await controller.endTurn(io, socket, userData);
    });

    socket.on("placeCard", async (data) => {
       await controller.placeCard(socket, data, userData.roomNbr);
    });

    socket.on("attack", async (data) => {
        await controller.attack(io, socket, data, userData);
    });
}