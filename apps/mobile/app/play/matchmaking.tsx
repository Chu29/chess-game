import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Matchmaking from '../../components/Matchmaking';
import { matchmakingApi } from '../../services/api-client';

export default function MatchmakingScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let pollInterval: ReturnType<typeof setInterval>;

    const startMatchmaking = async () => {
      try {
        const result = await matchmakingApi.join();

        if (result.status === 'matched') {
        //   router.replace(`./game/${result.game.id}`);
        router.push("")
          return;
        }

        pollInterval = setInterval(async () => {
          const statusResult = await matchmakingApi.status();
          if (statusResult.status === 'matched' && isMounted) {
            clearInterval(pollInterval);
            router.replace(`./game/${statusResult.game.id}`);
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
  }, []);

  const handleCancel = async () => {
    try {
      await matchmakingApi.leave();
    } catch {
      // already left or never joined — safe to ignore
    } finally {
      router.back();
    }
  };

  return <Matchmaking onCancel={handleCancel} />;
}