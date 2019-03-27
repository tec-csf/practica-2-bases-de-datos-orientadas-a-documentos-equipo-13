require 'mongo'

client = Mongo::Client.new([ '0.0.0.0:27017' ], :database => 'tarea', :ssl => false)
db = client.database

p db.collections
