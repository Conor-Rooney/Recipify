import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const recipe = req.body;
    const likedRec = recipe.liked;

    const retrieval = await prisma.settings.findUnique({
        where: {
            id: recipe.usr_id,
            },
    })

    var a = retrieval.likes;
    var b = {[recipe.rec_id] : likedRec};

    const new_likes = [a, b].reduce(function (r, o) {
        Object.keys(o).forEach(function (k) { r[k] = o[k]; });
        return r;
    }, {});

    const updateLikes = await prisma.settings.update({
        where: {
            id: recipe.usr_id,
        },
        data: {
            likes: new_likes,
        },
    })

    if (Object.keys(retrieval.likes).length === Object.keys(new_likes).length) {
        res.status(200).json(201)
    } else {
        res.status(200).json(200)
    }

    }
}