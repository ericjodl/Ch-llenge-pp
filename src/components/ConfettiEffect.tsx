import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

export interface ConfettiRef {
  fire: () => void;
}

export const ConfettiEffect = forwardRef<ConfettiRef>((_, ref) => {
  const confettiRef = useRef<ConfettiCannon>(null);

  useImperativeHandle(ref, () => ({
    fire: () => {
      confettiRef.current?.start();
    },
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: width / 2, y: -20 }}
        fadeOut
        autoStart={false}
        colors={['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B59B6', '#3498DB']}
        explosionSpeed={350}
        fallSpeed={3000}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});

export default ConfettiEffect;
