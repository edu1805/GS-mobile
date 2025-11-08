import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar como as notificações devem ser exibidas quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  // Solicitar permissões para notificações
  async requestPermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permissão para notificações negada!');
      return false;
    }
    
    return true;
  }

  // Enviar notificação local de moto cadastrada
  async sendMotoRegisteredNotification(placa: string, posicao: string, status: string) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏍️ Moto Cadastrada!',
          body: `Placa: ${placa} | Posição: ${posicao} | Status: ${status}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { placa, posicao, status },
        },
        trigger: null, // null = notificação imediata
      });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  // Cancelar todas as notificações
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Buscar todas as notificações agendadas
  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export default new NotificationService();