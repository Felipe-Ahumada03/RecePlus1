// Página de recetas RecePlus limpia con buscador activo y footer + navegación

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
  TextInput
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

  useEffect(() => {
      const loadMembership = async () => {
        const status = await AsyncStorage.getItem('isPremium');
        setIsPremium(status === 'true');
      };
      loadMembership();
    }, []);

  const getDificultadColor = (nivel: string) => {
    switch (nivel?.toLowerCase()) {
      case 'fácil': return '#22c55e';
      case 'media': return '#facc15';
      case 'difícil': return '#ef4444';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { justifyContent: 'flex-start' }]}>        
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.logo} />
            <Text style={styles.logoTitle}>RecePlus</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.mainTitle}>Explora nuestras recetas</Text>
        <Text style={styles.subtitle}>Ingresa uno o más ingredientes separados por coma (,) para buscar recetas</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ej. pollo, salsa, arroz"
            value={ingredientSearch}
            onChangeText={setIngredientSearch}
          />
          <TouchableOpacity
            style={styles.searchIconButton}
            onPress={async () => {
              try {
                const res = await fetch(`https://receplus-backend.onrender.com/api/recipes/search?ingredient=${ingredientSearch}`);
                const data = await res.json();
                setIngredientResults(data);
              } catch (err) {
                alert('Error al buscar recetas');
                console.error(err);
              }
            }}
          >
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Resultados</Text>
        </View>

        {ingredientResults.length > 0 ? (
          ingredientResults.map((r: any, index: number) => {
            const ingredientesLista = r.ingredients || r.ingredientes;
            return (
              <View key={index} style={styles.recipeCard}>
                <Image
                  source={{ uri: r.image || r.imagen || 'https://via.placeholder.com/300x200.png?text=Receta' }}
                  style={styles.recipeImage}
                />
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>{r.title || r.name || r.nombre || 'Sin nombre'}</Text>

                  {(r.dificultad || r.difficulty) && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <Text style={{ color: '#666' }}>{r.category || 'Sin categoría'}</Text>
                      <Text style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        {(r?.dificultad ?? r?.difficulty) || 'N/A'}
                      </Text>
                    </View>
                  
                  )}

                  <TouchableOpacity
                    style={styles.recipeButton}
                    onPress={() => router.push({ pathname: '/RecipeDetail', params: { id: r._id || r.id } })}
                  >
                    <Text style={styles.recipeButtonText}>Ver receta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{ marginHorizontal: 20, color: '#777' }}>No se han encontrado recetas aún.</Text>
        )}

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
              <TouchableOpacity onPress={() => router.replace('/')}> 
                <Text style={styles.footerLink}>Inicio</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/recipes')}>
                <Text style={styles.footerLink}>Recetas</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/preferences')}>
                <Text style={styles.footerLink}>Preferencias</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/membership')}>
                <Text style={styles.footerLink}>Membresía</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/contact')}>
                <Text style={styles.footerLink}>Contacto</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>LEGAL</Text>
              <TouchableOpacity onPress={() => router.replace('/privacy')}>
                <Text style={styles.footerLink}>Política de privacidad</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/terms')}>
                <Text style={styles.footerLink}>Términos de servicio</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/cookies')}>
                <Text style={styles.footerLink}>Política de cookies</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>CONTACTO</Text>
              <TouchableOpacity onPress={() => router.replace('/contact')}>
                <Text style={styles.footerLink}>Formulario de contacto</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                if (Platform.OS === 'web') window.location.href = 'mailto:soporte@receplus.com';
              }}>
                <Text style={styles.footerLink}>soporte@receplus.com</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                if (Platform.OS === 'web') window.location.href = 'tel:+15551234567';
              }}>
                <Text style={styles.footerLink}>+1 (555) 123-4567</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.footerCopyright}>
            <Text style={styles.footerCopyrightText}>© 2025 RecePlus. Todos los derechos reservados.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, pathname === '/' && styles.activeNavItem]} onPress={() => router.replace('/')}>
          <Ionicons name="home-outline" size={24} color={pathname === '/' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/' && styles.activeNavText]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, pathname === '/recipes' && styles.activeNavItem]} onPress={() => router.replace('/recipes')}>
          <Ionicons name="book-outline" size={24} color={pathname === '/recipes' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/recipes' && styles.activeNavText]}>Recetas</Text>
        </TouchableOpacity>
        {isPremium && (
        <TouchableOpacity style={[styles.navItem, pathname === '/preferences' && styles.activeNavItem]} onPress={() => router.replace('/preferences')}>
          <Ionicons name="settings-outline" size={24} color={pathname === '/preferences' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/preferences' && styles.activeNavText]}>Preferencias</Text>
        </TouchableOpacity>
        )}
        {!isPremium && (
        <TouchableOpacity style={[styles.navItem, pathname === '/membership' && styles.activeNavItem]} onPress={() => router.replace('/membership')}>
          <Ionicons name="person-outline" size={24} color={pathname === '/membership' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/membership' && styles.activeNavText]}>Membresía</Text>
        </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.navItem, pathname === '/contact' && styles.activeNavItem]} onPress={() => router.replace('/contact')}>
          <Ionicons name="mail-outline" size={24} color={pathname === '/contact' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/contact' && styles.activeNavText]}>Contacto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      paddingVertical: 20,
    },
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
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: 32,
      height: 32,
      borderRadius: 8,
    },
    logoTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#2e7d32',
      marginLeft: 8,
    },
    mainTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      marginHorizontal: 20,
    },
    subtitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 20,
      marginHorizontal: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      marginBottom: 15,
      marginHorizontal: 20,
    },
    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 8,
      marginRight: 10,
    },
    searchIconButton: {
      backgroundColor: '#2e7d32',
      padding: 10,
      borderRadius: 8,
    },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      marginHorizontal: 20,
    },
    resultsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    recipeCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 15,
      marginHorizontal: 20,
    },
    recipeImage: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    recipeInfo: {
      padding: 15,
    },
    recipeName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    recipeSubtitle: {
      color: '#666',
      marginBottom: 5,
    },
    recipeButton: {
      backgroundColor: '#2e7d32',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    recipeButtonText: {
      color: '#fff',
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: '#eee',
      paddingTop: 32,
      paddingBottom: 80,
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
      minWidth: 180,
      maxWidth: 240,
      marginRight: 5,
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
    bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8, // Reducido de 12
    borderTopWidth: 1,
    padding: 4,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 8, // Ajustado para iOS
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 13,
    color: '#2e7d32',
  },
  activeNavItem: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 4,
  },
  activeNavText: {
    color: '#22c55e',
    fontWeight: 'bold',
  }
  });