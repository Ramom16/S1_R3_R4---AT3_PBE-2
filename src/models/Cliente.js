export class Cliente {
  #id;
  #nome;
  #cpf;
  #dataCad;
  #enderecos;
  #telefones;

  constructor(pNome, pCpf, pEnderecos, pTelefones, pId) {
    this.nome = pNome;
    this.cpf = pCpf;
    this.enderecos = pEnderecos;
    this.telefones = pTelefones;
    this.id = pId;
    this.#dataCad = new Date();
  }

  set nome(value) {
    this.#validarNome(value);
    this.#nome = value;
  }

  set cpf(value) {
    this.#validarCpf(value);
    this.#cpf = value;
  }

  set enderecos(value) {
    this.#enderecos = value;
  }

  set telefones(value) {
    this.#telefones = value;
  }

  set id(value) {
    this.#validarId(value);
    this.#id = value;
  }

  set dataCad(value) {
    this.#dataCad = value;
  }

  get nome() {
    return this.#nome;
  }

  get cpf() {
    return this.#cpf;
  }

  get enderecos() {
    return this.#enderecos;
  }

  get telefones() {
    return this.#telefones;
  }

  get id() {
    return this.#id;
  }

  get dataCad() {
    return this.#dataCad;
  }

  #validarNome(value) {
    if (!value || value.trim().length < 3 || value.trim().length > 255) {
      throw new Error(
        "O campo nome é obrigatório e deve conter entre 3 e 255 caracteres.",
      );
    }
  }

  #validarCpf(value) {
    if (!value || !/^\d{11}$/.test(value)) {
      throw new Error(
        "O campo CPF é obrigatório e deve conter exatamente 11 dígitos.",
      );
    }
  }

  #validarCep(value) {
    if (!value || !/^\d{8}$/.test(value)) {
      throw new Error(
        "O campo CEP é obrigatório e deve conter exatamente 8 dígitos.",
      );
    }
  }

  #validarTelefone(value) {
    if (!value || !/^\d{10,15}$/.test(value)) {
      throw new Error(
        "O campo telefone é obrigatório e deve conter entre 10 e 15 dígitos.",
      );
    }
  }

  #validarId(value) {
    if (value && value <= 0) {
      throw new Error("O valor do ID não corresponde ao esperado.");
    }
  }

  // Métodos públicos para validação
  validarNome(value) {
    this.#validarNome(value);
  }

  validarCpf(value) {
    this.#validarCpf(value);
  }

  validarCep(value) {
    this.#validarCep(value);
  }

  validarTelefone(value) {
    this.#validarTelefone(value);
  }

  // Design Pattern: Factory
  static criar(dados) {
    return new Cliente(
      dados.nome,
      dados.cpf,
      dados.enderecos || [],
      dados.telefones || [],
      null,
    );
  }

  static editar(dados, id) {
    return new Cliente(
      dados.nome,
      dados.cpf,
      dados.enderecos || [],
      dados.telefones || [],
      id,
    );
  }
}
