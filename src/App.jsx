import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const TRANSLATIONS = {
  en: {
    title: "🍋 Daily Kitchen Science",
    subtitle: "Learn Proportions, Solubility, and Density with everyday items!",
    pantry: "🧑‍🍳 Pantry & Fridge",
    stove: "🔥 Stove",
    heatUp: "🔥 Heat Up (+10°C)",
    coolDown: "❄️ Cool Down (-10°C)",
    thermometer: "Thermometer",
    hot: "HOT (High Solubility)",
    cold: "COLD (Low Solubility)",
    washBeaker: "Wash Beaker",
    recipe: "Recipe",
    observations: "📋 Science Observations:",
    overflow: "💥 OVERFLOW! 💥",
    overflowDesc: "You added more than 100 units and spilled it everywhere!",
    wonTitle: "🍽️ DELICIOUS SCIENCE! 🍽️",
    wonDesc: "You calculated the perfect recipe using Physics and Math!",
    nextRecipe: "Next Recipe ➔",
    oilLayer: "Oil (Floating)",
    sugarPile: "Undissolved Sugar",
    burntTitle: "🔥 BURNT CARAMEL! 🔥",
    burntDesc: "You added too much sugar and boiled it! It turned into a rock-hard burnt mess!",
    toxicTitle: "🤢 TOXIC SLUDGE! 🤢",
    toxicDesc: "You mixed too much vinegar and mustard! It smells terrible!",
    
    ingWater: "Tap Water",
    ingLemon: "Lemon Juice",
    ingSugar: "Sugar Cubes",
    ingVinegar: "Vinegar",
    ingOil: "Cooking Oil",
    ingMustard: "Mustard",
    
    fWater: "H₂O (Solvent)",
    fLemon: "Citric Acid",
    fSugar: "Sucrose (Solute)",
    fVinegar: "Acetic Acid",
    fOil: "Lipid (Non-polar)",
    fMustard: "Emulsifier",

    m1Title: "Sweet Lemonade (Solubility)",
    m1Inst: "DAILY LIFE: Make Lemonade! Mix 20 units Lemon Juice, 60 units Water, and 20 units Sugar. Notice how the sugar piles up at the bottom? Heat the water above 40°C to increase its solubility and dissolve the sugar!",
    m2Title: "Vinaigrette Dressing (Density & Emulsifiers)",
    m2Inst: "DAILY LIFE: Oil and Vinegar don't mix because of density! Add exactly 60 units Oil and 20 units Vinegar. Watch them separate! Then, add 10 units of Mustard (an Emulsifier) to bind them together!",
    m3Title: "The Dilution Ratio",
    m3Inst: "MATH: Lemon juice is too sour! Create a 1:4 ratio of Lemon Juice to Water. Make exactly 100 units total. (Hint: fractions!)",

    logSaturated: (amount) => `Physics: The liquid is saturated! ${amount} units of Sugar won't dissolve. Try heating it up!`,
    logDissolved: "Chemistry: All the sugar dissolved perfectly into the solvent!",
    logSeparated: "Physics: Oil is non-polar and less dense! It's floating on top of the water/vinegar.",
    logEmulsified: "Chemistry: The Mustard acted as an Emulsifier! The oil and vinegar are now bound together!",
    logOverflow: "💥 Oh no! The beaker overflowed!",
    logAdded: (amount, name) => `Added ${amount} units of ${name}`,
    logTemp: (temp) => `Temperature changed to ${temp}°C`,
    logWashed: "Beaker emptied and washed!",
    logStart: "Welcome to the Daily Chemistry Kitchen!",
    logNewM: "New Recipe Started!"
  },
  fr: {
    title: "🍋 Science en Cuisine",
    subtitle: "Apprenez les proportions, la solubilité et la densité au quotidien !",
    pantry: "🧑‍🍳 Garde-manger & Frigo",
    stove: "🔥 Cuisinière",
    heatUp: "🔥 Chauffer (+10°C)",
    coolDown: "❄️ Refroidir (-10°C)",
    thermometer: "Thermomètre",
    hot: "CHAUD (Haute solubilité)",
    cold: "FROID (Faible solubilité)",
    washBeaker: "Laver le Bécher",
    recipe: "Recette",
    observations: "📋 Observations Scientifiques :",
    overflow: "💥 DÉBORDEMENT ! 💥",
    overflowDesc: "Vous avez ajouté plus de 100 unités et tout renversé !",
    wonTitle: "🍽️ DÉLICIEUSE SCIENCE ! 🍽️",
    wonDesc: "Vous avez calculé la recette parfaite avec la physique et les mathématiques !",
    nextRecipe: "Recette Suivante ➔",
    oilLayer: "Huile (Flottante)",
    sugarPile: "Sucre non dissous",
    burntTitle: "🔥 CARAMEL BRÛLÉ ! 🔥",
    burntDesc: "Vous avez fait bouillir trop de sucre ! C'est devenu dur comme de la pierre !",
    toxicTitle: "🤢 BOUE TOXIQUE ! 🤢",
    toxicDesc: "Vous avez mélangé trop de vinaigre et de moutarde ! Ça sent très mauvais !",

    ingWater: "Eau du Robinet",
    ingLemon: "Jus de Citron",
    ingSugar: "Morceaux de Sucre",
    ingVinegar: "Vinaigre",
    ingOil: "Huile de Cuisson",
    ingMustard: "Moutarde",

    fWater: "H₂O (Solvant)",
    fLemon: "Acide Citrique",
    fSugar: "Saccharose (Soluté)",
    fVinegar: "Acide Acétique",
    fOil: "Lipide (Apolaire)",
    fMustard: "Émulsifiant",

    m1Title: "Limonade Sucrée (Solubilité)",
    m1Inst: "VIE QUOTIDIENNE : Faites de la limonade ! Mélangez 20 unités de citron, 60 d'eau et 20 de sucre. Le sucre s'accumule au fond ? Chauffez l'eau à plus de 40°C pour le dissoudre !",
    m2Title: "Vinaigrette (Densité & Émulsifiants)",
    m2Inst: "VIE QUOTIDIENNE : L'huile et le vinaigre ne se mélangent pas ! Ajoutez 60 unités d'huile et 20 de vinaigre et regardez-les se séparer ! Puis ajoutez 10 unités de Moutarde pour les lier !",
    m3Title: "Le Ratio de Dilution",
    m3Inst: "MATHS : Le jus de citron est trop acide ! Créez un ratio de 1:4 entre le citron et l'eau. Atteignez exactement 100 unités au total.",

    logSaturated: (amount) => `Physique : Liquide saturé ! ${amount} unités de sucre ne se dissolvent pas. Chauffez-le !`,
    logDissolved: "Chimie : Tout le sucre s'est parfaitement dissous dans le solvant !",
    logSeparated: "Physique : L'huile est apolaire et moins dense ! Elle flotte au-dessus de la solution.",
    logEmulsified: "Chimie : La moutarde a agi comme émulsifiant ! L'huile et le vinaigre sont liés !",
    logOverflow: "💥 Oh non ! Le bécher a débordé !",
    logAdded: (amount, name) => `Ajout de ${amount} unités de ${name}`,
    logTemp: (temp) => `Température modifiée à ${temp}°C`,
    logWashed: "Bécher vidé et lavé !",
    logStart: "Bienvenue dans la Cuisine Scientifique !",
    logNewM: "Nouvelle Recette Commencée !"
  }
};

