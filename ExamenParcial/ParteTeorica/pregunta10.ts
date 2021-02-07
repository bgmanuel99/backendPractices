const a10 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("a"), 1000)
})

const b10 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("b"), 2000)
})

const c10 = await Promise.all([a10, b10])
c10.forEach(d => console.log(d))

console.log("c")