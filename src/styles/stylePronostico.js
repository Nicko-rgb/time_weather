import { 
  StyleSheet, 
} from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0f172a'
    },
    bg: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingHorizontal: 5
    },
    scrollContainer: {
        paddingBottom: 20
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },

    // Search Bar Styles
    searchContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 16,
        alignItems: 'center'
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
        backdropFilter: 'blur(10px)'
    },
    searchIcon: {
        marginRight: 8
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        fontWeight: '500'
    },
    searchButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 25,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 48
    },

    // Current Weather Styles - Responsive
    currentWeatherCard: {
        marginBottom: 24
    },
    weatherCard: {
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        backdropFilter: 'blur(20px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        minHeight: 300
    },
    tempContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    weatherDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        flexWrap: 'wrap'
    },
    weatherDetailItem: {
        alignItems: 'center',
        flex: 1,
        minWidth: 80,
        marginVertical: 4
    },

    // Forecast Section - Responsive
    forecastSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    forecastItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    forecastMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        flexWrap: 'wrap'
    },
    forecastDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        flexWrap: 'wrap'
    },
    forecastDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        minWidth: 100,
        marginVertical: 2
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center'
    },
    location: {
        fontSize: 18,
        color: '#e2e8f0',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8
    },
    time: {
        fontSize: 14,
        color: '#cbd5e0',
        marginBottom: 24
    },
    tempContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    weatherIconLarge: {
        marginRight: 16
    },
    temp: {
        fontSize: 64,
        color: '#fbbf24',
        fontWeight: '700'
    },
    weatherDescription: {
        fontSize: 20,
        color: '#e2e8f0',
        fontWeight: '500',
        marginBottom: 24,
        textAlign: 'center'
    },
    weatherDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    weatherDetailItem: {
        alignItems: 'center',
        flex: 1
    },
    detailText: {
        fontSize: 12,
        color: '#cbd5e0',
        marginTop: 4,
        marginBottom: 2
    },
    detailValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600'
    },

    // Forecast Styles
    forecastSection: {
        borderRadius: 20,
        marginBottom: 20,
        backdropFilter: 'blur(10px)',
    },
    sectionTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center'
    },
    // Forecast Item Styles
    forecastItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    forecastHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    forecastDay: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff'
    },
    forecastDate: {
        fontSize: 14,
        color: '#cbd5e1',
        fontWeight: '500'
    },
    forecastMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    tempRange: {
        alignItems: 'flex-end'
    },
    tempMax: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    tempMin: {
        fontSize: 18,
        color: '#94a3b8',
        fontWeight: '500'
    },
    forecastDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    forecastDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    precipitationText: {
        fontSize: 12,
        color: '#64b5f6',
        marginLeft: 4,
        fontWeight: '500'
    },
    windText: {
        fontSize: 12,
        color: '#81c784',
        marginLeft: 4,
        fontWeight: '500'
    },
    uvText: {
        fontSize: 12,
        color: '#ffb74d',
        marginLeft: 4,
        fontWeight: '500'
    },
    weatherCondition: {
        fontSize: 14,
        color: '#e2e8f0',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 4
    },

    // Button and Footer Styles
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10b981',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        marginBottom: 20,
        alignSelf: 'center'
    },
    locationButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 12,
        opacity: 0.8
    },

    // Loading and Error Styles
    loadingText: {
        color: '#fff',
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center'
    },
    error: {
        color: '#ef4444',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '600'
    },
    retryText: {
        color: '#94a3b8',
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center'
    },
    // Info Container Styles
    infoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)'
    },
    infoText: {
        fontSize: 12,
        color: '#cbd5e1',
        marginBottom: 4,
        fontWeight: '500'
    },

    // Button and Footer Styles
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10b981',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        marginBottom: 20,
        alignSelf: 'center'
    },
    locationButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20
    },
    footerText: {
        color: '#94a3b8',
        fontSize: 12,
        opacity: 0.8
    },

    // Loading and Error Styles
    loadingText: {
        color: '#fff',
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center'
    },
    error: {
        color: '#ef4444',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '600'
    },
    retryText: {
        color: '#94a3b8',
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center'
    }
});