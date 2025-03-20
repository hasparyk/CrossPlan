import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from 'expo-checkbox';

export default function CadastroScreen({ navigation }) {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmado, setEmailConfirmado] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [codigoTreinador, setCodigoTreinador] = useState("");
  const [isAluno, setIsAluno] = useState(false);

  const validarEmail = (email) => { const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; return regex.test(email); };
  const handleCadastro = () => { if (!validarEmail(email)) { alert("Por favor, insira um e-mail válido."); return; } if (email !== emailConfirmado) { alert("Os e-mails não coincidem."); return; } 
    const usuario = { nome, email, emailConfirmado, senha, telefone, dataNascimento, tipoUsuario, codigoTreinador: isAluno ? codigoTreinador : null, }; console.log(usuario); alert("Cadastro validado com sucesso!"); 
  };
  const handleTipoUsuarioChange = (isAluno) => { setIsAluno(isAluno); setTipoUsuario(isAluno ? "aluno" : "treinador"); };  
  const handleTelefoneChange = (text) => { const formattedText = text .replace(/\D/g, '') .replace(/^(\d{2})(\d)/, '($1) $2') .replace(/(\d{5})(\d{4})/, '$1-$2');setTelefone(formattedText); };
  const handleDataNascimentoChange = (text) => {const formattedText = text .replace(/\D/g, '') .replace(/(\d{2})(\d)/, '$1/$2') .replace(/(\d{2})(\d{2})/, '$1/$2') .replace(/(\d{2})(\d{4})/, '$1/$2'); setDataNascimento(formattedText); };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>

      <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Digite seu E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Confirme o E-mail" keyboardType="email-address" value={emailConfirmado} onChangeText={setEmailConfirmado} />
      <TextInput style={styles.input} placeholder="Digite sua Senha" secureTextEntry value={senha} onChangeText={setSenha} />
      <TextInput style={styles.input} placeholder="Numero de telefone com DDD" keyboardType="phone-pad" value={telefone} onChangeText={handleTelefoneChange} />
      <TextInput style={styles.input} placeholder="Sua data de nascimento" keyboardType="numeric" value={dataNascimento} onChangeText={handleDataNascimentoChange} />

      <View style={styles.checkboxContainer}>
        <Checkbox style={styles.checkbox} value={isAluno} onValueChange={() => handleTipoUsuarioChange(true)} />
        <Text style={styles.checkboxLabel}>Aluno</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox style={styles.checkbox} value={!isAluno} onValueChange={() => handleTipoUsuarioChange(false)} />
        <Text style={styles.checkboxLabel}>Treinador</Text>
      </View>

      {isAluno && ( <TextInput style={styles.input} placeholder="Código do treinador" value={codigoTreinador} onChangeText={setCodigoTreinador} /> )}

      <Button title="Cadastrar" onPress={handleCadastro} />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Voltar a tela de Login</Text>
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
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  link: {
    color: "blue",
    marginTop: 10,
  },
  checkbox: {
    margin: 8,
  },
});