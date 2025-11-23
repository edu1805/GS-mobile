import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080'; // ✅ SEM barra final, SEM /api
  }
  return 'http://localhost:8080'; // ✅ consistente
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('🔄 Requisição:', config.method?.toUpperCase(), config.url);
  return config;
});

// Tratamento de respostas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta:', response.status, response.data);
    return response;
  },
  (error) => {
    console.log('❌ Erro:', error.message);
    if (error.response) {
      console.log('📥 Dados do erro:', error.response.data);
      console.log('📊 Status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default api;