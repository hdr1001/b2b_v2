//Download the JSON data from https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/refs/heads/master/all/all.json
//Replace the empty array below, leave the semi-colon though
//⬇️
const arrIsoCountries = 
[]
;
//⬆️

export const isoCountries = arrIsoCountries.reduce(
    (accu, elem) => accu.set( elem['alpha-2'], { alpha2: elem['alpha-2'], name: elem.name } ),
    new Map
)
