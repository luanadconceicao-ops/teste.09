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

export default function DashboardMulherScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const usuario = params.usuario ? JSON.parse(params.usuario as string) : { nome: 'Amiga', genero: 'F' };

  const menu = [
    { id: 'trofeu', icon: '🏆', title: 'Troféu', desc: 'Área de proteção', cor: '#f44336' },
    { id: 'jogos', icon: '🎮', title: 'Jogos', desc: 'Divirta-se', cor: '#4CAF50' },
    { id: 'compartilhar', icon: '📤', title: 'Compartilhar', desc: 'Divulgue o app', cor: '#2196F3' },
    { id: 'informacoes', icon: 'ℹ️', title: 'Informações', desc: 'Saiba mais', cor: '#FF9800' },
    { id: 'contatos', icon: '📞', title: 'Contatos', desc: 'Números importantes', cor: '#9C27B0' },
    { id: 'verificar', icon: '🔍', title: 'Verificar Código', desc: 'Ajude alguém', cor: '#00BCD4' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle" size={40} color="#4CAF50" />
          <Text style={styles.userName}>{usuario.nome}</Text>
          <View style={styles.badgeFeminino}>
            <Text style={styles.badgeText}>👩</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Ionicons name="log-out-outline" size={28} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeCardTop}>
            <View style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>Ver Pontos</Text>
            </View>
          </View>
          <Text style={styles.welcomeTitle}>Olá, {usuario.nome}!</Text>
          <Text style={styles.welcomeText}>Pontos acumulados e progresso de jogo.</Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>🎯 Progresso desbloqueado</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {menu.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { borderTopColor: item.cor }]}
              onPress={() => router.push(`/${item.id}`)}
            >
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.supportCard}>
          <Ionicons name="heart" size={24} color="#FF9800" />
          <Text style={styles.supportText}>
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
  badgeFeminino: {
    backgroundColor: '#fce4ec',
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
    marginBottom: 25,
  },
  welcomeCardTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
  },
  primaryAction: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryActionText: {
    color: '#2e7d32',
    fontWeight: '700',
    fontSize: 13,
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
    opacity: 0.95,
    lineHeight: 20,
  },
  progressBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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
    borderTopWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  cardDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  supportCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  supportText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
});
