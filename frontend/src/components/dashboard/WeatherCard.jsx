import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WiDaySunny, WiRain, WiCloud, WiDayCloudyHigh } from 'react-icons/wi';
import { getWeatherByCoords } from '../../services/weather.js';

export default function WeatherCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!('geolocation' in navigator)) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const weatherData = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
          setData(weatherData);
        } catch (err) {
          console.error('Weather fetch error:', err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        console.warn('Geolocation permission denied');
        setLoading(false);
      }
    );
  }, []);

  const icon = () => {
    const main = data?.weather?.[0]?.main || '';
    if (main.includes('Rain')) return <WiRain className="text-4xl text-blue-500" />;
    if (main.includes('Cloud')) return <WiDayCloudyHigh className="text-4xl text-gray-500" />;
    return <WiDaySunny className="text-4xl text-yellow-500" />;
  };

  return (
    <motion.div
      data-aos="fade-up"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card bg-gradient-to-br from-blue-50 to-emerald-50 overflow-hidden"
    >
      <div className="card-body flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">🌤️ Weather</h3>
          {loading ? (
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          ) : data ? (
            <div className="space-y-1">
              <p className="text-gray-700 text-sm font-medium">{data.name}</p>
              <p className="text-gray-600 text-xs">
                {Math.round(data.main.temp)}°C • {data.weather[0].description}
              </p>
              {data.main.humidity && (
                <p className="text-gray-600 text-xs">💧 Humidity: {data.main.humidity}%</p>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Enable location to see weather</p>
          )}
        </div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {icon()}
        </motion.div>
      </div>
    </motion.div>
  );
}
