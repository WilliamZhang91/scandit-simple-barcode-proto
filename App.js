import React, { useState } from "react";
import { Login } from "./src/components/pages/Login";
import { Dashboard } from "./src/components/pages/Dashboard";
import { Refill } from "./src/components/pages/Refill";
import { ProductDashboard } from "./src/components/pages/ProductDashboard";
import { Home } from './src/components/Home';
import { Result } from './src/components/Result';
import { Scandit } from './src/scandit/Scandit';
import { MatrixBubble } from './src/scandit/matrix-bubble-scan/MatrixBubble';
import { MatrixSimple } from './src/scandit/matrix-bubble-simple/MatrixSimple';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from "./src/store/context";
import { LogBox } from 'react-native';

const App = () => {

  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications

  const Stack = createNativeStackNavigator();
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
          <Stack.Screen name="Refill" component={Refill} options={{ headerShown: false }} />
          <Stack.Screen name="Scandit" component={Scandit} options={{ headerShown: false }}/>
          <Stack.Screen name="Product_Dashboard" component={ProductDashboard} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
