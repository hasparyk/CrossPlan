import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from './contexts/AuthContext';

// Telas de autenticação
import LoginScreen from "./screens/LoginScreen";
import CadastroScreen from "./screens/CadastroScreen";
import RecuperarSenhaScreen from "./screens/RecuperarSenhaScreen";
import RedefinirSenhaScreen from "./screens/RedefinirSenhaScreen";

// Telas do treinador
import TreinadorHomeScreen from "./screens/TreinadorHomeScreen";
import DashboardAlunosScreen from "./screens/DashboardAlunosScreen";
import MontarTreinosScreen from "./screens/MontarTreinosScreen";
import EditarFormularioScreen from "./screens/EditarFormularioScreen";
import CriarTreinoScreen from "./screens/CriarTreinoScreen";
import PerfilAlunoScreen from "./screens/PerfilAlunoScreen";

// Telas do aluno
import ScreenAluno from "./screens/ScreenAluno";

const Stack = createStackNavigator();

export default function Navigation() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {!user ? (
          // Rotas públicas
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Cadastro" 
              component={CadastroScreen} 
            />
            <Stack.Screen 
              name="RecuperarSenha" 
              component={RecuperarSenhaScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="RedefinirSenha" 
              component={RedefinirSenhaScreen} 
              options={{ headerShown: false }} 
            />
          </>
        ) : (
          // Rotas protegidas
          <>
            {user.tipo_usuario === 'treinador' ? (
              // Rotas do treinador
              <>
                <Stack.Screen 
                  name="TreinadorHomeScreen" 
                  component={TreinadorHomeScreen} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="DashboardAlunos" 
                  component={DashboardAlunosScreen}
                  options={{ 
                    title: "Dashboard de Alunos",
                    headerStyle: {
                      backgroundColor: '#2196F3',
                    },
                    headerTintColor: '#fff',
                  }}
                />
                <Stack.Screen 
                  name="MontarTreinos" 
                  component={MontarTreinosScreen}
                  options={{ 
                    title: "Montar Treinos",
                    headerStyle: {
                      backgroundColor: '#2196F3',
                    },
                    headerTintColor: '#fff',
                  }}
                />
                <Stack.Screen 
                  name="CriarTreino" 
                  component={CriarTreinoScreen}
                  options={{ 
                    title: "Criar Treino",
                    headerStyle: {
                      backgroundColor: '#2196F3',
                    },
                    headerTintColor: '#fff',
                    headerShown: false,
                  }}
                />
                <Stack.Screen 
                  name="EditarFormulario" 
                  component={EditarFormularioScreen}
                  options={{ 
                    title: "Editar Formulário",
                    headerStyle: {
                      backgroundColor: '#2196F3',
                    },
                    headerTintColor: '#fff',
                  }}
                />
                <Stack.Screen 
                  name="PerfilAluno" 
                  component={PerfilAlunoScreen}
                  options={{ 
                    title: "Perfil do Aluno",
                    headerStyle: {
                      backgroundColor: '#2196F3',
                    },
                    headerTintColor: '#fff',
                    headerShown: false,
                  }}
                />
              </>
            ) : (
              // Rotas do aluno
              <>
                <Stack.Screen 
                  name="ScreenAluno" 
                  component={ScreenAluno} 
                  options={{ title: "Área do Aluno" }} 
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
