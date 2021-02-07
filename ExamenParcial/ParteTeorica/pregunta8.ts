const a8 = {
    name: "Alberto",
    friends: ["Maria", "Jose"]
}

const b8 = a8
b8.friends[0] = "Jesus"

console.log(a8.friends[0])