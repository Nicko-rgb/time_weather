import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import Home from './src/screens/Home';
import Forecast from './src/screens/pronostico/Pronosticos';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E2C' }}>
                    
                    {/*Control de la barra de estado */}
                    <StatusBar barStyle="light-content" />

                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => {
                                let iconName;
                                if (route.name === 'Hoy') {
                                    iconName = 'sunny-outline';
                                } else if (route.name === 'Pronóstico') {
                                    iconName = 'calendar-outline';
                                }
                                return <Ionicons name={iconName} size={size} color={color} />;
                            },
                            tabBarActiveTintColor: '#007AFF',
                            tabBarInactiveTintColor: 'gray',
                            tabBarStyle: { paddingBottom: 5, height: 60 },
                        })}
                    >
                        <Tab.Screen name="Hoy" component={Home} />
                        <Tab.Screen name="Pronóstico" component={Forecast} />
                    </Tab.Navigator>
                </SafeAreaView>
            </SafeAreaProvider>
        </NavigationContainer>
    );
}
