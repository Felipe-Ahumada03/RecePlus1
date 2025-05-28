import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

export default function Payment() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')} style={{flexDirection:'row',alignItems:'center'}}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.logo} />
          <Text style={styles.logoTitle}>RecePlus</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Pago de Membresía</Text>
      <Text style={styles.subtitle}>Completa tu pago para activar tu membresía premium.</Text>
      <View style={styles.paymentBox}>
        <Text style={styles.paymentLabel}>Método de pago</Text>
        <TouchableOpacity style={styles.paymentMethod}>
          <Text style={styles.paymentMethodText}>Tarjeta de crédito/débito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentMethod}>
          <Text style={styles.paymentMethodText}>PayPal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentMethod}>
          <Text style={styles.paymentMethodText}>Stripe</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.payButton} onPress={() => router.push('/') }>
        <Text style={styles.payButtonText}>Pagar y activar membresía</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logo: { width: 32, height: 32, borderRadius: 8 },
  logoTitle: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginLeft: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2e7d32', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 30 },
  paymentBox: { backgroundColor: '#e8f5e9', borderRadius: 10, padding: 20, marginBottom: 30 },
  paymentLabel: { fontWeight: 'bold', fontSize: 16, marginBottom: 12, color: '#2e7d32' },
  paymentMethod: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#22c55e' },
  paymentMethodText: { color: '#2e7d32', fontSize: 15 },
  payButton: { backgroundColor: '#22c55e', borderRadius: 8, padding: 16, alignItems: 'center' },
  payButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
