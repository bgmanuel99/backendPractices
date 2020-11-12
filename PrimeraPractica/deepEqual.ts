// El codigo lo voy a explicar en español porque tiene muchas variables y salidas posibles durante la ejecucion del programa y prefiero no dejarme nada sin detalle.
// Para hacerlo mas legible, la explicacion estara arriba de cada funcion con numeros para cada comentario.

/*
Funcion deepPrint: La funcion deepPrint recorre un objeto que se pasa por parametro en profundidad y a medida que se va recorriendo se van sacando por pantalla sus distintos
atributos y valores. La funcion no devuelve nada por lo que su tipo es void.
Funciones de cada linea:
1. Durante el recorrido en profundidad del objeto puede que los atributos tengan como valores arrays multidimensionales que para poder recorrerlos en profundidad utilizo la
misma funcion deepPrint. Al ser el tipo de un array y un objeto el mismo --> object, para saber que tipo de recorrido se tiene que hacer para el objeto, primero miro
si el objeto pasado es un array o un objeto, operando de diferente manera para cada uno de ellos. Esto lo hago tambien en las otras dos funciones.
2. Recorro los elementos del array, si el elemento es un objeto o otro array, se llama recursivamente a la funcion, en caso de ser uno de los tres tipos basicos se saca por
pantalla.
3. En caso de ser un objeto, recorro sus atributos con la funcion keys.
4. Si el valor del atributo es un array, si su dimension es 0 se saca el atributo y el valor directamente,
en caso contrario, recorro sus elementos; En caso de encontrarme con otro array o un objeto, llamo recursivamente a la funcion, y en caso de ser uno de los tres tipos basicos,
lo saco por pantalla.
5. En caso de ser un objeto, llamo recursivamente a la funcion para que recorra sus atributos.
6. En caso de ser uno de los tres tipos basicos, lo saco por pantalla.
*/
const deepPrint = (obj: object): void => {
    if(Array.isArray(obj)){ // 1
        console.log("[")
        for(let elem of obj){ // 2
            if(Array.isArray(elem)){
                deepPrint(elem)
            }else if (typeof elem === "object"){
                console.log("{")
                deepPrint(elem)
                console.log("}")
            }else if(elem === "string" || "number" || "boolean") console.log(`${elem}`)
        }
        console.log("]")
    }else { // 3
        for(let key of Object.keys(obj)){
            if (Array.isArray(obj[key])){ // 4
                if(obj[key].lenght !== 0){
                    console.log(`${key}: [`)
                    for(let elem of obj[key]){
                        if(Array.isArray(elem)) deepPrint(elem)
                        else if(typeof elem === "object"){
                            console.log("{")
                            deepPrint(elem)
                            console.log("}")
                        }else if(typeof elem === "string" || "number" || "boolean") console.log(`${elem}`)
                    }
                    console.log("]")
                }else console.log(`${key}: ${obj[key]}`)
            }else if (typeof obj[key] === "object") { // 5
                console.log(`${key}: {`)
                deepPrint(obj[key])
                console.log("}")
            }else if (typeof obj[key] === "string" || "number" || "boolean") console.log(`${key}: ${obj[key]}`) // 6
        }
    }
}

