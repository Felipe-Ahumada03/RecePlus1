import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://192.168.1.142:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('membership');
      
        await AsyncStorage.setItem('userToken', data.token || 'sesion');
        await AsyncStorage.setItem('userId', data.user.id || '');
        await AsyncStorage.setItem('membership', data.user.membership || 'free');
      
        alert('Bienvenido');
        router.replace('/');
      } else {
        console.log('Error en respuesta de login:', data);
        alert(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error de conexión');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => router.push('/')} 
            style={styles.logoLink}
            activeOpacity={1}
          >
            <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.logo} />
            <Text style={styles.brand}>RecePlus</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.main}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.icon} />
          <Text style={styles.title}>Bienvenido de nuevo</Text>
          <Text style={styles.subtitle}>Ingresa tus credenciales para acceder a tu cuenta</Text>
          <View style={styles.formBox}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="nombre@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#bdbdbd"
            />
            <View style={styles.passwordRow}>
              <Text style={styles.label}>Contraseña</Text>
              <TouchableOpacity>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#bdbdbd"
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.replace('/RegisterScreen')}>
                <Text style={styles.registerText}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  logoLink: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 28, height: 28, marginRight: 8 },
  brand: { fontWeight: 'bold', fontSize: 20, color: '#22c55e' },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 20,
  },
  icon: { width: 48, height: 48, marginBottom: 18, marginTop: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 6, textAlign: 'center' },
  subtitle: { color: '#666', fontSize: 15, marginBottom: 18, textAlign: 'center' },
  formBox: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    alignSelf: 'center',
    marginVertical: 20,
  },
  label: { fontWeight: 'bold', color: '#222', marginBottom: 4, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  forgotText: { color: '#22c55e', fontSize: 13 },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  bottomText: { color: '#444', fontSize: 14 },
  registerText: { color: '#22c55e', fontWeight: 'bold', fontSize: 14 },
  scrollView: { flex: 1 },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center' },
});
