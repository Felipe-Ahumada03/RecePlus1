import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://receplus-backend-1.onrender.com';

export default function PaymentScreen() {
  const [paypalUrl, setPaypalUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. INICIAR EL PAGO: Pedir al backend que cree la orden
  useEffect(() => {
    const startPayment = async () => {
      try {
        console.log("Iniciando pago...");
        
        // Opcional: Verificar que el usuario esté logueado antes de empezar
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert("Error", "No se encontró sesión de usuario.");
          router.back();
          return;
        }

        // Solicitud al backend
        const response = await fetch(`${API_URL}/api/paypal/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: '49.99' }) // Precio de la suscripción
        });

        const data = await response.json();
        console.log("Orden creada:", data);

        // Buscar el link de aprobación de PayPal
        const approveLink = data.links?.find((link: any) => link.rel === 'approve');

        if (approveLink) {
          setPaypalUrl(approveLink.href);
        } else {
          Alert.alert('Error', 'No se pudo generar el link de pago.');
          router.back();
        }
      } catch (error) {
        console.error('Error de conexión:', error);
        Alert.alert('Error de conexión', 'Verifique que el servidor backend esté corriendo y la IP sea correcta.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    startPayment();
  }, []);

  // 2. VIGILAR EL NAVEGADOR (WebView)
  const handleNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;

    // Si detectamos la URL de retorno falsa, es que el pago fue exitoso en PayPal
    if (url.includes('https://example.com/return')) {
      setPaypalUrl(null); // Ocultar WebView
      setLoading(true);   // Mostrar cargando

      // Extraer el token (orderID) de la URL
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const token = urlParams.get('token');

      if (token) {
        await capturePayment(token);
      } else {
        Alert.alert("Error", "No se recibió el token del pago.");
        router.back();
      }
    }

    // Si el usuario cancela
    if (url.includes('https://example.com/cancel')) {
      Alert.alert('Cancelado', 'Has cancelado el proceso de pago.');
      router.back();
    }
  };

  // 3. CAPTURAR Y CONFIRMAR EL PAGO EN EL BACKEND
  const capturePayment = async (orderID: string) => {
    try {
      // Recuperamos el ID del usuario para enviarlo al backend
      const userId = await AsyncStorage.getItem('userId');

      const response = await fetch(`${API_URL}/api/paypal/capture-order/${orderID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ AQUÍ ENVIAMOS EL USERID PARA QUE EL BACKEND ACTUALICE LA BD
        body: JSON.stringify({ userId: userId }) 
      });
      
      const data = await response.json();

      if (data.status === 'COMPLETED') {
        // Actualizamos el estado local para que la UI cambie inmediatamente
        await AsyncStorage.setItem('isPremium', 'true');
        
        Alert.alert('¡Felicidades!', 'Tu suscripción Premium ha sido activada.', [
          { text: 'Ir a Recetas', onPress: () => router.replace('/recipes') }
        ]);
      } else {
        Alert.alert('Pendiente', 'El pago se realizó pero el estado no es completado.');
        router.back();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un error al confirmar tu suscripción.');
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{marginTop: 20, color: '#666'}}>Conectando con PayPal...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      
      {/* Encabezado con botón de cerrar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pasarela de Pago</Text>
      </View>

      {/* WebView de PayPal */}
      {paypalUrl ? (
        <WebView
          source={{ uri: paypalUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          )}
          style={{ flex: 1 }}
        />
      ) : (
        <View style={styles.center}>
          <Text>Iniciando transacción...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  closeBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333'
  }
});