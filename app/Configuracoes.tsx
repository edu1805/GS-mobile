import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Configuracoes() {
  const router = useRouter();
  const { theme, toggleTheme, colors } = useTheme();
  const { t, i18n } = useTranslation();

  const alternarIdioma = () => {
    const novoIdioma = i18n.language === 'pt' ? 'es' : 'pt';
    i18n.changeLanguage(novoIdioma);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>Configurações</Text>

      {/* Seção de Aparência */}
      <View style={styles.secao}>
        <Text style={[styles.tituloSecao, { color: colors.text }]}>🎨 Aparência</Text>
        
        <TouchableOpacity 
          style={[styles.opcao, { backgroundColor: colors.input }]} 
          onPress={toggleTheme}
        >
          <View style={styles.opcaoConteudo}>
            <Text style={[styles.opcaoTitulo, { color: colors.text }]}>
              {theme === 'light' ? '☀️ Tema Claro' : '🌙 Tema Escuro'}
            </Text>
            <Text style={[styles.opcaoDescricao, { color: colors.placeHolderTextColor }]}>
              Alterar entre tema claro e escuro
            </Text>
          </View>
          <Text style={[styles.opcaoIcone, { color: colors.button }]}>
            {theme === 'light' ? '🌙' : '☀️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seção de Idioma */}
      <View style={styles.secao}>
        <Text style={[styles.tituloSecao, { color: colors.text }]}>🌐 Idioma</Text>
        
        <TouchableOpacity 
          style={[styles.opcao, { backgroundColor: colors.input }]} 
          onPress={alternarIdioma}
        >
          <View style={styles.opcaoConteudo}>
            <Text style={[styles.opcaoTitulo, { color: colors.text }]}>
              {i18n.language === 'pt' ? '🇧🇷 Português (Brasil)' : '🇪🇸 Español'}
            </Text>
            <Text style={[styles.opcaoDescricao, { color: colors.placeHolderTextColor }]}>
              Alterar idioma do aplicativo
            </Text>
          </View>
          <Text style={[styles.opcaoIcone, { color: colors.button }]}>
            {i18n.language === 'pt' ? '🇪🇸' : '🇧🇷'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seção Sobre */}
      <View style={styles.secao}>
        <Text style={[styles.tituloSecao, { color: colors.text }]}>ℹ️ Sobre</Text>
        
        <View style={[styles.infoBox, { backgroundColor: colors.input }]}>
          <Text style={[styles.infoLabel, { color: colors.placeHolderTextColor }]}>
            Versão do App
          </Text>
          <Text style={[styles.infoValor, { color: colors.text }]}>
            1.0.0
          </Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.input }]}>
          <Text style={[styles.infoLabel, { color: colors.placeHolderTextColor }]}>
            Desenvolvido por
          </Text>
          <Text style={[styles.infoValor, { color: colors.text }]}>
            WellWork Team
          </Text>
        </View>
      </View>

      {/* Botão Voltar */}
      <TouchableOpacity 
        style={[styles.botaoVoltar, { backgroundColor: colors.button }]} 
        onPress={() => router.replace("/Usuario")}
      >
        <Text style={[styles.botaoVoltarTexto, { color: colors.buttonText }]}>
          ← Voltar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
  },
  secao: {
    marginBottom: 30,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  opcaoConteudo: {
    flex: 1,
  },
  opcaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  opcaoDescricao: {
    fontSize: 13,
  },
  opcaoIcone: {
    fontSize: 24,
    marginLeft: 10,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  infoValor: {
    fontSize: 16,
    fontWeight: '600',
  },
  botaoVoltar: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  botaoVoltarTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});