const getIngredients = (t) => ({
  water: { id: 'water', name: t.ingWater, formula: t.fWater, rgb: [147, 197, 253] },
  lemon: { id: 'lemon', name: t.ingLemon, formula: t.fLemon, rgb: [253, 224, 71] },
  sugar: { id: 'sugar', name: t.ingSugar, formula: t.fSugar, rgb: [255, 255, 255] },
  vinegar: { id: 'vinegar', name: t.ingVinegar, formula: t.fVinegar, rgb: [252, 211, 77] },
  oil: { id: 'oil', name: t.ingOil, formula: t.fOil, rgb: [234, 179, 8] },
  mustard: { id: 'mustard', name: t.ingMustard, formula: t.fMustard, rgb: [202, 138, 4] }
});

const getMissions = (t) => [
  {
    id: 1,
    title: t.m1Title,
    instructions: t.m1Inst,
    validate: (vol, temp, contents, dissolvedSugar, isEmulsified) => 
      contents.lemon === 20 && contents.water === 60 && contents.sugar === 20 && dissolvedSugar === 20
  },
  {
    id: 2,
    title: t.m2Title,
    instructions: t.m2Inst,
    validate: (vol, temp, contents, dissolvedSugar, isEmulsified) => 
      contents.oil === 60 && contents.vinegar === 20 && contents.mustard >= 10 && isEmulsified
  },
  {
    id: 3,
    title: t.m3Title,
    instructions: t.m3Inst,
    validate: (vol, temp, contents, dissolvedSugar, isEmulsified) => 
      contents.lemon === 20 && contents.water === 80 && vol === 100
  }
];

