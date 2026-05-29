import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Dimensions, TouchableOpacity, Modal, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../config/colors'; 

// IMPORTAÇÃO DO COMPONENTE PADRÃO
import { DevNavBar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

// IMPORTAÇÕES DO BANCO DE DADOS
import { getExerciseProgress, seedTestData, getAllExerciseNames } from '../../database/repositories/workoutRepository';
import { saveWeight, getWeightHistory } from '../../database/repositories/bodyWeightRepository';

export default function ProgressScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme, isDarkMode);
  
  const [weight, setWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [exerciseList, setExerciseList] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [lastSavedWeight, setLastSavedWeight] = useState(0);
  const [dropdownTop, setDropdownTop] = useState(0);
  const pickerButtonRef = useRef<View>(null);

  const [selectedPoint, setSelectedPoint] = useState({ date: '', value: 0 });
  
  const [chartData, setChartData] = useState<{
    labels: string[],
    datasets: { data: number[], strokeWidth?: number, color?: () => string }[]
  }>({
    labels: ["-"],
    datasets: [{ data: [0] }]
  });

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setExerciseList([]);
        setWeightHistory([]);
        return;
      }

      const init = async () => {
        // await seedTestData(); 
        await loadExercises();
        await loadWeightData();
      };
      init();
    }, [user])
  );

  useEffect(() => {
    if (selectedExercise) {
      loadChartData(selectedExercise);
    }
  }, [selectedExercise]);

  const loadExercises = async () => {
    if (!user) return;
    try {
      const names = await getAllExerciseNames(user.uid);
      setExerciseList(names);
      if (names.length > 0 && !selectedExercise) {
        setSelectedExercise(names[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar lista de exercícios:", error);
    }
  };

  const loadWeightData = async () => {
    if (!user) return;
    try {
      const history = await getWeightHistory(user.uid);
      setWeightHistory(history);
    } catch (error) {
      console.error("Erro ao carregar histórico de peso:", error);
    }
  };

  const loadChartData = async (exerciseName: string) => {
    if (!user) return;
    try {
      const progress = await getExerciseProgress(user.uid, exerciseName);
      
      if (progress && progress.length > 0) {
        setChartData({
          labels: progress.map((p, index) => {
            return progress.length > 5 && index % 2 !== 0 ? "" : p.date;
          }), 
          datasets: [{ 
            data: progress.map(p => p.max_load),
            strokeWidth: 3,
            color: () => `#00FF7F`
          }]
        });
      } else {
        setChartData({
          labels: [" ", " ", " "],
          datasets: [{ data: [0, 0, 0] }]
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do gráfico:", error);
    }
  };

  const saveBodyWeight = async () => {
    if (!user) return Alert.alert("Erro", "Faça login novamente para registrar seu peso.");
    if (!weight) return Alert.alert("Erro", "Por favor, insira o valor do seu peso.");
    try {
      const weightValue = parseFloat(weight);
      await saveWeight(user.uid, weightValue);
      setWeight('');
      await loadWeightData();
      
      setLastSavedWeight(weightValue);
      setSuccessModalVisible(true); 

    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar no banco de dados.");
    }
  };

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
       
        
        <Text style={styles.screenTitle}>Ver progresso</Text> 
    

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Selecione o Exercício:</Text>
          <TouchableOpacity
            ref={pickerButtonRef as any}
            style={styles.customPickerButton}
            onPress={() => {
              pickerButtonRef.current?.measure((_x, _y, _w, height, _pageX, pageY) => {
                setDropdownTop(pageY + height + 4);
                setExerciseModalVisible(true);
              });
            }}
          >
            <Text style={styles.customPickerText}>{selectedExercise || "Selecionar..."}</Text>
            <Ionicons name="chevron-down" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <Modal visible={exerciseModalVisible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlayTop}
            activeOpacity={1}
            onPress={() => setExerciseModalVisible(false)}
          >
            <View style={[styles.modalContent, { top: dropdownTop }]}>
              <FlatList
                data={exerciseList}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.modalItem} 
                    onPress={() => {
                      setSelectedExercise(item);
                      setExerciseModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={detailModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlayCenter}>
            <View style={styles.detailModalCard}>
              <Text style={styles.detailModalTitle}>Detalhes do Registro</Text>
              <View style={styles.detailInfoRow}>
                <Text style={styles.detailLabel}>Exercício: </Text>
                <Text style={styles.detailValue}>{selectedExercise}</Text>
              </View>
              <View style={styles.detailInfoRow}>
                <Text style={styles.detailLabel}>Data: </Text>
                <Text style={styles.detailValue}>{selectedPoint.date}</Text>
              </View>
              <View style={styles.detailInfoRow}>
                <Text style={styles.detailLabel}>Carga: </Text>
                <Text style={styles.detailValue}>{selectedPoint.value} kg</Text>
              </View>
              <TouchableOpacity 
                style={styles.detailCloseButton}
                onPress={() => setDetailModalVisible(false)}
              >
                <Text style={styles.detailCloseButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Modal de Sucesso Padronizado */}
        <Modal visible={successModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlayCenter}>
            <View style={[styles.detailModalCard, styles.successModalCard]}>
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={50} color={theme.primary} />
              </View>
              <Text style={styles.detailModalTitle}>Sucesso!</Text>
              <Text style={styles.successMessage}>
                Seu peso corporal de <Text style={styles.successWeightHighlight}>{lastSavedWeight} kg</Text> foi registrado com sucesso.
              </Text>
              <TouchableOpacity 
                style={[styles.saveButton, styles.successConfirmButton]}
                onPress={() => setSuccessModalVisible(false)}
              >
                <Text style={styles.saveButtonText}>CONFIRMAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <View style={styles.chartCard}>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 40} 
            height={220}
            chartConfig={{
              backgroundGradientFrom: theme.surface, 
              backgroundGradientTo: theme.surface,
              color: (opacity = 1) => `rgba(0, 255, 127, ${opacity})`, 
              labelColor: (opacity = 1) =>
                isDarkMode
                  ? `rgba(255, 255, 255, ${opacity})`
                  : `rgba(5, 5, 5, ${opacity})`,
              decimalPlaces: 1,
              propsForLabels: { fontSize: 10 },
              propsForDots: { r: "6", strokeWidth: "2", stroke: theme.background } 
            }}
            bezier 
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            formatXLabel={(label) => label}
            onDataPointClick={({ value, index }) => {
              setSelectedPoint({ date: chartData.labels[index], value: value });
              setDetailModalVisible(true);
            }}
          />
        </View>

        <View style={styles.centeredContainer}>
          <View style={styles.largeInputCard}>
            <Text style={styles.inputCardTitle}>Registro de Peso</Text>
            <Text style={styles.inputLabel}>Peso Corporal (kg)</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="numeric" 
              value={weight} 
              onChangeText={setWeight} 
              placeholder="0.0" 
              placeholderTextColor={theme.placeholder} 
            />
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={saveBodyWeight}
            >
              <Text style={styles.saveButtonText}>SALVAR</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Histórico do Peso Corporal:</Text>
        <View style={styles.historyContainer}>
          {weightHistory.length > 0 ? (
            weightHistory.map((item) => (
              <View key={item.id?.toString()} style={styles.historyRow}>
                <Text style={styles.historyText}>{item.date}: Peso Corporal</Text>
                <Text style={styles.historyValue}>{item.value} kg</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum peso registrado ainda.</Text>
          )}
        </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View style={styles.navBarFloatingContainer}>
        <DevNavBar
          activeRoute="Home"
          onGoHome={() => navigation.navigate('Home')}
          onGoTrainingPlan={() =>
            navigation.navigate(
              user?.perfil === 'ADMIN'
                ? 'TrainingPlanAdmin'
                : 'TrainingPlanUser'
            )
          }
          onGoWorkoutLog={() => navigation.navigate('WorkoutLog')}
          onGoAccount={() => navigation.navigate('Account')}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme, isDarkMode: boolean) {
return StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: theme.background },
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 16 },
  scrollContent: { paddingBottom: 150 },
  navBarFloatingContainer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  header: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }, 
  logo: { width: 110, height: 45 },
  screenTitle: { color: theme.text, fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'left', paddingLeft: 5 },
  sectionHeaderTitle: { color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'left', paddingLeft: 5 },
  pickerContainer: { marginBottom: 20, paddingHorizontal: 5 },
  pickerLabel: { color: theme.textSecondary, fontSize: 14, marginBottom: 8, marginLeft: 5 },
  customPickerButton: {
    backgroundColor: theme.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  customPickerText: { color: theme.text, fontSize: 16 },
  modalOverlayTop: { flex: 1, backgroundColor: 'transparent' },
  modalOverlayCenter: { flex: 1, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(5,5,5,0.38)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    position: 'absolute',
    left: 15,
    right: 15,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: theme.border },
  modalItemText: { color: theme.text, fontSize: 16 },
  detailModalCard: {
    width: '85%',
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'flex-start',
  },
  detailModalTitle: { color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20, width: '100%', textAlign: 'center' },
  detailInfoRow: { flexDirection: 'row', marginBottom: 10 },
  detailLabel: { color: theme.primary, fontSize: 16, fontWeight: 'bold' },
  detailValue: { color: theme.text, fontSize: 16 },
  detailCloseButton: { alignSelf: 'flex-end', marginTop: 10, padding: 10 },
  detailCloseButtonText: { color: theme.primary, fontSize: 16, fontWeight: 'bold' },
  successModalCard: { alignItems: 'center', paddingTop: 30 },
  successIconContainer: { marginBottom: 20 },
  successMessage: { color: theme.text, fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 22, paddingHorizontal: 10 },
  successWeightHighlight: { color: theme.primary, fontWeight: 'bold' },
  successConfirmButton: { width: '80%', marginTop: 10 },
  sectionTitle: { color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15, paddingLeft: 5 },
  chartCard: { backgroundColor: theme.surface, borderRadius: 16, padding: 10, alignItems: 'center', marginBottom: 40 },
  chart: { borderRadius: 16, paddingRight: 45, marginTop: 10 }, 
  centeredContainer: { alignItems: 'center', marginBottom: 40 },
  largeInputCard: { 
    backgroundColor: theme.surface, width: '90%', borderRadius: 25, padding: 25, 
    alignItems: 'center', borderWidth: 1, borderColor: theme.border
  },
  inputCardTitle: { color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  inputLabel: { color: theme.textSecondary, fontSize: 13, marginBottom: 15 },
  input: { 
    backgroundColor: isDarkMode ? '#FFF' : theme.surfaceVariant, width: '100%', height: 55, borderRadius: 12, color: isDarkMode ? '#000' : theme.text, 
    textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 20 
  },
  saveButton: { backgroundColor: theme.primary, width: '100%', padding: 18, borderRadius: 15, alignItems: 'center' },
  saveButtonText: { color: theme.textInverse, fontWeight: 'bold', fontSize: 16 },
  historyContainer: { backgroundColor: theme.surface, borderRadius: 15, padding: 20 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  historyText: { color: theme.textSecondary, fontSize: 15 },
  historyValue: { color: theme.primary, fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: theme.textTertiary, textAlign: 'center', marginTop: 10 },
});
}
