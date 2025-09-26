// src/screens/pronostico/components/CurrentWeatherCard.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getWeatherDescription, getWeatherIcon } from '../constants';

const CurrentWeatherCard = ({ 
  temperature, 
  windspeed, 
  weathercode, 
  time, 
  locationName, 
  humidity, 
  pressure, 
  feelsLike 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.location}>{locationName || 'Ubicación actual'}</Text>
      <View style={styles.mainInfo}>
        <Text style={styles.icon}>{getWeatherIcon(weathercode)}</Text>
        <Text style={styles.temperature}>{temperature}°C</Text>
      </View>
      <Text style={styles.description}>{getWeatherDescription(weathercode)}</Text>
      <Text style={styles.feelsLike}>Sensación térmica: {feelsLike}°C</Text>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humedad</Text>
          <Text style={styles.detailValue}>{humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Viento</Text>
          <Text style={styles.detailValue}>{windspeed} km/h</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Presión</Text>
          <Text style={styles.detailValue}>{pressure} hPa</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    margin: 16,
    alignItems: 'center',
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 64,
    marginRight: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 5,
  },
  feelsLike: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CurrentWeatherCard;