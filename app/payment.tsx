import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentScreen() {
  const handleNavigationChange = async (event: WebViewNavigation) => {
    if (event.url.includes('/success')) {
      const userId = await AsyncStorage.getItem('userId');

      if (userId) {
        await fetch('http://192.168.1.142:5000/api/paypal/set-membership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
      }

      alert('¡Gracias por tu compra! Tu membresía premium está activa.');
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'http://192.168.1.142:5000/api/paypal/pay' }} // Reemplaza esto por la página que contiene el botón de PayPal
        onNavigationStateChange={handleNavigationChange}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
