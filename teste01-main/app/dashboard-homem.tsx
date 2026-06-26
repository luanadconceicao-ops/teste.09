import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardHomemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const usuario = params.usuario ? JSON.parse(params.usuario as string) : { nome: 'Visitante', genero: 'M' };

  const jogos = [
    { id: 'quiz', icon: '❓', nome: 'Quiz da Floresta', desc: 'Teste seus conhecimentos' },
    { id: 'puzzle', icon: '🧩', nome: 'Quebra-cabeça', desc: 'Monte as peças' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle" size={40} color="#4CAF50" />
          <Text style={styles.userName}>{usuario.nome}</Text>
          <View style={styles.badgeHomem}>
            <Text style={styles.badgeText}>👤</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Ionicons name="log-out-outline" size={28} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>🎮 Bem-vindo(a), {usuario.nome}!</Text>
          <Text style={styles.welcomeText}>Aproveite os jogos!</Text>
          <View style={styles.permissaoBadge}>
            <Text style={styles.permissaoText}>🎯 Modo jogos</Text>
          </View>
        </View>

        <View style={styles.avisoCard}>
          <Ionicons name="information-circle" size={20} color="#FF9800" />
          <Text style={styles.avisoText}>
            ℹ️ Este aplicativo é exclusivo para mulheres em situação de risco. Para acessar a área de proteção, crie uma conta com gênero feminino.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>🎮 Escolha seu jogo</Text>
        <View style={styles.grid}>
          {jogos.map((jogo) => (
            <TouchableOpacity
              key={jogo.id}
              style={styles.card}
              onPress={() => Alert.alert('Jogo', `Abrindo ${jogo.nome}`)}
            >
              <Text style={styles.cardIcon}>{jogo.icon}</Text>
              <Text style={styles.cardTitle}>{jogo.nome}</Text>
              <Text style={styles.cardDesc}>{jogo.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {usuario.tipo === 'convidado' && (
          <TouchableOpacity
            style={styles.conviteCard}
            onPress={() => Alert.alert('Cadastro', 'Tela de cadastro não implementada neste teste')}
          >
            <Ionicons name="person-add" size={24} color="#4CAF50" />
            <Text style={styles.conviteText}>
              Deseja ter acesso completo? Cadastre-se como mulher e tenha acesso à área de proteção.
            </Text>
            <Text style={styles.conviteButton}>Criar conta →</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💜 Ligue 180 - Central de Atendimento à Mulher | 24 horas
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  badgeHomem: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
  },
  welcomeCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  permissaoBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  permissaoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  avisoCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  avisoText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderTopWidth: 4,
    borderTopColor: '#4CAF50',
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  conviteCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
  },
  conviteText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 8,
  },
  conviteButton: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});
