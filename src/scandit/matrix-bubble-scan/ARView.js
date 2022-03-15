import React from 'react';
import {
  Text,
  TextInput,
  View,
} from 'react-native';
import { useGlobalContext } from '../../store/context';

import { BarcodeTrackingAdvancedOverlayView } from 'scandit-react-native-datacapture-barcode';

import { styles } from './styles';

export class ARView extends BarcodeTrackingAdvancedOverlayView {

  state = {
    showBarcodeData: false,
    value: 0,
  };

  componentDidMount() {
    console.log()
  };

  render() {
    const { stock } = this.props;
    console.log(stock)
    const { showBarcodeData } = this.state;

    const stockInfo = (
      <View style={styles.toggleContainer}>
        <Text>Barcode: {stock.barcode}</Text>
        <Text>Shelf: {stock.shelf}</Text>
        <Text>Warehouse: {stock.warehouse}</Text>
      </View>
    );

    return (
      <View style={styles.arBubbleContainer}>
        <View style={styles.arBubbleContent}>
          {
            showBarcodeData ?
              <Text style={styles.arBubbleHeader}>
                {BarcodeTrackingAdvancedOverlayView.barcodeData}
              </Text>
              :
              stockInfo
          }
        </View>
      </View>
    );
  };
};
