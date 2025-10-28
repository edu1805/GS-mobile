import axios from 'axios';
import { Platform } from 'react-native';

const getBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5273/api'; // Android Emulator
  }
  return 'http://localhost:5273/api'; // iOS e outros
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  console.log('🔄 Fazendo requisição para:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.status, response.data?.length || '0 itens');
    return response;
  },
  (error) => {
    console.log('❌ Erro na requisição:', error.message);
    if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
      console.log('🔒 Problema de certificado SSL - usando configuração de desenvolvimento');
    }
    return Promise.reject(error);
  }
);

export default api;