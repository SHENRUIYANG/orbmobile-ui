import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  StdReport: undefined;
  Kanban: undefined;
  AgentUI: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();
