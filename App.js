import React from "react";
import { Home } from './src/components/Home';
import { Result } from './src/components/Result';
import { Scandit } from './src/scandit/Scandit';
import { MatrixBubble } from './src/scandit/matrix-bubble-scan/MatrixBubble';
import { MatrixSimple } from './src/scandit/matrix-bubble-simple/MatrixSimple';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const App = () => {

const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scandit" component={Scandit} />
        <Stack.Screen name="MatrixBubble" component={MatrixBubble} />
        <Stack.Screen name="MatrixSimple" component={MatrixSimple} />
        <Stack.Screen name="Result" component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
