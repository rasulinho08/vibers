import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions, Switch } from 'react-native';
import {
  Calendar, Plus, Users, UserPlus, Handshake, ChevronDown, ChevronUp,
  Zap, Search, X, Check, Clock, MapPin, Globe, Trash2, Edit3, Send,
  Star, Github, Link2, Briefcase, GraduationCap, Eye, EyeOff
} from 'lucide-react-native';

// ─── Types ───
interface HackEvent {
  id: number; name: string; date: string; location: string; participants: number; maxParticipants: number; status: 'Live' | 'Upcoming' | 'Ended';
  description?: string; theme?: string; prizePool?: string; requirements?: string;
}
interface Solo { id: number; name: string; skills: string[]; lookingFor: string; }
interface Partner {
  id: number; name: string; type: 'Sponsor' | 'Media' | 'Tech' | 'Community'; tier: 'Gold' | 'Silver' | 'Bronze';
  description: string; supportAreas: string[]; website: string; contactEmail: string; logo: string;
}
interface Applicant {
  id: number; name: string; email: string; role: string; status: 'Pending' | 'Accepted' | 'Rejected';
  bio: string; skills: string[]; experience: string; github: string; portfolio: string;
  university: string; score: number; reviewNote: string;
}

// ─── Initial Data ───
const INIT_EVENTS: HackEvent[] = [
  { id: 1, name: 'Global Hackathon 2026', date: 'Mar 11–18, 2026', location: 'Virtual + Baku', participants: 1248, maxParticipants: 2000, status: 'Live',
    description: 'The largest annual gathering of developers.', theme: 'Open Innovation', prizePool: '$50,000', requirements: 'Open to all' },
  { id: 2, name: 'Winter Hack 2025', date: 'Dec 5–8, 2025', location: 'Istanbul', participants: 420, maxParticipants: 500, status: 'Ended',
    description: 'A cozy winter coding session.', theme: 'Web3 & Crypto', prizePool: '$10,000', requirements: 'University students only' },
  { id: 3, name: 'AI Challenge 2026', date: 'May 1–5, 2026', location: 'Online', participants: 0, maxParticipants: 1000, status: 'Upcoming',
    description: 'Build the future with Generative AI.', theme: 'Artificial Intelligence', prizePool: '$25,000', requirements: 'Must use OpenAI or Anthropic APIs' },
];

const INIT_SOLOS: Solo[] = [
  { id: 1, name: 'Aydan M.', skills: ['React', 'Node.js'], lookingFor: 'Backend Dev' },
  { id: 2, name: 'Kenan R.', skills: ['Python', 'ML'], lookingFor: 'Frontend Dev' },
  { id: 3, name: 'Lala H.', skills: ['UI/UX', 'Figma'], lookingFor: 'Full-stack Dev' },
  { id: 4, name: 'Orxan T.', skills: ['Rust', 'WebAssembly'], lookingFor: 'Designer' },
];

const INIT_PARTNERS: Partner[] = [
  { id: 1, name: 'Microsoft Azure', type: 'Tech', tier: 'Gold', logo: '☁️',
    description: 'Global cloud computing platform providing infrastructure and AI services for hackathon projects.',
    supportAreas: ['Cloud Credits $5K', 'AI/ML APIs', 'Mentorship', 'DevTools'],
    website: 'azure.microsoft.com', contactEmail: 'partners@azure.com' },
  { id: 2, name: 'AWS Activate', type: 'Tech', tier: 'Gold', logo: '🔶',
    description: 'Amazon Web Services startup program offering cloud resources and technical guidance.',
    supportAreas: ['Cloud Credits $3K', 'Lambda Access', 'Workshop Sessions'],
    website: 'aws.amazon.com/activate', contactEmail: 'activate@aws.com' },
  { id: 3, name: 'TechCrunch', type: 'Media', tier: 'Silver', logo: '📰',
    description: 'Leading technology media outlet covering startups and innovation globally.',
    supportAreas: ['Media Coverage', 'Winner Spotlight', 'Social Promotion'],
    website: 'techcrunch.com', contactEmail: 'events@techcrunch.com' },
  { id: 4, name: 'Dev.az', type: 'Community', tier: 'Bronze', logo: '💻',
    description: 'Azerbaijan\'s largest developer community connecting tech talent across the country.',
    supportAreas: ['Community Outreach', 'Volunteer Network', 'Local Promotion'],
    website: 'dev.az', contactEmail: 'hello@dev.az' },
  { id: 5, name: 'PASHA Bank', type: 'Sponsor', tier: 'Gold', logo: '🏦',
    description: 'Leading investment bank in Azerbaijan supporting fintech innovation and digital transformation.',
    supportAreas: ['Prize Fund $10K', 'Fintech APIs', 'Venue Sponsorship', 'Catering'],
    website: 'pashabank.az', contactEmail: 'innovation@pashabank.az' },
];

