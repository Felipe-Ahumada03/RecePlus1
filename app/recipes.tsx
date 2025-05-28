import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, StatusBar, TextInput } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Recipes() {
  const pathname = usePathname();
  const [searchType, setSearchType] = useState('recipes'); // 'recipes' o 'ingredients'
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [decisionStep, setDecisionStep] = useState(0);
  const [decisionAnswers, setDecisionAnswers] = useState<any>({});
  const [showDecisionSearch, setShowDecisionSearch] = useState(false);

  // Estado para recomendaciones
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Árbol de decisión simple para ejemplo
  const decisionTree = [
    {
      question: '¿Qué ingrediente principal quieres?',
      key: 'ingrediente',
      options: ['Pollo', 'Pasta', 'Atún'],
    },
    {
      question: '¿Qué dificultad prefieres?',
      key: 'dificultad',
      options: ['Fácil', 'Media'],
    },
    {
      question: '¿Qué tipo de comida buscas?',
      key: 'categoria',
      options: ['Italiana', 'Mexicana', 'Mediterránea'],
    },
  ];

  // Recetas de ejemplo (puedes reemplazar por tus datos reales)
  const allRecipes = [
    {
      nombre: 'Pasta Carbonara',
      ingrediente: 'Pasta',
      dificultad: 'Fácil',
      categoria: 'Italiana',
    },
    {
      nombre: 'Tacos de Pollo',
      ingrediente: 'Pollo',
      dificultad: 'Media',
      categoria: 'Mexicana',
    },
    {
      nombre: 'Ensalada Mediterránea',
      ingrediente: 'Atún',
      dificultad: 'Fácil',
      categoria: 'Mediterránea',
    },
  ];

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then(res => res.json())
      .then(data => {
        setRecipes(data.meals || []);
        setLoading(false);
      });
  }, []);

  const filteredRecipes = allRecipes.filter(r => {
    return Object.entries(decisionAnswers).every(([k, v]) => (r as any)[k] === v);
  });

  const renderDecisionSearch = () => {
    if (decisionStep < decisionTree.length) {
      const step = decisionTree[decisionStep];
      return (
        <View style={{margin: 20, backgroundColor: '#e8f5e9', borderRadius: 10, padding: 16}}>
          <Text style={{fontWeight: 'bold', marginBottom: 10}}>{step.question}</Text>
          {step.options.map(opt => (
            <TouchableOpacity
              key={opt}
              style={{backgroundColor: '#2e7d32', borderRadius: 8, padding: 10, marginBottom: 8}}
              onPress={() => {
                setDecisionAnswers({ ...decisionAnswers, [step.key]: opt });
                setDecisionStep(decisionStep + 1);
              }}
            >
              <Text style={{color: '#fff'}}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return (
        <View style={{margin: 20, backgroundColor: '#e8f5e9', borderRadius: 10, padding: 16}}>
          <Text style={{fontWeight: 'bold', marginBottom: 10}}>Recetas sugeridas:</Text>
          {filteredRecipes.length === 0 && <Text>No se encontraron recetas.</Text>}
          {filteredRecipes.map(r => (
            <Text key={r.nombre} style={{marginBottom: 6}}>{r.nombre} ({r.categoria}, {r.dificultad})</Text>
          ))}
          <TouchableOpacity style={{marginTop: 10}} onPress={() => {
            setDecisionStep(0);
            setDecisionAnswers({});
            setShowDecisionSearch(false);
          }}>
            <Text style={{color: '#2e7d32'}}>Volver</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderSearchContent = () => {
    if (searchType === 'ingredients') {
      return (
        <View>
          <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchInput}
              placeholder="Escribe tus ingredientes..."
            />
            <TouchableOpacity style={styles.searchIconButton}>
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.commonIngredients}>
            <TouchableOpacity style={styles.ingredientChip}>
              <Text style={styles.ingredientChipText}>Pollo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ingredientChip}>
              <Text style={styles.ingredientChipText}>Pasta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ingredientChip}>
              <Text style={styles.ingredientChipText}>Arroz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ingredientChip}>
              <Text style={styles.ingredientChipText}>Tomate</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
    
    return (
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Buscar recetas, categorías..."
        />
        <TouchableOpacity style={styles.searchIconButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  // Actualiza recomendaciones cada vez que el usuario hace una búsqueda guiada
  useEffect(() => {
    if (!showDecisionSearch && Object.keys(decisionAnswers).length > 0) {
      // Recomienda recetas similares a la última búsqueda guiada
      const similar = allRecipes.filter(r => {
        // Coincidencia parcial: al menos 1 respuesta igual
        return Object.entries(decisionAnswers).some(([k, v]) => (r as any)[k] === v);
      });
      setRecommendations(similar);
    }
  }, [showDecisionSearch, decisionAnswers]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {justifyContent: 'flex-start'}]}>
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8} style={{flexDirection:'row',alignItems:'center'}}>
            <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.logo} />
            <Text style={styles.logoTitle}>RecePlus</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.mainTitle}>Explora nuestras recetas</Text>
        <Text style={styles.subtitle}>Descubre deliciosas recetas o busca por ingredientes que tengas disponibles</Text>
        
        <View style={styles.searchOptions}>
          <TouchableOpacity 
            style={[
              styles.searchButton,
              searchType === 'recipes' && styles.searchButtonActive
            ]}
            onPress={() => setSearchType('recipes')}
          >
            <Text style={[
              styles.searchButtonText,
              searchType === 'recipes' && styles.searchButtonTextActive
            ]}>Buscar recetas</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.searchButton,
              searchType === 'ingredients' && styles.searchButtonActive
            ]}
            onPress={() => setSearchType('ingredients')}
          >
            <Text style={[
              styles.searchButtonText,
              searchType === 'ingredients' && styles.searchButtonTextActive
            ]}>Buscar por ingredientes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.searchButton,
              showDecisionSearch && styles.searchButtonActive
            ]}
            onPress={() => {
              setShowDecisionSearch(true);
              setDecisionStep(0);
              setDecisionAnswers({});
            }}
          >
            <Text style={[
              styles.searchButtonText,
              showDecisionSearch && styles.searchButtonTextActive
            ]}>Búsqueda guiada</Text>
          </TouchableOpacity>
        </View>

        {showDecisionSearch && renderDecisionSearch()}

        {/* Recomendaciones personalizadas */}
        {recommendations.length > 0 && !showDecisionSearch && (
          <View style={{marginHorizontal: 20, marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#2e7d32'}}>Recomendaciones para ti</Text>
            {recommendations.map(r => (
              <View key={r.nombre} style={{marginBottom: 8}}>
                <Text>{r.nombre} ({r.categoria}, {r.dificultad})</Text>
              </View>
            ))}
          </View>
        )}

        {searchType === 'recipes' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
            <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>Italiana</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>Mexicana</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>Mediterránea</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tagButton}><Text style={styles.tagText}>Asiática</Text></TouchableOpacity>
          </ScrollView>
        )}

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Resultados</Text>
        </View>

        {loading ? (
          <Text style={{margin: 20}}>Cargando recetas...</Text>
        ) : (
          recipes.map((r: any) => (
            <View key={r.idMeal} style={styles.recipeCard}>
              <Image source={{ uri: r.strMealThumb }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{r.strMeal}</Text>
                <Text style={styles.recipeSubtitle}>{r.strCategory}</Text>
                <Text style={styles.recipeDescription}>{r.strArea}</Text>
                <TouchableOpacity style={styles.recipeButton} onPress={() => router.push({ pathname: '/RecipeDetail', params: { id: r.idMeal } })}>
                  <Text style={styles.recipeButtonText}>Ver receta</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
                          // Abrir mail
                          if (Platform.OS === 'web') {
                            window.location.href = 'mailto:soporte@receplus.com';
                          }
                        }}>
                          <Text style={styles.footerLink}>soporte@receplus.com</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          // Abrir teléfono
                          if (Platform.OS === 'web') {
                            window.location.href = 'tel:+15551234567';
                          }
                        }}>
                          <Text style={styles.footerLink}>+1 (555) 123-4567</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.footerCopyright}>
                      <Text style={styles.footerCopyrightText}>
                        © 2025 RecePlus. Todos los derechos reservados.
                      </Text>
                    </View>
                  </View>
      </ScrollView>
      {/* Barra de navegación inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/' && styles.activeNavItem]} 
          onPress={() => router.replace('/')}
        >
          <Ionicons name="home-outline" size={24} color={pathname === '/' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/' && styles.activeNavText]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/recipes' && styles.activeNavItem]} 
          onPress={() => router.replace('/recipes')}
        >
          <Ionicons name="book-outline" size={24} color={pathname === '/recipes' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/recipes' && styles.activeNavText]}>Recetas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/dashboard' && styles.activeNavItem]} 
          onPress={() => router.replace('/dashboard')}
        >
          <Ionicons name="bar-chart-outline" size={24} color={pathname === '/dashboard' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/dashboard' && styles.activeNavText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/preferences' && styles.activeNavItem]} 
          onPress={() => router.replace('/preferences')}
        >
          <Ionicons name="settings-outline" size={24} color={pathname === '/preferences' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/preferences' && styles.activeNavText]}>Preferencias</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/membership' && styles.activeNavItem]} 
          onPress={() => router.replace('/membership')}
        >
          <Ionicons name="person-outline" size={24} color={pathname === '/membership' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/membership' && styles.activeNavText]}>Membresía</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/contact' && styles.activeNavItem]} 
          onPress={() => router.replace('/contact')}
        >
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 40 : 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#2e7d32',
    marginTop: 4,
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
  searchOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
    gap: 10,
  },
  searchButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    minWidth: 120,
    alignItems: 'center',
  },
  searchButtonActive: {
    backgroundColor: '#2e7d32',
  },
  searchButtonText: {
    fontSize: 13,
    color: '#666',
  },
  searchButtonTextActive: {
    color: '#fff',
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
  tagsScroll: {
    marginBottom: 15,
    marginHorizontal: 20,
  },
  tagButton: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  tagText: {
    color: '#2e7d32',
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
  recipeDescription: {
    color: '#444',
    marginBottom: 10,
  },
  recipeMetadata: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  metaItem: {
    marginRight: 15,
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

  // Estilos del Footer agrupados
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

  ingredientsSearch: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 15,
  },
  selectedIngredientsScroll: {
    flexGrow: 0,
  },
  selectedIngredient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
  },
  selectedIngredientText: {
    color: '#2e7d32',
    marginRight: 5,
  },
  ingredientInput: {
    flex: 1,
    minWidth: 150,
  },
  commonIngredients: {
    marginBottom: 12,
    marginHorizontal: 20,
  },
  ingredientChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  ingredientChipText: {
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
