import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HistoricalWeather({ data }) {
    // Formatear la fecha para mostrar día de la semana
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'short', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{formatDate(data.date)}</Text>
            <Ionicons name={data.icon} size={24} color="orange" />
            <View style={styles.tempContainer}>
                <Text style={styles.tempMax}>{data.tempMax}°</Text>
                <Text style={styles.tempMin}>{data.tempMin}°</Text>
            </View>
            <Text style={styles.condition}>{data.condition}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#2C2C3E",
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
        width: 100,
        minHeight: 120,
    },
    date: { 
        color: "#ccc", 
        marginBottom: 6, 
        fontSize: 12,
        textAlign: "center"
    },
    tempContainer: {
        marginTop: 6,
        alignItems: "center"
    },
    tempMax: { 
        color: "#fff", 
        fontWeight: "600",
        fontSize: 14
    },
    tempMin: { 
        color: "#aaa", 
        fontSize: 12,
        marginTop: 2
    },
    condition: {
        color: "#ccc",
        fontSize: 10,
        textAlign: "center",
        marginTop: 4,
        flexWrap: "wrap"
    }
});