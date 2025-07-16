import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useBrainyPocketsIntro() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('brainyPocketsSeen');
      setShowIntro(seen !== 'true');
    })();
  }, []);

  const markSeen = async () => {
    await AsyncStorage.setItem('brainyPocketsSeen', 'true');
    setShowIntro(false);
  };

  return { showIntro, markSeen };
}
