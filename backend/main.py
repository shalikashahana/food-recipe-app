from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data import RECIPE_DATA
import os
import uvicorn

app = FastAPI()

# Allow requests from React dev server
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/countries")
def get_countries():
    return list(RECIPE_DATA.keys())

@app.get("/api/states/{country}")
def get_states(country: str):
    country_data = RECIPE_DATA.get(country)
    if not country_data:
        return {"error": "Country not found"}
    return list(country_data.keys())

@app.get("/api/dishes/{country}/{state}")
def get_dishes(country: str, state: str):
    country_data = RECIPE_DATA.get(country)
    if not country_data:
        return {"error": "Country not found"}
    state_data = country_data.get(state)
    if not state_data:
        return {"error": "State not found"}
    # Return list of dish names
    return list(state_data.keys())

@app.get("/api/recipe/{country}/{state}/{dish}")
def get_recipe(country: str, state: str, dish: str):
    try:
        recipe = RECIPE_DATA[country][state][dish]
        return recipe
    except KeyError:
        return {"error": "Recipe not found"}



# உங்கள் மற்ற API கோடிங்குகள் இங்கே இருக்கும்...

if __name__ == "__main__":
    # Render தனியாக ஒரு Port-ஐ உருவாக்கும், அதை எடுக்க இதை பயன்படுத்த வேண்டும்
    port = int(os.environ.get("PORT", 8000))

    # host முகவரியை "0.0.0.0" என்று கட்டாயம் கொடுக்க வேண்டும்
    uvicorn.run("main:app", host="0.0.0.0", port=port)