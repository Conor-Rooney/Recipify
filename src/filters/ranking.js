// Filters for up to 12 recipes out of rankings

export function rankingFilter(list, rankings, ranks){
    let newList = [];
    // https://riptutorial.com/javascript/example/9824/convert-object-s-values-to-array#:~:text=JavaScript%20Objects%20Convert%20object's%20values%20to%20array&text=You%20can%20convert%20its%20values,obj%5Bkey%5D%3B%20%7D)%3B%20console.
    const rec_ids = Object.keys(list).map(function(key) {return list[key].id;});

    // Loops through descending ranks of recipe recommendations list
    loop: for (const rank in ranks) {
        // Loops through recipes at that particular rank
        for (const recipes in rankings[ranks[rank]]) {
            for (const id in rec_ids) {
                // Break loop if filtered list has maxed
                if (newList.length > 11) {break loop;}
                // If current recipe has not been previously filtered out add it to returned recipes
                if (rankings[ranks[rank]][recipes] === rec_ids[id]) {
                    newList.push(rankings[ranks[rank]][recipes]);
                }
            }
        }
    }
    // Returns final list of recipes up to 12
    return (newList);
}