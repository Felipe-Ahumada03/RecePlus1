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
          {receta.category} <Text style={styles.dot}>•</Text>{" "}
          {receta.dificultad}
        </Text>

        {/* INGREDIENTES */}
        <Text style={styles.section}>Ingredientes</Text>
        <View style={styles.listContainer}>
          {receta.ingredientes?.map((ing: any, index: number) => (
            <Text key={index} style={styles.listItem}>
              • {ing.cantidad} de {ing.nombre}
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
    marginTop: 40,
    backgroundColor: "#eef2f3",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 7,
    width: "100%",
    maxWidth: 420,
  },
  image: {
    width: "100%",
    height: 230,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  dot: {
    color: "#999",
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#19ad4fff",
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 10,
  },
  listContainer: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  backButton: {
    marginTop: 25,
    backgroundColor: "#24c25eff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});
