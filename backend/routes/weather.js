const express = require('express')

const router = express.Router()

// Free Weather API endpoint (using open-meteo.com - no API key needed)
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

// Helper function to get weather from Open-Meteo API
async function getWeatherFromOpenMeteo(lat, lng) {
  try {
    const response = await fetch(
      `${WEATHER_API}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
    )
    const data = await response.json()
    const current = data.current

    // Map weather codes to descriptions
    const weatherDescriptions = {
      0: 'Clear Sky',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      71: 'Slight Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers',
      82: 'Violent Rain Showers',
      85: 'Slight Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Hail',
      99: 'Thunderstorm with Hail',
    }

    const weatherEmojis = {
      0: '☀️',
      1: '🌤️',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌧️',
      53: '🌧️',
      55: '🌧️',
      61: '🌧️',
      63: '🌧️',
      65: '⛈️',
      71: '❄️',
      73: '❄️',
      75: '❄️',
      77: '❄️',
      80: '🌧️',
      81: '🌧️',
      82: '⛈️',
      85: '🌨️',
      86: '🌨️',
      95: '⛈️',
      96: '⛈️',
      99: '⛈️',
    }

    return {
      temp: current.temperature_2m,
      condition: weatherDescriptions[current.weather_code] || 'Unknown',
      humidity: current.relative_humidity_2m,
      wind_speed: current.wind_speed_10m,
      icon: weatherEmojis[current.weather_code] || '🌍',
    }
  } catch (error) {
    console.error('Weather API error:', error)
    throw error
  }
}

// Helper function to get forecast from Open-Meteo API
async function getForecastFromOpenMeteo(lat, lng, days = 5) {
  try {
    const response = await fetch(
      `${WEATHER_API}?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=${days}`
    )
    const data = await response.json()

    const weatherEmojis = {
      0: '☀️',
      1: '🌤️',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌧️',
      53: '🌧️',
      55: '🌧️',
      61: '🌧️',
      63: '🌧️',
      65: '⛈️',
      71: '❄️',
      73: '❄️',
      75: '❄️',
      77: '❄️',
      80: '🌧️',
      81: '🌧️',
      82: '⛈️',
      85: '🌨️',
      86: '🌨️',
      95: '⛈️',
      96: '⛈️',
      99: '⛈️',
    }

    const weatherConditions = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Drizzle',
      53: 'Drizzle',
      55: 'Drizzle',
      61: 'Rain',
      63: 'Rain',
      65: 'Heavy Rain',
      71: 'Snow',
      73: 'Snow',
      75: 'Snow',
      77: 'Snow',
      80: 'Showers',
      81: 'Showers',
      82: 'Heavy Showers',
      85: 'Snow Showers',
      86: 'Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm',
      99: 'Thunderstorm',
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const forecast = data.daily.time.map((date, idx) => {
      const dateObj = new Date(date)
      const dayName = dayNames[dateObj.getDay()]
      const code = data.daily.weather_code[idx]

      return {
        date: dayName,
        temp_high: Math.round(data.daily.temperature_2m_max[idx]),
        temp_low: Math.round(data.daily.temperature_2m_min[idx]),
        condition: weatherConditions[code] || 'Unknown',
        icon: weatherEmojis[code] || '🌍',
      }
    })

    return forecast
  } catch (error) {
    console.error('Forecast API error:', error)
    throw error
  }
}

// GET /api/weather - Get current weather
router.get('/weather', async (req, res) => {
  try {
    const { lat, lng } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng parameters required' })
    }

    const weather = await getWeatherFromOpenMeteo(parseFloat(lat), parseFloat(lng))
    res.json({ success: true, data: weather })
  } catch (error) {
    console.error('Weather endpoint error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET /api/weather/forecast - Get weather forecast
router.get('/weather/forecast', async (req, res) => {
  try {
    const { lat, lng, days = 5 } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng parameters required' })
    }

    const forecast = await getForecastFromOpenMeteo(parseFloat(lat), parseFloat(lng), parseInt(days))
    res.json({ success: true, forecast })
  } catch (error) {
    console.error('Forecast endpoint error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
