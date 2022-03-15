import React, { useRef, useEffect } from 'react';
import { useGlobalContext } from '../../store/context';
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
import { styles } from './matrixSimpleStyles';

export const MatrixSimple = () => {

  const dataCaptureContext = DataCaptureContext.forLicenseKey('ScanditKey');
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
  const { matrixSimple, setMatrixSimple } = useGlobalContext();

  let listOfBarcodes = [];
  let loadedData = [];
  let data = []

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

  const postProduct = async (barcode) => {
    const response = await fetch("https://scandit-3f0b6-default-rtdb.asia-southeast1.firebasedatabase.app/products.json", {
      method: "POST",
      body: JSON.stringify(barcode),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const uploadData = await response.json();
    console.log(uploadData)
  };

  const getProduct = () => {
    listOfBarcodes.map(item => {
      fetch(`https://scandit-3f0b6-default-rtdb.asia-southeast1.firebasedatabase.app/products.json?orderBy="_data"&equalTo="${item}"&print=pretty`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      }).then(response => response.json())
        .then(data => {
          for (const key in data) {
            loadedData.push({
              id: key,
              product: data[key]._product,
              shelf: data[key]._shelf,
              warehouse: data[key]._warehouse,
            });
          }
        })
        .then(data => {
          for (const key in data) {
            loadedData.push({
              id: key,
              product: data[key]._product,
              shelf: data[key]._shelf,
              warehouse: data[key]._warehouse,
            });
          }
        })
        .then(data => {
          for (const key in data) {
            loadedData.push({
              id: key,
              product: data[key]._product,
              shelf: data[key]._shelf,
              warehouse: data[key]._warehouse,
            });
          }
        })
        .then(data => {
          for (const key in data) {
            loadedData.push({
              id: key,
              product: data[key]._product,
              shelf: data[key]._shelf,
              warehouse: data[key]._warehouse,
            });
          }
        })
        .then(data => {
          for (const key in data) {
            loadedData.push({
              id: key,
              product: data[key]._product,
              shelf: data[key]._shelf,
              warehouse: data[key]._warehouse,
            });
          }
        })
        .then(data => {
          for (const key in data) {
            loadedData.push({
              id: key,
              product: data[key]._product,
              shelf: data[key]._shelf,
              warehouse: data[key]._warehouse,
            });
          }
          console.log(loadedData);
          setMatrixSimple(loadedData);
        })
        .catch(err => console.log(err));
    });
  };

  const setupScanning = () => {

    const barcodeTrackingListener = {
      didUpdateSession: (_, session) => {
        Object.values(session.trackedBarcodes).forEach(trackedBarcode => {
          const { data, symbology } = trackedBarcode.barcode;
          results[data] = { data, symbology };
          console.log(data);
          if (!listOfBarcodes.includes(data)) {
            listOfBarcodes.push(data);
          } else {
            console.log("already in array")
          };
          console.log(listOfBarcodes);
        });
      },
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
          onPress={() => getProduct()}
        />
        <Button
          styles={styles.button}
          textStyles={styles.buttonText}
          title='Result'
          onPress={() => navigation.navigate("Result")}
        />
      </SafeAreaView>
    </>
  );
}
