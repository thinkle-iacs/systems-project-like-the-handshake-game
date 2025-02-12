import React, { useEffect, useState } from "react";
import { createPopulation, updatePopulation } from "./diseaseModel";
import { LineChart, Line, YAxis, XAxis } from "recharts";

// Default simulation parameters
const defaultSimulationParameters = {
  infectionChance: 20,
};

const computeStatistics = (population, lastStats, round) => {
  // First, get the number of infected people from our stats
  // from last round...
  let lastInfections = 0;
  if (lastStats) {
    lastInfections = lastStats.infected;
  }
  // Now count up the infected people this round...
  let infected = 0;
  for (let p of population) {
    if (p.infected) {
      infected++;
    }
  }
  // New infections are the difference
  let newInfections = infected - lastInfections;
  // Return an object with both of these values
  return {
    round,
    infected,
    newInfections,
  };
};
let boxSize = 500;
let maxSize = 1000;
// Function to render patients as text-based elements
const renderPatients = (population) => {
  if (population > maxSize) {
    population = population.slice(0, maxSize);
  }
  function renderEmoji(p) {
    if (p.infected) {
      return "🤢";
    } else {
      return "😀";
    }
  }
  return population.map((p) => (
    <div
      key={p.id}
      className="patient"
      style={{
        transform: `translate(${(p.x / 100) * boxSize}px,${
          (p.y / 100) * boxSize
        }px)`,
      }}
    >
      {renderEmoji(p)}
    </div>
  ));
};

const SimpleSimulation = () => {
  // State for population
  const [popSize, setPopSize] = useState(40);
  const [population, setPopulation] = useState(createPopulation(35));

  // State for graph data
  const [lineToGraph, setLineToGraph] = useState("infected");
  const [diseaseData, setDiseaseData] = useState([]);
  const [autoMode, setAutoMode] = useState(false);

  // Simulation parameters
  const [simulationParameters, setSimulationParameters] = useState(
    defaultSimulationParameters
  );

  // Runs a single simulation step
  const runTurn = () => {
    let newPopulation = updatePopulation(
      population.slice(),
      simulationParameters
    );
    setPopulation(newPopulation);
    let newStats = computeStatistics(
      newPopulation,
      diseaseData[diseaseData.length - 1],
      diseaseData.length
    );
    setDiseaseData([...diseaseData, newStats]);
  };

  // Handles input change for population size
  const onPopInput = (e) => {
    setPopSize(parseInt(e.target.value));
  };

  // Resets the simulation
  const resetPopulation = () => {
    setPopulation(createPopulation(popSize * popSize));
    setDiseaseData([]);
  };

  // Auto-run simulation effect
  useEffect(() => {
    if (autoMode) {
      setTimeout(runTurn, 500);
    }
  }, [autoMode, population]);

  return (
    <div>
      <h1>My Systems Model</h1>
      <p>
        This is a model of the "handshake" game: each turn, two people at random
        find each other and shake hands. If one of them is infected, the other
        gets infected too.
      </p>
      <p>
        Population: {population.length}. Infected:{" "}
        {population.filter((p) => p.infected).length}
      </p>
      <button onClick={runTurn}>Next Turn</button>
      <button onClick={() => setAutoMode(true)}>AutoRun</button>
      <button onClick={() => setAutoMode(false)}>Stop</button>
      <input
        type="range"
        min="3"
        max="300"
        value={popSize}
        onChange={onPopInput}
      />
      <button onClick={resetPopulation}>Reset Population</button>

      <div>
        <label>Infection Chance:</label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={simulationParameters.infectionChance}
          onChange={(e) =>
            setSimulationParameters({
              ...simulationParameters,
              infectionChance: parseFloat(e.target.value),
            })
          }
        />
        <input
          type="number"
          min="0"
          max="100"
          value={simulationParameters.infectionChance}
          onChange={(e) =>
            setSimulationParameters({
              ...simulationParameters,
              infectionChance: parseFloat(e.target.value),
            })
          }
        />
      </div>

      <section className="side-by-side">
        <div className="chartContainer">
          <LineChart data={diseaseData} width={400} height={400}>
            <YAxis />
            <XAxis />
            <Line type="monotone" dataKey={lineToGraph} stroke="#f00" />
          </LineChart>
          <button onClick={() => setLineToGraph("infected")}>
            Total Infected
          </button>
          <button onClick={() => setLineToGraph("newInfections")}>
            New Infections
          </button>
        </div>

        <div className="world">
          <div
            className="population-box"
            style={{ width: boxSize, height: boxSize }}
          >
            {renderPatients(population)}
          </div>
        </div>
      </section>

      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Total Infected</th>
            <th>New Infections</th>
          </tr>
        </thead>
        <tbody>
          {diseaseData.map((dataPoint) => (
            <tr key={dataPoint.round}>
              <td>{dataPoint.round}</td>
              <td>{dataPoint.infected}</td>
              <td>{dataPoint.newInfections}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleSimulation;
