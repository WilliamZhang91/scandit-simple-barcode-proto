import React, { Component } from 'react';
import { AppState, BackHandler, Dimensions, SafeAreaView } from 'react-native';
import {
  BarcodeTracking,
  BarcodeTrackingAdvancedOverlay,
  BarcodeTrackingBasicOverlay,
  BarcodeTrackingBasicOverlayStyle,
  BarcodeTrackingScenario,
  BarcodeTrackingSettings,
  Symbology,
} from 'scandit-react-native-datacapture-barcode';
import {
  Anchor,
  Brush,
  Camera,
  Color,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  MeasureUnit,
  NumberWithUnit,
  PointWithUnit,
  Quadrilateral,
  VideoResolution,
} from 'scandit-react-native-datacapture-core';

import { ARView } from './ARView';
import { requestCameraPermissionsIfNeeded } from '../../../camera-permission-handler';
import Freeze from './Freeze.svg';
import { styles } from './styles';
import Unfreeze from './Unfreeze.svg';

Quadrilateral.prototype.width = function () {
  return Math.max(
    Math.abs(this.topRight.x - this.topLeft.x),
    Math.abs(this.bottomRight.x - this.bottomLeft.x),
  );
};

export class MatrixBubble extends Component {
  constructor() {
    super();

    this.dataCaptureContext = DataCaptureContext.forLicenseKey('ScanditKey');
    this.viewRef = React.createRef();
    this.trackedBarcodes = {};
    this.state = {
      scanning: true,
      barcode: "loading...",
      shelf: null,
      warehouse: null,
    };
    //console.log(this.state)
  };

  componentDidMount(prevState) {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.setupScanning();
    this.startCapture();
  };

  //shouldComponentUpdate(nextProps, nextState) {
  //    if(nextState !== this.state) {
  //      return false
  //    }
  //    return true;
  //}

  componentDidUpdate(prevState) {
    if (this.state === prevState) {
      console.log(true)
    } else {

    };
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.dataCaptureContext.dispose();
  }

  handleAppStateChange = async (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      this.stopCapture();
    } else if (this.state.scanning) {
      this.startCapture();
    }
  }

  startCapture() {
    this.startCamera();
    this.barcodeTracking.isEnabled = true;
  }

  stopCapture() {
    this.barcodeTracking.isEnabled = false;
    this.stopCamera();
  }

  stopCamera() {
    if (this.camera) {
      this.camera.switchToDesiredState(FrameSourceState.Off);
    }
  }

  startCamera() {
    if (!this.camera) {
      this.camera = Camera.default;
      this.dataCaptureContext.setFrameSource(this.camera);

      const cameraSettings = BarcodeTracking.recommendedCameraSettings;
      cameraSettings.preferredResolution = VideoResolution.UHD4K;
      this.camera.applySettings(cameraSettings);
    }

    requestCameraPermissionsIfNeeded()
      .then(() => this.camera.switchToDesiredState(FrameSourceState.On))
      .catch(() => BackHandler.exitApp());
  }

  getProduct = async (barcode) => {
    const response = await fetch(`https://scandit-3f0b6-default-rtdb.asia-southeast1.firebasedatabase.app/products.json?orderBy="_data"&equalTo="${barcode}"&print=pretty`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });
    const data = await response.json();
    //console.log(data)
    const loadedData = [];
    for (const key in data) {
      loadedData.push({
        id: key,
        shelf: data[key]._shelf,
        warehouse: data[key]._warehouse,
      });
      this.setState({
        shelf: loadedData[0].shelf,
        warehouse: loadedData[0].warehouse,
      });
    };
    //console.log(this.state)
  }

  setupScanning() {
    const settings = BarcodeTrackingSettings.forScenario(BarcodeTrackingScenario.A);
    settings.enableSymbologies([
      Symbology.EAN13UPCA,
      Symbology.EAN8,
      Symbology.UPCE,
      Symbology.Code39,
      Symbology.Code128,
    ]);

    this.barcodeTracking = BarcodeTracking.forContext(this.dataCaptureContext, settings);

    this.barcodeTrackingListener = {
      didUpdateSession: (barcodeTracking, session) => {
        session.removedTrackedBarcodes.forEach((identifier) => {
          this.trackedBarcodes[identifier] = null;
        });

        Object.values(session.trackedBarcodes).forEach((trackedBarcode) => {
          this.viewRef.current.viewQuadrilateralForFrameQuadrilateral(trackedBarcode.location)
            .then((location) => this.updateView(trackedBarcode, location));
        });
      },
    };

    this.barcodeTracking.addListener(this.barcodeTrackingListener);

    const basicOverlay = BarcodeTrackingBasicOverlay.withBarcodeTrackingForViewWithStyle(
      this.barcodeTracking,
      this.viewRef.current,
      BarcodeTrackingBasicOverlayStyle.Dot
    );
    basicOverlay.brush = new Brush(Color.fromHex('FFF0'), Color.fromHex('FFFF'), 2);

    this.advancedOverlay = BarcodeTrackingAdvancedOverlay.withBarcodeTrackingForView(
      this.barcodeTracking,
      this.viewRef.current,
    );

    this.advancedOverlay.listener = {
      anchorForTrackedBarcode: () => Anchor.Center,
      offsetForTrackedBarcode: () => new PointWithUnit(
        new NumberWithUnit(0, MeasureUnit.Fraction),
        new NumberWithUnit(-1, MeasureUnit.Fraction),
      ),
    };
  };

  updateView(trackedBarcode, viewLocation) {

    const shouldBeShown = viewLocation.width() > Dimensions.get('window').width * 0.1;

    if (!shouldBeShown) {
      this.trackedBarcodes[trackedBarcode.identifier] = null;
      return;
    }

    const barcodeData = trackedBarcode.barcode.data;
    //console.log(trackedBarcode.barcode.data);

    this.getProduct(trackedBarcode.barcode.data)

    const didViewChange = JSON.stringify(this.trackedBarcodes[trackedBarcode.identifier]) !== JSON.stringify(barcodeData);

    if (didViewChange) {
      this.trackedBarcodes[trackedBarcode.identifier] = barcodeData;

      const props = {
        barcodeData,
        stock: {
          barcode: trackedBarcode.barcode.data,
          shelf: this.state.shelf,
          warehouse: this.state.warehouse
        },
      };

      this.advancedOverlay
        .setViewForTrackedBarcode(new ARView(props), trackedBarcode)
        .catch(console.warn);
    }
  }

  toggleScan = () => {
    const isScanning = this.barcodeTracking.isEnabled;

    this.barcodeTracking.isEnabled = !isScanning;
    this.camera.switchToDesiredState(isScanning ? FrameSourceState.Off : FrameSourceState.On);
    this.setState({ scanning: this.barcodeTracking.isEnabled });
  };

  render() {
    return (
      <>
        <DataCaptureView style={styles.dataCaptureView} context={this.dataCaptureContext} ref={this.viewRef} />
        <SafeAreaView style={styles.toggleContainer}>
          {this.state.scanning ? <Freeze onPress={this.toggleScan} /> : <Unfreeze onPress={this.toggleScan} />}
        </SafeAreaView>
      </>
    );
  }
}