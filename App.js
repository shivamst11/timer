import React, { useState, useEffect, useRef } from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import { getData, storeData } from './src/Utility/asyncStorage';
const screen = Dimensions.get('window');

const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [remainingSecs, setRemainingSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { mins, secs } = getRemaining(remainingSecs);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
  };

  // timer useEffect
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs((remainingSecs) => remainingSecs + 1);
      }, 1000);
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSecs]);

  // app state to check app is in foreground or background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
      if (appState.current === 'active') {
        readTime();
      } else if (appState.current === 'background') {
        saveTime();
      }
    });
    return () => {
      subscription?.remove();
    };
  });

  //save data
  const saveTime = async () => {
    console.log('saving data');
    await storeData(
      {
        timerTime: remainingSecs,
        currentTime: getTime(),
      },
      'time'
    );
  };

  // read data
  const readTime = async () => {
    const foregroundTime = getTime();
    const data = await getData('time');
    const updatedTime = foregroundTime - data.currentTime + data.timerTime;
    setRemainingSecs(updatedTime);
    setIsActive(true);
  };

  const getTime = () => {
    const minute = moment().minute() * 60;
    const seconds = moment().second();
    return minute + seconds;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
      <TouchableOpacity onPress={toggle} style={styles.button}>
        <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={reset}
        style={[styles.button, styles.buttonReset]}
      >
        <Text style={[styles.buttonText, styles.buttonTextReset]}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07121B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 10,
    borderColor: '#B9AAFF',
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 45,
    color: '#B9AAFF',
  },
  timerText: {
    color: '#fff',
    fontSize: 90,
    marginBottom: 20,
  },
  buttonReset: {
    marginTop: 20,
    borderColor: '#FF851B',
  },
  buttonTextReset: {
    color: '#FF851B',
  },
});
