import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, Title, Searchbar, Chip, Card, Avatar, Badge, Portal, Modal, Button, IconButton, Divider, List, FAB} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const MontarTreinosScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNivel, setSelectedNivel] = useState(null);
  const [showPriority, setShowPriority] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dados mockados para desenvolvimento
  const mockAlunos = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      nivel: 'iniciante',
      proximoTreino: '2024-03-25',
      treinosProgramados: 2,
      ultimoTreino: '2024-03-22',
      diasTreino: ['segunda', 'quarta', 'sexta'],
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@email.com',
      nivel: 'scale',
      proximoTreino: '2024-03-26',
      treinosProgramados: 5,
      ultimoTreino: '2024-03-24',
      diasTreino: ['terça', 'quinta'],
    },
    {
      id: 3,
      nome: 'Pedro Oliveira',
      email: 'pedro@email.com',
      nivel: 'intermediario',
      proximoTreino: '2024-03-25',
      treinosProgramados: 1,
      ultimoTreino: '2024-03-20',
      diasTreino: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
    },
    {
      id: 4,
      nome: 'Ana Costa',
      email: 'ana@email.com',
      nivel: 'rx',
      proximoTreino: '2024-03-25',
      treinosProgramados: 4,
      ultimoTreino: '2024-03-23',
      diasTreino: ['segunda', 'quarta', 'sexta'],
    },
  ];

  // Simula carregamento inicial dos dados
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        // Aqui será a chamada para a API
        setAlunos(mockAlunos);
        setFilteredAlunos(mockAlunos);
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  // Filtra alunos baseado na busca, nível e prioridade
  useEffect(() => {
    let filtered = [...alunos];

    // Filtro de busca
    if (searchQuery) {
      filtered = filtered.filter(aluno =>
        aluno.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aluno.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de nível
    if (selectedNivel) {
      filtered = filtered.filter(aluno => aluno.nivel === selectedNivel);
    }

    // Filtro de prioridade - agora mostra alunos com 3 ou menos treinos programados
    if (showPriority) {
      filtered = filtered.filter(aluno => aluno.treinosProgramados <= 3);
    }

    setFilteredAlunos(filtered);
  }, [searchQuery, selectedNivel, showPriority, alunos]);

  const handleAlunoPress = (alunoId) => {
    // Aqui será a navegação para a tela do aluno
    navigation.navigate('PerfilAluno', { alunoId });
  };

  const getNivelColor = (nivel) => {
    const colors = {
      iniciante: '#4CAF50',
      scale: '#2196F3',
      intermediario: '#FF9800',
      rx: '#F44336'
    };
    return colors[nivel] || '#757575';
  };

  const renderPriorityBadge = (treinosProgramados) => {
    if (treinosProgramados <= 3) {
      const badgeStyle = {
        backgroundColor: treinosProgramados <= 1 ? '#F44336' : // Vermelho para 0-1 treinos
                        treinosProgramados <= 2 ? '#FF9800' : // Laranja para 2 treinos
                        '#FFC107' // Amarelo para 3 treinos
      };

      return (
        <Badge
          style={[styles.priorityBadge, badgeStyle]}
        >
          !
        </Badge>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        {/* Header com título e botões de ação */}
        <View style={styles.header}>
          <Title style={styles.title}>Alunos</Title>
          <IconButton
            icon="plus"
            mode="contained"
            onPress={() => navigation.navigate('CriarTreino')}
          />
        </View>

        {/* Barra de busca */}
        <Searchbar
          placeholder="Buscar alunos"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Filtros */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <Chip
            selected={showPriority}
            onPress={() => setShowPriority(!showPriority)}
            style={styles.filterChip}
            icon="alert"
          >
            Prioridade
          </Chip>
          <Chip
            selected={selectedNivel === 'iniciante'}
            onPress={() => setSelectedNivel(selectedNivel === 'iniciante' ? null : 'iniciante')}
            style={styles.filterChip}
          >
            Iniciante
          </Chip>
          <Chip
            selected={selectedNivel === 'scale'}
            onPress={() => setSelectedNivel(selectedNivel === 'scale' ? null : 'scale')}
            style={styles.filterChip}
          >
            Scale
          </Chip>
          <Chip
            selected={selectedNivel === 'intermediario'}
            onPress={() => setSelectedNivel(selectedNivel === 'intermediario' ? null : 'intermediario')}
            style={styles.filterChip}
          >
            Intermediário
          </Chip>
          <Chip
            selected={selectedNivel === 'rx'}
            onPress={() => setSelectedNivel(selectedNivel === 'rx' ? null : 'rx')}
            style={styles.filterChip}
          >
            RX
          </Chip>
        </ScrollView>

        {/* Lista de Alunos */}
        <ScrollView style={styles.alunosContainer}>
          {filteredAlunos.map((aluno) => (
            <Card
              key={aluno.id}
              style={styles.alunoCard}
              onPress={() => handleAlunoPress(aluno.id)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.alunoInfo}>
                  <Avatar.Text
                    size={50}
                    label={aluno.nome.split(' ').map(n => n[0]).join('')}
                    style={[styles.avatar, { backgroundColor: getNivelColor(aluno.nivel) }]}
                  />
                  <View style={styles.alunoDetails}>
                    <Text style={styles.alunoNome}>{aluno.nome}</Text>
                    <Text style={styles.alunoNivel}>
                      {aluno.nivel.charAt(0).toUpperCase() + aluno.nivel.slice(1)}
                    </Text>
                    <View style={styles.treinoInfo}>
                      <Text style={styles.alunoUltimoTreino}>
                        Último treino: {new Date(aluno.ultimoTreino).toLocaleDateString()}
                      </Text>
                      <Text style={[
                        styles.treinosProgramados,
                        { color: aluno.treinosProgramados <= 3 ? '#F44336' : '#4CAF50' }
                      ]}>
                        {aluno.treinosProgramados} treinos programados
                      </Text>
                    </View>
                  </View>
                </View>
                {renderPriorityBadge(aluno.treinosProgramados)}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    flex: 1,
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  alunosContainer: {
    flex: 1,
    padding: 16,
  },
  alunoCard: {
    marginBottom: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alunoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 16,
  },
  alunoDetails: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alunoNivel: {
    fontSize: 14,
    color: '#666',
  },
  alunoUltimoTreino: {
    fontSize: 12,
    color: '#999',
  },
  treinoInfo: {
    marginTop: 4,
  },
  treinosProgramados: {
    fontSize: 12,
    marginTop: 2,
  },
  priorityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
  activationDistance: {
    activationDistance: 20,
  },
  dragHitSlop: {
    dragHitSlop: { top: 0, bottom: 0, left: 0, right: 0 },
  },
});

export default MontarTreinosScreen; 