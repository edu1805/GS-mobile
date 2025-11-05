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
      {/* feito */}
      <Drawer.Screen name="index" options={{headerShown: false, drawerItemStyle: { display: 'none' }}}/>
      {/* feito*/}
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
      {/* feito */}
      <Drawer.Screen
        name="Cadastro"
        options={{
          title: "Cadastrar moto",
          drawerLabel: "Cadastro de Moto",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Patio"
        options={{
          title: "Motos",
          drawerLabel: "Ver Todas as Motos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bicycle-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Relatorio"
        options={{
          title: "Relatório geral",
          drawerLabel: "Relatório",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      {/* feito */}
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
      {/* feito */}
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
