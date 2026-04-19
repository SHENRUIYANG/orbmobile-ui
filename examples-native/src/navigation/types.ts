import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Pad: undefined;
  StdReport: undefined;
  Kanban: undefined;
  PivotTable: undefined;
  AgentUI: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();
