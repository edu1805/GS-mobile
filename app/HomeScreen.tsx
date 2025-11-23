import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { logout, getUser, getCheckins } from "../src/services/auth";
import api from "../src/services/api";
import React from "react";

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

  // ✅ Nova função para gerar mensagem
  async function gerarMensagem(checkinId: number) {
  try {
    setGeneratingId(checkinId);
    console.log('🤖 Gerando mensagem para check-in:', checkinId);

    const response = await api.post(`/api/checkins/${checkinId}/generate-message`);
    
    console.log('✅ Mensagem gerada:', response.data);

    // ✅ CORREÇÃO: O campo na resposta é "message", não "generatedMessage"
    const mensagemGerada = response.data.message;

    // Atualiza o check-in específico na lista
    setCheckins(prevCheckins =>
      prevCheckins.map(checkin =>
        checkin.id === checkinId
          ? { ...checkin, generatedMessage: mensagemGerada } // ✅ Atualiza com o campo correto
          : checkin
      )
    );

    Alert.alert('Sucesso!', 'Recomendação gerada com sucesso!');

  } catch (error: any) {
    console.log('❌ Erro ao gerar mensagem:', error.response?.data || error.message);
    Alert.alert('Erro', 'Não foi possível gerar a recomendação. Tente novamente.');
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
    const labels: { [key: string]: string } = {
      HAPPY: "Feliz",
      SAD: "Triste",
      NEUTRAL: "Neutro",
      STRESSED: "Estressado",
    };
    return labels[mood] || mood;
  };

  const getEnergyLabel = (energy: string) => {
    const labels: { [key: string]: string } = {
      LOW: "Baixa",
      MEDIUM: "Média",
      HIGH: "Alta",
    };
    return labels[energy] || energy;
  };

  const renderCheckin = ({ item }: { item: Checkin }) => (
    <View style={styles.checkinCard}>
      <View style={styles.checkinHeader}>
        <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
        <View style={styles.checkinInfo}>
          <Text style={styles.mood}>{getMoodLabel(item.mood)}</Text>
          <Text style={styles.energy}>Energia: {getEnergyLabel(item.energyLevel)}</Text>
        </View>
      </View>

      {item.notes && (
        <Text style={styles.notes}>{item.notes}</Text>
      )}

      {/* ✅ Mostra mensagem se existir */}
      {item.generatedMessage ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageTitle}>💡 Recomendação:</Text>
          <Text style={styles.message}>{item.generatedMessage}</Text>
        </View>
      ) : (
        // ✅ Botão para gerar mensagem se não existir
        <TouchableOpacity
          style={[
            styles.generateButton,
            generatingId === item.id && styles.generateButtonDisabled
          ]}
          onPress={() => gerarMensagem(item.id)}
          disabled={generatingId === item.id}
        >
          <Text style={styles.generateButtonText}>
            {generatingId === item.id ? '🤖 Gerando...' : '🤖 Gerar Recomendação'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {username || "usuário"} 👋</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Seus Check-ins</Text>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push("/Cadastro")}
      >
        <Text style={styles.addButtonText}>+ Novo Check-in</Text>
      </TouchableOpacity>

      {checkins.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum check-in registrado ainda.</Text>
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
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#0066FF",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  checkinCard: {
    backgroundColor: "#fff",
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
    color: "#333",
  },
  energy: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  notes: {
    fontSize: 15,
    color: "#444",
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
  // ✅ Novos estilos para o botão de gerar mensagem
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
    color: "#999",
    textAlign: "center",
  },
});