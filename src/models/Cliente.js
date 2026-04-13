import { Telefone } from "./Telefone.js";
import { Endereco } from "./Endereco.js";

export class Cliente {
  #id;
  #nome;
  #cpf;
  #dataCad;
  #enderecos;
  #telefones;

  constructor(pNome, pCpf, pEnderecos = [], pTelefones = [], pId) {
    this.nome = pNome;
    this.cpf = pCpf;

    this.enderecos = pEnderecos.map(e =>
      e instanceof Endereco
        ? e
        : new Endereco(
            e.cep,
            e.logradouro,
            e.numero,
            e.complemento,
            e.bairro,
            e.cidade,
            e.estado
          )
    );

    this.telefones = pTelefones.map(t =>
      t instanceof Telefone
        ? t
        : new Telefone(t.numero)
    );

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
        "O campo nome é obrigatório e deve conter entre 3 e 255 caracteres."
      );
    }
  }

  #validarCpf(value) {
    if (!value || !/^\d{11}$/.test(value)) {
      throw new Error(
        "O campo CPF é obrigatório e deve conter exatamente 11 dígitos."
      );
    }
  }

  #validarId(value) {
    if (value && value <= 0) {
      throw new Error("O valor do ID não corresponde ao esperado.");
    }
  }

  static criar(dados) {
    return new Cliente(
      dados.nome,
      dados.cpf,
      dados.enderecos || [],
      dados.telefones || [],
      null
    );
  }

  static editar(dados, id) {
    return new Cliente(
      dados.nome,
      dados.cpf,
      dados.enderecos || [],
      dados.telefones || [],
      id
    );
  }
}