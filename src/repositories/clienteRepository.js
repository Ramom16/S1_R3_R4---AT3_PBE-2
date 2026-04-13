import { connection } from "../configs/Database.js";

const clienteRepository = {
  criar: async (cliente) => {
    const conn = await connection.getConnection();

    try {
      await conn.beginTransaction();

      const sqlCli = "INSERT INTO cliente (nome, cpf) VALUES (?, ?)";

      const valuesCli = [cliente.nome, cliente.cpf];

      const [rowsCli] = await conn.execute(sqlCli, valuesCli);

      const clienteId = rowsCli.insertId;

      if (cliente.telefones && cliente.telefones.length > 0) {
        for (const telefone of cliente.telefones) {
          const sqlTel = `
            INSERT INTO telefone (idClientes, telefone)
            VALUES (?, ?)
          `;

          const valuesTel = [clienteId, telefone.numero || null];

          await conn.execute(sqlTel, valuesTel);
        }
      }

      if (cliente.enderecos && cliente.enderecos.length > 0) {
        for (const endereco of cliente.enderecos) {
          const sqlEnd = `
            INSERT INTO Endereco 
            (idClientes, cep, logradouro, numero, complemento, bairro, cidade, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const valuesEnd = [
            clienteId,
            endereco.cep || null,
            endereco.logradouro || null,
            endereco.numero,
            endereco.complemento || null,
            endereco.bairro || null,
            endereco.cidade || null,
            endereco.estado || null,
          ];

          await conn.execute(sqlEnd, valuesEnd);
        }
      }

      await conn.commit();

      return clienteId;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  editar: async (cliente) => {
    const sql = "UPDATE cliente SET nome = ?, cpf = ? WHERE idCliente = ?";

    const values = [cliente.nome, cliente.cpf, cliente.id];

    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  selecionar: async () => {
    const sqlCliente = "SELECT * FROM cliente";
    const [clientes] = await connection.execute(sqlCliente);

    for (const cliente of clientes) {
      const [enderecos] = await connection.execute(
        "SELECT * FROM Endereco WHERE idClientes = ?",
        [cliente.idCliente],
      );

      cliente.enderecos = enderecos.map((e) => ({
        cep: e.cep,
        logradouro: e.logradouro,
        numero: e.numero,
        complemento: e.complemento,
        bairro: e.bairro,
        cidade: e.cidade,
        estado: e.estado,
      }));

      const [telefones] = await connection.execute(
        "SELECT * FROM telefone WHERE idClientes = ?",
        [cliente.idCliente],
      );

      cliente.telefones = telefones.map((t) => ({
        numero: t.telefone,
      }));
    }

    return clientes;
  },

  deletar: async (id) => {
    await connection.execute("DELETE FROM telefone WHERE idClientes = ?", [id]);

    await connection.execute("DELETE FROM Endereco WHERE idClientes = ?", [id]);

    const sql = "DELETE FROM cliente WHERE idCliente = ?";
    const [rows] = await connection.execute(sql, [id]);

    return rows;
  },
};

export default clienteRepository;
