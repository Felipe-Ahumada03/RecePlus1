import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AdminRecipesView() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [receta, setReceta] = useState<any>(null);

  useEffect(() => {
    const cargarReceta = async () => {
      try {
        const res = await fetch(
          `https://receplus-backend-1.onrender.com/api/recipes/${id}`
        );
        const data = await res.json();
        setReceta(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    if (id) cargarReceta();
  }, [id]);

  if (!receta) {
    return (
      <View style={styles.screen}>
        <Text>Cargando receta...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.card}>
        <Image source={{ uri: receta.image }} style={styles.image} />

        <Text style={styles.title}>{receta.title}</Text>
        <Text style={styles.subtitle}>
          {receta.category} <Text style={styles.dot}>•</Text> {receta.dificultad}
        </Text>

        {/* INGREDIENTES */}
        <Text style={styles.section}>Ingredientes</Text>
        <View style={styles.listContainer}>
          {receta.ingredientes?.map((ing: string, index: number) => (
            <Text key={index} style={styles.listItem}>
              • {ing}
            </Text>
          ))}
        </View>

        {/* INSTRUCCIONES */}
        <Text style={styles.section}>Instrucciones</Text>
        <Text style={styles.text}>{receta.instructions}</Text>

        {/* BOTÓN DE REGRESAR */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Regresar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    marginTop: 45,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    width: "100%",
    maxWidth: 400,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    textAlign: "center",
  },
  dot: {
    color: "#ccc",
  },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 20,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    textAlign: "center",
  },
  listContainer: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 15,
    color: "#444",
    marginBottom: 4,
  },
  backButton: {
    marginTop: 30,
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
