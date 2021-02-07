/*
Al crear b1 a partir de a1 de la manera: const b1 = a1, los dos tienen los mismos valores y tienen la misma referencia en memoria. Por eso si cambiamos el valor de alguno de los
dos objetos, los cambios se veran reflejados en el otro.
*/

const a1 = {
    name: "Alberto",
    friends: ["Maria", "Jose"]
}

const b1 = a1
b1.name = "Jesus"

console.log(a1.name)
console.log(b1.name)