/*
deepPrint function: The deepPrint function goes deep over an object, passed as parameter to the function, printing its values and atributes. The function returns nothing,
so its type is void.
*/
const improvedDeepPrint = (obj: object): void => {
    if(Array.isArray(obj)){ // Enters here if its and array(used when there are arrays inside the object)
        console.log("[")
        obj.forEach(elem => { // Goes over its elements. If its an array or an object, it recursively calls to the function. If its a basic type, it prints the element.
            if(Array.isArray(elem)){
                improvedDeepPrint(elem)
            }else if (typeof elem === "object"){
                console.log("{")
                improvedDeepPrint(elem)
                console.log("}")
            }else if(elem === "string" || "number" || "boolean") console.log(`${elem}`)
        })
        console.log("]")
    }else { // Enters here if its an object
        // I go over the object atributes. I first print the name of the atribute, then if its an array or an object I recursively call to the function, otherwise if its
        // a basic type, it prints the element.
        Object.keys(obj).forEach(key => {
            if (Array.isArray(obj[key])){
                if(obj[key].lenght !== 0){
                    console.log(`${key}:`)
                    improvedDeepPrint(obj[key])
                }else console.log(`${key}: ${obj[key]}`)
            }else if (typeof obj[key] === "object") {
                console.log(`${key}: {`)
                improvedDeepPrint(obj[key])
                console.log("}")
            }else if (typeof obj[key] === "string" || "number" || "boolean") console.log(`${key}: ${obj[key]}`)
        })
    }
}

/*
deepClone function: The deepClone function recieves as parameter an object, and the function will create another from it, that will finally return as the value of
the function.

The function works most likely like the deepPrint function, but instead of printing the elements, it creates the atributes for the new object.
*/
const improvedDeepClone = (obj: object): object => {
    var newObject: object = {}

    if(Array.isArray(obj)){
        let auxArr = []
        if(obj.length !== 0){
            obj.forEach(elem => {
                if(Array.isArray(elem) || typeof elem === "object") auxArr.push(improvedDeepClone(elem))
                else if(typeof elem === "string" || "number" || "boolean") auxArr.push(elem)
            })
        }
        return auxArr
    }else{
        Object.keys(obj).forEach(key => {
            if(typeof obj[key] === "object"){
                Object.defineProperty(newObject, key, {value: improvedDeepClone(obj[key]), writable: true, enumerable: true, configurable: true})
            }else if(typeof obj[key] === "string" || "number" || "boolean"){
                Object.defineProperty(newObject, key, {value: obj[key], writable: true, enumerable: true, configurable: true})
            }
        })
    }
    return newObject
}

/*
deepEqual function: The deepEqual function receives as parameter two objects that will deeply compare, and it will return true or false in case they are equal or
not respectively.

Its works as the other two functions. It goes deep over the object, but in this case goes comparing the value of the atributes.
*/
const improvedDeepEqual = (obj1: object, obj2: object): boolean => {
    if(Array.isArray(obj1) && Array.isArray(obj2)){
        if(obj1.length === 0 && obj2.length === 0) return true // Looks if the length of the arrays are 0, in which case, it returns true
        else if(obj1.length != obj2.length) return false // Then it looks if they have the same lenght
        else{
            for(let i: number = 0; i < obj1.length; i++){
                if(typeof obj1[i] === "object" && typeof obj2[i] === "object"){
                    const result: boolean = improvedDeepEqual(obj1[i], obj2[i])
                    if(result) continue
                    else return result
                }else if((typeof obj1[i] === "string" || "number" || "boolean") && (typeof obj2[i] === "string" || "number" || "boolean")){
                    if(obj1[i] === obj2[i]) continue
                    else return false
                }
            }
        }
    }else{
        if(Object.keys(obj1).length === Object.keys(obj2).length){ // Compare if both objects have the same number of atributes
            for(let i: number = 0; i < Object.keys(obj1).length; i++){
                const atributeObj1: string = Object.keys(obj1)[i], atributeObj2: string = Object.keys(obj2)[i]
                if(atributeObj1 === atributeObj2){ // Compares if the name of the atributes are the same
                    if(typeof obj1[atributeObj1] === "object" && typeof obj2[atributeObj2] === "object"){
                        // In this case, i have to get the return value of the function, to know if its true or false when it does the deep comparation of the object values.
                        const result: boolean = improvedDeepEqual(obj1[atributeObj1], obj2[atributeObj2])
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

const improvedPerson: object = {
    name: "Manuel",
    age: 20,
    car: true,
    parents: [{name: "Miguel", age: 56, childs: 2}, {name: "Soledad", age: 56, childs: 2}],
    friends: [{name: "Elena", age: 20}, {name: "Fer", age: 20}]
}

const improvedAnimal: object = {
    name: "Jeminy",
    type: "dog",
    age: 10,
    chip: [[3], [5], [1]],
    meal: [{name: "bone", weigth: {first: 87, second: [88]}}, {name: "meat", weigth: 20}],
    extraData: [[[13], [{age: 3}]], [[2], [{age: [1]}]]]
}

const improvedDiffencies1: object = {
    temperature: 22,
    humidity: 12,
    color: "gray"
}

const improvedDiffencies2: object = {
    temperature: 22,
    humidity: 12,
    color: "blue"
}

const improvedDiffencies3: object = {
    temperature: 22,
    humidity: 12,
    color: "blue"
}

console.log("PRIMER EJEMPLO")
console.log("--------------")

console.log("Person:")
improvedDeepPrint(improvedPerson)

console.log("\nAnimal:")
improvedDeepPrint(improvedAnimal)

console.log("\nSEGUNDO EJEMPLO")
console.log("---------------")

const improvedPerson2: object = improvedDeepClone(improvedPerson)
const improvedAnimal2: object = improvedDeepClone(improvedAnimal)

console.log("Second person:")
improvedDeepPrint(improvedPerson2)

console.log("\nAre person and person2 equal?: " + improvedDeepEqual(improvedPerson, improvedPerson2))
console.log("\nAre animal and animal2 equal?: " + improvedDeepEqual(improvedAnimal, improvedAnimal2))

console.log("\nTERCER EJEMPLO")
console.log("--------------")

console.log("\nAre differencies1 and differencies2 equal?: " + improvedDeepEqual(improvedDiffencies1, improvedDiffencies2))
console.log("\nAre differencies1 and differencies3 equal?: " + improvedDeepEqual(improvedDiffencies1, improvedDiffencies3))
console.log("\nAre differencies2 and differencies3 equal?: " + improvedDeepEqual(improvedDiffencies2, improvedDiffencies3))