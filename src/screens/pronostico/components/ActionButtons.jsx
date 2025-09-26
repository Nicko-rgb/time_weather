// src/screens/pronostico/components/ActionButtons.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ActionButtons = ({ 
  onLocationPress, 
  onRefreshPress, 
  isLoading = false, 
  showRefresh = true 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.locationButton]}
        onPress={onLocationPress}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>📍 Mi Ubicación</Text>
      </TouchableOpacity>
      
      {showRefresh && (
        <TouchableOpacity 
          style={[styles.button, styles.refreshButton]}
          onPress={onRefreshPress}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🔄 Actualizar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: 150,
  },
  locationButton: {
    backgroundColor: '#34C759',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ActionButtons;