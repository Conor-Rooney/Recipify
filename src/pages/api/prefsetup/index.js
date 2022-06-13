import { prisma } from '../../../util/db.server.js'

const new_allergies = {Wheat: false, Gluten: false, Celery: false, Cereals: false, Dairy: false, Eggs: false, Fish: false, Peanuts: false, Nuts: false, Crustaceans: false, Molluscs: false, Mustard: false, Soy: false, Sesame: false, Lupin: false};
const new_diet = {Vegan: false, Vegetarian: false, Pescetarian: false, Jewish: false, Islamic: false, Pollotarian: false, Hindu: false, Ketogenic: false, Fruitarian: false, Paleo: false};
const new_location = {Status: false, Settings: {Temp: false, Time: false, Weather: false}};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const new_id = req.body;

    const recipes = await prisma.recipe.findMany();
    const size = Object.keys(recipes).length;
    const rec_ids = Array.from({length: size}, (_, i) => i + 1)

    await prisma.settings.create({
        data: {
            id: new_id,
            allergies: new_allergies,
            likes: {},
            tried: {},
            dislikes: {},
            diet: new_diet,
            ranking: {0: rec_ids,},
            location: new_location,
            },
    })
    res.status(200).json()
  }
}