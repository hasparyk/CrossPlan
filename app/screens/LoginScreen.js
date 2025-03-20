import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from "../../src/services/authService"; // Ajuste o caminho conforme sua estrutura

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      const userData = await login(email, senha);
      // Salvar token e dados do usuário, etc.
      await AsyncStorage.setItem("token", userData.token);
      await AsyncStorage.setItem("user", JSON.stringify(userData.usuario));
  
      if (userData.usuario.tipo_usuario === "aluno") {
        navigation.replace("ScreenAluno");
      } else {
        Alert.alert("Login", "Você é treinador, mas a tela ainda não foi implementada.");
      }
    } catch (error) {
      // Converte o erro para string
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message
          ? error.message
          : JSON.stringify(error);
      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao CrossPlan</Text>

      <Text style={styles.subtitle}>Usuário:</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.subtitle}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Button title="Entrar" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>Criar uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  link: {
    color: "blue",
    marginTop: 10,
  },
});