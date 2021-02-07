const a5 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("a"), 1000)
})

const c = await a5
console.log(c)
console.log("b")