import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import api from '../src/services/api';

export default function CadastroScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { colors } = useTheme();
  const router = useRouter();

  const handleCadastro = async () => {
    // Validações
    if (!username || !password || !confirmPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Atenção', 'O nome de usuário deve ter pelo menos 3 caracteres');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);

      console.log('📝 Criando usuário:', { username });

      const response = await api.post('/auth/register', {
        username: username,
        password: password
      });

      console.log('✅ Usuário criado:', response.data);

      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso! Faça login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/')
          }
        ]
      );

    } catch (error: any) {
      console.log('❌ Erro ao criar conta:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          'Erro ao criar conta. Tente novamente.';
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>
        Criar Conta
      </Text>

      <Text style={[styles.subtitulo, { color: colors.placeHolderTextColor }]}>
        Cadastre-se no WellWork
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
        placeholder="Nome de usuário"
        placeholderTextColor={colors.placeHolderTextColor}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
        placeholder="Senha"
        placeholderTextColor={colors.placeHolderTextColor}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
        placeholder="Confirmar senha"
        placeholderTextColor={colors.placeHolderTextColor}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: colors.button }]} 
        onPress={handleCadastro}
        disabled={loading}
      >
        <Text style={[styles.textoBotao, { color: colors.buttonText }]}>
          {loading ? 'Criando conta...' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botaoVoltar} 
        onPress={() => router.back()}
      >
        <Text style={[styles.textoVoltar, { color: colors.button }]}>
          Já tem uma conta? Faça login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  botao: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  botaoVoltar: {
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  textoVoltar: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});