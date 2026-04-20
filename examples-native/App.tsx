import React, { useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MNavigationIsland } from 'orbmobile-ui';
import { Stack, type RootStackParamList } from './src/navigation/types';

import { HomeScreen } from './src/screens/HomeScreen';
import { StdReportScreen } from './src/screens/StdReportScreen';
import { KanbanScreen } from './src/screens/KanbanScreen';
import { AgentUIScreen } from './src/screens/AgentUIScreen';
import { NAVIGATION_MENU } from './src/config/navigationMenu';

const linking = {
  prefixes: ['orbmobile://', 'exp://127.0.0.1:8082/--', 'exp://localhost:8082/--'],
  config: {
    screens: {
      Home: '',
      StdReport: 'std-report',
      Kanban: 'kanban',
      AgentUI: 'chat',
    },
  },
};

export default function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const { width } = useWindowDimensions();
  const [currentRoute, setCurrentRoute] = useState<keyof RootStackParamList>('Home');
  const horizontalInset = width >= 768 ? 20 : 10;

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.appFrame}>
          <View style={[styles.navigatorHost, { paddingHorizontal: horizontalInset }]}> 
            <NavigationContainer
              ref={navigationRef}
              linking={linking}
              onReady={() => {
                const route = navigationRef.getCurrentRoute()?.name;
                if (route) {
                  setCurrentRoute(route);
                }
              }}
              onStateChange={() => {
                const route = navigationRef.getCurrentRoute()?.name;
                if (route) {
                  setCurrentRoute(route);
                }
              }}
            >
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerShown: false,
                  contentStyle: styles.screenContent,
                }}
              >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="StdReport" component={StdReportScreen} />
                <Stack.Screen name="Kanban" component={KanbanScreen} />
                <Stack.Screen name="AgentUI" component={AgentUIScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>

          <MNavigationIsland
            currentRoute={currentRoute}
            items={NAVIGATION_MENU}
            userName="Shen"
            userInitials="SY"
            onNavigate={(route) => {
              if (navigationRef.isReady()) {
                navigationRef.navigate(route);
              }
            }}
          />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appFrame: {
    flex: 1,
    backgroundColor: '#EEF3FB',
  },
  navigatorHost: {
    flex: 1,
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },
  screenContent: {
    backgroundColor: '#EEF3FB',
    borderRadius: 32,
    overflow: 'hidden',
  },
});
