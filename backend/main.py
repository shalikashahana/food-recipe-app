from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data import RECIPE_DATA
import os
import uvicorn

app = FastAPI()

# 1. லோக்கல் ஹோஸ்ட் மற்றும் நெட்லிஃபை டொமைன்களுக்கான அனுமதி (CORS)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "https://recipeyyy-finder.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. பிரண்ட்-எண்டிற்கு ஏற்றவாறு மாற்றி அமைக்கப்பட்ட புதிய Routes (No /api prefix)
@app.get("/countries")
def get_countries():
    return list(RECIPE_DATA.keys())

@app.get("/states/{country}")
def get_states(country: str):
    country_data = RECIPE_DATA.get(country)
    if not country_data:
        return {"error": "Country not found"}
    return list(country_data.keys())

@app.get("/dishes/{country}/{state}")
def get_dishes(country: str, state: str):
    country_data = RECIPE_DATA.get(country)
    if not country_data:
        return {"error": "Country not found"}
    state_data = country_data.get(state)
    if not state_data:
        return {"error": "State not found"}
    return list(state_data.keys())

@app.get("/recipe/{country}/{state}/{dish}")
def get_recipe(country: str, state: str, dish: str):
    try:
        recipe = RECIPE_DATA[country][state][dish]
        return recipe
    except KeyError:
        return {"error": "Recipe not found"}

# 3. Render போர்ட் மற்றும் சர்வர் ரன் செய்யும் பகுதி
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)