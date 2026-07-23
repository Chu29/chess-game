import { useRouter } from "expo-router";
import MatchmakingScreen from "../../components/Matchmaking";
import { matchmakingApi } from "../../lib/matchmakingApi";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; 

export default function Matchmaking() {
  const router = useRouter();
  const { user } = useAuth(); 
  const [, setError] = useState<string | null>(null);

  const RATING_RANGE = 200; 
  const ratingRange = user
    ? { min: user.rating - RATING_RANGE, max: user.rating + RATING_RANGE }
    : undefined;

  useEffect(() => {
    let isMounted = true;
    let pollInterval: ReturnType<typeof setInterval>;

    const goToGame = (game: {
      id: string;
      fen: string;
      whitePlayerId: string | null;
      blackPlayerId: string | null;
      whiteUsername?: string;
      blackUsername?: string;
    }) => {
      router.replace({
        pathname: "/game/[gameId]" as any,
        params: {
          gameId: game.id,
          fen: game.fen,
          whitePlayerId: game.whitePlayerId ?? "",
          blackPlayerId: game.blackPlayerId ?? "",
          whiteUsername: game.whiteUsername ?? "Unknown",
          blackUsername: game.blackUsername ?? "Unknown",
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
          try {
            const statusResult = await matchmakingApi.status();

            if (statusResult.status === "matched" && isMounted) {
              clearInterval(pollInterval);
              goToGame(statusResult.game);
            }
          } catch (err) {
            console.error(err);
          }
        }, 2000);
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message ?? "Failed to start matchmaking.");
        }
      }
    };

    void startMatchmaking();

    return () => {
      isMounted = false;

      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [router]);

  const handleCancel = async () => {
    try {
      await matchmakingApi.leave();
    } catch (err) {
      console.error(err);
    } finally {
      router.back();
    }
  };

  return (
    <MatchmakingScreen
      onCancel={handleCancel}
      ratingRange={ratingRange} 
    />
  );
}