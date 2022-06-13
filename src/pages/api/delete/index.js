import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const user_id = req.body;

    const deleteCreds = await prisma.credentials.delete({
        where: {
          id: user_id,
        },
      })
    const deletePrefs = await prisma.settings.delete({
        where: {
          id: user_id,
        },
      })

    res.status(200).json()
}

}