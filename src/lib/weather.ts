export interface RealtimeWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  weatherCode: number;
  conditionText: string;
  conditionTextKn: string;
  conditionTextHi: string;
  isRaining: boolean;
  precipitation: number;
  aqi: number;
  pm25: number;
  pm10: number;
  aqiCategory: "Good" | "Moderate" | "Poor" | "Unhealthy" | "Hazardous";
  aqiColor: string;
  commuterAlert: string;
  commuterAlertKn: string;
  commuterAlertHi: string;
  updatedAt: string;
}

export function getWeatherCondition(code: number): { en: string; kn: string; hi: string; isRaining: boolean } {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return { en: "Clear Sky", kn: "ಸ್ವಚ್ಛ ಆಕಾಶ", hi: "साफ़ आसमान", isRaining: false };
  if (code === 1) return { en: "Mainly Clear", kn: "ಹೆಚ್ಚಾಗಿ ಸ್ವಚ್ಛ", hi: "मुख्यतः साफ़", isRaining: false };
  if (code === 2) return { en: "Partly Cloudy", kn: "ಭಾಗಶಃ ಮೋಡ", hi: "आंशिक बादल", isRaining: false };
  if (code === 3) return { en: "Overcast", kn: "ಮೋಡ ಕವಿದಿದೆ", hi: "घने बादल", isRaining: false };
  if (code === 45 || code === 48) return { en: "Foggy", kn: "ದಟ್ಟ ಮಂಜು", hi: "कोहरा", isRaining: false };
  if (code >= 51 && code <= 55) return { en: "Light Drizzle", kn: "ತುಂತುರು ಮಳೆ", hi: "हल्की बूंदाबांदी", isRaining: true };
  if (code >= 61 && code <= 65) return { en: "Rain", kn: "ಮಳೆ", hi: "बारिश", isRaining: true };
  if (code >= 71 && code <= 77) return { en: "Snow", kn: "ಹಿಮಪಾತ", hi: "बर्फबारी", isRaining: false };
  if (code >= 80 && code <= 82) return { en: "Rain Showers", kn: "ಮಳೆ ಸುರಿತ", hi: "तेज़ बौछारें", isRaining: true };
  if (code >= 95 && code <= 99) return { en: "Thunderstorm", kn: "ಗುಡುಗು ಸಹಿತ ಮಳೆ", hi: "गरज के साथ बारिश", isRaining: true };
  return { en: "Cloudy", kn: "ಮೋಡ", hi: "बादल", isRaining: false };
}

export function getAqiDetails(usAqi: number): { category: "Good" | "Moderate" | "Poor" | "Unhealthy" | "Hazardous"; color: string } {
  if (usAqi <= 50) return { category: "Good", color: "text-emerald-700 dark:text-emerald-400" };
  if (usAqi <= 100) return { category: "Moderate", color: "text-amber-700 dark:text-yellow-400" };
  if (usAqi <= 150) return { category: "Poor", color: "text-orange-700 dark:text-orange-400" };
  if (usAqi <= 200) return { category: "Unhealthy", color: "text-red-700 dark:text-red-400" };
  return { category: "Hazardous", color: "text-purple-700 dark:text-purple-400" };
}

export async function fetchLiveWeatherAndAqi(latitude: number, longitude: number): Promise<RealtimeWeatherData> {
  const [weatherRes, aqiRes] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m`,
      { cache: 'no-store' }
    ),
    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10`,
      { cache: 'no-store' }
    ),
  ]);

  const weatherData = await weatherRes.json();
  const aqiData = await aqiRes.json();

  const currentW = weatherData?.current || {};
  const currentA = aqiData?.current || {};

  const temp = Math.round((currentW.temperature_2m ?? 24) * 10) / 10;
  const apparentTemp = Math.round((currentW.apparent_temperature ?? 25) * 10) / 10;
  const humidity = currentW.relative_humidity_2m ?? 60;
  const windSpeed = Math.round((currentW.wind_speed_10m ?? 10) * 10) / 10;
  const weatherCode = currentW.weather_code ?? 0;
  const precipitation = currentW.precipitation ?? 0;
  const rainVal = currentW.rain ?? 0;

  const aqi = Math.round(currentA.us_aqi ?? 75);
  const pm25 = Math.round((currentA.pm2_5 ?? 25) * 10) / 10;
  const pm10 = Math.round((currentA.pm10 ?? 45) * 10) / 10;

  const cond = getWeatherCondition(weatherCode);
  const isRaining = cond.isRaining || rainVal > 0 || precipitation > 0;
  const aqiDetails = getAqiDetails(aqi);

  // Commuter Smart Advisory
  let commuterAlert = "Clear transit conditions. Ideal for travel.";
  let commuterAlertKn = "ಸ್ಪಷ್ಟ ಪ್ರಯಾಣ ಪರಿಸ್ಥಿತಿ. ಪ್ರಯಾಣಕ್ಕೆ ಸೂಕ್ತವಾಗಿದೆ.";
  let commuterAlertHi = "यातायात के लिए सामान्य मौसम। यात्रा के लिए उपयुक्त।";

  if (weatherCode >= 95) {
    commuterAlert = "Thunderstorm alert. Prioritize covered underground Metro.";
    commuterAlertKn = "ಗುಡುಗು ಸಹಿತ ಮಳೆ ಎಚ್ಚರಿಕೆ. ಸುರಕ್ಷಿತ ಮೆಟ್ರೋ ಬಳಸಿ.";
    commuterAlertHi = "आंधी-तूफान की चेतावनी। भूमिगत मेट्रो का उपयोग करें।";
  } else if (isRaining) {
    commuterAlert = "Rain detected. Carry an umbrella; rain-safe routing on.";
    commuterAlertKn = "ಮಳೆ ಬೀಳುತ್ತಿದೆ. ಛತ್ರಿ ಕೊಂಡೊಯ್ಯಿರಿ; ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಆನ್.";
    commuterAlertHi = "बारिश हो रही है। छाता साथ रखें; सुरक्षित रूट सक्रिय।";
  } else if (aqi > 150) {
    commuterAlert = `High AQI (${aqi}). Wear an N95 mask during road commute.`;
    commuterAlertKn = `ಗಾಳಿಯ ಗುಣಮಟ್ಟ ಕಳಪೆ (${aqi}). ಪ್ರಯಾಣದಲ್ಲಿ ಮಾಸ್ಕ್ ಧರಿಸಿ.`;
    commuterAlertHi = `खराब वायु गुणवत्ता (${aqi})। यात्रा के दौरान मास्क पहनें।`;
  } else if (temp > 33) {
    commuterAlert = `High temperature (${temp}°C). Prefer AC Vajra / Metro transit.`;
    commuterAlertKn = `ಹೆಚ್ಚಿನ ತಾಪಮಾನ (${temp}°C). ಎಸಿ ವಜ್ರ ಅಥವಾ ಮೆಟ್ರೋ ಬಳಸಿ.`;
    commuterAlertHi = `अधिक तापमान (${temp}°C)। एसी बस या मेट्रो का चयन करें।`;
  }

  return {
    temperature: temp,
    apparentTemperature: apparentTemp,
    humidity,
    windSpeed,
    isDay: currentW.is_day === 1,
    weatherCode,
    conditionText: cond.en,
    conditionTextKn: cond.kn,
    conditionTextHi: cond.hi,
    isRaining,
    precipitation,
    aqi,
    pm25,
    pm10,
    aqiCategory: aqiDetails.category,
    aqiColor: aqiDetails.color,
    commuterAlert,
    commuterAlertKn,
    commuterAlertHi,
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };
}
