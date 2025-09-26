// src/screens/pronostico/services/index.js
import { Platform, Alert } from 'react-native';
import * as Location from 'expo-location';

// === CLASE DE ERROR PERSONALIZADA ===
export class WeatherError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'WeatherError';
    this.code = code;
    this.originalError = originalError;
  }
}

// === SERVICIO DE DEBUG ===
export class DebugService {
  static isEnabled = __DEV__;

  static log(category, message, data = null) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${category}] ${message}`, data || '');
  }

  static logError(category, error, data = null) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] [${category}]`, error.message || error, data || '');
  }

  static async measureTime(label, asyncFunction) {
    if (!this.isEnabled) {
      return await asyncFunction();
    }

    const startTime = Date.now();
    try {
      const result = await asyncFunction();
      const endTime = Date.now();
      this.log('PERFORMANCE', `${label} completado en ${endTime - startTime}ms`);
      return result;
    } catch (error) {
      const endTime = Date.now();
      this.logError('PERFORMANCE', `${label} falló después de ${endTime - startTime}ms: ${error.message}`);
      throw error;
    }
  }
}

// === CACHE SIMPLE ===
class SimpleCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutos por defecto
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

// === SERVICIO PRINCIPAL DEL CLIMA ===
export class WeatherAppService {
  static cache = new SimpleCache();
  static baseUrl = 'https://api.open-meteo.com/v1';
  static geocodingUrl = 'https://geocoding-api.open-meteo.com/v1';

