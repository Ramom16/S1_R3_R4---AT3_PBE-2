import { connection } from "../configs/Database.js";

const clienteRepository = {

  criar: async (cliente) => {

    const sqlCliente = "INSERT INTO cliente (nome, cpf) VALUES (?, ?)";
    const valuesCliente = [
      cliente.nome || null,
      cliente.cpf || null
    ];

    const [resultCliente] = await connection.execute(sqlCliente, valuesCliente);
    const clienteId = resultCliente.insertId;

    if (cliente.enderecos && cliente.enderecos.length > 0) {
      for (const endereco of cliente.enderecos) {

        const sqlEndereco = `
          INSERT INTO Endereco 
          (idClientes, cep, logradouro, numero, complemento, bairro, cidade, estado) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const valuesEndereco = [
          clienteId,
          endereco.cep || null,
          endereco.logradouro || null,
          endereco.numero || null,
          endereco.complemento || null,
          endereco.bairro || null,
          endereco.cidade || null,
          endereco.estado || null
        ];

        await connection.execute(sqlEndereco, valuesEndereco);
      }
    }

    if (cliente.telefones && cliente.telefones.length > 0) {
      for (const telefone of cliente.telefones) {

        const sqlTelefone = `
          INSERT INTO telefone (idClientes, telefone) 
          VALUES (?, ?)
        `;

        const valuesTelefone = [
          clienteId,
          telefone || null 
        ];

        await connection.execute(sqlTelefone, valuesTelefone);
      }
    }

    return resultCliente;
  },

  editar: async (cliente) => {
    const sql = "UPDATE cliente SET nome = ?, cpf = ? WHERE idCliente = ?";
    
    const values = [
      cliente.nome || null,
      cliente.cpf || null,
      cliente.id
    ];

    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  selecionar: async () => {
    const sqlCliente = "SELECT * FROM cliente";
    const [clientes] = await connection.execute(sqlCliente);

    for (const cliente of clientes) {

      const sqlEndereco = "SELECT * FROM Endereco WHERE idClientes = ?";
      const [enderecos] = await connection.execute(sqlEndereco, [
        cliente.idCliente,
      ]);
      cliente.enderecos = enderecos;

      const sqlTelefone = "SELECT * FROM telefone WHERE idClientes = ?";
      const [telefones] = await connection.execute(sqlTelefone, [
        cliente.idCliente,
      ]);
      cliente.telefones = telefones;
    }

    return clientes;
  },

  deletar: async (id) => {
    const sql = "DELETE FROM cliente WHERE idCliente = ?";
    const values = [id];

    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  selecionarPorId: async (id) => {
    const sqlCliente = "SELECT * FROM cliente WHERE idCliente = ?";
    const [clientes] = await connection.execute(sqlCliente, [id]);

    if (clientes.length === 0) return [];

    const cliente = clientes[0];

    const sqlEndereco = "SELECT * FROM Endereco WHERE idClientes = ?";
    const [enderecos] = await connection.execute(sqlEndereco, [id]);
    cliente.enderecos = enderecos;

    const sqlTelefone = "SELECT * FROM telefone WHERE idClientes = ?";
    const [telefones] = await connection.execute(sqlTelefone, [id]);
    cliente.telefones = telefones;

    return [cliente];
  }
};

export default clienteRepository;