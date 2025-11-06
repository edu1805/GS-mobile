import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { useTheme } from "../src/context/ThemeContext";

export default function Integrantes() {

  const { t, i18n } = useTranslation();
   const { theme, toggleTheme, colors } = useTheme();
  
  const alternarIdioma = () => {
    const novoIdioma = i18n.language === 'pt' ? 'es' : 'pt';
    i18n.changeLanguage(novoIdioma);
  };

  const integrantes = [
    {
      nome: 'Eduardo do Nascimento Barriviera',
      rm: 'RM555309',
      github: 'https://github.com/edu1805',
      avatar: require('../assets/foto1.jpg'),
    },
    {
      nome: 'Thiago Lima de Freitas',
      rm: 'RM556795',
      github: 'https://github.com/thiglfa',
      avatar: require('../assets/foto3.jpg'),
    },
    {
      nome: 'Bruno Centurion Fernandes',
      rm: 'RM556531',
      github: 'https://github.com/brunocenturion',
      avatar: require('../assets/foto2.jpg'),
    }
  ];

 return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>

      {/* 🔄 Botões de idioma e tema */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={alternarIdioma} style={styles.languageButton}>
          <Text style={styles.languageText}>
            {i18n.language === 'pt' ? '🇧🇷 PT-BR' : '🇪🇸 ES'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.themeButton, { backgroundColor: colors.button }]} 
          onPress={toggleTheme}
        >
          <Text style={[styles.themeButtonText, { color: colors.buttonText }]}>
            {theme === "light" ? t('patio.buttons.theme_dark') : t('patio.buttons.theme_light')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{t('developers.title')}</Text>

      {integrantes.map((dev, index) => (
        <View style={[styles.card, { backgroundColor: colors.card }]} key={index}>
          <Image source={dev.avatar} style={styles.avatar} />

          <View style={styles.textContainer}>
            <Text style={[styles.name, { color: colors.text }]}>{dev.nome}</Text>
            <Text style={[styles.rm, { color: colors.text }]}>RM: {dev.rm}</Text>

            <TouchableOpacity onPress={() => Linking.openURL(dev.github)} style={styles.infoRow}>
              <Ionicons name="logo-github" size={16} color="#2563eb" style={styles.icon} />
              <Text style={styles.link}>{dev.github.replace('https://', '')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerTitle, { color: colors.text }]}>{t('developers.objectiveTitle')}</Text>
            <Text style={[styles.footerText, { color: colors.text }]}>{t('developers.objectiveText1')}</Text>
            <Text style={[styles.footerText, { color: colors.text }]}>{t('developers.objectiveText2')}</Text>
        </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
    flexGrow: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  languageButton: {
    padding: 10,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  languageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1f2937',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  rm: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#374151',
  },
  link: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'justify',
  },
});
