import { limparNumero } from "../utils/limparNumero.js";

export class Telefone {
  #numero;

  constructor(numero) {
    this.numero = numero;
  }

  set numero(value) {
    const numeroLimpo = limparNumero(value || "");
    this.#validarTelefone(numeroLimpo);
    this.#numero = numeroLimpo;
  }

  get numero() {
    return this.#numero;
  }

  #validarTelefone(value) {
    if (!value || value.length < 10 || value.length > 15) {
      throw new Error(
        "O campo telefone é obrigatório e deve conter entre 10 e 15 dígitos."
      );
    }
  }
}