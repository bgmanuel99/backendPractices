/*
La funcion forEach devuelve un void, por lo que b2 se inicializara con el valor undifined.
Aun asi la funcion forEach se ejecutara y en este caso sacara por pantalla los valores del array que ha llamado a la funcion.
*/

const a2 = [1,2,3,4,5,6]
const b2 = a2.forEach(e => console.log(e))
console.log(b2)