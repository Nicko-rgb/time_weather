import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E2C",
        padding: 16,
    },
    title: {
        color: "#fff",
        fontSize: 20,
        marginBottom: 10,
        textAlign: "center",
    },
    searchContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: "#2C2C3A",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
    },
    addBtn: {
        marginLeft: 8,
        backgroundColor: "#6C63FF",
        paddingHorizontal: 12,
        justifyContent: "center",
        borderRadius: 8,
    },
    sectionHeader:{
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    cityItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2C2C3A",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    cityName: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    condition: {
        color: "#aaa",
        fontSize: 14,
    },
    temp: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 10,
    },
    right: {
        flexDirection: "row",
        alignItems: "center",
    },
    deleteBtn: {
        backgroundColor: "#E63946",
        padding: 6,
        borderRadius: 6,
    },
})