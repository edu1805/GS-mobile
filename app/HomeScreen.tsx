import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { logout, getUser, getCheckins } from "../src/services/auth";
import api from "../src/services/api";
import React from "react";
import { useTheme } from "../src/context/ThemeContext";
import { useTranslation } from "react-i18next";

type Checkin = {
  id: number;
  mood: string;
  energyLevel: string;
  notes: string;
  generatedMessage: string | null;
  createdAt: string;
};

export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    setLoading(true);
    
    const user = await getUser();
    if (user) {
      setUsername(user.username);
    } else {
      router.replace("/");
      return;
    }

    const result = await getCheckins();
    if (result.success) {
      setCheckins(result.checkins);
    }
    
    setLoading(false);
  }

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  async function gerarMensagem(checkinId: number) {
    try {
      setGeneratingId(checkinId);
      console.log('🤖 Gerando mensagem para check-in:', checkinId);

      const response = await api.post(`/api/checkins/${checkinId}/generate-message`);
      
      console.log('✅ Mensagem gerada:', response.data);

      const mensagemGerada = response.data.message;

      setCheckins(prevCheckins =>
        prevCheckins.map(checkin =>
          checkin.id === checkinId
            ? { ...checkin, generatedMessage: mensagemGerada }
            : checkin
        )
      );

      Alert.alert(
        t('Home.alerta_sucesso_titulo'),
        t('Home.alerta_sucesso_texto')
      );

    } catch (error: any) {
      console.log('❌ Erro ao gerar mensagem:', error.response?.data || error.message);
      Alert.alert(
        t('Home.alerta_erro_titulo'),
        t('Home.alerta_erro_texto')
      );
    } finally {
      setGeneratingId(null);
    }
  }

  const getMoodEmoji = (mood: string) => {
    const moods: { [key: string]: string } = {
      HAPPY: "😊",
      SAD: "😢",
      NEUTRAL: "😐",
      STRESSED: "😠",
    };
    return moods[mood] || "😐";
  };

  const getMoodLabel = (mood: string) => {
    return t(`Home.humor_${mood.toLowerCase()}`);
  };

  const getEnergyLabel = (energy: string) => {
    return t(`Home.energia_${energy.toLowerCase()}`);
  };

  const renderCheckin = ({ item }: { item: Checkin }) => (
    <View style={[styles.checkinCard, { backgroundColor: colors.input }]}>
      <View style={styles.checkinHeader}>
        <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
        <View style={styles.checkinInfo}>
          <Text style={[styles.mood, { color: colors.text }]}>
            {getMoodLabel(item.mood)}
          </Text>
          <Text style={[styles.energy, { color: colors.placeHolderTextColor }]}>
            {t('Home.label_energia')}: {getEnergyLabel(item.energyLevel)}
          </Text>
        </View>
      </View>

      {item.notes && (
        <Text style={[styles.notes, { color: colors.text }]}>
          {item.notes}
        </Text>
      )}

      {item.generatedMessage ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageTitle}>
            {t('Home.titulo_recomendacao')}
          </Text>
          <Text style={styles.message}>{item.generatedMessage}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.generateButton,
            generatingId === item.id && styles.generateButtonDisabled
          ]}
          onPress={() => gerarMensagem(item.id)}
          disabled={generatingId === item.id}
        >
          <Text style={styles.generateButtonText}>
            {generatingId === item.id 
              ? t('Home.botao_gerando')
              : t('Home.botao_gerar')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.button} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.input }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('Home.saudacao', { username: username || t('Home.usuario_padrao') })}
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('Home.botao_sair')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, { color: colors.text }]}>
        {t('Home.titulo_checkins')}
      </Text>

      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.button }]} 
        onPress={() => router.push("/Cadastro")}
      >
        <Text style={[styles.addButtonText, { color: colors.buttonText }]}>
          {t('Home.botao_novo')}
        </Text>
      </TouchableOpacity>

      {checkins.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.placeHolderTextColor }]}>
            {t('Home.sem_checkins')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={checkins}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCheckin}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    padding: 20,
    paddingBottom: 10,
  },
  addButton: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  checkinCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkinHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  moodEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  checkinInfo: {
    flex: 1,
  },
  mood: {
    fontSize: 18,
    fontWeight: "bold",
  },
  energy: {
    fontSize: 14,
    marginTop: 2,
  },
  notes: {
    fontSize: 15,
    marginTop: 5,
    lineHeight: 20,
  },
  messageBox: {
    backgroundColor: "#e3f2fd",
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  generateButtonDisabled: {
    backgroundColor: "#ccc",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});