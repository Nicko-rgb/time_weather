/**
 * WeatherApp Pro - Aplicación Principal del Clima
 * 
 * Aplicación moderna y profesional para consultar el clima con:
 * - Interfaz intuitiva y responsive
 * - Búsqueda de ciudades con autocompletado
 * - Geolocalización automática
 * - Pronóstico extendido de 7 días
 * - Cache inteligente para mejor rendimiento
 * - Manejo robusto de errores
 * - Estados de carga y error bien diseñados
 * 
 * @author Tu Nombre
 * @version 2.0.0
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  View, 
  StatusBar,
  ImageBackground,
  Alert,
  Platform,
  AppState,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Importar componentes modulares
import {
  SearchBar,
  CurrentWeatherCard,
  DailyForecastSection,
  ActionButtons,
  Footer,
  LoadingState,
  ErrorState,
  EmptyState,
  MainContainer,
} from './components';

// Importar estilos y constantes
import { styles } from '../../styles/pronostico/style_pronostico';
import { 
  getBackgroundImage, 
  APP_CONFIG,
  formatTime 
} from './constants';

// Importar servicios
import { 
  WeatherAppService, 
  WeatherError, 
  DebugService 
} from './services';

// === TIPOS DE ESTADOS DE LA APLICACIÓN ===
const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  EMPTY: 'empty',
  SEARCHING: 'searching',
  REFRESHING: 'refreshing',
};

// === COMPONENTE PRINCIPAL ===
export default function WeatherApp() {
  // === ESTADOS PRINCIPALES ===
  const [appState, setAppState] = useState(APP_STATES.LOADING);
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // === ESTADOS DE BÚSQUEDA ===
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  
  // === ESTADOS DE UI ===
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  
  // === REFERENCIAS ===
  const searchTimeoutRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // === EFECTOS ===
  
  /**
   * Efecto principal: Inicializar la aplicación
   */
  useEffect(() => {
    initializeApp();
    
    // Escuchar cambios en el estado de la app
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Efecto: Actualizar imagen de fondo cuando cambian los datos del clima
   */
  useEffect(() => {
    if (weatherData?.current?.weathercode) {
      const newBackground = getBackgroundImage(weatherData.current.weathercode);
      setBackgroundImage(newBackground);
    }
  }, [weatherData]);

  /**
   * Efecto: Auto-actualización periódica (opcional)
   */
  useEffect(() => {
    if (weatherData && appState === APP_STATES.SUCCESS) {
      const interval = setInterval(() => {
        if (AppState.currentState === 'active') {
          handleAutoRefresh();
        }
      }, APP_CONFIG.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [weatherData, appState]);

  // === FUNCIONES PRINCIPALES ===

  /**
   * Inicializa la aplicación obteniendo datos del clima actual
   */
  const initializeApp = useCallback(async () => {
    try {
      setAppState(APP_STATES.LOADING);
      setErrorMessage(null);
      retryCountRef.current = 0;

      DebugService.log('APP', 'Inicializando aplicación');

      const result = await DebugService.measureTime(
        'Carga inicial',
        () => WeatherAppService.getCurrentLocationWeather({
          useCache: true,
          includeName: true,
        })
      );

      setWeatherData(result);
      setLastUpdateTime(new Date().toISOString());
      setAppState(APP_STATES.SUCCESS);

      DebugService.log('APP', 'Aplicación inicializada correctamente', {
        location: result.location?.name,
        temperature: result.current?.temperature,
      });

    } catch (error) {
      handleError(error, 'inicializar la aplicación');
      DebugService.logError('APP', error, { action: 'initialize' });
    }
  }, []);

  /**
   * Maneja los cambios en el estado de la aplicación (background/foreground)
   */
  const handleAppStateChange = useCallback((nextAppState) => {
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      DebugService.log('APP', 'App volvió al foreground');
      
      // Refrescar datos si han pasado más de 10 minutos
      if (lastUpdateTime) {
        const timeSinceUpdate = Date.now() - new Date(lastUpdateTime).getTime();
        if (timeSinceUpdate > 10 * 60 * 1000) { // 10 minutos
          handleAutoRefresh();
        }
      }
    }
    appStateRef.current = nextAppState;
  }, [lastUpdateTime]);

  /**
   * Maneja la búsqueda de ciudades
   */
  const handleSearch = useCallback(async () => {
    const query = searchQuery.trim();
    
    if (!query || query.length < 2) {
      Alert.alert(
        'Búsqueda inválida',
        'Por favor ingresa al menos 2 caracteres para buscar una ciudad.'
      );
      return;
    }

    if (query === lastSearchQuery) {
      DebugService.log('SEARCH', 'Búsqueda duplicada ignorada');
      return;
    }

    try {
      setIsSearching(true);
      setErrorMessage(null);
      setLastSearchQuery(query);

      DebugService.log('SEARCH', `Buscando: "${query}"`);

      const result = await DebugService.measureTime(
        `Búsqueda: ${query}`,
        () => WeatherAppService.searchCityWeather(query, { useCache: true })
      );

      setWeatherData(result);
      setLastUpdateTime(new Date().toISOString());
      setAppState(APP_STATES.SUCCESS);

      DebugService.log('SEARCH', 'Búsqueda completada', {
        query,
        location: result.location?.name,
        temperature: result.current?.temperature,
      });

    } catch (error) {
      handleError(error, `buscar "${query}"`);
      DebugService.logError('SEARCH', error, { query });
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, lastSearchQuery]);

  /**
   * Obtiene el clima de la ubicación actual del usuario
   */
  const handleUseCurrentLocation = useCallback(async () => {
    try {
      setAppState(APP_STATES.LOADING);
      setErrorMessage(null);
      setSearchQuery('');
      setLastSearchQuery('');

      DebugService.log('LOCATION', 'Obteniendo ubicación actual');

      const result = await DebugService.measureTime(
        'Ubicación actual',
        () => WeatherAppService.getCurrentLocationWeather({
          useCache: false,
          includeName: true,
        })
      );

      setWeatherData(result);
      setLastUpdateTime(new Date().toISOString());
      setAppState(APP_STATES.SUCCESS);

      DebugService.log('LOCATION', 'Ubicación actual obtenida', {
        coordinates: `${result.location?.latitude}, ${result.location?.longitude}`,
        name: result.location?.name,
      });

    } catch (error) {
      handleError(error, 'obtener la ubicación actual');
      DebugService.logError('LOCATION', error);
    }
  }, []);

  /**
   * Refresca los datos meteorológicos actuales
   */
  const handleRefresh = useCallback(async () => {
    if (!weatherData?.coordinates) {
      DebugService.log('REFRESH', 'No hay coordenadas para refrescar');
      return;
    }

    try {
      setIsRefreshing(true);
      setErrorMessage(null);

      DebugService.log('REFRESH', 'Refrescando datos');

      const result = await DebugService.measureTime(
        'Refresco manual',
        () => WeatherAppService.refreshWeatherData(
          weatherData.coordinates.latitude,
          weatherData.coordinates.longitude
        )
      );

      setWeatherData(result);
      setLastUpdateTime(new Date().toISOString());
      setAppState(APP_STATES.SUCCESS);

      DebugService.log('REFRESH', 'Datos refrescados correctamente');

    } catch (error) {
      handleError(error, 'actualizar los datos');
      DebugService.logError('REFRESH', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [weatherData]);

  /**
   * Auto-refresco silencioso en segundo plano
   */
  const handleAutoRefresh = useCallback(async () => {
    if (!weatherData?.coordinates || isRefreshing) return;

    try {
      DebugService.log('AUTO_REFRESH', 'Refrescando automáticamente');

      const result = await WeatherAppService.refreshWeatherData(
        weatherData.coordinates.latitude,
        weatherData.coordinates.longitude
      );

      setWeatherData(result);
      setLastUpdateTime(new Date().toISOString());

    } catch (error) {
      DebugService.logError('AUTO_REFRESH', error);
      // No mostrar error en auto-refresh para no interrumpir al usuario
    }
  }, [weatherData, isRefreshing]);

  /**
   * Maneja errores de forma consistente
   */
  const handleError = useCallback((error, context) => {
    let userFriendlyMessage;

    if (error instanceof WeatherError) {
      switch (error.code) {
        case 'PERMISSION_DENIED':
          userFriendlyMessage = 'Necesitamos permiso para acceder a tu ubicación. Ve a configuración y habilita la ubicación para esta app.';
          break;
        case 'LOCATION_ERROR':
          userFriendlyMessage = 'No pudimos obtener tu ubicación. Asegúrate de que el GPS esté activado.';
          break;
        case 'LOCATION_NOT_FOUND':
          userFriendlyMessage = error.message;
          break;
        case 'WEATHER_API_ERROR':
        case 'GEOCODING_ERROR':
          userFriendlyMessage = 'Hay problemas de conectividad. Verifica tu conexión a internet e intenta de nuevo.';
          break;
        default:
          userFriendlyMessage = error.message || 'Ha ocurrido un error inesperado.';
      }
    } else {
      userFriendlyMessage = `Error al ${context}. Verifica tu conexión a internet.`;
    }

    setErrorMessage(userFriendlyMessage);
    setAppState(APP_STATES.ERROR);

    // Mostrar alerta solo para errores críticos
    if (error?.code === 'PERMISSION_DENIED') {
      Alert.alert(
        'Permiso requerido',
        userFriendlyMessage,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Configuración', 
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }
          }
        ]
      );
    }
  }, []);

  /**
   * Reintenta la última operación
   */
  const handleRetry = useCallback(() => {
    retryCountRef.current++;
    
    if (retryCountRef.current > maxRetries) {
      Alert.alert(
        'Máximo de intentos alcanzado',
        'Ha ocurrido un problema persistente. Por favor, verifica tu conexión y intenta más tarde.'
      );
      return;
    }

    if (lastSearchQuery) {
      handleSearch();
    } else {
      initializeApp();
    }
  }, [lastSearchQuery, handleSearch, initializeApp]);

  /**
   * Limpia la búsqueda y vuelve a la ubicación actual
   */
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setLastSearchQuery('');
    handleUseCurrentLocation();
  }, [handleUseCurrentLocation]);

  // === RENDERIZADO CONDICIONAL ===

  /**
   * Renderiza el estado de carga inicial
   */
  const renderLoadingState = () => (
    <LoadingState 
      message={
        appState === APP_STATES.LOADING 
          ? "Obteniendo tu ubicación y clima..." 
          : "Buscando ciudad..."
      }
      subMessage="Esto puede tardar unos segundos"
      showProgress={false}
    />
  );

  /**
   * Renderiza el estado de error
   */
  const renderErrorState = () => (
    <ErrorState
      error={errorMessage}
      onRetry={handleRetry}
      onUseLocation={handleUseCurrentLocation}
      showLocationButton={!lastSearchQuery}
      title="¡Ups! Algo salió mal"
    />
  );

  /**
   * Renderiza el estado principal con datos del clima
   */
  const renderMainContent = () => {
    if (!weatherData) {
      return (
        <EmptyState
          title="Sin datos disponibles"
          message="No pudimos obtener información del clima."
          icon="cloud-off"
          onAction={initializeApp}
          actionText="Reintentar"
        />
      );
    }

    const { current, daily, location } = weatherData;

    return (
      <MainContainer 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing}
      >
        {/* Clima actual */}
        <CurrentWeatherCard
          temperature={current.temperature}
          windspeed={current.windspeed}
          weathercode={current.weathercode}
          time={current.time}
          locationName={location?.name}
          humidity={current.humidity}
          pressure={current.pressure}
          visibility={current.visibility}
          uvIndex={current.uvIndex}
          feelsLike={current.feelsLike}
        />

        {/* Pronóstico diario */}
        {daily && daily.length > 0 && (
          <DailyForecastSection 
            forecastData={daily}
            title="Pronóstico de 7 días"
          />
        )}

        {/* Botones de acción */}
        <ActionButtons
          onLocationPress={handleUseCurrentLocation}
          onRefreshPress={handleRefresh}
          isLoading={false}
          showRefresh={true}
        />

        {/* Pie de página */}
        <Footer 
          lastUpdate={lastUpdateTime}
          showAppInfo={true}
        />
      </MainContainer>
    );
  };

  // === RENDERIZADO PRINCIPAL ===
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['right', 'left', 'top']}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="transparent"
          translucent={true}
        />
        
        <ImageBackground
          source={{ uri: backgroundImage || 'https://images.unsplash.com/photo-1501973801540-537f08ccae7d?auto=format&fit=crop&w=1200&q=80' }}
          style={styles.backgroundImage}
          blurRadius={2}
          resizeMode="cover"
        >
          <View style={styles.container}>
            {/* Barra de búsqueda - Siempre visible */}
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              isSearching={isSearching}
              placeholder="Buscar ciudad..."
              disabled={appState === APP_STATES.LOADING}
            />
            
            {/* Contenido principal basado en el estado */}
            {appState === APP_STATES.LOADING && renderLoadingState()}
            {appState === APP_STATES.ERROR && renderErrorState()}
            {appState === APP_STATES.SUCCESS && renderMainContent()}
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}