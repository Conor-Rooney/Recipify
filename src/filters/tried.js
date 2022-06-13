// Returns only recipes which the user does not have in their tried list, i.e. they havent tried before

export function triedFilter(list, tried){
    let newList = [];
    // Loop through recipes list
    for (let item in list){
        // If recipe isn't in the tried list add it to returned recipes
        if (!(list[item].id in tried)) {
            newList.push(list[item])
        }
    }
    // Returns not tried recipes
    return (newList);
}