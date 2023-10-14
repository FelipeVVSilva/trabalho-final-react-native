import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import LogoImage from './assets/LogoCaixa.png'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';


const TelaCadastro = ({ navigation }) => {


    const URL = "https://7b27-2804-14d-2a78-8d1f-50da-4004-55ca-542c.ngrok-free.app";

    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductQuantity, setNewProductQuantity] = useState('');
    const [newProductCode, setNewProductCode] = useState('');
    const [newProductMeasure, setNewProductMeasure] = useState('1');
    const [error, setError] = useState('');

    const getMeasureLabel = (measureValue) => {
        switch (measureValue) {
            case '1':
                return 'Quilograma';
            case '2':
                return 'Litro';
            case '3':
                return 'Pack';
            default:
                return '';
        };
    }

    const addProduct = async () => {
        console.log('newProductName:', newProductName);
        console.log('newProductPrice:', newProductPrice);
        console.log('newProductQuantity:', newProductQuantity);
        console.log('newProductCode:', newProductCode);

        if (
            newProductName.trim() !== '' &&
            newProductPrice.trim() !== '' &&
            newProductQuantity.trim() !== '' &&
            newProductCode.trim() !== ''
        ) {
            const productData = {
                name: newProductName.toUpperCase(),
                codigo: newProductCode,
                preco: newProductPrice,
                quantidade: parseInt(newProductQuantity),
                medida: {
                    id: parseInt(newProductMeasure),
                    medida: getMeasureLabel(newProductMeasure),
                },
            };

            try {
                const response = await axios.post(`${URL}/produtos`, productData);

                if (response.status === 201) {
                    setError('');
                    alert("Produto cadastrado com sucesso!");
                    setNewProductName('');
                    setNewProductPrice('');
                    setNewProductQuantity('');
                    setNewProductCode('');
                    setNewProductMeasure('1');
                } else {
                    throw new Error('Erro ao adicionar o produto');
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    alert(error.response.data.message);

                } else {
                    console.error(error);
                    alert('Erro ao adicionar o produto');
                }
            }
        }
    };

    useEffect(() => {

    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Controle de Estoque</Text>
                <Image source={LogoImage} style={styles.logo} />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Entre com o nome do produto"
                value={newProductName}
                onChangeText={(value) => setNewProductName(value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Entre com o código do produto"
                value={newProductCode}
                onChangeText={(value) => setNewProductCode(value)}
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
            <Picker
                style={styles.measurePicker}
                selectedValue={newProductMeasure}
                onValueChange={(itemValue) => setNewProductMeasure(itemValue)}
            >
                <Picker.Item label="Quilograma" value="1" />
                <Picker.Item label="Litro" value="2" />
                <Picker.Item label="Pack" value="3" />
            </Picker>
            <TouchableOpacity style={styles.addButton} onPress={addProduct}>
                <Text style={styles.addButtonText}>Adicionar Produto</Text>
            </TouchableOpacity>
            {
                /*
                {error && (
                    <Text style={styles.errorText}>
                        Erro: {error}
                    </Text>
                )}
                */
            }
            <TouchableOpacity
                style={styles.navigationButton}
                onPress={() => navigation.navigate('Consulta')}
            >
                <Text style={styles.navigationButtonText}>Ir para Consulta</Text>
            </TouchableOpacity>

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
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },

});

export default TelaCadastro;
