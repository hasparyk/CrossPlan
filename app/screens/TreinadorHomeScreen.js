import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Title, useTheme, ActivityIndicator, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import api from '../../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TreinadorHomeScreen = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalAlunos: 0,
    novosAlunos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/treinador/${user.id}/alunos/stats`);
      
      setStats({
        totalAlunos: response.data.totalAlunos || 0,
        novosAlunos: response.data.novosAlunos || 0
      });
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      setError('Não foi possível carregar as estatísticas');
      setStats({
        totalAlunos: 0,
        novosAlunos: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Limpar o token de autenticação
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('token');
      // Limpar outros dados salvos se necessário
      await AsyncStorage.removeItem('@user_data');
      await AsyncStorage.removeItem('user');
      // Chamar a função de signOut do contexto
      await signOut();
      // Navegar para a tela de login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="logout"
          size={24}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo(a), {user?.nome}</Text>
        <Text style={styles.subtitle}>Código do treinador: {user?.codigo_treinador}</Text>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Title style={styles.statsNumber}>{stats.totalAlunos}</Title>
              <Text style={styles.statsLabel}>Total de Alunos</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statsCard}>
            <Card.Content>
              <Title style={styles.statsNumber}>{stats.novosAlunos}</Title>
              <Text style={styles.statsLabel}>Novos Alunos</Text>
            </Card.Content>
          </Card>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={() => navigation.navigate('DashboardAlunos')}
        >
          Dashboard de Alunos
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={() => navigation.navigate('MontarTreinos')}
        >
          Montar Treinos
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={() => navigation.navigate('EditarFormulario')}
        >
          Editar Formulário
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 8,
    elevation: 4,
    backgroundColor: '#fff',
  },
  statsNumber: {
    fontSize: 32,
    textAlign: 'center',
    color: '#2196F3',
  },
  statsLabel: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  buttonsContainer: {
    gap: 16,
  },
  button: {
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#2196F3',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 32,
  },
  logoutButton: {
    marginRight: 8,
  },
});

export default TreinadorHomeScreen; 