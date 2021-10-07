import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { height, width } = Dimensions.get('screen');

export default function App() {
  const RoundButton = ({ title, color, onPress }) => {
    return (
      <TouchableOpacity
        style={{
          borderColor: color,
          height: width / 2,
          width: width / 2,
          borderRadius: width / 2,
          borderWidth: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 45, color: color, fontWeight: 'bold' }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 90,
          color: 'white',
          marginTop: 175,
          marginBottom: 20,
        }}
      >
        {'00'}:{'00'}
      </Text>
      <RoundButton title={'Start'} color={'violet'} />
      <RoundButton title={'Reset'} color={'orange'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
});
