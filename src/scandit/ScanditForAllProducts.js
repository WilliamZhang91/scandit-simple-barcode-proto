import React, { useRef, useEffect, useState } from 'react';
import { ProductPanel } from '../components/pages/refill-type/ProductPanel';
import { ProductModal } from '../components/pages/ProductModal';
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

export const ScanditForAllProducts = ({ route }) => {

    const { setShowStockInput, scanCount, setScanCount } = useGlobalContext();
    const navigation = useNavigation();
    const viewRef = useRef(null);
    const dataCaptureContext = DataCaptureContext.forLicenseKey("SCANDIT_KEY");
    const camera = Camera.default;
    const [showProductPanel, setShowProductPanel] = useState(false);
    const [fetchedProduct, setFetchedProduct] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    let count = 0;

    const fetchProduct = async (barcode) => {
        await fetch(`API_GATEWAY_ENDPOINT/${barcode}`)
            .then(response => response.json())
            .then(response => {
                setFetchedProduct(response);
                setIsModalOpen(true);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        setupScanning();
        console.log("scanned")
        console.log(fetchedProduct)
    }, [setupScanning, fetchedProduct])

    const closeModal = () => {
        setIsModalOpen(false)
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
                count += 1;
                setScanCount(prevCount => prevCount + 1);
                console.log(count);
                const barcode = session.newlyRecognizedBarcodes[0];
                const symbology = new SymbologyDescription(barcode.symbology);
                barcodeCaptureMode.isEnabled = false;
                setTimeout(() => {
                    barcodeCaptureMode.isEnabled = true;
                }, 100);

                fetchProduct(barcode.data);

                if (fetchedProduct) {
                    setShowProductPanel(true);
                    setShowStockInput(true);
                    barcodeCaptureListener.isEnabled = false
                } else {
                    Alert.alert(
                        null,
                        `Error: ${barcode._data} does not exist`,
                        [
                            {
                                text: "OK",
                                onPress: () => barcodeCaptureMode.isEnabled = true
                            },
                        ],
                    );
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
        return true;
      };

      useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
      }, []);

    return (
        <>
            {fetchedProduct.length > 0 && <ProductModal
                isModalOpen={isModalOpen}
                gtin={fetchedProduct[0].gtin}
                material_description={fetchedProduct[0].Material_description}
                stock={fetchedProduct[0].Stock}
                stock_required={fetchedProduct[0].Stock_required}
                aisle_number={fetchedProduct[0].Aisle_Number}
                image={fetchedProduct[0].image}
                closeModal={closeModal}
            />}
            <DataCaptureView
                style={{ flex: 1 }}
                context={dataCaptureContext}
                ref={viewRef}
            />
            <View>
                <Pressable style={styles.backBtn} onPress={cancel}>
                    <Text>CANCEL</Text>
                </Pressable>
            </View>
        </>
    );
};
