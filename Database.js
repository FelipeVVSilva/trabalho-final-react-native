import { openDatabase } from "react-native-sqlite-storage";

//var db = openDatabase({ name: 'LojaDatabase.db' });

const sqlCreate = 'CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,price REAL NOT NULL,quantity INTEGER NOT NULL);'

const selectAllProducts = 'SELECT * FROM PRODUCT';

const sqlInsert = 'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)';

const sqlDelete = 'DELETE FROM products WHERE id = ?';

const sqlUpdate = 'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?';

export default 
{
    selectAllProducts,
    sqlInsert,
    sqlDelete,
    sqlUpdate,
    sqlCreate
};