/*
Funcion deepClone: La funcoin deepClone recibe como parametro un objeto y creara otro a partir de este, que acabara devolviendo como valor de la funcion.
La funcion es muy similar a la de print pero en vez de sacar valores por pantalla, crea un nuevo atributo con sus diferentes valores, a partir del pasado por parametro,
para el nuevo objeto que se tiene que devolver en la funcion.
Para ello utilizo la funcion estatica de la clase Object --> defineProperty() que recibe como parametros el objeto al que se referencia, el nombre del atributo nuevo o
que vaya a ser modificado y por ultimo el valor para el atributo.
En este caso lo que recorro en profundidad es el objeto pasado por parametro, por lo que el objeto final que se devolvera lo tengo que modificar en el nivel de la
recursividad "mas alto". Por eso para los arrays, lo que hago es crear un array auxiliar al que ire metiendo los diferentes valores que se encuentre durante el recorrido en
profundidad. Una vez terminado todo el recorrido, termino creando un nuevo atributo con el array auxiliar como valor, que contendra cualquier otro valor de cualquier
profundidad.
En caso de encontrarme arrays multidimensionales hago como antes, creo un array auxiliar en el que ire metiendo los valores de todas la profundidades, y acabo
por devolverlo.
*/
const deepClone = (obj: object): object => {
    var newObject: object = {}

    if(Array.isArray(obj)){
        let auxArr = []
        for(let elem of obj){
            if(Array.isArray(elem) || typeof elem === "object") auxArr.push(deepClone(elem))
            else if(typeof elem === "string" || "number" || "boolean") auxArr.push(elem)
        }
        return auxArr
    }else{
        for(let i: number = 0; i < Object.keys(obj).length; i++){
            let atribute: string = Object.keys(obj)[i]
            if(Array.isArray(obj[atribute])){
                if(obj[atribute].length !== 0){
                    let auxArr = []
                    for(let elem of obj[atribute]){
                        if(typeof elem === "object") auxArr.push(deepClone(elem))
                        else if(typeof elem === "string" || "number" || "boolean") auxArr.push(elem)
                    }
                    Object.defineProperty(newObject, atribute, {value: auxArr, writable: true, enumerable: true, configurable: true})
                }else Object.defineProperty(newObject, atribute, {value: [], writable: true, enumerable: true, configurable: true})
            }else if(typeof obj[atribute] === "object"){
                Object.defineProperty(newObject, atribute, {value: deepClone(obj[atribute]), writable: true, enumerable: true, configurable: true})
            }else if(typeof obj[atribute] === "string" || "number" || "boolean"){
                Object.defineProperty(newObject, atribute, {value: obj[atribute], writable: true, enumerable: true, configurable: true})
            }
        }
    }
    return newObject
}

/*
Funcion deepEqual: La funcion deepEqual recibe como parametro dos objetos que ira comparando en profundidad y la funcion devolvera true en caso de ser todos sus valores
iguales y falso en caso contrario.
La funcion se comporta de manera similar a las otras dos.
Funcion de las lineas:
1. En caso de haber un array multidimensional se mira si los objetos pasados son arrays o objetos.
2. En caso de ser un array, miro si sus dimensiones son cero, si es asi devuelve true, en caso contrario miro si tienen diferentes dimensiones, en ese caso devuelve false, y
en ultima instancia(querra decir que los arrays contienen datos y tendran la misma dimension) recorro sus elementos, si el elemento es otro array o un objeto llamo recursivamente
a la funcion, si es uno de los tres tipos basicos, los comparo.
3. En caso de ser un objeto, ejecuto los mismos comandos que en las otras dos funciones, con el cambio de que aqui tambien miro ademas si los atributos tienen el mismo nombre.
Ademas antes de entrar a comparar cualquier elemento del objeto siempre miro que ambos sean del mismo tipo, si no directamente devuelvo false para ahorrar tiempo de ejecucion.
*/
const deepEqual = (obj1: object, obj2: object): boolean => {
    if(Array.isArray(obj1) && Array.isArray(obj2)){ // 1
        // 2
        if(obj1.length === 0 && obj2.length === 0) return true
        else if(obj1.length != obj2.length) return false
        else{
            for(let i: number = 0; i < obj1.length; i++){
                if((Array.isArray(obj1[i]) && Array.isArray(obj2[i])) ||
                  ((typeof obj1[i] === "object" && !Array.isArray(obj1[i])) &&
                  (typeof obj2[i] === "object" && !Array.isArray(obj2[i])))){
                    const result: boolean = deepEqual(obj1[i], obj2[i])
                    if(result) continue
                    else return result
                }else if((typeof obj1[i] === "string" || "number" || "boolean") && (typeof obj2[i] === "string" || "number" || "boolean")){
                    if(obj1[i] === obj2[i]) continue
                    else return false
                }
            }
        }
    }else{ // 3
        if(Object.keys(obj1).length === Object.keys(obj2).length){
            for(let i: number = 0; i < Object.keys(obj1).length; i++){
                const atributeObj1: string = Object.keys(obj1)[i], atributeObj2: string = Object.keys(obj2)[i]
                if(atributeObj1 === atributeObj2){
                    if(Array.isArray(obj1[atributeObj1]) && Array.isArray(obj2[atributeObj2])){
                        if(obj1[atributeObj1].length === 0 && obj2[atributeObj2].length === 0) continue
                        else if(obj1[atributeObj1].length != obj2[atributeObj2].length) return false
                        else{
                            for(let j: number = 0; j < obj1[atributeObj1].length; j++){
                                if((Array.isArray(obj1[atributeObj1][j]) && Array.isArray(obj2[atributeObj2][j])) ||
                                  ((typeof obj1[atributeObj1][j] === "object" && !Array.isArray(obj1[atributeObj1][j])) && 
                                  (typeof obj2[atributeObj2][j] === "object" && !Array.isArray(obj2[atributeObj2][j])))){
                                    const result: boolean = deepEqual(obj1[atributeObj1][j], obj2[atributeObj2][j])
                                    if(result) continue
                                    else return result
                                }else if((obj1[atributeObj1][j] === "string" || "number" || "boolean") && (obj2[atributeObj2][j] === "string" || "number" || "boolean")){
                                    if(obj1[atributeObj1][j] === obj2[atributeObj2][j]) continue
                                    else return false
                                }else return false
                            }
                        }
                    }else if((typeof obj1[atributeObj1] === "object" && !Array.isArray(obj1[atributeObj1])) && 
                            (typeof obj2[atributeObj2] === "object" && !Array.isArray(obj2[atributeObj2]))){
                        const result: boolean = deepEqual(obj1[atributeObj1], obj2[atributeObj2])
                        if(result) continue
                        else return result
                    }else if((typeof obj1[atributeObj1] === "string" || "number" || "boolean") && (typeof obj2[atributeObj2] === "string" || "number" || "boolean")){
                        if(obj1[atributeObj1] === obj2[atributeObj2]) continue
                        else return false
                    }else return false
                }else return false
            }
        }else return false
    }

    return true
}

