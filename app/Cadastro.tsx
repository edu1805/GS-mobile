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
import { useTheme } from "../src/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function CheckinScreen() {
  const [mood, setMood] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Mapas de mood e energia com tradução
  const moods = [
    { value: 0, label: t('Checkin.humor_feliz'), emoji: "😊" },
    { value: 1, label: t('Checkin.humor_neutro'), emoji: "😐" },
    { value: 2, label: t('Checkin.humor_triste'), emoji: "😢" },
    { value: 3, label: t('Checkin.humor_estressado'), emoji: "😠" },
  ];

  const energyLevels = [
    { value: 2, label: t('Checkin.energia_baixa'), icon: "🔋" },
    { value: 1, label: t('Checkin.energia_media'), icon: "🔋🔋" },
    { value: 0, label: t('Checkin.energia_alta'), icon: "🔋🔋🔋" },
  ];

  async function handleSubmit() {
    if (mood === null) {
      Alert.alert(
        t('Checkin.alerta_atencao'), 
        t('Checkin.alerta_selecione_humor')
      );
      return;
    }

    if (energyLevel === null) {
      Alert.alert(
        t('Checkin.alerta_atencao'), 
        t('Checkin.alerta_selecione_energia')
      );
      return;
    }

    if (!notes.trim()) {
      Alert.alert(
        t('Checkin.alerta_atencao'), 
        t('Checkin.alerta_observacao_vazia')
      );
      return;
    }

    try {
      setLoading(true);

      const result = await createCheckin(mood, energyLevel, notes);

      if (result.success) {
        Alert.alert(
          t('Checkin.alerta_sucesso_titulo'), 
          t('Checkin.alerta_sucesso_texto'), 
          [
            {
              text: "OK",
              onPress: () => router.replace("/HomeScreen")
            }
          ]
        );
      } else {
        Alert.alert(
          t('Checkin.alerta_erro_titulo'), 
          result.error || t('Checkin.alerta_erro_texto')
        );
      }
    } catch (error) {
      Alert.alert(
        t('Checkin.alerta_erro_titulo'), 
        t('Checkin.alerta_erro_conexao')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('Checkin.titulo')}
        </Text>

        {/* Seleção de Humor */}
        <Text style={[styles.label, { color: colors.text }]}>
          {t('Checkin.label_humor')}
        </Text>
        <View style={styles.optionsContainer}>
          {moods.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.option,
                { backgroundColor: colors.input, borderColor: colors.placeHolderTextColor },
                mood === item.value && styles.optionSelected
              ]}
              onPress={() => setMood(item.value)}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={[
                styles.optionText,
                { color: colors.text },
                mood === item.value && styles.optionTextSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Seleção de Energia */}
        <Text style={[styles.label, { color: colors.text }]}>
          {t('Checkin.label_energia')}
        </Text>
        <View style={styles.optionsContainer}>
          {energyLevels.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.energyOption,
                { backgroundColor: colors.input, borderColor: colors.placeHolderTextColor },
                energyLevel === item.value && styles.optionSelected
              ]}
              onPress={() => setEnergyLevel(item.value)}
            >
              <Text style={styles.energyIcon}>{item.icon}</Text>
              <Text style={[
                styles.optionText,
                { color: colors.text },
                energyLevel === item.value && styles.optionTextSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Observações */}
        <Text style={[styles.label, { color: colors.text }]}>
          {t('Checkin.label_observacoes')}
        </Text>
        <TextInput
          style={[
            styles.textarea, 
            { 
              backgroundColor: colors.input, 
              color: colors.text,
              borderColor: colors.placeHolderTextColor 
            }
          ]}
          placeholder={t('Checkin.placeholder_observacoes')}
          placeholderTextColor={colors.placeHolderTextColor}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Botões */}
        <TouchableOpacity 
          style={[
            styles.button, 
            { backgroundColor: colors.button },
            loading && styles.buttonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            {loading ? t('Checkin.botao_salvando') : t('Checkin.botao_salvar')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.replace("/HomeScreen")}
        >
          <Text style={[styles.cancelButtonText, { color: colors.placeHolderTextColor }]}>
            {t('Checkin.botao_cancelar')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    flex: 1,
    minWidth: "30%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
  },
  energyOption: {
    flex: 1,
    minWidth: "30%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
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
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    minHeight: 100,
    marginTop: 5,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
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
    fontSize: 16,
  },
});