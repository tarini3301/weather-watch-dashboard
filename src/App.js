import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Droplet } from 'lucide-react'; // Using lucide-react for icons

// Main App component
const App = () => {
    // State variables for managing the application's data and UI
    const [city, setCity] = useState(''); // Stores the city name entered by the user
    const [weatherData, setWeatherData] = useState(null); // Stores the fetched weather data
    const [loading, setLoading] = useState(false); // Indicates if data is currently being fetched
    const [error, setError] = useState(''); // Stores any error messages

    // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key.
    // Get it from: https://openweathermap.org/api
    const API_KEY = '65d371d27821bbd88d0b6d276afaab03'; // <<< IMPORTANT: Replace this with your actual API Key!

    // Function to fetch weather data from OpenWeatherMap API
    const fetchWeatherData = async () => {
        // Clear previous error and set loading state
        setError('');
        setLoading(true);
        setWeatherData(null); // Clear previous weather data

        // Check if a city name has been entered
        if (!city.trim()) {
            setError('Please enter a city name.');
            setLoading(false);
            return;
        }

        try {
            // Construct the API URL for current weather data
            // 'units=metric' fetches temperature in Celsius, 'units=imperial' for Fahrenheit
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

            // Make the API request
            const response = await fetch(url);

            // Check if the response was successful (status code 2xx)
            if (!response.ok) {
                // If not successful, parse the error message from the API
                const data = await response.json();
                throw new Error(data.message || 'Could not fetch weather data. Please try again.');
            }

            // Parse the successful response
            const data = await response.json();

            // Update the weatherData state with the fetched information
            setWeatherData({
                name: data.name,
                country: data.sys.country,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                description: data.weather[0].description,
                icon: data.weather[0].icon // OpenWeatherMap provides an icon code
            });
        } catch (err) {
            // Catch and display any errors during the fetch process
            setError(`Error: ${err.message}`);
        } finally {
            // Always set loading to false after the request completes (success or failure)
            setLoading(false);
        }
    };

    // Helper function to get an appropriate icon based on weather description
    const getWeatherIcon = (iconCode) => {
        // OpenWeatherMap icon codes are well-documented.
        // We'll map a few common ones to lucide-react icons.
        switch (iconCode.substring(0, 2)) { // Take first two chars (e.g., '01' for clear sky)
            case '01': return <Sun size={48} className="text-yellow-400" />; // Clear sky
            case '02': return <Cloud size={48} className="text-gray-400" />; // Few clouds
            case '03':
            case '04': return <Cloud size={48} className="text-gray-500" />; // Scattered/broken clouds
            case '09':
            case '10': return <CloudRain size={48} className="text-blue-500" />; // Rain
            case '11': return <CloudRain size={48} className="text-red-500" />; // Thunderstorm (using rain icon for simplicity)
            case '13': return <Cloud size={48} className="text-white" />; // Snow (using cloud icon for simplicity)
            case '50': return <Cloud size={48} className="text-gray-400" />; // Mist (using cloud icon for simplicity)
            default: return <Sun size={48} className="text-gray-300" />; // Default icon
        }
    };


    // Render the UI
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center p-4 font-inter">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md md:max-w-lg lg:max-w-xl text-center transition-all duration-300 ease-in-out">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    <span className="text-blue-600">Weather</span> Watch
                </h1>

                {/* City input and Search Button */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        className="flex-grow p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-gray-800 placeholder-gray-400"
                        placeholder="Enter city name (e.g., London)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                fetchWeatherData();
                            }
                        }}
                    />
                    <button
                        onClick={fetchWeatherData}
                        disabled={loading} // Disable button while loading
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Searching...' : 'Get Weather'}
                    </button>
                </div>

                {/* Loading and Error Messages */}
                {loading && (
                    <p className="text-blue-600 text-lg font-medium animate-pulse mb-4">
                        Fetching weather data...
                    </p>
                )}
                {error && (
                    <p className="text-red-500 text-lg font-medium mb-4">
                        {error}
                    </p>
                )}

                {/* Display Weather Data */}
                {weatherData && (
                    <div className="bg-blue-50 p-6 rounded-lg shadow-inner mt-6 animate-fade-in-up">
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">
                            {weatherData.name}, {weatherData.country}
                        </h2>
                        <div className="flex flex-col items-center justify-center my-4">
                            {getWeatherIcon(weatherData.icon)} {/* Display dynamic weather icon */}
                            <p className="text-gray-700 text-lg capitalize mt-2">
                                {weatherData.description}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
                            <div className="flex items-center justify-center bg-blue-100 p-4 rounded-lg shadow-sm">
                                <Thermometer size={24} className="text-red-500 mr-2" />
                                <span className="text-xl font-semibold">
                                    Temperature: {weatherData.temperature.toFixed(1)}°C
                                </span>
                            </div>
                            <div className="flex items-center justify-center bg-blue-100 p-4 rounded-lg shadow-sm">
                                <Droplet size={24} className="text-blue-500 mr-2" />
                                <span className="text-xl font-semibold">
                                    Humidity: {weatherData.humidity}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
