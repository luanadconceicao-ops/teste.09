import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!login || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail/telefone e senha');
      return;
    }

    if (codigo === '180') {
      Alert.alert('Central 180', 'central180@mulheres.gov.br | Ligue 180');
      return;
    }
    if (codigo === '190') {
      Alert.alert('Alerta', 'Ajuda acionada! Permaneça calma.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { login, senha });
      const usuario = response.data;

      if (usuario.genero === 'F') {
        router.push({
          pathname: '/dashboard-mulher',
          params: { usuario: JSON.stringify(usuario) }
        });
      } else {
        router.push({
          pathname: '/dashboard-homem',
          params: { usuario: JSON.stringify(usuario) }
        });
      }
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Falha na conexão');
    } finally {
      setLoading(false);
    }
  };

  const entrarComoConvidado = () => {
    const visitante = {
      id: 0,
      nome: 'Visitante',
      genero: 'M',
      tipo: 'convidado'
    };
    router.push({
      pathname: '/dashboard-homem',
      params: { usuario: JSON.stringify(visitante) }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛡️</Text>
      <Text style={styles.title}>Etervalis</Text>
      <Text style={styles.subtitle}>Proteção em Primeiro Lugar</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail ou telefone"
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        style={styles.input}
        placeholder="Código (opcional)"
        value={codigo}
        onChangeText={setCodigo}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={() => Alert.alert('Cadastro', 'Tela de cadastro não implementada neste teste')}>
        <Text style={styles.buttonOutlineText}>Criar nova conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={entrarComoConvidado}>
        <Text style={styles.link}>👤 Entrar como convidado (só jogos)</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert('Recuperar senha', 'Tela de recuperação não implementada neste teste')}>
        <Text style={styles.link}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 70,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonOutlineText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: '#4CAF50',
  },
});
