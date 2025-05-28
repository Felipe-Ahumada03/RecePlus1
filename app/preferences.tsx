import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, StatusBar, TextInput } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

export default function Preferences() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('notPreferred');
  const [otherFoods, setOtherFoods] = useState('');
  const [otherRestrictions, setOtherRestrictions] = useState('');

  // Estados para checkboxes (tipados)
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedNotPreferred, setSelectedNotPreferred] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedSpicy, setSelectedSpicy] = useState<string>('');

  // Helpers
  const toggleItem = (item: string, selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i: string) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleNavButton = (direction: 'next' | 'prev') => {
    if (activeTab === 'favorites' && direction === 'next') setActiveTab('notPreferred');
    else if (activeTab === 'notPreferred' && direction === 'next') setActiveTab('restrictions');
    else if (activeTab === 'restrictions' && direction === 'next') setActiveTab('favorites');
    else if (activeTab === 'notPreferred' && direction === 'prev') setActiveTab('favorites');
    else if (activeTab === 'restrictions' && direction === 'prev') setActiveTab('notPreferred');
    else if (activeTab === 'favorites' && direction === 'prev') setActiveTab('restrictions');
  };

  const handleFooterNav = (route: string) => {
    router.push(route);
  };

  const renderContent = () => {
    if (activeTab === 'restrictions') {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>¿Tienes alguna restricción dietética?</Text>
          {/* Mostrar seleccionados */}
          {selectedRestrictions.length > 0 && (
            <View style={{marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
              {selectedRestrictions.map(r => (
                <View key={r} style={{backgroundColor:'#e8f5e9', borderRadius:8, padding:6, marginRight:6, marginBottom:4}}><Text style={{color:'#2e7d32'}}>{r}</Text></View>
              ))}
            </View>
          )}
          <View style={styles.checkboxGroup}>
            {['Vegetariano','Vegano','Sin gluten','Sin lactosa','Keto','Paleo'].map(opt => (
              <TouchableOpacity key={opt} style={styles.checkboxItem} onPress={() => toggleItem(opt, selectedRestrictions, setSelectedRestrictions)}>
                <View style={[styles.checkbox, selectedRestrictions.includes(opt) && {backgroundColor:'#2e7d32', borderColor:'#2e7d32'}]} />
                <Text style={styles.checkboxLabel}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>¿Tienes alguna alergia alimentaria?</Text>
          {selectedAllergies.length > 0 && (
            <View style={{marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
              {selectedAllergies.map(r => (
                <View key={r} style={{backgroundColor:'#e8f5e9', borderRadius:8, padding:6, marginRight:6, marginBottom:4}}><Text style={{color:'#2e7d32'}}>{r}</Text></View>
              ))}
            </View>
          )}
          <View style={styles.checkboxGroup}>
            {['Frutos secos','Mariscos','Huevo','Soya','Trigo'].map(opt => (
              <TouchableOpacity key={opt} style={styles.checkboxItem} onPress={() => toggleItem(opt, selectedAllergies, setSelectedAllergies)}>
                <View style={[styles.checkbox, selectedAllergies.includes(opt) && {backgroundColor:'#2e7d32', borderColor:'#2e7d32'}]} />
                <Text style={styles.checkboxLabel}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Otras restricciones o alergias</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Escribe aquí otras restricciones dietéticas o alergias..."
            value={otherRestrictions}
            onChangeText={setOtherRestrictions}
          />

          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.navButton} onPress={() => handleNavButton('prev')}>
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={() => handleNavButton('next')}>
              <Text style={styles.navButtonTextPrimary}>{activeTab === 'restrictions' ? 'Guardar preferencias' : 'Siguiente'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (activeTab === 'notPreferred') {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>¿Qué alimentos no te gustan?</Text>
          {selectedNotPreferred.length > 0 && (
            <View style={{marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
              {selectedNotPreferred.map(r => (
                <View key={r} style={{backgroundColor:'#e8f5e9', borderRadius:8, padding:6, marginRight:6, marginBottom:4}}><Text style={{color:'#2e7d32'}}>{r}</Text></View>
              ))}
            </View>
          )}
          <View style={styles.checkboxGroup}>
            {['Champiñones','Mariscos','Cilantro','Brócoli','Berenjenas','Aceitunas'].map(opt => (
              <TouchableOpacity key={opt} style={styles.checkboxItem} onPress={() => toggleItem(opt, selectedNotPreferred, setSelectedNotPreferred)}>
                <View style={[styles.checkbox, selectedNotPreferred.includes(opt) && {backgroundColor:'#2e7d32', borderColor:'#2e7d32'}]} />
                <Text style={styles.checkboxLabel}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>¿Qué sabores prefieres evitar?</Text>
          {selectedFlavors.length > 0 && (
            <View style={{marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
              {selectedFlavors.map(r => (
                <View key={r} style={{backgroundColor:'#e8f5e9', borderRadius:8, padding:6, marginRight:6, marginBottom:4}}><Text style={{color:'#2e7d32'}}>{r}</Text></View>
              ))}
            </View>
          )}
          <View style={styles.checkboxGroup}>
            {['Amargo','Ácido','Dulce','Muy salado'].map(opt => (
              <TouchableOpacity key={opt} style={styles.checkboxItem} onPress={() => toggleItem(opt, selectedFlavors, setSelectedFlavors)}>
                <View style={[styles.checkbox, selectedFlavors.includes(opt) && {backgroundColor:'#2e7d32', borderColor:'#2e7d32'}]} />
                <Text style={styles.checkboxLabel}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Otros alimentos que no te gustan</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Escribe aquí otros alimentos que no te gustan..."
            value={otherFoods}
            onChangeText={setOtherFoods}
          />

          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.navButton} onPress={() => handleNavButton('prev')}>
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={() => handleNavButton('next')}>
              <Text style={styles.navButtonTextPrimary}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    // Favoritos
    return (
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>¿Cuáles son tus tipos de comida favoritos?</Text>
        {selectedFavorites.length > 0 && (
          <View style={{marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
            {selectedFavorites.map(r => (
              <View key={r} style={{backgroundColor:'#e8f5e9', borderRadius:8, padding:6, marginRight:6, marginBottom:4}}><Text style={{color:'#2e7d32'}}>{r}</Text></View>
            ))}
          </View>
        )}
        <View style={styles.checkboxGroup}>
          {['Italiana','Mexicana','Asiática','Mediterránea','Americana','India'].map(opt => (
            <TouchableOpacity key={opt} style={styles.checkboxItem} onPress={() => toggleItem(opt, selectedFavorites, setSelectedFavorites)}>
              <View style={[styles.checkbox, selectedFavorites.includes(opt) && {backgroundColor:'#2e7d32', borderColor:'#2e7d32'}]} />
              <Text style={styles.checkboxLabel}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>¿Qué ingredientes principales prefieres?</Text>
        {selectedIngredients.length > 0 && (
          <View style={{marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
            {selectedIngredients.map(r => (
              <View key={r} style={{backgroundColor:'#e8f5e9', borderRadius:8, padding:6, marginRight:6, marginBottom:4}}><Text style={{color:'#2e7d32'}}>{r}</Text></View>
            ))}
          </View>
        )}
        <View style={styles.checkboxGroup}>
          {['Pollo','Res','Cerdo','Pescado','Vegetales','Legumbres'].map(opt => (
            <TouchableOpacity key={opt} style={styles.checkboxItem} onPress={() => toggleItem(opt, selectedIngredients, setSelectedIngredients)}>
              <View style={[styles.checkbox, selectedIngredients.includes(opt) && {backgroundColor:'#2e7d32', borderColor:'#2e7d32'}]} />
              <Text style={styles.checkboxLabel}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>¿Qué nivel de picante prefieres?</Text>
        <View style={styles.radioGroup}>
          {['Nada picante','Suave','Medio','Picante','Muy picante'].map(opt => (
            <TouchableOpacity key={opt} style={styles.radioItem} onPress={() => setSelectedSpicy(opt)}>
              <View style={[styles.radioButton, selectedSpicy === opt && styles.radioButtonActive]} />
              <Text style={styles.radioLabel}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={() => handleNavButton('next')}>
          <Text style={styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    );
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
        <Text style={styles.title}>Tus preferencias culinarias</Text>
        <Text style={styles.subtitle}>Cuéntanos sobre tus gustos para personalizar tus recomendaciones de recetas</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'notPreferred' && styles.activeTab]}
            onPress={() => setActiveTab('notPreferred')}
          >
            <Text style={[styles.tabText, activeTab === 'notPreferred' && styles.activeTabText]}>No preferidos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'restrictions' && styles.activeTab]}
            onPress={() => setActiveTab('restrictions')}
          >
            <Text style={[styles.tabText, activeTab === 'restrictions' && styles.activeTabText]}>Restricciones</Text>
          </TouchableOpacity>
        </View>

        {renderContent()}

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
              <TouchableOpacity onPress={() => handleFooterNav('/')}> <Text style={styles.footerLink}>Inicio</Text> </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFooterNav('/recipes')}> <Text style={styles.footerLink}>Recetas</Text> </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFooterNav('/preferences')}> <Text style={styles.footerLink}>Preferencias</Text> </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFooterNav('/membership')}> <Text style={styles.footerLink}>Membresía</Text> </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFooterNav('/contact')}> <Text style={styles.footerLink}>Contacto</Text> </TouchableOpacity>
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

      {/* Barra de navegación inferior */}
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
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/preferences' && styles.activeNavItem]} 
          onPress={() => router.push('/preferences')}
        >
          <Ionicons name="settings-outline" size={24} color={pathname === '/preferences' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/preferences' && styles.activeNavText]}>Preferencias</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, pathname === '/membership' && styles.activeNavItem]} 
          onPress={() => router.push('/membership')}
        >
          <Ionicons name="person-outline" size={24} color={pathname === '/membership' ? '#22c55e' : '#2e7d32'} />
          <Text style={[styles.navText, pathname === '/membership' && styles.activeNavText]}>Membresía</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 80,
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2e7d32',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
  },
  activeTabText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  formContainer: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#444',
  },
  radioGroup: {
    marginBottom: 25,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2e7d32',
    marginRight: 8,
  },
  radioButtonActive: {
    backgroundColor: '#2e7d32',
  },
  radioLabel: {
    fontSize: 14,
    color: '#444',
  },
  nextButton: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  navButton: {
    padding: 12,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  navButtonPrimary: {
    backgroundColor: '#2e7d32',
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
  },
  navButtonText: {
    color: '#2e7d32',
    fontSize: 15,
    fontWeight: '500',
  },
  navButtonTextPrimary: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
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
