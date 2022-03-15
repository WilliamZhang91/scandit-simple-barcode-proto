import React, { useRef, useEffect, useState } from 'react';
import { ProductPanel } from '../components/pages/refill-type/ProductPanel';
import { Alert, AppState, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../store/context';
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

export const Scandit = ({ route }) => {

  const { refillList, setShowStockInput, setScanCount } = useGlobalContext();
  console.log(route.params.product[0].gtin)
  console.log(route.params)
  const viewRef = useRef(null);
  const dataCaptureContext = DataCaptureContext.forLicenseKey("ScanditKey");
  const camera = Camera.default;
  const [barcodeCount, setBarcodeCount] = useState(0)
  const [showProductPanel, setShowProductPanel] = useState(false);
  let count = 0

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
        count += 1
        setScanCount(prevCount => prevCount + 1)
        console.log(count)
        const barcode = session.newlyRecognizedBarcodes[0];
        const symbology = new SymbologyDescription(barcode.symbology);
        barcodeCaptureMode.isEnabled = false;
        setTimeout(() => {
          barcodeCaptureMode.isEnabled = true;
        }, 500)

        if (+route.params.product[0].gtin === +barcode._data) {
          setShowProductPanel(true)
          setShowStockInput(true)
          console.log(refillList);
          console.log(barcode._data)
        } else {
          Alert.alert(
            null,
            `Error: ${barcode._data} is not present on refill list`,
            [
              {
                text: "OK",
                onPress: () => barcodeCaptureMode.isEnabled = true
              },
            ],
          );
          console.log(refillList);
          console.log(route.params.product[0].gtin);
          console.log(typeof +route.params.product[0].gtin)
        }
      },
    };

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
  };

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
    <>
      {showProductPanel &&
        <ProductPanel
          gtin={route.params.product[0].gtin}
          material_description={route.params.product[0].material_description}
          stock={route.params.product[0].stock}
          stock_required={route.params.product[0].stock_required}
          aisle_number={route.params.product[0].aisle_number}
          count={count}
        />}
      <DataCaptureView
        style={{ flex: 1 }}
        context={dataCaptureContext}
        ref={viewRef}
      />
    </>
  );
};
