import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Alert, ScrollView, Animated, FlatList, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from '../styles/styleHome';
import WeatherDetail from '../components/pronostico/WeatherDetail';
import HourlyForecast from '../components/HourlyForecast';

const { width } = Dimensions.get("window");

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [hourlyData, setHourlyData] = useState([]);
    const [allLocations, setAllLocations] = useState([]); // Todas las ubicaciones (actual + guardadas)
    const [currentLocationIndex, setCurrentLocationIndex] = useState(0); // Índice de la ubicación actual
    const [currentLocationData, setCurrentLocationData] = useState(null); // Datos de ubicación actual
    const scrollViewRef = useRef(null);
    
    // ✅ Animaciones para transiciones suaves
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();
    const route = useRoute();

    // 🔑 Tu API Key de Visual Crossing
    const API_KEY = "3T269THQBHGMR3YRCEBDVCXYL";

    // ✅ Cargar todas las ubicaciones (actual + guardadas)
    const loadAllLocations = async () => {
        try {
            // Obtener ubicación actual
            const currentLocation = await getCurrentLocationData();
            
            // Obtener ciudades guardadas
            const stored = await AsyncStorage.getItem("savedCityNames");
            let savedCities = [];
            if (stored) {
                const cityNames = JSON.parse(stored);
                savedCities = await Promise.all(
                    cityNames.map(async (cityInfo) => {
                        const weatherData = await fetchWeatherByCity(cityInfo.name);
                        return weatherData || {
                            id: cityInfo.id,
                            name: cityInfo.name,
                            lat: null,
                            lon: null
                        };
                    })
                );
                // Filtrar elementos nulos o inválidos
                savedCities = savedCities.filter(city => city && city.name);
            }

            // Combinar ubicación actual + ciudades guardadas, evitando duplicados
            let allLocs = [];
            if (currentLocation) {
                allLocs.push(currentLocation);
            }
            
            // Agregar ciudades guardadas que no sean duplicados de la ubicación actual
            savedCities.forEach(city => {
                const isDuplicate = currentLocation && 
                    (city.name.toLowerCase() === currentLocation.name.toLowerCase() ||
                     (city.lat && currentLocation.lat && 
                      Math.abs(city.lat - currentLocation.lat) < 0.01 && 
                      Math.abs(city.lon - currentLocation.lon) < 0.01));
                
                if (!isDuplicate) {
                    allLocs.push(city);
                }
            });
            
            setAllLocations(allLocs);
            
            // Si hay una ubicación seleccionada desde ListCytes, encontrar su índice
            const selectedLocation = route.params?.selectedLocation || route.params?.params?.selectedLocation;
            if (selectedLocation) {
                const selectedIndex = allLocs.findIndex(loc => loc.name === selectedLocation.name);
                if (selectedIndex !== -1) {
                    setCurrentLocationIndex(selectedIndex);
                    fetchWeatherForLocation(allLocs[selectedIndex]);
                    return;
                }
            }
            
            // Por defecto, mostrar la primera ubicación (actual)
            if (allLocs.length > 0) {
                setCurrentLocationIndex(0);
                fetchWeatherForLocation(allLocs[0]);
            }
        } catch (error) {
            console.error("Error cargando ubicaciones:", error);
        }
    };

    useEffect(() => {
        loadAllLocations();
    }, [route.params]);

    // ✅ Recargar ubicaciones cada vez que la pantalla se enfoque
    useFocusEffect(
        useCallback(() => {
            loadAllLocations();
        }, [])
    );

    // ✅ Obtener datos de ubicación actual
    const getCurrentLocationData = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return null;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            let cityName = "Ubicación actual";
            if (reverseGeocode.length > 0) {
                const place = reverseGeocode[0];
                cityName = place.city || place.region || place.country || "Ubicación actual";
            }

            return {
                id: "current",
                name: cityName,
                lat: latitude,
                lon: longitude
            };
        } catch (error) {
            console.error("Error obteniendo ubicación actual:", error);
            return null;
        }
    };

    // ✅ Obtener clima por nombre de ciudad (similar a ListCytes)
    const fetchWeatherByCity = async (cityName) => {
        try {
            const API_KEY_OPENWEATHER = "93fdcc2804888020db0e3ad6d5dcf1ad";
            const geoResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY_OPENWEATHER}`
            );
            const geoData = await geoResponse.json();

            if (geoData.cod !== 200) {
                return null;
            }

            return {
                id: geoData.id,
                name: geoData.name,
                lat: geoData.coord.lat,
                lon: geoData.coord.lon
            };
        } catch (error) {
            console.error(`Error obteniendo datos para ${cityName}:`, error);
            return null;
        }
    };

    // ✅ Obtener clima para una ubicación específica
    const fetchWeatherForLocation = async (location) => {
        if (!location || !location.lat || !location.lon) {
            return;
        }
        
        setLoading(true);
        try {
            const res = await axios.get(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.lat},${location.lon}?unitGroup=metric&lang=es&key=${API_KEY}`
            );
            const data = res.data;

            const today = data.days[0];
            const allHours = today.hours;

            const nowSec = Math.floor(Date.now() / 1000);
            let closestHour = allHours.reduce((best, h) => {
                if (!best) return h;
                return Math.abs(h.datetimeEpoch - nowSec) < Math.abs(best.datetimeEpoch - nowSec) ? h : best;
            }, null);

            const weatherData = {
                location: location.name,
                temperature: Math.round(closestHour.temp),
                condition: closestHour.conditions,
                feelsLike: Math.round(closestHour.feelslike ?? closestHour.temp),
                humidity: Math.round(closestHour.humidity ?? 0),
                wind: Math.round(closestHour.windspeed ?? 0),
                pressure: Math.round(closestHour.pressure ?? 0),
            };

            setWeather(weatherData);

            const hourly = allHours.map(h => ({
                hour: h.datetime.substring(0, 5),
                temp: Math.round(h.temp),
                icon: iconMap[h.icon] || "help-outline",
            }));

            setHourlyData(hourly);
        } catch (error) {
            console.error(`❌ Error al obtener clima para ${location.name}:`, error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Manejar cambio de página en ScrollView con animaciones
    const lastContentOffsetX = useRef(0);
const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / width);
    let direction = 'right';
    if (contentOffsetX < lastContentOffsetX.current) direction = 'left';
    lastContentOffsetX.current = contentOffsetX;

    if (pageIndex !== currentLocationIndex && pageIndex >= 0 && pageIndex < allLocations.length) {
        // Animación de salida
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: direction === 'right' ? 0.95 : 1.05,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Cambiar datos
            setCurrentLocationIndex(pageIndex);
            const newLocation = allLocations[pageIndex];
            setCurrentLocationData(newLocation);
            fetchWeatherForLocation(newLocation);
            // Animación de entrada
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        });
    }
};

    // ✅ Navegar a una ubicación específica
    const goToLocation = (index) => {
        if (scrollViewRef.current && index >= 0 && index < allLocations.length) {
            scrollViewRef.current.scrollTo({ x: index * width, animated: true });
        }
    };

    const getLocationAndFetchWeather = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso denegado", "No se puede acceder a la ubicación.");
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            fetchWeather(latitude, longitude);
        } catch (error) {
            console.error("Error obteniendo ubicación:", error);
            setLoading(false);
        }
    };

    const fetchWeather = async (lat, lon, cityName = null) => {
        try {
            const res = await axios.get(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&lang=es&key=${API_KEY}`
            );
            const data = res.data;

            // --- 1. Obtener todas las horas del primer día ---
            const today = data.days[0];
            const allHours = today.hours;

            // --- 2. Buscar la hora más cercana al momento actual ---
            const nowSec = Math.floor(Date.now() / 1000);
            let closestHour = allHours.reduce((best, h) => {
                if (!best) return h;
                return Math.abs(h.datetimeEpoch - nowSec) < Math.abs(best.datetimeEpoch - nowSec) ? h : best;
            }, null);

            // --- 3. Usar cityName si se proporciona, sino hacer reverse geocode ---
            let locationName = cityName;
            if (!locationName) {
                const reverseGeocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
                if (reverseGeocode.length > 0) {
                    const place = reverseGeocode[0];
                    locationName = place.city || place.region || place.country || "Ubicación desconocida";
                }
            }

            // --- 4. Setear clima actual ---
            setWeather({
                location: locationName,
                temperature: Math.round(closestHour.temp),
                condition: closestHour.conditions,
                feelsLike: Math.round(closestHour.feelslike ?? closestHour.temp),
                humidity: Math.round(closestHour.humidity ?? 0),
                wind: Math.round(closestHour.windspeed ?? 0),
            });

            // --- 5. Setear lista de 24 horas ---
            const hourly = allHours.map(h => ({
                hour: h.datetime.substring(0, 5), // "HH:mm"
                temp: Math.round(h.temp),
                icon: iconMap[h.icon] || "help-outline",
            }));

            setHourlyData(hourly);

        } catch (error) {
            console.error("Error al obtener clima:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Obtener coordenadas por nombre de ciudad y luego obtener clima
    const fetchCoordinatesAndWeather = async (cityName) => {
        try {
            setLoading(true);
            
            // Usar OpenWeatherMap para geocoding (obtener coordenadas)
            const API_KEY_OPENWEATHER = "93fdcc2804888020db0e3ad6d5dcf1ad";
            const geoResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY_OPENWEATHER}`
            );
            const geoData = await geoResponse.json();

            if (geoData.cod !== 200) {
                console.error(`❌ No se encontraron coordenadas para: ${cityName}`);
                Alert.alert("Error", `No se pudo encontrar la ubicación: ${cityName}`);
                setLoading(false);
                return;
            }

            const { lat, lon } = geoData.coord;
            
            // Usar las coordenadas para obtener el clima
            fetchWeather(lat, lon, cityName);
        } catch (error) {
            console.error(`Error obteniendo coordenadas para ${cityName}:`, error);
            Alert.alert("Error", "No se pudo obtener información para esta ubicación.");
            setLoading(false);
        }
    };

    const formattedDate = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    // Selección de animación Lottie según condición
