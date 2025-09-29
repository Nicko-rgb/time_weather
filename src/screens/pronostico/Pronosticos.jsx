import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ImageBackground, 
  RefreshControl, 
  ScrollView,
  StatusBar,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import { styles } from '../../styles/stylePronostico';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Función para interpretar códigos meteorológicos
const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: 'Cielo despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla helada',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna intensa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos fuertes',
    95: 'Tormenta eléctrica',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo fuerte'
  };
  
  return weatherCodes[code] || 'Condición desconocida';
};

// Función para obtener icono según el código meteorológico
const getWeatherIcon = (code) => {
  if (code === 0 || code === 1) return 'wb-sunny';
  if (code >= 2 && code <= 3) return 'cloud';
  if (code >= 45 && code <= 48) return 'foggy';
  if (code >= 51 && code <= 82) return 'rainy';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'wb-sunny';
};

// Función para obtener imagen de fondo según el código meteorológico
const getBackgroundImage = (code) => {
  if (code === 0 || code === 1) return 'https://images.unsplash.com/photo-1501973801540-537f08ccae7d?auto=format&fit=crop&w=800&q=80';
  if (code >= 2 && code <= 3) return 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80';
  if (code >= 45 && code <= 48) return 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?auto=format&fit=crop&w=800&q=80';
  if (code >= 51 && code <= 82) return 'https://images.unsplash.com/photo-1438449805896-28a666819a20?auto=format&fit=crop&w=800&q=80';
  if (code >= 95 && code <= 99) return 'https://images.unsplash.com/photo-1594006387997-32cffa2d4535?auto=format&fit=crop&w=800&q=80';
  return 'https://images.unsplash.com/photo-1501973801540-537f08ccae7d?auto=format&fit=crop&w=800&q=80';
};

// Componente de búsqueda
const SearchBar = ({ searchQuery, setSearchQuery, onSearch, isSearching }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchBar}>
      <MaterialIcons name="search" size={24} color="#64748b" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ciudad..."
        placeholderTextColor="#94a3b8"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <MaterialIcons name="clear" size={24} color="#64748b" />
        </TouchableOpacity>
      )}
    </View>
    <TouchableOpacity 
      style={styles.searchButton} 
      onPress={onSearch}
      disabled={isSearching || !searchQuery.trim()}
    >
      {isSearching ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <MaterialIcons name="search" size={24} color="#fff" />
      )}
    </TouchableOpacity>
  </View>
);

