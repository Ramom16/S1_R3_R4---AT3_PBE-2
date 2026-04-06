export class Categoria {
    #id;
    #nome;
    #descricao;
    #dataCad;

    constructor(pNome, pDescricao, pId){
        this.nome = pNome;
        this.descricao = pDescricao;
        this.id = pId;// o id é opcional, pois ele é gerado automaticamente pelo banco de dados e tem um valor padrão de null
    }

    set nome(value){
        this.#validarNome(value);
        this.#nome = value;
    }

    set descricao(value){
        this.#validarDescricao(value);
        this.#descricao = value;
    }
    set id(value){
        this.#validarId(value);
        this.#id = value;
    }

    get nome(){
        return this.#nome;
    }

    get descricao(){
        return this.#descricao;
    }

    get id(){
        return this.#id;
    }

    #validarNome(value){
        if(!value || value.trim().length < 3 || value.trim().length > 45){
            throw new Error("O campo nome é obrigatório e deve conter entre 3 e 45 caracteres.");
        }
    }
    #validarDescricao(value){
        if(value && (value.trim().length < 5 || value.trim().length > 100)){
            throw new Error("O campo descrição deve conter entre 5 e 100 caracteres.");
        }
    }
    #validarId(value){
        if(value && value <= 0){
            throw new Error("O valor do ID não corresponde ao esperado.");
        }
    }

    // Design Pattern: Factory
    static criar(dados){
        return new Categoria(dados.nome, dados.descricao, null);
    }
    static editar(dados,id){
        return new Categoria(dados.nome, dados.descricao, id);
    }
}