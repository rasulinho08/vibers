import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, TextInput, Alert, Animated } from 'react-native';
import {
  LayoutGrid, Calendar, Users, Layers, FolderGit2, Scale, LifeBuoy, Megaphone,
  BarChart3, Settings, Search, Bell, ChevronDown, Activity, GitCommit,
  ArrowUpRight, Clock, Play, CheckCircle2, Circle, Zap, Plus, UserPlus,
  Upload, Gavel, TrendingUp, X, Send, ChevronUp, Check, LogOut
} from 'lucide-react-native';
import { useUserStore } from '../../store/useUserStore';
import { useRouter } from 'expo-router';

// ─── Types ───
type TicketStatus = 'Open' | 'Claimed' | 'Resolved';
interface Ticket { id: string; team: string; issue: string; status: TicketStatus; mentor: string; }
interface Announcement { id: number; title: string; time: string; author: string; color: string; }
interface Notification { id: number; text: string; time: string; read: boolean; }
type Submission = { name: string; team: string; repo: string; time: string; status: string; };

// ─── Static Data ───
const NAV_ITEMS = [
  { icon: LayoutGrid, label: 'Dashboard', section: 'metrics' },
  { icon: Calendar, label: 'Events', section: 'timeline' },
  { icon: Users, label: 'Participants', section: 'metrics' },
  { icon: Layers, label: 'Teams', section: 'teams' },
  { icon: FolderGit2, label: 'Projects', section: 'submissions' },
  { icon: Scale, label: 'Judging', section: 'submissions' },
  { icon: LifeBuoy, label: 'Help Queue', section: 'helpqueue' },
  { icon: Megaphone, label: 'Announcements', section: 'announcements' },
  { icon: BarChart3, label: 'Analytics', section: 'activity' },
  { icon: Settings, label: 'Settings', section: 'metrics' },
];

const EVENTS_LIST = ['Global Hackathon 2026', 'Winter Hack 2025', 'AI Challenge 2026'];

const PHASES = [
  { label: 'Registration', status: 'done', date: 'Mar 1–10' },
  { label: 'Hacking', status: 'active', date: 'Mar 11–14' },
  { label: 'Submission', status: 'upcoming', date: 'Mar 15' },
  { label: 'Judging', status: 'upcoming', date: 'Mar 16–17' },
  { label: 'Results', status: 'upcoming', date: 'Mar 18' },
];

const INITIAL_TICKETS: Ticket[] = [
  { id: 'TK-042', team: 'NeuralNinjas', issue: 'API 500 Error', status: 'Open', mentor: '—' },
  { id: 'TK-041', team: 'ByteBusters', issue: 'OAuth redirect loop', status: 'Claimed', mentor: '@elena_m' },
  { id: 'TK-040', team: 'PixelPunks', issue: 'Docker build fail', status: 'Resolved', mentor: '@james_k' },
  { id: 'TK-039', team: 'CloudCrew', issue: 'Database timeout', status: 'Open', mentor: '—' },
];

const INITIAL_SUBMISSIONS: Submission[] = [
  { name: 'EcoTrack AI', team: 'GreenByte', repo: 'greenbyte/ecotrack', time: '2m ago', status: 'Under Review' },
  { name: 'MedAssist', team: 'HealthHack', repo: 'healthhack/medassist', time: '8m ago', status: 'Accepted' },
  { name: 'DevFlow', team: 'CodeCraft', repo: 'codecraft/devflow', time: '15m ago', status: 'Accepted' },
  { name: 'FinBot', team: 'MoneyMakers', repo: 'mm/finbot', time: '22m ago', status: 'Under Review' },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: 'Submission deadline extended by 2 hours!', time: '5 min ago', author: 'Event Admin', color: '#F59E0B' },
  { id: 2, title: 'Workshop: "Deploying to AWS" – Main Hall', time: '1 hour ago', author: 'Mentor', color: '#3B82F6' },
  { id: 3, title: 'API keys distributed to all registered teams.', time: '3 hours ago', author: 'System', color: '#10B981' },
];

const INITIAL_NOTIFS: Notification[] = [
  { id: 1, text: 'NeuralNinjas submitted help ticket TK-042', time: '2m ago', read: false },
  { id: 2, text: 'New project "EcoTrack AI" submitted', time: '5m ago', read: false },
  { id: 3, text: 'Mentor @elena_m claimed ticket TK-041', time: '12m ago', read: true },
];

const STATUS_COLORS: Record<TicketStatus, string> = { Open: '#EF4444', Claimed: '#F59E0B', Resolved: '#10B981' };

