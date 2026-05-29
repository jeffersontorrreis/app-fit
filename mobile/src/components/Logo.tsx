import React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ImageStyle;
  showVersion?: boolean;
}

const sizes = {
  small: 60,
  medium: 100,
  large: 150,
};

const appVersion =
  require('../../app.json').expo
    .version ?? '1.0.0';

export function Logo({
  size = 'medium',
  style,
  showVersion = true,
}: LogoProps) {
  const { theme } = useTheme();
  const logoSize = sizes[size];

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    logo: {
      width: logoSize,
      height: logoSize,
      resizeMode: 'contain',
    } as ImageStyle,
    version: {
      color: theme.textTertiary,
      fontSize: 12,
      marginTop: 6,
      letterSpacing: 0.4,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon_3.png')}
        style={[styles.logo, style]}
      />

      {showVersion && (
        <Text style={styles.version}>
          v{appVersion}
        </Text>
      )}
    </View>
  );
}
