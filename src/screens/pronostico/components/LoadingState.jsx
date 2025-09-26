// src/screens/pronostico/components/LoadingState.jsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet,
  Animated,
  Easing
} from 'react-native';

const LoadingState = ({ 
  message = "Cargando...", 
  subMessage = "", 
  showProgress = true 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animación de pulso continua
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [fadeAnim, pulseAnim]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { opacity: fadeAnim }
      ]}
    >
      {showProgress && (
        <Animated.View 
          style={[
            styles.spinnerContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <ActivityIndicator 
            size="large" 
            color="#007AFF" 
            style={styles.spinner} 
          />
          <View style={styles.spinnerBorder} />
        </Animated.View>
      )}
      
      <Text style={styles.message}>{message}</Text>
      
      {subMessage && (
        <Text style={styles.subMessage}>{subMessage}</Text>
      )}
      
      <View style={styles.dots}>
        <Text style={styles.dot}>●</Text>
        <Text style={[styles.dot, styles.dotDelay1]}>●</Text>
        <Text style={[styles.dot, styles.dotDelay2]}>●</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinnerContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  spinner: {
    marginBottom: 20,
  },
  spinnerBorder: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 25,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    fontSize: 20,
    color: '#007AFF',
    marginHorizontal: 4,
    opacity: 0.3,
  },
  dotDelay1: {
    opacity: 0.6,
  },
  dotDelay2: {
    opacity: 1,
  },
});

export default LoadingState;