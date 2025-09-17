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

// Componente para mostrar información del clima actual
const CurrentWeather = ({ temperature, windspeed, weathercode, time, locationName, humidity, pressure }) => (
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
      </View>
    </LinearGradient>
  </View>
);

// Componente para mostrar el pronóstico diario
const DailyForecastItem = ({ item, index }) => {
  const date = new Date(item.time);
  const isToday = index === 0;
  const dayName = isToday ? 'Hoy' : date.toLocaleDateString('es', { weekday: 'short' });
  
  return (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastDay}>{dayName}</Text>
      <MaterialIcons 
        name={getWeatherIcon(item.weathercode)} 
        size={32} 
        color="#fbbf24" 
      />
      <View style={styles.tempRange}>
        <Text style={styles.tempMax}>{Math.round(item.temperature_2m_max)}°</Text>
        <Text style={styles.tempMin}>{Math.round(item.temperature_2m_min)}°</Text>
      </View>
      <Text style={styles.precipitationText}>
        {item.precipitation_sum > 0 ? `${Math.round(item.precipitation_sum)}mm` : '0mm'}
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
      
      // Llamar a la API de Open-Meteo con datos diarios
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      setWeather({
        ...data.current_weather,
        humidity: data.hourly.relativehumidity_2m[0]
      });
      
      // Configurar el pronóstico diario (próximos 7 días)
      const dailyData = data.daily.time.slice(0, 7).map((date, index) => ({
        time: date,
        weathercode: data.daily.weathercode[index],
        temperature_2m_max: data.daily.temperature_2m_max[index],
        temperature_2m_min: data.daily.temperature_2m_min[index],
        precipitation_sum: data.daily.precipitation_sum[index]
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
          source={{ uri: backgroundImage }}
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
              />
              
              <View style={styles.forecastSection}>
                <Text style={styles.sectionTitle}>Pronóstico de 7 días</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  bg: { 
    flex: 1 
  },
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  scrollContainer: {
    paddingBottom: 20
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  
  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backdropFilter: 'blur(10px)'
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500'
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 25,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48
  },
  
  // Current Weather Styles
  currentWeatherCard: {
    marginBottom: 24
  },
  weatherCard: { 
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  title: { 
    fontSize: 24, 
    color: '#fff', 
    fontWeight: '700', 
    marginBottom: 8,
    textAlign: 'center'
  },
  location: {
    fontSize: 18,
    color: '#e2e8f0',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8
  },
  time: {
    fontSize: 14,
    color: '#cbd5e0',
    marginBottom: 24
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  weatherIconLarge: {
    marginRight: 16
  },
  temp: { 
    fontSize: 64, 
    color: '#fbbf24', 
    fontWeight: '300'
  },
  weatherDescription: {
    fontSize: 20,
    color: '#e2e8f0',
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center'
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  weatherDetailItem: {
    alignItems: 'center',
    flex: 1
  },
  detailText: {
    fontSize: 12,
    color: '#cbd5e0',
    marginTop: 4,
    marginBottom: 2
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },
  
  // Forecast Styles
  forecastSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center'
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12
  },
  forecastDay: {
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '600',
    width: 60
  },
  tempRange: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 16
  },
  tempMax: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700'
  },
  tempMin: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500'
  },
  precipitationText: {
    fontSize: 12,
    color: '#60a5fa',
    fontWeight: '500',
    width: 40,
    textAlign: 'right'
  },
  
  // Button and Footer Styles
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
    alignSelf: 'center'
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
    opacity: 0.8
  },
  
  // Loading and Error Styles
  loadingText: { 
    color: '#fff', 
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center'
  },
  error: { 
    color: '#ef4444', 
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600'
  },
  retryText: {
    color: '#94a3b8',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center'
  }
});