import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';  // Importe AppRegistry

import Login from './Login.js';
import AppScreen from './TelaCadastro.js';
import Consulta from './Consulta';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" component={Login}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={AppScreen} />
        <Stack.Screen name="Consulta" component={Consulta} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const appName = 'controle-estoque';
// Registre o componente usando AppRegistry
AppRegistry.registerComponent(appName, () => App);


export default App;
