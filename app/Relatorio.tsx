import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Moto, MotoStatus } from '../src/types/Moto';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import api from '../src/services/api';
import { useTheme } from '../src/context/ThemeContext'; 

const statusLabels: Record<MotoStatus, string> = {
  pronta: 'Pronta',
  revisao: 'Revisão',
  reservada: 'Reservada',
  "fora de serviço": 'Fora de serviço'
};

export default function Relatorio() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { colors, theme, toggleTheme } = useTheme(); 

  const carregarMotos = async () => {
    try {
      const response = await api.get<Moto[]>('/motos');
      setMotos(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as motos para o relatório');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

  const motosPorStatus = (status: MotoStatus) => motos.filter((moto) => moto.status === status);

  const totaisPorStatus = Object.keys(statusLabels).reduce((acc, statusKey) => {
    const status = statusKey as MotoStatus;
    acc[status] = motosPorStatus(status).length;
    return acc;
  }, {} as Record<MotoStatus, number>);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.button} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Carregando relatório...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Botão de alternar tema */}
      <TouchableOpacity 
        style={[styles.themeButton, { backgroundColor: colors.button }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.themeButtonText, { color: colors.buttonText }]}>
          {theme === 'light' ? '🌙 Modo Escuro' : '🌞 Modo Claro'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>📊 Relatório de Motos por Status</Text>

      {/* Card de totais */}
      <View style={[styles.totalBox, { backgroundColor: colors.input, borderLeftColor: colors.button }]}>
        <Text style={[styles.totalText, { color: colors.text }]}>
          Total de motos cadastradas: {motos.length}
        </Text>
        <View style={styles.totaisContainer}>
          {Object.keys(statusLabels).map((statusKey) => {
            const status = statusKey as MotoStatus;
            return (
              <Text key={status} style={[styles.totalStatus, { color: colors.text, backgroundColor: colors.button }]}>
                {statusLabels[status]}: {totaisPorStatus[status]}
              </Text>
            );
          })}
        </View>
      </View>

      {/* Lista por status */}
      <FlatList
        data={Object.keys(statusLabels)}
        keyExtractor={(statusKey) => statusKey}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item: statusKey }) => {
          const status = statusKey as MotoStatus;
          const motosFiltradas = motosPorStatus(status);

          if (motosFiltradas.length === 0) return null;

          return (
            <View style={[styles.section, { backgroundColor: colors.input }]}>
              <Text style={[styles.statusTitle, { color: colors.text }]}>
                {statusLabels[status]}: {motosFiltradas.length}
              </Text>
              <View style={styles.motosList}>
                {motosFiltradas.map((moto) => (
                  <View key={moto.id} style={[styles.motoItem, { backgroundColor: colors.background, borderLeftColor: colors.button }]}>
                    <Text style={[styles.motoPlaca, { color: colors.text }]}>{moto.placa}</Text>
                    <Text style={[styles.motoPosicao, { color: colors.text }]}>Posição: {moto.posicao}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>Nenhuma moto cadastrada</Text>
            <TouchableOpacity onPress={carregarMotos} style={[styles.retryButton, { backgroundColor: colors.button }]}>
              <Text style={[styles.retryButtonText, { color: colors.buttonText }]}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.button }]} onPress={() => router.push('/HomeScreen')}>
        <Text style={[styles.addButtonText, { color: colors.buttonText }]}>Voltar ao menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  themeButton: { padding: 12, borderRadius: 10, marginBottom: 12, alignItems: 'center' },
  themeButtonText: { fontSize: 16, fontWeight: 'bold' },
  totalBox: { marginBottom: 20, padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  totalText: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  totaisContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  totalStatus: { fontSize: 14, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  section: { marginBottom: 20, padding: 16, borderRadius: 12, elevation: 2 },
  statusTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, borderBottomWidth: 1, paddingBottom: 8 },
  motosList: { gap: 8 },
  motoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, borderLeftWidth: 3 },
  motoPlaca: { fontSize: 16, fontWeight: 'bold' },
  motoPosicao: { fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, textAlign: 'center', marginBottom: 16 },
  retryButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  retryButtonText: { fontWeight: 'bold' },
  addButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginTop: 20, alignSelf: 'center' },
  addButtonText: { fontWeight: 'bold', fontSize: 16 }
});