function getLottieSource(condition, temp = null) {
    if (!condition) return require('../assets/lotties/Summer.json');
    const cond = condition.toLowerCase();
    // Si hay nieve pero la temperatura es mayor a 5°C, no mostrar nieve
    if (cond.includes('nieve') && temp !== null && temp <= 5) return require('../assets/lotties/Weather-storm.json'); // Usa storm si no tienes nieve
    if (cond.includes('tormenta')) return require('../assets/lotties/Weather-storm.json');
    if (cond.includes('lluvia')) return require('../assets/lotties/Weather-storm.json');
    if (cond.includes('nublado') || cond.includes('overcast')) return require('../assets/lotties/overcast.json');
    if (cond.includes('viento')) return require('../assets/lotties/Weather-windy.json');
    if (cond.includes('despejado') || cond.includes('soleado')) return require('../assets/lotties/Summer.json');
    return require('../assets/lotties/Summer.json');
}

// Frases motivacionales según condición
function getWeatherPhrase(condition) {
    if (!condition) return '';
    const cond = condition.toLowerCase();
    if (cond.includes('lluvia') || cond.includes('tormenta')) return '¡No olvides tu paraguas hoy!';
    if (cond.includes('nublado')) return 'Día perfecto para una taza de café.';
    if (cond.includes('soleado') || cond.includes('despejado')) return '¡Aprovecha el sol y sal a caminar!';
    if (cond.includes('nieve')) return '¡Abrígate bien, día nevado!';
    if (cond.includes('viento')) return '¡Cuidado con el viento, sujeta tu sombrero!';
    return '¡Que tengas un gran día, sin importar el clima!';
}

