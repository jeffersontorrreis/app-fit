import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Logo,
  PrimaryButton,
  SecondaryButton,
} from '../../components';

import { useTheme } from '../../context/ThemeContext';
import { createWelcomeStyles } from './styles';

interface WelcomeScreenProps {
  navigation: any;
}

export function WelcomeScreen({
  navigation,
}: WelcomeScreenProps) {

  const { theme } = useTheme();
  const styles =
    createWelcomeStyles(theme);

  const goToSignInScreen = () => {
    navigation.navigate('SignIn');
  };

  const goToSignUpScreen = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.logoContainer}>

          <View style={styles.logoWrapper}>

            <Logo size="large" />

            <Text style={styles.tagline}>
              Treine. Evolua. Supere-se
            </Text>

          </View>

        </View>

        <View style={styles.contentContainer}>

          <Text style={styles.subtitle}>
            Tudo o que você precisa para acompanhar sua jornada fitness em um
            só lugar
          </Text>

        </View>

        <View style={styles.buttonContainer}>

          <PrimaryButton
            label="Entrar"
            onPress={goToSignInScreen}
            style={styles.primaryButtonStyle}
          />

          <SecondaryButton
            label="Criar Conta"
            onPress={goToSignUpScreen}
            style={styles.secondaryButtonStyle}
          />

        </View>

        <Text style={styles.footerText}>
          © 2026 VivaFit. Todos os direitos reservados.
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
}
