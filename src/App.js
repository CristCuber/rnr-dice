import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [diceCount, setDiceCount] = useState(1);
  const [diceValues, setDiceValues] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [reRollResults, setReRollResults] = useState([]);
  const [reRollIndices, setReRollIndices] = useState([]);

  // Function to handle dice count input
  const handleDiceCountChange = (event) => {
    const value = Math.max(1, Math.min(24, Number(event.target.value)));
    setDiceCount(value);
  };

  // Function to roll a single 6-sided dice
  const rollSingleDice = () => {
    const roll = Math.floor(Math.random() * 6); // Random number between 0 and 5
    if (roll === 0) return 'R'; // 1/6 chance for 'R'
    if (roll === 1) return '1'; // 1/6 chance for '1'
    return ''; // 4/6 chance for empty
  };

  // Function to roll all dice initially
  const rollDice = () => {
    const rolls = Array.from({ length: diceCount }, rollSingleDice);
    // Calculate initial points and identify re-rolls
    const initialPoints = rolls.reduce((acc, value) => (value === '1' || value === 'R' ? acc + 1 : acc), 0);
    
    setDiceValues(rolls);
    setTotalPoints(initialPoints);

    // Set indices of dice that need re-rolling
    const indicesToReRoll = rolls.map((value, index) => (value === 'R' ? index : -1)).filter(index => index !== -1);
    setReRollIndices(indicesToReRoll);
    setReRollResults([{ label: 'Initial Roll', results: rolls }]); // Store initial roll result with label
  };

  // Function to re-roll all dice that need re-rolling
  const reRollDice = () => {
    const newDiceValues = [...diceValues];
    let additionalPoints = 0;
    const newReRollIndices = [];
    const newReRollResults = [...reRollResults];
    const reRollResultsLine = [];

    // Roll dice that need re-rolling and store results for this line
    reRollIndices.forEach(index => {
      const newValue = rollSingleDice();
      newDiceValues[index] = newValue;
      if (newValue === 'R') {
        additionalPoints += 1;
        newReRollIndices.push(index);
      } else if (newValue === '1') {
        additionalPoints += 1;
      }
      reRollResultsLine[index] = newValue;
    });

    // Update total points
    setTotalPoints(prevPoints => prevPoints + additionalPoints);
    setDiceValues(newDiceValues);
    setReRollIndices(newReRollIndices);

    // Update re-roll results with only re-rolled dice
    newReRollResults.push({
      label: `Re-roll ${newReRollResults.length}`,
      results: reRollResultsLine.filter(value => value !== undefined)
    });
    setReRollResults(newReRollResults);
  };

  // Get image path for dice value
  const getDiceImage = (value) => {
    if (value === 'R') return '/dice-images/dice-R.png';
    if (value === '1') return '/dice-images/dice-1.png';
    return '/dice-images/dice-empty.png';
  };

  return (
    <div className="App">
      <h1>Dice Roller</h1>
      <div>
        <label htmlFor="diceCount">Number of Dice (1-24): </label>
        <input
          id="diceCount"
          type="number"
          min="1"
          max="24"
          value={diceCount}
          onChange={handleDiceCountChange}
        />
      </div>
      <button onClick={rollDice}>Roll Dice</button>
      {reRollResults.length > 0 && (
        <div className="dice-results">
          <h2>Roll Results:</h2>
          {reRollResults.map((rollResult, rollIndex) => (
            <div key={rollIndex} className="dice-re-roll-line">
              <div className="roll-label">{rollResult.label}</div>
              <div className="dice-row">
                {rollResult.results.map((value, index) => (
                  <div key={index} className="dice-wrapper">
                    <img
                      src={getDiceImage(value)}
                      alt={`Dice ${index + 1} - ${value}`}
                      className="dice-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {reRollIndices.length > 0 && (
            <button onClick={reRollDice} className="re-roll-button">
              Re-roll
            </button>
          )}
          <h3>Total Points: {totalPoints}</h3>
        </div>
      )}
    </div>
  );
};

export default App;
