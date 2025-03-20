import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../src/services/api';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // Obter o token armazenado
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.usuarios);
    } catch (error) {
      console.log('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.nome}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Telefone: {item.telefone}</Text>
            {item.tipo_usuario === 'aluno' && (
              <>
                <Text>Idade: {item.idade ? item.idade + ' anos' : 'N/A'}</Text>
                <Text>Sexo: {item.sexo || 'N/A'}</Text>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  userItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserListScreen;
