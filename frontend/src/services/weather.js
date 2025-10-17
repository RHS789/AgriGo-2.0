export async function getWeatherByCoords(lat, lon) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  if (!apiKey) return null;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}
