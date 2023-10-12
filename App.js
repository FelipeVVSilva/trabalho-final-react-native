import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import Login from './Login.js'; // Substitua 'Login' pelo nome correto do seu arquivo Login.js
import AppScreen from './TelaCadastro.js'; // Substitua 'AppScreen' pelo nome correto do seu arquivo App.js
import Consulta from './Consulta';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen name="Cadastro" component={AppScreen} />
        <Stack.Screen name="Consulta" component={Consulta} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
