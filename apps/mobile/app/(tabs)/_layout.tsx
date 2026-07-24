// app/(tabs)/_layout.tsx

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={
          {
            title: "Lobby",
            tabBarIconName: "home",
          } as any
        }
      />
      <Tabs.Screen
        name="play"
        options={
          {
            title: "Play",
            tabBarIconName: "game-controller",
          } as any
        }
      />
      <Tabs.Screen
        name="learn"
        options={
          {
            title: "Learn",
            tabBarIconName: "school",
          } as any
        }
      />
      <Tabs.Screen
        name="profile"
        options={
          {
            title: "Profile",
            tabBarIconName: "person",
          } as any
        }
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : 4;
  const tabHeight = insets.bottom > 0 ? 58 + insets.bottom : 62;

  return (
    <View
      style={[
        styles.tabBar,
        {
          height: tabHeight,
          paddingBottom: bottomInset,
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        let iconName = options.tabBarIconName || "help-circle";
        if (!isFocused) {
          iconName = `${iconName}-outline`;
        }

        const activeColor = colors.green;
        const inactiveColor = colors.textSecondary;

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
            <Ionicons
              name={iconName as any}
              size={20}
              color={isFocused ? activeColor : inactiveColor}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? activeColor : inactiveColor },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 62,
    borderTopWidth: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
  },
});