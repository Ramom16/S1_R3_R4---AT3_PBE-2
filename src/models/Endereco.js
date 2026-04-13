export class Endereco {
  #cep;
  #logradouro;
  #numero;
  #complemento;
  #bairro;
  #cidade;
  #estado;

  constructor(
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado
  ) {
    this.cep = cep;
    this.logradouro = logradouro;
    this.numero = numero;
    this.complemento = complemento;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
  }

  set cep(value) {
    this.#validarCep(value);
    this.#cep = value;
  }

  set logradouro(value) {
    this.#logradouro = value || null;
  }

  set numero(value) {
    if (!value) {
      throw new Error("Número é obrigatório.");
    }
    this.#numero = value;
  }

  set complemento(value) {
    this.#complemento = value || null;
  }

  set bairro(value) {
    this.#bairro = value || null;
  }

  set cidade(value) {
    this.#cidade = value || null;
  }

  set estado(value) {
    this.#estado = value || null;
  }

  get cep() {
    return this.#cep;
  }

  get logradouro() {
    return this.#logradouro;
  }

  get numero() {
    return this.#numero;
  }

  get complemento() {
    return this.#complemento;
  }

  get bairro() {
    return this.#bairro;
  }

  get cidade() {
    return this.#cidade;
  }

  get estado() {
    return this.#estado;
  }

  #validarCep(value) {
    if (!value || !/^\d{8}$/.test(value)) {
      throw new Error(
        "O campo CEP é obrigatório e deve conter exatamente 8 dígitos."
      );
    }
  }
}