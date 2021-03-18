const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main(){
    const newLink = await prisma.link.create({
        data : {
            url : "www.yatharth1706.github.io",
            description : "My portfolio hosted on github"
        }
    })

    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}

main().catch((e) => {
    throw e
}).finally(async () => {
    await prisma.$disconnect()
})