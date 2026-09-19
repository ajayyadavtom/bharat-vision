export interface WeatherData {
  temperature: number;
  condition: "Clear" | "Rain" | "Cloudy";
  location: string;
  commuterAlert: string | null;
}

export function getBengaluruWeather(): WeatherData {
  return {
    temperature: 22,
    condition: "Rain",
    location: "Yelahanka",
    commuterAlert: "Light drizzle expected. Carry an umbrella."
  };
}