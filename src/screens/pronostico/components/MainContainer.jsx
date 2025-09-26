// src/screens/pronostico/components/MainContainer.jsx
import React, { useRef } from 'react';
import { 
  ScrollView, 
  RefreshControl, 
  StyleSheet,
  Platform,
  Animated
} from 'react-native';

const MainContainer = ({ 
  children, 
  onRefresh, 
  isRefreshing = false,
  showScrollIndicator = false 
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      tintColor="#fff"
      titleColor="#fff"
      colors={['#007AFF', '#34C759', '#FF9500']}
      progressBackgroundColor="rgba(255, 255, 255, 0.1)"
      title="Actualizando clima..."
      style={styles.refreshControl}
    />
  ) : undefined;

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={showScrollIndicator}
      showsHorizontalScrollIndicator={false}
      bounces={true}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Espacio para el indicador de inicio en iOS
  },
  refreshControl: {
    backgroundColor: 'transparent',
  },
});

export default MainContainer;