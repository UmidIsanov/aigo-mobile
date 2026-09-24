import {
  Onest_400Regular,
  Onest_500Medium,
  Onest_600SemiBold,
  Onest_700Bold,
} from '@expo-google-fonts/onest';
import { Unbounded_500Medium, Unbounded_600SemiBold, Unbounded_700Bold } from '@expo-google-fonts/unbounded';
import { DefaultTheme, LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AppStateProvider } from './src/state/AppState';
import { RootStackParamList } from './src/navigation/types';
import { colors } from './src/theme';

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bgCanvas, primary: colors.bgBrand },
};

// Deep links (e.g. /quiz on web) make any screen directly reachable for demos and QA.
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [],
  config: {
    screens: {
      Welcome: '',
      Age: 'age',
      Reality: 'reality',
      Professions: 'professions',
      Quiz: 'quiz',
      Insight: 'insight',
      Interests: 'interests',
      Main: { screens: { Home: 'home', Path: 'path', Portfolio: 'portfolio' } },
      Lesson: 'lesson',
    },
  },
};

export default function App() {
  const [loaded] = useFonts({
    Unbounded_500Medium,
    Unbounded_600SemiBold,
    Unbounded_700Bold,
    Onest_400Regular,
    Onest_500Medium,
    Onest_600SemiBold,
    Onest_700Bold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgCanvas }}>
        <ActivityIndicator color={colors.bgBrand} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <NavigationContainer theme={navTheme} linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </AppStateProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
