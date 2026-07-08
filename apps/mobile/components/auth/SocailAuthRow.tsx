import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../constants/theme';

export default function SocialAuthRow() {
  return (
    <View>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.row}>
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-google" size={16} color={colors.white} />
          <Text style={styles.socialLabel}>Google</Text>
        </Pressable>
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-apple" size={16} color={colors.white} />
          <Text style={styles.socialLabel}>Apple</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder },
  dividerText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', gap: 10 },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingVertical: 12,
  },
  socialLabel: { color: colors.white, fontSize: 13, fontWeight: '600', marginLeft: 6 },
});