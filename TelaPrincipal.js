import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    Image,
} from 'react-native';
import { openDatabase } from "react-native-sqlite-storage";
import LogoImage from './assets/LogoCaixa.png'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    selectAllProducts,
    sqlInsert,
    sqlDelete,
    sqlUpdate,
    sqlCreate
} from './Database'

const TelaPrincipal = () => {
    const [products, setProducts] = useState([]);
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductQuantity, setNewProductQuantity] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [editingName, setEditingName] = useState('');
    const [editingPrice, setEditingPrice] = useState('');
    const [editingQuantity, setEditingQuantity] = useState('');

    const openDB = () => {
        return new Promise((resolve, reject) => {
            db = openDatabase({ name: 'LojaDatabase.db', location: 'default', }, resolve, reject);
        });
    }

    async function createDatabase() {
        db.transaction((tx) => {tx.executeSql(sqlCreate, [], () => { console.log('Tabela criada com sucesso!'); }, (error) => 
            { console.log('Erro ao criar tabela:', error); })});
    }

    async function listProducts() {
        db.transaction((tx) => tx.executeSql(selectAllProducts, [], (tx, results) => {
            if (results && results.rows) { // Verifica se results e results.rows não são nulos
                const len = results.rows.length;
                const products = [];
                for (let i = 0; i < len; i++) {
                    const row = results.rows.item(i);
                    products.push(row);
                }
                setProducts(products);
            }
        }))
    }

    const addProduct = () => {
        if (
            newProductName.trim() !== '' &&
            newProductPrice.trim() !== '' &&
            newProductQuantity.trim() !== ''
        ) {
            // Execute uma inserção no banco de dados SQLite
            db.transaction((tx) => {
                tx.executeSql(sqlInsert,
                    [newProductName, newProductPrice, newProductQuantity],
                    (tx, results) => {
                        if (results.insertId) {
                            // Se a inserção for bem-sucedida, atualize a lista de produtos
                            listProducts();
                        }
                    }
                );
            });

            setNewProductName('');
            setNewProductPrice('');
            setNewProductQuantity('');
        }
    };

    const openDetails = (product) => {
        setSelectedProduct(product);
        setEditingName(product.name);
        setEditingPrice(product.price.toString());
        setEditingQuantity(product.quantity.toString());
        setModalVisible(true);
    };

    const confirmDelete = (product) => {
        setSelectedProduct(product);
        setDeleteConfirmationVisible(true);
    };

    const cancelDelete = () => {
        setDeleteConfirmationVisible(false);
    };

    const deleteProduct = () => {
        if (selectedProduct) {
            // Execute uma exclusão no banco de dados SQLite
            db.transaction((tx) => {
                tx.executeSql(
                    sqlDelete, [selectedProduct.id],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            // Se a exclusão for bem-sucedida, atualize a lista de produtos
                            listProducts();
                        }
                    }
                );
            });
        }
        setDeleteConfirmationVisible(false);
        setSelectedProduct(null);
    };

    const incrementQuantity = () => {
        setEditingQuantity((prevQuantity) =>
            (parseInt(prevQuantity) + 1).toString()
        );
    };

    const decrementQuantity = () => {
        if (parseInt(editingQuantity) > 0) {
            setEditingQuantity((prevQuantity) =>
                (parseInt(prevQuantity) - 1).toString()
            );
        } else {
            setEditingQuantity("0");
        }
    };

    const formatPrice = (price) => {
        const formattedPrice = parseFloat(price).toFixed(2);
        return `R$ ${formattedPrice.replace('.', ',')}`;
    };

    const saveDetails = () => {
        if (selectedProduct) {
            // Execute uma atualização no banco de dados SQLite
            db.transaction((tx) => {
                tx.executeSql(
                    sqlUpdate,
                    [editingName, editingPrice, editingQuantity, selectedProduct.id],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            // Se a atualização for bem-sucedida, atualize a lista de produtos
                            listProducts();
                        }
                    }
                );
            });
        }
        setModalVisible(false);
        setSelectedProduct(null);
    };

    useEffect(() => {
        try {
            // Abra o banco de dados
            console.log("ENTROU NO USE EFFECTS");
            console.log("-------------------------------------------------------");

            openDB()
                .then(() => {
                    // Banco de dados aberto com sucesso, agora você pode chamar outras funções, como createDatabase ou listProducts, aqui.
                    createDatabase();
                    console.log("Banco de dados aberto com sucesso.");
                })
                .catch((error) => {
                    console.error('Erro ao abrir o banco de dados:', error);
                });
        } catch (error) {
            console.error('Erro ao inicializar o banco de dados:', error);
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Controle de Estoque</Text>
                <Image source={LogoImage} style={styles.logo} />
            </View>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.modalInput}
                            value={editingName}
                            placeholder="Entre com o nome do produto"
                            onChangeText={(value) => setEditingName(value)}
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={editingPrice}
                            placeholder="Entre com o preço do produto"
                            keyboardType="numeric"
                            onChangeText={(value) => setEditingPrice(value)}
                        />
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={[styles.quantityButton, styles.decrementButton]}
                                onPress={decrementQuantity}
                            >
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={[styles.quantityInput, styles.largerInput]}
                                value={editingQuantity}
                                keyboardType="numeric"
                                onChangeText={(value) => setEditingQuantity(value)}
                            />
                            <TouchableOpacity
                                style={[styles.quantityButton, styles.incrementButton]}
                                onPress={incrementQuantity}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={saveDetails}>
                            <Text style={styles.modalButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={deleteConfirmationVisible} animationType="slide" transparent={true}>
                <View style={styles.deleteModalContainer}>
                    <View style={styles.deleteModalContent}>
                        <Text style={styles.deleteModalText}>Você tem certeza que deseja excluir esse produto?</Text>
                        <View style={styles.deleteModalButtons}>
                            <TouchableOpacity
                                style={[styles.deleteModalButton, styles.deleteButton]}
                                onPress={deleteProduct}
                            >
                                <Text style={styles.deleteModalButtonText}>Deletar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.deleteModalButton, styles.cancelButton]}
                                onPress={cancelDelete}
                            >
                                <Text style={styles.deleteModalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TextInput
                style={styles.input}
                placeholder="Entre com o nome do produto"
                value={newProductName}
                onChangeText={(value) => setNewProductName(value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Entre com o preço do produto"
                keyboardType="numeric"
                value={newProductPrice}
                onChangeText={(value) => setNewProductPrice(value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Entre com a quantidade de produtos"
                keyboardType="numeric"
                value={newProductQuantity}
                onChangeText={(value) => setNewProductQuantity(value)}
            />
            <TouchableOpacity style={styles.addButton} onPress={addProduct}>
                <Text style={styles.addButtonText}>Adicionar Produto</Text>
            </TouchableOpacity>

            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openDetails(item)}>
                        <View style={styles.productItem}>
                            <Icon name={item.icon} size={24} color="#000" style={styles.productIcon} />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                                <Text style={styles.productQuantity}>Quantidade: {item.quantity}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteProductButton}
                                onPress={() => confirmDelete(item)}
                            >
                                <Icon name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logo: {
        marginTop: 10,
        width: 100,
        height: 100,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
    },
    list: {
        marginTop: 10,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
        justifyContent: 'space-between',
    },
    productIcon: {
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: 'green',
    },
    productQuantity: {
        fontSize: 14,
        color: 'gray',
    },
    deleteProductButton: {
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    modalInput: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 4,
        marginBottom: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    quantityButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#007bff',
        borderRadius: 4,
        marginHorizontal: 5,
    },
    incrementButton: {
        backgroundColor: 'green',
    },
    decrementButton: {
        backgroundColor: 'red',
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityInput: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 4,
        width: 60,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    largerInput: {
        width: 150,
    },
    modalButton: {
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: '#007bff',
    },
    modalButtonText: {
        color: '#fff',
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    deleteModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    deleteModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    deleteModalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    deleteModalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    deleteModalButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    deleteModalButtonText: {
        color: '#fff',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
});

export default TelaPrincipal;
