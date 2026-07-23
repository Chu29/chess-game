import { useRouter } from "expo-router";
import MatchmakingScreen from "../../components/Matchmaking";

export default function Matchmaking() {
  const router = useRouter();

  return <MatchmakingScreen onCancel={() => router.back()} />;
}
