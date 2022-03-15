/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { BarcodeTrackingAdvancedOverlayView } from 'scandit-react-native-datacapture-barcode';
import { MatrixBubble } from './src/scandit/matrix-bubble-scan/MatrixBubble';
import { ARView } from "./src/scandit/matrix-bubble-scan/ARView";

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(ARView.moduleName, () => ARView);
