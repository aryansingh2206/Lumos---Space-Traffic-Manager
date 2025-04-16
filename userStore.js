let users = [];

function addUser(address, role) {
  const alreadyExists = users.find((u) => u.address.toLowerCase() === address.toLowerCase());
  if (!alreadyExists) {
    users.push({ address, role });
  }
}

function getUsers() {
  return users;
}

module.exports = { addUser, getUsers };
