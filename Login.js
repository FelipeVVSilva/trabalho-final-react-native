import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  console.log('Rendering Login component');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const URL = 'https://8fb9-2804-14d-2a78-8d1f-ca3-88d0-defc-771.ngrok-free.app';
  const navigation = useNavigation();

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    const userData = {
      email,
      senha,
    };

    try {
      const response = await axios.post(`${URL}/clientes/login`, userData);

      if (response.status === 200) {
        navigation.navigate('Cadastro');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('Erro', error.response.data.message);
      } else if (error.response && error.response.status === 401) {
        Alert.alert('Erro',error.response.data.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao processar o login.');
      }
    }
  };

  const handleCadastro = async () => {
    if (!isEmailValid(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    if (senha !== senhaConfirmacao) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    const userData = {
      email,
      senha,
    };

    try {
      const response = await axios.post(`${URL}/clientes`, userData);

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso.');
        setEmail('');
        setSenha('');
        setSenhaConfirmacao('');
        toggleModal();
      } else if (response.status === 400) {
        Alert.alert('Erro', response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Erro', error.response.data.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao processar o cadastro.');
      }
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        value={senha}
        onChangeText={(text) => setSenha(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cadastroButton} onPress={toggleModal}>
        <Text style={styles.buttonText}>Cadastre-se</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Cadastre-se</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry={true}
              value={senha}
              onChangeText={(text) => setSenha(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Senha"
              secureTextEntry={true}
              value={senhaConfirmacao}
              onChangeText={(text) => setSenhaConfirmacao(text)}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleCadastro}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    width: '80%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    width: '80%',
  },
  cadastroButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    width: '80%',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  modalButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
  },
  modalCancelButton: {
    backgroundColor: '#6c757d',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Login;
