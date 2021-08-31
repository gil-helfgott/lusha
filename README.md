# What I did
This repo includes a service which exposes a REST api with a single endpoint \
POST /parse which is expecting to receive a JSON body with the following schema: \
`{
    url: string // a valid url
}` \
The endpoint throws an error in case we have a validation error \
Then it pushes the given url into a queue. \
The service is always listening for new links on that queue and when there's a link \
it downloads the link HTML, parses it (mock) for additional links and also pushes these links to the queue. \
Each link downloaded is saved in the DB along with its HTML

# Why I chose this design
I think the most important decision I've made here is choosing to use a queue (using redis) instead of using the naive recursive approach. \
The recursive approach has several problems: \
1. It may cause the server to run out of memory when given real world data
2. It's not scalable 

The queue architecture allows us to
1. limit the number of concurring parse processes to avoid running out of memory
2. We can scale horizontally by running more instances of this service

As for the DB, I chose mongodb because
1. I'm familiar with this DB
2. I don't think it really matters if we choose a sql or no-sql DB when we have only 2 fields

# Prerequisites
You'll need node.js version 12 to run the server \
You'll need docker installed to start local DBs

# How to run
run npm install \
In order to run the local mongodb and redis you'll need to "npm run env-up" \
In order to start the server you need to "npm run run-test-env"
In order to run tests you need to "npm run test"

# Things that can be improved
We need logging, monitoring, better error handling, CI/CD...
