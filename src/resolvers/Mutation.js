const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const post = async (parent, args, context, info) => {
    const {userId} = context

    const link = await context.prisma.link.create({
        data : {
            url : args.url,
            description : args.description,
            postedBy : { connect : {id : userId} }
        }
    })
    return link
}

const signup = async (parent, args, context, info) => {
    // hash passowrd
    const hashedPassword = await bcrypt.hash(args.password, 10)

    // create user
    const user = await context.prisma.user.create({
        data : {
            ...args,
            password : hashedPassword
        }
    })

    // create token
    const token = jwt.sign({ userId : user.id }, APP_SECRET)

    // return object container user and token
    return {
        token,
        user
    }
}

const login = async (parent, args, context, info) => {
    // first find user exist or not
    const user = await context.prisma.user.findUnique({ where : {email : args.email } })
    // then make token
    if(!user){
        throw new Error('No such user found')
    }

    // compare password with stored password in table
    const isPasswordValid = await bcrypt.compare(args.password, user.password)
    if(!isPasswordValid){
        throw new Error('Invalid password')
    }

    // create token 
    const token = jwt.sign({ userId : user.id }, APP_SECRET)

    // return object with token and user

    return {
        token,
        user
    }
}


module.exports = {
    post,
    signup,
    login
}