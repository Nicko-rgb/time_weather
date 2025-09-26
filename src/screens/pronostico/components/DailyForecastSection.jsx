// src/screens/pronostico/components/DailyForecastSection.jsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { formatDate, getWeatherIcon, getWeatherDescription } from '../constants';

const DailyForecastItem = ({ item }) => (
  <View style={styles.forecastItem}>
    <Text style={styles.day}>{formatDate(item.date)}</Text>
    <Text style={styles.forecastIcon}>{getWeatherIcon(item.weathercode)}</Text>
    <View style={styles.tempContainer}>
      <Text style={styles.tempMax}>{item.temperatureMax}°</Text>
      <Text style={styles.tempMin}>{item.temperatureMin}°</Text>
    </View>
    <Text style={styles.precipitation}>{item.precipitationProbability || 0}%</Text>
  </View>
);

const DailyForecastSection = ({ forecastData, title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {forecastData.map((item, index) => (
          <DailyForecastItem key={index} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  forecastItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    minWidth: 80,
  },
  day: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  forecastIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  tempContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  tempMax: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tempMin: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  precipitation: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
});

export default DailyForecastSection;
