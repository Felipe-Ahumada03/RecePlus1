import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, StatusBar, Alert } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function Membership() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('userToken');
      // Verificamos si el usuario ya es premium
      const membership = await AsyncStorage.getItem('isPremium'); 
      setIsLoggedIn(!!token);
      setIsPremium(membership === 'true');
    };
    checkSession();
  }, [pathname]);

  // --- FUNCIÓN DE NAVEGACIÓN SIMPLE ---
  const handleSubscribePress = async () => {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      Alert.alert(
        "Inicia sesión",
        "Debes iniciar sesión para suscribirte.",
        [{ text: "Ir al Login", onPress: () => router.push('/LoginScreen') }, { text: "Cancelar" }]
      );
      return;
    }

    // Si ya está logueado, lo mandamos a la pantalla de pago
    router.push('/payment');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {justifyContent: 'flex-start'}]}>
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={() => router.push('/')} style={{flexDirection:'row',alignItems:'center'}} activeOpacity={0.8}>
            <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.logo} />
            <Text style={styles.logoTitle}>RecePlus</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Planes de membresía</Text>
        <Text style={styles.subtitle}>Elige el plan que mejor se adapte a tus necesidades culinarias</Text>

        {/* Plan Gratuito */}
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Plan Gratuito</Text>
          <Text style={styles.planSubtitle}>Perfecto para empezar</Text>
          <Text style={styles.price}>$0<Text style={styles.period}>/mes</Text></Text>
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Acceso a recetas básicas</Text>
            </View>
            <View style={styles.featureItem}>
               <Ionicons name="close-outline" size={20} color="#666" />
               <Text style={[styles.featureText, styles.disabledFeature]}>Recetas premium</Text>
            </View>
          </View>
        </View>

        {/* Plan Premium */}
        <View style={[styles.planCard, styles.premiumCard]}>
          <View style={styles.popularTag}>
            <Text style={styles.popularText}>Más popular</Text>
          </View>
          <Text style={styles.planTitle}>Plan Premium</Text>
          <Text style={styles.price}>$49.99<Text style={styles.period}>/mes</Text></Text>
          
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Acceso ilimitado</Text>
            </View>
            
            {/* BOTÓN DE SUSCRIPCIÓN CORREGIDO */}
            {!isPremium ? (
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handleSubscribePress}
              >
                <Text style={styles.subscribeButtonText}>Suscribirse Ahora</Text>
              </TouchableOpacity>
            ) : (
              <View style={{marginTop: 10, padding: 10, backgroundColor: '#e8f5e9', borderRadius: 8}}>
                <Text style={{ textAlign: 'center', color: '#2e7d32', fontWeight: 'bold' }}>
                  ¡Ya eres Premium! 🌟
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* FAQ y Footer siguen igual... */}
      </ScrollView>

      {/* Barra de navegación inferior (BottomNav) sigue igual... */}
       <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/' && styles.activeNavItem]} 
          onPress={() => router.push('/')}
        >
          <Ionicons name="home-outline" size={24} color={pathname === '/' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/' && styles.activeNavText]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/recipes' && styles.activeNavItem]} 
          onPress={() => router.push('/recipes')}
        >
          <Ionicons name="book-outline" size={24} color={pathname === '/recipes' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/recipes' && styles.activeNavText]}>Recetas</Text>
        </TouchableOpacity>
        
        {/* Lógica de navegación condicional */}
        {isPremium ? (
          <TouchableOpacity 
            style={[styles.navItem, pathname === '/preferences' && styles.activeNavItem]} 
            onPress={() => router.push('/preferences')}
          >
            <Ionicons name="settings-outline" size={24} color={pathname === '/preferences' ? '#22c55e' : '#2e7d32'} />
            <Text style={[styles.navText, pathname === '/preferences' && styles.activeNavText]}>Preferencias</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.navItem, pathname === '/membership' && styles.activeNavItem]} 
            onPress={() => router.push('/membership')}
          >
            <Ionicons name="person-outline" size={24} color={pathname === '/membership' ? '#22c55e' : '#2e7d32'} />
            <Text style={[styles.navText, pathname === '/membership' && styles.activeNavText]}>Membresía</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/contact' && styles.activeNavItem]} 
          onPress={() => router.push('/contact')}
        >
          <Ionicons name="mail-outline" size={24} color={pathname === '/contact' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/contact' && styles.activeNavText]}>Contacto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Mantén tus estilos igual, son correctos.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ?? 0) + 10, paddingHorizontal: 15, paddingBottom: 15, elevation: 3 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 32, height: 32, borderRadius: 8 },
  logoTitle: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginLeft: 8 },
  title: { fontSize: 28, fontWeight: 'bold', marginHorizontal: 20, color: '#2e7d32', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center', marginHorizontal: 20 },
  planCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: '#eee', marginHorizontal: 20 },
  premiumCard: { borderColor: '#4CAF50', borderWidth: 2 },
  popularTag: { position: 'absolute', right: 10, top: -12, backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  popularText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  planTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  planSubtitle: { fontSize: 14, color: '#666', marginBottom: 15 },
  price: { fontSize: 32, fontWeight: 'bold', color: '#2e7d32', marginBottom: 20 },
  period: { fontSize: 16, color: '#666' },
  features: { marginBottom: 20 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureText: { marginLeft: 10, fontSize: 16, color: '#333' },
  disabledFeature: { color: '#666' },
  subscribeButton: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, alignItems: 'center', marginTop: 10, elevation: 3 },
  subscribeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 8, borderTopWidth: 1, padding: 4, borderTopColor: '#eee', position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: Platform.OS === 'ios' ? 40 : 8 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 13, color: '#2e7d32' },
  activeNavItem: { backgroundColor: '#e8f5e9', borderRadius: 8, padding: 4 },
  activeNavText: { color: '#22c55e', fontWeight: 'bold' },
});