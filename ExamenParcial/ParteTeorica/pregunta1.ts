/*
Una funcion que devuelve otra funcion se llama clousure, y la funcion devuelta heradara los parametros que reciva la primera funcion
*/

const a  = (param: string) => {
    return (param2: string) => console.log(`hola ${param} ${param2}`)
}

/*
Forma compacta de la funcion:
const a = (param: string) => (param2: string) => console.log(`hola ${param} ${param2}`)
*/

const b = a("manu")
b("barrenechea")