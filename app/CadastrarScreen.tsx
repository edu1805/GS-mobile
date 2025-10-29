import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig'
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../src/context/ThemeContext';

export default function CadastroScreen() {

  const { t, i18n } = useTranslation();

  const alternarIdioma = () => {
    const novoIdioma = i18n.language === 'pt' ? 'es' : 'pt';
    i18n.changeLanguage(novoIdioma);
  };

  // Estados para armazenar os valores digitados
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { theme, toggleTheme, colors } = useTheme();

  const router = useRouter() // Hook para navegação

  // Função para simular o envio do formulário
  const handleCadastro = () => {
    if (!nome || !email || !senha) {
      Alert.alert(t('alerts.warning'), t('alerts.fill_fields'));
      return;
    }
    //Criação do usuário com email e senha
    createUserWithEmailAndPassword(auth, email, senha)
      .then(async(userCredential) => {
        const user = userCredential.user
        console.log(user)
        await AsyncStorage.setItem('@user',JSON.stringify(user))
        Alert.alert(t('register.alertsCreate.sucess_create'))
        router.push("/HomeScreen")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        Alert.alert(t('register.alertsCreate.error_create'))
      });
    }

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* 🔄 Botão de idioma */}
      <TouchableOpacity onPress={alternarIdioma} style={styles.languageButton}>
        <Text style={[styles.languageText, { color: colors.text }]}>
          {i18n.language === 'pt' ? '🇧🇷 PT-BR' : '🇪🇸 ES'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.titulo, { color: colors.text }]}>
        {t('register.title')}
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
        placeholder={t('register.placeholders.name')}
        placeholderTextColor={theme === 'light' ? '#7c7c7c' : '#aaa'}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
        placeholder={t('register.placeholders.email')}
        placeholderTextColor={theme === 'light' ? '#7c7c7c' : '#aaa'}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
        placeholder={t('register.placeholders.password')}
        placeholderTextColor={theme === 'light' ? '#7c7c7c' : '#aaa'}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: colors.button }]} 
        onPress={handleCadastro}
      >
        <Text style={[styles.textoBotao, { color: colors.buttonText }]}>
          {t('register.buttons.register')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.botaoVoltar, { backgroundColor: colors.button }]} 
        onPress={() => router.push('/')}
      >
        <Text style={[styles.textoBotao, { color: colors.buttonText }]}>
          {t('register.buttons.back')}
        </Text>
      </TouchableOpacity>

      {/* 🌙/☀️ Botão de tema */}
      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: colors.button }]} 
        onPress={toggleTheme}
      >
        <Text style={[styles.textoBotao, { color: colors.buttonText }]}>
          {theme === "light" 
            ? t('user.buttons.toggle_theme_light') 
            : t('user.buttons.toggle_theme_dark')}
        </Text>
      </TouchableOpacity>
    </View>
    );
  }

  // Estilização
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#dadadaff',
      justifyContent: 'center',
      padding: 20,
    },
    languageButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      padding: 8,
      backgroundColor: '#2563eb',
      borderRadius: 8,
    },
    languageText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    titulo: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#252525ff',
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#ffffffff',
      color: '#000000ff',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#008d47ff',
    },
    botao: {
      backgroundColor: '#00B37E',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10
    },
    botaoVoltar: {
      backgroundColor: '#0048b3ff',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 10
    },
    textoBotao: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });