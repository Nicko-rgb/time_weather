import { View, Text, StyleSheet } from 'react-native';

export default function Forecast() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>📅 Pronóstico extendido</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 22, fontWeight: 'bold' }
});
