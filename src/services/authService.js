import api from "./api";

export const login = async (email, senha) => {
  try {
    console.log('Tentando fazer login...');
    const response = await api.post("/login", { email, senha });
    
    if (!response.data || !response.data.token) {
      throw new Error("Resposta inválida do servidor");
    }

    const { nome, id } = response.data.usuario;
    console.log('Login realizado com sucesso para:', { nome, id });
    
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.message);
    
    if (error.response?.data?.message) {
      throw error.response.data.message;
    } else if (error.message) {
      throw error.message;
    }
    throw "Erro ao fazer login. Tente novamente.";
  }
};

export const register = async (userData) => {
  try {
    console.log('Iniciando registro de usuário...');

    // Garantir que tipo_usuario está correto
    if (userData.tipoUsuario) {
      userData.tipo_usuario = userData.tipoUsuario;
      delete userData.tipoUsuario;
    }

    // Garantir que data_nascimento está no formato correto (YYYY-MM-DD)
    if (userData.dataNascimento) {
      const [dia, mes, ano] = userData.dataNascimento.split('/');
      userData.data_nascimento = `${ano}-${mes}-${dia}`;
      delete userData.dataNascimento;
    }

    const response = await api.post("/usuarios", userData);
    const { nome, id } = response.data.usuario;
    console.log('Usuário registrado com sucesso:', { nome, id });
    
    return response.data;
  } catch (error) {
    console.error("Erro no registro:", error.message);
    
    if (error.response?.data?.message) {
      throw error.response.data.message;
    } else if (error.response?.data?.campos) {
      const campos = error.response.data.campos;
      const erros = Object.values(campos).filter(Boolean).join(', ');
      throw erros;
    } else if (error.message) {
      throw error.message;
    }
    throw "Erro ao registrar usuário";
  }
};

export const recuperarSenha = async (email) => {
  try {
    console.log('Solicitando recuperação de senha...');
    const response = await api.post("/recuperar-senha", { email });
    console.log('Solicitação de recuperação enviada com sucesso');
    return response.data;
  } catch (error) {
    console.error("Erro na recuperação de senha:", error.message);
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw "Erro ao solicitar recuperação de senha";
  }
};

export const redefinirSenha = async (token, novaSenha) => {
  try {
    console.log('Redefinindo senha...');
    const response = await api.post("/redefinir-senha", { token, novaSenha });
    console.log('Senha redefinida com sucesso');
    return response.data;
  } catch (error) {
    console.error("Erro na redefinição de senha:", error.message);
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw "Erro ao redefinir senha";
  }
};

export const logout = () => {
  console.log("Logout realizado com sucesso");
};
