import { prisma } from '../../../util/db.server.js'
const check = [];

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const new_email = req.body.email;
        const new_password = req.body.password;
        
        check[0] = await prisma.credentials.findMany({
            where: {
            email: new_email,
            password: new_password,
            },
        })

        if (check[0].length === 0) {
            res.status(200).json({message: "Cannot login"})
        }
        else if (check[0].length === 1) {
            const retrieval = await prisma.credentials.findUnique({
                where: {
                    email: new_email,
                    },
            })
            res.status(201).json({message: retrieval})
        }
}
prisma.$disconnect()
}