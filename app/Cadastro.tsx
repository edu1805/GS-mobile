import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from "react-native";
import { useRouter } from "expo-router";
import { createCheckin } from "../src/services/auth";
import React from "react";

export default function CheckinScreen() {
  const [mood, setMood] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Mapas de mood e energia
  const moods = [
    { value: 0, label: "Feliz", emoji: "😊" },
    { value: 1, label: "Neutro", emoji: "😐" },
    { value: 2, label: "Triste", emoji: "😢" },
    { value: 3, label: "Estressado", emoji: "😠" },
  ];

  const energyLevels = [
    { value: 2, label: "Baixa", icon: "🔋" },
    { value: 1, label: "Média", icon: "🔋🔋" },
    { value: 0, label: "Alta", icon: "🔋🔋🔋" },
  ];

  async function handleSubmit() {
    if (mood === null) {
      Alert.alert("Atenção", "Selecione seu humor");
      return;
    }

    if (energyLevel === null) {
      Alert.alert("Atenção", "Selecione seu nível de energia");
      return;
    }

    if (!notes.trim()) {
      Alert.alert("Atenção", "Adicione uma observação");
      return;
    }

    try {
      setLoading(true);

      const result = await createCheckin(mood, energyLevel, notes);

      if (result.success) {
        Alert.alert("Sucesso!", "Check-in registrado com sucesso", [
          {
            text: "OK",
            onPress: () => router.replace("/HomeScreen")
          }
        ]);
      } else {
        Alert.alert("Erro", result.error || "Erro ao criar check-in");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Como você está se sentindo?</Text>

        {/* Seleção de Humor */}
        <Text style={styles.label}>Humor</Text>
        <View style={styles.optionsContainer}>
          {moods.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.option,
                mood === item.value && styles.optionSelected
              ]}
              onPress={() => setMood(item.value)}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={[
                styles.optionText,
                mood === item.value && styles.optionTextSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Seleção de Energia */}
        <Text style={styles.label}>Nível de Energia</Text>
        <View style={styles.optionsContainer}>
          {energyLevels.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.energyOption,
                energyLevel === item.value && styles.optionSelected
              ]}
              onPress={() => setEnergyLevel(item.value)}
            >
              <Text style={styles.energyIcon}>{item.icon}</Text>
              <Text style={[
                styles.optionText,
                energyLevel === item.value && styles.optionTextSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Observações */}
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Como foi seu dia? O que você está sentindo?"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Botões */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Salvando..." : "Registrar Check-in"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.replace("/HomeScreen")}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
    color: "#333",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  energyOption: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  optionSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
  },
  emoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  energyIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  optionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  textarea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    minHeight: 100,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#0066FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
});