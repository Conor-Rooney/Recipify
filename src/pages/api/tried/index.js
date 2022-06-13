import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const recipe = req.body;
    const triedRec = recipe.tried;

    const retrieval = await prisma.settings.findUnique({
        where: {
            id: recipe.usr_id,
            },
    })

    var a = retrieval.tried;
    var b = {[recipe.rec_id] : triedRec};

    const new_tried = [a, b].reduce(function (r, o) {
        Object.keys(o).forEach(function (k) { r[k] = o[k]; });
        return r;
    }, {});

    const updateTried = await prisma.settings.update({
        where: {
            id: recipe.usr_id,
        },
        data: {
            tried: new_tried,
        },
    })

    res.status(200).json()
}

}