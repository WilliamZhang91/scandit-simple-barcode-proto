import React, { useRef, useEffect, useState } from 'react';
import { ProductPanel } from '../components/pages/refill-type/ProductPanel';
import { Alert, AppState, BackHandler, View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../store/context';
import { styles } from "../components/pages/refillStyles";
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

  const {
    refillList,
    setRefillList,
    setShowStockInput,
    scanCount,
    setScanCount
  } = useGlobalContext();
  const navigation = useNavigation();
  const viewRef = useRef(null);
  const dataCaptureContext = DataCaptureContext.forLicenseKey("SCANDIT_KEY");
  const camera = Camera.default;
  const [showProductPanel, setShowProductPanel] = useState(false);
  let count = 0;
  console.log(route.params.product[0].gtin)

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
        count += 1;
        setScanCount(prevCount => prevCount + 1);
        console.log(count);
        const barcode = session.newlyRecognizedBarcodes[0];
        const symbology = new SymbologyDescription(barcode.symbology);
        barcodeCaptureMode.isEnabled = false;
        setTimeout(() => {
          barcodeCaptureMode.isEnabled = true;
        }, 100);

        if (+route.params.product[0].gtin === +barcode._data) {
          setShowProductPanel(true);
          setShowStockInput(true);
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
          console.log(typeof +route.params.product[0].gtin);
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
    };
  };

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

  async function getRefillList() {
    await fetch(`API_GATEWAY_ENDPOINT/products/refill_list`)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setRefillList(response)
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    let fetch = false
    if (!fetch) getRefillList();
    console.log(refillList)
    return () => { fetch = true };
  }, []);

  const postScanCount = () => {
    fetch("API_GATEWAY_ENDPOINT/update_stock_count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gtin: route.params.product[0].gtin,
        stockCount: scanCount,
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setScanCount(prevCount => 0);
        setShowStockInput(false);
      })
      .catch(err => console.log(err))
  };

  const postTimestamp = () => {
    fetch("API_GATEWAY_ENDPOINT/record_datetime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gtin: route.params.product[0].gtin,
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
      })
      .catch(err => console.log(err))
  }

  const done = () => {
    Alert.alert(
      null,
      "Update stock?",
      [
        {
          text: "Update",
          onPress: () => { 
            postScanCount(), 
            postTimestamp(), 
            getRefillList(),
            navigation.goBack()
          },
        },
        {
          text: "Cancel"
        },
      ],
    );
  };

  const cancel = () => {
    Alert.alert(
      null,
      "Are you sure you want to exit?",
      [
        {
          text: "OK",
          onPress: () => {
            setScanCount(prevCount => 0);
            setShowStockInput(false);
            navigation.goBack();
          }
        },
        {
          text: "Cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleBackButtonClick = () => {
    navigation.goBack();
    setScanCount(prevCount => 0);
    setShowStockInput(false);
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
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
      <View>
        <Pressable style={styles.doneBtn} onPress={done}>
          <Text>DONE</Text>
        </Pressable>
        <Pressable style={styles.backBtn} onPress={cancel}>
          <Text>CANCEL</Text>
        </Pressable>
      </View>
    </>
  );
};
