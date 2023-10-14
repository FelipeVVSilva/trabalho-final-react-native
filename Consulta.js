import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const Consulta = () => {
    const URL = "https://d09f-2804-14d-2a78-8d1f-c550-9217-951-e17.ngrok-free.app";
    const [products, setProducts] = useState([]);
    const [searchType, setSearchType] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState({
        id: null,
        name: '',
        preco: '',
        quantidade: '',
        medida: '1',
    });

    const openEditScreen = (product) => {

        setEditingProduct({
            id: product.id,
            codigo: product.codigo,
            name: product.name,
            preco: String(product.preco),
            quantidade: String(product.quantidade),
            medida: String(product.medida.id),
        });
        setModalVisible(true);
    };

    const formatPrice = (price) => {
        const formattedPrice = parseFloat(price).toFixed(2);
        return `R$ ${formattedPrice}`;
    };

    async function listProducts() {

        try {
            const response = await axios.get(`${URL}/produtos`);
            if (response.data.length === 0) {
                Alert.alert('Aviso',"Ainda não há produtos cadsatrados");
                setProducts(response.data);
            }
            else {
                setProducts(response.data);
            }
        } catch (error) {

            console.error('Erro ao buscar produtos:', error);
        }
    }

    async function searchProducts() {
        if (searchType === 'all') {

            listProducts();

            setSearchValue('');
        } else {

            const modifiedSearchValue = searchType === 'name' ? searchValue.replace(/ /g, '%20') : searchValue;
            const endpoint = searchType === 'name' ? `nome/${modifiedSearchValue.toUpperCase()}` : `codigo/${searchValue}`;

            try {
                const response = await axios.get(`${URL}/produtos/${endpoint}`);
                if (Array.isArray(response.data)) {

                    setProducts(response.data);
                } else if (typeof response.data === 'object') {

                    setProducts([response.data]);
                }
            } catch (error) {
                if (error.response && error.response.status === 404 && error.response.data.message === undefined) {
                    console.log('Erro 404:', error.response.data.message);
                    Alert.alert('Erro', "Digite algum valor");
                }else if(error.response && error.response.status === 404){
                    Alert.alert('Erro',error.response.data.message);
                }
                else {
                    console.error('Erro','Erro ao buscar produtos:', error);
                }
            }
        }
    }



    const updateProduct = () => {

        const updatedProduct = {
            codigo: editingProduct.id,
            name: editingProduct.name,
            preco: parseFloat(editingProduct.preco),
            quantidade: parseInt(editingProduct.quantidade),
            medida: {
                id: parseInt(editingProduct.medida),
            },
        };


        axios
            .put(`${URL}/produtos/${editingProduct.id}`, updatedProduct)
            .then((response) => {

                if (response.status === 200) {
                    listProducts();
                    setModalVisible(false);

                }
            })
            .catch((error) => {
                console.error('Erro ao atualizar o produto:', error);
            });
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`${URL}/produtos/${productId}`);
            if (response.status === 204) {
                setDeleteConfirmationVisible(false);

                await listProducts();
            } else {
                throw new Error('Erro ao excluir o produto');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro','Erro ao excluir o produto');
        }
    };

    const confirmDelete = (productId) => {

        setDeleteConfirmationVisible(true);


        setEditingProduct(products.find((product) => product.id === productId));
    };


    const cancelDelete = () => {
        setDeleteConfirmationVisible(false);
    };

    useEffect(() => {
        listProducts();
    }, []);

    return (

        <View style={styles.container}>
            <Text style={styles.header}>Consultar estoque</Text>
            <Text style={styles.label}>Procurar por:</Text>
            <Picker
                selectedValue={searchType}
                style={styles.picker}
                onValueChange={(itemValue) => setSearchType(itemValue)}
            >
                <Picker.Item label="Todos" value="all" />
                <Picker.Item label="Nome" value="name" />
                <Picker.Item label="Código" value="codigo" />
            </Picker>
            {searchType !== 'all' && (
                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome ou código"
                    value={searchValue}
                    onChangeText={(value) => setSearchValue(value)}
                />
            )}
            <TouchableOpacity style={styles.searchButton} onPress={searchProducts}>
                <Text style={styles.searchButtonText}>Procurar</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.modalInput}
                            value={editingProduct.codigo}
                            editable={false}
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={editingProduct.name}
                            onChangeText={(value) => setEditingProduct({ ...editingProduct, name: value })}
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={editingProduct.preco}
                            onChangeText={(value) => setEditingProduct({ ...editingProduct, preco: value })}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={editingProduct.quantidade}
                            onChangeText={(value) => setEditingProduct({ ...editingProduct, quantidade: value })}
                            keyboardType="numeric"
                        />
                        <Picker
                            style={styles.measurePicker}
                            selectedValue={editingProduct.medida}
                            onValueChange={(itemValue) => setEditingProduct({ ...editingProduct, medida: itemValue })}
                        >
                            <Picker.Item label="Quilograma" value="1" />
                            <Picker.Item label="Litro" value="2" />
                            <Picker.Item label="Pack" value="3" />
                        </Picker>
                        <TouchableOpacity style={styles.modalButton} onPress={updateProduct}>
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
                                onPress={() => deleteProduct(editingProduct.id)}
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
            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.productItem}
                        onPress={() => openEditScreen(item)}
                    >
                        <View style={styles.productDetails}>
                            <Text style={styles.productCode}>#{item.codigo}</Text>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productPrice}>{formatPrice(item.preco)}</Text>
                            <Text style={styles.productQuantity}>Quantidade: {item.quantidade}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteProductButton}
                            onPress={() => confirmDelete(item.id)}
                        >
                            <Text style={{ color: 'red' }}>Deletar</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => (item.id ? item.id.toString() : '')}
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 18,
    },
    picker: {
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
    },
    searchButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
    },
    productItem: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: 'green',
    },
    list: {
        marginTop: 10,
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
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
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
    navigationButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 20,
    },
    navigationButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default Consulta;
