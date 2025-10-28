import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { t, i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('@user');
        if (usuarioSalvo) {
          router.push('/');
        }
      } catch (error) {
        console.log("Erro ao verificar login", error);
      }
    };
    verificarUsuarioLogado();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert(t('alerts.warning'), t('alerts.fill_fields'));
      return;
    }

    try {
      setLoading(true);
      console.log('🔐 Tentando login...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      await AsyncStorage.setItem('@user', JSON.stringify(user));

      console.log('✅ Login realizado com sucesso');
      router.push('/HomeScreen');

    } catch (error: any) {
      console.log("Erro no login:", error);
      
      let errorMessage = t('errors.login_failed');

      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          errorMessage = t('errors.invalid_credentials');
          break;
        case 'auth/invalid-email':
          errorMessage = t('errors.invalid_email');
          break;
        case 'auth/user-disabled':
          errorMessage = t('errors.user_disabled');
          break;
        case 'auth/too-many-requests':
          errorMessage = t('errors.too_many_attempts');
          break;
        default:
          errorMessage = error.message || t('errors.unknown');
      }

      Alert.alert(t('alerts.error'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const esqueceuSenha = () => {
    if (!email) {
      Alert.alert(t('alerts.warning'), t('alerts.enter_email_reset'));
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => Alert.alert(t('alerts.success'), t('alerts.email_sent')))
      .catch(() => Alert.alert(t('alerts.error'), t('alerts.email_error')));
  };

  const irParaCadastro = () => {
    router.push('/CadastrarScreen');
  };

  const alternarIdioma = () => {
    const novoIdioma = i18n.language === 'pt' ? 'es' : 'pt';
    i18n.changeLanguage(novoIdioma);
  };

  return (
    <View style={styles.container}>
      {/* 🔄 Botão de idioma */}
      <TouchableOpacity onPress={alternarIdioma} style={styles.languageButton}>
        <Text style={styles.languageText}>
          {i18n.language === 'pt' ? '🇧🇷 PT-BR' : '🇪🇸 ES'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>🏍️ {t("login.title")}</Text>
      <Text style={styles.subtitle}>{t("login.subtitle")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('placeholders.email')}
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder={t('placeholders.password')}
        placeholderTextColor="#999"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
        editable={!loading}
      />

      <TouchableOpacity 
        style={[styles.botao, loading && styles.botaoDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>{t('buttons.login')}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={esqueceuSenha} style={styles.link}>
          <Text style={styles.linkText}>{t('links.forgot_password')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={irParaCadastro} style={styles.link}>
          <Text style={styles.linkText}>{t('links.create_account')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  botao: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  link: {
    padding: 8,
  },
  linkText: {
    color: '#2563eb',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
