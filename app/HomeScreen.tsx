import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router"; // ✅ Adicione useFocusEffect
import { logout, getUser, getCheckins } from "../src/services/auth";
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
  const router = useRouter();

  // ✅ Substituir useEffect por useFocusEffect
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    setLoading(true);
    
    // Carrega usuário
    const user = await getUser();
    if (user) {
      setUsername(user.username);
    } else {
      router.replace("/");
      return;
    }

    // Carrega check-ins
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

  // Tradução dos valores
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

      {item.generatedMessage && (
        <View style={styles.messageBox}>
          <Text style={styles.messageTitle}>💡 Recomendação:</Text>
          <Text style={styles.message}>{item.generatedMessage}</Text>
        </View>
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

      {/* ✅ Botão para adicionar check-in */}
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
  // ✅ Novo estilo para o botão
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