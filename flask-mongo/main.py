from flask import request, url_for, jsonify
from flask_api import FlaskAPI, status, exceptions
from pymongo import MongoClient


app = FlaskAPI(__name__)

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
