import React, { useState } from 'react';
import { Home } from './src/components/Home';
import { Result } from './src/components/Result';
import { Scandit } from './src/scandit/Scandit';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const App = () => {

const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scandit" component={Scandit} />
        <Stack.Screen name="Result" component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
