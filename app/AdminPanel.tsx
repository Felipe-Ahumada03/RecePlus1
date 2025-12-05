import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function AdminPanel() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [recetas, setRecetas] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");

  // Dashboard stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    freeUsers: 0,
    premiumUsers: 0,
    totalRecipes: 0,
  });

  // Campos del formulario
  const [title, setTitle] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [dificultad, setDificultad] = useState("");

  // Cargar token almacenado
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("userToken");
      setToken(stored);
    })();
  }, []);

  // Cargar recetas
  const cargarRecetas = async () => {
    try {
      const res = await fetch(
        "https://receplus-backend-1.onrender.com/api/recipes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setRecetas(data);
    } catch (error) {
      console.log("Error al cargar recetas:", error);
    }
  };

  // Cargar estadísticas del dashboard
  const cargarStats = async () => {
    try {
      const res = await fetch(
        "https://receplus-backend-1.onrender.com/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.log("Error al cargar estadísticas:", error);
    }
  };

  useEffect(() => {
    if (token) {
      cargarRecetas();
      cargarStats();
    }
  }, [token]);

  const agregarReceta = async () => {
    if (!title || !ingredientes || !instructions || !image || !category || !dificultad) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    // Convertir ingredientes
    const ingredientesArray = ingredientes
      .split(";")
      .map((i) => i.trim())
      .filter((i) => i.length > 0)
      .map((linea) => {
        const partes = linea.split(" ");
        const cantidad = partes.slice(0, 2).join(" ");
        const nombre = partes.slice(2).join(" ");
        return { nombre, cantidad };
      });

    try {
      const res = await fetch(
        "https://receplus-backend-1.onrender.com/api/recipes/admin/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            ingredientes: ingredientesArray,
            instructions,
            image,
            category,
            dificultad,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Éxito", "Receta agregada correctamente");
        cargarRecetas();
        cargarStats(); // 🔥 Actualiza el dashboard

        setTitle("");
        setIngredientes("");
        setInstructions("");
        setImage("");
        setCategory("");
        setDificultad("");
      } else {
        Alert.alert("Error", data.message || "No se pudo agregar la receta");
      }
    } catch (error) {
      console.log("Error al agregar receta:", error);
    }
  };

  const eliminarReceta = async (id: string) => {
    try {
      await fetch(
        `https://receplus-backend-1.onrender.com/api/recipes/admin/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      cargarRecetas();
      cargarStats(); // 🔥 Actualiza el dashboard
    } catch (error) {
      console.log("Error al eliminar receta:", error);
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("userToken");
    router.replace("/LoginScreen");
  };

  const recetasFiltradas = recetas.filter((r) =>
    r.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Panel de Administración</Text>

        <Pressable style={styles.logoutButton} onPress={cerrarSesion}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </View>

      {/* DASHBOARD */}
      <Text style={styles.sectionTitle}>Dashboard</Text>

      <View style={styles.dashboardRow}>
        <View style={[styles.card, { backgroundColor: "#3b82f6" }]}>
          <Text style={styles.cardLabel}>Usuarios Totales</Text>
          <Text style={styles.cardNumber}>{stats.totalUsers}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#10b981" }]}>
          <Text style={styles.cardLabel}>Usuarios Free</Text>
          <Text style={styles.cardNumber}>{stats.freeUsers}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#a855f7" }]}>
          <Text style={styles.cardLabel}>Premium</Text>
          <Text style={styles.cardNumber}>{stats.premiumUsers}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#f59e0b" }]}>
          <Text style={styles.cardLabel}>Total Recetas</Text>
          <Text style={styles.cardNumber}>{stats.totalRecipes}</Text>
        </View>
      </View>

      {/* FORMULARIO AGREGAR RECETA */}
      <View style={styles.cardForm}>
        <Text style={styles.sectionTitle}>Agregar nueva receta</Text>

        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Ej: '3 piezas pepino; 2 cucharadas azúcar'"
          value={ingredientes}
          onChangeText={setIngredientes}
          multiline
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Instrucciones"
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="URL imagen"
          value={image}
          onChangeText={setImage}
        />

        <TextInput
          style={styles.input}
          placeholder="Categoría"
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          style={styles.input}
          placeholder="Dificultad"
          value={dificultad}
          onChangeText={setDificultad}
        />

        <Pressable style={styles.addButton} onPress={agregarReceta}>
          <Text style={styles.addButtonText}>Agregar receta</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Recetas existentes</Text>

      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar receta..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={recetasFiltradas}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.badge}>{item.category}</Text>
            </View>

            <Text style={styles.subText}>Dificultad: {item.dificultad}</Text>

            <Button
              title="Ver receta"
              color="#3b82f6"
              onPress={() =>
                router.push({
                  pathname: "/AdminRecipesView",
                  params: { id: item._id },
                })
              }
            />

            <Pressable
              style={styles.editButton}
              onPress={() =>
                router.push({
                  pathname: "/AdminEditRecipe",
                  params: { id: item._id },
                })
              }
            >
              <Text style={styles.editText}>Editar</Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => eliminarReceta(item._id)}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 40, backgroundColor: "#f8f9fa", flex: 1 },

  headerRow: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },

  title: { fontSize: 26, fontWeight: "800", color: "#111" },

  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    marginTop: 10,
  },
  logoutText: { color: "white", fontWeight: "700" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1f2937",
  },

  /* DASHBOARD */
  dashboardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  card: {
    width: "48%",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },

  cardLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  cardNumber: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "900",
    marginTop: 5,
  },

  /* FORM */
  cardForm: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  input: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  searchBar: {
    backgroundColor: "#e2e8f0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  addButton: {
    marginTop: 10,
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
  },

  /* LISTA DE RECETAS */
  recipeCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  subText: {
    marginVertical: 8,
    color: "#6b7280",
  },

  badge: {
    backgroundColor: "#3b82f6",
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 12,
  },

  editButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  editText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },

  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },

  deleteText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
});
