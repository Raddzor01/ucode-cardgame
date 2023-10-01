const matchQueue = [];

export default class MatchQueue {
    enqueue(player) {
        matchQueue.push(player);
    }
    dequeue() {
        return matchQueue.shift();
    }
    getLength() {
        return matchQueue.length;
    }

    removePlayerById(id) {
        const index = matchQueue.findIndex(player => player.id === id);
        if (index !== -1) {
            matchQueue.splice(index, 1);
            return true;
        }
        return false;
    }
}