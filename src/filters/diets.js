// Filters out recipes which don't have user enabled diets

export function dietFilter(list, diets){
    let newList = [];
    let truth = true;

    // Loop through recipes
    for (let item in list){
        // Loop through enabled diets
        for (let diet in diets) {
            if (diets[diet] === true) {
                // If diet is not in recipe filter out
                if (list[item].tags.Diets.includes(diet)) {
                    truth = true;
                } else {
                    truth = false;
                    break;
                }
            }
        }
        if (truth === true) {newList.push(list[item])}
        truth = true;
    }
    // Return filtered list
    return (newList);
}