  /**
   * Obtiene el clima de la ubicación actual del usuario
   */
  static async getCurrentLocationWeather(options = {}) {
    const { useCache = true, includeName = false } = options;

    try {
      DebugService.log('LOCATION', 'Solicitando permisos de ubicación');
      
      // Solicitar permisos
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new WeatherError(
          'Permiso de ubicación denegado',
          'PERMISSION_DENIED'
        );
      }

      DebugService.log('LOCATION', 'Obteniendo ubicación actual');
      
      // Obtener ubicación
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      const { latitude, longitude } = location.coords;
      
      DebugService.log('LOCATION', `Ubicación obtenida: ${latitude}, ${longitude}`);

      // Obtener datos del clima
      const weatherData = await this.getWeatherData(latitude, longitude, useCache);

      // Obtener nombre del lugar si se solicita
      if (includeName) {
        try {
          const locationName = await this.reverseGeocode(latitude, longitude);
          weatherData.location = {
            ...weatherData.location,
            name: locationName
          };
        } catch (error) {
          DebugService.logError('GEOCODING', error);
          // No es crítico si falla el geocoding
        }
      }

      return weatherData;

    } catch (error) {
      if (error instanceof WeatherError) {
        throw error;
      }

      if (error.code === 'E_LOCATION_PERMISSIONS_DENIED') {
        throw new WeatherError(
          'Permiso de ubicación denegado',
          'PERMISSION_DENIED',
          error
        );
      }

      if (error.code === 'E_LOCATION_UNAVAILABLE') {
        throw new WeatherError(
          'No se pudo obtener la ubicación. Verifica que el GPS esté activado.',
          'LOCATION_ERROR',
          error
        );
      }

      throw new WeatherError(
        'Error al obtener la ubicación actual',
        'LOCATION_ERROR',
        error
      );
    }
  }

  /**
   * Busca el clima de una ciudad específica
   */
  static async searchCityWeather(query, options = {}) {
    const { useCache = true } = options;

    try {
      DebugService.log('SEARCH', `Buscando coordenadas para: ${query}`);
      
      const coordinates = await this.geocodeCity(query);
      const weatherData = await this.getWeatherData(
        coordinates.latitude, 
        coordinates.longitude, 
        useCache
      );

      weatherData.location = {
        ...weatherData.location,
        name: coordinates.name
      };

      return weatherData;

    } catch (error) {
      if (error instanceof WeatherError) {
        throw error;
      }

      throw new WeatherError(
        `Error al buscar "${query}"`,
        'SEARCH_ERROR',
        error
      );
    }
  }

  /**
   * Refresca los datos del clima para coordenadas específicas
   */
  static async refreshWeatherData(latitude, longitude) {
    return this.getWeatherData(latitude, longitude, false); // No usar cache
  }

  /**
   * Obtiene los datos del clima desde la API
   */
  static async getWeatherData(latitude, longitude, useCache = true) {
    const cacheKey = `weather_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
    
    // Verificar cache
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        DebugService.log('CACHE', 'Datos obtenidos desde cache');
        return cached;
      }
    }

    try {
      const url = `${this.baseUrl}/forecast?` + 
        `latitude=${latitude}&longitude=${longitude}&` +
        'current=temperature_2m,relative_humidity_2m,apparent_temperature,' +
        'is_day,precipitation,rain,showers,snowfall,weather_code,' +
        'cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,' +
        'wind_direction_10m,wind_gusts_10m&' +
        'daily=weather_code,temperature_2m_max,temperature_2m_min,' +
        'apparent_temperature_max,apparent_temperature_min,sunrise,sunset,' +
        'precipitation_sum,rain_sum,showers_sum,snowfall_sum,' +
        'precipitation_hours,precipitation_probability_max,' +
        'wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,' +
        'uv_index_max&timezone=auto&forecast_days=7';

      DebugService.log('API', 'Obteniendo datos del clima desde API');

      const response = await fetch(url, {
        timeout: 10000,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      const processedData = this.processWeatherData(data, latitude, longitude);
      
      // Guardar en cache
      this.cache.set(cacheKey, processedData);
      
      DebugService.log('API', 'Datos del clima obtenidos correctamente');
      
      return processedData;

    } catch (error) {
      throw new WeatherError(
        'Error al obtener datos del clima',
        'WEATHER_API_ERROR',
        error
      );
    }
  }

  /**
   * Procesa los datos crudos de la API
   */
  static processWeatherData(data, latitude, longitude) {
    const current = data.current;
    const daily = data.daily;

    return {
      coordinates: { latitude, longitude },
      location: { latitude, longitude },
      current: {
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        windspeed: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        weathercode: current.weather_code,
        time: current.time,
        feelsLike: Math.round(current.apparent_temperature),
        visibility: 10000, // Valor por defecto
        uvIndex: daily.uv_index_max[0] || 0,
        isDay: current.is_day,
        precipitation: current.precipitation || 0,
        cloudCover: current.cloud_cover,
      },
      daily: daily.time.map((date, index) => ({
        date: date,
        weathercode: daily.weather_code[index],
        temperatureMax: Math.round(daily.temperature_2m_max[index]),
        temperatureMin: Math.round(daily.temperature_2m_min[index]),
        precipitationProbability: daily.precipitation_probability_max[index],
        precipitation: daily.precipitation_sum[index],
        windSpeed: Math.round(daily.wind_speed_10m_max[index]),
        sunrise: daily.sunrise[index],
        sunset: daily.sunset[index],
        uvIndex: daily.uv_index_max[index],
      })),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Geocoding: convertir nombre de ciudad a coordenadas
   */
  static async geocodeCity(cityName) {
    try {
      const url = `${this.geocodingUrl}/search?name=${encodeURIComponent(cityName)}&count=1&language=es&format=json`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new WeatherError(
          `No se encontró la ciudad "${cityName}"`,
          'LOCATION_NOT_FOUND'
        );
      }

      const result = data.results[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country,
        admin1: result.admin1,
      };

    } catch (error) {
      if (error instanceof WeatherError) {
        throw error;
      }

      throw new WeatherError(
        'Error en la búsqueda de ubicación',
        'GEOCODING_ERROR',
        error
      );
    }
  }

  /**
   * Reverse geocoding: convertir coordenadas a nombre de lugar
   */
  static async reverseGeocode(latitude, longitude) {
    try {
      const url = `${this.geocodingUrl}/search?latitude=${latitude}&longitude=${longitude}&count=1&language=es&format=json`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      }

      const result = data.results[0];
      return result.name || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

    } catch (error) {
      DebugService.logError('REVERSE_GEOCODING', error);
      return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }
  }

  /**
   * Limpia el cache
   */
  static clearCache() {
    this.cache.clear();
    DebugService.log('CACHE', 'Cache limpiado');
  }
}