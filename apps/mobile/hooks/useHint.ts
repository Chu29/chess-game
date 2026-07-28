import { useCallback, useState } from 'react';
import { aiApi, ApiError } from '../lib/api';
import type { HintResponse } from '../lib/api';

interface UseHintOptions {
  gameId: string;
  maxHints?: number;
}

/**
 * Drives the AI Coach hint flow for a single game session. `remaining`
 * mirrors the server's count optimistically for instant UI feedback, but
 * the server (HintService, keyed off ActiveGame.hintsUsed) is the real
 * source of truth and will reject requests once its own count hits 0
 * even if this client-side count somehow drifts.
 */
export function useHint({ gameId, maxHints = 5 }: UseHintOptions) {
  const [remaining, setRemaining] = useState(maxHints);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<HintResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const requestHint = useCallback(
    async (fen: string, player: 'white' | 'black') => {
      if (remaining <= 0 || loading) return;

      setLoading(true);
      setError(null);

      try {
        const result = await aiApi.getHint(fen, player, gameId);
        setHint(result);
        setRemaining((r) => Math.max(0, r - 1));
        setModalVisible(true);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'No hint available.');
        setModalVisible(true);
      } finally {
        setLoading(false);
      }
    },
    [gameId, loading, remaining],
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  /** Call when a brand new game starts (new gameId) to reset the local counter. */
  const reset = useCallback(() => {
    setRemaining(maxHints);
    setHint(null);
    setError(null);
    setModalVisible(false);
  }, [maxHints]);

  return { remaining, loading, hint, error, modalVisible, requestHint, closeModal, reset };
}
