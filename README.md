# Backend practices
This is a repository for javascript and typescript backends practices

<<<<<<< HEAD
### Como lanzar servidor deno y escucha del puerto para playground de GraphQL

Para hacer el lanzamiento del servidor junto con la conexion de la base de datos lo primero que hago es sacar del .env el nombre de la base de datos y de la url, creo el cliente de mongodb, me conecto con el cliente, saco la base de datos y la coleccion de TaskCollection(que sera la que pase al context).

Una vez terminado con la conexion a la base de datos, utilizo las funciones use de la variable instanciada con Application, que seran las que determinen los tiempos de respuesta de las respuestas.

Luego me creo una instancia de graphql para el router que tendra como parametros el Router, los types y resolvers(que he definido en carpetas separadas) y el context.

Para terminar en el middleware llamo a los metodos de routes y allowedMethods para el router y por ultimo pongo la aplicacion a escuchar en el puerto 8000, que sera en el que este escuchando el playground de GraphQL.
=======
### hola
>>>>>>> f1981042106fb4d30f23e1c6da644a13d2e36362
