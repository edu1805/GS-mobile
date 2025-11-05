import { FontAwesome } from '@expo/vector-icons'; 
import { Link, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import api from '../src/services/api';
import { Moto, MotoStatus } from '../src/types/Moto';
import { useTheme } from '../src/context/ThemeContext'; 
import { useTranslation } from 'react-i18next';

//const statusLabels: Record<MotoStatus, string> = {
//  pronta: 'Pronta',
//  revisao: 'Revisão',
//  reservada: 'Reservada',
//  "fora de serviço": 'Fora de serviço'
//};


const statusColors: Record<MotoStatus, string> = {
  pronta: '#4ade80',
  revisao: '#f87171',
  reservada: '#60a5fa',
  "fora de serviço": '#9ca3af'
};

export default function Patio() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { colors, theme, toggleTheme } = useTheme(); // 👈 cores e toggle

  const { t, i18n } = useTranslation();
      
  const alternarIdioma = () => {
    const novoIdioma = i18n.language === 'pt' ? 'es' : 'pt';
    i18n.changeLanguage(novoIdioma);
  };

  const carregarMotos = async () => {
    try {
      const response = await api.get<Moto[]>('/motos');
      setMotos(response.data);
    } catch {
      Alert.alert(t('patio.alerts.error_title'), t('patio.alerts.error_load'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const excluirMoto = async (id: string) => {
    Alert.alert(
      t('patio.alerts.confirm_delete_title'),
      t('patio.alerts.confirm_delete_message'),
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: async () => {
            try {
              await api.delete(`/motos/delete/${id}`);
              setMotos(prev => prev.filter(m => m.id !== id));
              Alert.alert(t('patio.alerts.success_title'), t('patio.alerts.success_delete'));
            } catch {
              Alert.alert(t('patio.alerts.error_title'), t('patio.alerts.error_delete'));
            }
          } 
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      carregarMotos();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarMotos();
  };

  const getStatusLabel = (status: MotoStatus) => {
    // Remove acentos e substitui espaços por underline
    const key = status
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '_')             // Substitui espaços por _
      .toLowerCase();                   // Garante minúsculas
    
    return t(`patio.status.${key}`);
  };

  const getStatusColor = (status: MotoStatus) => statusColors[status] || colors.text;
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.toLocaleDateString('pt-BR')} ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.button} />
          <Text style={[styles.loadingText, { color: colors.text }]}>{t('patio.loading.message')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* 🔄 Botão de idioma */}
      <TouchableOpacity onPress={alternarIdioma} style={styles.languageButton}>
        <Text style={styles.languageText}>
          {i18n.language === 'pt' ? '🇧🇷 PT-BR' : '🇪🇸 ES'}
        </Text>
      </TouchableOpacity>

      {/* Botão de alternar tema */}
      <TouchableOpacity 
        style={[styles.themeButton, { backgroundColor: colors.button }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.themeButtonText, { color: colors.buttonText }]}>
          {theme === 'light' ? t('patio.buttons.theme_dark') : t('patio.buttons.theme_light')}
        </Text>
      </TouchableOpacity>

      <View style={[styles.header, { backgroundColor: colors.button }]}>
        <Text style={[styles.titulo, { color: colors.buttonText }]}>{t('patio.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.buttonText }]}>{t('patio.subtitle', { count: motos.length })}</Text>
        <Link href="/Cadastro" asChild>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.input }]}>
            <Text style={[styles.buttonText, { color: colors.text }]}>{t('patio.buttons.create')}</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {motos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.noMotosText, { color: colors.text }]}>{t('patio.empty.message')}</Text>
          <TouchableOpacity onPress={carregarMotos} style={[styles.retryButton, { backgroundColor: colors.button }]}>
            <Text style={[styles.retryButtonText, { color: colors.buttonText }]}>{t('patio.buttons.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={motos}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: colors.input }]}>
              <FontAwesome 
                name="motorcycle" 
                size={24} 
                color={getStatusColor(item.status)} 
                style={styles.icon} 
              />
              <View style={styles.textContainer}>
                <Text style={[styles.placa, { color: colors.text }]}>{item.placa}</Text>
                <Text style={[styles.posicao, { color: colors.text }]}>{t('patio.labels.position', { position: item.posicao })}</Text>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{t('patio.labels.status', { status: getStatusLabel(item.status) })}</Text>
                <Text style={[styles.data, { color: colors.text }]}>{t('patio.labels.updated', { date: formatarData(item.ultimaAtualizacao) })}</Text>
              </View>
              <TouchableOpacity onPress={() => excluirMoto(item.id)} style={styles.excluirButton}>
                <Text style={styles.excluirText}>{t('patio.buttons.delete')}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <Link href="/HomeScreen" style={[styles.link, { color: colors.button }]}>{t('patio.links.back_menu')}</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  languageButton: { position: 'absolute', top: 30, right: 20, padding: 8, backgroundColor: '#2563eb', borderRadius: 8},
  languageText: { color: '#fff', fontWeight: 'bold'},
  themeButton: { position: 'absolute', top: 25, left: 20, padding: 12, borderRadius: 10, alignItems: 'center' },
  themeButtonText: { fontSize: 16, fontWeight: 'bold' },
  header: { padding: 15, borderRadius: 8, marginBottom: 20, marginTop: 60 ,alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 10 },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  noMotosText: { fontSize: 18, textAlign: 'center', marginBottom: 16 },
  retryButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  retryButtonText: { fontWeight: 'bold' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  icon: { marginRight: 15 },
  textContainer: { flex: 1 },
  placa: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  posicao: { fontSize: 14, marginBottom: 2 },
  status: { fontSize: 14, marginBottom: 2, fontWeight: '500' },
  data: { fontSize: 12, marginTop: 4 },
  footer: { marginTop: 20, alignItems: 'center' },
  link: { fontSize: 16, textDecorationLine: 'underline' },
  excluirButton: { marginLeft: 'auto', backgroundColor: '#ef4444', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  excluirText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});
