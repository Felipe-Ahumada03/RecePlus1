import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        gestureEnabled: false,  // Deshabilita el gesto de retroceso
        gestureDirection: 'horizontal'
      }}
    />
  );
}