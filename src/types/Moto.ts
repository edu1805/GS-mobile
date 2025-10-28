export type MotoStatus = 'pronta' | 'revisao' | 'reservada' | 'fora de serviço';

export interface Moto {
  id: string;
  placa: string;
  status: MotoStatus;
  posicao: string,
  ultimaAtualizacao: string;
}

export interface NovaMoto {
  placa: string;
  posicao: string;
  status: MotoStatus;
  // ultimaAtualizacao é gerado automaticamente pelo servidor
}

export default Moto;