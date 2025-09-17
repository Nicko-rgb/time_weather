import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import atardecer from '../../assets/Atardecer.jpeg';

import WeatherDetail from '../components/WeatherDetail';
import HourlyForecast from '../components/HourlyForecast';

export default function Home() {
    // Ejemplo de datos simulados (puedes remplazar con API)
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

    // Generar fecha en formato español
    const formattedDate = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <ImageBackground source={atardecer} style={styles.container} resizeMode="cover">
            <View style={styles.overlay} />
            {/* Encabezado */}
            <View style={{flex: 1}}>
            <View style={styles.header}>
                <Ionicons name="location-outline" size={22} color="#fff" />
                <Text style={styles.location}>{weather.location}</Text>
                <TouchableOpacity style={styles.settings}>
                    <FontAwesome6 name="bars-staggered" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Fecha */}
            <Text style={styles.date}>{formattedDate}</Text>

            {/* Clima actual */}
            <View style={styles.mainWeather}>
                <Ionicons name="sunny-outline" size={90} color="yellow" />
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
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    header: { flexDirection: "row", alignItems: "center", padding: 16 },
    location: { color: "#fff", fontSize: 18, fontWeight: "600", marginLeft: 8, flex: 1 },
    settings: { padding: 4 },
    date: { color: "#fff", fontSize: 18, textAlign: "center", textTransform: 'capitalize', fontWeight: 600 },
    mainWeather: { alignItems: "center", marginTop: 30 },
    temp: { color: "#fff", fontSize: 64, fontWeight: "bold" },
    condition: { color: "#ccc", fontSize: 20 },
    detailsRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 30 },
    forecast: { paddingHorizontal: 16 },
    subtitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 10 },
});
