const { ApolloServer } = require('apollo-server')
const { PrismaClient  } = require('@prisma/client')

const prisma = new PrismaClient()

const typeDefs = `
    type Query {
        info : String!
        feed : [Link!]!
    }

    type Mutation {
        post(url : String!, description : String!) : Link! 
    }

    type Link {
        id : ID!
        description : String!
        url : String!
    }
`

const links = [
    {
        id : "1010",
        description : "How to make a graphQL server ?",
        url : "www.howtographQL.com"
    }
]

let idCount = links.length

const resolvers = {
    Query : {
        info : () => `Hackernews API`,
        feed : async (parent, args, context) => {
           return context.prisma.link.findMany()
        } 
    },
    Mutation : {
        post : (parent, args, context) => {
            const link = context.prisma.link.create({
                data : {
                    url : args.url,
                    description : args.description
                }
            })
            return link
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context : {
        prisma
    }
})

server.listen().then(({url}) => console.log(`Server is running on ${url}`))
