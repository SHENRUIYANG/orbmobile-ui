import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Stack } from './src/navigation/types';

import { HomeScreen } from './src/screens/HomeScreen';
import { PadScreen } from './src/screens/PadScreen';
import { StdReportScreen } from './src/screens/StdReportScreen';
import { KanbanScreen } from './src/screens/KanbanScreen';
import { PivotTableScreen } from './src/screens/PivotTableScreen';
import { AgentUIScreen } from './src/screens/AgentUIScreen';

const linking = {
  prefixes: ['dousha://', 'exp://127.0.0.1:8082/--', 'exp://localhost:8082/--'],
  config: {
    screens: {
      Home: '',
      Pad: 'pad',
      StdReport: 'std-report',
      Kanban: 'kanban',
      PivotTable: 'pivot-table',
      AgentUI: 'chat',
    },
  },
};

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'DoushaBao Native' }} />
          <Stack.Screen name="Pad" component={PadScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StdReport" component={StdReportScreen} options={{ title: 'Standard Report' }} />
          <Stack.Screen name="Kanban" component={KanbanScreen} options={{ title: 'Kanban Board' }} />
          <Stack.Screen name="PivotTable" component={PivotTableScreen} options={{ title: 'Pivot Table' }} />
          <Stack.Screen name="AgentUI" component={AgentUIScreen} options={{ title: 'Agent UI' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
