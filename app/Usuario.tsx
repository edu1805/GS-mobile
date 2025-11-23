import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { logout, getUser } from '../src/services/auth';

export default function Usuario() {
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const user = await getUser();
    if (user) {
      setUsername(user.username);
      setUserId(user.id);
    } else {
      router.replace('/');
    }
  }

  // Função para realizar logoff
  const realizarLogoff = async () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  // Função para ir para configurações
  const irParaConfiguracoes = () => {
    router.push('/configuracoes');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil do Usuário</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.label}>Nome de usuário</Text>
        <Text style={styles.valor}>{username}</Text>
        
        {userId && (
          <>
            <Text style={[styles.label, { marginTop: 15 }]}>ID do usuário</Text>
            <Text style={styles.valor}>#{userId}</Text>
          </>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: '#0066FF' }]} 
        onPress={irParaConfiguracoes}
      >
        <Text style={styles.textoBotao}>⚙️ Configurações</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: '#dc2626' }]} 
        onPress={realizarLogoff}
      >
        <Text style={styles.textoBotao}>🚪 Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  valor: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  botao: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  }
});