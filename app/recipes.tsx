// Página de recetas RecePlus con límite de búsquedas para usuarios FREE

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  Alert
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipo para resultado de recetas
type RecipeResult = {
  _id?: string;
  id?: string;
  name?: string;
  nombre?: string;
  image?: string;
  imagen?: string;
  ingredients?: string[];
  ingredientes?: string[];
  dificultad?: string;
  difficulty?: string;
  title?: string;
  category?: string;
};

export default function Recipes() {
  const pathname = usePathname();
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [ingredientResults, setIngredientResults] = useState<RecipeResult[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Obtener ID del usuario logueado
      const uid = await AsyncStorage.getItem('userId');
      setUserId(uid);

      const status = await AsyncStorage.getItem('isPremium');

      // Si no hay usuario aún, no cargamos nada
      if (!uid) return;

      const storedCount = await AsyncStorage.getItem(`searchCount_${uid}`);

      setIsPremium(status === 'true');
      setSearchCount(storedCount ? parseInt(storedCount) : 0);
    };
    loadData();
  }, []);

  const handleSearch = async () => {
    if (!userId) {
      Alert.alert("Error", "No se encontró el usuario. Inicia sesión nuevamente.");
      return;
    }

    // Limite FREE
    if (!isPremium && searchCount >= 15) {
      Alert.alert(
        "Límite alcanzado",
        "Has usado las 15 búsquedas disponibles en el plan FREE. Actualiza a Premium para seguir buscando recetas.",
        [
          { text: "Ir a Membresía", onPress: () => router.push('/membership') },
          { text: "Cancelar", style: "cancel" }
        ]
      );
      return;
    }

    try {
      const res = await fetch(
        `https://receplus-backend-1.onrender.com/api/recipes/search?ingredient=${ingredientSearch}`
      );
      const data = await res.json();
      setIngredientResults(data);

      // Aumentar contador unicamente en usuarios FREE
      if (!isPremium) {
        const newCount = searchCount + 1;
        setSearchCount(newCount);
        await AsyncStorage.setItem(`searchCount_${userId}`, newCount.toString());
      }
    } catch (err) {
      alert('Error al buscar recetas');
      console.error(err);
    }
  };

  const getDificultadColor = (nivel: string) => {
    switch (nivel?.toLowerCase()) {
      case 'fácil': return '#22c55e';
      case 'medio': return '#facc15';
      case 'difícil': return '#ef4444';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { justifyContent: 'flex-start' }]}>
        <View style={styles.logoContainer}>
          <TouchableOpacity
            onPress={() => router.push('/')}
            activeOpacity={0.8}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }}
              style={styles.logo}
            />
            <Text style={styles.logoTitle}>RecePlus</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.mainTitle}>Explora nuestras recetas</Text>
        <Text style={styles.subtitle}>
          Ingresa uno o más ingredientes separados por coma (,)
        </Text>

        {/* Límite de búsquedas visible */}
        {!isPremium && (
          <Text style={styles.freeLimitText}>
            Búsquedas restantes: {15 - searchCount} / 15
          </Text>
        )}

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ej. pollo, salsa, arroz"
            value={ingredientSearch}
            onChangeText={setIngredientSearch}
          />

          <TouchableOpacity style={styles.searchIconButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Resultados</Text>
        </View>

        {/* Resultados */}
        {ingredientResults.length > 0 ? (
          ingredientResults.map((r: any, index: number) => {
            return (
              <View key={index} style={styles.recipeCard}>
                <Image
                  source={{
                    uri:
                      r.image ||
                      r.imagen ||
                      'https://via.placeholder.com/300x200.png?text=Receta',
                  }}
                  style={styles.recipeImage}
                />

                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>
                    {r.title || r.name || r.nombre || 'Sin nombre'}
                  </Text>

                  {(r.dificultad || r.difficulty) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 5,
                      }}
                    >
                      <Text style={{ color: '#666' }}>
                        {r.category || 'Sin categoría'}
                      </Text>
                      <Text
                        style={{ fontWeight: 'bold', color: getDificultadColor(r.dificultad ?? r.difficulty) }}
                      >
                        {r.dificultad ?? r.difficulty}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.recipeButton}
                    onPress={() =>
                      router.push({
                        pathname: "/RecipeDetail",
                        params: {
                          id: r._id,
                          search: ingredientSearch.split(",").join(",")
                        }
                      })
                    }
                  >
                    <Text style={styles.recipeButtonText}>Ver receta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{ marginHorizontal: 20, color: '#777' }}>
            No se han encontrado recetas aún.
          </Text>
        )}

        {/* Footer */}
                <View style={styles.footer}>
                  <View style={styles.footerContent}>
                    <View style={styles.footerColBrand}>
                      <View style={styles.footerBrandRow}>
                        <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.footerLogo} />
                        <Text style={styles.footerBrand}>RecePlus</Text>
                      </View>
                      <Text style={styles.footerText}>
                        Tu asistente de recetas personalizado para descubrir nuevas delicias culinarias.
                      </Text>
                      <View style={styles.footerSocials}>
                        <Image source={{ uri: 'https://img.icons8.com/ios-filled/24/4CAF50/facebook-new.png' }} style={styles.footerSocialIcon} />
                        <Image source={{ uri: 'https://img.icons8.com/ios-filled/24/4CAF50/instagram-new.png' }} style={styles.footerSocialIcon} />
                        <Image source={{ uri: 'https://img.icons8.com/ios-filled/24/4CAF50/twitter.png' }} style={styles.footerSocialIcon} />
                      </View>
                    </View>
                    <View style={styles.footerCol}>
                      <Text style={styles.footerColTitle}>NAVEGACIÓN</Text>
                      <Text style={styles.footerLink}>Inicio</Text>
                      <Text style={styles.footerLink}>Recetas</Text>
                      <Text style={styles.footerLink}>Preferencias</Text>
                      <Text style={styles.footerLink}>Membresía</Text>
                      <Text style={styles.footerLink}>Contacto</Text>
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
                    <Text style={styles.footerCopyrightText}>
                      © 2025 RecePlus. Todos los derechos reservados.
                    </Text>
                  </View>
                </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, pathname === '/' && styles.activeNavItem]}
          onPress={() => router.replace('/')}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color={pathname === '/' ? '#22c55e' : '#2e7d32'}
          />
          <Text
            style={[
              styles.navText,
              pathname === '/' && styles.activeNavText,
            ]}
          >
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, pathname === '/recipes' && styles.activeNavItem]}
          onPress={() => router.replace('/recipes')}
        >
          <Ionicons
            name="book-outline"
            size={24}
            color={pathname === '/recipes' ? '#22c55e' : '#2e7d32'}
          />
          <Text
            style={[
              styles.navText,
              pathname === '/recipes' && styles.activeNavText,
            ]}
          >
            Recetas
          </Text>
        </TouchableOpacity>

        {isPremium && (
          <TouchableOpacity
            style={[styles.navItem, pathname === '/preferences' && styles.activeNavItem]}
            onPress={() => router.replace('/preferences')}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={pathname === '/preferences' ? '#22c55e' : '#2e7d32'}
            />
            <Text
              style={[
                styles.navText,
                pathname === '/preferences' && styles.activeNavText,
              ]}
            >
              Preferencias
            </Text>
          </TouchableOpacity>
        )}

        {!isPremium && (
          <TouchableOpacity
            style={[styles.navItem, pathname === '/membership' && styles.activeNavItem]}
            onPress={() => router.replace('/membership')}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={pathname === '/membership' ? '#22c55e' : '#2e7d32'}
            />
            <Text
              style={[
                styles.navText,
                pathname === '/membership' && styles.activeNavText,
              ]}
            >
              Membresía
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.navItem, pathname === '/contact' && styles.activeNavItem]}
          onPress={() => router.replace('/contact')}
        >
          <Ionicons
            name="mail-outline"
            size={24}
            color={pathname === '/contact' ? '#22c55e' : '#2e7d32'}
          />
          <Text
            style={[
              styles.navText,
              pathname === '/contact' && styles.activeNavText,
            ]}
          >
            Contacto
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingVertical: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ?? 0) + 10,
    paddingHorizontal: 15,
    paddingBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 32, height: 32, borderRadius: 8 },
  logoTitle: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', marginLeft: 8 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginHorizontal: 20 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20, marginHorizontal: 20 },

  freeLimitText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d32f2f",
    marginHorizontal: 20,
    marginBottom: 10
  },

  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginHorizontal: 20
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 15,
    borderRadius: 8
  },
  searchIconButton: {
    backgroundColor: '#2e7d32',
    marginLeft: 10,
    padding: 10,
    borderRadius: 8
  },

  resultsHeader: { marginHorizontal: 20, marginTop: 10, marginBottom: 10 },
  resultsTitle: { fontSize: 18, fontWeight: 'bold', color: '#444' },

  recipeCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  recipeImage: { width: '100%', height: 180 },
  recipeInfo: { padding: 15 },
  recipeName: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  recipeButton: {
    backgroundColor: '#2e7d32',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  recipeButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 12,
      borderTopWidth: 1,
      paddingBottom: 25,
      borderTopColor: '#ddd'
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#2e7d32' },
  activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#22c55e' },
  activeNavText: { color: '#22c55e', fontWeight: 'bold' },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 32,
    paddingBottom: 80, // Aumentado para dar espacio a la barra de navegación
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 32,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },
  footerColBrand: {
    flex: 1.2,
    minWidth: 180, // Reducido de 200
    maxWidth: 240, // Reducido de 260
    marginRight: 5, // Reducido de 10
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerLogo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  footerBrand: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#22c55e',
  },
  footerText: {
    color: '#444',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 2,
  },
  footerSocials: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 2,
  },
  footerSocialIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  footerCol: {
    flex: 1,
    minWidth: 130, 
    maxWidth: 160, 
    marginRight: 5, 
  },
  footerColTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    color: '#222',
    letterSpacing: 1,
  },
  footerLink: {
    color: '#222',
    fontSize: 14,
    marginBottom: 6,
  },
  footerCopyright: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  footerCopyrightText: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
  },
});
