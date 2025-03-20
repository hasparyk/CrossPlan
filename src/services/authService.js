import api from "./api";

export const login = async (email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, { email, senha });

    console.log("Resposta da API:", response.data); // Verificar o que a API está retornando

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao fazer login";
  }
};
export const register = async (nome, email, senha, sexo, data_nascimento) => {
  try {
    const response = await api.post("/usuarios", { nome, email, senha, sexo, data_nascimento });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao registrar usuário";
  }
};

export const logout = () => {
  // Se houver necessidade de limpar tokens ou fazer requisição para deslogar no backend, implemente aqui
  console.log("Usuário deslogado");
};
