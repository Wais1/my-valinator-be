const users = [];

// Join user to chat
const userJoin = (id, username, room) => {
    const user = { id, username, room, feelVal:null }

    users.push(user)

    return user;
}

// Get current user
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

// User leaves class
const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// Get room users
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room)
}

// List of random usernames
const randUsernames = [
    'Penguin',
    'Seahorse',
    'Jelly'
]
// Returns a random username for user
const getRandomUsername = () => {
    return randUsernames[Math.floor(Math.random()*randUsernames.length)];
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getRandomUsername
};