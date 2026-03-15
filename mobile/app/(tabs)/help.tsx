import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useUserStore } from '../../store/useUserStore';
import { ShieldCheck, TerminalSquare, Info, LayoutGrid, Users, QrCode, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// ─── Constants (Pre-state) ───
const INITIAL_KPI_DATA = [
  { label: 'Hackers Active', value: 1248, code: 'CON_SESS', change: '+12.4%', changeColor: '#16A34A', changeBg: '#ECFDF3', bar: 82, barColor: '#064c18' },
  { label: 'Submissions', value: 312, code: 'REPO_SYNC', change: '+5.2%', changeColor: '#16A34A', changeBg: '#ECFDF3', bar: 45, barColor: '#16A34A' },
  { label: 'Active Tickets', value: 14, code: 'PEND_RES', change: 'High Load', changeColor: '#D97706', changeBg: '#FFFBEB', bar: 68, barColor: '#F59E0B' },
  { label: 'Avg Response', value: '8:42', code: 'MIN_SEC', change: '-2m', changeColor: '#16A34A', changeBg: '#F0FDF4', bar: 15, barColor: '#E11D48' },
];

const INITIAL_EVENTS = [
  { time: '16:42:01', type: 'GIT_PUSH', dotColor: '#064c18', source: 'Repo #echo-v3 by @jdoe42', status: 'Verified', statusColor: '#16A34A', statusBg: '#ECFDF3' },
  { time: '16:41:45', type: 'OAUTH_LOGIN', dotColor: '#16A34A', source: 'Org Access: github_auth', status: 'Success', statusColor: '#16A34A', statusBg: '#ECFDF3' },
  { time: '16:40:12', type: 'MENTOR_REQ', dotColor: '#F59E0B', source: 'Table 42: "K8s Node Failure"', status: 'Pending', statusColor: '#D97706', statusBg: '#FFFBEB' },
  { time: '16:38:55', type: 'RATE_LIMIT', dotColor: '#E11D48', source: 'Source IP: 192.168.1.104', status: 'Throttled', statusColor: '#E11D48', statusBg: '#FFF1F2' },
];

const NAV_ITEMS = [
  { icon: <LayoutGrid size={18} color="#4F46E5" />, title: 'Dashboard', sub: 'Event Overview & Analytics', route: '/(tabs)/dashboard' },
  { icon: <Users size={18} color="#16A34A" />, title: 'Participants', sub: 'Mentor Hub & Team Lists', route: '/(tabs)/team' },
  { icon: <QrCode size={18} color="#EA580C" />, title: 'QR Scanner', sub: 'Attendance & Verification', route: '/(tabs)/qr' },
];

export default function HelpScreen() {
  const { role, setRole } = useUserStore();
  const router = useRouter();

  // ─── State ───
  const [uptimeSeconds, setUptimeSeconds] = useState(34 * 86400 + 12 * 3600 + 9 * 60 + 44);
  const [chartData, setChartData] = useState([150, 165, 120, 140, 80, 105, 60, 90, 45, 75, 30]);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [kpiData, setKpiData] = useState(INITIAL_KPI_DATA);

  // ─── Effects ───
  
  // 1. Uptime Clock
  useEffect(() => {
    const timer = setInterval(() => setUptimeSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Chart random walk & KPI fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      // Randomize chart
      setChartData(prev => {
        const newData = [...prev.slice(1), Math.floor(Math.random() * 140) + 20];
        return newData;
      });

      // Randomize KPI values slightly
      setKpiData(prev => prev.map(item => {
        if (typeof item.value === 'number') {
          const delta = Math.random() > 0.5 ? 1 : -1;
          return { ...item, value: Math.max(0, item.value + (Math.random() > 0.1 ? 0 : delta)) };
        }
        return item;
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 3. Fake Live Events
  useEffect(() => {
    const eventTypes = [
      { type: 'API_CALL', color: '#3B82F6', status: '200 OK', sColor: '#16A34A', sBg: '#ECFDF3' },
      { type: 'REDIS_HIT', color: '#EF4444', status: 'Verified', sColor: '#16A34A', sBg: '#ECFDF3' },
      { type: 'NODE_UP', color: '#10B981', status: 'Online', sColor: '#16A34A', sBg: '#ECFDF3' },
      { type: 'DB_QUERY', color: '#F59E0B', status: 'Slow', sColor: '#D97706', sBg: '#FFFBEB' },
    ];

    const timer = setInterval(() => {
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const newEvent = {
        time: timeStr,
        type: randomType.type,
        dotColor: randomType.color,
        source: `Internal_System@instance-${Math.floor(Math.random() * 999)}`,
        status: randomType.status,
        statusColor: randomType.sColor,
        statusBg: randomType.sBg,
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 5)]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // ─── Handlers ───
  const formatUptime = (totalSeconds: number) => {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${d}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleElevate = () => {
    Alert.alert(
      "Elevate Control",
      "Do you want to authorize Admin God Mode for this session?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Authorize", onPress: () => {
          setRole('admin');
          Alert.alert("Authorized", "System permissions elevated to Level 0.");
        }}
      ]
    );
  };

  const handleIntercept = () => {
    Alert.alert(
      "Queue InterceptED",
      "Manual dispatch override successful. All unassigned tickets have been broadcasted to available mentors.",
      [{ text: "Acknowledge" }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Role Elevation Banner */}
      {(role === 'volunteer' || role === 'staff') && (
        <TouchableOpacity style={styles.elevationBanner} onPress={handleElevate}>
          <ShieldCheck color="#064c18" size={18} />
          <Text style={styles.elevationText}>
            Priority Access: {role.toUpperCase()}. 
            <Text style={{ fontWeight: '800', textDecorationLine: 'underline' }}> GO ADMIN</Text>
          </Text>
        </TouchableOpacity>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoIcon}>
            <TerminalSquare color="#064c18" size={20} />
          </View>
          <View>
            <Text style={styles.headerTitle}>OPS COMMAND</Text>
            <View style={styles.godModeRow}>
              <View style={styles.greenDot} />
              <Text style={styles.godModeText}>System.God_Mode: {role === 'admin' ? 'ACTIVE' : 'READY'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.uptimeBox}>
          <Text style={styles.uptimeLabel}>SYS_UPTIME</Text>
          <Text style={styles.uptimeValue}>{formatUptime(uptimeSeconds)}</Text>
        </View>
      </View>

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        {kpiData.map((kpi, i) => (
          <View key={i} style={styles.kpiCard}>
            <View style={styles.kpiTop}>
              <Text style={styles.kpiLabel}>{kpi.label.toUpperCase()}</Text>
              <View style={[styles.kpiChange, { backgroundColor: kpi.changeBg }]}>
                <Text style={[styles.kpiChangeText, { color: kpi.changeColor }]}>{kpi.change}</Text>
              </View>
            </View>
            <View style={styles.kpiValueRow}>
              <Text style={styles.kpiValue}>{kpi.value.toLocaleString()}</Text>
              <Text style={styles.kpiCode}>{kpi.code}</Text>
            </View>
            <View style={styles.kpiBar}>
              <View style={[styles.kpiBarFill, { width: `${kpi.bar}%`, backgroundColor: kpi.barColor }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Venue Pulse */}
      <View style={styles.pulseCard}>
        <View style={styles.pulseHeader}>
          <View>
            <View style={styles.pulseTitleRow}>
              <View style={styles.pulseAnimDot} />
              <Text style={styles.pulseTitle}>VENUE PULSE</Text>
            </View>
            <Text style={styles.pulseSub}>Live cross-repo commit activity</Text>
          </View>
          <View style={styles.pulseValueBox}>
            <Text style={styles.pulseMainValue}>{Math.round(chartData.reduce((a, b) => a + b, 0) / chartData.length * 6)}</Text>
            <Text style={styles.pulseMainLabel}>AVG COMMIT RATE</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartGrid}>
            {chartData.map((val, i) => {
              const maxVal = 200;
              const normalizedHeight = (val / maxVal) * 100;
              return (
                <View key={i} style={styles.chartBarWrapper}>
                  <View style={[styles.chartBar, { height: `${Math.max(10, normalizedHeight)}%`, opacity: 0.5 + (i / chartData.length) * 0.5 }]} />
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.chartTimeRow}>
          <Text style={styles.chartTime}>-12H</Text>
          <Text style={styles.chartTime}>-8H</Text>
          <Text style={styles.chartTime}>-4H</Text>
          <Text style={styles.chartTime}>-1H</Text>
          <Text style={[styles.chartTime, { color: '#16A34A' }]}>REALTIME</Text>
        </View>
      </View>

      {/* Critical Queue */}
      <View style={styles.criticalCard}>
        <View style={styles.criticalHeader}>
          <Text style={styles.criticalTitle}>🚨  CRITICAL_QUEUE.sys</Text>
          <View style={styles.hotBadge}>
            <Text style={styles.hotText}>HOT</Text>
          </View>
        </View>
        <View style={styles.criticalGrid}>
          <View style={styles.criticalStat}>
            <Text style={styles.criticalStatLabel}>UNASSIGNED</Text>
            <Text style={styles.criticalStatValue}>06</Text>
          </View>
          <View style={styles.criticalStat}>
            <Text style={styles.criticalStatLabel}>DISPATCHED</Text>
            <Text style={styles.criticalStatValue}>08</Text>
          </View>
        </View>
        <View style={styles.mentorUtil}>
          <View style={styles.mentorUtilTop}>
            <Text style={styles.mentorUtilLabel}>DISPATCH OVERRIDE</Text>
            <Text style={styles.mentorUtilPercent}>72% LOAD</Text>
          </View>
          <View style={styles.mentorUtilBar}>
            <View style={[styles.mentorUtilFill, { width: '72%' }]} />
          </View>
        </View>
        <TouchableOpacity style={styles.interceptBtn} activeOpacity={0.8} onPress={handleIntercept}>
          <Text style={styles.interceptText}>EXECUTE INTERCEPT  →</Text>
        </TouchableOpacity>
      </View>

      {/* Live Events */}
      <View style={styles.eventsCard}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>📊  SYSTEM_TRAFFIC.logs</Text>
          <View style={styles.connectedBadge}>
            <Text style={styles.connectedText}>STABLE</Text>
          </View>
        </View>
        {events.map((e, i) => (
          <View key={i} style={[styles.eventRow, i < events.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }]}>
            <Text style={styles.eventTime}>{e.time}</Text>
            <View style={styles.eventTypeCol}>
              <View style={[styles.eventDot, { backgroundColor: e.dotColor }]} />
              <Text style={styles.eventType}>{e.type}</Text>
            </View>
            <Text style={styles.eventSource} numberOfLines={1}>{e.source}</Text>
            <View style={[styles.eventStatus, { backgroundColor: e.statusBg }]}>
              <Text style={[styles.eventStatusText, { color: e.statusColor }]}>{e.status}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Navigation Hub */}
      <View style={styles.navHub}>
        {NAV_ITEMS.map((item, i) => (
          <TouchableOpacity 
            key={i} 
            style={[styles.navItem, i < NAV_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }]} 
            activeOpacity={0.7}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.navIconWrapper}>
              {item.icon}
            </View>
            <View style={styles.navInfo}>
              <Text style={styles.navTitle}>{item.title.toUpperCase()}</Text>
              <Text style={styles.navSub}>{item.sub.toUpperCase()}</Text>
            </View>
            <ArrowRight size={16} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F1A' },
  content: { padding: 20, paddingTop: 50 },

  // Elevation Banner (Matching Dashboard notifications)
  elevationBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#8B5CF620', borderWidth: 1, borderColor: '#8B5CF640', padding: 12, borderRadius: 12, marginBottom: 24, borderLeftWidth: 4 },
  elevationText: { fontSize: 13, color: '#E2E8F0', fontWeight: '600' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#8B5CF615', borderWidth: 1, borderColor: '#8B5CF630', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#F1F5F9', fontFamily: 'monospace', letterSpacing: 2 },
  godModeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  godModeText: { fontSize: 10, fontWeight: '700', color: '#10B981', fontFamily: 'monospace', letterSpacing: 1 },
  uptimeBox: { alignItems: 'flex-end' },
  uptimeLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', fontFamily: 'monospace', letterSpacing: 1 },
  uptimeValue: { fontSize: 14, fontWeight: '800', color: '#CBD5E1', fontFamily: 'monospace', marginTop: 2 },

  // KPI Grid
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 24 },
  kpiCard: { width: '47.5%', backgroundColor: '#111827', borderRadius: 14, borderWidth: 1, borderColor: '#1E293B', padding: 16 },
  kpiTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  kpiLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
  kpiChange: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  kpiChangeText: { fontSize: 9, fontWeight: '800' },
  kpiValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 12 },
  kpiValue: { fontSize: 26, fontWeight: '800', color: '#F1F5F9' },
  kpiCode: { fontSize: 10, color: '#475569', fontFamily: 'monospace' },
  kpiBar: { height: 4, backgroundColor: '#1E293B', borderRadius: 2, overflow: 'hidden' },
  kpiBarFill: { height: '100%', borderRadius: 2 },

  // Pulse Card (Visual activity graph)
  pulseCard: { backgroundColor: '#111827', borderRadius: 16, borderWidth: 1, borderColor: '#1E293B', overflow: 'hidden', marginBottom: 24 },
  pulseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F1629' },
  pulseTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  pulseAnimDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8B5CF6' },
  pulseTitle: { fontSize: 13, fontWeight: '800', color: '#F1F5F9', fontFamily: 'monospace', letterSpacing: 2 },
  pulseSub: { fontSize: 10, color: '#64748B', fontFamily: 'monospace', letterSpacing: 0.5 },
  pulseValueBox: { alignItems: 'flex-end' },
  pulseMainValue: { fontSize: 36, fontWeight: '800', color: '#8B5CF6', lineHeight: 38 },
  pulseMainLabel: { fontSize: 9, fontWeight: '700', color: '#64748B', fontFamily: 'monospace', letterSpacing: 1 },
  chartContainer: { padding: 20, height: 120 },
  chartGrid: { flexDirection: 'row', alignItems: 'flex-end', flex: 1, gap: 5, height: '100%' },
  chartBarWrapper: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  chartBar: { backgroundColor: '#8B5CF6', borderRadius: 4, minHeight: 12 },
  chartTimeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  chartTime: { fontSize: 10, fontWeight: '700', color: '#475569', fontFamily: 'monospace' },

  // Critical Queue (High Priority Action)
  criticalCard: { backgroundColor: '#111827', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#EF444430' },
  criticalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  criticalTitle: { fontSize: 14, fontWeight: '800', color: '#F1F5F9', fontFamily: 'monospace', letterSpacing: 1.5 },
  hotBadge: { backgroundColor: '#EF444420', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#EF444450' },
  hotText: { fontSize: 10, fontWeight: '800', color: '#EF4444' },
  criticalGrid: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  criticalStat: { flex: 1, backgroundColor: '#0B0F1A', borderRadius: 12, borderWidth: 1, borderColor: '#1E293B', padding: 14 },
  criticalStatLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', fontFamily: 'monospace', letterSpacing: 1 },
  criticalStatValue: { fontSize: 32, fontWeight: '800', color: '#F1F5F9', marginTop: 6 },
  mentorUtil: { marginBottom: 20 },
  mentorUtilTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  mentorUtilLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', fontFamily: 'monospace' },
  mentorUtilPercent: { fontSize: 10, fontWeight: '800', color: '#8B5CF6', fontFamily: 'monospace' },
  mentorUtilBar: { height: 8, backgroundColor: '#1E293B', borderRadius: 4, overflow: 'hidden' },
  mentorUtilFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4 },
  interceptBtn: { backgroundColor: '#8B5CF6', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  interceptText: { fontSize: 12, fontWeight: '800', color: '#FFF', fontFamily: 'monospace', letterSpacing: 2 },

  // Live System Traffic Logs
  eventsCard: { backgroundColor: '#111827', borderRadius: 16, borderWidth: 1, borderColor: '#1E293B', overflow: 'hidden', marginBottom: 24 },
  eventsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F1629' },
  eventsTitle: { fontSize: 12, fontWeight: '800', color: '#F1F5F9', fontFamily: 'monospace', letterSpacing: 1.5 },
  connectedBadge: { backgroundColor: '#10B98115', borderWidth: 1, borderColor: '#10B98130', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  connectedText: { fontSize: 9, fontWeight: '800', color: '#10B981', fontFamily: 'monospace', letterSpacing: 0.5 },
  eventRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, gap: 12 },
  eventTime: { fontSize: 12, color: '#475569', fontFamily: 'monospace', width: 65 },
  eventTypeCol: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 100 },
  eventDot: { width: 8, height: 8, borderRadius: 4 },
  eventType: { fontSize: 12, fontWeight: '700', color: '#E2E8F0' },
  eventSource: { flex: 1, fontSize: 12, color: '#64748B' },
  eventStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  eventStatusText: { fontSize: 9, fontWeight: '800', fontFamily: 'monospace', letterSpacing: 1 },

  // Navigation Hub (Bottom quick access)
  navHub: { backgroundColor: '#111827', borderRadius: 16, borderWidth: 1, borderColor: '#1E293B', padding: 10, marginBottom: 20 },
  navItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 16 },
  navIconWrapper: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#0F1629', borderWidth: 1, borderColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  navInfo: { flex: 1 },
  navTitle: { fontSize: 13, fontWeight: '700', color: '#F1F5F9', fontFamily: 'monospace' },
  navSub: { fontSize: 10, color: '#64748B', fontFamily: 'monospace', letterSpacing: 0.5, marginTop: 4 },
});
