import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import MatchmakingScreen from "../../components/Matchmaking";
import { matchmakingApi } from "../../lib/matchmakingApi";

export default function MatchmakingRoute() {
  const router = useRouter();
  const [, setError] = useState<string | null>(null);

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
        pathname: "/game/[gameId]" as any,
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

  return <MatchmakingScreen onCancel={handleCancel} />;
}
