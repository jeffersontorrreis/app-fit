import React from 'react';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AccountScreen } from '../screens/Account/AccountScreen';
import { EditProfileScreen } from '../screens/Account/EditProfileScreen';
import { SignInScreen } from '../screens/Auth/SignInScreen';
import { SignUpScreen } from '../screens/Auth/SignUpScreen';
import { ExerciseCatalogScreen } from '../screens/ExerciseCatalog/ExerciseCatalogScreen';
import { ExerciseTutorialScreen } from '../screens/ExerciseTutorial/ExerciseTutorialScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import ProgressScreen from '../screens/TrainingProgress/ProgressScreen';
import { TrainingHistoryScreen } from '../screens/TrainingHistory/TrainingHistoryScreen';
import { TrainingPlanScreenAdmin } from '../screens/TrainingPlanAdmin/TrainingPlanScreenAdmin';
import { TrainingPlanScreenUser } from '../screens/TrainingPlanUser/TrainingPlanScreenUser';
import { WelcomeScreen } from '../screens/Welcome/Welcome';
import { WorkoutLogScreen } from '../screens/WorkoutLog/WorkoutLogScreen';
import { ProfessorListScreen } from '../screens/Professor/ProfessorListScreen';
import { ProfessorProfileScreen } from '../screens/Professor/ProfessorProfileScreen';
import { StudentRequestsScreen } from '../screens/Professor/StudentRequestsScreen';
import { RequestDetailScreen } from '../screens/Professor/RequestDetailScreen';
import { StudentsScreen } from '../screens/Professor/StudentsScreen';
import { StudentDetailScreen } from '../screens/Professor/StudentDetailScreen';
import { EvaluationFormScreen } from '../screens/Professor/EvaluationFormScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  SignUp: undefined;
  SignIn: undefined;
  TrainingPlanUser: undefined;
  TrainingPlanAdmin: { alunoUid?: string; alunoNome?: string } | undefined;
  WorkoutLog: undefined;
  TrainingHistory: undefined;
  ExerciseCatalog: undefined;
  ExerciseTutorial: undefined;
  Account: undefined;
  EditProfile: undefined;
  Progress: undefined;
  // Professor flow (aluno)
  ProfessorList: undefined;
  ProfessorProfile: { professor: any };
  // Professor flow (professor)
  StudentRequests: undefined;
  RequestDetail: { requestId: string };
  Students: undefined;
  StudentDetail: { alunoUid: string; alunoNome: string };
  EvaluationForm: { alunoUid: string; alunoNome: string };
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const {
    theme,
    isDarkMode,
  } = useTheme();

  const {
    user,
    isAdmin,
    isProfessor,
    isInitializing,
  } = useAuth();

  if (isInitializing) {
    return null;
  }

  const navigationTheme = {
    ...(isDarkMode
      ? NavigationDarkTheme
      : NavigationDefaultTheme),
    colors: {
      ...(isDarkMode
        ? NavigationDarkTheme.colors
        : NavigationDefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: theme.secondary,
    },
  };

  return (
    <>
      <StatusBar
        style={
          isDarkMode ? 'light' : 'dark'
        }
        backgroundColor={
          theme.background
        }
      />

      <NavigationContainer
        theme={navigationTheme}
      >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
            />
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              name="TrainingPlanUser"
              component={TrainingPlanScreenUser}
            />
            {(isAdmin || isProfessor) && (
              <Stack.Screen
                name="TrainingPlanAdmin"
                component={TrainingPlanScreenAdmin}
              />
            )}
            <Stack.Screen
              name="WorkoutLog"
              component={WorkoutLogScreen}
            />
            <Stack.Screen
              name="TrainingHistory"
              component={TrainingHistoryScreen}
            />
            <Stack.Screen
              name="ExerciseCatalog"
              component={ExerciseCatalogScreen}
            />
            <Stack.Screen
              name="ExerciseTutorial"
              component={ExerciseTutorialScreen}
            />
            <Stack.Screen
              name="Account"
              component={AccountScreen}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
            />
            <Stack.Screen
              name="Progress"
              component={ProgressScreen}
            />
            {/* Rotas do fluxo Professor (visão do aluno) */}
            <Stack.Screen
              name="ProfessorList"
              component={ProfessorListScreen}
            />
            <Stack.Screen
              name="ProfessorProfile"
              component={ProfessorProfileScreen}
            />
            {/* Rotas do fluxo Professor (visão do professor) */}
            <Stack.Screen
              name="StudentRequests"
              component={StudentRequestsScreen}
            />
            <Stack.Screen
              name="RequestDetail"
              component={RequestDetailScreen}
            />
            <Stack.Screen
              name="Students"
              component={StudentsScreen}
            />
            <Stack.Screen
              name="StudentDetail"
              component={StudentDetailScreen}
            />
            <Stack.Screen
              name="EvaluationForm"
              component={EvaluationFormScreen}
            />
          </>
        )}
      </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
