import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, StatusBar} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Membership() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {justifyContent: 'flex-start'}]}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/4CAF50/chef-hat.png' }} style={styles.logo} />
          <Text style={styles.logoTitle}>RecePlus</Text>
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
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Búsqueda por ingredientes (limitada)</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Perfil de preferencias básico</Text>
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
          <Text style={styles.planSubtitle}>Para entusiastas de la cocina</Text>
          <Text style={styles.price}>$59.99<Text style={styles.period}>/mes</Text></Text>
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Todo lo del plan gratuito</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Acceso a recetas premium</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Sin publicidad</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Lista de compras inteligente</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeButtonText}>Suscribirse</Text>
          </TouchableOpacity>
        </View>

        {/* Plan Profesional */}
        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Plan Profesional</Text>
          <Text style={styles.planSubtitle}>Para chefs y profesionales</Text>
          <Text style={styles.price}>$99.99<Text style={styles.period}>/mes</Text></Text>
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Todo lo del plan premium</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Acceso a clases de cocina en vivo</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Soporte prioritario</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Calculadora de nutrición avanzada</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeButtonText}>Suscribirse</Text>
          </TouchableOpacity>
        </View>

        {/* Preguntas Frecuentes */}
        <Text style={[styles.title, { marginTop: 30 }]}>Preguntas frecuentes</Text>
        <View style={styles.faqSection}>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Puedo cancelar mi suscripción en cualquier momento?</Text>
            <Text style={styles.faqAnswer}>Sí, puedes cancelar tu suscripción en cualquier momento. La cancelación será efectiva al final del período de facturación actual.</Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Qué métodos de pago aceptan?</Text>
            <Text style={styles.faqAnswer}>Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal y Apple Pay.</Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Hay un período de prueba gratuito?</Text>
            <Text style={styles.faqAnswer}>Sí, ofrecemos un periodo de prueba gratuito de 7 días para los planes Premium y Profesional. Puedes cancelar en cualquier momento durante este período sin cargo alguno.</Text>
          </View>
        </View>

        {/* Sección de bienvenida */}
        <View style={[styles.welcomeSection, { marginTop: 30, marginHorizontal: 20 }]}>
          <Text style={styles.welcomeTitle}>¿Listo para mejorar tu experiencia culinaria?</Text>
          <Text style={styles.welcomeText}>Únete a miles de entusiastas de la cocina que ya disfrutan de nuestras recetas premium y funciones exclusivas.</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => {}}>
            <Text style={styles.startButtonText}>Comenzar ahora</Text>
          </TouchableOpacity>
        </View>

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

      {/* Barra de navegación inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={24} color="#2e7d32" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/recipes')}>
          <Ionicons name="book-outline" size={24} color="#2e7d32" />
          <Text style={styles.navText}>Recetas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/preferences')}>
          <Ionicons name="settings-outline" size={24} color="#2e7d32" />
          <Text style={styles.navText}>Preferencias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/membership')}>
          <Ionicons name="person-outline" size={24} color="#2e7d32" />
          <Text style={styles.navText}>Membresía</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/contact')}>
          <Ionicons name="mail-outline" size={24} color="#2e7d32" />
          <Text style={styles.navText}>Contacto</Text>
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
    paddingTop: 20,
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
    marginHorizontal: 20,
    color: '#2e7d32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 20,
  },
  premiumCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  popularTag: {
    position: 'absolute',
    right: 10,
    top: -12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  planSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },
  period: {
    fontSize: 16,
    color: '#666',
  },
  features: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  disabledFeature: {
    color: '#666',
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqSection: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
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
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20, // Reducido de 32
    paddingBottom: 80, // Reducido de 80
    backgroundColor: '#fff',
    marginTop: 20, // Reducido de 32
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 10, // Reducido de 16
    gap: 10, // Añadido gap específico
    marginHorizontal: 10,
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
    minWidth: 130, // Reducido de 140
    maxWidth: 160, // Reducido de 180
    marginRight: 5, // Reducido de 10
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
