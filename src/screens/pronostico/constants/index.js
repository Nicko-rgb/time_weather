// src/screens/pronostico/constants/index.js

// Configuración de la aplicación
export const APP_CONFIG = {
  refreshInterval: 10 * 60 * 1000, // 10 minutos en milisegundos
  cacheTimeout: 5 * 60 * 1000, // 5 minutos para cache
  maxRetries: 3,
  requestTimeout: 10000, // 10 segundos
};

// Mapeo de códigos de clima a imágenes de fondo
const WEATHER_BACKGROUNDS = {
  // Cielo despejado
  0: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7d?auto=format&fit=crop&w=1200&q=80',
  1: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1200&q=80',
  2: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1200&q=80',
  3: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1200&q=80',
  
  // Nublado
  45: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
  48: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
  
  // Lluvia ligera
  51: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
  53: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
  55: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
  
  // Lluvia
  61: 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?auto=format&fit=crop&w=1200&q=80',
  63: 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?auto=format&fit=crop&w=1200&q=80',
  65: 'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?auto=format&fit=crop&w=1200&q=80',
  
  // Nieve
  71: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&w=1200&q=80',
  73: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&w=1200&q=80',
  75: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&w=1200&q=80',
  
  // Tormenta
  95: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200&q=80',
  96: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200&q=80',
  99: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Obtiene la imagen de fondo según el código del clima
 */
export const getBackgroundImage = (weathercode) => {
  return WEATHER_BACKGROUNDS[weathercode] || WEATHER_BACKGROUNDS[0];
};

/**
 * Formatea el tiempo en formato legible
 */
export const formatTime = (isoString) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Formatea la fecha en formato legible
 */
export const formatDate = (isoString) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Convierte códigos de clima a descripción en español
 */
export const getWeatherDescription = (weathercode) => {
  const descriptions = {
    0: 'Despejado',
    1: 'Principalmente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna intensa',
    56: 'Llovizna helada ligera',
    57: 'Llovizna helada intensa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    66: 'Lluvia helada ligera',
    67: 'Lluvia helada intensa',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve intensa',
    77: 'Granizo',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos intensos',
    85: 'Chubascos de nieve ligeros',
    86: 'Chubascos de nieve intensos',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo intenso'
  };
  
  return descriptions[weathercode] || 'Desconocido';
};

/**
 * Obtiene el icono del clima según el código
 */
export const getWeatherIcon = (weathercode) => {
  const icons = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌧️',
    61: '🌧️',
    63: '🌧️',
    65: '⛈️',
    71: '🌨️',
    73: '❄️',
    75: '❄️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️'
  };
  
  return icons[weathercode] || '🌤️';
};