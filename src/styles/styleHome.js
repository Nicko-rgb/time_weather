
import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1E1E2C" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems:  "center", padding: 6, marginTop: -10},
    btnLocation: { flexDirection: "row", alignItems: "center", gap: 3, padding: 8 },
    location: { color: "#fff", fontSize: 18, fontWeight: "600" },
    settings: { padding: 8 },
    puntos: { flexDirection: 'row', justifyContent: 'center', gap: 5,},
    punto: {width: 8, height: 8, backgroundColor: 'rgba(143, 143, 143, 0.6)', borderRadius: 4},
    activePunto: { backgroundColor: 'white', shadowColor: 'white', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 3, elevation: 5},
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
})
