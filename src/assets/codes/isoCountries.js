//Download the JSON data from https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/refs/heads/master/all/all.json
//Replace the empty array below, leave the semi-colon though
//⬇️
const arrIsoCountries = 
[]
;
//⬆️

//Map to store the ISO country data for easy access
let isoCountries = new Map;

//Convert the array of ISO country data into a Map for easy access
function processArrIsoCountries(aic) {
    return aic.reduce(
        (accu, elem) => accu.set( elem['alpha-2'], { alpha2: elem['alpha-2'], name: elem.name } ),
        new Map
    )
}

//Function to fetch the ISO country data and store it in a Map for easy access
function fetchCountries() {
    if(isoCountries && isoCountries.size) return; //If the Map already has data, just return

    //If the array is empty, we can fetch the data from the URL below
    const urlIsoCountries = 'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/refs/heads/master/all/all.json';

    fetch(urlIsoCountries)
        .then(resp => resp.json())
        .then(data => isoCountries = processArrIsoCountries(data))
        .then(() => console.log('Number of ISO countries read: ', isoCountries.size))
        .catch(err => console.error('Error fetching ISO country data: ', err));
}

if(arrIsoCountries.length) isoCountries = processArrIsoCountries(arrIsoCountries);

export { isoCountries, fetchCountries };
