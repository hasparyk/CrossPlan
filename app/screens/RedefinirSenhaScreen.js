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
import { redefinirSenha } from "../../src/services/authService";

export default function RedefinirSenhaScreen({ route, navigation }) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Pegar o token da URL
  const token = route.params?.token;

  const validateForm = () => {
    const newErrors = {};

    if (!novaSenha) {
      newErrors.novaSenha = "Nova senha é obrigatória";
    } else if (novaSenha.length < 6) {
      newErrors.novaSenha = "A senha deve ter no mínimo 6 caracteres";
    }

    if (!confirmarSenha) {
      newErrors.confirmarSenha = "Confirmação de senha é obrigatória";
    } else if (confirmarSenha !== novaSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRedefinirSenha = async () => {
    if (!token) {
      Alert.alert("Erro", "Token de redefinição não encontrado");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      await redefinirSenha(token, novaSenha);
      Alert.alert(
        "Sucesso",
        "Sua senha foi redefinida com sucesso!",
        [{ text: "OK", onPress: () => navigation.replace("Login") }]
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        typeof error === "string" ? error : "Ocorreu um erro ao redefinir sua senha. Tente novamente."
      );
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
        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>
          Digite sua nova senha
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={[styles.input, errors.novaSenha && styles.inputError]}
            placeholder="Digite sua nova senha"
            secureTextEntry
            value={novaSenha}
            onChangeText={(text) => {
              setNovaSenha(text);
              setErrors((prev) => ({ ...prev, novaSenha: null }));
            }}
          />
          {errors.novaSenha && (
            <Text style={styles.errorText}>{errors.novaSenha}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <TextInput
            style={[styles.input, errors.confirmarSenha && styles.inputError]}
            placeholder="Confirme sua nova senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={(text) => {
              setConfirmarSenha(text);
              setErrors((prev) => ({ ...prev, confirmarSenha: null }));
            }}
          />
          {errors.confirmarSenha && (
            <Text style={styles.errorText}>{errors.confirmarSenha}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRedefinirSenha}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Redefinir Senha</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.backButtonText}>Voltar ao login</Text>
        </TouchableOpacity>
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
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    alignItems: "center",
  },
  backButtonText: {
    color: "#666",
    fontSize: 14,
  },
}); 