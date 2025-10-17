export async function getWeatherByCoords(lat, lon) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  try {
    if (apiKey) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    }
    // Fallback: Open-Meteo (no key) -> normalize to OpenWeather-like shape
    const om = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation`;
    const r = await fetch(om);
    if (!r.ok) return null;
    const j = await r.json();
    const temp = j?.current?.temperature_2m;
    const humidity = j?.current?.relative_humidity_2m;
    const precip = j?.current?.precipitation;
    return {
      name: 'Your Location',
      main: { temp, humidity },
      weather: [{ main: precip > 0 ? 'Rain' : 'Clear', description: precip > 0 ? 'rain' : 'clear sky' }]
    };
  } catch {
    return null;
  }
}
