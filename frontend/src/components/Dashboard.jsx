import { useState, useEffect } from 'react';
import { logout } from '../firebase';

const BASE_API = 'https://food-recipe-app-gv4x.onrender.com';

function Dashboard({ user }) {
  const [step, setStep] = useState('countries'); // countries | states | dishes | recipe
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    fetch(`${BASE_API}/countries`)
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error(err));
  }, []);

  const handleCountryClick = async (country) => {
    setSelectedCountry(country);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API}/states/${encodeURIComponent(country)}`);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setStates(data);
      setStep('states');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStateClick = async (state) => {
    setSelectedState(state);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API}/dishes/${encodeURIComponent(selectedCountry)}/${encodeURIComponent(state)}`);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setDishes(data);
      setStep('dishes');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDishClick = async (dish) => {
    setSelectedDish(dish);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API}/recipe/${encodeURIComponent(selectedCountry)}/${encodeURIComponent(selectedState)}/${encodeURIComponent(dish)}`);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setRecipe(data);
      setStep('recipe');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'states') {
      setStep('countries');
      setStates([]);
    } else if (step === 'dishes') {
      setStep('states');
      setDishes([]);
    } else if (step === 'recipe') {
      setStep('dishes');
      setRecipe(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Happy Cooking! {user.displayName || 'Chef'}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        {loading && <div className="loading-spinner">Loading...</div>}

        {step === 'countries' && !loading && (
          <div className="selection-grid">
            <h2>Select a Country</h2>
            <div className="grid">
              {countries.map(country => (
                <button
                  key={country}
                  className="grid-item"
                  onClick={() => handleCountryClick(country)}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'states' && !loading && (
          <div className="selection-grid">
            <button className="back-btn" onClick={goBack}>← Back to Countries</button>
            <h2>States in {selectedCountry}</h2>
            <div className="grid">
              {states.map(state => (
                <button
                  key={state}
                  className="grid-item"
                  onClick={() => handleStateClick(state)}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'dishes' && !loading && (
          <div className="selection-grid">
            <button className="back-btn" onClick={goBack}>← Back to States</button>
            <h2>Famous Dishes in {selectedState}</h2>
            <div className="grid">
              {dishes.map(dish => (
                <button
                  key={dish}
                  className="grid-item"
                  onClick={() => handleDishClick(dish)}
                >
                  {dish}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'recipe' && !loading && recipe && (
          <div className="recipe-detail">
            <button className="back-btn" onClick={goBack}>← Back to Dishes</button>
            <h2>{selectedDish}</h2>
            <div className="recipe-section">
              <h3>Ingredients</h3>
              <ul>
                {recipe.ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="recipe-section">
              <h3>Instructions</h3>
              <ol>
                {recipe.instructions.map((stepText, idx) => (
                  <li key={idx}>{stepText}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;