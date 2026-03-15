import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore, Role } from '../store/useUserStore';
import { Shield, Github, Mail, Lock, Code2, Users, Briefcase, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ROLE_CONFIG: Record<Exclude<Role, 'admin' | null>, { icon: any; color: string; label: string; desc: string }> = {
  participant: { icon: Code2, color: '#10B981', label: 'Participant', desc: 'Join teams & build projects' },
  mentor: { icon: Zap, color: '#3B82F6', label: 'Mentor', desc: 'Guide & review code' },
  volunteer: { icon: Users, color: '#F59E0B', label: 'Volunteer', desc: 'Manage help queue' },
  staff: { icon: Shield, color: '#8B5CF6', label: 'Staff', desc: 'Command center access' },
  partner: { icon: Briefcase, color: '#EC4899', label: 'Partner', desc: 'View analytics & metrics' },
};

export default function LoginScreen() {
  const router = useRouter();
  const setRole = useUserStore((state) => state.setRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Exclude<Role, 'admin' | null>>('participant');

  const handleSubmit = () => {
    setRole(selectedRole);
    router.replace('/(tabs)/dashboard');
  };

  const activeColor = ROLE_CONFIG[selectedRole].color;

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        {/* Background Gradients */}
        <View style={[styles.bgCircle, { backgroundColor: activeColor, top: -100, left: -50 }]} />
        <View style={[styles.bgCircle, { backgroundColor: '#8B5CF6', bottom: -150, right: -100, opacity: 0.05 }]} />

        <View style={styles.brandContainer}>
          <View style={[styles.iconWrapper, { shadowColor: activeColor }]}>
            <Shield size={32} color={activeColor} />
          </View>
          <Text style={styles.brandTitle}>HackOS</Text>
          <Text style={styles.brandSubtitle}>The Hackathon Operating System</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.h1}>{isLogin ? 'Welcome back' : 'Create an account'}</Text>
            <Text style={styles.description}>{isLogin ? 'Sign in to your account' : 'Join HackOS today'}</Text>
          </View>

          {/* Role Selection */}
          <Text style={styles.sectionLabel}>SELECT YOUR ROLE</Text>
          <View style={styles.roleGrid}>
            {(Object.keys(ROLE_CONFIG) as Exclude<Role, 'admin' | null>[]).map((role) => {
              const RoleIcon = ROLE_CONFIG[role].icon;
              const isActive = selectedRole === role;
              return (
                <TouchableOpacity
                  key={role}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedRole(role);
                    setEmail(`${role}@hackos.com`);
                    setPassword('password123');
                  }}
                  style={[
                    styles.roleCard,
                    isActive && { borderColor: ROLE_CONFIG[role].color, backgroundColor: ROLE_CONFIG[role].color + '15' }
                  ]}
                >
                  <RoleIcon size={20} color={isActive ? ROLE_CONFIG[role].color : '#64748B'} />
                  <Text style={[styles.roleLabel, isActive && { color: '#E2E8F0' }]}>
                    {ROLE_CONFIG[role].label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.roleDescText}>{ROLE_CONFIG[selectedRole].desc}</Text>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Form */}
          {!isLogin && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputRow, { borderColor: '#1E293B' }]}>
                <Users size={16} color="#64748B" style={{ marginRight: 10 }} />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="John Doe"
                  placeholderTextColor="#64748B"
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputRow, { borderColor: '#1E293B' }]}>
              <Mail size={16} color="#64748B" style={{ marginRight: 10 }} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity><Text style={[styles.forgot, { color: activeColor }]}>Forgot?</Text></TouchableOpacity>
            </View>
            <View style={[styles.inputRow, { borderColor: '#1E293B' }]}>
              <Lock size={16} color="#64748B" style={{ marginRight: 10 }} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#64748B"
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: activeColor, shadowColor: activeColor }]} 
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>{isLogin ? 'Sign In as' : 'Sign Up as'} {ROLE_CONFIG[selectedRole].label}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.oauthBtn} activeOpacity={0.8}>
            <Github size={18} color="#E2E8F0" style={{ marginRight: 10 }} />
            <Text style={styles.oauthText}>Continue with GitHub</Text>
          </TouchableOpacity>

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
          <Text style={styles.footerText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={[styles.footerLink, { color: activeColor }]}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: '#0B0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  bgCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.1,
    filter: 'blur(60px)',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#111827',
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  cardHeader: {
    marginBottom: 24,
  },
  h1: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  roleCard: {
    flex: 1,
    minWidth: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0B0F1A',
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  roleDescText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E293B',
  },
  or: {
    marginHorizontal: 12,
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
    letterSpacing: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgot: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0F1A',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
  },
  eyeBtn: {
    padding: 8,
  },
  eyeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  oauthBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  oauthText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 32,
    fontSize: 14,
    color: '#64748B',
  },
  footerLink: {
    fontWeight: '600',
  },
});
