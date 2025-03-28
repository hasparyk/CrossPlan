import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, BackHandler, Alert } from 'react-native';
import { Text, Checkbox, TextInput, Title, Surface, Switch, Card, IconButton, Button, HelperText, Portal, Modal, List, Divider, Avatar, Searchbar, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const EditarFormularioScreen = () => {
  const navigation = useNavigation();
  const [temAlteracoes, setTemAlteracoes] = useState(false);
  const [snackbarVisivel, setSnackbarVisivel] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState('');

  // Movendo todos os useState para o início do componente
  const [formData, setFormData] = useState({
    // Dados de treino
    praticaAtividade: null,
    quaisAtividades: '',
    praticouCrossfit: null,
    nivelCrossfit: 'iniciante',
    temCondicaoSaude: null,
    descricaoCondicaoSaude: '',
    
    // Objetivos e disponibilidade
    objetivos: {
      ganhoForca: false,
      perdaPeso: false,
      manutencaoSaude: false
    },
    interesseCampeonatos: null,
    
    // Disponibilidade semanal
    disponibilidade: {
      segunda: { 
        selecionado: false, 
        periodos: { 
          manha: { selecionado: false, tempo: '' },
          tarde: { selecionado: false, tempo: '' },
          noite: { selecionado: false, tempo: '' }
        }
      },
      terca: { 
        selecionado: false, 
        periodos: { 
          manha: { selecionado: false, tempo: '' },
          tarde: { selecionado: false, tempo: '' },
          noite: { selecionado: false, tempo: '' }
        }
      },
      quarta: { 
        selecionado: false, 
        periodos: { 
          manha: { selecionado: false, tempo: '' },
          tarde: { selecionado: false, tempo: '' },
          noite: { selecionado: false, tempo: '' }
        }
      },
      quinta: { 
        selecionado: false, 
        periodos: { 
          manha: { selecionado: false, tempo: '' },
          tarde: { selecionado: false, tempo: '' },
          noite: { selecionado: false, tempo: '' }
        }
      },
      sexta: { 
        selecionado: false, 
        periodos: { 
          manha: { selecionado: false, tempo: '' },
          tarde: { selecionado: false, tempo: '' },
          noite: { selecionado: false, tempo: '' }
        }
      },
      sabado: { 
        selecionado: false, 
        periodos: { 
          manha: { selecionado: false, tempo: '' },
          tarde: { selecionado: false, tempo: '' },
          noite: { selecionado: false, tempo: '' }
        }
      },
      domingo: { 
        selecionado: false, 
        periodos: { 
          manha: { selecionado: false, tempo: '' },
          tarde: { selecionado: false, tempo: '' },
          noite: { selecionado: false, tempo: '' }
        }
      }
    },

    // Medidas corporais
    altura: '',
    naoInformarAltura: false,
    peso: '',
    naoInformarPeso: false,
    gorduraCorporal: '',
    naoInformarGordura: false,
    naoSabeGordura: false,
  });

  const [perguntasPersonalizadas, setPerguntasPersonalizadas] = useState([]);
  const [perguntasAdicionadas, setPerguntasAdicionadas] = useState([]);
  const [enviarModalVisivel, setEnviarModalVisivel] = useState(false);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Constantes movidas para fora do componente
  const niveisDescricao = {
    iniciante: {
      titulo: 'Iniciante',
      descricao: 'Você tem menos de 1 ano de CrossFit e precisa adaptar a maioria dos movimentos.'
    },
    scale: {
      titulo: 'Scale',
      descricao: 'Você tem entre 1 e 2 anos de CrossFit e precisa adaptar alguns movimentos mais complexos.'
    },
    intermediario: {
      titulo: 'Intermediário',
      descricao: 'Você tem mais de 2 anos de CrossFit, já sabe fazer praticamente todos os movimentos, mas ainda sente dificuldades em movimentos mais avançados, como M.U, D.U, Pistol, HSW, etc.'
    },
    rx: {
      titulo: 'Rx',
      descricao: 'Você sabe fazer todos os movimentos do CrossFit (não levando em consideração a carga ou o número de repetições).'
    }
  };

  // Dados mockados - depois virão do backend
  const [novosAlunos] = useState([
    { id: 1, nome: 'João Silva', email: 'joao@email.com', dataCadastro: '2024-03-20' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', dataCadastro: '2024-03-19' },
    { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', dataCadastro: '2024-03-18' },
  ]);

  const validarCampoNumerico = (valor, min, max) => {
    if (!valor) return true;
    const numero = parseFloat(valor);
    return !isNaN(numero) && numero >= min && numero <= max;
  };

  // Carregar formulário salvo ao montar o componente
  useEffect(() => {
    carregarFormulario();
  }, []);

  // Monitorar tentativas de sair da tela
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (temAlteracoes) {
          Alert.alert(
            'Alterações não salvas',
            'Você tem alterações não salvas. Deseja sair mesmo assim?',
            [
              { text: 'Continuar editando', style: 'cancel', onPress: () => {} },
              { 
                text: 'Sair sem salvar', 
                style: 'destructive',
                onPress: () => navigation.goBack()
              }
            ]
          );
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [temAlteracoes, navigation])
  );

  // Interceptar navegação
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!temAlteracoes) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        'Alterações não salvas',
        'Você tem alterações não salvas. Deseja sair mesmo assim?',
        [
          { text: 'Continuar editando', style: 'cancel', onPress: () => {} },
          {
            text: 'Sair sem salvar',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action)
          }
        ]
      );
    });

    return unsubscribe;
  }, [temAlteracoes, navigation]);

  const carregarFormulario = async () => {
    try {
      const formularioSalvo = await AsyncStorage.getItem('@formulario');
      if (formularioSalvo) {
        const dados = JSON.parse(formularioSalvo);
        setFormData(dados.formData);
        setPerguntasAdicionadas(dados.perguntasAdicionadas);
        setTemAlteracoes(false);
      }
    } catch (error) {
      console.error('Erro ao carregar formulário:', error);
      mostrarSnackbar('Erro ao carregar formulário');
    }
  };

  const salvarFormulario = async () => {
    try {
      const formulario = {
        formData,
        perguntasAdicionadas,
        ultimaAtualizacao: new Date().toISOString()
      };

      await AsyncStorage.setItem('@formulario', JSON.stringify(formulario));
      setTemAlteracoes(false);
      mostrarSnackbar('Formulário salvo com sucesso!');

      // Aqui você implementará a integração com o backend quando estiver pronto
      console.log('Formulário salvo localmente:', formulario);
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
      mostrarSnackbar('Erro ao salvar formulário');
    }
  };

  const mostrarSnackbar = (mensagem) => {
    setSnackbarMensagem(mensagem);
    setSnackbarVisivel(true);
  };

  const formatarTempo = (value) => {
    // Remove qualquer caractere que não seja número
    const numeros = value.replace(/\D/g, '');
    
    // Se não tiver números, retorna vazio
    if (numeros.length === 0) return '';
    
    // Se tiver apenas 1 ou 2 números
    if (numeros.length <= 2) {
      return numeros.padStart(2, '0');
    }
    
    // Se tiver 3 ou 4 números
    const horas = numeros.slice(0, 2);
    const minutos = numeros.slice(2, 4);
    
    // Validar horas e minutos
    const horasNum = parseInt(horas);
    const minutosNum = parseInt(minutos);
    
    if (horasNum > 23) return '23:' + minutos;
    if (minutosNum > 59) return horas + ':59';
    
    return `${horas}:${minutos}`;
  };

  const handleChange = (field, value) => {
    const newFormData = { ...formData };

    // Gerenciamento de objetivos
    if (field.startsWith('objetivo_')) {
      const objetivo = field.replace('objetivo_', '');
      newFormData.objetivos = {
        ...newFormData.objetivos,
        [objetivo]: value
      };
    }
    // Gerenciamento de disponibilidade
    else if (field.startsWith('dia_')) {
      const [, dia] = field.split('_');
      newFormData.disponibilidade[dia].selecionado = value;
      
      // Se desmarcou o dia, limpa os períodos
      if (!value) {
        newFormData.disponibilidade[dia].periodos = {
          manha: { selecionado: false, tempo: '' },
          tarde: { selecionado: false, tempo: '' },
          noite: { selecionado: false, tempo: '' }
        };
      }
    }
    // Gerenciamento de períodos
    else if (field.startsWith('periodo_')) {
      const [, dia, periodo] = field.split('_');
      newFormData.disponibilidade[dia].periodos[periodo].selecionado = value;
      
      // Se desmarcou o período, limpa o tempo
      if (!value) {
        newFormData.disponibilidade[dia].periodos[periodo].tempo = '';
      }
    }
    // Gerenciamento de tempo
    else if (field.startsWith('tempo_')) {
      const [, dia, periodo] = field.split('_');
      newFormData.disponibilidade[dia].periodos[periodo].tempo = formatarTempo(value);
    }
    // Outros campos
    else {
      newFormData[field] = value;
    }

    setFormData(newFormData);
    setTemAlteracoes(true);
  };

  const adicionarPerguntaPersonalizada = () => {
    setTemAlteracoes(true);
    setPerguntasPersonalizadas([
      ...perguntasPersonalizadas,
      {
        id: Date.now(),
        pergunta: '',
        tipo: 'texto', // 'texto', 'checkbox', 'numero'
        opcoes: [], // para checkbox
        obrigatoria: false
      }
    ]);
  };

  const removerPergunta = (id) => {
    setTemAlteracoes(true);
    setPerguntasPersonalizadas(perguntasPersonalizadas.filter(p => p.id !== id));
  };

  const adicionarAoFormulario = (pergunta) => {
    setTemAlteracoes(true);
    // Adiciona a pergunta à seção de perguntas adicionadas
    if (!perguntasAdicionadas.find(p => p.id === pergunta.id)) {
      setPerguntasAdicionadas([...perguntasAdicionadas, pergunta]);
      // Remove a pergunta da seção de perguntas personalizadas
      setPerguntasPersonalizadas(perguntasPersonalizadas.filter(p => p.id !== pergunta.id));
    }
  };

  const removerDoFormulario = (id) => {
    setTemAlteracoes(true);
    // Ao remover do formulário, a pergunta volta para a seção de perguntas personalizadas
    const perguntaRemovida = perguntasAdicionadas.find(p => p.id === id);
    if (perguntaRemovida) {
      setPerguntasPersonalizadas([...perguntasPersonalizadas, perguntaRemovida]);
      setPerguntasAdicionadas(perguntasAdicionadas.filter(p => p.id !== id));
    }
  };

  const handleSelecionarAluno = (alunoId) => {
    if (alunosSelecionados.includes(alunoId)) {
      setAlunosSelecionados(alunosSelecionados.filter(id => id !== alunoId));
    } else {
      setAlunosSelecionados([...alunosSelecionados, alunoId]);
    }
  };

  const handleEnviarFormulario = () => {
    // Aqui você implementará a lógica para enviar o formulário para os alunos selecionados
    console.log('Enviando formulário para os alunos:', alunosSelecionados);
    setEnviarModalVisivel(false);
    setAlunosSelecionados([]);
  };

  const filteredAlunos = novosAlunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    aluno.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função auxiliar para verificar se um dia tem algum período selecionado
  const temPeriodoSelecionado = (dia) => {
    const periodos = formData.disponibilidade[dia].periodos;
    return periodos.manha.selecionado || periodos.tarde.selecionado || periodos.noite.selecionado;
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Surface style={styles.surface}>
          {/* Header com título, botão de enviar e indicador de alterações */}
          <View style={styles.header}>
            <Title style={styles.title}>Formulário de Avaliação</Title>
            <View style={styles.headerButtons}>
              {temAlteracoes && (
                <Text style={styles.alteracoesText}>Alterações não salvas</Text>
              )}
              <Button
                mode="contained"
                onPress={() => setEnviarModalVisivel(true)}
                icon="send"
                style={styles.sendButton}
              >
                Enviar
              </Button>
            </View>
          </View>

          {/* Seção de Medidas Corporais */}
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Medidas Corporais</Title>
            
            <Card style={styles.infoCard}>
              <Card.Content>
                <Text style={styles.infoText}>
                  Estas informações ajudam o seu treinador na hora de montar o treino e acompanhar a sua evolução
                </Text>
              </Card.Content>
            </Card>

            {/* Campo Altura */}
            <View style={styles.medidaContainer}>
              <Text style={styles.pergunta}>Altura (cm)</Text>
              <View style={styles.medidaInputContainer}>
                <TextInput
                  style={[styles.medidaInput, formData.naoInformarAltura && styles.inputDisabled]}
                  mode="outlined"
                  keyboardType="numeric"
                  value={formData.altura}
                  onChangeText={(text) => handleChange('altura', text)}
                  disabled={formData.naoInformarAltura}
                />
                <HelperText type="error" visible={formData.altura && !validarCampoNumerico(formData.altura, 100, 250)}>
                  Altura deve estar entre 100 e 250 cm
                </HelperText>
                <View style={styles.switchContainer}>
                  <Switch
                    value={formData.naoInformarAltura}
                    onValueChange={(value) => handleChange('naoInformarAltura', value)}
                  />
                  <Text style={styles.switchLabel}>Não desejo informar</Text>
                </View>
              </View>
            </View>

            {/* Campo Peso */}
            <View style={styles.medidaContainer}>
              <Text style={styles.pergunta}>Peso (kg)</Text>
              <View style={styles.medidaInputContainer}>
                <TextInput
                  style={[styles.medidaInput, formData.naoInformarPeso && styles.inputDisabled]}
                  mode="outlined"
                  keyboardType="numeric"
                  value={formData.peso}
                  onChangeText={(text) => handleChange('peso', text)}
                  disabled={formData.naoInformarPeso}
                />
                <HelperText type="error" visible={formData.peso && !validarCampoNumerico(formData.peso, 30, 250)}>
                  Peso deve estar entre 30 e 250 kg
                </HelperText>
                <View style={styles.switchContainer}>
                  <Switch
                    value={formData.naoInformarPeso}
                    onValueChange={(value) => handleChange('naoInformarPeso', value)}
                  />
                  <Text style={styles.switchLabel}>Não desejo informar</Text>
                </View>
              </View>
            </View>

            {/* Campo Gordura Corporal */}
            <View style={styles.medidaContainer}>
              <Text style={styles.pergunta}>Gordura Corporal (%)</Text>
              <View style={styles.medidaInputContainer}>
                <TextInput
                  style={[
                    styles.medidaInput,
                    (formData.naoInformarGordura || formData.naoSabeGordura) && styles.inputDisabled
                  ]}
                  mode="outlined"
                  keyboardType="numeric"
                  value={formData.gorduraCorporal}
                  onChangeText={(text) => handleChange('gorduraCorporal', text)}
                  disabled={formData.naoInformarGordura || formData.naoSabeGordura}
                />
                <HelperText type="error" visible={formData.gorduraCorporal && !validarCampoNumerico(formData.gorduraCorporal, 1, 70)}>
                  Percentual deve estar entre 1 e 70%
                </HelperText>
                <View style={styles.switchesContainer}>
                  <View style={styles.switchContainer}>
                    <Switch
                      value={formData.naoInformarGordura}
                      onValueChange={(value) => handleChange('naoInformarGordura', value)}
                    />
                    <Text style={styles.switchLabel}>Não desejo informar</Text>
                  </View>
                  <View style={styles.switchContainer}>
                    <Switch
                      value={formData.naoSabeGordura}
                      onValueChange={(value) => handleChange('naoSabeGordura', value)}
                    />
                    <Text style={styles.switchLabel}>Não sei</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Seção de Objetivos */}
          <Surface style={styles.section}>
            <Title style={styles.sectionTitle}>Objetivos do Treino</Title>
            <View style={styles.checkboxGroup}>
              <View style={styles.checkboxColumn}>
                <View style={styles.checkboxItem}>
                  <Checkbox.Android
                    status={formData.objetivos.ganhoForca ? 'checked' : 'unchecked'}
                    onPress={() => handleChange('objetivo_ganhoForca', !formData.objetivos.ganhoForca)}
                  />
                  <Text style={styles.checkboxLabel}>Ganho de Força</Text>
                </View>
                <View style={styles.checkboxItem}>
                  <Checkbox.Android
                    status={formData.objetivos.perdaPeso ? 'checked' : 'unchecked'}
                    onPress={() => handleChange('objetivo_perdaPeso', !formData.objetivos.perdaPeso)}
                  />
                  <Text style={styles.checkboxLabel}>Perda de Peso</Text>
                </View>
                <View style={styles.checkboxItem}>
                  <Checkbox.Android
                    status={formData.objetivos.manutencaoSaude ? 'checked' : 'unchecked'}
                    onPress={() => handleChange('objetivo_manutencaoSaude', !formData.objetivos.manutencaoSaude)}
                  />
                  <Text style={styles.checkboxLabel}>Manutenção da Saúde Física</Text>
                </View>
              </View>
            </View>
          </Surface>

          {/* Interesse em Campeonatos */}
          <Surface style={styles.section}>
            <Title style={styles.sectionTitle}>Interesse em Campeonatos</Title>
            <View style={styles.radioGroup}>
              <View style={styles.radioRow}>
                <Checkbox.Android
                  status={formData.interesseCampeonatos === true ? 'checked' : 'unchecked'}
                  onPress={() => handleChange('interesseCampeonatos', true)}
                />
                <Text>Sim</Text>
              </View>
              <View style={styles.radioRow}>
                <Checkbox.Android
                  status={formData.interesseCampeonatos === false ? 'checked' : 'unchecked'}
                  onPress={() => handleChange('interesseCampeonatos', false)}
                />
                <Text>Não</Text>
              </View>
            </View>
          </Surface>

          {/* Disponibilidade Semanal */}
          <Surface style={styles.section}>
            <Title style={styles.sectionTitle}>Disponibilidade Semanal</Title>
            <View style={styles.daysContainer}>
              {Object.entries(formData.disponibilidade).map(([dia, dados]) => (
                <Card key={dia} style={styles.dayCard}>
                  <Card.Content>
                    <View style={styles.dayHeader}>
                      <Checkbox.Android
                        status={dados.selecionado ? 'checked' : 'unchecked'}
                        onPress={() => handleChange(`dia_${dia}`, !dados.selecionado)}
                      />
                      <Text style={styles.dayTitle}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</Text>
                    </View>
                    
                    {dados.selecionado && (
                      <View style={styles.periodSection}>
                        <View style={styles.periodsColumn}>
                          <View style={styles.periodItem}>
                            <Checkbox.Android
                              status={dados.periodos.manha.selecionado ? 'checked' : 'unchecked'}
                              onPress={() => handleChange(`periodo_${dia}_manha`, !dados.periodos.manha.selecionado)}
                            />
                            <Text style={styles.periodLabel}>Manhã</Text>
                            {dados.periodos.manha.selecionado && (
                              <TextInput
                                label="Tempo da sessão (HH:MM)"
                                value={dados.periodos.manha.tempo}
                                onChangeText={(value) => handleChange(`tempo_${dia}_manha`, value)}
                                style={styles.timeInput}
                                keyboardType="numeric"
                                maxLength={5}
                                placeholder="00:00"
                              />
                            )}
                          </View>
                          <View style={styles.periodItem}>
                            <Checkbox.Android
                              status={dados.periodos.tarde.selecionado ? 'checked' : 'unchecked'}
                              onPress={() => handleChange(`periodo_${dia}_tarde`, !dados.periodos.tarde.selecionado)}
                            />
                            <Text style={styles.periodLabel}>Tarde</Text>
                            {dados.periodos.tarde.selecionado && (
                              <TextInput
                                label="Tempo da sessão (HH:MM)"
                                value={dados.periodos.tarde.tempo}
                                onChangeText={(value) => handleChange(`tempo_${dia}_tarde`, value)}
                                style={styles.timeInput}
                                keyboardType="numeric"
                                maxLength={5}
                                placeholder="00:00"
                              />
                            )}
                          </View>
                          <View style={styles.periodItem}>
                            <Checkbox.Android
                              status={dados.periodos.noite.selecionado ? 'checked' : 'unchecked'}
                              onPress={() => handleChange(`periodo_${dia}_noite`, !dados.periodos.noite.selecionado)}
                            />
                            <Text style={styles.periodLabel}>Noite</Text>
                            {dados.periodos.noite.selecionado && (
                              <TextInput
                                label="Tempo da sessão (HH:MM)"
                                value={dados.periodos.noite.tempo}
                                onChangeText={(value) => handleChange(`tempo_${dia}_noite`, value)}
                                style={styles.timeInput}
                                keyboardType="numeric"
                                maxLength={5}
                                placeholder="00:00"
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              ))}
            </View>
          </Surface>

          {/* Seção de Perguntas Adicionadas */}
          {perguntasAdicionadas.length > 0 && (
            <View style={styles.section}>
              <Title style={styles.sectionTitle}>Perguntas Adicionais</Title>
              {perguntasAdicionadas.map((pergunta) => (
                <Card key={pergunta.id} style={styles.perguntaCard}>
                  <Card.Content>
                    <View style={styles.perguntaHeader}>
                      <Text style={styles.perguntaAdicionada}>{pergunta.pergunta}</Text>
                      <IconButton
                        icon="delete"
                        onPress={() => removerDoFormulario(pergunta.id)}
                      />
                    </View>
                    
                    {pergunta.tipo === 'texto' && (
                      <TextInput
                        mode="outlined"
                        placeholder="Resposta"
                        multiline={true}
                        style={styles.input}
                      />
                    )}
                    
                    {pergunta.tipo === 'numero' && (
                      <TextInput
                        mode="outlined"
                        placeholder="Resposta numérica"
                        keyboardType="numeric"
                        style={styles.input}
                      />
                    )}
                    
                    {pergunta.tipo === 'checkbox' && (
                      <View style={styles.opcoesContainer}>
                        <View style={styles.opcao}>
                          <Checkbox.Android
                            status="unchecked"
                          />
                          <Text>Sim</Text>
                        </View>
                        <View style={styles.opcao}>
                          <Checkbox.Android
                            status="unchecked"
                          />
                          <Text>Não</Text>
                        </View>
                      </View>
                    )}
                    
                    {pergunta.obrigatoria && (
                      <Text style={styles.obrigatoriaText}>* Pergunta obrigatória</Text>
                    )}
                  </Card.Content>
                </Card>
              ))}
            </View>
          )}

          {/* Seção de Perguntas Personalizadas */}
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Perguntas Personalizadas</Title>
            <Button
              mode="contained"
              onPress={adicionarPerguntaPersonalizada}
              style={styles.addButton}
              icon="plus"
            >
              Criar nova pergunta
            </Button>

            {perguntasPersonalizadas.map((pergunta, index) => (
              <Card key={pergunta.id} style={styles.perguntaCard}>
                <Card.Content>
                  <View style={styles.perguntaHeader}>
                    <TextInput
                      style={styles.perguntaInput}
                      mode="outlined"
                      label="Pergunta"
                      value={pergunta.pergunta}
                      onChangeText={(text) => {
                        const novasPerguntas = [...perguntasPersonalizadas];
                        novasPerguntas[index].pergunta = text;
                        setPerguntasPersonalizadas(novasPerguntas);
                      }}
                    />
                    <IconButton
                      icon="delete"
                      onPress={() => removerPergunta(pergunta.id)}
                    />
                  </View>
                  
                  <View style={styles.tipoContainer}>
                    <Text>Tipo de resposta:</Text>
                    <View style={styles.tiposContainer}>
                      {['texto', 'checkbox', 'numero'].map((tipo) => (
                        <View key={tipo} style={styles.tipoOpcao}>
                          <Checkbox.Android
                            status={pergunta.tipo === tipo ? 'checked' : 'unchecked'}
                            onPress={() => {
                              const novasPerguntas = [...perguntasPersonalizadas];
                              novasPerguntas[index].tipo = tipo;
                              setPerguntasPersonalizadas(novasPerguntas);
                            }}
                          />
                          <Text>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.obrigatoriaContainer}>
                    <Switch
                      value={pergunta.obrigatoria}
                      onValueChange={(value) => {
                        const novasPerguntas = [...perguntasPersonalizadas];
                        novasPerguntas[index].obrigatoria = value;
                        setPerguntasPersonalizadas(novasPerguntas);
                      }}
                    />
                    <Text style={styles.switchLabel}>Pergunta obrigatória</Text>
                  </View>

                  <View style={styles.cardButtonsContainer}>
                    <Button
                      mode="contained"
                      onPress={() => adicionarAoFormulario(pergunta)}
                      style={styles.cardButton}
                      disabled={perguntasAdicionadas.some(p => p.id === pergunta.id)}
                    >
                      {perguntasAdicionadas.some(p => p.id === pergunta.id) 
                        ? 'Já adicionada'
                        : 'Adicionar ao Formulário'
                      }
                    </Button>
                    <IconButton
                      icon="delete"
                      onPress={() => removerPergunta(pergunta.id)}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>

          {/* Botão Salvar */}
          <Button
            mode="contained"
            onPress={salvarFormulario}
            style={[styles.saveButton, temAlteracoes && styles.saveButtonHighlight]}
            icon="content-save"
          >
            Salvar Formulário
          </Button>
        </Surface>
      </ScrollView>

      {/* Modal de Envio do Formulário */}
      <Portal>
        <Modal
          visible={enviarModalVisivel}
          onDismiss={() => {
            setEnviarModalVisivel(false);
            setAlunosSelecionados([]);
            setSearchQuery('');
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Title title="Enviar Formulário para Alunos" />
            <Card.Content>
              <Searchbar
                placeholder="Buscar alunos"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
              />

              <List.Section>
                {filteredAlunos.map((aluno) => (
                  <List.Item
                    key={aluno.id}
                    title={aluno.nome}
                    description={`Email: ${aluno.email}\nData de cadastro: ${new Date(aluno.dataCadastro).toLocaleDateString()}`}
                    left={props => (
                      <View style={styles.checkboxContainer}>
                        <Checkbox.Android
                          status={alunosSelecionados.includes(aluno.id) ? 'checked' : 'unchecked'}
                          onPress={() => handleSelecionarAluno(aluno.id)}
                        />
                      </View>
                    )}
                    right={props => (
                      <Avatar.Text 
                        size={40} 
                        label={aluno.nome.split(' ').map(n => n[0]).join('')} 
                        style={styles.avatar}
                      />
                    )}
                    style={styles.listItem}
                  />
                ))}
              </List.Section>

              {filteredAlunos.length === 0 && (
                <Text style={styles.emptyText}>Nenhum novo aluno encontrado</Text>
              )}
            </Card.Content>
            <Card.Actions style={styles.modalActions}>
              <Button 
                onPress={() => {
                  setEnviarModalVisivel(false);
                  setAlunosSelecionados([]);
                  setSearchQuery('');
                }}
              >
                Cancelar
              </Button>
              <Button 
                mode="contained"
                onPress={handleEnviarFormulario}
                disabled={alunosSelecionados.length === 0}
              >
                Enviar para {alunosSelecionados.length} aluno(s)
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>

      {/* Snackbar para feedback */}
      <Snackbar
        visible={snackbarVisivel}
        onDismiss={() => setSnackbarVisivel(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisivel(false),
        }}
      >
        {snackbarMensagem}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alteracoesText: {
    color: '#ff9800',
    marginRight: 16,
    fontSize: 12,
    fontStyle: 'italic',
  },
  sendButton: {
    marginLeft: 16,
  },
  modalContainer: {
    padding: 20,
    margin: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  pergunta: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  opcoesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  input: {
    marginTop: 8,
  },
  niveisContainer: {
    marginTop: 16,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nivelItem: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nivelTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  nivelDescricao: {
    fontSize: 14,
    color: '#666',
    marginLeft: 40,
    marginTop: 4,
  },
  subtexto: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
  },
  infoText: {
    color: '#1976d2',
    fontSize: 14,
  },
  medidaContainer: {
    marginBottom: 16,
  },
  medidaInputContainer: {
    marginTop: 8,
  },
  medidaInput: {
    marginBottom: 8,
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchesContainer: {
    marginTop: 8,
  },
  switchLabel: {
    marginLeft: 8,
  },
  perguntaCard: {
    marginBottom: 16,
  },
  perguntaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  perguntaInput: {
    flex: 1,
    marginRight: 8,
  },
  tipoContainer: {
    marginTop: 16,
  },
  tiposContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tipoOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  obrigatoriaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  cardButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  cardButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  perguntaAdicionada: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  obrigatoriaText: {
    color: '#1976d2',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  searchbar: {
    marginBottom: 16,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    backgroundColor: '#1976d2',
  },
  modalActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
  saveButtonHighlight: {
    backgroundColor: '#ff9800',
  },
  checkboxGroup: {
    marginBottom: 16,
  },
  checkboxColumn: {
    flexDirection: 'column',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  daysContainer: {
    gap: 16,
  },
  dayCard: {
    marginBottom: 0,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  periodSection: {
    marginLeft: 8,
  },
  periodsColumn: {
    flexDirection: 'column',
    gap: 12,
  },
  periodItem: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  periodLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  timeInput: {
    marginTop: 8,
    marginLeft: 40,
    height: 40,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
});

export default EditarFormularioScreen; 