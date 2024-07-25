import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [diceCount, setDiceCount] = useState(1);
  const [diceValues, setDiceValues] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [reRollResults, setReRollResults] = useState([]);
  const [reRollIndices, setReRollIndices] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [diceSet, setDiceSet] = useState('white'); // Default dice set

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  const diceImages = {
    white: {
      '': '/rnr-dice/dice-images/white/dice-empty-w.png',
      '1': '/rnr-dice/dice-images/white/dice-1-w.png',
      'R': '/rnr-dice/dice-images/white/dice-R-w.png'
    },
    black: {
      '': '/rnr-dice/dice-images/black/dice-empty-b.png',
      '1': '/rnr-dice/dice-images/black/dice-1-b.png',
      'R': '/rnr-dice/dice-images/black/dice-R-b.png'
    },
    green: {
      '': '/rnr-dice/dice-images/green/dice-empty-g.png',
      '1': '/rnr-dice/dice-images/green/dice-1-g.png',
      'R': '/rnr-dice/dice-images/green/dice-R-g.png'
    },
    blue: {
      '': '/rnr-dice/dice-images/blue/dice-empty-bl.png',
      '1': '/rnr-dice/dice-images/blue/dice-1-bl.png',
      'R': '/rnr-dice/dice-images/blue/dice-R-bl.png'
    },
    red: {
      '': '/rnr-dice/dice-images/red/dice-empty-r.png',
      '1': '/rnr-dice/dice-images/red/dice-1-r.png',
      'R': '/rnr-dice/dice-images/red/dice-R-r.png'
    },
    yellow: {
      '': '/rnr-dice/dice-images/yellow/dice-empty-y.png',
      '1': '/rnr-dice/dice-images/yellow/dice-1-y.png',
      'R': '/rnr-dice/dice-images/yellow/dice-R-y.png'
    }
  };

  const handleDiceCountChange = (event) => {
    const value = Math.max(1, Math.min(24, Number(event.target.value)));
    setDiceCount(value);
  };

  const rollSingleDice = () => {
    const roll = Math.floor(Math.random() * 6);
    if (roll === 0) return 'R';
    if (roll === 1) return '1';
    return '';
  };

  const rollDice = () => {
    const rolls = Array.from({ length: diceCount }, rollSingleDice);
    const initialPoints = rolls.reduce((acc, value) => (value === '1' || value === 'R' ? acc + 1 : acc), 0);
    
    setDiceValues(rolls);
    setTotalPoints(initialPoints);

    const indicesToReRoll = rolls.map((value, index) => (value === 'R' ? index : -1)).filter(index => index !== -1);
    setReRollIndices(indicesToReRoll);
    setReRollResults([{ label: 'Initial Roll', results: rolls }]);
  };

  const reRollDice = () => {
    const newDiceValues = [...diceValues];
    let additionalPoints = 0;
    const newReRollIndices = [];
    const newReRollResults = [...reRollResults];
    const reRollResultsLine = [];

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

    setTotalPoints(prevPoints => prevPoints + additionalPoints);
    setDiceValues(newDiceValues);
    setReRollIndices(newReRollIndices);

    newReRollResults.push({
      label: `Re-roll ${newReRollResults.length}`,
      results: reRollResultsLine.filter(value => value !== undefined)
    });
    setReRollResults(newReRollResults);
  };

  const getDiceImage = (value) => {
    return diceImages[diceSet][value];
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleDiceSetChange = (newSet) => {
    setDiceSet(newSet);
  };

  return (
    <div className="App">
      <button onClick={toggleTheme} className="theme-toggle-button">
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <h1>RnR Dice Roller</h1> {/* Updated header text */}
      <div className="dice-set-selector">
        <h2>Select Dice Set:</h2>
        {Object.keys(diceImages).map((set) => (
          <button
            key={set}
            onClick={() => handleDiceSetChange(set)}
            className={`dice-set-button ${diceSet === set ? 'active' : ''} ${set}`}
          >
            {set.charAt(0).toUpperCase() + set.slice(1)}
          </button>
        ))}
      </div>
      <div>
        <label htmlFor="diceCount">Number of Dice (1-24): </label>
        <input
          id="diceCount"
          type="range"
          min="1"
          max="24"
          value={diceCount}
          onChange={handleDiceCountChange}
          className="slider"
        />
        <span className="slider-value">{diceCount}</span>
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
      <div className="contact-info">
        If you found any issues, please contact <a href="mailto:cristtanai@gmail.com">cristtanai@gmail.com</a>
      </div>
    </div>
  );
};

export default App;