const INIT_APPLICANTS: Applicant[] = [
  { id: 1, name: 'Nigar Aliyeva', email: 'nigar@mail.com', role: 'Hacker', status: 'Pending',
    bio: 'Full-stack developer passionate about AI and blockchain. Won 3 hackathons in 2025.',
    skills: ['React', 'Python', 'TensorFlow', 'Solidity'], experience: '2 years',
    github: 'github.com/nigar-dev', portfolio: 'nigar.dev', university: 'ADA University', score: 0, reviewNote: '' },
  { id: 2, name: 'Farid Karimov', email: 'farid@dev.az', role: 'Mentor', status: 'Pending',
    bio: 'Senior engineer at Microsoft with 8 years of experience in cloud architecture and DevOps.',
    skills: ['Azure', 'Kubernetes', 'Go', 'Terraform'], experience: '8 years',
    github: 'github.com/farid-k', portfolio: 'farid.tech', university: 'Baku Engineering University', score: 0, reviewNote: '' },
  { id: 3, name: 'Sara Valiyeva', email: 'sara@tech.io', role: 'Judge', status: 'Accepted',
    bio: 'CTO and Co-founder of TechStartup.az. Angel investor and tech community leader.',
    skills: ['System Design', 'Product Strategy', 'Leadership'], experience: '12 years',
    github: 'github.com/sara-v', portfolio: 'sara-v.com', university: 'MIT', score: 5, reviewNote: 'Excellent profile, approved immediately.' },
  { id: 4, name: 'Tural Mammadov', email: 'tural@startup.co', role: 'Hacker', status: 'Pending',
    bio: 'Mobile developer specializing in React Native and Flutter. Open source contributor.',
    skills: ['React Native', 'Flutter', 'Firebase', 'UI/UX'], experience: '3 years',
    github: 'github.com/tural-m', portfolio: 'tural.design', university: 'BHOS', score: 0, reviewNote: '' },
  { id: 5, name: 'Aysel Huseynova', email: 'aysel@data.az', role: 'Hacker', status: 'Pending',
    bio: 'Data scientist with expertise in NLP and computer vision. Kaggle competition master.',
    skills: ['Python', 'PyTorch', 'NLP', 'Computer Vision', 'SQL'], experience: '4 years',
    github: 'github.com/aysel-h', portfolio: 'aysel-data.com', university: 'Khazar University', score: 0, reviewNote: '' },
];

const TIER_COLORS: Record<string, string> = { Gold: '#F59E0B', Silver: '#94A3B8', Bronze: '#D97706' };
const STATUS_COLORS: Record<string, string> = { Live: '#10B981', Upcoming: '#3B82F6', Ended: '#475569', Pending: '#F59E0B', Accepted: '#10B981', Rejected: '#EF4444' };

