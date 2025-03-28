import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const DashboardLayout = ({ children }) => {
  const navigation = useNavigation();
  const [active, setActive] = React.useState('home');

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Drawer.Section>
          <Drawer.Item
            icon="home"
            label="Início"
            active={active === 'home'}
            onPress={() => {
              setActive('home');
              navigation.navigate('Home');
            }}
          />
          <Drawer.Item
            icon="account-group"
            label="Alunos"
            active={active === 'alunos'}
            onPress={() => {
              setActive('alunos');
              navigation.navigate('Alunos');
            }}
          />
          <Drawer.Item
            icon="dumbbell"
            label="Exercícios"
            active={active === 'exercicios'}
            onPress={() => {
              setActive('exercicios');
              navigation.navigate('Exercicios');
            }}
          />
          <Drawer.Item
            icon="calendar"
            label="Treinos"
            active={active === 'treinos'}
            onPress={() => {
              setActive('treinos');
              navigation.navigate('Treinos');
            }}
          />
          <Drawer.Item
            icon="account"
            label="Perfil"
            active={active === 'perfil'}
            onPress={() => {
              setActive('perfil');
              navigation.navigate('Perfil');
            }}
          />
        </Drawer.Section>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 240,
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default DashboardLayout; 