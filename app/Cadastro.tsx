import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import api from '../src/services/api';
import { MotoStatus } from '../src/types/Moto';
import { useTheme } from '../src/context/ThemeContext'; // 👈 hook do tema

export default function Cadastro() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [moto, setMoto] = useState({ placa: '', posicao: '', status: '' as MotoStatus });

  const handleChange = (field: string, value: string) => {
    setMoto((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!moto.placa.trim()) { Alert.alert('Atenção', 'Informe a placa da moto.'); return; }
    if (!moto.posicao.trim()) { Alert.alert('Atenção', 'Informe a posição da moto.'); return; }
    if (!moto.status) { Alert.alert('Atenção', 'Selecione o status da moto.'); return; }

    try {
      setLoading(true);
      const ultimaAtualizacao = new Date().toISOString();
      const dadosMoto = {
        placa: moto.placa.toUpperCase().trim(),
        posicao: moto.posicao.toUpperCase().trim(),
        status: moto.status,
        ultimaAtualizacao
      };

      const response = await api.post('/motos/criar', dadosMoto);

      Alert.alert(
        'Sucesso',
        `Moto ${moto.placa} cadastrada com sucesso!\nPosição: ${moto.posicao}\nStatus: ${getStatusLabel(moto.status)}`,
        [{ text: 'OK', onPress: () => { setMoto({ placa: '', posicao: '', status: '' as MotoStatus }); router.back(); } }]
      );

    } catch (error: any) {
      let errorMessage = 'Erro ao cadastrar moto';
      if (error.response) {
        if (error.response.status === 400) errorMessage = 'Dados inválidos.';
        else if (error.response.status === 409) errorMessage = 'Moto já cadastrada.';
        else errorMessage = `Erro ${error.response.status}: ${error.response.data?.message || 'Erro no servidor'}`;
      } else if (error.request) errorMessage = 'Não foi possível conectar ao servidor.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: MotoStatus) => {
    const labels: Record<MotoStatus, string> = {
      pronta: 'Pronta para usar',
      revisao: 'Requer revisão',
      reservada: 'Reservada',
      'fora de serviço': 'Fora de serviço'
    };
    return labels[status] || status;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Botão de alternar tema */}
      <Pressable style={[styles.themeButton, { backgroundColor: colors.button }]} onPress={toggleTheme}>
        <Text style={[styles.themeButtonText, { color: colors.buttonText }]}>{theme === 'light' ? '🌙 Modo Escuro' : '🌞 Modo Claro'}</Text>
      </Pressable>

      <Text style={[styles.titulo, { color: colors.text }]}>Cadastrar Nova Moto</Text>

      <TextInput
        value={moto.placa}
        onChangeText={(text) => handleChange('placa', text)}
        style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
        placeholder="Placa (ex: ABC1D23)"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="characters"
        maxLength={7}
        editable={!loading}
      />

      <TextInput
        value={moto.posicao}
        onChangeText={(text) => handleChange('posicao', text)}
        style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
        placeholder="Posição (ex: A1, B2, C3)"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="characters"
        editable={!loading}
      />

      <RNPickerSelect
        onValueChange={(value) => handleChange('status', value)}
        value={moto.status}
        placeholder={{ label: 'Selecione o status...', value: null }}
        items={[
          { label: 'Pronta para usar', value: 'pronta' },
          { label: 'Requer revisão', value: 'revisao' },
          { label: 'Reservada', value: 'reservada' },
          { label: 'Fora de serviço', value: 'fora de serviço' },
        ]}
        style={{
          inputIOS: { ...styles.pickerInput, backgroundColor: colors.input, color: colors.text, borderColor: colors.border },
          inputAndroid: { ...styles.pickerInput, backgroundColor: colors.input, color: colors.text, borderColor: colors.border },
        }}
        disabled={loading}
      />

      <Pressable style={[styles.botao, loading && styles.botaoDisabled, { backgroundColor: colors.button }]} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.buttonText} /> : <Text style={[styles.botaoTexto, { color: colors.buttonText }]}>Cadastrar Moto</Text>}
      </Pressable>

      <View style={styles.links}>
        <Link href="/Patio" style={[styles.linkTexto, { color: colors.button }]}>📋 Ver Todas as Motos</Link>
        <Link href="/HomeScreen" style={[styles.linkTexto, { color: colors.button }]}>🏠 Voltar ao Menu</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, marginBottom: 16 },
  pickerInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, marginBottom: 16 },
  botao: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  botaoDisabled: { opacity: 0.6 },
  botaoTexto: { fontSize: 16, fontWeight: 'bold' },
  links: { alignItems: 'center', gap: 12 },
  linkTexto: { fontSize: 16 },
  themeButton: { padding: 12, borderRadius: 10, marginBottom: 12, alignItems: 'center' },
  themeButtonText: { fontSize: 16, fontWeight: 'bold' },
});
