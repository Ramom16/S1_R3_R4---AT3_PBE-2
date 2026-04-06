import {Produto} from '../models/Produto.js';
import produtoRepository from '../repositories/produtoRepository.js';

const produtoController = {
    criar: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Arquivo de imagem é obrigatório.' });
            }

            const idCategoria = Number(req.body.IdCategoria);
            const nome = req.body.Nome;
            const valorString = String(req.body.Valor).replace(/\./g, '').replace(',', '.');
            const valor = Number(valorString);
            const caminhoImagem = req.file.filename;
            
            if (!idCategoria || isNaN(idCategoria) || idCategoria <= 0) {
                return res.status(400).json({ error: 'ID da categoria é obrigatório e deve ser um número positivo.' });
            }
            if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
                return res.status(400).json({ error: 'Nome é obrigatório e deve ser uma string não vazia.' });
            }
            if (!valor || isNaN(valor) || valor <= 0) {
                return res.status(400).json({ error: 'Valor é obrigatório e deve ser um número positivo.' });
            }

            const produto = Produto.criar({
                idCategoria, 
                nome: nome.trim(), 
                valor, 
                caminhoImagem: caminhoImagem
            });
            
            const result = await produtoRepository.criar(produto);
            res.status(201).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Ocorreu um erro no servidor.', errorMessage: error.message});
        }
    },

    atualizar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID válido é obrigatório.' });
            }
            const idCategoria = Number(req.body.IdCategoria);
            const nome = req.body.Nome;
            const valorString = String(req.body.Valor).replace(/\./g, '').replace(',', '.');
            const valor = Number(valorString);
            const caminhoImagem = req.file ? req.file.filename : req.body.caminhoImagem;
            
            if (!idCategoria || isNaN(idCategoria) || idCategoria <= 0) {
                return res.status(400).json({ error: 'ID da categoria é obrigatório e deve ser um número positivo.' });
            }
            if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
                return res.status(400).json({ error: 'Nome é obrigatório e deve ser uma string não vazia.' });
            }
            if (!valor || isNaN(valor) || valor <= 0) {
                return res.status(400).json({ error: 'Valor é obrigatório e deve ser um número positivo.' });
            }
            if (!caminhoImagem || typeof caminhoImagem !== 'string' || caminhoImagem.trim().length === 0) {
                return res.status(400).json({ error: 'Caminho da imagem é obrigatório e deve ser uma string não vazia.' });
            }

            const produto = Produto.editar({
                idCategoria, 
                nome: nome.trim(), 
                valor, 
                caminhoImagem: caminhoImagem.trim ? caminhoImagem.trim() : caminhoImagem
            }, id);
            
            const result = await produtoRepository.editar(produto);
            res.status(200).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Ocorreu um erro no servidor.', errorMessage: error.message});
        }
    },

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await produtoRepository.deletar(id);
            res.status(200).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Ocorreu um erro no servidor.', errorMessage: error.message});
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await produtoRepository.selecionar();
            res.status(200).json({result});
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Ocorreu um erro no servidor.', errorMessage: error.message});
        }
    }
}

export default produtoController;