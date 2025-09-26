// src/screens/ListCytes.jsx
import { useState, useEffect } from "react";
import { styles } from "../styles/styleListCyte";
import {
    View,
    Text,
    TextInput,
    SectionList,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const API_KEY_OPENWEATHER = "93fdcc2804888020db0e3ad6d5dcf1ad";
const API_KEY_VISUAL_CROSSING = "3T269THQBHGMR3YRCEBDVCXYL";

export default function ListCytes() {
    // Estado para sugerencias filtradas y visibilidad
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [cityInput, setCityInput] = useState("");
    const [cities, setCities] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const navigation = useNavigation();

    // ✅ Obtener clima por nombre de ciudad usando Visual Crossing
    const fetchWeatherByCity = async (city) => {
        try {
            // Primero obtener coordenadas de la ciudad usando OpenWeatherMap (para geocoding)
            const geoResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY_OPENWEATHER}`
            );
            const geoData = await geoResponse.json();

            if (geoData.cod !== 200) {
                return null;
            }

            const { lat, lon } = geoData.coord;
            
            // Usar Visual Crossing para obtener datos del clima actualizados por hora
            const response = await fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&lang=es&key=${API_KEY_VISUAL_CROSSING}`
            );
            const data = await response.json();

            if (data && data.days && data.days[0] && data.days[0].hours) {
                // Obtener la hora más cercana al momento actual
                const today = data.days[0];
                const allHours = today.hours;
                const nowSec = Math.floor(Date.now() / 1000);
                
                let closestHour = allHours.reduce((best, h) => {
                    if (!best) return h;
                    return Math.abs(h.datetimeEpoch - nowSec) < Math.abs(best.datetimeEpoch - nowSec) ? h : best;
                }, null);

                return {
                    id: geoData.id,
                    name: geoData.name,
                    temp: Math.round(closestHour.temp),
                    condition: closestHour.conditions,
                    lat: lat,
                    lon: lon,
                };
            }

            return null;
        } catch (error) {
            console.error(`Error obteniendo clima para ${city}:`, error);
            return null;
        }
    };

    // ✅ Obtener ubicación actual con Visual Crossing API
    const fetchCurrentLocation = async () => {
        try {
            setLoadingLocation(true);
            
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso denegado", "No se puede acceder a la ubicación.");
                setLoadingLocation(false);
                return;
            }

            // Usar la misma configuración que funciona en Home.jsx
            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Usar reverseGeocodeAsync como en Home.jsx para obtener el nombre correcto
            const reverseGeocode = await Location.reverseGeocodeAsync({ 
                latitude: latitude, 
                longitude: longitude 
            });
            
            let cityName = "";
            if (reverseGeocode.length > 0) {
                const place = reverseGeocode[0];
                cityName = place.city || place.region || place.country || "Ubicación desconocida";
            }

            // Usar Visual Crossing API como en Home.jsx para obtener temperatura actual por hora
            const response = await fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&lang=es&key=${API_KEY_VISUAL_CROSSING}`
            );
            const data = await response.json();

            if (data && data.days && data.days[0] && data.days[0].hours) {
                // Obtener la hora más cercana al momento actual (igual que en Home.jsx)
                const today = data.days[0];
                const allHours = today.hours;
                const nowSec = Math.floor(Date.now() / 1000);
                
                let closestHour = allHours.reduce((best, h) => {
                    if (!best) return h;
                    return Math.abs(h.datetimeEpoch - nowSec) < Math.abs(best.datetimeEpoch - nowSec) ? h : best;
                }, null);

                setCurrentLocation({
                    id: "current",
                    name: cityName,
                    temp: Math.round(closestHour.temp),
                    condition: closestHour.conditions,
                    lat: latitude,
                    lon: longitude,
                });
            }
        } catch (error) {
            console.error("❌ Error obteniendo ubicación:", error);
            Alert.alert(
                "Error de ubicación", 
                "No se pudo obtener la ubicación actual. Asegúrate de que:\n• El GPS esté activado\n• Tengas conexión a internet\n• Hayas dado permisos de ubicación"
            );
        } finally {
            setLoadingLocation(false);
        }
    };

    // ✅ Actualizar temperaturas de ciudades guardadas
    const updateSavedCitiesTemperatures = async () => {
        if (cities.length === 0) return;
        
        const updatedCities = await Promise.all(
            cities.map(async (city) => {
                const updatedWeather = await fetchWeatherByCity(city.name);
                if (updatedWeather) {
                    return {
                        ...city,
                        temp: updatedWeather.temp,
                        condition: updatedWeather.condition,
                    };
                }
                return city; // Si falla, mantener datos anteriores
            })
        );

        setCities(updatedCities);
        // No guardar en AsyncStorage para evitar cache de temperaturas
    };

    // ✅ Guardar solo nombres de ciudades (sin temperaturas) en AsyncStorage
    const saveCityNames = async (newCities) => {
        const cityNames = newCities.map(city => ({ id: city.id, name: city.name }));
        await AsyncStorage.setItem("savedCityNames", JSON.stringify(cityNames));
    };

    // ✅ Cargar nombres de ciudades y obtener temperaturas actuales
    const loadCitiesWithCurrentTemperatures = async () => {
        try {
            const stored = await AsyncStorage.getItem("savedCityNames");
            if (stored) {
                const cityNames = JSON.parse(stored);
                
                // Obtener temperaturas actuales para cada ciudad
                const citiesWithCurrentTemp = await Promise.all(
                    cityNames.map(async (cityInfo) => {
                        const currentWeather = await fetchWeatherByCity(cityInfo.name);
                        return currentWeather || {
                            id: cityInfo.id,
                            name: cityInfo.name,
                            temp: "--",
                            condition: "No disponible"
                        };
                    })
                );
                
                setCities(citiesWithCurrentTemp);
            }
        } catch (error) {
            console.error("Error cargando ciudades:", error);
        }
    };

    useEffect(() => {
        // Cargar ubicación actual primero
        fetchCurrentLocation();
        // Luego cargar ciudades guardadas con temperaturas actuales
        loadCitiesWithCurrentTemperatures();
    }, []);

    // ✅ Actualizar temperaturas cada vez que se enfoque la pantalla
    useEffect(() => {
        const interval = setInterval(() => {
            if (cities.length > 0) {
                updateSavedCitiesTemperatures();
            }
        }, 300000); // Actualizar cada 5 minutos

        return () => clearInterval(interval);
    }, [cities]);

    // ✅ Agregar ciudad
    const handleAddCity = async () => {
        if (!cityInput.trim()) return;

        const weatherData = await fetchWeatherByCity(cityInput);
        if (!weatherData) {
            Alert.alert("Error", "No se encontró la ciudad.");
            return;
        }

        // Evitar duplicados
        if (cities.some((c) => c.id === weatherData.id)) {
            Alert.alert("Aviso", "La ciudad ya está en la lista.");
            return;
        }

        const newCities = [...cities, weatherData];
        setCities(newCities);
        saveCityNames(newCities); // Guardar solo nombres, no temperaturas
        setCityInput("");
    };

    // ✅ Manejar clic en ubicación para navegar a Home
    const handleLocationPress = (location) => {
        navigation.navigate("Tabs", { 
            screen: "Hoy",
            params: {
                selectedLocation: {
                    name: location.name,
                    lat: location.lat || null,
                    lon: location.lon || null
                }
            }
        });
    };

    // ✅ Eliminar ciudad
    const handleRemoveCity = (id) => {
        const filtered = cities.filter((c) => c.id !== id);
        setCities(filtered);
        saveCityNames(filtered); // Actualizar nombres guardados
    };

    // ✅ Secciones para la lista
    const sections = [
        {
            title: "Ubicación actual",
            data: loadingLocation 
                ? [{ id: "loading", name: "Obteniendo ubicación...", temp: "--", condition: "Cargando..." }]
                : currentLocation 
                ? [currentLocation] 
                : [],
        },
        {
            title: "Ubicaciones agregadas",
            data: cities,
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ciudades rápidas 🌍</Text>

            {/* Buscador */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Buscar ciudad..."
                    placeholderTextColor="#aaa"
                    value={cityInput}
                    onChangeText={async text => {
                        setCityInput(text);
                        if (text.length > 0) {
                            setIsLoadingSuggestions(true);
                            try {
                                const response = await fetch(
                                    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(text)}&limit=5&appid=${API_KEY_OPENWEATHER}`
                                );
                                const data = await response.json();
                                if (Array.isArray(data) && data.length > 0) {
                                    setSuggestions(data);
                                    setShowSuggestions(true);
                                } else {
                                    setSuggestions([]);
                                    setShowSuggestions(false);
                                }
                            } catch (error) {
                                setSuggestions([]);
                                setShowSuggestions(false);
                            } finally {
                                setIsLoadingSuggestions(false);
                            }
                        } else {
                            setSuggestions([]);
                            setShowSuggestions(false);
                        }
                    }}
                    autoCorrect={false}
                    autoCapitalize="words"
                />
                {cityInput.length > 0 && showSuggestions && (
    <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 52, // Ajusta según el alto del input
        backgroundColor: 'rgba(30,30,55)',
        borderRadius: 10,
        marginTop: 2,
        elevation: 5,
        zIndex: 100,
        maxHeight: 220,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
    }}>
        {isLoadingSuggestions ? (
            <Text style={{ padding: 10, color: '#888' }}>Buscando...</Text>
        ) : suggestions.length === 0 ? (
            <Text style={{ padding: 10, color: '#888' }}>Sin resultados</Text>
        ) : (
            suggestions.map((suggestion, idx) => (
                <TouchableOpacity
                    key={suggestion.lat + '-' + suggestion.lon + '-' + idx}
                    style={{ padding: 10, borderBottomWidth: idx !== suggestions.length - 1 ? 1 : 0, borderColor: '#eee' }}
                    onPress={() => {
                        setCityInput(`${suggestion.name}${suggestion.state ? ', ' + suggestion.state : ''}, ${suggestion.country}`);
                        setSuggestions([]);
                        setShowSuggestions(false);
                    }}
                >
                    <Text style={{ color: '#fff' }}>{suggestion.name}{suggestion.state ? ', ' + suggestion.state : ''}, {suggestion.country}</Text>
                </TouchableOpacity>
            ))
        )}
    </View>
)}
                <TouchableOpacity style={styles.addBtn} onPress={handleAddCity}>
                    <Text style={{ color: "#fff", fontSize: 16 }}>＋</Text>
                </TouchableOpacity>
            </View>

            {/* Lista con secciones */}
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderSectionHeader={({ section: { title, data } }) =>
                    data.length > 0 ? (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    ) : null
                }
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.cityItem}
                        onPress={() => handleLocationPress(item)}
                        activeOpacity={0.7}
                    >
                        <View>
                            <Text style={styles.cityName}>{item.name}</Text>
                            <Text style={styles.condition}>{item.condition}</Text>
                        </View>
                        <View style={styles.right}>
                            <Text style={styles.temp}>{item.temp}°C</Text>
                            {item.id !== "current" && item.id !== "loading" && (
                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        handleRemoveCity(item.id);
                                    }}
                                >
                                    <Text style={{ color: "#fff" }}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
