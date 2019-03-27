require 'mongo'

client = Mongo::Client.new('mongodb+srv://salo:<8988>@cluster0-edumb.mongodb.net/test?retryWrites=true')
db = client.database

p db