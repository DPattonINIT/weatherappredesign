"use client";
import SearchBar from "@/components/Searchbar";
import ForecastCard from "@/components/ForecastCard";
import FavoritesList from "@/components/FavoritesList";
import { useState, useEffect } from "react";
import TodayCard from "@/components/TodayCard";
// import Image from "next/image";

const API_KEY = "2a81aae1fd6131a7dd0e3509c4a72374";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { description: string; icon: string }[];
}

interface ProcessedForecastItem extends ForecastItem {
  day: string;
}

interface ForecastData {
  list: ForecastItem[];
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ProcessedForecastItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [foodRecommendation, setFoodRecommendation] = useState<string | null>(null);


  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const fetchWeather = async (city: string) => {
    try {
      setWeather(null);
      setForecast([]);

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`
      );
      if (!weatherResponse.ok) throw new Error("City not found");
      const weatherData: WeatherData = await weatherResponse.json();
      setWeather(weatherData);

      setFoodRecommendation(getFoodRecommendation(weatherData.main.temp));

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`
      );
      if (!forecastResponse.ok) throw new Error("Forecast not found");
      const forecastData: ForecastData = await forecastResponse.json();

      const today = new Date().getDate();
      const dailyForecast: ProcessedForecastItem[] = forecastData.list
        .filter((entry) => new Date(entry.dt * 1000).getDate() !== today)
        .filter((_, index) => index % 8 === 0)
        .map((entry) => ({
          ...entry,
          day: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
            new Date(entry.dt * 1000)
          ),
        }));

      setForecast(dailyForecast);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };


  const addToFavorites = () => {
    if (weather && !favorites.includes(weather.name)) {
      if (favorites.length >= 5) {
        alert("You can store up to 5 cities. Please delete to add more.");
        return;
      }

      const updatedFavorites = [...favorites, weather.name];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorites = (city: string) => {
    const updatedFavorites = favorites.filter((fav) => fav !== city);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const getFoodRecommendation = (temp: number) => {
    const coldWeatherFoods = [
      "Beef Stew: Slow cook beef chunks with potatoes, carrots, and onions in a rich broth for a hearty and comforting meal.",
      "Chicken Pot Pie: A warm, flaky pastry filled with a creamy mix of chicken, peas, and carrots—perfect for chilly days.",
      "Hot Chocolate & Marshmallows: Heat milk with cocoa powder and sugar, then top with marshmallows for a cozy treat."
    ];

    const coolWeatherFoods = [
      "Grilled Cheese & Tomato Soup: Butter slices of bread, add cheese, and grill until golden brown. Serve with warm tomato soup.",
      "Baked Ziti: Layer pasta with ricotta, marinara sauce, and mozzarella cheese, then bake until bubbly.",
      "Stuffed Peppers: Fill bell peppers with a mix of ground beef, rice, and tomato sauce, then bake until tender."
    ];

    const mildWeatherFoods = [
      "Caesar Salad with Grilled Chicken: Toss romaine lettuce with Caesar dressing, croutons, and grilled chicken for a fresh meal.",
      "Pasta Primavera: Sauté fresh vegetables and mix with pasta and olive oil for a light but filling dish.",
      "BBQ Chicken Sandwich: Grill chicken breasts, toss with BBQ sauce, and serve on a toasted bun with coleslaw."
    ];

    const warmWeatherFoods = [
      "Fish Tacos: Grill white fish, then serve on corn tortillas with slaw and a squeeze of lime.",
      "Caprese Salad: Slice fresh tomatoes and mozzarella, top with basil, olive oil, and balsamic glaze.",
      "Mango Smoothie: Blend mango, yogurt, and ice for a refreshing and healthy drink."
    ];

    const hotWeatherFoods = [
      "Tuna Steak: Sear the tuna steak in a hot pan for about 1-2 minutes per side, season with salt, pepper, and olive oil.",
      "Shrimp Ceviche: Marinate shrimp in lime juice, mix with diced tomatoes, onions, and cilantro for a zesty dish.",
      "Watermelon & Feta Salad: Dice watermelon, mix with feta cheese and mint leaves for a refreshing bite."
    ];

    let foodOptions: string[];

    if (temp < 50) {
      foodOptions = coldWeatherFoods;
    } else if (temp < 65) {
      foodOptions = coolWeatherFoods;
    } else if (temp < 75) {
      foodOptions = mildWeatherFoods;
    } else if (temp < 85) {
      foodOptions = warmWeatherFoods;
    } else {
      foodOptions = hotWeatherFoods;
    }

    return foodOptions[Math.floor(Math.random() * foodOptions.length)];
  };

  return (

    <div>

      <SearchBar onSearch={fetchWeather} />


      {weather && (
        <div className="contentContainer">
          <div className="todayContainer">
            <TodayCard
              temp={Math.round(weather.main.temp)}
              high={Math.round(weather.main.temp_max)}
              low={Math.round(weather.main.temp_min)}
              city={weather.name}
            />
            <div className="favoriteContainer">
              <button onClick={addToFavorites} className="favoriteBTN">
                Add to Favorites
              </button>
            </div>
          </div>


          {foodRecommendation && (
            <div className="foodContainer">
              <h2 className="foodTitle">Today&apos;s Recommendation</h2>

              <p className="foodDesc">{foodRecommendation}</p>
            </div>
          )}
        </div>
      )}


      <div className="weeklyContainer">
        <FavoritesList favorites={favorites} onSelect={fetchWeather} onDelete={removeFromFavorites} />
        {forecast.length > 0 && forecast.map((day, index) => (
          <ForecastCard key={index} day={day.day} temp={Math.round(day.main.temp)}  />
        ))}
      </div>
    </div>
  );
}
