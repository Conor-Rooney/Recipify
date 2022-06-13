// Filters out recipes which aren't neutral or don't have the same values for time, weather and temperature as the user currently 

export function locationFilter(list, location){
    let newList = [];
    let truth = true;

    // Assigns appropriate string representations to time values
    const curTime = parseInt(location.Time.split(':')[0]);
    let stringTime = "";
    if (0 <= curTime < 4) {stringTime = "Evening";}
    else if (4 <= curTime < 11) {stringTime = "Morning";}
    else if (11 <= curTime < 17) {stringTime = "Noon";}
    else if (17 <= curTime <= 23) {stringTime = "Evening";}

    // Assigns appropriate string representations to temp values
    const curTemp = parseInt(location.Temp);
    let stringTemp = "";
    if (curTemp < 14) {stringTemp = "Cold";}
    else if (14 <= curTime) {stringTemp = "Hot";}

    // Assigns appropriate string representations to weather values
    const curWeather = parseInt(location.Weather);
    let stringWeather = "";
    if (0 < curWeather) {stringWeather = "Precipitation";}
    else {stringWeather = "Sunny";}

    for (let item in list){
        // Filter out recipes with innapropriate temp
        if (list[item].tags.Location.Temp === stringTemp || list[item].tags.Location.Temp === "Neutral") {
            truth = true;
        } else {
            truth = false;
            break;
        }

        // Filter out recipes with innapropriate time
        if (list[item].tags.Location.Time === stringTime || list[item].tags.Location.Weather === "Neutral") {
            truth = true;
        } else {
            truth = false;
            break;
        }

        // Filter out recipes with innapropriate weather
        if (list[item].tags.Location.Weather === stringWeather || list[item].tags.Location.Weather === "Neutral") {
            truth = true;
        } else {
            truth = false;
            break;
        }
    }
        if (truth === true) {newList.push(list[item])}
        truth = true;

    // Returns filtered list
    return(newList)
}