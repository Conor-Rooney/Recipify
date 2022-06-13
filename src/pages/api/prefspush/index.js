import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const prefs = req.body;
        await prisma.settings.update({
            where: {
                id: prefs.id,
            },
            data: {
                allergies: prefs.allergies,
                dislikes: prefs.dislikes,
                likes: prefs.likes,
                tried: prefs.tried,
                dislikes: prefs.dislikes,
                diet: prefs.diet,
                location: prefs.location,
            },
        })
        res.status(200).json()
    }
}