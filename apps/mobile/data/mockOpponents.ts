export type MockOpponentProfile = {
  username: string;
  rating: number;
  icon: string; 
};

export const MOCK_OPPONENT_PROFILES: MockOpponentProfile[] = [
  { username: "Magnus_2024", rating: 1340, icon: "chess-knight" },
  { username: "QueenGambit_9", rating: 1275, icon: "chess-queen" },
  { username: "RookieRookMaster", rating: 1198, icon: "chess-rook" },
  { username: "SicilianDefense", rating: 1412, icon: "chess-bishop" },
  { username: "TacticalTessa", rating: 1289, icon: "chess-king" },
];