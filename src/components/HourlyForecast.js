import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HourlyForecast({ data }) {
    return (
        <View style={styles.container}>
            <Text style={styles.hour}>{data.hour}</Text>
            <Ionicons name={data.icon} size={28} color="orange" />
            <Text style={styles.temp}>{data.temp}°C</Text>
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
        width: 80,
    },
    hour: { color: "#ccc", marginBottom: 6 },
    temp: { color: "#fff", marginTop: 6, fontWeight: "600" },
});
