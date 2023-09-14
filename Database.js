import SQLite from 'react-native-sqlite-storage';

// Abre ou cria o banco de dados
const db = SQLite.openDatabase(
  { name: 'products.db', location: 'default' },
  () => {},
  (error) => {
    console.error('Erro ao abrir o banco de dados:', error);
  }
);

// Cria a tabela de produtos se ela não existir
db.transaction((tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL
    );`,
    [],
    () => {},
    (error) => {
      console.error('Erro ao criar a tabela de produtos:', error);
    }
  );
});

// Função para adicionar um novo produto
const addProduct = (name, price, quantity, successCallback, errorCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)',
      [name, price, quantity],
      (_, result) => {
        successCallback(result);
      },
      (_, error) => {
        errorCallback(error);
      }
    );
  });
};

// Função para listar todos os produtos
const listProducts = (successCallback, errorCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM products',
      [],
      (_, { rows }) => {
        successCallback(rows.raw());
      },
      (_, error) => {
        errorCallback(error);
      }
    );
  });
};

// Função para atualizar um produto
const updateProduct = (id, name, price, quantity, successCallback, errorCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE products SET name=?, price=?, quantity=? WHERE id=?',
      [name, price, quantity, id],
      (_, result) => {
        successCallback(result);
      },
      (_, error) => {
        errorCallback(error);
      }
    );
  });
};

// Função para excluir um produto
const deleteProduct = (id, successCallback, errorCallback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM products WHERE id=?',
      [id],
      (_, result) => {
        successCallback(result);
      },
      (_, error) => {
        errorCallback(error);
      }
    );
  });
};
export default Database;

export { addProduct, listProducts, updateProduct, deleteProduct };
