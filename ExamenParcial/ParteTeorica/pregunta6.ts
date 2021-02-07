const a6 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("a"), 1000)
})

const b6 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("b"), 2000)
})

Promise.all([a6, b6]).then(c6 => {
    c6.forEach(d => console.log(d))
})

console.log("c")