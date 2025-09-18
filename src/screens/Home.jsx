import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState, useRef } from 'react';
import LottieView from "lottie-react-native";

import WeatherDetail from '../components/pronostico/WeatherDetail';
import HourlyForecast from '../components/HourlyForecast';

const { width } = Dimensions.get("window");

export default function Home() {
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-width)).current; // menú fuera de pantalla
    const fadeAnim = useRef(new Animated.Value(0)).current; // opacidad del overlay

    const toggleMenu = () => {
        if (menuVisible) {
            // cerrar menú
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -width,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => setMenuVisible(false));
        } else {
            // abrir menú
            setMenuVisible(true);
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    // Datos simulados
    const weather = {
        location: "Lima, Perú",
        temperature: 28,
        condition: "Soleado",
        feelsLike: 30,
        humidity: 60,
        wind: 12,
    };

    const hourlyData = [
        { hour: "09:00", temp: 26, icon: "sunny-outline" },
        { hour: "12:00", temp: 28, icon: "sunny-outline" },
        { hour: "15:00", temp: 29, icon: "partly-sunny-outline" },
        { hour: "18:00", temp: 25, icon: "cloud-outline" },
        { hour: "21:00", temp: 23, icon: "moon-outline" },
    ];

    const formattedDate = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnLocation}>
                    <LottieView
                        source={require("../assets/lotties/Location.json")}
                        autoPlay
                        loop
                        colorFilters={[{ keypath: '*', color: '#fff' }]}
                        style={{ width: 30, height: 30, top: 3, marginLeft: -8 }}
                    />
                    <Text style={styles.location}>{weather.location}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settings} onPress={toggleMenu}>
                    <FontAwesome6 name="bars-staggered" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Fecha */}
            <Text style={styles.date}>{formattedDate}</Text>

            {/* Clima actual */}
            <View style={styles.mainWeather}>
                {/* <LottieView
                    
                    autoPlay
                    loop
                    style={{width: 170, height: 170}}
                /> */}
                <LottieView
                    source={require('../assets/lotties/Summer.json')}
                    // source={require('../assets/lotties/overcast.json')}
                    // source={require('../assets/lotties/Weather-storm.json')}
                    // source={require('../assets/lotties/Weather-windy.json')}
                    autoPlay
                    loop
                    style={{ width: 170, height: 170 }}
                />
                <Text style={styles.temp}>{weather.temperature}°C</Text>
                <Text style={styles.condition}>{weather.condition}</Text>
            </View>

            {/* Detalles */}
            <View style={styles.detailsRow}>
                <WeatherDetail icon="thermometer-outline" label="Sensación" value={`${weather.feelsLike}°C`} />
                <WeatherDetail icon="water-outline" label="Humedad" value={`${weather.humidity}%`} />
                <WeatherDetail icon="navigate-outline" label="Viento" value={`${weather.wind} km/h`} />
            </View>

            {/* Pronóstico por horas */}
            <View style={styles.forecast}>
                <Text style={styles.subtitle}>Pronóstico por horas</Text>
                <FlatList
                    horizontal
                    data={hourlyData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <HourlyForecast data={item} />}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Overlay con fade */}
            {menuVisible && (
                <Animated.View
                    style={[styles.overlay, { opacity: fadeAnim }]}
                >
                    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={toggleMenu} />
                </Animated.View>
            )}

            {/* Menú lateral */}
            {menuVisible && (
                <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
                    <Text style={styles.menuTitle}>Menú</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="home-outline" size={22} color="#fff" />
                        <Text style={styles.menuText}>Inicio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="cloud-outline" size={22} color="#fff" />
                        <Text style={styles.menuText}>Pronósticos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={22} color="#fff" />
                        <Text style={styles.menuText}>Configuración</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1E1E2C" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 6 },
    btnLocation: { flexDirection: "row", alignItems: "center", gap: 3, padding: 8 },
    location: { color: "#fff", fontSize: 18, fontWeight: "600" },
    settings: { padding: 8 },
    date: { color: "#fff", fontSize: 18, textAlign: "center", textTransform: "capitalize", fontWeight: "600" },
    mainWeather: { alignItems: "center", marginTop: 30 },
    temp: { color: "#fff", fontSize: 64, fontWeight: "bold", },
    condition: { color: "#ccc", fontSize: 20 },
    detailsRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 30 },
    forecast: { paddingHorizontal: 16 },
    subtitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 10 },

    // Overlay
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 5,
    },

    // Menú lateral
    sideMenu: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: width * 0.7,
        backgroundColor: "#1E1E2C",
        padding: 20,
        paddingTop: 60,
        zIndex: 10,
        elevation: 10,
        // borderTopRightRadius: 20,
        // borderBottomRightRadius: 20,
    },
    menuTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 20 },
    menuItem: { flexDirection: "row", alignItems: "center", marginVertical: 12, gap: 10 },
    menuText: { color: "#fff", fontSize: 16, fontWeight: "500" },
});
