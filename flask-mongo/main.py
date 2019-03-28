from flask import request, url_for, jsonify
from flask_api import FlaskAPI, status, exceptions
from pymongo import MongoClient


app = FlaskAPI(__name__)
# Home page
@app.route("/", methods=['GET'])
def list():
    mongo_uri = "mongodb://mongo-router:27017"

    client = MongoClient(mongo_uri)
    db = client.tarea
    collection = db.usuarios

    cursor = collection.find()

    notes = []

    for note in cursor:
        # Se adicionó para poder manejar ObjectID
        note['_id'] = str(note['_id'])
        notes.append(note)

    return notes
# Dispositivos page
# Para mostrar los países en donde hay dispositivos de la marca Sony
@app.route("/dispositivos", methods=['GET'])
def list_dispositivos():
    mongo_uri = "mongodb://mongo-router:27017"

    client = MongoClient(mongo_uri)
    db = client.tarea
    collection = db.dispositivos

    pipeline = [{$match:{"marca":"Sony"}},{$project:{"marca":1,"pais":1, "_id":0}}, {$sort:{"_id":1}}]

    cursor = collection.aggregate(pipeline)

    return cursor
# Direccion page
# # Regresa la cantidad de dispositivos en México
# El $count es equivalente a un $group + $project
@app.route("/direccion", methods=['GET'])
def list():
    mongo_uri = "mongodb://mongo-router:27017"

    client = MongoClient(mongo_uri)
    db = client.tarea
    collection = db.direcciones

    pipeline = [{$match: {"ubicacion" :"Mexico"}}, {$count: "ubicacion"}]

    cursor = collection.aggregate(pipeline)

    return cursor

@app.route("/usuarios", methods=['GET'])
def list():
    mongo_uri = "mongodb://mongo-router:27017"

    client = MongoClient(mongo_uri)
    db = client.tarea
    collection = db.usuarios

    pipeline = [{$match:{"genero":"female", "direccion_id":{$gte: 1000}}}, {$project:{"nombre":1} }, {$sort: {"_id":1}}]

    cursor = collection.aggregate(pipeline)

    return cursor



if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
