### Como lanzar servidor deno y escucha del puerto para playground de GraphQL

Para hacer el lanzamiento del servidor junto con la conexion de la base de datos lo primero que hago es sacar del .env el nombre de la base de datos y de la url, creo el cliente de mongodb, me conecto con el cliente, saco la base de datos.

En el primer middleware para esta practica lo que hago es mirar si el nombre de la operacion es IntrospectionQuery para que pueda funcionar el playground la primera vez que entro. Luego miro si las operaciones que se intentan ejecutar son las de crear o borrar un usario, para ello tambien miro si el usuario autenticado es un ADMIN. Si no son ninguna de esas dos operaciones, miro si es la de login, la de login no necesita ninguna autenticacion ni ningun role de usuario especifico. Y si no es ninguna de esas tres quiere decir que el usuario intenta ejecutar cualquiera de las otras operaciones y siempre y cuando ya este autenticado podra ejecutarlas y si no le dara un error de falta de autenticacion.

Luego me creo una instancia de graphql para el router que tendra como parametros el Router, los types, resolvers(que he definido en carpetas separadas), el context, la base de datos y el usuario.

Para terminar en el middleware llamo a los metodos de routes y allowedMethods para el router y por ultimo pongo la aplicacion a escuchar en el puerto 8000, que sera en el que este escuchando el playground de GraphQL.