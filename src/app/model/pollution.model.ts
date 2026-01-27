export interface Pollution {
    id?: number;
    titre: string;
    type: 'Plastique' | 'Chimique' | 'Dépôt sauvage' | 'Eau' | 'Air' | 'Autre';
    description: string;
    dateObservation: string;
    lieu: string;
    latitude: number;
    longitude: number;
    photoUrl?: string;
}