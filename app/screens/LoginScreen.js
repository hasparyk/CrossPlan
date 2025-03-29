import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from "../../src/services/authService";
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validação de e-mail
    if (!email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "E-mail inválido";
    }

    // Validação de senha
    if (!senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (senha.length < 6) {
      newErrors.senha = "Senha incorreta";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = await login(email, senha);
      if (!userData.token) {
        throw new Error("Token não recebido da API");
      }
      await AsyncStorage.setItem("token", userData.token);
      await signIn(userData.usuario);

      if (userData.usuario.tipo_usuario === "aluno") {
        navigation.replace("ScreenAluno");
      } else {
        navigation.replace("TreinadorHomeScreen");
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message
          ? error.message
          : JSON.stringify(error);
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>CrossPlan</Text>
        <Text style={styles.subtitle}>Bem-vindo de volta!</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={[
              styles.input,
              errors.email && styles.inputError
            ]}
            placeholder="Seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: null }));
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={[
              styles.input,
              errors.senha && styles.inputError
            ]}
            placeholder="Sua senha"
            autoCapitalize="none"
            secureTextEntry
            value={senha}
            onChangeText={(text) => {
              setSenha(text);
              setErrors((prev) => ({ ...prev, senha: null }));
            }}
          />
          {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate("RecuperarSenha")}
        >
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Text style={styles.signupLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#0c2a60",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#0c2a60",
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#e0e3e8",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#0c2a60",
  },
  inputError: {
    borderColor: "#ff4444",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 36,
  },
  forgotPasswordText: {
    color: "#0c2a60",
    fontSize: 15,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#e57417",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#e57417",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  signupText: {
    color: "#a7a7af",
    fontSize: 16,
  },
  signupLink: {
    color: "#0c2a60",
    fontSize: 16,
    fontWeight: "600",
  },
});