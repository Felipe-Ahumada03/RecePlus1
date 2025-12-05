import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminEditRecipe() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [ingredientes, setIngredientes] = useState(""); // ahora es string completo
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [dificultad, setDificultad] = useState("");

  // Obtener receta por ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`https://receplus-backend-1.onrender.com/api/recipes/${id}`);
        const data = await res.json();

        setTitle(data.title);

        // Convertimos ingredientes a texto plano:
        // Ej: "3 piezas pepino; 2 cucharadas azúcar"
        const ingredientesTexto = data.ingredientes
          ?.map((ing: { cantidad: any; nombre: any; }) => `${ing.cantidad} ${ing.nombre}`)
          .join("; ") || "";

        setIngredientes(ingredientesTexto);

        setInstructions(data.instructions || "");
        setImage(data.image);
        setCategory(data.category);
        setDificultad(data.dificultad);

      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo cargar la receta.");
      }
    };

    fetchRecipe();
  }, [id]);

  // Guardar cambios
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Error", "No se encontró el token de autenticación.");
        return;
      }

      const res = await fetch(
        `https://receplus-backend-1.onrender.com/api/recipes/admin/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            ingredientes, // 🔥 ahora enviamos el texto completo
            instructions,
            image,
            category,
            dificultad,
          }),
        }
      );

      if (res.ok) {
        Alert.alert("Éxito", "Receta actualizada correctamente.");
        router.back();
      } else {
        Alert.alert("Error", "Hubo un problema al actualizar la receta.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Receta</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Ingredientes (formato: "3 piezas pepino; 2 cucharadas azúcar")</Text>
      <TextInput
        style={[styles.input, styles.textAreaSmall]}
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
      />

      <Text style={styles.label}>Instrucciones</Text>
      <TextInput
        style={[styles.input, styles.textAreaLarge]}
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      <Text style={styles.label}>URL de Imagen</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} />

      <Text style={styles.label}>Categoría</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      <Text style={styles.label}>Dificultad</Text>
      <TextInput style={styles.input} value={dificultad} onChangeText={setDificultad} />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  textAreaSmall: {
    height: 90,
    textAlignVertical: "top",
  },
  textAreaLarge: {
    height: 140,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#6b7280",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  backButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
