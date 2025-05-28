import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
          setRecipe(data.meals ? data.meals[0] : null);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <ActivityIndicator style={{marginTop: 40}} size="large" color="#22c55e" />;
  if (!recipe) return <Text style={{margin: 20}}>No se encontró la receta.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Text style={styles.category}>{recipe.strCategory} - {recipe.strArea}</Text>
      <Text style={styles.sectionTitle}>Ingredientes:</Text>
      <View style={styles.ingredientList}>
        {Array.from({length: 20}).map((_, i) => {
          const ingredient = recipe[`strIngredient${i+1}`];
          const measure = recipe[`strMeasure${i+1}`];
          if (ingredient && ingredient.trim()) {
            return (
              <View key={i} style={styles.ingredientRow}>
                <Text style={styles.ingredientBullet}>✔</Text>
                <Text style={styles.ingredientText}>{ingredient} <Text style={styles.ingredientMeasure}>{measure}</Text></Text>
              </View>
            );
          }
          return null;
        })}
      </View>
      <Text style={styles.sectionTitle}>Instrucciones:</Text>
      <View style={styles.instructionsList}>
        {(recipe.strInstructions.split(/\r?\n|\./).filter((p: string) => p.trim().length > 0) as string[]).map((step: string, idx: number) => (
          <View key={idx} style={styles.instructionRow}>
            <View style={styles.instructionNumber}><Text style={styles.instructionNumberText}>{idx+1}</Text></View>
            <Text style={styles.instructionText}>{step.trim()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1 },
  image: { width: '100%', height: 220, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  title: { fontSize: 24, fontWeight: 'bold', margin: 16, color: '#2e7d32' },
  category: { fontSize: 15, color: '#666', marginHorizontal: 16, marginBottom: 10 },
  sectionTitle: { fontWeight: 'bold', fontSize: 17, marginHorizontal: 16, marginTop: 18, marginBottom: 6, color: '#2e7d32' },
  ingredientList: { marginHorizontal: 10, marginBottom: 10 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ingredientBullet: { color: '#22c55e', fontSize: 18, marginRight: 8 },
  ingredientText: { fontSize: 15, color: '#222' },
  ingredientMeasure: { color: '#888', fontSize: 14 },
  instructionsList: { marginHorizontal: 10, marginBottom: 30 },
  instructionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  instructionNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  instructionNumberText: { color: '#22c55e', fontWeight: 'bold', fontSize: 15 },
  instructionText: { flex: 1, fontSize: 15, color: '#444' },
});