// Componente para mostrar información del clima actual (actualizado)
const CurrentWeather = ({ temperature, windspeed, weathercode, time, locationName, humidity, pressure, uv_index }) => (
  <View style={styles.currentWeatherCard}>
    <LinearGradient 
      colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} 
      style={styles.weatherCard}
    >
      <Text style={styles.title}>Clima Actual</Text>
      {locationName ? (
        <Text style={styles.location}>{locationName}</Text>
      ) : null}
      <Text style={styles.time}>{new Date(time).toLocaleString()}</Text>
      
      <View style={styles.tempContainer}>
        <MaterialIcons 
          name={getWeatherIcon(weathercode)} 
          size={80} 
          color="#fbbf24" 
          style={styles.weatherIconLarge}
        />
        <Text style={styles.temp}>{Math.round(temperature)}°C</Text>
      </View>
      
      <Text style={styles.weatherDescription}>
        {getWeatherDescription(weathercode)}
      </Text>
      
      <View style={styles.weatherDetails}>
        <View style={styles.weatherDetailItem}>
          <MaterialIcons name="air" size={20} color="#e2e8f0" />
          <Text style={styles.detailText}>Viento</Text>
          <Text style={styles.detailValue}>{windspeed} km/h</Text>
        </View>
        
        {humidity && (
          <View style={styles.weatherDetailItem}>
            <MaterialIcons name="water-drop" size={20} color="#e2e8f0" />
            <Text style={styles.detailText}>Humedad</Text>
            <Text style={styles.detailValue}>{humidity}%</Text>
          </View>
        )}
        
        {pressure && (
          <View style={styles.weatherDetailItem}>
            <MaterialIcons name="compress" size={20} color="#e2e8f0" />
            <Text style={styles.detailText}>Presión</Text>
            <Text style={styles.detailValue}>{Math.round(pressure)} hPa</Text>
          </View>
        )}
        
        {uv_index !== undefined && (
          <View style={styles.weatherDetailItem}>
            <MaterialIcons name="wb-sunny" size={20} color="#e2e8f0" />
            <Text style={styles.detailText}>UV</Text>
            <Text style={styles.detailValue}>{Math.round(uv_index)}</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  </View>
);

// Componente para mostrar el pronóstico diario (mejorado)
const DailyForecastItem = ({ item, index }) => {
  // Crear fecha correctamente considerando la zona horaria local
  const date = new Date(item.time + 'T00:00:00');
  const today = new Date();
  
  // Comparar fechas correctamente
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
  
  let dayName;
  if (isToday) {
    dayName = 'Hoy';
  } else if (isTomorrow) {
    dayName = 'Mañana';
  } else {
    dayName = date.toLocaleDateString('es', { weekday: 'short' });
  }
  
  const dayNumber = date.getDate();
  const month = date.toLocaleDateString('es', { month: 'short' });
  
  // Función para obtener dirección del viento
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };
  
  return (
    <View style={styles.forecastItem}>
      <View style={styles.forecastHeader}>
        <Text style={styles.forecastDay}>{dayName}</Text>
        <Text style={styles.forecastDate}>{dayNumber} {month}</Text>
      </View>
      
      <View style={styles.forecastMain}>
        <MaterialIcons 
          name={getWeatherIcon(item.weathercode)} 
          size={40} 
          color="#fbbf24" 
        />
        <View style={styles.tempRange}>
          <Text style={styles.tempMax}>{Math.round(item.temperature_2m_max)}°</Text>
          <Text style={styles.tempMin}>{Math.round(item.temperature_2m_min)}°</Text>
        </View>
      </View>
      
      <View style={styles.forecastDetails}>
        <View style={styles.forecastDetailRow}>
          <MaterialIcons name="water-drop" size={16} color="#64b5f6" />
          <Text style={styles.precipitationText}>
            {item.precipitation_sum > 0 
              ? `${Math.round(item.precipitation_sum)}mm lluvia` 
              : 'Sin lluvia'
            }
          </Text>
        </View>
        
        {item.windspeed_max && (
          <View style={styles.forecastDetailRow}>
            <MaterialIcons name="air" size={16} color="#81c784" />
            <Text style={styles.windText}>
              {Math.round(item.windspeed_max)} km/h {getWindDirection(item.wind_direction)}
            </Text>
          </View>
        )}
        
        {item.uv_index_max !== undefined && (
          <View style={styles.forecastDetailRow}>
            <MaterialIcons name="wb-sunny" size={16} color="#ffb74d" />
            <Text style={styles.uvText}>UV {Math.round(item.uv_index_max)}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.weatherCondition}>
        {getWeatherDescription(item.weathercode)}
      </Text>
    </View>
  );
};

// Componente principal
export default function Forecast() {
  const [weather, setWeather] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  // Función para buscar coordenadas por nombre de ciudad
  const searchLocation = async (cityName) => {
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=es&format=json`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0];
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          name: `${location.name}, ${location.country}`
        };
      }
      throw new Error('Ciudad no encontrada');
    } catch (error) {
      throw new Error('Error al buscar la ciudad');
    } finally {
      setIsSearching(false);
    }
  };

  const fetchWeatherData = useCallback(async (lat, lon, locationName = '') => {
    try {
      setLoading(true);
      
      // Llamar a la API de Open-Meteo con más datos meteorológicos
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,pressure_msl,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant,uv_index_max,sunrise,sunset&timezone=auto`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      setWeather({
        ...data.current_weather,
        humidity: data.hourly.relativehumidity_2m[0],
        pressure: data.hourly.pressure_msl[0],
        uv_index: data.hourly.uv_index[0]
      });
      
      // Configurar el pronóstico diario (próximos 7 días) con más información
      const dailyData = data.daily.time.slice(0, 7).map((date, index) => ({
        time: date,
        weathercode: data.daily.weathercode[index],
        temperature_2m_max: data.daily.temperature_2m_max[index],
        temperature_2m_min: data.daily.temperature_2m_min[index],
        precipitation_sum: data.daily.precipitation_sum[index],
        windspeed_max: data.daily.windspeed_10m_max[index],
        wind_direction: data.daily.winddirection_10m_dominant[index],
        uv_index_max: data.daily.uv_index_max[index],
        sunrise: data.daily.sunrise[index],
        sunset: data.daily.sunset[index]
      }));
      
      setDailyForecast(dailyData);
      setErrorMsg(null);
      
      // Si no tenemos nombre de ubicación, intentar obtenerlo
      if (!locationName && !searchQuery) {
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const geoData = await geoRes.json();
          
          if (geoData && geoData.address) {
            const { city, town, village, state, country } = geoData.address;
            const name = city || town || village || '';
            setLocationName(name + (state ? `, ${state}` : '') + (country ? `, ${country}` : ''));
          }
        } catch (geoError) {
          console.log('No se pudo obtener el nombre de la ubicación:', geoError);
        }
      } else if (locationName) {
        setLocationName(locationName);
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      setErrorMsg(err.message || 'Error al obtener el clima');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  const fetchCurrentLocationWeather = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000
      });
      
      const { latitude, longitude } = loc.coords;
      setCoordinates({ latitude, longitude });
      await fetchWeatherData(latitude, longitude);
    } catch (err) {
      console.error('Error getting location:', err);
      setErrorMsg(err.message || 'Error al obtener la ubicación');
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchWeatherData]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const locationData = await searchLocation(searchQuery);
      setCoordinates({ 
        latitude: locationData.latitude, 
        longitude: locationData.longitude 
      });
      await fetchWeatherData(locationData.latitude, locationData.longitude, locationData.name);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (coordinates) {
      fetchWeatherData(coordinates.latitude, coordinates.longitude);
    } else {
      fetchCurrentLocationWeather();
    }
  }, [coordinates, fetchWeatherData, fetchCurrentLocationWeather]);

  useEffect(() => {
    fetchCurrentLocationWeather();
  }, [fetchCurrentLocationWeather]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={['right', 'left', 'top']}>
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#fbbf24" />
            <Text style={styles.loadingText}>
              {isSearching ? 'Buscando ubicación...' : 'Obteniendo datos del clima...'}
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={['right', 'left', 'top']}>
          <View style={styles.container}>
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
            <ScrollView
              contentContainerStyle={styles.center}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <MaterialIcons name="error-outline" size={50} color="#ef4444" />
              <Text style={styles.error}>{errorMsg}</Text>
              <Text style={styles.retryText}>Desliza hacia abajo para reintentar</Text>
              <TouchableOpacity 
                style={styles.locationButton} 
                onPress={fetchCurrentLocationWeather}
              >
                <MaterialIcons name="my-location" size={24} color="#fff" />
                <Text style={styles.locationButtonText}>Usar mi ubicación</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const { temperature, windspeed, weathercode, time, humidity } = weather;
  const backgroundImage = getBackgroundImage(weathercode);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['right', 'left', 'top']}>
        <StatusBar barStyle="light-content" />
        <ImageBackground
          // source={{ uri: backgroundImage }}
          style={styles.bg}
          blurRadius={2}
        >
          <View style={styles.container}>
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
            
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
            >
              <CurrentWeather 
                temperature={temperature} 
                windspeed={windspeed} 
                weathercode={weathercode} 
                time={time}
                locationName={locationName}
                humidity={humidity}
                pressure={weather.pressure}
                uv_index={weather.uv_index}
              />
              
              <View style={styles.forecastSection}>
                <Text style={styles.sectionTitle}>Pronóstico de 7 días</Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>
                    💧 mm lluvia = milímetros de precipitación esperada
                  </Text>
                  <Text style={styles.infoText}>
                    🌬️ km/h = velocidad del viento en kilómetros por hora
                  </Text>
                  <Text style={styles.infoText}>
                    ☀️ UV = índice ultravioleta (0-11+, mayor número = más peligroso)
                  </Text>
                </View>
                <FlatList
                  data={dailyForecast}
                  renderItem={DailyForecastItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.locationButton} 
                onPress={fetchCurrentLocationWeather}
              >
                <MaterialIcons name="my-location" size={24} color="#fff" />
                <Text style={styles.locationButtonText}>Usar mi ubicación</Text>
              </TouchableOpacity>
              
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Actualizado: {new Date().toLocaleTimeString()}
                </Text>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
