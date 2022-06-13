import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const loc = req.body;

    const updateLoc = await prisma.settings.update({
        where: {
            id: loc.user_id,
        },
        data: {
            location: loc.user_location,
        },
    })

    res.status(200).json()
}

}