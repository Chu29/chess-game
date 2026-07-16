import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChessBoard from "../../components/game/ChessBoard";
import { gamesApi, Game } from "../../lib/matchmakingApi";
import { colors } from "../../constants/theme";

export default function GameScreen() {
  const params = useLocalSearchParams<{
    gameId: string;
    fen?: string;
    whitePlayerId?: string;
    blackPlayerId?: string;
  }>();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(!params.fen);

  useEffect(() => {
    // If matchmaking already handed us the FEN, show it immediately —
    // no need to wait on a network round trip just to render the board.
    if (params.fen) {
      setGame({
        id: params.gameId,
        mode: "PVP",
        status: "ACTIVE",
        whitePlayerId: params.whitePlayerId ?? null,
        blackPlayerId: params.blackPlayerId ?? null,
        currentTurn: "WHITE",
        fen: params.fen,
      });
      setLoading(false);
      return;
    }

    // Otherwise (e.g. user refreshed this screen directly), fetch fresh state.
    gamesApi
      .getById(params.gameId)
      .then(setGame)
      .finally(() => setLoading(false));
  }, [params.gameId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.green} size="large" />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Game not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game #{game.id.slice(0, 8)}</Text>
      <ChessBoard fen={game.fen} />
      <Text style={styles.note}>
        Live move syncing (Socket.IO) isn&apos;t wired yet — this shows the
        starting position from the match. That's separate, later work.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  errorText: { color: colors.textSecondary, fontSize: 15 },
  note: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 16,
    textAlign: "center",
  },
});
