import { Cliente } from "../models/Cliente.js";
import { validarCPF } from "../utils/validarCpf.js";
import { limparNumero } from "../utils/limparNumero.js";
import clienteRepository from "../repositories/clienteRepository.js";

const consultarViaCep = async (cep) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();

  if (data.erro) {
    throw new Error("CEP não encontrado");
  }

  return {
    logradouro: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf,
  };
};

const clienteController = {
  criar: async (req, res) => {
    try {
      const { nome, cpf, enderecos, telefones } = req.body;

      // 🔹 NOME
      if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
        return res.status(400).json({ error: "Nome inválido." });
      }

      // 🔹 CPF
      const cpfLimpo = limparNumero(cpf || "");

      if (!cpfLimpo || !validarCPF(cpfLimpo)) {
        return res.status(400).json({ error: "CPF inválido." });
      }

      // 🔹 ENDEREÇOS
      const enderecosProcessados = [];

      if (enderecos && Array.isArray(enderecos)) {
        for (const end of enderecos) {

          const cep = limparNumero(end.cep || "");

          if (!cep) {
            return res.status(400).json({ error: "CEP é obrigatório." });
          }

          const numero = end.numero?.toString().trim();

          if (!numero) {
            return res.status(400).json({ error: "Número obrigatório." });
          }

          let dadosViaCep;

          try {
            dadosViaCep = await consultarViaCep(cep);
          } catch {
            return res.status(400).json({ error: "CEP inválido." });
          }

          enderecosProcessados.push({
            cep,
            logradouro: dadosViaCep.logradouro || null,
            numero: numero,
            complemento: end.complemento || null,
            bairro: dadosViaCep.bairro || null,
            cidade: dadosViaCep.cidade || null,
            estado: dadosViaCep.estado || null,
          });
        }
      }

      // 🔹 TELEFONES
      const telefonesProcessados = [];

      if (telefones && Array.isArray(telefones)) {
        for (const tel of telefones) {

          const numeroBruto = typeof tel === "string" ? tel : tel.numero;
          const numero = limparNumero(numeroBruto || "");

          if (!numero || numero.length < 10 || numero.length > 15) {
            return res.status(400).json({ error: "Telefone inválido." });
          }

          telefonesProcessados.push({ numero });
        }
      }

      // 🔹 OBJETO
      const cliente = Cliente.criar({
        nome: nome.trim(),
        cpf: cpfLimpo,
        enderecos: enderecosProcessados,
        telefones: telefonesProcessados,
      });

      const clienteId = await clienteRepository.criar(cliente);

      return res.status(201).json({
        message: "Cliente criado com sucesso",
        cliente: {
          id: clienteId,
          nome: cliente.nome,
          cpf: cliente.cpf,
          dataCad: cliente.dataCad,
          enderecos: enderecosProcessados,
          telefones: telefonesProcessados,
        },
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  },

  atualizar: async (req, res) => {
    try {
      const id = Number(req.params.id || req.query.id);

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "ID inválido." });
      }

      const { nome, cpf } = req.body;

      if (!nome || nome.trim().length < 3) {
        return res.status(400).json({ error: "Nome inválido." });
      }

      const cpfLimpo = limparNumero(cpf || "");

      if (!cpfLimpo || !validarCPF(cpfLimpo)) {
        return res.status(400).json({ error: "CPF inválido." });
      }

      const cliente = Cliente.editar(
        {
          nome: nome.trim(),
          cpf: cpfLimpo,
        },
        id
      );

      const result = await clienteRepository.editar(cliente);

      return res.status(200).json({
        message: "Cliente atualizado",
        result,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro interno",
        message: error.message,
      });
    }
  },

  deletar: async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "ID inválido." });
      }

      const result = await clienteRepository.deletar(id);

      return res.status(200).json({
        message: "Cliente deletado",
        result,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro interno",
        message: error.message,
      });
    }
  },

  selecionar: async (req, res) => {
    try {
      const result = await clienteRepository.selecionar();
      return res.status(200).json(result);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro interno",
        message: error.message,
      });
    }
  }
};

export default clienteController;

/*
async function cosultaCep(cep) {
try{
  const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  
  if (respApi.data.erro) {
    throw new Error("CEP não encontrado");
  }

  return respApi.data;
} catch (error) {
  throw new Error("Erro ao consultar CEP: " + error.message);
}
* */