const MAX_VOLUME = 100;
const MAX_TEMP = 100;
const MIN_TEMP = 0;

function App() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];
  const INGREDIENTS = getIngredients(t);
  const MISSIONS = getMissions(t);

  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [contents, setContents] = useState({ water: 0, lemon: 0, sugar: 0, vinegar: 0, oil: 0, mustard: 0 });
  const [temperature, setTemperature] = useState(20);
  const [gameState, setGameState] = useState('playing'); // playing, exploded, won, burnt, toxic
  const [log, setLog] = useState([t.logStart]);

  const mission = MISSIONS[currentMissionIdx];
  const totalVolume = Object.values(contents).reduce((a, b) => a + b, 0);

  useEffect(() => {
    setLog([t.logStart]);
  }, [lang, t.logStart]);

  const addLog = (msg) => {
    setLog(prev => {
      if (prev[0] === msg) return prev;
      return [msg, ...prev].slice(0, 4);
    });
  };

  const solventVolume = contents.water + contents.lemon + contents.vinegar;
  let maxSolubleSugar = 0;
  if (solventVolume > 0) {
    const tempFactor = Math.max(0.1, temperature / 20);
    maxSolubleSugar = solventVolume * 0.2 * tempFactor;
  }
  
  const dissolvedSugar = Math.min(contents.sugar, maxSolubleSugar);
  const undissolvedSugar = contents.sugar - dissolvedSugar;

  useEffect(() => {
    if (undissolvedSugar > 0 && contents.sugar > 0) {
      addLog(t.logSaturated(undissolvedSugar.toFixed(1)));
    } else if (contents.sugar > 0 && undissolvedSugar === 0) {
      addLog(t.logDissolved);
    }
  }, [undissolvedSugar, contents.sugar, t]);

  const isEmulsified = contents.mustard > 0;
  const isSeparated = contents.oil > 0 && solventVolume > 0 && !isEmulsified;

  useEffect(() => {
    if (isSeparated) {
      addLog(t.logSeparated);
    } else if (contents.oil > 0 && isEmulsified) {
      addLog(t.logEmulsified);
    }
  }, [isSeparated, isEmulsified, contents.oil, t]);

  const mixedColorBase = useMemo(() => {
    if (gameState === 'toxic') return 'rgba(101, 163, 13, 0.9)';
    if (gameState === 'burnt') return 'rgba(69, 26, 3, 0.9)';

    let r = 0, g = 0, b = 0;
    let baseVol = solventVolume + dissolvedSugar + contents.mustard;
    if (isEmulsified) baseVol += contents.oil;
    
    if (baseVol === 0) return 'transparent';

    const getWeight = (key, vol) => vol / baseVol;
    
    if (contents.water > 0) { r += 147 * getWeight('water', contents.water); g += 197 * getWeight('water', contents.water); b += 253 * getWeight('water', contents.water); }
    if (contents.lemon > 0) { r += 253 * getWeight('lemon', contents.lemon); g += 224 * getWeight('lemon', contents.lemon); b += 71 * getWeight('lemon', contents.lemon); }
    if (contents.vinegar > 0) { r += 252 * getWeight('vinegar', contents.vinegar); g += 211 * getWeight('vinegar', contents.vinegar); b += 77 * getWeight('vinegar', contents.vinegar); }
    if (contents.mustard > 0) { r += 202 * getWeight('mustard', contents.mustard); g += 138 * getWeight('mustard', contents.mustard); b += 4 * getWeight('mustard', contents.mustard); }
    if (isEmulsified && contents.oil > 0) { r += 234 * getWeight('oil', contents.oil); g += 179 * getWeight('oil', contents.oil); b += 8 * getWeight('oil', contents.oil); }
    
    if (dissolvedSugar > 0) {
      r = Math.min(255, r + 20 * getWeight('sugar', dissolvedSugar));
      g = Math.min(255, g + 20 * getWeight('sugar', dissolvedSugar));
      b = Math.min(255, b + 20 * getWeight('sugar', dissolvedSugar));
    }
    
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  }, [contents, solventVolume, dissolvedSugar, isEmulsified, gameState]);

  // Check for catastrophies!
  useEffect(() => {
    if (gameState !== 'playing') return;

    // 1. Burnt Caramel: Lots of sugar, low solvent, high heat
    if (contents.sugar >= 30 && temperature >= 90 && solventVolume < contents.sugar) {
      setGameState('burnt');
      addLog("🔥 SUGAR BURNED!");
      return;
    }

    // 2. Toxic Sludge: Vinegar + Mustard (Lots of it)
    if (contents.vinegar >= 30 && contents.mustard >= 20) {
      setGameState('toxic');
      addLog("🤢 TOXIC REACTION!");
      return;
    }

    // 3. Overflow
    if (totalVolume > MAX_VOLUME) {
      setGameState('exploded');
      addLog(t.logOverflow);
    }
  }, [contents, temperature, solventVolume, totalVolume, gameState, t]);

  // Win Checker
  useEffect(() => {
    if (gameState === 'playing') {
      if (mission.validate(totalVolume, temperature, contents, dissolvedSugar, isEmulsified)) {
        setTimeout(() => setGameState('won'), 1000);
      }
    }
  }, [totalVolume, temperature, contents, dissolvedSugar, isEmulsified, mission, gameState]);

  // Auto-reset catastrophies
  useEffect(() => {
    if (['exploded', 'burnt', 'toxic'].includes(gameState)) {
      const timer = setTimeout(() => {
        setGameState('playing');
        setContents({ water: 0, lemon: 0, sugar: 0, vinegar: 0, oil: 0, mustard: 0 });
        setTemperature(20);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const addIngredient = (id, amount) => {
    if (gameState !== 'playing') return;
    setContents(prev => ({ ...prev, [id]: prev[id] + amount }));
    addLog(t.logAdded(amount, INGREDIENTS[id].name));
  };

  const changeTemp = (amount) => {
    if (gameState !== 'playing') return;
    setTemperature(prev => Math.min(MAX_TEMP, Math.max(MIN_TEMP, prev + amount)));
    addLog(t.logTemp(temperature + amount));
  };

  const emptyBeaker = () => {
    setContents({ water: 0, lemon: 0, sugar: 0, vinegar: 0, oil: 0, mustard: 0 });
    setTemperature(20);
    setGameState('playing');
    addLog(t.logWashed);
  };

  const nextMission = () => {
    setGameState('playing');
    setContents({ water: 0, lemon: 0, sugar: 0, vinegar: 0, oil: 0, mustard: 0 });
    setTemperature(20);
    setLog([t.logNewM]);
    setCurrentMissionIdx(prev => (prev + 1) % MISSIONS.length);
  };

  const fillPercentage = (totalVolume / MAX_VOLUME) * 100;
  const oilPercentage = isSeparated ? (contents.oil / MAX_VOLUME) * 100 : 0;
  const basePercentage = isSeparated ? ((totalVolume - contents.oil) / MAX_VOLUME) * 100 : fillPercentage;
  const solidPercentage = (undissolvedSugar / MAX_VOLUME) * 100;

  return (
    <div className="app-container">
      <header className="header">
        <div className="lang-switcher">
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>🇺🇸 EN</button>
          <button className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} onClick={() => setLang('fr')}>🇫🇷 FR</button>
        </div>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </header>

      <section className="shelf">
        <h2>{t.pantry}</h2>
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

        <h2 style={{marginTop: '1rem'}}>{t.stove}</h2>
        <div className="physics-controls">
          <button className="physics-btn hot" onClick={() => changeTemp(10)}>{t.heatUp}</button>
          <button className="physics-btn cold" onClick={() => changeTemp(-10)}>{t.coolDown}</button>
        </div>
      </section>

      <section className="beaker-area">
        <div className="instruments">
          <div className="instrument-panel" style={{width: '180px'}}>
            <span>{t.thermometer}</span>
            <div className="temp-bar">
              <div className="temp-fill" style={{ height: `${temperature}%`, background: temperature > 40 ? '#ef4444' : (temperature < 20 ? '#38bdf8' : '#22c55e') }}></div>
            </div>
            <span className="temp-value">{Math.round(temperature)}°C</span>
            <span style={{fontSize:'0.7rem'}}>{temperature > 40 ? t.hot : t.cold}</span>
          </div>
        </div>

        <div className="beaker-container">
          <div className="beaker-glass">
            
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

            {isSeparated && (
              <div 
                className="liquid oil-layer"
                style={{ 
                  height: `${oilPercentage}%`, 
                  bottom: `${basePercentage}%`,
                  backgroundColor: 'rgba(234, 179, 8, 0.8)'
                }}
              >
                <div className="layer-label">{t.oilLayer}</div>
              </div>
            )}

            {undissolvedSugar > 0 && (
              <div 
                className="solid-pile"
                style={{
                  height: `${Math.max(5, solidPercentage)}%`,
                  opacity: 0.9
                }}
              >
                <div className="layer-label" style={{color: '#000'}}>{t.sugarPile}</div>
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
          <button className="btn danger" onClick={emptyBeaker}>{t.washBeaker}</button>
        </div>
      </section>

      <section className="target-area">
        <h2>{t.recipe} {mission.id}</h2>
        <div className="mission-card">
          <h3>{mission.title}</h3>
          <p className="mission-instructions">{mission.instructions}</p>
        </div>
        
        <div className="log-panel">
          <h4>{t.observations}</h4>
          <ul>
            {log.map((entry, idx) => (
              <li key={idx} style={{ opacity: 1 - (idx * 0.25) }}>{entry}</li>
            ))}
          </ul>
        </div>
      </section>

      {gameState === 'exploded' && (
        <div className="explosion-overlay">
          <h2>{t.overflow}</h2>
          <p>{t.overflowDesc}</p>
        </div>
      )}

      {gameState === 'burnt' && (
        <div className="burnt-overlay">
          <h2>{t.burntTitle}</h2>
          <p>{t.burntDesc}</p>
        </div>
      )}

      {gameState === 'toxic' && (
        <div className="toxic-overlay">
          <h2>{t.toxicTitle}</h2>
          <p>{t.toxicDesc}</p>
        </div>
      )}

      {gameState === 'won' && (
        <div className="win-overlay">
          <h2>{t.wonTitle}</h2>
          <p className="win-subtitle">{t.wonDesc}</p>
          <button className="btn" onClick={nextMission}>{t.nextRecipe}</button>
        </div>
      )}
    </div>
  );
}

export default App;
