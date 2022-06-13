import { prisma } from '../../../util/db.server.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const update = req.body;
    const usr_id = update.usr_id;
    const change = update.change;
    const notes = update.notes;

    const retrieval = await prisma.settings.findUnique({
        where: {
            id: usr_id,
            },
    })

    const ranking = retrieval.ranking;
    let new_ranking = {};
    const recipes = await prisma.recipe.findMany();

    for (const rank in ranking) {
        for (const rec_id in ranking[rank]) {
            let count = parseInt(rank);
            for (const note in notes) {
                for (const cur_note in recipes[rec_id].tags.Notes) {
                    if (notes[note] === recipes[rec_id].tags.Notes[cur_note]) {
                        if (change === "+") {
                            count += 1;
                        } else if (change === "++") {
                            count += 2;
                        } else if (change === "-") {
                            count -= 1;
                        } else if (change === "--") {
                            count -= 2;
                        }
                    }
                }
            }
             if (count.toString() in new_ranking === true) {
                new_ranking[count.toString()].push(ranking[rank][rec_id]);
             } else {
                new_ranking[count.toString()] = [ranking[rank][rec_id]];
             }
        }
    }

    const updatePrefs = await prisma.settings.update({
        where: {
            id: usr_id,
        },
        data: {
            ranking: new_ranking,
        },
    })
    res.status(200).json()
}

}

// {"0":["1","2","3","4","5","6","7","8","9"]}