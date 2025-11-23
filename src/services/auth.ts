import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(username: string, password: string) {
  try {
    console.log('🔑 Tentando login...', { username });
    
    const res = await api.post('/auth/login', { username, password });
    const token = res.data.token;
    
    console.log('✅ Token recebido:', token);
    
    // Salva o token
    await AsyncStorage.setItem('token', token);
    
    // Busca dados do usuário
    const userRes = await api.get('/api/users/me');
    await AsyncStorage.setItem('user', JSON.stringify(userRes.data));
    
    console.log('👤 Usuário:', userRes.data);
    
    return { success: true, user: userRes.data };
  } catch (error: any) {
    console.log('❌ Erro no login:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erro ao fazer login' 
    };
  }
}

export async function logout() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  console.log('🚪 Logout realizado');
}

export async function getUser() {
  const userStr = await AsyncStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export async function isAuthenticated() {
  const token = await AsyncStorage.getItem('token');
  return !!token;
}

export async function getCheckins() {
  try {
    const res = await api.get('/api/checkins');
    console.log('📋 Check-ins recebidos:', res.data.content.length);
    return { success: true, checkins: res.data.content };
  } catch (error: any) {
    console.log('❌ Erro ao buscar check-ins:', error.response?.data || error.message);
    return { success: false, error: 'Erro ao buscar check-ins' };
  }
}

export async function createCheckin(mood: number, energyLevel: number, notes: string) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    const body = {
      userId: user.id,
      mood: mood,
      energyLevel: energyLevel,
      notes: notes
    };

    console.log('📝 Criando check-in:', body);
    
    const res = await api.post('/api/checkins', body);
    console.log('✅ Check-in criado:', res.data);
    
    return { success: true, checkin: res.data };
  } catch (error: any) {
    console.log('❌ Erro ao criar check-in:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erro ao criar check-in' 
    };
  }
}