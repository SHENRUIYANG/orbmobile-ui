import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text, Button, Chip } from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DEMO_CATALOG } from '../config/demoCatalog';
import type { RootStackParamList } from '../navigation/types';
import { getOrbmobileBaseUrl } from 'orbmobile-ui';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const baseUrl = getOrbmobileBaseUrl();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text variant="displaySmall" style={styles.title}>
          OrbMobile UI
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          React Native companion for orbcafe-ui — touch-optimised components
          and WebView bridges.
        </Text>
        <Chip icon="web" compact>
          web server: {baseUrl}
        </Chip>
      </View>

      {DEMO_CATALOG.map((demo) => (
        <Surface key={demo.route} style={styles.card} elevation={1}>
          <View style={styles.cardHeader}>
            <Text variant="headlineSmall" style={styles.cardTitle}>
              {demo.title}
            </Text>
            <Chip compact>{demo.path}</Chip>
          </View>

          <Text variant="titleSmall" style={styles.cardSubtitle}>
            {demo.subtitle}
          </Text>
          <Text variant="bodyLarge" style={styles.cardDetail}>
            {demo.detail}
          </Text>

          <Button mode="contained" onPress={() => navigation.navigate(demo.route)}>
            Open {demo.title}
          </Button>
        </Surface>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF3FB',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  hero: {
    gap: 10,
    marginBottom: 8,
  },
  title: {
    color: '#132033',
    fontWeight: '700',
  },
  subtitle: {
    color: '#4B5B74',
  },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    color: '#152239',
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#3D4C63',
  },
  cardDetail: {
    color: '#5A667A',
    lineHeight: 22,
  },
});
