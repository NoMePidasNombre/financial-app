import React from 'react';
import { Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

// Imagen de cerebro outline, inclinada 45° y responsiva
export default function BrainBackground() {
  // Hacemos la imagen más grande que la pantalla
  const imgWidth = width * 1.3;
  const imgHeight = height * 1.3;
  // Centramos la imagen
  const offsetX = -(imgWidth - width) / 2;
  const offsetY = -(imgHeight - height) / 2;

  return (
    <Image
      source={require('../assets/brain-outline.png')}
      style={{
        position: 'absolute',
        left: offsetX,
        top: offsetY,
        width: imgWidth,
        height: imgHeight,
        zIndex: 0,
        opacity: 0.13,
        transform: [{ rotate: '45deg' }],
        resizeMode: 'contain',
      }}
    />
  );
}