export default function TeamScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width > 640;

  // ─── State ───
  const [events, setEvents] = useState<HackEvent[]>(INIT_EVENTS);
  const [solos, setSolos] = useState<Solo[]>(INIT_SOLOS);
  const [partners, setPartners] = useState<Partner[]>(INIT_PARTNERS);
  const [applicants, setApplicants] = useState<Applicant[]>(INIT_APPLICANTS);
  const [activeTab, setActiveTab] = useState<'events' | 'applicants' | 'solos' | 'partners'>('events');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '', max: '', description: '', theme: '', prizePool: '', requirements: '' });
  const [newPartner, setNewPartner] = useState({ name: '', type: 'Sponsor' as Partner['type'], tier: 'Silver' as Partner['tier'], description: '', website: '', contactEmail: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedApplicant, setExpandedApplicant] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Accepted' | 'Rejected'>('All');
  const [expandedPartner, setExpandedPartner] = useState<number | null>(null);

  // ─── Handlers ───
  const handleCreateEvent = () => {
    if (!newEvent.name.trim()) return;
    const ev: HackEvent = {
      id: Date.now(), name: newEvent.name, date: newEvent.date || 'TBD',
      location: newEvent.location || 'Online', participants: 0,
      maxParticipants: parseInt(newEvent.max) || 500, status: 'Upcoming',
      description: newEvent.description, theme: newEvent.theme,
      prizePool: newEvent.prizePool, requirements: newEvent.requirements
    };
    setEvents(prev => [ev, ...prev]);
    setNewEvent({ name: '', date: '', location: '', max: '', description: '', theme: '', prizePool: '', requirements: '' });
    setShowCreateEvent(false);
  };

  const handleDeleteEvent = (id: number) => setEvents(prev => prev.filter(e => e.id !== id));

  const handleAcceptApplicant = (id: number) => {
    const app = applicants.find(a => a.id === id);
    if (app && app.score === 0) return; // Must score first
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'Accepted' as const } : a));
  };

  const handleRejectApplicant = (id: number) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' as const } : a));
  };

  const handleScoreApplicant = (id: number, score: number) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, score } : a));
  };

  const handleReviewNote = (id: number, note: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, reviewNote: note } : a));
  };

  const filteredApplicants = applicants.filter(a => {
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase()) && !a.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAutoGroup = () => {
    if (solos.length < 2) return;
    
    // Smart matching: Try to match the first solo with someone who has the skills they are looking for
    const base = solos[0];
    let matchIdx = -1;

    for (let i = 1; i < solos.length; i++) {
      const candidate = solos[i];
      // Does candidate have what base is looking for?
      const candidateHasSkill = candidate.skills.some(s => base.lookingFor.toLowerCase().includes(s.toLowerCase()));
      // Does base have what candidate is looking for?
      const baseHasSkill = base.skills.some(s => candidate.lookingFor.toLowerCase().includes(s.toLowerCase()));
      
      if (candidateHasSkill || baseHasSkill) {
        matchIdx = i;
        break;
      }
    }
    
    // If no complementary match found, just group with the next person
    if (matchIdx === -1) matchIdx = 1;

    // Remove the two matched users from the queue
    setSolos(prev => prev.filter((s, idx) => idx !== 0 && idx !== matchIdx));
  };

  const handleAddPartner = () => {
    if (!newPartner.name.trim()) return;
    const p: Partner = {
      id: Date.now(), name: newPartner.name, type: newPartner.type, tier: newPartner.tier,
      description: newPartner.description || 'New partner organization.',
      supportAreas: ['General Support'], website: newPartner.website || '', contactEmail: newPartner.contactEmail || '', logo: '🤝',
    };
    setPartners(prev => [p, ...prev]);
    setNewPartner({ name: '', type: 'Sponsor', tier: 'Silver', description: '', website: '', contactEmail: '' });
    setShowAddPartner(false);
  };

  const handleRemovePartner = (id: number) => setPartners(prev => prev.filter(p => p.id !== id));

  const pendingCount = applicants.filter(a => a.status === 'Pending').length;

  const TABS = [
    { key: 'events' as const, label: 'Events', icon: Calendar, count: events.length },
    { key: 'applicants' as const, label: 'Applicants', icon: UserPlus, count: pendingCount },
    { key: 'solos' as const, label: 'Solo Queue', icon: Users, count: solos.length },
    { key: 'partners' as const, label: 'Partners', icon: Handshake, count: partners.length },
  ];

  return (
    <View style={st.root}>
      {/* ── Header ── */}
      <View style={st.topBar}>
        <View style={st.topLeft}>
          <Zap color="#8B5CF6" size={16} />
          <Text style={st.logoText}>Event Hub</Text>
        </View>
        <View style={st.searchBox}>
          <Search color="#475569" size={14} />
          <TextInput placeholder="Search..." placeholderTextColor="#475569" style={st.searchInput}
            value={searchQuery} onChangeText={setSearchQuery} />
          {searchQuery.length > 0 && <TouchableOpacity onPress={() => setSearchQuery('')}><X color="#64748B" size={14} /></TouchableOpacity>}
        </View>
      </View>

      {/* ── Tab Switcher ── */}
      <View style={st.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab.key} style={[st.tab, activeTab === tab.key && st.tabActive]} onPress={() => setActiveTab(tab.key)}>
            <tab.icon color={activeTab === tab.key ? '#8B5CF6' : '#475569'} size={16} />
            <Text style={[st.tabLabel, activeTab === tab.key && st.tabLabelActive]}>{tab.label}</Text>
            {tab.count > 0 && (
              <View style={[st.tabBadge, activeTab === tab.key && st.tabBadgeActive]}>
                <Text style={[st.tabBadgeText, activeTab === tab.key && { color: '#8B5CF6' }]}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════ */}
        {/*  TAB 1: EVENTS                     */}
        {/* ═══════════════════════════════════ */}
        {activeTab === 'events' && (
          <View>
            <View style={st.sectionHead}>
              <Text style={st.sectionTitle}>Manage Events</Text>
              <TouchableOpacity style={st.primaryBtn} onPress={() => setShowCreateEvent(!showCreateEvent)}>
                {showCreateEvent ? <X color="#FFF" size={14} /> : <Plus color="#FFF" size={14} />}
                <Text style={st.primaryBtnText}>{showCreateEvent ? 'Cancel' : 'New Event'}</Text>
              </TouchableOpacity>
            </View>

            {/* Create Event Form */}
            {showCreateEvent && (
              <View style={st.formCard}>
                <Text style={st.formTitle}>Create New Event</Text>
                <Text style={st.formSubtitle}>Provide detailed information for the hackers.</Text>
                
                <View style={st.formRow}>
                  <View style={[st.formGroup, { flex: 2 }]}>
                    <Text style={st.formLabel}>Event Name *</Text>
                    <TextInput style={st.formInput} placeholder="e.g. Summer Hack 2026" placeholderTextColor="#475569"
                      value={newEvent.name} onChangeText={t => setNewEvent({ ...newEvent, name: t })} />
                  </View>
                  <View style={[st.formGroup, { flex: 1 }]}>
                    <Text style={st.formLabel}>Max Participants</Text>
                    <TextInput style={st.formInput} placeholder="500" placeholderTextColor="#475569" keyboardType="numeric"
                      value={newEvent.max} onChangeText={t => setNewEvent({ ...newEvent, max: t })} />
                  </View>
                </View>
                
                <View style={st.formRow}>
                  <View style={[st.formGroup, { flex: 1 }]}>
                    <Text style={st.formLabel}>Date Range</Text>
                    <TextInput style={st.formInput} placeholder="Jun 1–5, 2026" placeholderTextColor="#475569"
                      value={newEvent.date} onChangeText={t => setNewEvent({ ...newEvent, date: t })} />
                  </View>
                  <View style={[st.formGroup, { flex: 1 }]}>
                    <Text style={st.formLabel}>Location</Text>
                    <TextInput style={st.formInput} placeholder="Online / City" placeholderTextColor="#475569"
                      value={newEvent.location} onChangeText={t => setNewEvent({ ...newEvent, location: t })} />
                  </View>
                </View>

                {/* --- Deep Questions --- */}
                <View style={st.formGroup}>
                  <Text style={st.formLabel}>Event Description & Goals</Text>
                  <TextInput style={[st.formInput, { height: 60, textAlignVertical: 'top', paddingVertical: 10 }]} placeholder="What is the main objective of this hackathon?" placeholderTextColor="#475569"
                    value={newEvent.description} onChangeText={t => setNewEvent({ ...newEvent, description: t })} multiline />
                </View>

                <View style={st.formRow}>
                  <View style={[st.formGroup, { flex: 1 }]}>
                    <Text style={st.formLabel}>Main Theme / Focus</Text>
                    <TextInput style={st.formInput} placeholder="e.g. AI, FinTech, Web3" placeholderTextColor="#475569"
                      value={newEvent.theme} onChangeText={t => setNewEvent({ ...newEvent, theme: t })} />
                  </View>
                  <View style={[st.formGroup, { flex: 1 }]}>
                    <Text style={st.formLabel}>Total Prize Pool</Text>
                    <TextInput style={st.formInput} placeholder="e.g. $10,000" placeholderTextColor="#475569"
                      value={newEvent.prizePool} onChangeText={t => setNewEvent({ ...newEvent, prizePool: t })} />
                  </View>
                </View>

                <View style={st.formGroup}>
                  <Text style={st.formLabel}>Technical Requirements</Text>
                  <TextInput style={st.formInput} placeholder="e.g. Must use sponsor APIs, Open Source" placeholderTextColor="#475569"
                    value={newEvent.requirements} onChangeText={t => setNewEvent({ ...newEvent, requirements: t })} />
                </View>

                <TouchableOpacity style={st.submitBtn} onPress={handleCreateEvent}>
                  <Plus color="#FFF" size={14} /><Text style={st.submitBtnText}>Create Event</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Events List */}
            {events.map(ev => (
              <View key={ev.id} style={st.card}>
                <View style={st.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={st.cardTitle}>{ev.name}</Text>
                    <View style={st.cardMeta}>
                      <Clock color="#475569" size={12} /><Text style={st.cardMetaText}>{ev.date}</Text>
                      <MapPin color="#475569" size={12} /><Text style={st.cardMetaText}>{ev.location}</Text>
                    </View>
                  </View>
                  <View style={[st.statusBadge, { backgroundColor: STATUS_COLORS[ev.status] + '20' }]}>
                    {ev.status === 'Live' && <View style={st.livePulse} />}
                    <Text style={[st.statusText, { color: STATUS_COLORS[ev.status] }]}>{ev.status}</Text>
                  </View>
                </View>
                <View style={st.progressSection}>
                  <View style={st.progressInfo}>
                    <Text style={st.progressLabel}>{ev.participants} / {ev.maxParticipants} participants</Text>
                    <Text style={st.progressPercent}>{Math.round((ev.participants / ev.maxParticipants) * 100)}%</Text>
                  </View>
                  <View style={st.progressBar}>
                    <View style={[st.progressFill, { width: `${(ev.participants / ev.maxParticipants) * 100}%` }]} />
                  </View>
                </View>
                <View style={st.cardActions}>
                  <TouchableOpacity style={st.cardActionBtn}><Edit3 color="#8B5CF6" size={14} /><Text style={st.cardActionText}>Edit</Text></TouchableOpacity>
                  <TouchableOpacity style={st.cardActionBtn} onPress={() => handleDeleteEvent(ev.id)}><Trash2 color="#EF4444" size={14} /><Text style={[st.cardActionText, { color: '#EF4444' }]}>Delete</Text></TouchableOpacity>
                </View>
              </View>
            ))}
            {events.length === 0 && <Text style={st.emptyText}>No events yet. Create your first event!</Text>}
          </View>
        )}

        {/* ═══════════════════════════════════ */}
        {/*  TAB 2: APPLICANTS                 */}
        {/* ═══════════════════════════════════ */}
        {activeTab === 'applicants' && (
          <View>
            <View style={st.sectionHead}>
              <Text style={st.sectionTitle}>Incoming Applicants</Text>
              <View style={st.countBadge}><Text style={st.countBadgeText}>{pendingCount} pending</Text></View>
            </View>

            {/* Status Filters */}
            <View style={st.filterRow}>
              {(['All', 'Pending', 'Accepted', 'Rejected'] as const).map(f => (
                <TouchableOpacity key={f} style={[st.filterChip, filterStatus === f && st.filterChipActive]} onPress={() => setFilterStatus(f)}>
                  <Text style={[st.filterChipText, filterStatus === f && st.filterChipTextActive]}>{f}</Text>
                  {f !== 'All' && <View style={[st.filterDot, { backgroundColor: STATUS_COLORS[f] }]} />}
                </TouchableOpacity>
              ))}
            </View>

            {filteredApplicants.map(app => {
              const isExpanded = expandedApplicant === app.id;
              return (
              <View key={app.id} style={[st.card, isExpanded && st.cardExpanded]}>
                {/* Header: Basic Info */}
                <TouchableOpacity style={st.cardHeader} onPress={() => setExpandedApplicant(isExpanded ? null : app.id)} activeOpacity={0.7}>
                  <View style={st.applicantInfo}>
                    <View style={[st.applicantAvatar, app.score >= 4 && { borderWidth: 2, borderColor: '#10B981' }]}>
                      <Text style={st.applicantAvatarText}>{app.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={st.cardTitle}>{app.name}</Text>
                        {app.score > 0 && (
                          <View style={st.miniScoreBadge}>
                            <Star color="#F59E0B" size={10} />
                            <Text style={st.miniScoreText}>{app.score}/5</Text>
                          </View>
                        )}
                      </View>
                      <Text style={st.cardSubtitle}>{app.email} • {app.role}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <View style={[st.statusBadge, { backgroundColor: STATUS_COLORS[app.status] + '20' }]}>
                      <Text style={[st.statusText, { color: STATUS_COLORS[app.status] }]}>{app.status}</Text>
                    </View>
                    {isExpanded ? <ChevronUp color="#475569" size={16} /> : <ChevronDown color="#475569" size={16} />}
                  </View>
                </TouchableOpacity>

                {/* Expanded: Detailed Profile */}
                {isExpanded && (
                  <View style={st.profileExpanded}>
                    {/* Bio */}
                    <Text style={st.profileBio}>{app.bio}</Text>

                    {/* Info Grid */}
                    <View style={st.profileGrid}>
                      <View style={st.profileGridItem}>
                        <GraduationCap color="#8B5CF6" size={14} />
                        <View>
                          <Text style={st.profileGridLabel}>University</Text>
                          <Text style={st.profileGridValue}>{app.university}</Text>
                        </View>
                      </View>
                      <View style={st.profileGridItem}>
                        <Briefcase color="#3B82F6" size={14} />
                        <View>
                          <Text style={st.profileGridLabel}>Experience</Text>
                          <Text style={st.profileGridValue}>{app.experience}</Text>
                        </View>
                      </View>
                      <View style={st.profileGridItem}>
                        <Github color="#E2E8F0" size={14} />
                        <View>
                          <Text style={st.profileGridLabel}>GitHub</Text>
                          <Text style={[st.profileGridValue, { color: '#8B5CF6' }]}>{app.github}</Text>
                        </View>
                      </View>
                      <View style={st.profileGridItem}>
                        <Link2 color="#10B981" size={14} />
                        <View>
                          <Text style={st.profileGridLabel}>Portfolio</Text>
                          <Text style={[st.profileGridValue, { color: '#8B5CF6' }]}>{app.portfolio}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Skills */}
                    <View style={st.profileSkillsSection}>
                      <Text style={st.profileSectionLabel}>SKILLS</Text>
                      <View style={st.skillRow}>
                        {app.skills.map((sk, i) => (
                          <View key={i} style={st.skillChip}><Text style={st.skillChipText}>{sk}</Text></View>
                        ))}
                      </View>
                    </View>

                    {/* Scoring Section */}
                    {app.status === 'Pending' && (
                      <View style={st.scoringSection}>
                        <Text style={st.profileSectionLabel}>REVIEW SCORE</Text>
                        <View style={st.starRow}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <TouchableOpacity key={s} onPress={() => handleScoreApplicant(app.id, s)} style={st.starBtn}>
                              <Star color={s <= app.score ? '#F59E0B' : '#334155'} size={28} fill={s <= app.score ? '#F59E0B' : 'transparent'} />
                            </TouchableOpacity>
                          ))}
                          <Text style={st.scoreLabel}>
                            {app.score === 0 ? 'Not scored' : app.score <= 2 ? 'Below Average' : app.score === 3 ? 'Average' : app.score === 4 ? 'Good' : 'Excellent'}
                          </Text>
                        </View>

                        {/* Review Note */}
                        <TextInput style={st.reviewNoteInput} placeholder="Add review note (optional)..."
                          placeholderTextColor="#475569" value={app.reviewNote}
                          onChangeText={t => handleReviewNote(app.id, t)} multiline />

                        {/* Accept/Reject Actions */}
                        <View style={st.applicantActions}>
                          <TouchableOpacity style={[st.acceptBtn, app.score === 0 && { opacity: 0.4 }]}
                            onPress={() => handleAcceptApplicant(app.id)} disabled={app.score === 0}>
                            <Check color="#FFF" size={14} />
                            <Text style={st.acceptBtnText}>{app.score === 0 ? 'Score First' : `Accept (${app.score}★)`}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={st.rejectBtn} onPress={() => handleRejectApplicant(app.id)}>
                            <X color="#EF4444" size={14} /><Text style={st.rejectBtnText}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* Already Reviewed */}
                    {app.status !== 'Pending' && app.reviewNote !== '' && (
                      <View style={st.reviewedNote}>
                        <Text style={st.profileSectionLabel}>REVIEW NOTE</Text>
                        <Text style={st.reviewedNoteText}>{app.reviewNote}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
              );
            })}
            {filteredApplicants.length === 0 && <Text style={st.emptyText}>No applicants match filters.</Text>}
          </View>
        )}

        {/* ═══════════════════════════════════ */}
        {/*  TAB 3: SOLO QUEUE (Auto-Grouping) */}
        {/* ═══════════════════════════════════ */}
        {activeTab === 'solos' && (
          <View>
            <View style={st.sectionHead}>
              <Text style={st.sectionTitle}>Solo Participants</Text>
              <TouchableOpacity style={st.primaryBtn} onPress={handleAutoGroup}>
                <Users color="#FFF" size={14} /><Text style={st.primaryBtnText}>Auto-Group</Text>
              </TouchableOpacity>
            </View>
            <Text style={st.sectionSub}>Solo participants looking for a team. Click "Auto-Group" to match the first 2 into a team automatically.</Text>

            {solos.map(solo => (
              <View key={solo.id} style={st.card}>
                <View style={st.cardHeader}>
                  <View style={st.applicantInfo}>
                    <View style={[st.applicantAvatar, { backgroundColor: '#3B82F620' }]}><Text style={[st.applicantAvatarText, { color: '#3B82F6' }]}>{solo.name.charAt(0)}</Text></View>
                    <View>
                      <Text style={st.cardTitle}>{solo.name}</Text>
                      <Text style={st.cardSubtitle}>Looking for: {solo.lookingFor}</Text>
                    </View>
                  </View>
                </View>
                <View style={st.skillRow}>
                  {solo.skills.map((sk, i) => (
                    <View key={i} style={st.skillChip}><Text style={st.skillChipText}>{sk}</Text></View>
                  ))}
                </View>
              </View>
            ))}
            {solos.length === 0 && <Text style={st.emptyText}>All solo participants have been grouped into teams! 🎉</Text>}
          </View>
        )}

        {/* ═══════════════════════════════════ */}
        {/*  TAB 4: PARTNERS & SPONSORS        */}
        {/* ═══════════════════════════════════ */}
        {activeTab === 'partners' && (
          <View>
            <View style={st.sectionHead}>
              <Text style={st.sectionTitle}>Partners & Sponsors</Text>
              <TouchableOpacity style={st.primaryBtn} onPress={() => setShowAddPartner(!showAddPartner)}>
                {showAddPartner ? <X color="#FFF" size={14} /> : <Plus color="#FFF" size={14} />}
                <Text style={st.primaryBtnText}>{showAddPartner ? 'Cancel' : 'Add Partner'}</Text>
              </TouchableOpacity>
            </View>

            {/* Add Partner Form */}
            {showAddPartner && (
              <View style={st.formCard}>
                <Text style={st.formTitle}>Add New Partner</Text>
                <View style={st.formGroup}>
                  <Text style={st.formLabel}>Partner Name *</Text>
                  <TextInput style={st.formInput} placeholder="e.g. Google Cloud" placeholderTextColor="#475569"
                    value={newPartner.name} onChangeText={t => setNewPartner({ ...newPartner, name: t })} />
                </View>
                <View style={st.formGroup}>
                  <Text style={st.formLabel}>Description</Text>
                  <TextInput style={[st.formInput, { height: 60, textAlignVertical: 'top', paddingVertical: 10 }]} placeholder="What does this partner do?" placeholderTextColor="#475569"
                    value={newPartner.description} onChangeText={t => setNewPartner({ ...newPartner, description: t })} multiline />
                </View>
                <View style={st.formRow}>
                  <View style={[st.formGroup, { flex: 1 }]}>
                    <Text style={st.formLabel}>Website</Text>
                    <TextInput style={st.formInput} placeholder="partner.com" placeholderTextColor="#475569"
                      value={newPartner.website} onChangeText={t => setNewPartner({ ...newPartner, website: t })} />
                  </View>
                  <View style={[st.formGroup, { flex: 1 }]}>
                    <Text style={st.formLabel}>Contact Email</Text>
                    <TextInput style={st.formInput} placeholder="contact@partner.com" placeholderTextColor="#475569"
                      value={newPartner.contactEmail} onChangeText={t => setNewPartner({ ...newPartner, contactEmail: t })} keyboardType="email-address" />
                  </View>
                </View>
                <View style={st.formRow}>
                  <View style={[st.formGroup, { flex: 1 }]}>
                    <Text style={st.formLabel}>Type</Text>
                    <View style={st.chipRow}>
                      {(['Sponsor', 'Tech', 'Media', 'Community'] as const).map(tp => (
                        <TouchableOpacity key={tp} style={[st.selectChip, newPartner.type === tp && st.selectChipActive]}
                          onPress={() => setNewPartner({ ...newPartner, type: tp })}>
                          <Text style={[st.selectChipText, newPartner.type === tp && st.selectChipTextActive]}>{tp}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={[st.formGroup, { flex: 1 }]}>
                    <Text style={st.formLabel}>Tier</Text>
                    <View style={st.chipRow}>
                      {(['Gold', 'Silver', 'Bronze'] as const).map(tr => (
                        <TouchableOpacity key={tr} style={[st.selectChip, newPartner.tier === tr && { backgroundColor: TIER_COLORS[tr] + '30', borderColor: TIER_COLORS[tr] }]}
                          onPress={() => setNewPartner({ ...newPartner, tier: tr })}>
                          <Text style={[st.selectChipText, newPartner.tier === tr && { color: TIER_COLORS[tr] }]}>{tr}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={st.submitBtn} onPress={handleAddPartner}>
                  <Handshake color="#FFF" size={14} /><Text style={st.submitBtnText}>Add Partner</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Partners List */}
            {partners.map(p => {
              const isPExpanded = expandedPartner === p.id;
              return (
              <View key={p.id} style={[st.card, isPExpanded && st.cardExpanded]}>
                <TouchableOpacity style={st.cardHeader} onPress={() => setExpandedPartner(isPExpanded ? null : p.id)} activeOpacity={0.7}>
                  <View style={st.applicantInfo}>
                    <View style={[st.partnerIcon, { backgroundColor: TIER_COLORS[p.tier] + '20' }]}>
                      <Text style={{ fontSize: 22 }}>{p.logo}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={st.cardTitle}>{p.name}</Text>
                      <View style={st.partnerMeta}>
                        <View style={st.partnerTypeBadge}><Text style={st.partnerTypeText}>{p.type}</Text></View>
                        <View style={[st.tierBadge, { backgroundColor: TIER_COLORS[p.tier] + '20' }]}>
                          <Text style={[st.tierText, { color: TIER_COLORS[p.tier] }]}>{p.tier}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={() => handleRemovePartner(p.id)}><X color="#334155" size={14} /></TouchableOpacity>
                    {isPExpanded ? <ChevronUp color="#475569" size={16} /> : <ChevronDown color="#475569" size={16} />}
                  </View>
                </TouchableOpacity>

                {/* Expanded Details */}
                {isPExpanded && (
                  <View style={st.profileExpanded}>
                    <Text style={st.profileBio}>{p.description}</Text>

                    {/* Support Areas */}
                    <View style={st.profileSkillsSection}>
                      <Text style={st.profileSectionLabel}>SUPPORT & CONTRIBUTIONS</Text>
                      <View style={st.skillRow}>
                        {p.supportAreas.map((area, i) => (
                          <View key={i} style={st.supportChip}>
                            <Text style={st.supportChipText}>{area}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Contact Info */}
                    <View style={st.profileGrid}>
                      {p.website ? (
                        <View style={st.profileGridItem}>
                          <Globe color="#3B82F6" size={14} />
                          <View>
                            <Text style={st.profileGridLabel}>Website</Text>
                            <Text style={[st.profileGridValue, { color: '#8B5CF6' }]}>{p.website}</Text>
                          </View>
                        </View>
                      ) : null}
                      {p.contactEmail ? (
                        <View style={st.profileGridItem}>
                          <Send color="#10B981" size={14} />
                          <View>
                            <Text style={st.profileGridLabel}>Contact</Text>
                            <Text style={[st.profileGridValue, { color: '#8B5CF6' }]}>{p.contactEmail}</Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}
              </View>
              );
            })}
            {partners.length === 0 && <Text style={st.emptyText}>No partners yet. Add your first partner!</Text>}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F1A' },

  // Header
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F1629' },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontSize: 16, fontWeight: '800', color: '#E2E8F0', letterSpacing: 0.5 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flex: 1, maxWidth: 240, marginLeft: 16 },
  searchInput: { flex: 1, marginLeft: 8, color: '#CBD5E1', fontSize: 13, height: 28 },

  // Tab Switcher
  tabRow: { flexDirection: 'row', backgroundColor: '#0F1629', paddingHorizontal: 16, paddingBottom: 0, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#8B5CF6' },
  tabLabel: { fontSize: 13, color: '#475569', fontWeight: '600' },
  tabLabelActive: { color: '#E2E8F0' },
  tabBadge: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, minWidth: 22, alignItems: 'center' },
  tabBadgeActive: { backgroundColor: '#8B5CF620' },
  tabBadgeText: { fontSize: 10, fontWeight: '700', color: '#64748B' },

  // Scroll
  scrollContent: { padding: 20 },

  // Section
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#F1F5F9' },
  sectionSub: { fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 20 },

  // Buttons
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  primaryBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#8B5CF6', paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  countBadge: { backgroundColor: '#F59E0B20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countBadgeText: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },

  // Form
  formCard: { backgroundColor: '#111827', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#1E293B', marginBottom: 20 },
  formTitle: { fontSize: 15, fontWeight: '700', color: '#E2E8F0', marginBottom: 6 },
  formSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 16 },
  formRow: { flexDirection: 'row', gap: 12 },
  formGroup: { marginBottom: 14 },
  formLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  formInput: { backgroundColor: '#0B0F1A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: '#E2E8F0', fontSize: 14 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  selectChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#1E293B', backgroundColor: '#0B0F1A' },
  selectChipActive: { backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' },
  selectChipText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  selectChipTextActive: { color: '#8B5CF6' },

  // Cards
  card: { backgroundColor: '#111827', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#1E293B', marginBottom: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#E2E8F0', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#64748B' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardMetaText: { fontSize: 12, color: '#64748B', marginRight: 8 },
  cardActions: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 14 },
  cardActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardActionText: { fontSize: 12, fontWeight: '600', color: '#8B5CF6' },

  // Status
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  livePulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },

  // Progress
  progressSection: { marginBottom: 14 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: '#64748B' },
  progressPercent: { fontSize: 12, fontWeight: '700', color: '#8B5CF6' },
  progressBar: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 3 },

  // Applicants
  applicantInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  applicantAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B5CF620', justifyContent: 'center', alignItems: 'center' },
  applicantAvatarText: { fontSize: 16, fontWeight: '700', color: '#8B5CF6' },
  roleBadge: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  roleBadgeText: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  applicantActions: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 14 },
  acceptBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 10, justifyContent: 'center' },
  acceptBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  rejectBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, backgroundColor: '#EF444420', paddingVertical: 10, borderRadius: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#EF444440' },
  rejectBtnText: { fontSize: 13, fontWeight: '700', color: '#EF4444' },

  // Skills
  skillRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  skillChip: { backgroundColor: '#3B82F620', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  skillChipText: { fontSize: 11, fontWeight: '700', color: '#3B82F6' },

  // Partners
  partnersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  partnerCard: { backgroundColor: '#111827', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#1E293B', flex: 1, minWidth: 150 },
  partnerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  partnerIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  partnerName: { fontSize: 15, fontWeight: '700', color: '#E2E8F0', marginBottom: 10 },
  partnerMeta: { flexDirection: 'row', gap: 8 },
  partnerTypeBadge: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  partnerTypeText: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  tierBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tierText: { fontSize: 10, fontWeight: '700' },

  // Empty
  emptyText: { textAlign: 'center', color: '#475569', paddingVertical: 40, fontSize: 14 },

  // Filters
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  filterChipActive: { backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  filterChipTextActive: { color: '#8B5CF6' },
  filterDot: { width: 6, height: 6, borderRadius: 3 },

  // Card expanded
  cardExpanded: { borderColor: '#8B5CF640' },

  // Mini score badge (shown in collapsed header)
  miniScoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F59E0B20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  miniScoreText: { fontSize: 10, fontWeight: '700', color: '#F59E0B' },

  // Profile expanded section
  profileExpanded: { borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 16, marginTop: 4 },
  profileBio: { fontSize: 14, color: '#94A3B8', lineHeight: 22, marginBottom: 16 },

  // Info Grid
  profileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  profileGridItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#0B0F1A', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#1E293B', minWidth: '45%', flex: 1 },
  profileGridLabel: { fontSize: 10, fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 },
  profileGridValue: { fontSize: 13, fontWeight: '600', color: '#E2E8F0', marginTop: 1 },

  // Section labels inside profile
  profileSkillsSection: { marginBottom: 16 },
  profileSectionLabel: { fontSize: 10, fontWeight: '800', color: '#475569', letterSpacing: 1.5, marginBottom: 8 },

  // Scoring
  scoringSection: { borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 16, marginTop: 4 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  starBtn: { padding: 4 },
  scoreLabel: { fontSize: 12, fontWeight: '600', color: '#F59E0B', marginLeft: 8 },

  // Review note
  reviewNoteInput: { backgroundColor: '#0B0F1A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: '#E2E8F0', fontSize: 13, height: 60, textAlignVertical: 'top', marginBottom: 14 },

  // Reviewed note display
  reviewedNote: { borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 14, marginTop: 4 },
  reviewedNoteText: { fontSize: 13, color: '#94A3B8', fontStyle: 'italic', lineHeight: 20 },

  // Support chips (partner contributions)
  supportChip: { backgroundColor: '#10B98120', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#10B98130' },
  supportChipText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
});
