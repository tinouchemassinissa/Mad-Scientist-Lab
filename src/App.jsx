import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const INGREDIENTS = {
  water: { id: 'water', name: 'Tap Water', formula: 'H₂O (Solvent)', rgb: [147, 197, 253], state: 'liquid', isAcid: false },
  lemon: { id: 'lemon', name: 'Lemon Juice', formula: 'Citric Acid', rgb: [253, 224, 71], state: 'liquid', isAcid: true },
  sugar: { id: 'sugar', name: 'Sugar Cubes', formula: 'Sucrose (Solute)', rgb: [255, 255, 255], state: 'solid', isAcid: false },
  vinegar: { id: 'vinegar', name: 'Vinegar', formula: 'Acetic Acid', rgb: [252, 211, 77], state: 'liquid', isAcid: true },
  oil: { id: 'oil', name: 'Cooking Oil', formula: 'Lipid (Non-polar)', rgb: [234, 179, 8], state: 'liquid', isAcid: false },
  mustard: { id: 'mustard', name: 'Mustard', formula: 'Emulsifier', rgb: [202, 138, 4], state: 'liquid', isAcid: false }
};

const MISSIONS = [
  {
    id: 1,
    title: "Sweet Lemonade (Solubility)",
    instructions: "DAILY LIFE: Make Lemonade! Mix 20 units Lemon Juice, 60 units Water, and 20 units Sugar. Notice how the sugar piles up at the bottom? Heat the water above 40°C to increase its solubility and dissolve the sugar!",
    targetVolume: 100,
    validate: (vol, temp, contents, dissolvedSugar, isEmulsified) => 
      contents.lemon === 20 && contents.water === 60 && contents.sugar === 20 && dissolvedSugar === 20
  },
  {
    id: 2,
    title: "Vinaigrette Dressing (Density & Emulsifiers)",
    instructions: "DAILY LIFE: Oil and Vinegar don't mix because of density! Add exactly 60 units Oil and 20 units Vinegar. Watch them separate! Then, add 10 units of Mustard (an Emulsifier) to bind them together!",
    targetVolume: 90,
    validate: (vol, temp, contents, dissolvedSugar, isEmulsified) => 
      contents.oil === 60 && contents.vinegar === 20 && contents.mustard >= 10 && isEmulsified
  },
  {
    id: 3,
    title: "The Dilution Ratio",
    instructions: "MATH: Lemon juice is too sour! Create a 1:4 ratio of Lemon Juice to Water. Make exactly 100 units total. (Hint: fractions!)",
    targetVolume: 100,
    validate: (vol, temp, contents, dissolvedSugar, isEmulsified) => 
      contents.lemon === 20 && contents.water === 80 && vol === 100
  }
];

const MAX_VOLUME = 100;
const MAX_TEMP = 100;
const MIN_TEMP = 0;

