import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TabParamList = {
  Home: undefined;
  Path: undefined;
  Portfolio: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Age: undefined;
  Reality: undefined;
  Professions: undefined;
  Quiz: undefined;
  Check: undefined;
  Insight: undefined;
  Interests: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  Lesson: undefined;
};

export type StackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
