// app/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { ThemeProvider, useTheme } from "../src/context/ThemeContext"; // ajuste o caminho
import { I18nextProvider } from "react-i18next";
import i18n from "../src/services/i18n";

// Criamos um componente separado para aplicar o tema dentro do Drawer
function ThemedDrawer() {
  const { colors } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: colors.button,   // cor dos itens ativos no menu
        drawerInactiveTintColor: colors.text,  // cor dos itens inativos
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background },
      }}
    >

      <Drawer.Screen name="index" options={{headerShown: false, drawerItemStyle: { display: 'none' }}}/>

      <Drawer.Screen name="CadastrarScreen" options={{headerShown: false, drawerItemStyle: { display: 'none' }}}/>

      <Drawer.Screen
        name="HomeScreen"
        options={{
          title: "Dashboard",
          drawerLabel: "Início",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Cadastro"
        options={{
          title: "Cadastrar CheckIn",
          drawerLabel: "Cadastro de checkIn",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Configuracoes"
        options={{
          title: "Configurações",
          drawerLabel: "Configurações",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Desenvolvedores"
        options={{
          title: "Desenvolvedores",
          drawerLabel: "Sobre os desenvolvedores",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Usuario"
        options={{
          title: "Meu Perfil",
          drawerLabel: "Usuário",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

export default function Layout() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <ThemedDrawer />
      </ThemeProvider>
    </I18nextProvider>
  );
}
