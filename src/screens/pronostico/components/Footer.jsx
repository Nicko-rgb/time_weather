// src/screens/pronostico/components/Footer.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../constants';

const Footer = ({ lastUpdate, showAppInfo = false }) => {
  return (
    <View style={styles.container}>
      {lastUpdate && (
        <Text style={styles.updateText}>
          Última actualización: {formatTime(lastUpdate)}
        </Text>
      )}
      
      {showAppInfo && (
        <Text style={styles.appInfo}>
          WeatherApp Pro v2.0.0
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    marginTop: 20,
  },
  updateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  appInfo: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
});

export default Footer;