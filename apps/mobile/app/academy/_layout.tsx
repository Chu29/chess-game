import { Stack } from "expo-router";
import { colors } from "../../constants/colors";

export default function AcademyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="piece/[pieceId]"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="rule/[ruleId]"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="practice" />
      <Stack.Screen name="ai-coach" />
    </Stack>
  );
}
