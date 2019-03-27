Configurar el Config Replica Set

# Para crear una red en Docker

    docker network create mongo-sh

# Crear tres contenedores para los nodos del Config Replica Set:

    docker run --name mongo-config1 -d --net mongo-sh mongo --replSet "rsConfig" --configsvr
    docker run --name mongo-config2 -d --net mongo-sh mongo --replSet "rsConfig" --configsvr
    docker run --name mongo-config3 -d --net mongo-sh mongo --replSet "rsConfig" --configsvr

# Iniciar una terminal en uno de los nodos:

    docker exec -it mongo-config1 bash

# Conectarse a uno de los nodos:
    mongo --host mongo-config1 --port 27019

# Inicializar el Config Replica Set:
    config = {
        "_id" : "rsConfig",
        "configsvr": true,
        "members" : [
            {
                "_id" : 0,
                "host" : "mongo-config1:27019"
            },
            {
                "_id" : 1,
                "host" : "mongo-config2:27019"
            },
            {
                "_id" : 2,
                "host" : "mongo-config3:27019"
            }
        ]
    }

rs.initiate(config)

# Desconectarse del bash y contenedor
    exit
    exit

Configurar los Shard Replica Sets

# Crear tres contenedores para los nodos del Shard Replica Set:

    docker run --name mongo-shard11 -d --net mongo-sh mongo --replSet "rsShard1" --shardsvr
    docker run --name mongo-shard12 -d --net mongo-sh mongo --replSet "rsShard1" --shardsvr
    docker run --name mongo-shard13 -d --net mongo-sh mongo --replSet "rsShard1" --shardsvr

# Iniciar una terminal en uno de los nodos:

    docker exec -it mongo-shard11 bash

# Conectarse a uno de los nodos:
    mongo --host mongo-shard11 --port 27018

# Inicializar el Shard Replica Set:

    config = {
        "_id" : "rsShard1",
        "members" : [
            {
                "_id" : 0,
                "host" : "mongo-shard11:27018"
            },
            {
                "_id" : 1,
                "host" : "mongo-shard12:27018"
            },
            {
                "_id" : 2,
                "host" : "mongo-shard13:27018"
            }
        ]
    }

rs.initiate(config)

# Desconectarse del bash y contenedor:
    exit
    exit

Iniciar el Router

# Iniciar el router:
    docker run --name mongo-router -d -p 27017:27017 --net mongo-sh mongo mongos --configdb rsConfig/mongo-config1:27019,mongo-config2:27019,mongo-config3:27019

# Conectarse al router:
    docker exec -it mongo-router mongo

# Adicionar Shards al clúster (sólamente es necesairo adicionar un nodo del cluster):
    sh.addShard( "rsShard1/mongo-shard11:27018")


Para agregar el dataset a los contenedores Docker

# Copiar dataset al contenedor
    docker cp dispositivos.json mongo-router:/dispositivos.json
    docker cp direcciones.json mongo-router:/direcciones.json
    docker cp usuarios.json mongo-router:/usuarios.json

# Conectarse al *SHELL* del contenedor
    docker exec -it mongo-router sh


# Importar los datasets a la base de datos. Especificando -d (database) y -c (collection)
    mongoimport -d tarea -c usuarios --file /usuarios.json --jsonArray
    mongoimport -d tarea -c direccion --file /direcciones.json --jsonArray
    mongoimport -d tarea -c dispositivos --file /dispositivos.json --jsonArray


# Regresar al router con (el prompt con mongos>)
    docker exec -it mongo-router mongo

# Para habilitar el sharding en la base de datos "tarea"
    sh.enableSharding("tarea")

# Para hacer sharding de colección con el paramentro especificado
    sh.shardCollection("tarea.usuarios", { "_id": 1 } )
    sh.shardCollection("tarea.direccion", { "_id": 1 } )
    sh.shardCollection("tarea.dispositivos", { "_id": 1 } )

# Para monitorear el estatus del shading
sh.status()
