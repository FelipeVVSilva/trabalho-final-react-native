import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [isEmailTaken, setIsEmailTaken] = useState(false);

  const handleLogin = () => {
    // Verificar se o email e a senha correspondem ao mock de login
    if (email === 'admin@gmail.com' && password === 'admin') {
      // Autenticação bem-sucedida, redirecione para a tela do aplicativo
      navigation.navigate('App');
    } else {
      // Autenticação falhou, você pode exibir uma mensagem de erro aqui
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  const handleRegistration = () => {
    // Verifique se o email já está sendo usado (apenas um exemplo, em uma implementação real,
    // você usaria um sistema de gerenciamento de usuários)
    if (registrationEmail === 'admin@gmail.com') {
      setIsEmailTaken(true);
      return;
    }

    // Registre o usuário com o email e senha fornecidos (neste exemplo, não há armazenamento real)
    alert('Usuário registrado com sucesso.');
    setIsEmailTaken(false);
    setRegistrationEmail('');
    setRegistrationPassword('');
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
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={registrationEmail}
        onChangeText={(text) => setRegistrationEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        value={registrationPassword}
        onChangeText={(text) => setRegistrationPassword(text)}
      />
      {isEmailTaken && (
        <Text style={styles.errorMessage}>Este email já está sendo usado.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Login;
