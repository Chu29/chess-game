export type MockOpponentProfile = {
  username: string;
  rating: number;
  avatarUrl: string;
};

export const MOCK_OPPONENT_PROFILES: MockOpponentProfile[] = [
  {
    username: "Magnus_2024",
    rating: 1340,
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/png?seed=Magnus2024",
  },
  {
    username: "QueenGambit_9",
    rating: 1275,
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/png?seed=QueenGambit9",
  },
  {
    username: "RookieRookMaster",
    rating: 1198,
    avatarUrl:
      "https://api.dicebear.com/9.x/adventurer/png?seed=RookieRookMaster",
  },
  {
    username: "SicilianDefense",
    rating: 1412,
    avatarUrl:
      "https://api.dicebear.com/9.x/adventurer/png?seed=SicilianDefense",
  },
  {
    username: "TacticalTessa",
    rating: 1289,
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/png?seed=TacticalTessa",
  },
];
