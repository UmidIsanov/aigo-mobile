import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgeScreen from '../screens/AgeScreen';
import CheckScreen from '../screens/CheckScreen';
import HomeScreen from '../screens/HomeScreen';
import InsightScreen from '../screens/InsightScreen';
import InterestsScreen from '../screens/InterestsScreen';
import LessonScreen from '../screens/LessonScreen';
import PathScreen from '../screens/PathScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import ProfessionsScreen from '../screens/ProfessionsScreen';
import QuizScreen from '../screens/QuizScreen';
import RealityScreen from '../screens/RealityScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { colors, fonts } from '../theme';
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const tabIcons: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Path: 'map',
  Portfolio: 'briefcase',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.textBrand,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontFamily: fonts.bodySemi, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.bgSurface, borderTopColor: colors.borderDefault },
        tabBarIcon: ({ color, size }) => <Ionicons name={tabIcons[route.name]} color={color} size={size} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="Path" component={PathScreen} options={{ title: 'Путь' }} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} options={{ title: 'Портфолио' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Age" component={AgeScreen} />
      <Stack.Screen name="Reality" component={RealityScreen} />
      <Stack.Screen name="Professions" component={ProfessionsScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Check" component={CheckScreen} />
      <Stack.Screen name="Insight" component={InsightScreen} />
      <Stack.Screen name="Interests" component={InterestsScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
    </Stack.Navigator>
  );
}
