export interface Seller {
  id: string;
  name: string;
  photo: string | null;
  whatsappNumber: string;
  active: boolean;
}

/**
 * Atendimento da Mega. Nenhum número ou contato da operação anterior é
 * reutilizado. Cadastre os canais oficiais quando forem confirmados.
 */
export const SELLERS: Seller[] = [
  {
    id: 'equipe-mega',
    name: 'Equipe Mega',
    photo: null,
    whatsappNumber: '',
    active: false,
  },
];
