import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PreferencesScreen() {
  const router = useRouter();
  const pathname = usePathname();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [notPreferred, setNotPreferred] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [otherNotes, setOtherNotes] = useState('');

  const toggle = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetch('http://192.168.1.142:5000/api/preferences/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, favorites, notPreferred, restrictions, allergies, otherNotes })
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Éxito', 'Tus preferencias han sido guardadas.');
        router.replace('/recipes');
      } else {
        Alert.alert('Error', data.message || 'No se pudo guardar.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error de red');
    }
  };

  const renderOptions = (
    title: string,
    options: string[],
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionGroup}>
        {options.map((opt: string) => (
          <TouchableOpacity
            key={opt}
            style={[styles.option, list.includes(opt) && styles.optionSelected]}
            onPress={() => toggle(opt, list, setList)}
          >
            <Text style={[styles.optionText, list.includes(opt) && styles.optionTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={() => router.push('/')} style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.8}>
            <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.logo} />
            <Text style={styles.logoTitle}>RecePlus</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        <Text style={styles.title}>Tus preferencias culinarias</Text>

        {renderOptions('Tipos de comida favoritos', ['Italiana', 'Mexicana', 'Asiática', 'Mediterránea'], favorites, setFavorites)}
        {renderOptions('Alimentos que no te gustan', ['Champiñones', 'Brócoli', 'Cilantro'], notPreferred, setNotPreferred)}
        {renderOptions('Restricciones dietéticas', ['Vegetariano', 'Sin gluten', 'Keto'], restrictions, setRestrictions)}
        {renderOptions('Alergias', ['Frutos secos', 'Mariscos', 'Lácteos'], allergies, setAllergies)}

        <Text style={styles.sectionTitle}>Notas adicionales</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Escribe aquí otras preferencias o notas..."
          value={otherNotes}
          onChangeText={setOtherNotes}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar preferencias</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerColBrand}>
              <View style={styles.footerBrandRow}>
                <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.footerLogo} />
                <Text style={styles.footerBrand}>RecePlus</Text>
              </View>
              <Text style={styles.footerText}>Tu asistente de recetas personalizado para descubrir nuevas delicias culinarias.</Text>
              <View style={styles.footerSocials}>
                <Image source={{ uri: 'https://img.icons8.com/ios-filled/24/4CAF50/facebook-new.png' }} style={styles.footerSocialIcon} />
                <Image source={{ uri: 'https://img.icons8.com/ios-filled/24/4CAF50/instagram-new.png' }} style={styles.footerSocialIcon} />
                <Image source={{ uri: 'https://img.icons8.com/ios-filled/24/4CAF50/twitter.png' }} style={styles.footerSocialIcon} />
              </View>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>NAVEGACIÓN</Text>
              <TouchableOpacity onPress={() => router.push('/')}><Text style={styles.footerLink}>Inicio</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/recipes')}><Text style={styles.footerLink}>Recetas</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/preferences')}><Text style={styles.footerLink}>Preferencias</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/membership')}><Text style={styles.footerLink}>Membresía</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/contact')}><Text style={styles.footerLink}>Contacto</Text></TouchableOpacity>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>LEGAL</Text>
              <Text style={styles.footerLink}>Política de privacidad</Text>
              <Text style={styles.footerLink}>Términos de servicio</Text>
              <Text style={styles.footerLink}>Política de cookies</Text>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>CONTACTO</Text>
              <Text style={styles.footerLink}>Formulario de contacto</Text>
              <Text style={styles.footerLink}>soporte@receplus.com</Text>
              <Text style={styles.footerLink}>+1 (555) 123-4567</Text>
            </View>
          </View>
          <View style={styles.footerCopyright}>
            <Text style={styles.footerCopyrightText}>© 2025 RecePlus. Todos los derechos reservados.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, pathname === '/' && styles.activeNavItem]} onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={24} color={pathname === '/' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/' && styles.activeNavText]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, pathname === '/recipes' && styles.activeNavItem]} onPress={() => router.push('/recipes')}>
          <Ionicons name="book-outline" size={24} color={pathname === '/recipes' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/recipes' && styles.activeNavText]}>Recetas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, pathname === '/preferences' && styles.activeNavItem]} onPress={() => router.push('/preferences')}>
          <Ionicons name="settings-outline" size={24} color={pathname === '/preferences' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/preferences' && styles.activeNavText]}>Preferencias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, pathname === '/membership' && styles.activeNavItem]} onPress={() => router.push('/membership')}>
          <Ionicons name="person-outline" size={24} color={pathname === '/membership' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/membership' && styles.activeNavText]}>Membresía</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, pathname === '/contact' && styles.activeNavItem]} onPress={() => router.push('/contact')}>
          <Ionicons name="mail-outline" size={24} color={pathname === '/contact' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/contact' && styles.activeNavText]}>Contacto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8',
    borderBottomWidth: 1, borderBottomColor: '#ddd',
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ?? 0) + 10,
    paddingHorizontal: 15, paddingBottom: 15,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 32, height: 32, borderRadius: 8 },
  logoTitle: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginLeft: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#2e7d32', textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#222' },
  optionGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  option: { backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 10 },
  optionSelected: { backgroundColor: '#a5d6a7' },
  optionText: { color: '#333' },
  optionTextSelected: { fontWeight: 'bold', color: '#2e7d32' },
  textArea: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, minHeight: 100, textAlignVertical: 'top' },
  saveButton: { marginTop: 20, backgroundColor: '#2e7d32', padding: 14, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee',
    paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 40 : 8,
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 12, color: '#2e7d32', marginTop: 4 },
  activeNavItem: { backgroundColor: '#e8f5e9', borderRadius: 8, padding: 4 },
  activeNavText: { color: '#22c55e', fontWeight: 'bold' },
  footer: {
    borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 32, paddingBottom: 80,
    paddingHorizontal: 10, backgroundColor: '#fff', marginTop: 32,
  },
  footerContent: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    flexWrap: 'wrap', width: '100%', marginBottom: 16, gap: 8,
  },
  footerColBrand: { flex: 1.2, minWidth: 180, maxWidth: 240, marginRight: 5 },
  footerBrandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  footerLogo: { width: 28, height: 28, marginRight: 8 },
  footerBrand: { fontWeight: 'bold', fontSize: 20, color: '#22c55e' },
  footerText: { color: '#444', fontSize: 15, marginBottom: 10, marginTop: 2 },
  footerSocials: { flexDirection: 'row', marginTop: 6, marginBottom: 2 },
  footerSocialIcon: { width: 22, height: 22, marginRight: 10 },
  footerCol: { flex: 1, minWidth: 130, maxWidth: 160, marginRight: 5 },
  footerColTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 8, color: '#222', letterSpacing: 1 },
  footerLink: { color: '#222', fontSize: 14, marginBottom: 6 },
  footerCopyright: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginBottom: 20, alignItems: 'center', marginTop: 8 },
  footerCopyrightText: { color: '#888', fontSize: 13, textAlign: 'center' },
});