function App() {
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [contents, setContents] = useState({ water: 0, lemon: 0, sugar: 0, vinegar: 0, oil: 0, mustard: 0 });
  const [temperature, setTemperature] = useState(20);
  const [gameState, setGameState] = useState('playing'); // playing, exploded, won
  const [log, setLog] = useState(["Welcome to the Daily Chemistry Kitchen!"]);

  const mission = MISSIONS[currentMissionIdx];
  const totalVolume = Object.values(contents).reduce((a, b) => a + b, 0);

  const addLog = (msg) => {
    setLog(prev => {
      if (prev[0] === msg) return prev; // Prevent spam
      return [msg, ...prev].slice(0, 4);
    });
  };

  // --- DAILY PHYSICS & CHEMISTRY CALCULATIONS ---

  // 1. SOLUBILITY: Sugar dissolves based on temperature and amount of liquid solvent.
  // Base solubility: 10 units of liquid can dissolve ~2 units of sugar at 20C.
  // At 50C, it can dissolve ~6 units.
  const solventVolume = contents.water + contents.lemon + contents.vinegar;
  let maxSolubleSugar = 0;
  if (solventVolume > 0) {
    const tempFactor = Math.max(0.1, temperature / 20); // 1.0 at 20C, 2.0 at 40C
    maxSolubleSugar = solventVolume * 0.2 * tempFactor;
  }
  
  const dissolvedSugar = Math.min(contents.sugar, maxSolubleSugar);
  const undissolvedSugar = contents.sugar - dissolvedSugar;

  useEffect(() => {
    if (undissolvedSugar > 0 && contents.sugar > 0) {
      addLog(`Physics: The liquid is saturated! ${undissolvedSugar.toFixed(1)} units of Sugar won't dissolve. Try heating it up!`);
    } else if (contents.sugar > 0 && undissolvedSugar === 0) {
      addLog(`Chemistry: All the sugar dissolved perfectly into the solvent!`);
    }
  }, [undissolvedSugar, contents.sugar]);

  // 2. DENSITY & EMULSIFICATION: Oil separates from water unless emulsifier (mustard) is present.
  const isEmulsified = contents.mustard > 0;
  const isSeparated = contents.oil > 0 && solventVolume > 0 && !isEmulsified;

  useEffect(() => {
    if (isSeparated) {
      addLog(`Physics: Oil is non-polar and less dense! It's floating on top of the water/vinegar.`);
    } else if (contents.oil > 0 && isEmulsified) {
      addLog(`Chemistry: The Mustard acted as an Emulsifier! The oil and vinegar are now bound together!`);
    }
  }, [isSeparated, isEmulsified, contents.oil]);

  // COLOR MIXING
  const mixedColorBase = useMemo(() => {
    let r = 0, g = 0, b = 0;
    let baseVol = solventVolume + dissolvedSugar + contents.mustard;
    if (isEmulsified) baseVol += contents.oil; // Oil mixes in
    
    if (baseVol === 0) return 'transparent';

    const getWeight = (key, vol) => vol / baseVol;
    
    if (contents.water > 0) { r += 147 * getWeight('water', contents.water); g += 197 * getWeight('water', contents.water); b += 253 * getWeight('water', contents.water); }
    if (contents.lemon > 0) { r += 253 * getWeight('lemon', contents.lemon); g += 224 * getWeight('lemon', contents.lemon); b += 71 * getWeight('lemon', contents.lemon); }
    if (contents.vinegar > 0) { r += 252 * getWeight('vinegar', contents.vinegar); g += 211 * getWeight('vinegar', contents.vinegar); b += 77 * getWeight('vinegar', contents.vinegar); }
    if (contents.mustard > 0) { r += 202 * getWeight('mustard', contents.mustard); g += 138 * getWeight('mustard', contents.mustard); b += 4 * getWeight('mustard', contents.mustard); }
    if (isEmulsified && contents.oil > 0) { r += 234 * getWeight('oil', contents.oil); g += 179 * getWeight('oil', contents.oil); b += 8 * getWeight('oil', contents.oil); }
    
    // Dissolved sugar slightly whitens the mixture
    if (dissolvedSugar > 0) {
      r = Math.min(255, r + 20 * getWeight('sugar', dissolvedSugar));
      g = Math.min(255, g + 20 * getWeight('sugar', dissolvedSugar));
      b = Math.min(255, b + 20 * getWeight('sugar', dissolvedSugar));
    }
    
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  }, [contents, solventVolume, dissolvedSugar, isEmulsified]);

  // OVERFLOW CHECK
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (totalVolume > MAX_VOLUME) {
      setGameState('exploded');
      addLog("💥 Oh no! The beaker overflowed!");
    }
  }, [totalVolume, gameState]);

  // WIN CHECKER
  useEffect(() => {
    if (gameState === 'playing') {
      if (mission.validate(totalVolume, temperature, contents, dissolvedSugar, isEmulsified)) {
        setTimeout(() => setGameState('won'), 1000);
      }
    }
  }, [totalVolume, temperature, contents, dissolvedSugar, isEmulsified, mission, gameState]);

  // Auto-reset exploded
  useEffect(() => {
    if (gameState === 'exploded') {
      const timer = setTimeout(() => {
        setGameState('playing');
        setContents({ water: 0, lemon: 0, sugar: 0, vinegar: 0, oil: 0, mustard: 0 });
        setTemperature(20);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const addIngredient = (id, amount) => {
    if (gameState !== 'playing') return;
    setContents(prev => ({ ...prev, [id]: prev[id] + amount }));
    addLog(`Added ${amount} units of ${INGREDIENTS[id].name}`);
  };

  const changeTemp = (amount) => {
    if (gameState !== 'playing') return;
    setTemperature(prev => Math.min(MAX_TEMP, Math.max(MIN_TEMP, prev + amount)));
    addLog(`Temperature changed to ${temperature + amount}°C`);
  };

  const emptyBeaker = () => {
    setContents({ water: 0, lemon: 0, sugar: 0, vinegar: 0, oil: 0, mustard: 0 });
    setTemperature(20);
    setGameState('playing');
    addLog("Beaker emptied and washed!");
  };

  const nextMission = () => {
    setGameState('playing');
    setContents({ water: 0, lemon: 0, sugar: 0, vinegar: 0, oil: 0, mustard: 0 });
    setTemperature(20);
    setLog(["New Recipe Started!"]);
    setCurrentMissionIdx(prev => (prev + 1) % MISSIONS.length);
  };

  // Visual Heights
  const fillPercentage = (totalVolume / MAX_VOLUME) * 100;
  const oilPercentage = isSeparated ? (contents.oil / MAX_VOLUME) * 100 : 0;
  const basePercentage = isSeparated ? ((totalVolume - contents.oil) / MAX_VOLUME) * 100 : fillPercentage;
  const solidPercentage = (undissolvedSugar / MAX_VOLUME) * 100;

  return (
    <div className="app-container">
      <header className="header">
        <h1>🍋 Daily Kitchen Science</h1>
        <p>Learn Proportions, Solubility, and Density with everyday items!</p>
      </header>

      <section className="shelf">
        <h2>🧑‍🍳 Pantry & Fridge</h2>
        <div className="button-grid">
          {Object.keys(INGREDIENTS).map(key => {
            const ing = INGREDIENTS[key];
            const colorStr = `rgb(${ing.rgb.join(',')})`;
            return (
              <div key={key} className="ingredient-card" style={{borderLeft: `4px solid ${colorStr}`}}>
                <div className="ing-info">
                  <strong>{ing.name}</strong>
                  <span className="formula">{ing.formula}</span>
                </div>
                <div className="add-btns">
                  <button className="small-btn" onClick={() => addIngredient(key, 10)}>+10</button>
                  <button className="small-btn" onClick={() => addIngredient(key, 20)}>+20</button>
                </div>
              </div>
            );
          })}
        </div>

        <h2 style={{marginTop: '1rem'}}>🔥 Stove</h2>
        <div className="physics-controls">
          <button className="physics-btn hot" onClick={() => changeTemp(10)}>🔥 Heat Up (+10°C)</button>
          <button className="physics-btn cold" onClick={() => changeTemp(-10)}>❄️ Cool Down (-10°C)</button>
        </div>
      </section>

      <section className="beaker-area">
        <div className="instruments">
          <div className="instrument-panel" style={{width: '180px'}}>
            <span>Thermometer</span>
            <div className="temp-bar">
              <div className="temp-fill" style={{ height: `${temperature}%`, background: temperature > 40 ? '#ef4444' : (temperature < 20 ? '#38bdf8' : '#22c55e') }}></div>
            </div>
            <span className="temp-value">{Math.round(temperature)}°C</span>
            <span style={{fontSize:'0.7rem'}}>{temperature > 40 ? 'HOT (High Solubility)' : 'COLD (Low Solubility)'}</span>
          </div>
        </div>

        <div className="beaker-container">
          <div className="beaker-glass">
            
            {/* The Main Liquid */}
            <div 
              className="liquid main-liquid"
              style={{ 
                height: `${basePercentage}%`, 
                backgroundColor: mixedColorBase,
                boxShadow: `0 0 15px ${mixedColorBase}`
              }}
            >
              {basePercentage > 0 && temperature > 30 && (
                <div className="bubbles">
                  <div className="bubble" style={{ left: '20%', animationDuration: '2s' }}></div>
                  <div className="bubble" style={{ left: '60%', animationDuration: '1.5s' }}></div>
                </div>
              )}
            </div>

            {/* Separated Oil Layer */}
            {isSeparated && (
              <div 
                className="liquid oil-layer"
                style={{ 
                  height: `${oilPercentage}%`, 
                  bottom: `${basePercentage}%`,
                  backgroundColor: 'rgba(234, 179, 8, 0.8)'
                }}
              >
                <div className="layer-label">Oil (Floating)</div>
              </div>
            )}

            {/* Undissolved Solid (Sugar) */}
            {undissolvedSugar > 0 && (
              <div 
                className="solid-pile"
                style={{
                  height: `${Math.max(5, solidPercentage)}%`,
                  opacity: 0.9
                }}
              >
                <div className="layer-label" style={{color: '#000'}}>Undissolved Sugar</div>
              </div>
            )}

            <div className="markers">
              <div className="measurement" data-val="25"></div>
              <div className="measurement" data-val="50"></div>
              <div className="measurement" data-val="75"></div>
              <div className="measurement" data-val="100"></div>
            </div>
          </div>
        </div>

        <div className="volume-display">
          {totalVolume} / {MAX_VOLUME} units
        </div>

        <div className="action-buttons">
          <button className="btn danger" onClick={emptyBeaker}>Wash Beaker</button>
        </div>
      </section>

      <section className="target-area">
        <h2>Recipe {mission.id}</h2>
        <div className="mission-card">
          <h3>{mission.title}</h3>
          <p className="mission-instructions">{mission.instructions}</p>
        </div>
        
        <div className="log-panel">
          <h4>📋 Science Observations:</h4>
          <ul>
            {log.map((entry, idx) => (
              <li key={idx} style={{ opacity: 1 - (idx * 0.25) }}>{entry}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* OVERLAYS */}
      {gameState === 'exploded' && (
        <div className="explosion-overlay">
          <h2>💥 OVERFLOW! 💥</h2>
          <p>You added more than 100 units and spilled it everywhere!</p>
        </div>
      )}

      {gameState === 'won' && (
        <div className="win-overlay">
          <h2>🍽️ DELICIOUS SCIENCE! 🍽️</h2>
          <p className="win-subtitle">You calculated the perfect recipe using Physics and Math!</p>
          <button className="btn" onClick={nextMission}>Next Recipe ➔</button>
        </div>
      )}
    </div>
  );
}

export default App;
