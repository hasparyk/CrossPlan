import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
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

const ScreenAluno = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      // Supondo que, no login, você tenha salvo o objeto do usuário com a key "user"
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      }
    } catch (error) {
      console.log('Erro ao carregar os dados do usuário', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
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
      <Text style={styles.title}>Bem-vindo, {user.nome}</Text>
      <Text style={styles.info}>Telefone: {user.telefone}</Text>
      <Text style={styles.info}>Sexo: {user.sexo || 'Não informado'}</Text>
      <Text style={styles.info}>Idade: {idade ? idade + ' anos' : 'Não informada'}</Text>
      
      <Button
        title="Logout"
        onPress={async () => {
          await AsyncStorage.clear();
          navigation.replace("Login");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ScreenAluno;
