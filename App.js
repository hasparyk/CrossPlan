import React from "react";
import 'react-native-reanimated';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './app/contexts/AuthContext';
import { AppRegistry } from 'react-native';

// Telas de autenticação
import LoginScreen from "./app/screens/LoginScreen";
import CadastroScreen from "./app/screens/CadastroScreen";
import RecuperarSenhaScreen from "./app/screens/RecuperarSenhaScreen";
import RedefinirSenhaScreen from "./app/screens/RedefinirSenhaScreen";

// Telas do treinador
import TreinadorHomeScreen from "./app/screens/TreinadorHomeScreen";
import DashboardAlunosScreen from "./app/screens/DashboardAlunosScreen";
import MontarTreinosScreen from "./app/screens/MontarTreinosScreen";
import EditarFormularioScreen from "./app/screens/EditarFormularioScreen";
import CriarTreinoScreen from "./app/screens/CriarTreinoScreen";
import PerfilAlunoScreen from "./app/screens/PerfilAlunoScreen";

// Telas do aluno
import ScreenAluno from "./app/screens/ScreenAluno";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2196F3',
              },
              headerTintColor: '#fff',
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Cadastro" 
              component={CadastroScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="RecuperarSenha" 
              component={RecuperarSenhaScreen} 
              options={{ title: "Recuperar Senha" }} 
            />
            <Stack.Screen 
              name="RedefinirSenha" 
              component={RedefinirSenhaScreen} 
              options={{ title: "Redefinir Senha" }} 
            />
            <Stack.Screen 
              name="TreinadorHomeScreen" 
              component={TreinadorHomeScreen} 
              options={{ 
                title: "Área do Treinador",
                headerLeft: null 
              }} 
            />
            <Stack.Screen 
              name="DashboardAlunos" 
              component={DashboardAlunosScreen}
              options={{ title: "Dashboard de Alunos" }}
            />
            <Stack.Screen 
              name="MontarTreinos" 
              component={MontarTreinosScreen}
              options={{ title: "Montar Treinos" }}
            />
            <Stack.Screen 
              name="EditarFormulario" 
              component={EditarFormularioScreen}
              options={{ title: "Editar Formulário" }}
            />
            <Stack.Screen 
              name="ScreenAluno" 
              component={ScreenAluno} 
              options={{ 
                title: "Área do Aluno",
                headerLeft: null
              }} 
            />
            <Stack.Screen 
              name="CriarTreino" 
              component={CriarTreinoScreen} 
              options={{ title: "Criar Treino" }}
            />
            <Stack.Screen 
              name="PerfilAluno" 
              component={PerfilAlunoScreen} 
              options={{ 
                title: "Perfil do Aluno",
                headerShown: false
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}