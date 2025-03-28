import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para calcular a idade a partir da data de nascimento (formato "YYYY-MM-DD")
const calculateAge = (dateString) => {
  if (!dateString) return '';
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const ScreenAluno = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(false);
    } catch (error) {
      console.log('Erro ao carregar os dados do usuário', error);
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
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Usuário não encontrado.</Text>
      </View>
    );
  }

  // Calcula a idade usando o campo data_nascimento (assumindo formato "YYYY-MM-DD")
  const idade = calculateAge(user.data_nascimento);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo, {user.nome}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.info}>Telefone: {user.telefone}</Text>
        <Text style={styles.info}>Sexo: {user.sexo || 'Não informado'}</Text>
        <Text style={styles.info}>Idade: {idade ? idade + ' anos' : 'Não informada'}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  logoutButton: {
    marginRight: 8,
  },
});

export default ScreenAluno;
