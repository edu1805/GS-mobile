import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { logout, getUser } from '../src/services/auth';
import { useTheme } from '../src/context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Usuario() {
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

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

  const realizarLogoff = async () => {
    Alert.alert(
      t('Usuario.alerta_sair_titulo'),
      t('Usuario.alerta_sair_texto'),
      [
        { 
          text: t('Usuario.alerta_cancelar'), 
          style: "cancel" 
        },
        {
          text: t('Usuario.alerta_sair_confirmar'),
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  const irParaConfiguracoes = () => {
    router.push('/Configuracoes');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>
        {t('Usuario.titulo')}
      </Text>
      
      <View style={[styles.infoBox, { backgroundColor: colors.input }]}>
        <Text style={[styles.label, { color: colors.placeHolderTextColor }]}>
          {t('Usuario.label_username')}
        </Text>
        <Text style={[styles.valor, { color: colors.text }]}>
          {username}
        </Text>
        
        {userId && (
          <>
            <Text style={[styles.label, { marginTop: 15, color: colors.placeHolderTextColor }]}>
              {t('Usuario.label_id')}
            </Text>
            <Text style={[styles.valor, { color: colors.text }]}>
              #{userId}
            </Text>
          </>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: colors.button }]} 
        onPress={irParaConfiguracoes}
      >
        <Text style={[styles.textoBotao, { color: colors.buttonText }]}>
          {t('Usuario.botao_configuracoes')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.botao, { backgroundColor: '#dc2626' }]} 
        onPress={realizarLogoff}
      >
        <Text style={styles.textoBotao}>
          {t('Usuario.botao_sair')}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoBox: {
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
    marginBottom: 5,
  },
  valor: {
    fontSize: 20,
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
    color: '#fff',
  }
});