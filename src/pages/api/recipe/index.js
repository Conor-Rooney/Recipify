import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
    const idnum = req.body;
    //Math.floor(Math.random() * (9 - 1 + 1) + 1);
    const retrieval = await prisma.recipe.findUnique({
        where: {
            id: idnum,
            },
    })
    res.status(200).json({message: retrieval})
    prisma.$disconnect()
}