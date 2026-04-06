export class Produto {
    #id;
    #idCategoria;
    #nome;
    #valor;
    #caminhoImagem;
    #dataCad;

    constructor(pIdCategoria, pNome, pValor, pCaminhoImagem, pId){
        this.idCategoria = pIdCategoria;
        this.nome = pNome;
        this.valor = pValor;
        this.caminhoImagem = pCaminhoImagem;
        this.id = pId;
    }

    set id(value){
        this.#validarId(value);
        this.#id = value;
    }

    set idCategoria(value){
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }

    set nome(value){
        this.#validarNome(value);
        this.#nome = value;
    }

    set valor(value){
        this.#validarValor(value);
        this.#valor = value;
    }

    set caminhoImagem(value){
        this.#validarPathImagem(value);
        this.#caminhoImagem = value;
    }

    get id(){
        return this.#id;
    }

    get idCategoria(){
        return this.#idCategoria;
    }

    get nome(){
        return this.#nome;
    }

    get valor(){
        return this.#valor;
    }

    get caminhoImagem(){
        return this.#caminhoImagem;
    }

    #validarId(value){
        if(value && value <= 0){
            throw new Error("O valor do ID não corresponde ao esperado.");
        }
    }

    #validarIdCategoria(value){
        if(!value || typeof value !== 'number' || value <= 0){
            throw new Error("ID da categoria é obrigatório e deve ser um número positivo.");
        }
    }

    #validarNome(value){
        if(!value || value.trim().length < 3 || value.trim().length > 45){
            throw new Error("O campo nome é obrigatório e deve conter entre 3 e 45 caracteres.");
        }
    }

    #validarValor(value){
        if(!value || typeof value !== 'number' || value <= 0){
            throw new Error("O campo valor é obrigatório e deve ser um número positivo.");
        }
    }

    #validarPathImagem(value){
        if(!value || value.trim().length === 0 || value.trim().length > 255){
            throw new Error("O caminho da imagem é obrigatório e deve conter até 255 caracteres.");
        }
    }

    static criar(dados){
        return new Produto(dados.idCategoria, dados.nome, dados.valor, dados.caminhoImagem, null);
    }

    static editar(dados, id){
        return new Produto(dados.idCategoria, dados.nome, dados.valor, dados.caminhoImagem, id);
    }
}