export interface Seller {
  id: string;
  name: string;
  photo: string | null;
  whatsappNumber: string;
  active: boolean;
}

// Fotos podem ser cadastradas posteriormente; os avatares visuais são usados enquanto isso.
export const SELLERS: Seller[] = [
  { id: 'vitoria', name: 'Vitória', photo: null, whatsappNumber: '5583991704298', active: true },
  { id: 'erika', name: 'Erika', photo: null, whatsappNumber: '5583991131998', active: true },
  { id: 'emilly', name: 'Emilly', photo: null, whatsappNumber: '5583996646676', active: true },
];
