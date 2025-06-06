import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [receta, setReceta] = useState<any>(null);

  useEffect(() => {
    fetch(`http://192.168.1.142:5000/api/recipes/${id}`)
      .then(res => res.json())
      .then(data => setReceta(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!receta) {
    return <Text style={{ margin: 20 }}>Cargando receta...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.card}>
        <Image
          source={{ uri: receta.image || 'https://via.placeholder.com/300x200.png?text=Receta' }}
          style={styles.image}
        />

        <Text style={styles.title}>{receta.title}</Text>
        <Text style={styles.subtitle}>
          {receta.category} <Text style={styles.dot}>•</Text> {receta.dificultad}
        </Text>

        <Text style={styles.section}>Ingredientes</Text>
        <View style={styles.listContainer}>
          {receta.ingredientes.map((item: string, index: number) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        <Text style={styles.section}>Instrucciones</Text>
        <Text style={styles.text}>{receta.instructions}</Text>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Regresar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    width: '100%',
    maxWidth: 400,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center'
  },
  dot: {
    color: '#ccc',
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 20,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    textAlign: 'center'
  },
  listContainer: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  backButton: {
    marginTop: 30,
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});