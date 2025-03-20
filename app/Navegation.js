import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import CadastroScreen from "./screens/CadastroScreen";
import UserListScreen from './screens/UserListScreen';
import ScreenAluno from "./screens/ScreenAluno";


const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserList" component={UserListScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="ScreenAluno" component={ScreenAluno} options={{ title: "Área do Aluno" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
