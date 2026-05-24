import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiSun, FiMoon, FiMonitor, FiBell, FiMail, FiSmartphone,
  FiGlobe, FiLock, FiDatabase, FiLayout, FiSliders, FiCheck,
} from 'react-icons/fi';
import { selectTheme, setTheme } from '../../store/slices/themeSlice';
import { useToast } from '../../hooks';

/* ─── Toggle ──────────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
      />
    </button>
  );
}

/* ─── Setting row ─────────────────────────────────────────────── */
function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-start sm:items-center justify-between gap-4 py-4 border-b border-surface-100 dark:border-surface-800 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Icon size={14} className="text-brand-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-surface-900 dark:text-white">{title}</p>
          {description && <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ─── Section card ────────────────────────────────────────────── */
function Section({ title, icon: Icon, children }) {
  return (
    <div className="glass-card p-6 space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-brand-500" />
        <h2 className="text-base font-semibold text-surface-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ─── ThemeOption ─────────────────────────────────────────────── */
function ThemeOption({ icon: Icon, label, value, current, onClick }) {
  const active = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
        active
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? 'bg-brand-500 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-500'}`}>
        <Icon size={18} />
      </div>
      <span className={`text-xs font-medium ${active ? 'text-brand-600 dark:text-brand-400' : 'text-surface-600 dark:text-surface-400'}`}>{label}</span>
      {active && <FiCheck size={12} className="text-brand-500" />}
    </button>
  );
}

/* ─── SettingsPage ────────────────────────────────────────────── */
export default function SettingsPage() {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const toast = useToast();

  const [notifications, setNotifications] = useState({
    email_activity: true,
    email_billing: true,
    email_product: false,
    push_activity: true,
    push_mentions: true,
    push_updates: false,
    sms_security: true,
    sms_billing: false,
  });

  const [privacy, setPrivacy] = useState({
    profile_public: false,
    show_activity: true,
    analytics_sharing: true,
    crash_reports: true,
  });

  const [preferences, setPreferences] = useState({
    compact_mode: false,
    animations: true,
    auto_save: true,
    language: 'en',
    date_format: 'MM/DD/YYYY',
    timezone: 'America/Los_Angeles',
  });

  const handleTheme = (val) => {
    dispatch(setTheme(val));
    toast.success(`Theme set to ${val}.`);
  };

  const handleSave = () => toast.success('Settings saved successfully!');

  const toggle = (key, setter) => (val) => setter((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Settings</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Customize your AI SAAS Dashboard experience.</p>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
        <Section title="Appearance" icon={FiLayout}>
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Theme</p>
            <div className="flex gap-3 flex-wrap">
              <ThemeOption icon={FiSun} label="Light" value="light" current={currentTheme} onClick={handleTheme} />
              <ThemeOption icon={FiMoon} label="Dark" value="dark" current={currentTheme} onClick={handleTheme} />
              <ThemeOption icon={FiMonitor} label="System" value="system" current={currentTheme} onClick={handleTheme} />
            </div>
          </div>
          <SettingRow icon={FiSliders} title="Compact Mode" description="Reduce spacing for a denser layout.">
            <Toggle checked={preferences.compact_mode} onChange={toggle('compact_mode', setPreferences)} />
          </SettingRow>
          <SettingRow icon={FiLayout} title="Animations" description="Enable smooth page and component transitions.">
            <Toggle checked={preferences.animations} onChange={toggle('animations', setPreferences)} />
          </SettingRow>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="Notifications" icon={FiBell}>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 flex items-center gap-2"><FiMail size={13} /> Email Notifications</p>
          <SettingRow icon={FiMail} title="Activity Updates" description="Get notified about project and AI tool activity.">
            <Toggle checked={notifications.email_activity} onChange={toggle('email_activity', setNotifications)} />
          </SettingRow>
          <SettingRow icon={FiMail} title="Billing Alerts" description="Receive invoices and subscription updates.">
            <Toggle checked={notifications.email_billing} onChange={toggle('email_billing', setNotifications)} />
          </SettingRow>
          <SettingRow icon={FiMail} title="Product News" description="Tips, new features, and announcements.">
            <Toggle checked={notifications.email_product} onChange={toggle('email_product', setNotifications)} />
          </SettingRow>

          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 mt-2 flex items-center gap-2"><FiBell size={13} /> Push Notifications</p>
          <SettingRow icon={FiBell} title="Activity Alerts" description="Real-time push alerts for workspace activity.">
            <Toggle checked={notifications.push_activity} onChange={toggle('push_activity', setNotifications)} />
          </SettingRow>
          <SettingRow icon={FiBell} title="Mentions" description="Get notified when someone mentions you.">
            <Toggle checked={notifications.push_mentions} onChange={toggle('push_mentions', setNotifications)} />
          </SettingRow>
          <SettingRow icon={FiBell} title="Platform Updates" description="Notifications about new features and changes.">
            <Toggle checked={notifications.push_updates} onChange={toggle('push_updates', setNotifications)} />
          </SettingRow>

          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 mt-2 flex items-center gap-2"><FiSmartphone size={13} /> SMS Notifications</p>
          <SettingRow icon={FiSmartphone} title="Security Alerts" description="Critical login and security notifications via SMS.">
            <Toggle checked={notifications.sms_security} onChange={toggle('sms_security', setNotifications)} />
          </SettingRow>
          <SettingRow icon={FiSmartphone} title="Billing SMS" description="Payment confirmation and renewal reminders.">
            <Toggle checked={notifications.sms_billing} onChange={toggle('sms_billing', setNotifications)} />
          </SettingRow>
        </Section>
      </motion.div>

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <Section title="Account Preferences" icon={FiSliders}>
          <SettingRow icon={FiDatabase} title="Auto-Save" description="Automatically save your work while editing.">
            <Toggle checked={preferences.auto_save} onChange={toggle('auto_save', setPreferences)} />
          </SettingRow>

          {/* Language */}
          <div className="py-4 border-b border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                <FiGlobe size={14} className="text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">Language</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Choose your preferred language.</p>
              </div>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="input-field py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>

          {/* Timezone */}
          <div className="py-4 border-b border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                <FiGlobe size={14} className="text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">Timezone</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Set your local timezone for accurate timestamps.</p>
              </div>
            </div>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              className="input-field py-2 text-sm"
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Asia/Karachi">Karachi (PKT)</option>
            </select>
          </div>

          {/* Date format */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                <FiSliders size={14} className="text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">Date Format</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Choose how dates are displayed across the app.</p>
              </div>
            </div>
            <select
              value={preferences.date_format}
              onChange={(e) => setPreferences({ ...preferences, date_format: e.target.value })}
              className="input-field py-2 text-sm"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </Section>
      </motion.div>

      {/* Privacy */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <Section title="Privacy & Data" icon={FiLock}>
          <SettingRow icon={FiGlobe} title="Public Profile" description="Allow others to view your profile page.">
            <Toggle checked={privacy.profile_public} onChange={toggle('profile_public', setPrivacy)} />
          </SettingRow>
          <SettingRow icon={FiBell} title="Show Activity Status" description="Let team members see when you're active.">
            <Toggle checked={privacy.show_activity} onChange={toggle('show_activity', setPrivacy)} />
          </SettingRow>
          <SettingRow icon={FiDatabase} title="Analytics Sharing" description="Help improve AI SAAS Dashboard by sharing anonymous usage data.">
            <Toggle checked={privacy.analytics_sharing} onChange={toggle('analytics_sharing', setPrivacy)} />
          </SettingRow>
          <SettingRow icon={FiDatabase} title="Crash Reports" description="Automatically send crash reports to help fix bugs faster.">
            <Toggle checked={privacy.crash_reports} onChange={toggle('crash_reports', setPrivacy)} />
          </SettingRow>
        </Section>
      </motion.div>

      {/* Save */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22 }}
        className="flex justify-end gap-3 pb-4"
      >
        <button onClick={() => toast.info('Changes discarded.')} className="btn-outline py-2.5 px-6 text-sm">
          Discard
        </button>
        <button onClick={handleSave} className="btn-brand py-2.5 px-6 text-sm flex items-center gap-2">
          <FiCheck size={14} /> Save All Settings
        </button>
      </motion.div>
    </div>
  );
}
