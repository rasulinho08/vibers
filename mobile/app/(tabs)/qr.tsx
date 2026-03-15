import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import {
  Terminal, FileText, Layers, PlayCircle, Info, Rocket, CheckCircle, Plus, X,
  Link, Zap, Github, Check, Loader, AlertTriangle, Upload
} from 'lucide-react-native';

// ─── Types ───
type FetchStatus = 'idle' | 'fetching' | 'success' | 'error';

export default function SubmitScreen() {
  // ─── State ───
  const [repoUrl, setRepoUrl] = useState('');
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [techStack, setTechStack] = useState(['React', 'TypeScript', 'Node.js']);
  const [newTech, setNewTech] = useState('');
  const [showAddTech, setShowAddTech] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  // ─── Handlers ───
  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 2500);
  };

  const handleFetch = () => {
    if (!repoUrl.trim()) return;
    setFetchStatus('fetching');
    setTimeout(() => {
      if (repoUrl.includes('github.com')) {
        setFetchStatus('success');
        if (!projectTitle) {
          const parts = repoUrl.split('/');
          setProjectTitle(parts[parts.length - 1] || 'My Project');
        }
      } else {
        setFetchStatus('error');
      }
    }, 1500);
  };

  const handleAddTech = () => {
    if (!newTech.trim()) return;
    if (techStack.includes(newTech.trim())) { showToast('Already added!'); return; }
    setTechStack(prev => [...prev, newTech.trim()]);
    setNewTech('');
    setShowAddTech(false);
  };

  const handleRemoveTech = (tag: string) => setTechStack(prev => prev.filter(t => t !== tag));

  const handleSubmit = () => {
    if (!projectTitle.trim()) { showToast('Project title is required'); return; }
    if (!repoUrl.trim()) { showToast('Repository URL is required'); return; }
    setSubmitted(true);
    showToast('Project submitted successfully! 🚀');
  };

  const handleReset = () => {
    setSubmitted(false);
    setRepoUrl('');
    setFetchStatus('idle');
    setProjectTitle('');
    setProjectDesc('');
    setTechStack(['React', 'TypeScript', 'Node.js']);
    setVideoUrl('');
  };

  // ─── Success State ───
  if (submitted) {
    return (
      <View style={st.root}>
        <View style={st.successScreen}>
          <View style={st.successIconBox}>
            <CheckCircle color="#10B981" size={48} />
          </View>
          <Text style={st.successTitle}>Project Submitted!</Text>
          <Text style={st.successSub}>Your project "{projectTitle}" has been submitted for review. You'll receive a notification once it's been evaluated.</Text>
          <View style={st.successDetails}>
            <View style={st.successRow}><Text style={st.successLabel}>Repository</Text><Text style={st.successValue}>{repoUrl}</Text></View>
            <View style={st.successRow}><Text style={st.successLabel}>Tech Stack</Text><Text style={st.successValue}>{techStack.join(', ')}</Text></View>
            <View style={st.successRow}><Text style={st.successLabel}>Status</Text><View style={st.reviewBadge}><Text style={st.reviewBadgeText}>Under Review</Text></View></View>
          </View>
          <TouchableOpacity style={st.newSubmitBtn} onPress={handleReset}>
            <Plus color="#FFF" size={14} /><Text style={st.newSubmitBtnText}>New Submission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={st.root}>
      {/* ── Header ── */}
      <View style={st.topBar}>
        <View style={st.topLeft}>
          <Upload color="#8B5CF6" size={16} />
          <Text style={st.logoText}>Submit Project</Text>
        </View>
        <View style={st.hackBadge}><Text style={st.hackBadgeText}>HACKOS 2026</Text></View>
      </View>

      <ScrollView contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ═══ GitHub Integration ═══ */}
        <View style={st.section}>
          <View style={st.sectionHead}>
            <Terminal color="#8B5CF6" size={16} />
            <Text style={st.sectionTitle}>GITHUB INTEGRATION</Text>
          </View>
          <View style={st.formCard}>
            <Text style={st.formLabel}>Repository URL *</Text>
            <View style={st.repoRow}>
              <TextInput style={[st.formInput, { flex: 1 }]} placeholder="https://github.com/user/repo"
                placeholderTextColor="#475569" value={repoUrl} onChangeText={setRepoUrl} />
              <TouchableOpacity style={[st.fetchBtn, fetchStatus === 'fetching' && { opacity: 0.7 }]}
                onPress={handleFetch} disabled={fetchStatus === 'fetching'}>
                {fetchStatus === 'fetching' ? <Loader color="#FFF" size={14} /> : <Github color="#FFF" size={14} />}
                <Text style={st.fetchBtnText}>{fetchStatus === 'fetching' ? 'Fetching...' : 'Fetch'}</Text>
              </TouchableOpacity>
            </View>
            {fetchStatus === 'success' && (
              <View style={st.statusBox}>
                <CheckCircle color="#10B981" size={14} />
                <Text style={st.statusBoxText}>Connected! Found README.md, 3 contributors, 47 commits.</Text>
              </View>
            )}
            {fetchStatus === 'error' && (
              <View style={[st.statusBox, { backgroundColor: '#EF444415', borderColor: '#EF444430' }]}>
                <AlertTriangle color="#EF4444" size={14} />
                <Text style={[st.statusBoxText, { color: '#EF4444' }]}>Invalid GitHub URL. Please check and try again.</Text>
              </View>
            )}
          </View>
        </View>

        {/* ═══ Project Details ═══ */}
        <View style={st.section}>
          <View style={st.sectionHead}>
            <FileText color="#3B82F6" size={16} />
            <Text style={st.sectionTitle}>PROJECT DETAILS</Text>
          </View>
          <Text style={st.formLabel}>Project Title *</Text>
          <TextInput style={st.formInput} placeholder="e.g. QuantumSentry" placeholderTextColor="#475569"
            value={projectTitle} onChangeText={setProjectTitle} />
          <Text style={st.formLabel}>Project Description</Text>
          <TextInput style={st.textArea} placeholder="Describe the core innovation and technical challenges..."
            placeholderTextColor="#475569" multiline value={projectDesc} onChangeText={setProjectDesc} />
        </View>

        {/* ═══ Tech Stack ═══ */}
        <View style={st.section}>
          <View style={st.sectionHead}>
            <Layers color="#10B981" size={16} />
            <Text style={st.sectionTitle}>TECH STACK</Text>
          </View>
          <View style={st.tagsRow}>
            {techStack.map(tag => (
              <View key={tag} style={st.tag}>
                <Text style={st.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTech(tag)}><X color="#64748B" size={12} /></TouchableOpacity>
              </View>
            ))}
            {showAddTech ? (
              <View style={st.addTagInputRow}>
                <TextInput style={st.addTagInput} placeholder="Tool name" placeholderTextColor="#475569"
                  value={newTech} onChangeText={setNewTech} autoFocus onSubmitEditing={handleAddTech} />
                <TouchableOpacity onPress={handleAddTech} style={st.addTagConfirm}><Check color="#10B981" size={14} /></TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowAddTech(false); setNewTech(''); }}><X color="#EF4444" size={14} /></TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={st.addTagBtn} onPress={() => setShowAddTech(true)}>
                <Plus color="#8B5CF6" size={14} /><Text style={st.addTagBtnText}>Add Tool</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ═══ Media & Demo ═══ */}
        <View style={st.section}>
          <View style={st.sectionHead}>
            <PlayCircle color="#F59E0B" size={16} />
            <Text style={st.sectionTitle}>MEDIA & DEMO</Text>
          </View>
          <Text style={st.formLabel}>Video Demo URL (Loom, YouTube)</Text>
          <View style={st.linkRow}>
            <Link color="#475569" size={16} />
            <TextInput style={st.linkInput} placeholder="https://youtube.com/watch?v=..."
              placeholderTextColor="#475569" value={videoUrl} onChangeText={setVideoUrl} />
          </View>
        </View>

        {/* ═══ Final Submit ═══ */}
        <View style={st.finalSection}>
          <View style={st.warningBox}>
            <Info color="#F59E0B" size={18} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={st.warningTitle}>Final Review Required</Text>
              <Text style={st.warningDesc}>
                Submissions close <Text style={{ fontWeight: '700', color: '#F1F5F9' }}>Mar 15, 2026 at 23:59</Text>. Your repository must be public and all team members listed.
              </Text>
            </View>
          </View>

          <TouchableOpacity style={st.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
            <Rocket color="#FFF" size={18} />
            <Text style={st.submitBtnText}>Submit to HackOS</Text>
          </TouchableOpacity>

          <Text style={st.termsText}>
            By clicking submit, you acknowledge the <Text style={{ color: '#8B5CF6', fontWeight: '700' }}>Code of Conduct</Text> and certify this is your original work.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Toast */}
      {toast.visible && (
        <View style={st.toast}>
          <Check color="#10B981" size={14} />
          <Text style={st.toastText}>{toast.message}</Text>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F1A' },

  // Header
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#1E293B', backgroundColor: '#0F1629' },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontSize: 16, fontWeight: '800', color: '#E2E8F0', letterSpacing: 0.5 },
  hackBadge: { backgroundColor: '#8B5CF620', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#8B5CF640' },
  hackBadgeText: { fontSize: 10, fontWeight: '700', color: '#8B5CF6', letterSpacing: 1 },

  scrollContent: { padding: 20 },

  // Sections
  section: { marginBottom: 28 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#64748B', letterSpacing: 1.5 },

  // Form
  formCard: { backgroundColor: '#111827', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#1E293B' },
  formLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  formInput: { backgroundColor: '#0B0F1A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14, color: '#E2E8F0', marginBottom: 14 },
  repoRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  fetchBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#8B5CF6', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  fetchBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  statusBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#10B98115', borderWidth: 1, borderColor: '#10B98130', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginTop: 12 },
  statusBoxText: { fontSize: 12, fontWeight: '600', color: '#10B981', flex: 1 },

  textArea: { backgroundColor: '#0B0F1A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14, fontSize: 14, color: '#E2E8F0', height: 120, textAlignVertical: 'top' },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  tagText: { fontSize: 12, fontWeight: '700', color: '#CBD5E1' },
  addTagBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#8B5CF610', borderWidth: 1, borderColor: '#8B5CF630', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  addTagBtnText: { fontSize: 12, fontWeight: '700', color: '#8B5CF6' },
  addTagInputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addTagInput: { backgroundColor: '#0B0F1A', borderWidth: 1, borderColor: '#8B5CF6', borderRadius: 8, paddingHorizontal: 10, height: 32, width: 120, color: '#E2E8F0', fontSize: 13 },
  addTagConfirm: { padding: 4 },

  // Link
  linkRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B0F1A', borderWidth: 1, borderColor: '#1E293B', borderRadius: 10, paddingHorizontal: 14 },
  linkInput: { flex: 1, height: 44, fontSize: 14, color: '#E2E8F0', marginLeft: 8 },

  // Final Section
  finalSection: { paddingTop: 24, borderTopWidth: 1, borderTopColor: '#1E293B' },
  warningBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F59E0B10', borderWidth: 1, borderColor: '#F59E0B30', borderRadius: 12, padding: 16, marginBottom: 24 },
  warningTitle: { fontSize: 14, fontWeight: '700', color: '#F59E0B', marginBottom: 4 },
  warningDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#8B5CF6', borderRadius: 12, paddingVertical: 16, marginBottom: 16 },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  termsText: { fontSize: 11, color: '#475569', textAlign: 'center', lineHeight: 16 },

  // Success Screen
  successScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  successIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B98120', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#F1F5F9', marginBottom: 12 },
  successSub: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 32, maxWidth: 400 },
  successDetails: { backgroundColor: '#111827', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#1E293B', width: '100%', maxWidth: 400, marginBottom: 24 },
  successRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  successLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  successValue: { fontSize: 12, color: '#CBD5E1', fontWeight: '500', maxWidth: 200, textAlign: 'right' },
  reviewBadge: { backgroundColor: '#F59E0B20', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  reviewBadgeText: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  newSubmitBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#8B5CF6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  newSubmitBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  // Toast
  toast: { position: 'absolute', bottom: 80, left: '50%', transform: [{ translateX: -140 }], backgroundColor: '#111827', borderWidth: 1, borderColor: '#10B98140', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8, width: 280, zIndex: 9999 },
  toastText: { fontSize: 13, color: '#E2E8F0', fontWeight: '600' },
});
