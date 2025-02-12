
export const createPopulation = (size = 1600) => {
  const population = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    population.push({
      id: i,
      x: (100 * (i % sideSize)) / sideSize, // X-coordinate within 100 units
      y: (100 * Math.floor(i / sideSize)) / sideSize, // Y-coordinate scaled similarly
      infected: false,
    });
  }
  // Infect patient zero...
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  return population;
};


const shufflePopulation = (population) => {
  for (let i = population.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    // Swap places
    [population[i], population[j]] = [population[j], population[i]];
  }
};

const maybeInfectPerson = (person, params) => {
  if (Math.random() * 100 < params.infectionChance) {
    person.infected = true;
  }
}

export const updatePopulation = (
  population,
  params
) => {
  shufflePopulation(population);
  // Now that we've shuffled, let's move through the population by pairs
  for (let i = 0; i < population.length - 1; i += 2) {
    let personA = population[i];
    let personB = population[i + 1];

    // let's have them meet in the middle of where they were...    
    let xpadding = Math.round(Math.random() * 4) - 2;
    let ypadding = Math.round(Math.random() * 4) - 2;
    personB.x = Math.max(0, Math.min(100, personA.x + xpadding));
    personB.y = Math.max(0, Math.min(100, personA.y + ypadding));
    personA.x -= xpadding;
    personA.y -= ypadding;

    // Now let's see if they infect each other
    if (personA.infected) {
      maybeInfectPerson(personB, params);
    }
    if (personB.infected) {
      maybeInfectPerson(personA, params);
    }
  }
  return population;
};
