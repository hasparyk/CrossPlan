import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { Text, TextInput, IconButton, Button, Card, Portal, Modal, List, Searchbar, SegmentedButtons, Chip, Menu, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { exercicios } from '../data/exercicios';

const CriarTreinoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dia, periodo } = route.params;

  // Estados principais
  const [nomeTreino, setNomeTreino] = useState('');
  const [blocos, setBlocos] = useState([]);
  
  // Estados dos modais
  const [showAddBlocoModal, setShowAddBlocoModal] = useState(false);
  const [showExercicioModal, setShowExercicioModal] = useState(false);
  const [showFormatoModal, setShowFormatoModal] = useState(false);
  
  // Estados de edição
  const [blocoAtual, setBlocoAtual] = useState(null);
  const [exercicioSearch, setExercicioSearch] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');
  const [exercicioPersonalizado, setExercicioPersonalizado] = useState('');
  
  // Tipos de blocos
  const TIPOS_BLOCO = [
    { id: 'alongamento', nome: 'Alongamento' },
    { id: 'aquecimento', nome: 'Aquecimento' },
    { id: 'forca', nome: 'Força' },
    { id: 'tecnica', nome: 'Técnica' },
    { id: 'condicionamento', nome: 'Condicionamento' },
    { id: 'corrida', nome: 'Corrida' },
    { id: 'lpo', nome: 'LPO' },
    { id: 'ginastica', nome: 'Ginástica' },
    { id: 'personalizado', nome: 'Personalizado' }
  ];
  
  // Formatos de treino
  const FORMATOS_TREINO = [
    { id: 'rounds', nome: 'Rounds', configLabel: 'Número de rounds' },
    { id: 'emom', nome: 'EMOM', configLabel: 'Duração (minutos)' },
    { id: 'amrap', nome: 'AMRAP', configLabel: 'Duração (minutos)' },
    { id: 'forTime', nome: 'For Time', configLabel: 'Tempo limite (minutos)' },
    { id: 'intervalo', nome: 'Intervalo', configLabel: 'A cada (minutos)' },
    { id: 'complexo', nome: 'Complexo', configLabel: 'Séries x Reps' },
    { id: 'livre', nome: 'Livre', configLabel: '' },
  ];

  // Funções para gerenciar blocos
  const handleAddBloco = (tipo) => {
    const novoBloco = {
      id: Date.now(),
      tipo: tipo,
      titulo: TIPOS_BLOCO.find(t => t.id === tipo).nome,
      formato: null,
      configFormato: '',
      exercicios: []
    };
    
    // Adiciona o bloco diretamente à lista de blocos
    setBlocos([...blocos, novoBloco]);
    setShowAddBlocoModal(false);
  };
  
  const handleSetFormato = (formato) => {
    if (!blocoAtual) return;
    
    const blocoAtualizado = {
      ...blocoAtual,
      formato: formato,
    };
    
    setBlocoAtual(blocoAtualizado);
  };
  
  const handleUpdateBlocoConfig = (blocoId, campo, valor) => {
    setBlocos(blocos.map(b => 
      b.id === blocoId ? { ...b, [campo]: valor } : b
    ));
  };
  
  const handleDeleteBloco = (blocoId) => {
    setBlocos(blocos.filter(b => b.id !== blocoId));
  };

  // Funções para gerenciar exercícios
  const handleAddExercicio = (exercicio, isPersonalizado = false) => {
    if (!blocoAtual) return;
    
    const novoExercicio = {
      id: Date.now(),
      nome: isPersonalizado ? exercicioPersonalizado : exercicio.nome,
      categoria: isPersonalizado ? 'personalizado' : exercicio.categoria,
      seriesReps: blocoAtual.tipo === 'lpo' || blocoAtual.tipo === 'forca' ? '3x10' : '3',
      carga: '',
      cargaProgressao: '',
      duracao: '',
      distancia: '',
      pace: '',
      descanso: '',
      observacoes: '',
      isComplexo: false
    };
    
    const blocoAtualizado = {
      ...blocoAtual,
      exercicios: [...blocoAtual.exercicios, novoExercicio]
    };
    
    setBlocos(blocos.map(b => 
      b.id === blocoAtual.id ? blocoAtualizado : b
    ));
    
    setBlocoAtual(blocoAtualizado);
    setShowExercicioModal(false);
    setExercicioSearch('');
    setExercicioPersonalizado('');
  };
  
  const handleUpdateExercicio = (blocoId, exercicioId, campo, valor) => {
    setBlocos(blocos.map(b => {
      if (b.id !== blocoId) return b;
      
      return {
        ...b,
        exercicios: b.exercicios.map(ex => 
          ex.id === exercicioId ? { ...ex, [campo]: valor } : ex
        )
      };
    }));
  };
  
  const handleDeleteExercicio = (blocoId, exercicioId) => {
    setBlocos(blocos.map(b => {
      if (b.id !== blocoId) return b;
      
      return {
        ...b,
        exercicios: b.exercicios.filter(ex => ex.id !== exercicioId)
      };
    }));
  };

  const handleSalvarTreino = () => {
    if (!nomeTreino.trim()) {
      alert('Por favor, insira um nome para o treino');
      return;
    }

    const treino = {
      nome: nomeTreino,
      dia,
      periodo,
      blocos: blocos
    };

    // Aqui você implementará a lógica para salvar o treino
    console.log('Treino salvo:', treino);
    navigation.goBack();
  };

  // Filtro de exercícios
  const filteredExercicios = () => {
    let todosExercicios = [];
    if (categoriaSelecionada === 'todos' || categoriaSelecionada === 'lpo') {
      todosExercicios = [...todosExercicios, ...exercicios.lpo];
    }
    if (categoriaSelecionada === 'todos' || categoriaSelecionada === 'ginasticos') {
      todosExercicios = [...todosExercicios, ...exercicios.ginasticos];
    }
    if (categoriaSelecionada === 'todos' || categoriaSelecionada === 'genericos') {
      todosExercicios = [...todosExercicios, ...exercicios.genericos];
    }

    if (!exercicioSearch) return todosExercicios;
    
    return todosExercicios.filter(exercicio =>
      exercicio.nome.toLowerCase().includes(exercicioSearch.toLowerCase()) ||
      exercicio.descricao.toLowerCase().includes(exercicioSearch.toLowerCase())
    );
  };

  // Renderização de componentes
  const renderExercicio = (exercicio, blocoId, index) => {
    const isLPO = exercicio.categoria === 'lpo';
    const isComplexo = exercicio.isComplexo;
    
    return (
      <Card key={exercicio.id} style={styles.exercicioCard}>
        <Card.Content>
          <View style={styles.exercicioHeader}>
            <Text variant="titleMedium">{index + 1}. {exercicio.nome}</Text>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteExercicio(blocoId, exercicio.id)}
            />
          </View>
          
          {/* Campo para séries e repetições com formato livre */}
          <TextInput
            label={isLPO ? "Séries x Reps (ex: 5x3 ou 3x1+2)" : "Séries x Reps"}
            value={exercicio.seriesReps}
            onChangeText={(text) => handleUpdateExercicio(blocoId, exercicio.id, 'seriesReps', text)}
            style={styles.fullWidthInput}
            placeholder={isLPO ? "Ex: 5x3, 4x1+3, 3x5" : "Ex: 3x10, 4x8"}
          />
          
          <View style={styles.exercicioInputs}>
            {(isLPO) && (
              <>
                <TextInput
                  label="Carga (kg)"
                  value={exercicio.carga}
                  onChangeText={(text) => handleUpdateExercicio(blocoId, exercicio.id, 'carga', text)}
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ex: 70kg ou 60-80kg"
                />
                <TextInput
                  label="Descanso"
                  value={exercicio.descanso}
                  onChangeText={(text) => handleUpdateExercicio(blocoId, exercicio.id, 'descanso', text)}
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ex: 1' ou 90\"
                />
              </>
            )}
            
            {exercicio.categoria === 'genericos' && (
              <>
                <TextInput
                  label="Distância"
                  value={exercicio.distancia}
                  onChangeText={(text) => handleUpdateExercicio(blocoId, exercicio.id, 'distancia', text)}
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ex: 400m ou 1km"
                />
                <TextInput
                  label="Pace"
                  value={exercicio.pace}
                  onChangeText={(text) => handleUpdateExercicio(blocoId, exercicio.id, 'pace', text)}
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ex: 5:00-5:30"
                />
              </>
            )}
          </View>
          
          <TextInput
            label="Observações"
            value={exercicio.observacoes}
            onChangeText={(text) => handleUpdateExercicio(blocoId, exercicio.id, 'observacoes', text)}
            style={styles.fullWidthInput}
            placeholder="Ex: elástico vermelho, unilateral, etc."
          />
        </Card.Content>
      </Card>
    );
  };

  const renderBloco = (bloco) => {
    return (
      <Card style={styles.blocoCard} key={bloco.id}>
        <Card.Title
          title={bloco.titulo}
          right={(props) => (
            <IconButton
              {...props}
              icon="delete"
              onPress={() => handleDeleteBloco(bloco.id)}
            />
          )}
        />
        <Card.Content>
          {bloco.exercicios.map((exercicio, index) => 
            renderExercicio(exercicio, bloco.id, index)
          )}
          <Button
            mode="outlined"
            icon="plus"
            onPress={() => {
              setBlocoAtual(bloco);
              setShowExercicioModal(true);
            }}
            style={styles.addExercicioButton}
          >
            Adicionar Exercício
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.title}>Criar Treino</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {dia} - {periodo}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <TextInput
          label="Nome do Treino"
          value={nomeTreino}
          onChangeText={setNomeTreino}
          style={styles.nomeInput}
        />
        
        <ScrollView contentContainerStyle={styles.blocosContainer}>
          {blocos.map(bloco => renderBloco(bloco))}
          <Button
            mode="contained"
            icon="plus"
            onPress={() => setShowAddBlocoModal(true)}
            style={styles.addButton}
          >
            Adicionar Bloco
          </Button>
        </ScrollView>
      </View>
      
      {/* Modal para adicionar um bloco */}
      <Portal>
        <Modal
          visible={showAddBlocoModal}
          onDismiss={() => setShowAddBlocoModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text variant="titleLarge" style={styles.modalTitle}>Selecione o tipo de bloco</Text>
            
            <FlatList
              data={TIPOS_BLOCO}
              renderItem={({ item }) => (
                <List.Item
                  title={item.nome}
                  onPress={() => handleAddBloco(item.id)}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />
              )}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <Divider />}
            />
            
            <Button
              mode="outlined"
              onPress={() => setShowAddBlocoModal(false)}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
          </View>
        </Modal>
      </Portal>
      
      {/* Modal para selecionar formato do bloco */}
      <Portal>
        <Modal
          visible={showFormatoModal}
          onDismiss={() => setShowFormatoModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text variant="titleLarge" style={styles.modalTitle}>
              {blocoAtual?.formatoSecundario ? 'Selecione o formato secundário' : 'Selecione o formato'}
            </Text>
            
            <FlatList
              data={FORMATOS_TREINO}
              renderItem={({ item }) => (
                <List.Item
                  title={item.nome}
                  onPress={() => {
                    if (blocoAtual?.formato && !blocoAtual?.formatoSecundario) {
                      // Adicionando formato secundário
                      handleUpdateBlocoConfig(blocoAtual.id, 'formatoSecundario', item.id);
                    } else {
                      // Adicionando formato primário
                      handleSetFormato(item.id);
                    }
                    setShowFormatoModal(false);
                  }}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />
              )}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <Divider />}
            />
            
            <Button
              mode="outlined"
              onPress={() => setShowFormatoModal(false)}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Modal para adicionar exercício */}
      <Portal>
        <Modal
          visible={showExercicioModal}
          onDismiss={() => setShowExercicioModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text variant="titleLarge" style={styles.modalTitle}>Adicionar Exercício</Text>
            
            <SegmentedButtons
              value={categoriaSelecionada}
              onValueChange={setCategoriaSelecionada}
              buttons={[
                { value: 'todos', label: 'Todos' },
                { value: 'lpo', label: 'LPO' },
                { value: 'ginasticos', label: 'Ginásticos' },
                { value: 'genericos', label: 'Genéricos' },
              ]}
              style={styles.categoriaButtons}
            />
            
            <TextInput
              label="Exercício personalizado"
              value={exercicioPersonalizado}
              onChangeText={setExercicioPersonalizado}
              style={styles.personalizadoInput}
              placeholder="Digite um exercício que não está na lista"
            />
            
            {exercicioPersonalizado ? (
              <Button
                mode="contained"
                onPress={() => handleAddExercicio(null, true)}
                style={{ marginVertical: 8 }}
              >
                Adicionar "{exercicioPersonalizado}"
              </Button>
            ) : (
              <>
                <Searchbar
                  placeholder="Buscar exercício..."
                  onChangeText={setExercicioSearch}
                  value={exercicioSearch}
                  style={styles.searchBar}
                />

                <FlatList
                  data={filteredExercicios()}
                  renderItem={({ item }) => (
                    <List.Item
                      title={item.nome}
                      description={item.descricao}
                      onPress={() => handleAddExercicio(item)}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </>
            )}
          </View>
        </Modal>
      </Portal>

      <Button
        mode="contained"
        onPress={handleSalvarTreino}
        style={styles.saveButton}
      >
        Salvar Treino
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    color: 'white',
  },
  subtitle: {
    color: '#e3f2fd',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  nomeInput: {
    marginBottom: 16,
  },
  blocosContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Espaço para o botão de salvar
  },
  blocoCard: {
    marginBottom: 16,
  },
  exercicioCard: {
    marginBottom: 8,
  },
  exercicioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exercicioInputs: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  input: {
    marginRight: 8,
    marginBottom: 8,
  },
  fullWidthInput: {
    marginBottom: 8,
  },
  addExercicioButton: {
    marginTop: 8,
  },
  addButton: {
    marginTop: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalContent: {
    padding: 16,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 16,
  },
  categoriaButtons: {
    marginBottom: 16,
  },
  personalizadoInput: {
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  saveButton: {
    margin: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default CriarTreinoScreen; 