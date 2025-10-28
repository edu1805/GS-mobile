import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router'; // Adicione useFocusEffect
import React, { useState, useEffect, useCallback } from 'react'; // Adicione useCallback
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Moto, MotoStatus } from '../src/types/Moto';
import api from '../src/services/api';

const statusColors: Record<MotoStatus, string> = {
  pronta: '#4ade80',
  revisao: '#f87171',
  reservada: '#60a5fa',
  "fora de serviço": '#9ca3af'
};

const statusLabels: Record<MotoStatus, string> = {
  pronta: 'Pronta',
  revisao: 'Revisão',
  reservada: 'Reservada',
  "fora de serviço": 'fora de serviço'
};

const PatioGrid: React.FC = () => {
  const router = useRouter();

  const [motos, setMotos] = useState<Moto[]>([]);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [novaPosicao, setNovaPosicao] = useState('');
  const [updating, setUpdating] = useState(false);

  // Buscar motos da API
  const fetchMotos = async () => {
    try {
      console.log('🔄 Buscando motos da API...');
      const response = await api.get<Moto[]>('/motos');
      console.log('✅ Dados recebidos:', response.data.length, 'motos');
      setMotos(response.data);
    } catch (error) {
      console.error('❌ Erro ao carregar motos:', error);
      Alert.alert('Erro', 'Não foi possível carregar as motos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar motos quando o componente montar
  useEffect(() => {
    fetchMotos();
  }, []);

  // Recarregar motos quando a tela receber foco (após cadastro)
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Tela em foco - recarregando dados...');
      fetchMotos();
    }, [])
  );

  const handlePress = (moto: Moto) => {
    setSelectedMoto(moto);
    setNovaPosicao(moto.posicao);
    setModalVisible(true);
  };

  const handleStatusChange = async (newStatus: MotoStatus) => {
    if (!selectedMoto) return;

    try {
      setUpdating(true);
      
      // Atualizar status na API
      const response = await api.put(`/motos/editar/${selectedMoto.id}`, {
        status: newStatus,
        posicao: novaPosicao
      });

      // Atualizar lista local
      setMotos(prevMotos => 
        prevMotos.map(moto => 
          moto.id === selectedMoto.id 
            ? {
                ...moto,
                status: newStatus,
                posicao: novaPosicao,
                ultimaAtualizacao: response.data.ultimaAtualizacao || new Date().toISOString()
              }
            : moto
        )
      );

      setModalVisible(false);
      setNovaPosicao('');

      Alert.alert('Sucesso', 
        `Moto ${selectedMoto.placa} atualizada!\nStatus: ${statusLabels[newStatus]}\nPosição: ${novaPosicao}`
      );
    } catch (error) {
      console.error('Erro ao atualizar moto:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a moto');
    } finally {
      setUpdating(false);
    }
  };

  // Função para recarregar os dados
  const onRefresh = () => {
    setRefreshing(true);
    fetchMotos();
  };

  console.log('📊 Estado das motos:', motos.length, 'motos');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando motos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Dashboard de Motos</Text>
      <Text style={styles.subtitle}>Total: {motos.length} motos</Text>

      <FlatList
        data={motos}
        keyExtractor={(item) => item.id}
        numColumns={4}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma moto encontrada</Text>
            <TouchableOpacity onPress={fetchMotos} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.motoBox,
              { borderColor: statusColors[item.status] }
            ]}
            onPress={() => handlePress(item)}
          >
            <FontAwesome name="motorcycle" size={20} color="#1f2937" />
            <Text style={styles.placa}>{item.placa}</Text>
            <Text style={styles.posicao}>{item.posicao}</Text>
            <View style={[styles.statusIndicator, { backgroundColor: statusColors[item.status] }]} />
          </Pressable>
        )}
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/Cadastro')}>
          <Text style={styles.addButtonText}>+ Nova Moto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/Patio')}>
          <Text style={styles.addButtonText}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => !updating && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Moto</Text>

            {/* Informações da moto */}
            <View style={styles.motoInfo}>
              <Text style={styles.motoPlaca}>Placa: {selectedMoto?.placa}</Text>
              <Text style={styles.motoStatus}>
                Status atual: {selectedMoto && statusLabels[selectedMoto.status]}
              </Text>
            </View>

            {/* Campo para nova posição */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nova Posição:</Text>
              <TextInput
                style={styles.textInput}
                value={novaPosicao}
                onChangeText={setNovaPosicao}
                placeholder="Ex: A1, B2, C3..."
                placeholderTextColor="#9ca3af"
                editable={!updating}
              />
            </View>

            <Text style={styles.sectionTitle}>Alterar Status:</Text>

            {updating ? (
              <View style={styles.updatingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.updatingText}>Atualizando...</Text>
              </View>
            ) : (
              <>
                {Object.keys(statusLabels).map((statusKey) => {
                  const status = statusKey as MotoStatus;
                  return (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        { 
                          borderColor: statusColors[status],
                          backgroundColor: selectedMoto?.status === status ? `${statusColors[status]}20` : 'transparent'
                        }
                      ]}
                      onPress={() => handleStatusChange(status)}
                    >
                      <Text style={{ color: statusColors[status], fontWeight: 'bold' }}>
                        {statusLabels[status]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            <TouchableOpacity 
              onPress={() => !updating && setModalVisible(false)}
              disabled={updating}
              style={styles.cancelButton}
            >
              <Text style={[styles.cancelText, updating && styles.disabledCancel]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PatioGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16
  },
  grid: {
    gap: 12
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12
  },
  motoBox: {
    width: '23%',
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 6
  },
  placa: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  posicao: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  motoInfo: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 16,
  },
  motoPlaca: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  motoStatus: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    alignSelf: 'flex-start',
    width: '100%',
  },
  statusButton: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center'
  },
  updatingContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  updatingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledCancel: {
    color: '#d1d5db',
    opacity: 0.5,
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  buttonsRow: {
    flexDirection: "row", 
    justifyContent: "space-between",
    gap: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});