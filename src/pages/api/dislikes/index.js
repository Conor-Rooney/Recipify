import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const recipe = req.body;
    const dislikedRec = recipe.disliked;

    const retrieval = await prisma.settings.findUnique({
        where: {
            id: recipe.usr_id,
            },
    })

    var a = retrieval.dislikes;
    var b = {[recipe.rec_id] : dislikedRec};

    const new_dislikes = [a, b].reduce(function (r, o) {
        Object.keys(o).forEach(function (k) { r[k] = o[k]; });
        return r;
    }, {});

    const updateDislikes = await prisma.settings.update({
        where: {
            id: recipe.usr_id,
        },
        data: {
            dislikes: new_dislikes,
        },
    })

    if (Object.keys(retrieval.dislikes).length === Object.keys(new_dislikes).length) {
        res.status(200).json(201)
    } else {
        
        res.status(200).json(200)
    }
}

}