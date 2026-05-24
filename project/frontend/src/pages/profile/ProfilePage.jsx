import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCamera,
  FiLock, FiEye, FiEyeOff, FiShield, FiTrash2, FiSave,
  FiKey, FiSmartphone, FiCheck,
} from 'react-icons/fi';
import { selectUser, updateUserLocal } from '../../store/slices/authSlice';
import { useToast } from '../../hooks';
import { getInitials } from '../../utils/helpers';

/* ─── Section wrapper ─────────────────────────────────────────── */
function Section({ title, subtitle, children }) {
  return (
    <div className="glass-card p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-surface-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ─── InputField ──────────────────────────────────────────────── */
function Field({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-surface-700 dark:text-surface-300">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 text-sm" />
        )}
        <input
          {...props}
          className={`input-field ${Icon ? 'pl-9' : ''} w-full`}
        />
      </div>
    </div>
  );
}

/* ─── PasswordField ───────────────────────────────────────────── */
function PasswordField({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-surface-700 dark:text-surface-300">{label}</label>
      <div className="relative">
        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="input-field pl-9 pr-9 w-full"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
        >
          {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </button>
      </div>
    </div>
  );
}

/* ─── ProfilePage ─────────────────────────────────────────────── */
export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex@example.com',
    phone: user?.phone || '+1 (555) 000-0000',
    location: user?.location || 'San Francisco, CA',
    website: user?.website || 'https://alexjohnson.dev',
    bio: user?.bio || 'Full-stack developer passionate about AI-powered tools and automation.',
    avatar: user?.avatar || null,
  });

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'danger', label: 'Danger Zone', icon: FiTrash2 },
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setPreviewAvatar(evt.target.result);
    reader.readAsDataURL(file);
    toast.success('Avatar ready to save.');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    dispatch(updateUserLocal({ ...profileData, avatar: previewAvatar || profileData.avatar }));
    toast.success('Profile updated successfully!');
    setSaving(false);
  };

  const handleSavePassword = async () => {
    if (passwords.newPass !== passwords.confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setSavingPwd(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success('Password changed successfully!');
    setPasswords({ current: '', newPass: '', confirm: '' });
    setSavingPwd(false);
  };

  const avatarSrc = previewAvatar || profileData.avatar;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Profile</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Manage your personal information and account security.</p>
      </motion.div>

      {/* Avatar section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6"
      >
        <div className="relative group">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl object-cover ring-2 ring-brand-500/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-3xl font-bold text-white">
              {getInitials(profileData.name)}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiCamera className="text-white text-xl" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{profileData.name}</h3>
          <p className="text-surface-500 dark:text-surface-400 text-sm">{profileData.email}</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            <span className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full font-medium">Pro Plan</span>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-medium">Active</span>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-outline text-sm py-2 px-4 flex items-center gap-2"
        >
          <FiCamera size={14} /> Change Photo
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Section title="Personal Information" subtitle="Update your personal details.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" icon={FiUser} value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              <Field label="Email Address" icon={FiMail} type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
              <Field label="Phone Number" icon={FiPhone} value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
              <Field label="Location" icon={FiMapPin} value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} />
              <div className="sm:col-span-2">
                <Field label="Website" icon={FiGlobe} value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Bio</label>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="input-field w-full resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn-brand flex items-center gap-2"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiSave size={14} />
                )}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </Section>
        </motion.div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Section title="Change Password" subtitle="Choose a strong password that you don't use elsewhere.">
            <div className="space-y-4 max-w-sm">
              <PasswordField label="Current Password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
              <PasswordField label="New Password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} />
              <PasswordField label="Confirm New Password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
              {/* Strength bar */}
              {passwords.newPass && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwords.newPass.length >= n * 3
                            ? passwords.newPass.length >= 12 ? 'bg-emerald-500' : passwords.newPass.length >= 8 ? 'bg-amber-400' : 'bg-red-400'
                            : 'bg-surface-200 dark:bg-surface-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {passwords.newPass.length < 6 ? 'Weak' : passwords.newPass.length < 10 ? 'Fair' : passwords.newPass.length < 14 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-start">
              <button onClick={handleSavePassword} disabled={savingPwd} className="btn-brand flex items-center gap-2">
                {savingPwd ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiKey size={14} />}
                {savingPwd ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </Section>

          <Section title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account.">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFAEnabled ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-surface-100 dark:bg-surface-800'}`}>
                  <FiSmartphone className={twoFAEnabled ? 'text-emerald-500' : 'text-surface-400'} />
                </div>
                <div>
                  <p className="font-medium text-surface-900 dark:text-white text-sm">Authenticator App</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {twoFAEnabled ? 'Two-factor authentication is enabled.' : 'Use Google Authenticator or similar app.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setTwoFAEnabled(!twoFAEnabled); toast.success(twoFAEnabled ? '2FA disabled.' : '2FA enabled!'); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${twoFAEnabled ? 'bg-emerald-500' : 'bg-surface-300 dark:bg-surface-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${twoFAEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {twoFAEnabled && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-start gap-3">
                  <FiCheck className="text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Two-factor authentication is active. Your account is protected by an additional layer of security.
                  </p>
                </div>
              </motion.div>
            )}
          </Section>

          <Section title="Active Sessions" subtitle="Manage devices where you're currently signed in.">
            {[
              { device: 'MacBook Pro 16"', location: 'San Francisco, CA', time: 'Current session', current: true },
              { device: 'iPhone 15 Pro', location: 'San Francisco, CA', time: '2 hours ago', current: false },
              { device: 'Chrome on Windows', location: 'New York, NY', time: '3 days ago', current: false },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${session.current ? 'bg-emerald-500' : 'bg-surface-300 dark:bg-surface-600'}`} />
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{session.device}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{session.location} · {session.time}</p>
                  </div>
                </div>
                {!session.current && (
                  <button onClick={() => toast.success('Session revoked.')} className="text-xs text-red-500 hover:text-red-600 transition-colors font-medium">
                    Revoke
                  </button>
                )}
                {session.current && <span className="text-xs text-emerald-500 font-medium">Active</span>}
              </div>
            ))}
          </Section>
        </motion.div>
      )}

      {/* Tab: Danger Zone */}
      {activeTab === 'danger' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card p-6 border border-red-200 dark:border-red-900/50 space-y-4">
            <h2 className="text-base font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              These actions are permanent and cannot be undone. Please proceed with caution.
            </p>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
                <div>
                  <p className="font-medium text-surface-900 dark:text-white text-sm">Export Account Data</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">Download all your account data as a ZIP archive.</p>
                </div>
                <button onClick={() => toast.info('Export initiated. You will receive an email shortly.')} className="btn-outline text-sm py-2 px-4 shrink-0">
                  Export Data
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400 text-sm">Delete Account</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">Permanently delete your account and all associated data.</p>
                </div>
                <button
                  onClick={() => toast.error('This action is irreversible. Contact support to proceed.')}
                  className="shrink-0 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash2 className="inline mr-1.5" size={13} /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
