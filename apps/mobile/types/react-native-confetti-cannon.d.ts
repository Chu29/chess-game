declare module "react-native-confetti-cannon" {
  import React from "react";

  export interface ConfettiCannonProps {
    count?: number;
    origin?: { x: number; y: number };
    explosionSpeed?: number;
    fallSpeed?: number;
    colors?: string[];
    autoStart?: boolean;
    fadeOut?: boolean;
    spread?: number;
  }

  export default class ConfettiCannon extends React.Component<ConfettiCannonProps> {
    start(): void;
  }
}
