// Filters out recipes with user selected allergies

export function allergyFilter(list, allergys){
    let newList = [];
    let truth = true;

    // Loop through recipes
    for (let item in list){
        // Loop through enabled allergies
        for (let allergy in allergys) {
            if (allergys[allergy] === true) {
                // If the enabled allergy is in recipe filter out
                if (list[item].tags.Allergies.includes(allergy)) {
                    truth = false;
                    break;
                }
            }
        }
        if (truth === true) {newList.push(list[item])}
        truth = true;
    }
    // Returns filtered list
    return (newList);
}