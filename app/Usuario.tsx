import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { auth } from '../src/services/firebaseConfig';
import { deleteUser } from 'firebase/auth';
import { useTheme } from '../src/context/ThemeContext'; 
import { useTranslation } from 'react-i18next';

export default function Usuario() {
  const [email, setEmail] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();

  const { t, i18n } = useTranslation();

  const alternarIdioma = () => {
    const novoIdioma = i18n.language === 'pt' ? 'es' : 'pt';
    i18n.changeLanguage(novoIdioma);
  };

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
    Alert.alert(t('alertsUser.delete_title'),t('alertsuser.delete_message'),
      [
        { text: t('alertsUser.cancel'), style: "cancel" },
        {
          text: t('alertsUser.confirm_delete'), style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await deleteUser(user); // Apaga do Firebase Auth
                await AsyncStorage.removeItem('@user');
                Alert.alert(t('alertsUser.deleted'), t('deleted_message'));
                router.replace('/');
              } else {
                Alert.alert(t('alerts.error'), t('alertsUser.no_user'));
              }
            } catch (error) {
              console.log("Erro ao excluir conta:", error);
              Alert.alert(t('alerts.error'), t('alertsUser.delete_error'));
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* 🔄 Botão de idioma */}
      <TouchableOpacity onPress={alternarIdioma} style={styles.languageButton}>
        <Text style={styles.languageText}>
          {i18n.language === 'pt' ? '🇧🇷 PT-BR' : '🇪🇸 ES'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.titulo, { color: colors.text }]}>{t('user.title')}</Text>
      
      <View style={[styles.infoBox, { backgroundColor: colors.input }]}>
        <Text style={[styles.label, { color: colors.text }]}>{t('user.connected_with')}</Text>
        <Text style={[styles.valor, { color: colors.text }]}>{email}</Text>
      </View>

      {/* Botão de alternar tema */}
      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: colors.button }]} 
        onPress={toggleTheme}
      >
        <Text style={[styles.textoBotao, { color: colors.buttonText }]}>
          {theme === "light" ? 
            t('user.buttons.toggle_theme_light') : t('user.buttons.toggle_theme_dark')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, { backgroundColor: '#2563eb' }]} onPress={realizarLogoff}>
        <Text style={styles.textoBotao}>{t('user.buttons.logout')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, { backgroundColor: '#dc2626' }]} onPress={excluirConta}>
        <Text style={styles.textoBotao}>{t('user.buttons.delete_account')}</Text>
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
