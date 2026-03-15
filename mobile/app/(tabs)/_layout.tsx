import { Tabs } from 'expo-router';
import { LayoutGrid, Users, TerminalSquare, UploadCloud } from 'lucide-react-native';
import { useUserStore } from '../../store/useUserStore';

export default function TabLayout() {
  const role = useUserStore((state) => state.role);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F1629',
          borderTopWidth: 1,
          borderTopColor: '#1E293B',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#475569',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
          fontFamily: 'monospace',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'DASH',
          tabBarIcon: ({ color }) => <LayoutGrid color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: 'HUB',
          tabBarIcon: ({ color }) => <Users color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'LOGS',
          tabBarIcon: ({ color }) => <TerminalSquare color={color} size={22} />,
          href: (role === 'volunteer' || role === 'staff' || role === 'admin') ? '/(tabs)/help' : null,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: 'SUBMIT',
          tabBarIcon: ({ color }) => <UploadCloud color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
