import React, { useRef, useEffect, useState } from 'react';
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
  const dataCaptureContext = DataCaptureContext.forLicenseKey("AewRw2KMQ1AaOwpSbBtntogWqDlQIdAV4nfuiJkqmrq+V0TvPGBHbndqFhuIXNwjSXDNxHEx8gwbHn4B3kD1ArFb/u4OdnS8yG8GMklfHCJ2RKtGgmcabURXP3TyZrdy3GGMqrtppREWQakBunStDVxz/ieVG2w3xRSF7jgPyPeCQQIQyD8JZOyBkOpD6sGylNFlFhoQDeIs4UDxcxUW5Cqtb6tdBgZyc12otsk1jc5eYXgPnwix5OCmkyAmfoHkO0lmmwHq8r7UrtJjwQrlyCcsCRcHMdJl3gp8YWplC9ceviHGz+0Ar5s1ZXXQvOI8lIeI2SbXZK2ZfcVss7Vl2xzyrna4+g6gwIBQEKm71AjjXogH+jJ/MsMTtQDPAzgmk2UyliFlg9XZiA7f7OJI2nWGh1YEhuW7QR0CscYZHpLoHTUjjNlLuqq08MHdlGua+dDcuz3wKBOIPC7fOeyW8kQd3u9ZwNKsqG7kyRU5o8NlRoaLgJcjL5SuPcat9D7fMtYJ10QZq14fKXSy8KGgaeUwSYDQSicI4GsTeEd4T5cFVKn/LclMohHQqoMwldUNg0f844NBbQxzLlUhIachvFPA7N+NuSalpWL0ixNzbYgmgkikkj+c/PsqZEhIlYC8VgWGAUKJqzj+Lwdv/VHb8xfNv/GGBf7j98SwjwJJcoz/QZerzYB6dbTVb4nBR/x37hvyhqz0Q3vmlv09s9azxIiBNpt0uLQpqiIHSuN1V6k/BuNDn4QOL6R94tPsb1qW0RrgxBFTIzepCHTMEurlA+Xk7O/pAWGqt5C17tl2excZxq7ARMnOc5nT9GxcNDZve+Ra9Jz4cs5XZyN+PVp/NAu068QL");
  const camera = Camera.default;
  const [info, setInfo] = useState([])
  console.log(info)

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
  const getProduct = async (barcode) => {
    const response = await fetch(`https://scandit-3f0b6-default-rtdb.asia-southeast1.firebasedatabase.app/products.json?orderBy="_data"&equalTo="${barcode._data}"&print=pretty`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    const data = await response.json();
    console.log(data._shelf)
    const loadedData = [];
    for (const key in data) {
      loadedData.push({
        id: key,
        shelf: data._shelf,
        warehouse: data._warehouse,
      })
    }
    //console.log(uploadData)
    setInfo(loadedData)
  }

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
        console.log(barcode._data)
        const symbology = new SymbologyDescription(barcode.symbology);
        barcodeCaptureMode.isEnabled = false;
        Alert.alert(
          null,
          `Scanned: ${barcode.data} (${symbology.readableName})`,
          [
            { text: 'OK', onPress: () => barcodeCaptureMode.isEnabled = true },
            { text: 'FIND', onPress: () => { getProduct(barcode), navigation.navigate("Result", { barcode: info }) } },
            { text: 'UPLOAD', onPress: () => postProduct(barcode) },
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
    return () => {
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
