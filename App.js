//import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import Home from './src/Telas/Home';
import Missoes from './src/Telas/Missoes';
import Temporada from './src/Telas/Temporada';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Missoes" component={Missoes} />
        <Stack.Screen name="Temporada" component={Temporada} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64369dff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});