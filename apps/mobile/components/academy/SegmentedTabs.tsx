import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  LayoutChangeEvent,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function SegmentedTabs({ tabs, activeIndex, onChange }: Props) {
  const { colors } = useTheme();
  const [segmentWidth, setSegmentWidth] = useState(0);
  const translateX = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width / tabs.length;
    setSegmentWidth(width);
    translateX.value = width * activeIndex;
  };

  const handlePress = (index: number) => {
    onChange(index);
    translateX.value = withSpring(segmentWidth * index, {
      damping: 18,
      stiffness: 180,
    });
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: segmentWidth,
  }));

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: colors.green },
          ]}
        />
      )}
      {tabs.map((tab, index) => (
        <Pressable
          key={tab}
          onPress={() => handlePress(index)}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeIndex === index }}
          style={styles.tab}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeIndex === index
                    ? colors.background
                    : colors.textSecondary,
              },
            ]}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 999,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
