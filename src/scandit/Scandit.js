import React, { useRef, useEffect } from 'react';
import { Alert, AppState, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebaseDB, scanditKey } from '../config/env';
import { requestCameraPermissionsIfNeeded } from '../../camera-permission-handler';
import {
  BarcodeCapture,
  BarcodeCaptureOverlay,
  BarcodeCaptureOverlayStyle,
  BarcodeCaptureSettings,
  Symbology,
  SymbologyDescription,
} from 'scandit-react-native-datacapture-barcode';
import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  RectangularViewfinder,
  RectangularViewfinderStyle,
  RectangularViewfinderLineStyle,
  VideoResolution,
} from 'scandit-react-native-datacapture-core';

export const Scandit = () => {

  const navigation = useNavigation()

  const viewRef = useRef(null);
  const dataCaptureContext = DataCaptureContext.forLicenseKey(scanditKey);
  const camera = Camera.default;

  const setupScanning = () => {
    const settings = new BarcodeCaptureSettings();
    settings.enableSymbologies([
      Symbology.EAN13UPCA,
      Symbology.EAN8,
      Symbology.UPCE,
      Symbology.QR,
      Symbology.DataMatrix,
      Symbology.Code39,
      Symbology.Code128,
      Symbology.InterleavedTwoOfFive,
    ]);
    const symbologySettings = settings.settingsForSymbology(Symbology.Code39);
    symbologySettings.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    const barcodeCaptureMode = BarcodeCapture.forContext(dataCaptureContext, settings);
    barcodeCaptureMode.isEnabled = true;

    const barcodeCaptureListener = {
      didScan: (_, session) => {
        const barcode = session.newlyRecognizedBarcodes[0];
        console.log(barcode)
        console.log(barcode._data)
        const postProduct = async () => {
          const response = await fetch(firebaseDB, {
            method: "POST",
            body: JSON.stringify(barcode),
            headers: {
              "Content-Type": "application/json"
            }
          });
          const uploadData = await response.json();
          console.log(uploadData)
        };
        const getProduct = async () => {
          const response = await fetch(`${firebaseDB}?orderBy="_data"&equalTo=${barcode._data}&print=pretty`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });
          const uploadData = await response.json();
          console.log(uploadData)
        }
        const symbology = new SymbologyDescription(barcode.symbology);
        barcodeCaptureMode.isEnabled = false;
        Alert.alert(
          null,
          `Scanned: ${barcode.data} (${symbology.readableName})`,
          [
            { text: 'OK', onPress: () => barcodeCaptureMode.isEnabled = true },
            { text: 'FIND', onPress: () => { getProduct(), navigation.navigate("Result", { barcode: barcode }) } },
            { text: 'UPLOAD', onPress: () => postProduct() },
          ],
          { cancelable: true }
        );
      }
    }

    barcodeCaptureMode.addListener(barcodeCaptureListener);
    const overlay = BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
      barcodeCaptureMode,
      viewRef.current,
      BarcodeCaptureOverlayStyle.Frame
    );
    overlay.viewfinder = new RectangularViewfinder(
      RectangularViewfinderStyle.Square,
      RectangularViewfinderLineStyle.Light
    );
  }

  const startCamera = () => {
    dataCaptureContext.setFrameSource(camera);
    const cameraSettings = new CameraSettings();
    cameraSettings.preferredResolution = VideoResolution.FullHD;
    camera.applySettings(cameraSettings);
    requestCameraPermissionsIfNeeded()
      .then(() => camera.switchToDesiredState(FrameSourceState.On))
      .catch(() => BackHandler.exitApp())
  }

  const stopCamera = () => {
    if (camera) {
      camera.switchToDesiredState(FrameSourceState.Off)
    }
  }

  const startCapture = () => {
    startCamera();
    barcodeCaptureMode.isEnabled = true;
  }

  const stopCapture = () => {
    barcodeCaptureMode.isEnabled = false;
    stopCamera();
  }

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      stopCapture();
    } else {
      startCapture();
    }
  }

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    setupScanning();
    startCamera();
    return cleanUp = () => {
      AppState.removeEventListener("change", handleAppStateChange);
      dataCaptureContext.dispose();
    };

  }, []);

  return (
    <DataCaptureView
      style={{ flex: 1 }}
      context={dataCaptureContext}
      ref={viewRef}
    />
  );
};

