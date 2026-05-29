import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { AppTheme } from '../../../config/colors';
import { useTheme } from '../../../context/ThemeContext';

interface ExerciseTutorialProps {
  title: string;
  muscleGroups: string[];
}

//Informações dos exercicios como imagens e tutorial

const exerciseData: Record<string, any> = {

  'Agachamento Livre': {
    image: require('../../../../assets/exercises/Agachamento_livre.gif'),
    tutorial:
      '1. Posicione os pés na largura dos ombros.\n\n2. Apoie a barra sobre a parte superior das costas.\n\n3. Desça lentamente flexionando joelhos e quadril.\n\n4. Mantenha o peito elevado e as costas retas.\n\n5. Desça até as coxas ficarem paralelas ao chão.\n\n6. Retorne empurrando o chão com os pés.',
  },

  'Desenvolvimento com Barra': {
    image: require('../../../../assets/exercises/Desenvolvimento_com_barras.gif'),
    tutorial:
      '1. Posicione a barra na altura dos ombros.\n\n2. Mantenha o abdômen contraído e as costas retas.\n\n3. Empurre a barra verticalmente acima da cabeça.\n\n4. Estenda completamente os braços sem travar os cotovelos.\n\n5. Retorne lentamente à posição inicial.\n\n6. Evite inclinar excessivamente o tronco.',
  },

  'Levantamento Terra': {
    image: require('../../../../assets/exercises/levantamento.gif'),
    tutorial:
      '1. Posicione os pés alinhados com os ombros.\n\n2. Segure a barra mantendo as costas retas.\n\n3. Contraia o abdômen e mantenha o peito aberto.\n\n4. Levante a barra estendendo quadril e joelhos simultaneamente.\n\n5. Mantenha a barra próxima ao corpo durante o movimento.\n\n6. Retorne lentamente ao chão controlando a descida.',
  },

  'Remada Curvada': {
    image: require('../../../../assets/exercises/Remada_curvada.gif'),
    tutorial:
      '1. Segure a barra com as mãos afastadas na largura dos ombros.\n\n2. Incline o tronco levemente para frente mantendo as costas retas.\n\n3. Puxe a barra em direção ao abdômen.\n\n4. Contraia as costas no final do movimento.\n\n5. Retorne lentamente à posição inicial.\n\n6. Evite curvar a lombar durante a execução.',
  },

  'Rosca Direta': {
    image: require('../../../../assets/exercises/Rosca_direta.gif'),
    tutorial:
      '1. Segure a barra com as palmas voltadas para cima.\n\n2. Mantenha os cotovelos próximos ao corpo.\n\n3. Flexione os braços levantando a barra.\n\n4. Contraia o bíceps no topo do movimento.\n\n5. Abaixe lentamente até a posição inicial.\n\n6. Evite usar impulso do tronco.',
  },

  'Supino Inclinado': {
    image: require('../../../../assets/exercises/Supino_inclinado.gif'),
    tutorial:
      '1. Ajuste o banco em uma inclinação de aproximadamente 30 a 45 graus.\n\n2. Apoie os pés no chão e mantenha as costas firmes no banco.\n\n3. Segure a barra um pouco além da largura dos ombros.\n\n4. Desça a barra lentamente até a parte superior do peito.\n\n5. Empurre a barra para cima até estender os braços.\n\n6. Controle o movimento durante toda a execução.',
  },

  'Supino Reto': {
    image: require('../../../../assets/exercises/Supino_reto.gif'),
    tutorial:
      '1. Deite-se no banco mantendo os pés apoiados no chão.\n\n2. Posicione as mãos na barra em uma largura um pouco maior que os ombros.\n\n3. Retire a barra do suporte mantendo os braços estendidos.\n\n4. Desça a barra lentamente até a região do peito controlando o movimento.\n\n5. Empurre a barra para cima até estender os braços novamente.\n\n6. Mantenha os ombros firmes e o abdômen contraído durante toda a execução.',
  },

  'Tríceps Pulley': {
    image: require('../../../../assets/exercises/Triceps_Pulley.gif'),
    tutorial:
      '1. Posicione-se em frente à polia segurando a barra.\n\n2. Mantenha os cotovelos próximos ao corpo.\n\n3. Empurre a barra para baixo estendendo os braços.\n\n4. Contraia o tríceps no final do movimento.\n\n5. Retorne lentamente até aproximadamente 90 graus.\n\n6. Evite movimentar os ombros ou o tronco.',
  },

};

export function ExerciseTutorial({
  title,
  muscleGroups,
}: ExerciseTutorialProps) {
  const { theme, isDarkMode } =
    useTheme();
  const styles = createStyles(
    theme,
    isDarkMode
  );

  const exercise = exerciseData[title];
  const [gifUri, setGifUri] = useState<string | null>(null);

  const htmlSource = useMemo(() => {
    if (!gifUri) return null;
    const filterCss = isDarkMode
      ? 'filter: brightness(0) invert(1); -webkit-filter: brightness(0) invert(1);'
      : '';
    return `<!doctype html><html><head>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{width:100%;height:100%;overflow:hidden;background:transparent;display:flex;align-items:center;justify-content:center;}
        img{max-width:100%;max-height:100%;object-fit:contain;${filterCss}}
      </style>
    </head><body><img src="${gifUri}"/></body></html>`;
  }, [gifUri, isDarkMode]);

  useEffect(() => {
    if (!exercise?.image) return;
    setGifUri(null);
    const asset = Asset.fromModule(exercise.image);
    asset.downloadAsync().then(() => {
      // Prefer CDN uri — HTML mode loads remote URLs reliably on iOS
      setGifUri(asset.uri ?? asset.localUri ?? null);
    });
  }, [title]);

  return (

    <View style={styles.card}>

      <View style={styles.image}>
        {htmlSource ? (
          <WebView
            key={`${title}-${isDarkMode}`}
            source={{ html: htmlSource }}
            style={styles.webview}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            originWhitelist={['*']}
            allowFileAccess
            allowUniversalAccessFromFileURLs
            overScrollMode="never"
            bounces={false}
          />
        ) : (
          <ActivityIndicator
            style={{ flex: 1 }}
            color={theme.primary}
          />
        )}
      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.sectionLabel}>
        Grupo muscular
      </Text>

      <View style={styles.muscleRow}>

        {muscleGroups.map((muscle) => (

          <View
            key={muscle}
            style={styles.badge}
          >

            <Text style={styles.badgeText}>
              {muscle}
            </Text>

          </View>

        ))}

      </View>

      <Text style={styles.sectionLabel}>
        Como executar
      </Text>

      <Text style={styles.description}>
        {
          exercise?.tutorial ??
          'Tutorial não disponível.'
        }
      </Text>

    </View>

  );
}

function createStyles(
  theme: AppTheme,
  isDarkMode: boolean
) {
  return StyleSheet.create({

  card: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },

  image: {
    width: '80%',
    height: 390,
    overflow: 'hidden',
  },

  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  title: {
    color: theme.text,
    fontSize: 24,
    fontWeight: 'bold',
  },

  sectionLabel: {
    color: theme.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  muscleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  badge: {
    backgroundColor: isDarkMode
      ? 'rgba(18,247,122,0.14)'
      : 'rgba(18,247,122,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  badgeText: {
    color: theme.primary,
    fontWeight: 'bold',
  },

  description: {
    color: theme.text,
    fontSize: 16,
    lineHeight: 28,
  },

  });
}
