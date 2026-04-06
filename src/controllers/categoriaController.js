import {Categoria} from '../models/Categoria.js';
import categoriaRepository from '../repositories/categoriaRepository.js';

const categoriaController = {
    criar: async (req, res) =>{
        try {
            const {nome, descricao} = req.body;
            if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
                return res.status(400).json({ error: 'Nome é obrigatório e deve ser uma string não vazia.' });
            }
            if (descricao !== undefined && (typeof descricao !== 'string' || descricao.trim().length === 0)) {
                return res.status(400).json({ error: 'Descrição deve ser uma string não vazia se fornecida.' });
            }
            const categoria = Categoria.criar({nome: nome.trim(), descricao: descricao ? descricao.trim() : null});
            const result = await categoriaRepository.criar(categoria);
            res.status(201).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Ocorreu um erro no servidor.', errorMessage: error.message});
        }
    },
    atualizar: async (req, res) =>{
        try {
            const id = Number(req.query.id);
            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID válido é obrigatório.' });
            }
            const {nome, descricao} = req.body;
            if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
                return res.status(400).json({ error: 'Nome é obrigatório e deve ser uma string não vazia.' });
            }
            if (descricao !== undefined && (typeof descricao !== 'string' || descricao.trim().length === 0)) {
                return res.status(400).json({ error: 'Descrição deve ser uma string não vazia se fornecida.' });
            }
            const categoria = Categoria.editar({nome: nome.trim(), descricao: descricao ? descricao.trim() : null}, id);
            const result = await categoriaRepository.editar(categoria);
            res.status(200).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Ocorreu um erro no servidor.', errorMessage: error.message});
        }
    },
    deletar: async (req, res) =>{
        try {
            const id = Number(req.params.id);
            const result = await categoriaRepository.deletar(id);
            res.status(200).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Ocorreu um erro no servidor.', errorMessage: error.message});
        }
    },
    selecionar: async (req, res) =>{
        try {
            const result = await categoriaRepository.selecionar();
            res.status(200).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Ocorreu um erro no servidor.', errorMessage: error.message});
        }
    }
}

export default categoriaController;