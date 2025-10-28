import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { auth } from '../src/services/firebaseConfig';
import { deleteUser } from 'firebase/auth';
import { useTheme } from '../src/context/ThemeContext'; 

export default function Usuario() {
  const [email, setEmail] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
      setNome(user.displayName);
    }
  }, []);

  // Função para realizar logoff
  const realizarLogoff = async () => {
    await AsyncStorage.removeItem('@user');
    router.replace('/');
  };

  // Função para excluir conta
  const excluirConta = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita!",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir", style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await deleteUser(user); // Apaga do Firebase Auth
                await AsyncStorage.removeItem('@user');
                Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.");
                router.replace('/');
              } else {
                Alert.alert("Erro", "Nenhum usuário logado.");
              }
            } catch (error) {
              console.log("Erro ao excluir conta:", error);
              Alert.alert("Erro", "Não foi possível excluir conta.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>👤 Meu Perfil</Text>
      
      <View style={[styles.infoBox, { backgroundColor: colors.input }]}>
        <Text style={[styles.label, { color: colors.text }]}>Conectado com:</Text>
        <Text style={[styles.valor, { color: colors.text }]}>{email}</Text>
      </View>

      {/* Botão de alternar tema */}
      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: colors.button }]} 
        onPress={toggleTheme}
      >
        <Text style={[styles.textoBotao, { color: colors.buttonText }]}>
          Mudar para {theme === "light" ? "🌙 Modo Escuro" : "🌞 Modo Claro"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, { backgroundColor: '#2563eb' }]} onPress={realizarLogoff}>
        <Text style={styles.textoBotao}>Sair da Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, { backgroundColor: '#dc2626' }]} onPress={excluirConta}>
        <Text style={styles.textoBotao}>Excluir Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  valor: {
    fontSize: 18,
    fontWeight: '600',
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
  }
});
