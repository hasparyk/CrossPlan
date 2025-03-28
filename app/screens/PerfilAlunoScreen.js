import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Card, Avatar, SegmentedButtons, List, Divider, Chip, IconButton, useTheme, ActivityIndicator, Portal, Modal, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const PERIODOS = ['Manhã', 'Tarde', 'Noite'];

// Função auxiliar para calcular a semana do ano
const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

const PerfilAlunoScreen = ({ route, navigation }) => {
  const { alunoId } = route.params;
  const [tab, setTab] = useState('historico');
  const [filtroHistorico, setFiltroHistorico] = useState('semana');
  const [aluno, setAluno] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCalendario, setShowCalendario] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchAlunoData = async () => {
      try {
        // Aqui será a chamada para a API
        // Por enquanto, usando dados mockados
        const mockAluno = {
          id: alunoId,
          nome: 'João Silva',
          foto: 'https://i.pravatar.cc/150',
          nivel: 'Iniciante',
          idade: 25,
          peso: 75,
          altura: 175,
          objetivo: 'Hipertrofia',
          ultimoTreino: '2024-03-15',
          status: 'Ativo',
          proximosTreinos: [
            {
              data: '2024-03-18',
              dia: 'Segunda',
              periodo: 'Manhã',
              treino: 'Treino A - Força',
              status: 'Agendado'
            },
            {
              data: '2024-03-20',
              dia: 'Quarta',
              periodo: 'Manhã',
              treino: 'Treino B - Hipertrofia',
              status: 'Agendado'
            },
            {
              data: '2024-03-21',
              dia: 'Quinta',
              periodo: 'Tarde',
              treino: 'Treino C - Resistência',
              status: 'Agendado'
            }
          ],
          disponibilidade: {
            segunda: ['manha'],
            quarta: ['manha', 'noite'],
            quinta: ['tarde']
          },
          prs: [
            { movimento: 'Back Squat', peso: 100, data: '2024-03-10' },
            { movimento: 'Bench Press', peso: 80, data: '2024-03-12' },
            { movimento: 'Deadlift', peso: 120, data: '2024-03-14' },
          ],
          historicoTreinos: [
            {
              data: '2024-03-15',
              treino: 'Treino A - Força',
              duracao: '60 min',
              status: 'Concluído'
            },
            {
              data: '2024-03-13',
              treino: 'Treino B - Hipertrofia',
              duracao: '75 min',
              status: 'Concluído'
            },
          ],
          respostasQuestionario: {
            objetivos: 'Ganho de massa muscular e força',
            experiencia: '6 meses',
            disponibilidade: '3x por semana',
            limitacoes: 'Dor lombar ocasional',
            preferencias: 'Treinos mais curtos e intensos'
          }
        };
        
        setAluno(mockAluno);
      } catch (error) {
        console.error('Erro ao carregar dados do aluno:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlunoData();
  }, [alunoId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!aluno) {
    return (
      <View style={styles.errorContainer}>
        <Text>Erro ao carregar dados do aluno</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <Card style={styles.headerCard}>
      <Card.Content style={styles.headerContent}>
        <Avatar.Image size={80} source={{ uri: aluno.foto }} />
        <View style={styles.headerInfo}>
          <Text variant="headlineSmall">{aluno.nome}</Text>
          <View style={styles.chipContainer}>
            <Chip icon="star" style={styles.chip}>{aluno.nivel}</Chip>
            <Chip icon="check-circle" style={styles.chip}>{aluno.status}</Chip>
          </View>
          
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>Próximo Treino</Text>
              <Text variant="bodyMedium" style={styles.statValue}>
                {aluno.proximosTreinos?.length > 0 
                  ? `${aluno.proximosTreinos[0].dia} - ${aluno.proximosTreinos[0].periodo}`
                  : 'Nenhum treino agendado'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>Último Treino</Text>
              <Text variant="bodyMedium" style={styles.statValue}>
                {aluno.ultimoTreino ? new Date(aluno.ultimoTreino).toLocaleDateString() : 'Nenhum treino realizado'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>Treinos na Semana</Text>
              <Text variant="bodyMedium" style={styles.statValue}>
                {aluno.proximosTreinos?.length || 0}
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderHistorico = () => (
    <View style={styles.section}>
      <Card style={styles.historicoCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Histórico de Treinos</Text>
            <SegmentedButtons
              value={filtroHistorico}
              onValueChange={setFiltroHistorico}
              buttons={[
                { value: 'semana', label: 'Semana' },
                { value: 'mes', label: 'Mês' },
                { value: 'todos', label: 'Todos' },
              ]}
              style={styles.filtroHistorico}
            />
          </View>
          
          {aluno.historicoTreinos.map((treino, index) => (
            <Card key={index} style={styles.treinoCard}>
              <Card.Content>
                <View style={styles.treinoHeader}>
                  <Text variant="titleMedium">{treino.treino}</Text>
                  <Chip icon="check" style={styles.statusChip}>{treino.status}</Chip>
                </View>
                <View style={styles.treinoInfo}>
                  <Text variant="bodyMedium">Data: {treino.data}</Text>
                  <Text variant="bodyMedium">Duração: {treino.duracao}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderPRs = () => (
    <View style={styles.section}>
      <Card style={styles.prsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>PRs dos Movimentos</Text>
          <View style={styles.prsGrid}>
            {aluno.prs.map((pr, index) => (
              <Card key={index} style={styles.prCard}>
                <Card.Content>
                  <View style={styles.prHeader}>
                    <Text variant="titleMedium">{pr.movimento}</Text>
                    <Text variant="headlineSmall" style={styles.prPeso}>{pr.peso}kg</Text>
                  </View>
                  <Text variant="bodyMedium">Data: {pr.data}</Text>
                  <View style={styles.prProgress}>
                    <Text variant="bodySmall" style={styles.prProgressText}>
                      +5kg desde o último PR
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderQuestionario = () => (
    <View style={styles.section}>
      <Card style={styles.questionarioCard}>
        <Card.Content>
          <List.Section>
            <List.Subheader>Objetivos</List.Subheader>
            <List.Item
              title={aluno.respostasQuestionario.objetivos}
              left={props => <List.Icon {...props} icon="target" />}
            />
            <Divider />
            <List.Subheader>Experiência</List.Subheader>
            <List.Item
              title={aluno.respostasQuestionario.experiencia}
              left={props => <List.Icon {...props} icon="clock" />}
            />
            <Divider />
            <List.Subheader>Disponibilidade</List.Subheader>
            <List.Item
              title={aluno.respostasQuestionario.disponibilidade}
              left={props => <List.Icon {...props} icon="calendar" />}
            />
            <Divider />
            <List.Subheader>Limitações</List.Subheader>
            <List.Item
              title={aluno.respostasQuestionario.limitacoes}
              left={props => <List.Icon {...props} icon="alert" />}
            />
            <Divider />
            <List.Subheader>Preferências</List.Subheader>
            <List.Item
              title={aluno.respostasQuestionario.preferencias}
              left={props => <List.Icon {...props} icon="heart" />}
            />
          </List.Section>
        </Card.Content>
      </Card>
    </View>
  );

  const renderProximosTreinos = () => (
    <View style={styles.section}>
      <Card style={styles.proximosTreinosCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Próximos Treinos</Text>
            {aluno.proximosTreinos?.length > 0 && aluno.proximosTreinos[0]?.data && (
              <Chip icon="calendar" style={styles.weekChip}>
                Semana {getWeekNumber(aluno.proximosTreinos[0].data)}
              </Chip>
            )}
          </View>
          
          {aluno.proximosTreinos?.length > 0 ? (
            aluno.proximosTreinos.map((treino, index) => (
              <View key={index} style={styles.proximoTreinoItem}>
                <View style={styles.proximoTreinoHeader}>
                  <View>
                    <Text variant="titleSmall">{treino.treino}</Text>
                    <Text variant="bodyMedium" style={styles.proximoTreinoData}>
                      {treino.dia} - {treino.periodo}
                    </Text>
                  </View>
                  <View style={styles.treinoActions}>
                    <Chip
                      mode="outlined"
                      style={styles.statusChip}
                      textStyle={styles.statusChipText}
                    >
                      {treino.status}
                    </Chip>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => {/* Editar treino */}}
                    />
                    <IconButton
                      icon="close"
                      size={20}
                      onPress={() => {/* Cancelar treino */}}
                    />
                  </View>
                </View>
                <Text variant="bodySmall" style={styles.proximoTreinoData}>
                  {treino.data ? new Date(treino.data).toLocaleDateString() : 'Data não definida'}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text variant="bodyMedium" style={styles.emptyStateText}>
                Nenhum treino agendado para esta semana
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );

  const handlePeriodoClick = (dia, periodo) => {
    if (!dia || !periodo) {
      console.warn('Dia ou período não definido');
      return;
    }
    setShowCalendario(false);
    navigation.navigate('CriarTreino', {
      alunoId,
      dia,
      periodo,
      disponibilidade: aluno.disponibilidade
    });
  };

  const renderCalendario = () => (
    <Portal>
      <Modal
        visible={showCalendario}
        onDismiss={() => setShowCalendario(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Text variant="titleLarge">Disponibilidade do Aluno</Text>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setShowCalendario(false)}
          />
        </View>
        
        <ScrollView style={styles.calendarioContainer}>
          {DIAS_SEMANA.map((dia, index) => (
            <Card key={index} style={styles.diaCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.diaTitulo}>{dia}</Text>
                <View style={styles.periodosContainer}>
                  {PERIODOS.map((periodo) => {
                    const diaLower = dia.toLowerCase();
                    const periodoLower = periodo.toLowerCase();
                    const disponivel = aluno.disponibilidade?.[diaLower]?.includes(periodoLower);
                    
                    return (
                      <Chip
                        key={periodo}
                        style={[
                          styles.periodoChip,
                          disponivel && styles.periodoDisponivel
                        ]}
                        textStyle={disponivel ? styles.periodoDisponivelText : null}
                        onPress={disponivel ? () => handlePeriodoClick(dia, periodo) : undefined}
                        disabled={!disponivel}
                      >
                        {periodo}
                      </Chip>
                    );
                  })}
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={() => setShowCalendario(false)}
            style={styles.cancelarButton}
          >
            Cancelar
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text variant="headlineMedium" style={styles.title}>Perfil do Aluno</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderHeader()}
        
        <SegmentedButtons
          value={tab}
          onValueChange={setTab}
          buttons={[
            { value: 'proximos', label: 'Próximos' },
            { value: 'historico', label: 'Histórico' },
            { value: 'prs', label: 'PRs' },
            { value: 'questionario', label: 'Informações' },
          ]}
          style={styles.tabs}
        />

        {tab === 'proximos' && renderProximosTreinos()}
        {tab === 'historico' && renderHistorico()}
        {tab === 'prs' && renderPRs()}
        {tab === 'questionario' && renderQuestionario()}
      </ScrollView>

      <Button
        mode="contained"
        onPress={() => setShowCalendario(true)}
        style={styles.fab}
        icon="plus"
      >
        Montar Treino
      </Button>

      {renderCalendario()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    margin: 0,
  },
  title: {
    marginLeft: 8,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
  },
  tabs: {
    margin: 16,
  },
  section: {
    padding: 16,
  },
  treinoCard: {
    marginBottom: 12,
    elevation: 1,
  },
  treinoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  treinoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusChip: {
    backgroundColor: '#4CAF50',
  },
  prCard: {
    marginBottom: 12,
    elevation: 1,
  },
  prHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prPeso: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  questionarioCard: {
    elevation: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  calendarioContainer: {
    padding: 16,
  },
  diaCard: {
    marginBottom: 12,
    elevation: 1,
  },
  diaTitulo: {
    marginBottom: 8,
  },
  periodosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodoChip: {
    backgroundColor: '#f5f5f5',
  },
  periodoDisponivel: {
    backgroundColor: '#2196F3',
  },
  periodoDisponivelText: {
    color: 'white',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelarButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proximosTreinosCard: {
    elevation: 1,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  proximoTreinoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  proximoTreinoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  proximoTreinoData: {
    color: '#666',
  },
  statusChip: {
    backgroundColor: '#e3f2fd',
  },
  statusChipText: {
    color: '#1976d2',
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekChip: {
    backgroundColor: '#e3f2fd',
  },
  treinoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtroHistorico: {
    width: 200,
  },
  prsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  prProgress: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  prProgressText: {
    color: '#4CAF50',
  },
  historicoCard: {
    elevation: 1,
  },
  prsCard: {
    elevation: 1,
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default PerfilAlunoScreen; 