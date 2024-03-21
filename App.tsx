import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useState, useEffect } from 'react';

export default function App() {
  return (
    <View style={styles.container}>
      <PedometerView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const PedometerView = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setUTCHours(0, 0, 0, 0); // Start of day

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    //return () => subscription && subscription.remove();
  }, []);

  return (
    <View style={{
                   flexDirection: 'row',
                   height: 100,
                   padding: 20,
                 }}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}{"\n"}</Text>
      <Text>Steps taken today: {pastStepCount}{"\n"}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
    </View>
  );
}