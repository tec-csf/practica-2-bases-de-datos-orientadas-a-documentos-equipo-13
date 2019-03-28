require 'mongo'

client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'tarea', :connect => :sharded)

db = client.database

p db.collection_names
