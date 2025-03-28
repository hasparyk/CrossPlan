import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const DashboardAlunosScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Dashboard de Alunos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default DashboardAlunosScreen; 