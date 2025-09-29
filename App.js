import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import Home from './src/screens/Home';
import Forecast from './src/screens/pronostico/Pronosticos';
import ListCytes from './src/screens/ListCytes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 👉 Tabs (solo Hoy y Pronóstico)
function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 15,
                    fontWeight: '700',
                    letterSpacing: 0.5,
                    marginBottom: 4,
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    let iconColor = focused ? '#6C63FF' : '#fff';
                    let iconSize = focused ? 33 : 26;
                    if (route.name === 'Hoy') {
                        iconName = 'sunny-outline';
                    } else if (route.name === 'Pronóstico') {
                        iconName = 'calendar-outline';
                    }
                    return <Ionicons name={iconName} size={iconSize} color={iconColor} style={{ shadowColor: focused ? '#6C63FF' : 'transparent', shadowOpacity: 0.7, shadowRadius: 8, elevation: focused ? 12 : 0 }} />;
                },
                tabBarActiveTintColor: '#6C63FF',
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: {
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    height: 68,
                    borderRadius: 12,
                    backgroundColor: 'rgba(15,10,44,0.85)',
                    borderTopWidth: 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.16,
                    shadowRadius: 18,
                    elevation: 18,
                    borderTopColor: 'transparent',
                    overflow: 'hidden',
                },
            })}
        >
            <Tab.Screen name="Hoy" component={Home} />
            <Tab.Screen name="Pronóstico" component={Forecast} />
        </Tab.Navigator>
    );
}

// 👉 Stack principal
export default function App() {
    return (
        <NavigationContainer>
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E2C' }}>
                    <StatusBar barStyle="light-content" />
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Tabs" component={Tabs} />
                        <Stack.Screen name="Ciudades" component={ListCytes} />
                    </Stack.Navigator>
                </SafeAreaView>
            </SafeAreaProvider>
        </NavigationContainer>
    );
}
