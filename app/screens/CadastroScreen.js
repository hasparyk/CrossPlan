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
  ScrollView,
} from "react-native";
import Checkbox from 'expo-checkbox';
import { register } from "../../src/services/authService";

export default function CadastroScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    emailConfirmado: "",
    senha: "",
    senhaConfirmada: "",
    telefone: "",
    dataNascimento: "",
    tipoUsuario: "aluno",
    codigoTreinador: "",
    sexo: "",
  });
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validarData = (data) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(data)) return false;
    
    const [dia, mes, ano] = data.split('/').map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    
    return dataObj.getDate() === dia &&
           dataObj.getMonth() === mes - 1 &&
           dataObj.getFullYear() === ano &&
           dataObj <= new Date();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome) {
      newErrors.nome = "Nome é obrigatório";
    } else if (formData.nome.length < 3) {
      newErrors.nome = "Nome deve ter no mínimo 3 caracteres";
    }

    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!validarEmail(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (formData.email !== formData.emailConfirmado) {
      newErrors.emailConfirmado = "Os e-mails não coincidem";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres";
    }

    if (formData.senha !== formData.senhaConfirmada) {
      newErrors.senhaConfirmada = "As senhas não coincidem";
    }

    if (!formData.telefone) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (formData.telefone.replace(/\D/g, '').length !== 11) {
      newErrors.telefone = "Telefone inválido";
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    } else if (!validarData(formData.dataNascimento)) {
      newErrors.dataNascimento = "Data de nascimento inválida";
    }

    if (!formData.sexo) {
      newErrors.sexo = "Sexo é obrigatório";
    }

    if (formData.tipoUsuario === "aluno" && !formData.codigoTreinador) {
      newErrors.codigoTreinador = "Código do treinador é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTelefoneChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      if (cleaned.length >= 7) {
        formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
      }
    }
    updateFormData('telefone', formatted);
  };

  const handleDataNascimentoChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      if (cleaned.length >= 4) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
      }
    }
    updateFormData('dataNascimento', formatted);
  };

  const handleCadastro = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
        tipo_usuario: formData.tipoUsuario,
        codigo_treinador: formData.tipoUsuario === "aluno" ? formData.codigoTreinador : null,
        sexo: formData.sexo,
        data_nascimento: formData.dataNascimento.split('/').reverse().join('-'), // Converter para YYYY-MM-DD
      };

      await register(userData);
      Alert.alert(
        "Sucesso",
        "Cadastro realizado com sucesso!",
        [{ text: "OK", onPress: () => navigation.replace("Login") }]
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        typeof error === "string" ? error : "Erro ao realizar cadastro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (field, placeholder, props = {}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{placeholder}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(text) => updateFormData(field, text)}
        {...props}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Crie sua conta</Text>

        {renderInput("nome", "Nome Completo")}
        {renderInput("email", "E-mail", { keyboardType: "email-address", autoCapitalize: "none" })}
        {renderInput("emailConfirmado", "Confirmar E-mail", { keyboardType: "email-address", autoCapitalize: "none" })}
        {renderInput("senha", "Senha", { secureTextEntry: true, autoCapitalize:"none" })}
        {renderInput("senhaConfirmada", "Confirmar Senha", { secureTextEntry: true, autoCapitalize:"none" })}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={[styles.input, errors.telefone && styles.inputError]}
            placeholder="(00) 00000-0000"
            keyboardType="numeric"
            value={formData.telefone}
            onChangeText={handleTelefoneChange}
            maxLength={15}
          />
          {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput
            style={[styles.input, errors.dataNascimento && styles.inputError]}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            value={formData.dataNascimento}
            onChangeText={handleDataNascimentoChange}
            maxLength={10}
          />
          {errors.dataNascimento && <Text style={styles.errorText}>{errors.dataNascimento}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.radioContainer}>
            {["M", "F", "O"].map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={[
                  styles.radioButton,
                  formData.sexo === opcao && styles.radioButtonSelected
                ]}
                onPress={() => updateFormData("sexo", opcao)}
              >
                <Text style={[
                  styles.radioText,
                  formData.sexo === opcao && styles.radioTextSelected
                ]}>
                  {opcao === "M" ? "Masculino" : opcao === "F" ? "Feminino" : "Outro"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.sexo && <Text style={styles.errorText}>{errors.sexo}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de Usuário</Text>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxWrapper}>
              <Checkbox
                style={styles.checkbox}
                value={formData.tipoUsuario === "aluno"}
                onValueChange={() => updateFormData("tipoUsuario", "aluno")}
              />
              <Text style={styles.checkboxLabel}>Aluno</Text>
            </View>
            <View style={styles.checkboxWrapper}>
              <Checkbox
                style={styles.checkbox}
                value={formData.tipoUsuario === "treinador"}
                onValueChange={() => updateFormData("tipoUsuario", "treinador")}
              />
              <Text style={styles.checkboxLabel}>Treinador</Text>
            </View>
          </View>
        </View>

        {formData.tipoUsuario === "aluno" && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código do Treinador</Text>
            <TextInput
              style={[styles.input, errors.codigoTreinador && styles.inputError]}
              placeholder="Digite o código do seu treinador"
              value={formData.codigoTreinador}
              onChangeText={(text) => updateFormData("codigoTreinador", text)}
            />
            {errors.codigoTreinador && (
              <Text style={styles.errorText}>{errors.codigoTreinador}</Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCadastro}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar ao login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    color: "#1a1a1a",
  },
  inputContainer: {
    marginBottom: 20,
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
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    minWidth: 100,
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  radioText: {
    color: "#666",
    fontSize: 14,
  },
  radioTextSelected: {
    color: "#fff",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
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