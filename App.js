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
                tabBarInactiveTintColor: '#fff',
                tabBarStyle: { paddingBottom: 5, height: 60, backgroundColor: '#000', borderTopColor: 'transparent',},
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