console.log("PRIMER EJEMPLO")
console.log("--------------")

const person1: object = {
    name: "Manuel",
    age: 20,
    car: true,
    parents: [{name: "Miguel", age: 56, childs: 2}, {name: "Soledad", age: 56, childs: 2}],
    friends: [{name: "Elena", age: 20}, {name: "Fer", age: 20}]
}

console.log("\nPerson 1:")
deepPrint(person1)

const person2: object = deepClone(person1)

console.log("\nPerson 2:")
deepPrint(person2)

console.log("\nAre person1 and person2 equal?: " + deepEqual(person1, person2))

console.log("\nSEGUNDO EJEMPLO")
console.log("---------------")

const animal1: object = {
    name: "Jeminy",
    type: "dog",
    age: 10,
    chip: [[3], [5], [1]],
    meal: [{name: "bone", weigth: 10}, {name: "meat", weigth: 20}],
    extraData: [[[13], [{age: 3}]], [[2], [{age: 1}]]]
}

console.log("\nAnimal:")
deepPrint(animal1)

const animal2: object = deepClone(animal1)

console.log("\nAre animal1 and animal2 equal?: " + deepEqual(animal1, animal2))

console.log("\nTERCER EJEMPLO")
console.log("--------------")

const diffencies1: object = {
    temperature: 22,
    humidity: 12,
    color: "gray"
}

const diffencies2: object = {
    temperature: 22,
    humidity: 12,
    color: "blue"
}

const diffencies3: object = {
    temperature: 22,
    humidity: 12,
    color: "blue"
}

console.log("\nAre differencies1 and differencies2 equal?: " + deepEqual(diffencies1, diffencies2))
console.log("\nAre differencies1 and differencies3 equal?: " + deepEqual(diffencies1, diffencies3))
console.log("\nAre differencies2 and differencies3 equal?: " + deepEqual(diffencies2, diffencies3))