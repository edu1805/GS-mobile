import { FontAwesome } from '@expo/vector-icons'; 
import { Link, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import api from '../src/services/api';
import { Moto, MotoStatus } from '../src/types/Moto';
import { useTheme } from '../src/context/ThemeContext'; // 👈 hook do tema

const statusLabels: Record<MotoStatus, string> = {
  pronta: 'Pronta',
  revisao: 'Revisão',
  reservada: 'Reservada',
  "fora de serviço": 'Fora de serviço'
};

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

  const carregarMotos = async () => {
    try {
      const response = await api.get<Moto[]>('/motos');
      setMotos(response.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as motos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const excluirMoto = async (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta moto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: async () => {
            try {
              await api.delete(`/motos/delete/${id}`);
              setMotos(prev => prev.filter(m => m.id !== id));
              Alert.alert('Sucesso', 'Moto excluída com sucesso!');
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a moto');
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

  const getStatusLabel = (status: MotoStatus) => statusLabels[status] || status;
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
          <Text style={[styles.loadingText, { color: colors.text }]}>Carregando motos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Botão de alternar tema */}
      <TouchableOpacity 
        style={[styles.themeButton, { backgroundColor: colors.button }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.themeButtonText, { color: colors.buttonText }]}>
          {theme === 'light' ? '🌙 Modo Escuro' : '🌞 Modo Claro'}
        </Text>
      </TouchableOpacity>

      <View style={[styles.header, { backgroundColor: colors.button }]}>
        <Text style={[styles.titulo, { color: colors.buttonText }]}>Lista de Motos</Text>
        <Text style={[styles.subtitle, { color: colors.buttonText }]}>Total: {motos.length} motos</Text>
        <Link href="/Cadastro" asChild>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.input }]}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Cadastrar nova moto</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {motos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.noMotosText, { color: colors.text }]}>Nenhuma moto cadastrada.</Text>
          <TouchableOpacity onPress={carregarMotos} style={[styles.retryButton, { backgroundColor: colors.button }]}>
            <Text style={[styles.retryButtonText, { color: colors.buttonText }]}>Tentar novamente</Text>
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
                <Text style={[styles.posicao, { color: colors.text }]}>Posição: {item.posicao}</Text>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>Status: {getStatusLabel(item.status)}</Text>
                <Text style={[styles.data, { color: colors.text }]}>Atualizado: {formatarData(item.ultimaAtualizacao)}</Text>
              </View>
              <TouchableOpacity onPress={() => excluirMoto(item.id)} style={styles.excluirButton}>
                <Text style={styles.excluirText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <Link href="/HomeScreen" style={[styles.link, { color: colors.button }]}>Voltar ao Menu</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { padding: 15, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
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
  themeButton: { padding: 12, borderRadius: 10, marginBottom: 12, alignItems: 'center' },
  themeButtonText: { fontSize: 16, fontWeight: 'bold' },
});