// ─── Toast Component ───
function Toast({ message, visible }: { message: string; visible: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(1800),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);
  if (!visible) return null;
  return (
    <Animated.View style={[st.toast, { opacity }]}>
      <Check color="#10B981" size={16} />
      <Text style={st.toastText}>{message}</Text>
    </Animated.View>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 960;
  const isTablet = width > 640;
  const role = useUserStore((s) => s.role);
  const logout = useUserStore((s) => s.logout);
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  // ─── State ───
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [countdown, setCountdown] = useState({ h: 14, m: 22, s: 10 });
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('Global Hackathon 2026');
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showAnnounceForm, setShowAnnounceForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [chartData, setChartData] = useState([25,38,42,55,48,72,88,95,78,62,85,110,98,120,105,92,78,65,58,72,88,95,82,70]);
  // Quick Action states
  const [showJudgeForm, setShowJudgeForm] = useState(false);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [judgeName, setJudgeName] = useState('');
  const [judgeEmail, setJudgeEmail] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [submissionsOpen, setSubmissionsOpen] = useState(false);
  const [judgingStarted, setJudgingStarted] = useState(false);
  const [judgesCount, setJudgesCount] = useState(18);
  const [mentorsCount, setMentorsCount] = useState(7);

  // ── Section layout offsets (approximate scroll positions) ──
  const sectionOffsets: Record<string, number> = {
    metrics: 0, timeline: 280, activity: 550, teams: 550,
    helpqueue: 850, submissions: 1200, announcements: 1550 };

  // Live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 0, m: 0, s: 0 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live chart updates every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const next = [...prev.slice(1), Math.floor(30 + Math.random() * 100)];
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const maxCommit = Math.max(...chartData);

  // ─── Role Checks ───
  const isStaffOrAdmin = role === 'staff' || role === 'admin' || !role;
  const isParticipant = role === 'participant';
  const isMentor = role === 'mentor';
  const isVolunteer = role === 'volunteer';
  const isPartner = role === 'partner';

  // ─── Dynamic Metrics (computed from state) ───
  const openTicketCount = tickets.filter(t => t.status === 'Open').length;
  const METRICS = [
    { label: 'Total Participants', value: '1,248', change: '+12%', color: '#8B5CF6', bar: 78 },
    { label: 'Active Teams', value: '312', change: '+8%', color: '#3B82F6', bar: 65 },
    { label: 'Submitted Projects', value: String(submissions.length), change: `+${submissions.length}`, color: '#10B981', bar: 45 },
    { label: 'Judges Assigned', value: String(judgesCount), change: judgesCount >= 18 ? '100%' : `${Math.round((judgesCount/18)*100)}%`, color: '#F59E0B', bar: Math.min(100, (judgesCount/18)*100) },
    { label: 'Mentors Online', value: String(mentorsCount), change: 'Live', color: '#EC4899', bar: (mentorsCount/12)*100 },
    { label: 'Open Help Requests', value: String(openTicketCount), change: openTicketCount > 0 ? 'Active' : 'Clear', color: '#EF4444', bar: (openTicketCount / 4) * 100 },
  ];

  // ─── Handlers ───
  const showToast = (message: string) => {
    setToast({ visible: false, message: '' });
    setTimeout(() => setToast({ visible: true, message }), 50);
    setTimeout(() => setToast({ visible: false, message: '' }), 2500);
  };

  const handleClaimTicket = (id: string) => {
    setTickets(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'Claimed' as TicketStatus, mentor: '@you' } : t
    ));
    const newNotif: Notification = { id: Date.now(), text: `You claimed ticket ${id}`, time: 'Just now', read: false };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Ticket ${id} claimed successfully!`);
  };

  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'Resolved' as TicketStatus } : t
    ));
    const newNotif: Notification = { id: Date.now(), text: `Ticket ${id} resolved`, time: 'Just now', read: false };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Ticket ${id} resolved!`);
  };

  const handleSendAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    const newAnn: Announcement = {
      id: Date.now(), title: newAnnouncement.trim(), time: 'Just now', author: 'You', color: '#8B5CF6',
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    const newNotif: Notification = { id: Date.now(), text: `Announcement posted: "${newAnnouncement.trim().slice(0, 30)}..."`, time: 'Just now', read: false };
    setNotifications(prev => [newNotif, ...prev]);
    setNewAnnouncement('');
    setShowAnnounceForm(false);
    showToast('Announcement published!');
  };

  const handleAddJudge = () => {
    if (!judgeName.trim()) return;
    setJudgesCount(prev => prev + 1);
    const newNotif: Notification = { id: Date.now(), text: `Judge "${judgeName}" invited${judgeEmail ? ` (${judgeEmail})` : ''}`, time: 'Just now', read: false };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Judge "${judgeName}" added!`);
    setJudgeName(''); setJudgeEmail(''); setShowJudgeForm(false);
  };

  const handleAddMentor = () => {
    if (!mentorName.trim()) return;
    setMentorsCount(prev => prev + 1);
    const newNotif: Notification = { id: Date.now(), text: `Mentor "${mentorName}" added${mentorEmail ? ` (${mentorEmail})` : ''}`, time: 'Just now', read: false };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Mentor "${mentorName}" added!`);
    setMentorName(''); setMentorEmail(''); setShowMentorForm(false);
  };

  const handleToggleSubmissions = () => {
    setSubmissionsOpen(prev => !prev);
    const newNotif: Notification = { id: Date.now(), text: submissionsOpen ? 'Submissions closed' : 'Submissions opened', time: 'Just now', read: false };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(submissionsOpen ? 'Submissions closed!' : 'Submissions are now open!');
  };

  const handleToggleJudging = () => {
    setJudgingStarted(prev => !prev);
    const newNotif: Notification = { id: Date.now(), text: judgingStarted ? 'Judging paused' : 'Judging phase started', time: 'Just now', read: false };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(judgingStarted ? 'Judging paused!' : 'Judging phase initiated!');
  };

  const handleSelectEvent = (event: string) => {
    setSelectedEvent(event); setShowEventDropdown(false);
    showToast(`Switched to "${event}"`);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNavPress = (label: string, section: string) => {
    setActiveNav(label);
    const offset = sectionOffsets[section] || 0;
    scrollRef.current?.scrollTo({ y: offset, animated: true });
  };

  const handleSearch = (text: string) => setSearchQuery(text);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Search filtering ──
  const filteredTickets = searchQuery
    ? tickets.filter(t => t.team.toLowerCase().includes(searchQuery.toLowerCase()) || t.issue.toLowerCase().includes(searchQuery.toLowerCase()))
    : tickets;
  const filteredSubmissions = searchQuery
    ? submissions.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.team.toLowerCase().includes(searchQuery.toLowerCase()))
    : submissions;

  // ─── Sidebar Component ───
  const Sidebar = () => (
    <View style={st.sidebar}>
      <View style={st.sidebarLogo}>
        <View style={st.logoBox}><Zap color="#8B5CF6" size={18} /></View>
        <Text style={st.logoText}>HackOS</Text>
      </View>
      <View style={st.navList}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity key={item.label}
            style={[st.navItem, activeNav === item.label && st.navItemActive]}
            onPress={() => handleNavPress(item.label, item.section)}>
            <item.icon color={activeNav === item.label ? '#8B5CF6' : '#64748B'} size={18} />
            <Text style={[st.navLabel, activeNav === item.label && st.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={st.sidebarFooter}>
        <View style={st.planBadge}><Text style={st.planText}>PRO PLAN</Text></View>
        <Text style={st.orgName}>TechOrg Inc.</Text>
      </View>
    </View>
  );

  return (
    <View style={st.root}>
      {isDesktop && <Sidebar />}

      <View style={st.mainArea}>
        {/* ── Top Header ── */}
        <View style={st.topBar}>
          <View style={st.topLeft}>
            {!isDesktop && (
              <View style={st.mobileLogo}>
                <Zap color="#8B5CF6" size={16} />
                <Text style={[st.logoText, { marginLeft: 6 }]}>HackOS</Text>
              </View>
            )}
            {/* Event Switcher */}
            <View>
              <TouchableOpacity style={st.eventSwitcher} onPress={() => setShowEventDropdown(!showEventDropdown)}>
                <Text style={st.eventSwitcherText}>{selectedEvent}</Text>
                {showEventDropdown ? <ChevronUp color="#64748B" size={14} /> : <ChevronDown color="#64748B" size={14} />}
              </TouchableOpacity>
              {showEventDropdown && (
                <View style={st.eventDropdown}>
                  {EVENTS_LIST.map(ev => (
                    <TouchableOpacity key={ev} style={[st.eventDropdownItem, selectedEvent === ev && st.eventDropdownItemActive]}
                      onPress={() => handleSelectEvent(ev)}>
                      <Text style={[st.eventDropdownText, selectedEvent === ev && { color: '#8B5CF6' }]}>{ev}</Text>
                      {selectedEvent === ev && <Check color="#8B5CF6" size={14} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
          <View style={st.topRight}>
            {isTablet && (
              <View style={st.searchBox}>
                <Search color="#475569" size={14} />
                <TextInput placeholder="Search teams, tickets..." placeholderTextColor="#475569"
                  style={st.searchInput} value={searchQuery} onChangeText={handleSearch} />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}><X color="#64748B" size={14} /></TouchableOpacity>
                )}
              </View>
            )}
            {/* Notifications */}
            <View>
              <TouchableOpacity style={st.notifBtn} onPress={() => setShowNotifPanel(!showNotifPanel)}>
                <Bell color="#94A3B8" size={18} />
                {unreadCount > 0 && (
                  <View style={st.notifDot}><Text style={st.notifDotText}>{unreadCount}</Text></View>
                )}
              </TouchableOpacity>
              {showNotifPanel && (
                <View style={st.notifPanel}>
                  <View style={st.notifPanelHeader}>
                    <Text style={st.notifPanelTitle}>Notifications</Text>
                    <TouchableOpacity onPress={handleMarkAllRead}><Text style={st.markAllRead}>Mark all read</Text></TouchableOpacity>
                  </View>
                  <ScrollView style={{ maxHeight: 250 }}>
                    {notifications.map(n => (
                      <View key={n.id} style={[st.notifItem, !n.read && st.notifItemUnread]}>
                        <View style={[st.notifItemDot, !n.read && { backgroundColor: '#8B5CF6' }]} />
                        <View style={{ flex: 1 }}>
                          <Text style={st.notifItemText}>{n.text}</Text>
                          <Text style={st.notifItemTime}>{n.time}</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <TouchableOpacity style={st.userAvatar}>
              <Text style={st.userAvatarText}>{role ? role.charAt(0).toUpperCase() : 'S'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.logoutBtn} onPress={handleLogout}>
              <LogOut color="#EF4444" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Scrollable Content ── */}
        <ScrollView ref={scrollRef} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ── Page Title ── */}
          <View style={st.pageHeader}>
            <View>
              <Text style={st.pageTitle}>
                {isParticipant ? 'Hacker Dashboard' :
                 isMentor ? 'Mentor Portal' :
                 isVolunteer ? 'Volunteer Station' :
                 isPartner ? 'Partner Analytics' : 'Command Center'}
              </Text>
              <Text style={st.pageSub}>
                {isParticipant ? 'Manage your team & project submission' :
                 isMentor ? 'Help teams and review code' :
                 isVolunteer ? 'Manage event operations and tickets' :
                 isPartner ? 'Real-time event analytics' : 'Real-time event operations & monitoring'}
              </Text>
            </View>
            <View style={st.liveIndicator}><View style={st.liveDot} /><Text style={st.liveText}>LIVE</Text></View>
          </View>

          {/* ═══ Section 1: Event Overview Metrics ═══ */}
          {(isStaffOrAdmin || isPartner) && (
            <View style={st.metricsGrid}>
              {METRICS.map((m, i) => (
                <View key={i} style={st.metricCard}>
                  <View style={st.metricTop}>
                    <Text style={st.metricLabel}>{m.label}</Text>
                    <View style={[st.metricBadge, { backgroundColor: m.color + '20' }]}>
                      <Text style={[st.metricBadgeText, { color: m.color }]}>{m.change}</Text>
                    </View>
                  </View>
                  <Text style={st.metricValue}>{m.value}</Text>
                  <View style={[st.metricBar, { backgroundColor: m.color + '15' }]}>
                    <View style={[st.metricBarFill, { backgroundColor: m.color, width: `${m.bar}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ═══ Section 2: Hackathon Timeline ═══ */}
          {(isStaffOrAdmin || isParticipant) && (
            <View style={st.sectionCard}>
              <View style={st.sectionHead}>
                <View style={st.sectionHeadLeft}><Clock color="#8B5CF6" size={16} /><Text style={st.sectionTitle}>Hackathon Timeline</Text></View>
                <View style={st.countdownBox}>
                  <Text style={st.countdownLabel}>CURRENT PHASE</Text>
                  <Text style={st.countdownValue}>{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}</Text>
                </View>
              </View>
              <View style={st.timeline}>
                {PHASES.map((phase, i) => (
                  <View key={i} style={st.phaseItem}>
                    <View style={st.phaseNode}>
                      {phase.status === 'done' && <CheckCircle2 color="#10B981" size={20} />}
                      {phase.status === 'active' && (<View style={st.activeNode}><Play color="#8B5CF6" size={10} /></View>)}
                      {phase.status === 'upcoming' && <Circle color="#334155" size={20} />}
                    </View>
                    {i < PHASES.length - 1 && <View style={[st.phaseLine, phase.status === 'done' && st.phaseLineDone]} />}
                    <Text style={[st.phaseLabel, phase.status === 'active' && st.phaseLabelActive]}>{phase.label}</Text>
                    <Text style={st.phaseDate}>{phase.date}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ═══ Two-Column: Activity Chart + Team Distribution ═══ */}
          {(isStaffOrAdmin || isPartner || isVolunteer) && (
            <View style={[st.twoCol, !isTablet && { flexDirection: 'column' }]}>
              {/* Live Activity Graph (auto-updating) */}
              {(isStaffOrAdmin || isPartner || isVolunteer) && (
                <View style={[st.sectionCard, isTablet && { flex: 2, marginRight: 16 }]}>
                  <View style={st.sectionHead}>
                    <View style={st.sectionHeadLeft}><Activity color="#3B82F6" size={16} /><Text style={st.sectionTitle}>Live Activity</Text></View>
                    <View style={st.chartLegend}>
                      <View style={st.legendItem}><View style={[st.legendDot, { backgroundColor: '#8B5CF6' }]} /><Text style={st.legendText}>Commits</Text></View>
                      <View style={st.legendItem}><View style={[st.legendDot, { backgroundColor: '#3B82F6' }]} /><Text style={st.legendText}>Submissions</Text></View>
                    </View>
                  </View>
                  <View style={st.chartArea}>
                    {chartData.map((val, i) => (
                      <View key={i} style={st.chartBarCol}>
                        <View style={[st.chartBar, { height: `${(val / maxCommit) * 100}%`, backgroundColor: i % 3 === 0 ? '#3B82F6' : '#8B5CF6' }]} />
                      </View>
                    ))}
                  </View>
                  <View style={st.chartFooter}>
                    <Text style={st.chartFooterText}><TrendingUp color="#10B981" size={12} />{'  '}Peak: {Math.max(...chartData)} commits/hr • Updates every 3s</Text>
                  </View>
                </View>
              )}
              {/* Team Status */}
              {(isStaffOrAdmin || isVolunteer) && (
                <View style={[st.sectionCard, isTablet && { flex: 1 }]}>
                  <View style={st.sectionHead}><View style={st.sectionHeadLeft}><Layers color="#8B5CF6" size={16} /><Text style={st.sectionTitle}>Team Status</Text></View></View>
                  {[{ label: 'Active', value: 248, color: '#8B5CF6' }, { label: 'Idle', value: 42, color: '#475569' }, { label: 'LFM', value: 22, color: '#3B82F6' }].map((t, i) => (
                    <View key={i} style={st.teamDistItem}>
                      <View style={st.teamDistLeft}><View style={[st.teamDistDot, { backgroundColor: t.color }]} /><Text style={st.teamDistLabel}>{t.label}</Text></View>
                      <Text style={st.teamDistValue}>{t.value}</Text>
                      <View style={st.teamDistBarBg}><View style={[st.teamDistBarFill, { width: `${(t.value / 312) * 100}%`, backgroundColor: t.color }]} /></View>
                    </View>
                  ))}
                  <View style={st.teamTotal}><Text style={st.teamTotalLabel}>Total Teams</Text><Text style={st.teamTotalValue}>312</Text></View>
                </View>
              )}
            </View>
          )}

          {/* ═══ Section 5: Help Queue System (INTERACTIVE) ═══ */}
          {(isStaffOrAdmin || isMentor || isVolunteer) && (
            <View style={st.sectionCard}>
              <View style={st.sectionHead}>
                <View style={st.sectionHeadLeft}><LifeBuoy color="#EF4444" size={16} /><Text style={st.sectionTitle}>Help Queue</Text></View>
                <View style={st.ticketCount}><Text style={st.ticketCountText}>{filteredTickets.filter(t => t.status !== 'Resolved').length} active</Text></View>
              </View>
              <View style={st.tableHeaderRow}>
                <Text style={[st.tableH, { flex: 0.6 }]}>ID</Text>
                <Text style={[st.tableH, { flex: 1.2 }]}>Team</Text>
                <Text style={[st.tableH, { flex: 1.5 }]}>Issue</Text>
                <Text style={[st.tableH, { flex: 0.8 }]}>Status</Text>
                <Text style={[st.tableH, { flex: 1 }]}>Mentor</Text>
                <Text style={[st.tableH, { flex: 0.8 }]}>Action</Text>
              </View>
              {filteredTickets.map((t, i) => (
                <View key={t.id} style={[st.tableRow, i % 2 === 0 && st.tableRowAlt]}>
                  <Text style={[st.tableCell, { flex: 0.6, color: '#8B5CF6' }]}>{t.id}</Text>
                  <Text style={[st.tableCell, { flex: 1.2 }]}>{t.team}</Text>
                  <Text style={[st.tableCell, { flex: 1.5 }]}>{t.issue}</Text>
                  <View style={{ flex: 0.8 }}>
                    <View style={[st.statusPill, { backgroundColor: STATUS_COLORS[t.status] + '20' }]}>
                      <Text style={[st.statusPillText, { color: STATUS_COLORS[t.status] }]}>{t.status}</Text>
                    </View>
                  </View>
                  <Text style={[st.tableCell, { flex: 1 }]}>{t.mentor}</Text>
                  <View style={{ flex: 0.8 }}>
                    {t.status === 'Open' && (
                      <TouchableOpacity style={st.claimBtn} onPress={() => handleClaimTicket(t.id)}>
                        <Text style={st.claimBtnText}>Claim</Text>
                      </TouchableOpacity>
                    )}
                    {t.status === 'Claimed' && (
                      <TouchableOpacity style={st.resolveBtn} onPress={() => handleResolveTicket(t.id)}>
                        <Text style={st.resolveBtnText}>Resolve</Text>
                      </TouchableOpacity>
                    )}
                    {t.status === 'Resolved' && <Text style={st.resolvedText}>✓ Done</Text>}
                  </View>
                </View>
              ))}
              {filteredTickets.length === 0 && <Text style={st.emptyText}>No tickets match your search.</Text>}
            </View>
          )}

          {/* ═══ Section 6: Recent Submissions ═══ */}
          {(isStaffOrAdmin || isMentor || isPartner) && (
            <View style={st.sectionCard}>
              <View style={st.sectionHead}>
                <View style={st.sectionHeadLeft}><FolderGit2 color="#10B981" size={16} /><Text style={st.sectionTitle}>Recent Submissions</Text></View>
                <TouchableOpacity style={st.viewAllBtn}><Text style={st.viewAllText}>View All</Text><ArrowUpRight color="#8B5CF6" size={12} /></TouchableOpacity>
              </View>
              <View style={st.tableHeaderRow}>
                <Text style={[st.tableH, { flex: 1.5 }]}>Project</Text>
                <Text style={[st.tableH, { flex: 1 }]}>Team</Text>
                <Text style={[st.tableH, { flex: 1.5 }]}>Repository</Text>
                <Text style={[st.tableH, { flex: 0.7 }]}>Time</Text>
                <Text style={[st.tableH, { flex: 1 }]}>Status</Text>
              </View>
              {filteredSubmissions.map((sub, i) => (
                <View key={i} style={[st.tableRow, i % 2 === 0 && st.tableRowAlt]}>
                  <Text style={[st.tableCell, { flex: 1.5, fontWeight: '600', color: '#E2E8F0' }]}>{sub.name}</Text>
                  <Text style={[st.tableCell, { flex: 1 }]}>{sub.team}</Text>
                  <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                    <GitCommit color="#475569" size={12} style={{ marginRight: 4 }} />
                    <Text style={[st.tableCell, { color: '#8B5CF6' }]}>{sub.repo}</Text>
                  </View>
                  <Text style={[st.tableCell, { flex: 0.7, color: '#64748B' }]}>{sub.time}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={[st.statusPill, { backgroundColor: sub.status === 'Accepted' ? '#10B98120' : '#F59E0B20' }]}>
                      <Text style={[st.statusPillText, { color: sub.status === 'Accepted' ? '#10B981' : '#F59E0B' }]}>{sub.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
              {filteredSubmissions.length === 0 && <Text style={st.emptyText}>No submissions match your search.</Text>}
            </View>
          )}

          {/* ═══ Two-Column: Announcements + Quick Actions ═══ */}
          <View style={[st.twoCol, !isTablet && { flexDirection: 'column' }]}>
            {/* Announcements (INTERACTIVE) */}
            <View style={[st.sectionCard, isTablet && { flex: 1.5, marginRight: 16 }]}>
              <View style={st.sectionHead}>
                <View style={st.sectionHeadLeft}><Megaphone color="#F59E0B" size={16} /><Text style={st.sectionTitle}>Announcements</Text></View>
                <View style={st.ticketCount}><Text style={[st.ticketCountText, { color: '#F59E0B' }]}>{announcements.length}</Text></View>
              </View>
              {announcements.map(ann => (
                <View key={ann.id} style={st.announcementItem}>
                  <View style={[st.annDot, { backgroundColor: ann.color }]} />
                  <View style={st.annContent}>
                    <Text style={st.annTitle}>{ann.title}</Text>
                    <Text style={st.annTime}>{ann.time} • {ann.author}</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setAnnouncements(prev => prev.filter(a => a.id !== ann.id));
                    showToast('Announcement removed');
                  }}>
                    <X color="#334155" size={14} />
                  </TouchableOpacity>
                </View>
              ))}
              {/* Compose Form */}
              {showAnnounceForm ? (
                <View style={st.composeForm}>
                  <TextInput style={st.composeInput} placeholder="Type your announcement..."
                    placeholderTextColor="#475569" value={newAnnouncement} onChangeText={setNewAnnouncement}
                    multiline autoFocus />
                  <View style={st.composeActions}>
                    <TouchableOpacity style={st.composeCancelBtn} onPress={() => { setShowAnnounceForm(false); setNewAnnouncement(''); }}>
                      <Text style={st.composeCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={st.composeSendBtn} onPress={handleSendAnnouncement}>
                      <Send color="#FFF" size={14} />
                      <Text style={st.composeSendText}>Publish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={st.composeBtn} onPress={() => setShowAnnounceForm(true)}>
                  <Plus color="#8B5CF6" size={14} /><Text style={st.composeBtnText}>New Announcement</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Actions (FULLY INTERACTIVE) */}
            {isStaffOrAdmin && (
              <View style={[st.sectionCard, isTablet && { flex: 1 }]}>
                <View style={st.sectionHead}><View style={st.sectionHeadLeft}><Zap color="#8B5CF6" size={16} /><Text style={st.sectionTitle}>Quick Actions</Text></View></View>
                <View style={st.actionList}>

                {/* 1. Create Announcement */}
                <TouchableOpacity style={st.actionBtn} onPress={() => { setShowAnnounceForm(true); scrollRef.current?.scrollTo({ y: 1550, animated: true }); }}>
                  <View style={[st.actionIcon, { backgroundColor: '#8B5CF620' }]}><Megaphone color="#8B5CF6" size={16} /></View>
                  <Text style={st.actionText}>Create Announcement</Text>
                  <ArrowUpRight color="#334155" size={14} />
                </TouchableOpacity>

                {/* 2. Add Judge */}
                <TouchableOpacity style={[st.actionBtn, showJudgeForm && st.actionBtnExpanded]} onPress={() => setShowJudgeForm(!showJudgeForm)}>
                  <View style={[st.actionIcon, { backgroundColor: '#3B82F620' }]}><UserPlus color="#3B82F6" size={16} /></View>
                  <Text style={[st.actionText, { flex: 1 }]}>Add Judge</Text>
                  <View style={st.qaCountBadge}><Text style={st.qaCountText}>{judgesCount}</Text></View>
                </TouchableOpacity>
                {showJudgeForm && (
                  <View style={st.qaForm}>
                    <TextInput style={st.qaInput} placeholder="Judge name" placeholderTextColor="#475569" value={judgeName} onChangeText={setJudgeName} />
                    <TextInput style={st.qaInput} placeholder="Email (optional)" placeholderTextColor="#475569" value={judgeEmail} onChangeText={setJudgeEmail} keyboardType="email-address" />
                    <View style={st.qaFormBtns}>
                      <TouchableOpacity style={st.qaCancel} onPress={() => { setShowJudgeForm(false); setJudgeName(''); setJudgeEmail(''); }}>
                        <Text style={st.qaCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[st.qaSubmit, { backgroundColor: '#3B82F6' }]} onPress={handleAddJudge}>
                        <UserPlus color="#FFF" size={12} /><Text style={st.qaSubmitText}>Add Judge</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* 3. Add Mentor */}
                <TouchableOpacity style={[st.actionBtn, showMentorForm && st.actionBtnExpanded]} onPress={() => setShowMentorForm(!showMentorForm)}>
                  <View style={[st.actionIcon, { backgroundColor: '#10B98120' }]}><UserPlus color="#10B981" size={16} /></View>
                  <Text style={[st.actionText, { flex: 1 }]}>Add Mentor</Text>
                  <View style={st.qaCountBadge}><Text style={st.qaCountText}>{mentorsCount}</Text></View>
                </TouchableOpacity>
                {showMentorForm && (
                  <View style={st.qaForm}>
                    <TextInput style={st.qaInput} placeholder="Mentor name" placeholderTextColor="#475569" value={mentorName} onChangeText={setMentorName} />
                    <TextInput style={st.qaInput} placeholder="Email (optional)" placeholderTextColor="#475569" value={mentorEmail} onChangeText={setMentorEmail} keyboardType="email-address" />
                    <View style={st.qaFormBtns}>
                      <TouchableOpacity style={st.qaCancel} onPress={() => { setShowMentorForm(false); setMentorName(''); setMentorEmail(''); }}>
                        <Text style={st.qaCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[st.qaSubmit, { backgroundColor: '#10B981' }]} onPress={handleAddMentor}>
                        <UserPlus color="#FFF" size={12} /><Text style={st.qaSubmitText}>Add Mentor</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* 4. Open Submissions – Toggle */}
                <TouchableOpacity style={st.actionBtn} onPress={handleToggleSubmissions}>
                  <View style={[st.actionIcon, { backgroundColor: submissionsOpen ? '#10B98130' : '#F59E0B20' }]}>
                    <Upload color={submissionsOpen ? '#10B981' : '#F59E0B'} size={16} />
                  </View>
                  <Text style={[st.actionText, { flex: 1 }]}>{submissionsOpen ? 'Submissions Open' : 'Open Submissions'}</Text>
                  <View style={[st.toggleTrack, submissionsOpen && st.toggleTrackOn]}>
                    <View style={[st.toggleThumb, submissionsOpen && st.toggleThumbOn]} />
                  </View>
                </TouchableOpacity>

                {/* 5. Start Judging – Toggle */}
                <TouchableOpacity style={st.actionBtn} onPress={handleToggleJudging}>
                  <View style={[st.actionIcon, { backgroundColor: judgingStarted ? '#EF444430' : '#EF444420' }]}>
                    <Gavel color="#EF4444" size={16} />
                  </View>
                  <Text style={[st.actionText, { flex: 1 }]}>{judgingStarted ? 'Judging Active' : 'Start Judging'}</Text>
                  <View style={[st.toggleTrack, judgingStarted && st.toggleTrackJudging]}>
                    <View style={[st.toggleThumb, judgingStarted && st.toggleThumbJudging]} />
                  </View>
                </TouchableOpacity>

              </View>
            </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      {/* ── Toast ── */}
      <Toast message={toast.message} visible={toast.visible} />
    </View>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STYLES – Dark SaaS Theme
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const st = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: '#0B0F1A' },

  // Sidebar
  sidebar: { width: 240, backgroundColor: '#0F1629', borderRightWidth: 1, borderRightColor: '#1E293B', paddingTop: 20, paddingBottom: 20 },
  sidebarLogo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 32 },
  logoBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#8B5CF620', justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 16, fontWeight: '800', color: '#E2E8F0', marginLeft: 10, letterSpacing: 0.5 },
  navList: { flex: 1 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20, marginBottom: 2 },
  navItemActive: { backgroundColor: '#8B5CF610', borderLeftWidth: 3, borderLeftColor: '#8B5CF6' },
  navLabel: { fontSize: 13, color: '#64748B', marginLeft: 12, fontWeight: '500' },
  navLabelActive: { color: '#E2E8F0', fontWeight: '600' },
  sidebarFooter: { paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1E293B' },
  planBadge: { backgroundColor: '#8B5CF620', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  planText: { fontSize: 10, fontWeight: '700', color: '#8B5CF6', letterSpacing: 1 },
  orgName: { fontSize: 12, color: '#64748B' },

  // Top Header
  mainArea: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F1629', zIndex: 100 },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, zIndex: 101 },
  mobileLogo: { flexDirection: 'row', alignItems: 'center' },
  eventSwitcher: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, gap: 8 },
  eventSwitcherText: { fontSize: 13, color: '#CBD5E1', fontWeight: '600' },
  eventDropdown: { position: 'absolute', top: 44, left: 0, backgroundColor: '#1E293B', borderRadius: 10, borderWidth: 1, borderColor: '#334155', minWidth: 240, zIndex: 200, overflow: 'hidden' },
  eventDropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#0F162910' },
  eventDropdownItemActive: { backgroundColor: '#8B5CF610' },
  eventDropdownText: { fontSize: 13, color: '#CBD5E1', fontWeight: '500' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 101 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, width: 220 },
  searchInput: { flex: 1, marginLeft: 8, color: '#CBD5E1', fontSize: 13, height: 28 },
  notifBtn: { position: 'relative', padding: 6 },
  notifDot: { position: 'absolute', top: 0, right: 0, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  notifDotText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  notifPanel: { position: 'absolute', top: 44, right: 0, backgroundColor: '#1E293B', borderRadius: 12, borderWidth: 1, borderColor: '#334155', width: 320, zIndex: 200, overflow: 'hidden' },
  notifPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  notifPanelTitle: { fontSize: 14, fontWeight: '700', color: '#E2E8F0' },
  markAllRead: { fontSize: 12, color: '#8B5CF6', fontWeight: '600' },
  notifItem: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, borderBottomWidth: 1, borderBottomColor: '#0B0F1A40', gap: 10 },
  notifItemUnread: { backgroundColor: '#8B5CF608' },
  notifItemDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#334155', marginTop: 4 },
  notifItemText: { fontSize: 13, color: '#CBD5E1', marginBottom: 2 },
  notifItemTime: { fontSize: 11, color: '#475569' },
  userAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  logoutBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EF444420', justifyContent: 'center', alignItems: 'center' },

  // Scroll Content
  scrollContent: { padding: 24 },

  // Page Header
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#F1F5F9' },
  pageSub: { fontSize: 13, color: '#64748B', marginTop: 4 },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B98120', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
  liveText: { fontSize: 11, fontWeight: '800', color: '#10B981', letterSpacing: 1 },

  // Metrics Grid
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 24 },
  metricCard: { flex: 1, minWidth: 150, backgroundColor: '#111827', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#1E293B' },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  metricLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  metricBadgeText: { fontSize: 10, fontWeight: '700' },
  metricValue: { fontSize: 28, fontWeight: '800', color: '#F1F5F9', marginBottom: 12 },
  metricBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  metricBarFill: { height: '100%', borderRadius: 2 },

  // Section Card
  sectionCard: { backgroundColor: '#111827', borderRadius: 14, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#1E293B' },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionHeadLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#E2E8F0' },

  // Timeline
  countdownBox: { alignItems: 'flex-end' },
  countdownLabel: { fontSize: 9, color: '#64748B', fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  countdownValue: { fontSize: 20, fontWeight: '800', color: '#8B5CF6', fontFamily: 'monospace' },
  timeline: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 10 },
  phaseItem: { alignItems: 'center', flex: 1 },
  phaseNode: { marginBottom: 8, zIndex: 2 },
  activeNode: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#8B5CF630', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#8B5CF6' },
  phaseLine: { position: 'absolute', top: 10, left: '60%', right: '-60%', height: 2, backgroundColor: '#1E293B', zIndex: 1 },
  phaseLineDone: { backgroundColor: '#10B981' },
  phaseLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', textAlign: 'center' },
  phaseLabelActive: { color: '#8B5CF6', fontWeight: '700' },
  phaseDate: { fontSize: 10, color: '#334155', marginTop: 2, textAlign: 'center' },

  // Two Column
  twoCol: { flexDirection: 'row', marginBottom: 4 },

  // Chart
  chartLegend: { flexDirection: 'row', gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#64748B' },
  chartArea: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 3, marginBottom: 12 },
  chartBarCol: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  chartBar: { borderRadius: 3, minHeight: 4 },
  chartFooter: { borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 12 },
  chartFooterText: { fontSize: 12, color: '#64748B' },

  // Team Distribution
  teamDistItem: { gap: 6, marginBottom: 16 },
  teamDistLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  teamDistDot: { width: 10, height: 10, borderRadius: 5 },
  teamDistLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  teamDistValue: { fontSize: 22, fontWeight: '800', color: '#F1F5F9' },
  teamDistBarBg: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' },
  teamDistBarFill: { height: '100%', borderRadius: 3 },
  teamTotal: { borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  teamTotalLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  teamTotalValue: { fontSize: 16, fontWeight: '800', color: '#E2E8F0' },

  // Tables
  tableHeaderRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  tableH: { fontSize: 10, fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 12, alignItems: 'center' },
  tableRowAlt: { backgroundColor: '#0B0F1A40' },
  tableCell: { fontSize: 13, color: '#94A3B8' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start' },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  claimBtn: { backgroundColor: '#8B5CF620', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  claimBtnText: { fontSize: 11, fontWeight: '700', color: '#8B5CF6' },
  resolveBtn: { backgroundColor: '#10B98120', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  resolveBtnText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  resolvedText: { fontSize: 12, color: '#10B981', fontWeight: '600' },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { fontSize: 12, color: '#8B5CF6', fontWeight: '600' },
  ticketCount: { backgroundColor: '#EF444420', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  ticketCountText: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
  emptyText: { textAlign: 'center', color: '#475569', paddingVertical: 20, fontSize: 13 },

  // Announcements
  announcementItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  annDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B', marginTop: 5, marginRight: 12 },
  annContent: { flex: 1 },
  annTitle: { fontSize: 13, color: '#CBD5E1', fontWeight: '500', marginBottom: 4 },
  annTime: { fontSize: 11, color: '#475569' },
  composeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#8B5CF640', borderStyle: 'dashed' },
  composeBtnText: { fontSize: 13, color: '#8B5CF6', fontWeight: '600' },
  composeForm: { marginTop: 16, backgroundColor: '#0B0F1A', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#1E293B' },
  composeInput: { color: '#E2E8F0', fontSize: 14, minHeight: 60, textAlignVertical: 'top', marginBottom: 12 },
  composeActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  composeCancelBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  composeCancelText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  composeSendBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  composeSendText: { fontSize: 12, color: '#FFF', fontWeight: '700' },

  // Quick Actions
  actionList: { gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#0B0F1A', borderWidth: 1, borderColor: '#1E293B' },
  actionBtnExpanded: { borderColor: '#8B5CF640', backgroundColor: '#0B0F1A' },
  actionIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionText: { fontSize: 13, color: '#CBD5E1', fontWeight: '600' },
  qaCountBadge: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, minWidth: 28, alignItems: 'center' },
  qaCountText: { fontSize: 11, fontWeight: '700', color: '#8B5CF6' },
  qaForm: { backgroundColor: '#111827', borderRadius: 10, padding: 14, marginTop: -4, marginBottom: 4, borderWidth: 1, borderColor: '#1E293B', borderTopWidth: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  qaInput: { backgroundColor: '#0B0F1A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 8, paddingHorizontal: 12, height: 38, color: '#E2E8F0', fontSize: 13, marginBottom: 8 },
  qaFormBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  qaCancel: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  qaCancelText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  qaSubmit: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  qaSubmitText: { fontSize: 12, color: '#FFF', fontWeight: '700' },
  toggleTrack: { width: 40, height: 22, borderRadius: 11, backgroundColor: '#334155', justifyContent: 'center', paddingHorizontal: 2 },
  toggleTrackOn: { backgroundColor: '#10B981' },
  toggleTrackJudging: { backgroundColor: '#EF4444' },
  toggleThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#64748B' },
  toggleThumbOn: { backgroundColor: '#FFF', alignSelf: 'flex-end' },
  toggleThumbJudging: { backgroundColor: '#FFF', alignSelf: 'flex-end' },

  // Toast
  toast: { position: 'absolute', bottom: 80, left: '50%', transform: [{ translateX: -140 }], backgroundColor: '#111827', borderWidth: 1, borderColor: '#10B98140', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8, width: 280, zIndex: 9999 },
  toastText: { fontSize: 13, color: '#E2E8F0', fontWeight: '600' },
});
