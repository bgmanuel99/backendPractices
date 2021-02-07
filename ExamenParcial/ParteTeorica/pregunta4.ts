const a4 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("a"), 1000)
})

const b4 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("b"), 2000)
})

a4.then(param => console.log(param))
b4.then(param => console.log(param))
console.log("c")