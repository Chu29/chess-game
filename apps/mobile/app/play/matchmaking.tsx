import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import MatchmakingScreen from "../../components/Matchmaking";
import { matchmakingApi } from "../../lib/matchmakingApi";

export default function MatchmakingRoute() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;
    let pollInterval: ReturnType<typeof setInterval>;

    const goToGame = (game: {
      id: string;
      fen: string;
      whitePlayerId: string | null;
      blackPlayerId: string | null;
    }) => {
      router.replace({
        pathname: "/game/[gameId]",
        params: {
          gameId: game.id,
          fen: game.fen,
          whitePlayerId: game.whitePlayerId ?? "",
          blackPlayerId: game.blackPlayerId ?? "",
        },
      });
    };

    const startMatchmaking = async () => {
      try {
        const result = await matchmakingApi.join();

        if (result.status === "matched") {
          goToGame(result.game);
          return;
        }

        pollInterval = setInterval(async () => {
          const statusResult = await matchmakingApi.status();
          if (statusResult.status === "matched" && isMounted) {
            clearInterval(pollInterval);
            goToGame(statusResult.game);
          }
        }, 2000);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      }
    };

    startMatchmaking();

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [router]);
}
