import { Cliente } from '../models/Cliente.js';
import clienteRepository from '../repositories/clienteRepository.js';

const consultarViaCep = async (cep) => {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
        throw new Error('CEP não encontrado');
    }

    return {
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf
    };
};

const clienteController = {

    criar: async (req, res) => {
        try {
            const { nome, cpf, enderecos, telefones } = req.body;

            if (!nome || typeof nome !== 'string' || nome.trim().length < 3) {
                return res.status(400).json({ error: 'Nome inválido.' });
            }

            if (!cpf || !/^\d{11}$/.test(cpf)) {
                return res.status(400).json({ error: 'CPF inválido.' });
            }

            let enderecosProcessados = [];

            if (enderecos && Array.isArray(enderecos)) {
                for (const end of enderecos) {

                    if (!end.cep || !/^\d{8}$/.test(end.cep)) {
                        return res.status(400).json({ error: 'CEP inválido.' });
                    }

                    if (!end.numero) {
                        return res.status(400).json({ error: 'Número obrigatório.' });
                    }

                    const dadosViaCep = await consultarViaCep(end.cep);

                    enderecosProcessados.push({
                        cep: end.cep,
                        logradouro: dadosViaCep.logradouro || null,
                        numero: end.numero,
                        complemento: end.complemento || null,
                        bairro: dadosViaCep.bairro || null,
                        cidade: dadosViaCep.cidade || null,
                        estado: dadosViaCep.estado || null
                    });
                }
            }

            let telefonesProcessados = [];

            if (telefones && Array.isArray(telefones)) {
                for (const tel of telefones) {

                    const numero = typeof tel === 'string' ? tel : tel.telefone;

                    if (!numero || !/^\d{10,15}$/.test(numero)) {
                        return res.status(400).json({ error: 'Telefone inválido.' });
                    }

                    telefonesProcessados.push(numero);
                }
            }

            const cliente = Cliente.criar({
                nome: nome.trim(),
                cpf: cpf.trim(),
                enderecos: enderecosProcessados,
                telefones: telefonesProcessados
            });

            const result = await clienteRepository.criar(cliente);

            
            return res.status(201).json({
                message: 'Cliente criado com sucesso',
                cliente: {
                    id: result.insertId,
                    nome: cliente.nome,
                    cpf: cliente.cpf,
                    dataCad: cliente.dataCad,
                    enderecos: enderecosProcessados,
                    telefones: telefonesProcessados
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro interno do servidor',
                message: error.message
            });
        }
    },

    atualizar: async (req, res) => {
        try {
            const id = Number(req.query.id);

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido.' });
            }

            const { nome, cpf } = req.body;

            if (!nome || nome.trim().length < 3) {
                return res.status(400).json({ error: 'Nome inválido.' });
            }

            if (!cpf || !/^\d{11}$/.test(cpf)) {
                return res.status(400).json({ error: 'CPF inválido.' });
            }

            const cliente = Cliente.editar({
                nome: nome.trim(),
                cpf: cpf.trim()
            }, id);

            const result = await clienteRepository.editar(cliente);

            return res.status(200).json({
                message: 'Cliente atualizado',
                result
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro interno',
                message: error.message
            });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);

            const result = await clienteRepository.deletar(id);

            return res.status(200).json({
                message: 'Cliente deletado',
                result
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro interno',
                message: error.message
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
                error: 'Erro interno',
                message: error.message
            });
        }
    }
};

export default clienteController;