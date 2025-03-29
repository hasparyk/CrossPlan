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
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('@user_data');
      await AsyncStorage.removeItem('user');
      await signOut();
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
        <ActivityIndicator size="large" color="#e57417" />
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
          <View style={styles.statCardShadow}>
            <Card style={styles.statsCard}>
              <Card.Content style={styles.statsCardContent}>
                <View style={[styles.statsIconContainer, styles.totalAlunosIcon]}>
                  <Text style={styles.statsIconText}>👥</Text>
                </View>
                <View style={styles.statsTextContainer}>
                  <Text style={styles.statsNumber}>{stats.totalAlunos}</Text>
                  <Text style={styles.statsLabel}>Total de Alunos</Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.statCardShadow}>
            <Card style={styles.statsCard}>
              <Card.Content style={styles.statsCardContent}>
                <View style={[styles.statsIconContainer, styles.novosAlunosIcon]}>
                  <Text style={styles.statsIconText}>✨</Text>
                </View>
                <View style={styles.statsTextContainer}>
                  <Text style={styles.statsNumber}>{stats.novosAlunos}</Text>
                  <Text style={styles.statsLabel}>Novos Alunos</Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonShadow}>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            onPress={() => navigation.navigate('DashboardAlunos')}
          >
            Dashboard de Alunos
          </Button>
        </View>

        <View style={styles.buttonShadow}>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            onPress={() => navigation.navigate('MontarTreinos')}
          >
            Montar Treinos
          </Button>
        </View>

        <View style={styles.buttonShadow}>
          <Button
            mode="outlined"
            style={styles.outlineButton}
            labelStyle={styles.outlineButtonLabel}
            onPress={() => navigation.navigate('EditarFormulario')}
          >
            Editar Formulário
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e3e8',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c2a60',
  },
  subtitle: {
    fontSize: 16,
    color: '#a7a7af',
    marginTop: 8,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCardShadow: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
  },
  statsCard: {
    borderRadius: 12,
    elevation: 0,
    backgroundColor: '#fff',
  },
  statsCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  statsIconContainer: {
    marginRight: 16,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalAlunosIcon: {
    backgroundColor: 'rgba(12, 42, 96, 0.1)',
  },
  novosAlunosIcon: {
    backgroundColor: 'rgba(229, 116, 23, 0.1)',
  },
  statsIconText: {
    fontSize: 24,
  },
  statsTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0c2a60',
  },
  statsLabel: {
    color: '#a7a7af',
    marginTop: 2,
    fontSize: 14,
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  buttonShadow: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
  },
  button: {
    height: 56,
    justifyContent: 'center',
    borderRadius: 12,
    elevation: 0,
    backgroundColor: '#e57417',
  },
  outlineButton: {
    height: 56,
    justifyContent: 'center',
    borderRadius: 12,
    borderColor: '#0c2a60',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c2a60',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 16,
  },
  logoutButton: {
    marginRight: 8,
  },
});

export default TreinadorHomeScreen; 