import SQLite from 'react-native-sqlite-storage';


// Abre ou cria o banco de dados
export const createDatabase = () => {
    const db = SQLite.openDatabase(
        { name: 'products.db', location: 'default' },
        () => { db = db; }, // Certifique-se de atribuir db = db aqui
        (error) => {
            console.error('Erro ao abrir o banco de dados:', error);
        }
    );
    return db; // Retorne o banco de dados aberto
};


// Cria a tabela de produtos se ela não existir
export const createTable = (db) => {
    db.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          quantity INTEGER NOT NULL
        );
        
        INSERT INTO PRODUCTS (name, price, quantity) VALUES('teste', 12, 10);

        `,
            [],
            () => {
                console.log('Tabela de produtos criada com sucesso');
            },
            (error) => {
                console.error('Erro ao criar a tabela de produtos:', error);
            }
        );
    });
};

// Função para adicionar um novo produto
export const addProduct = (name, price, quantity, successCallback, errorCallback) => {
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
// export const listProducts = (successCallback, errorCallback) => {
//     db.transaction((tx) => {
//         tx.executeSql('SELECT * FROM products', [], (tx, results) => {
//             if (results && results.rows) { // Verifica se results e results.rows não são nulos
//                 const len = results.rows.length;
//                 const products = [];
//                 for (let i = 0; i < len; i++) {
//                     const row = results.rows.item(i);
//                     products.push(row);
//                 }
//                 setProducts(products);
//             }
//         });
//     });
// };

// Função para atualizar um produto
export const updateProduct = (id, name, price, quantity, successCallback, errorCallback) => {
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
export const deleteProduct = (id, successCallback, errorCallback) => {
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

// Exporte as funções como um objeto
export default {
    createDatabase,
    createTable,
    addProduct,
    updateProduct,
    deleteProduct
};

