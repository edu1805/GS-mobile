import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import api from '../src/services/api';
import { MotoStatus } from '../src/types/Moto';
import { useTheme } from '../src/context/ThemeContext'; 
import { useTranslation } from 'react-i18next';

export default function Cadastro() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [moto, setMoto] = useState({ placa: '', posicao: '', status: '' as MotoStatus });

  const { t, i18n } = useTranslation();
    
    const alternarIdioma = () => {
      const novoIdioma = i18n.language === 'pt' ? 'es' : 'pt';
      i18n.changeLanguage(novoIdioma);
    };

  const handleChange = (field: string, value: string) => {
    setMoto((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!moto.placa.trim()) { Alert.alert(
      t('motoRegister.alerts.warning'), t('motoRegister.alerts.fill_plate')); return; }

    if (!moto.posicao.trim()) { Alert.alert(
      t('motoRegister.alerts.warning'), 'motoRegister.alerts.fill_position'); return; }

    if (!moto.status) { Alert.alert(
      t('motoRegister.alerts.warning'), t('motoRegister.alerts.select_status')); return; }

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
        t('motoRegister.alerts.success_title'),
        t('motoRegister.alerts.success_message', {plate: moto.placa, position: moto.posicao, status: getStatusLabel(moto.status)}),
        [{ text: 'OK', onPress: () => { setMoto({ placa: '', posicao: '', status: '' as MotoStatus }); router.push('/HomeScreen'); } }]
      );

    } catch (error: any) {
      let errorMessage = t('motoRegister.alert.error_title');
      if (error.response) {
        if (error.response.status === 400) errorMessage = t('motoRegister.alert.error_invalid');
        else if (error.response.status === 409) errorMessage = t('motoRegister.alert.error_conflict');
        else errorMessage = `Erro ${error.response.status}: ${error.response.data?.message || t('motoRegister.alert.error_server')}`;
      } else if (error.request) errorMessage = t('motoRegister.alert.error_connection');
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: MotoStatus) => {
    const labels: Record<MotoStatus, string> = {
      pronta: t('motoRegister.statuses.ready'),
      revisao: t('motoRegister.statuses.revision'),
      reservada: t('motoRegister.statuses.reserved'),
      'fora de serviço': t('motoRegister.statuses.out_of_service')
    };
    return labels[status] || status;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* 🔄 Botão de idioma */}
      <TouchableOpacity onPress={alternarIdioma} style={styles.languageButton}>
        <Text style={styles.languageText}>
          {i18n.language === 'pt' ? '🇧🇷 PT-BR' : '🇪🇸 ES'}
        </Text>
      </TouchableOpacity>

      {/* Botão de alternar tema */}
      <Pressable style={[styles.themeButton, { backgroundColor: colors.button }]} onPress={toggleTheme}>
        <Text style={[styles.themeButtonText, { color: colors.buttonText }]}>{theme === 'light' ? t('motoRegister.buttons.theme_dark') : t('motoRegister.buttons.theme_light')}</Text>
      </Pressable>

      <Text style={[styles.titulo, { color: colors.text }]}>{t('motoRegister.title')}</Text>

      <TextInput
        value={moto.placa}
        onChangeText={(text) => handleChange('placa', text)}
        style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
        placeholder={t('motoRegister.placeholders.plate')}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="characters"
        maxLength={7}
        editable={!loading}
      />

      <TextInput
        value={moto.posicao}
        onChangeText={(text) => handleChange('posicao', text)}
        style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
        placeholder={t('motoRegister.placeholders.position')}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="characters"
        editable={!loading}
      />

      <RNPickerSelect
        onValueChange={(value) => handleChange('status', value)}
        value={moto.status}
        placeholder={{ label: t('motoRegister.placeholders.status'), value: null }}
        items={[
          { label: t('motoRegister.statuses.ready'), value: 'pronta' },
          { label: t('motoRegister.statuses.revision'), value: 'revisao' },
          { label: t('motoRegister.statuses.reserved'), value: 'reservada' },
          { label: t('motoRegister.statuses.out_of_service'), value: 'fora de serviço' },
        ]}
        style={{
          inputIOS: { ...styles.pickerInput, backgroundColor: colors.input, color: colors.text, borderColor: colors.border },
          inputAndroid: { ...styles.pickerInput, backgroundColor: colors.input, color: colors.text, borderColor: colors.border },
        }}
        disabled={loading}
      />

      <Pressable style={[styles.botao, loading && styles.botaoDisabled, { backgroundColor: colors.button }]} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.buttonText} /> : <Text style={[styles.botaoTexto, { color: colors.buttonText }]}>{t('motoRegister.buttons.register')}</Text>}
      </Pressable>

      <View style={styles.links}>
        <Link href="/Patio" style={[styles.linkTexto, { color: colors.button }]}>{t('motoRegister.links.view_all')}</Link>
        <Link href="/HomeScreen" style={[styles.linkTexto, { color: colors.button }]}>{t('motoRegister.links.back_menu')}</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  languageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  languageText: { color: '#fff', fontWeight: 'bold'},
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
