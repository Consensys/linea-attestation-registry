export interface ICardViewProps {
  attestationsList: Array<{
    id: string;
    schema: {
      id: string;
    };
    portal: {
      id: string;
    };
    attestedDate: number;
    expirationDate?: number;
    revoked: boolean;
  }>;
}
