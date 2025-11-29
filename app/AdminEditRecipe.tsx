import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AdminEditRecipe() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [dificultad, setDificultad] = useState("");

  // Obtener receta por ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://receplus-backend-1.onrender.com/api/recipes/${id}`);
        const data = await res.json();

        setTitle(data.title);
        setIngredientes(data.ingredientes?.join(", ") || "");
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
      const res = await fetch(`http://receplus-backend-1.onrender.com/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          ingredientes: ingredientes.split(",").map(i => i.trim()),
          instructions,
          image,
          category,
          dificultad
        }),
      });

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

      <Text style={styles.label}>Ingredientes (separados por comas)</Text>
      <TextInput
        style={[styles.input, { height: 90 }]}
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
      />

      <Text style={styles.label}>Instrucciones</Text>
      <TextInput
        style={[styles.input, { height: 140 }]}
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
    backgroundColor: "#f0f0f0",
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
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
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
    backgroundColor: "#888",
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
