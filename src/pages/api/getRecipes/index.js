import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
    const retrieval = await prisma.recipe.findMany()
    res.status(200).json({message: retrieval})
    prisma.$disconnect()
}