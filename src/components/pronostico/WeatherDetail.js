import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WeatherDetail({ icon, label, value }) {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={24} color="#fff" />
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: "center" },
    label: { color: "#ccc", fontSize: 14 },
    value: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
