// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '../../../util/db.server.js'

const check = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const new_email = req.body.email;
    const new_password = req.body.password;

    check[0] = await prisma.credentials.findMany({
      where: {
      email: new_email,
      },
  })

  if (check[0].length === 0) {
    const retrieval = await prisma.credentials.create({
      data: {
          email: new_email,
          password: new_password,
          },
    })
    res.status(202).json({message: retrieval})
  }
  else if (check[0].length === 1) {
      res.status(203).json("Already Signed Up")
  }
  }
  prisma.$disconnect()
}
