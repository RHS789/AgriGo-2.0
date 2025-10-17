import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WiDaySunny, WiRain, WiCloud } from 'react-icons/wi';
import { getWeatherByCoords } from '../../services/weather.js';

export default function WeatherCard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try { setData(await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude)); }
      catch { setErr(''); }
    }, () => setErr(''));
  }, []);

  const icon = () => {
    const main = data?.weather?.[0]?.main || '';
    if (main.includes('Rain')) return <WiRain className="text-3xl text-emerald-600"/>;
    if (main.includes('Cloud')) return <WiCloud className="text-3xl text-emerald-600"/>;
    return <WiDaySunny className="text-3xl text-emerald-600"/>;
  };

  return (
    <motion.div data-aos="fade-up" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="card">
      <div className="card-body flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Weather</h3>
          {data ? (
            <p className="text-gray-600 text-sm">{data.name} • {Math.round(data.main.temp)}°C • {data.weather[0].description}</p>
          ) : (
            <p className="text-gray-600 text-sm">Connect weather API to display local conditions</p>
          )}
        </div>
        <div>{icon()}</div>
      </div>
    </motion.div>
  );
}
