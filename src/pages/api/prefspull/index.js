import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const id_num = req.body;
    if (id_num.length !== undefined) {
        const retrieval = await prisma.settings.findUnique({
            where: {
                id: id_num,
                },
        })
        res.status(200).json({message: retrieval});
  } else {res.status(201).json()}
}

}