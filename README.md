# 🌱 WellWork - Plataforma de Bem-Estar Corporativo

### 👨‍💻 Integrantes:
- Eduardo do Nascimento Barriviera - **RM 555309**
- Thiago Lima de Freitas - **RM 556795**
- Bruno Centurion Fernandes - **RM 556531**

---

## 💡 Solução 

### Empresas enfrentam o desafio crescente de monitorar o bem-estar emocional e mental de seus colaboradores, especialmente com o aumento de casos de burnout e problemas de saúde mental no ambiente corporativo. A falta de ferramentas adequadas dificulta a identificação precoce de sinais de esgotamento e a promoção de um ambiente de trabalho saudável.

### Nossa solução consiste em um aplicativo móvel desenvolvido com React Native e Expo que utiliza Inteligência Artificial para monitorar o bem-estar dos colaboradores através de check-ins diários de humor e energia. O WellWork atua como um coach digital de autocuidado, oferecendo recomendações personalizadas baseadas nos padrões identificados pela IA.

---

## 📌 Descrição da Solução

A aplicação permite:

### 🧭 Check-ins de Humor e Energia
- ✅ Registro diário/semanal de:
  - **Humor:** Feliz, Neutro, Triste, Estressado
  - **Nível de Energia:** Baixa, Média, Alta
  - **Observações:** Notas sobre o dia e sentimentos

### 🤖 IA de Bem-Estar
- 💡 Geração automática de recomendações personalizadas
- 📊 Análise de padrões de humor e energia
- 🎯 Sugestões contextualizadas de autocuidado
- ⚡ Identificação de sinais de cansaço ou estresse

### 👤 Gerenciamento de Perfil
- 🔐 Sistema de autenticação seguro
- 📱 Histórico completo de check-ins
- ⚙️ Configurações personalizadas

### 🌐 Recursos Adicionais
- 🌗 Tema claro/escuro
- 🇧🇷 🇪🇸 Suporte a múltiplos idiomas (PT-BR / ES)
- 📈 Visualização do histórico de bem-estar

---

## 🚀 Como rodar o projeto localmente

### 1. Rode a API Java
> https://github.com/thiglfa/Java-IoTGlobalS

Clone e inicie a API seguindo as instruções do repositório. A API deve estar rodando em `http://localhost:8080`

### 2. Clone o repositório do app mobile
```bash
git clone https://github.com/seu-usuario/WellWorkApp.git
cd WellWorkApp
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Inicie o projeto com o Expo
```bash
npx expo start
```

> Ou rode `npx expo start --android` para rodar diretamente no Android.
> 
> Para iOS: `npx expo start --ios`

### 5. Configure a conexão com a API

- **Android Emulator:** A URL `http://10.0.2.2:8080` já está configurada
- **Dispositivo Físico:** Altere a baseURL em `src/services/api.ts` para o IP da sua máquina na rede local

---

## 📱 Funcionalidades Principais

### 🏠 Tela Inicial (Home)
- Visualização de todos os check-ins realizados
- Cards com humor, energia e observações
- Botão para gerar recomendações via IA
- Histórico completo do bem-estar

### ✅ Novo Check-in
- Interface intuitiva para registro
- Seleção visual de humor com emojis
- Indicadores de nível de energia
- Campo para observações detalhadas

### 💡 Recomendações IA
- Sugestões personalizadas baseadas no humor e energia
- Análise de padrões de comportamento
- Coach digital de autocuidado

### 👤 Perfil do Usuário
- Informações da conta
- Acesso às configurações
- Opção de logout seguro

### ⚙️ Configurações
- Alternância entre tema claro e escuro
- Seleção de idioma (PT-BR / ES)
- Informações sobre o app

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Mobile)
- **React Native** + **Expo**
- **TypeScript**
- **Expo Router** (navegação)
- **Axios** (requisições HTTP)
- **AsyncStorage** (armazenamento local)
- **i18next** (internacionalização)

### Backend (API)
- **Java** + **Spring Boot**
- **JWT** (autenticação)
- **Oracle** (banco de dados)
- **IA Generativa** (recomendações)

---

## 📂 Estrutura do Projeto
```
WellWorkApp/
├── app/                      # Telas da aplicação (Expo Router)
│   ├── _layout.tsx          # Layout raiz
│   ├── index.tsx            # Tela de login
│   ├── CadastroScreen.tsx         # Cadastro de usuário
│   ├── HomeScreen.tsx             # Tela principal
│   ├── Cadastro.tsx         # Novo check-in
│   ├── Usuario.tsx          # Perfil do usuário
│   └── Configuracoes.tsx    # Configurações
├── src/
│   ├── services/
│   │   ├── api.ts           # Configuração Axios
│   │   ├── auth.ts          # Funções de autenticação
│   │   └── i18n.ts          # Configuração i18n
│   ├── context/
│   │   └── ThemeContext.tsx # Contexto de tema
│   └── locales/
│       ├── pt.json          # Traduções PT-BR
│       └── es.json          # Traduções ES
└── package.json
```
