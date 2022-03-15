import React, { useRef, useEffect } from 'react';
import { AppState, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  BarcodeTracking,
  BarcodeTrackingBasicOverlay,
  BarcodeTrackingBasicOverlayStyle,
  BarcodeTrackingSettings,
  Symbology,
} from 'scandit-react-native-datacapture-barcode';
import {
  Camera,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  VideoResolution,
} from 'scandit-react-native-datacapture-core';

import { Button } from './Button';
import { requestCameraPermissionsIfNeeded } from '../../../camera-permission-handler';
import { styles } from './styles';

export const MatrixSimple = () => {

  const dataCaptureContext = DataCaptureContext.forLicenseKey('AewRw2KMQ1AaOwpSbBtntogWqDlQIdAV4nfuiJkqmrq+V0TvPGBHbndqFhuIXNwjSXDNxHEx8gwbHn4B3kD1ArFb/u4OdnS8yG8GMklfHCJ2RKtGgmcabURXP3TyZrdy3GGMqrtppREWQakBunStDVxz/ieVG2w3xRSF7jgPyPeCQQIQyD8JZOyBkOpD6sGylNFlFhoQDeIs4UDxcxUW5Cqtb6tdBgZyc12otsk1jc5eYXgPnwix5OCmkyAmfoHkO0lmmwHq8r7UrtJjwQrlyCcsCRcHMdJl3gp8YWplC9ceviHGz+0Ar5s1ZXXQvOI8lIeI2SbXZK2ZfcVss7Vl2xzyrna4+g6gwIBQEKm71AjjXogH+jJ/MsMTtQDPAzgmk2UyliFlg9XZiA7f7OJI2nWGh1YEhuW7QR0CscYZHpLoHTUjjNlLuqq08MHdlGua+dDcuz3wKBOIPC7fOeyW8kQd3u9ZwNKsqG7kyRU5o8NlRoaLgJcjL5SuPcat9D7fMtYJ10QZq14fKXSy8KGgaeUwSYDQSicI4GsTeEd4T5cFVKn/LclMohHQqoMwldUNg0f844NBbQxzLlUhIachvFPA7N+NuSalpWL0ixNzbYgmgkikkj+c/PsqZEhIlYC8VgWGAUKJqzj+Lwdv/VHb8xfNv/GGBf7j98SwjwJJcoz/QZerzYB6dbTVb4nBR/x37hvyhqz0Q3vmlv09s9azxIiBNpt0uLQpqiIHSuN1V6k/BuNDn4QOL6R94tPsb1qW0RrgxBFTIzepCHTMEurlA+Xk7O/pAWGqt5C17tl2excZxq7ARMnOc5nT9GxcNDZve+Ra9Jz4cs5XZyN+PVp/NAu068QL');
  const viewRef = useRef()
  const camera = Camera.default;
  const results = {};
  const settings = new BarcodeTrackingSettings();
  settings.enableSymbologies([
    Symbology.EAN13UPCA,
    Symbology.EAN8,
    Symbology.UPCE,
    Symbology.Code39,
    Symbology.Code128,
    Symbology.QR,
  ]);
  const barcodeTracking = BarcodeTracking.forContext(dataCaptureContext, settings);

  const startCapture = () => {
    startCamera();
    barcodeTracking.isEnabled = true;
  }

  const stopCapture = () => {
    barcodeTracking.isEnabled = false;
    stopCamera();
  }

  //goToResults() {
  //  this.props?.navigation?.navigate('results', { results: this.results });
  //}

  const stopCamera = () => {
    if (camera) {
      camera.switchToDesiredState(FrameSourceState.Off);
    }
  }

  const startCamera = () => {
      dataCaptureContext.setFrameSource(camera);
      const cameraSettings = BarcodeTracking.recommendedCameraSettings;
      cameraSettings.preferredResolution = VideoResolution.FullHD;
      camera.applySettings(cameraSettings);
    requestCameraPermissionsIfNeeded()
      .then(() => camera.switchToDesiredState(FrameSourceState.On))
      .catch(() => BackHandler.exitApp());
  }

  const setupScanning = () => {

    const barcodeTrackingListener = {
      didUpdateSession: (_, session) => {
        Object.values(session.trackedBarcodes).forEach(trackedBarcode => {
          const { data, symbology } = trackedBarcode.barcode;
          results[data] = { data, symbology };
          console.log(results)  
        });
      }
    };

    barcodeTracking.addListener(barcodeTrackingListener);

    BarcodeTrackingBasicOverlay.withBarcodeTrackingForViewWithStyle(
      barcodeTracking,
      viewRef.current,
      BarcodeTrackingBasicOverlayStyle.Frame
    );
  };

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      stopCapture();
    } else {
      startCapture();
    }
  };

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    startCamera();
    setupScanning();
    //navigation.addListener("focus", () => {
    //  results = {};
    //});
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
      dataCaptureContext.dispose();
    };
  }, []);

  const navigation = useNavigation()

  return (
    <>
      <DataCaptureView style={{ flex: 1 }} context={dataCaptureContext} ref={viewRef} />
      <SafeAreaView style={styles.buttonContainer}>
        <Button 
          styles={styles.button} 
          textStyles={styles.buttonText} 
          title='Done' 
          onPress={() => navigation.navigate("Result", {results: results})}
          />
      </SafeAreaView>
    </>
  );
}