const iconMap = {
        "clear-day": "sunny-outline",
        "clear-night": "moon-outline",
        "partly-cloudy-day": "partly-sunny-outline",
        "partly-cloudy-night": "cloudy-night-outline", // puedes usar "moon-outline" si no existe
        "cloudy": "cloud-outline",
        "rain": "rainy-outline",
        "snow": "snow-outline",
        "fog": "cloud-outline",
        "wind": "navigate-outline"
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Fondo con gradiente */}
            <LinearGradient
                colors={["#23233a", "#1E1E2C", "#222246"]}
                style={styles.gradientBg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <View style={{flex: 1}}>
                {/* Puntos indicadores dinámicos */}
                <View style={styles.puntos}>
                    {allLocations.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.punto,
                                index === currentLocationIndex && styles.activePunto
                            ]}
                            onPress={() => goToLocation(index)}
                        />
                    ))}
                </View>
                {/* ScrollView horizontal con paginación */}
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={{ flex: 1 }}
                    bounces={true}
                    alwaysBounceHorizontal={true}
                    decelerationRate="fast"
                    snapToInterval={width}
                    snapToAlignment="start"
                >
                    {allLocations.map((location, index) => (
                        <View key={location.id || index} style={{ width, flex: 1 }}>
                            {/* Encabezado de cada ciudad */}
                            <View style={styles.header}>
    <Ionicons name="location-outline" size={22} color="#6C63FF" style={{marginRight: 8}} />
    <Text style={[styles.location, {color: '#fff', fontSize: 22, letterSpacing: 0.5, flex: 1}]} numberOfLines={1} ellipsizeMode="tail">{weather?.location || ''}</Text>
    <TouchableOpacity style={styles.settings} onPress={() => navigation.navigate("Ciudades")}> 
        <FontAwesome6 name="plus" size={28} color="#6C63FF" />
    </TouchableOpacity>
</View>
                            {/* Fecha */}
                            <Text style={styles.date}>{formattedDate}</Text>
                            {/* Clima actual */}
                            {weather && (
    <Animated.View 
        style={[
            styles.mainWeather,
            {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
            }
        ]}
    >
        <LottieView
            source={getLottieSource(weather.condition, weather.temperature)}
            autoPlay
            loop
            style={{ width: 170, height: 170 }}
        />
        <Text style={styles.temp}>{weather.temperature}°C</Text>
        <Text style={styles.condition}>{weather.condition}</Text>
        {/* Datos adicionales */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, width: '100%' }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#aaa', fontSize: 13 }}>Sensación</Text>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{weather.feelsLike}°C</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#aaa', fontSize: 13 }}>Humedad</Text>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{weather.humidity}%</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#aaa', fontSize: 13 }}>Viento</Text>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{weather.wind} km/h</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#aaa', fontSize: 13 }}>Presión</Text>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{weather.pressure ? weather.pressure : '--'} hPa</Text>
            </View>
        </View>
        {/* Frase motivacional */}
        <Text style={{ color: '#6C63FF', fontSize: 15, marginTop: 18, fontWeight: '600', textAlign: 'center', letterSpacing: 0.2 }}>
            {getWeatherPhrase(weather.condition)}
        </Text>
    </Animated.View>
)}
                            {/* Pronóstico por horas */}
                            <View style={styles.forecast}>
                                <Text style={styles.subtitle}>Pronóstico por horas</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.forecastScroll} nestedScrollEnabled={true}>
                                    {hourlyData.map((item, index) => (
                                        <HourlyForecast key={index} data={item} />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}