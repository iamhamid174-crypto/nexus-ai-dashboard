import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCheck, FiZap, FiStar, FiBriefcase, FiCreditCard,
  FiDownload, FiArrowRight, FiShield, FiAlertCircle,
} from 'react-icons/fi';
import { formatCurrency, formatDate } from '../../utils/helpers';

/* ─── Data ────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    icon: FiZap,
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for individuals exploring AI tools.',
    color: 'from-slate-500 to-slate-600',
    features: [
      '5,000 AI words / month',
      '3 AI Tools',
      '2 Projects',
      'Basic analytics',
      'Email support',
    ],
    limits: ['No team members', 'No custom templates'],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: FiStar,
    price: { monthly: 29, annual: 23 },
    description: 'Ideal for professionals and growing teams.',
    color: 'from-brand-500 to-accent-500',
    popular: true,
    features: [
      '100,000 AI words / month',
      'All 5 AI Tools',
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '5 Team members',
      'Custom templates',
      'API access',
    ],
    limits: [],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: FiBriefcase,
    price: { monthly: 99, annual: 79 },
    description: 'For large teams with advanced needs.',
    color: 'from-purple-500 to-pink-500',
    features: [
      'Unlimited AI words',
      'All 5 AI Tools',
      'Unlimited projects',
      'Custom analytics & reports',
      'Dedicated account manager',
      'Unlimited team members',
      'White-label options',
      'SLA & uptime guarantee',
      'SSO / SAML',
    ],
    limits: [],
  },
];

const BILLING_HISTORY = [
  { id: 'inv-001', date: '2024-12-01', amount: 29, plan: 'Pro Monthly', status: 'paid', invoice: '#INV-20241201' },
  { id: 'inv-002', date: '2024-11-01', amount: 29, plan: 'Pro Monthly', status: 'paid', invoice: '#INV-20241101' },
  { id: 'inv-003', date: '2024-10-01', amount: 29, plan: 'Pro Monthly', status: 'paid', invoice: '#INV-20241001' },
  { id: 'inv-004', date: '2024-09-01', amount: 29, plan: 'Pro Monthly', status: 'paid', invoice: '#INV-20240901' },
  { id: 'inv-005', date: '2024-08-01', amount: 0,  plan: 'Starter',     status: 'free', invoice: '#INV-20240801' },
];

/* ─── Sub-components ──────────────────────────────────────────── */
function PlanCard({ plan, currentPlan, billing, onSelect }) {
  const Icon = plan.icon;
  const price = billing === 'annual' ? plan.price.annual : plan.price.monthly;
  const isCurrentPlan = plan.id === currentPlan;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative glass-card p-6 flex flex-col gap-4 ${
        plan.popular ? 'ring-2 ring-brand-500 dark:ring-brand-400' : ''
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
          <Icon className="text-white text-lg" />
        </div>
        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white">{plan.name}</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400">{plan.description}</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1">
        <span className="text-4xl font-bold gradient-text">{price === 0 ? 'Free' : `$${price}`}</span>
        {price > 0 && (
          <span className="text-surface-500 dark:text-surface-400 mb-1">
            / {billing === 'annual' ? 'mo (billed annually)' : 'month'}
          </span>
        )}
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
            <FiCheck className="text-brand-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
        {plan.limits.map((l) => (
          <li key={l} className="flex items-start gap-2 text-sm text-surface-400 dark:text-surface-500 line-through">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            {l}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan.id)}
        className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
          isCurrentPlan
            ? 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 cursor-default'
            : plan.popular
            ? 'btn-brand'
            : 'btn-outline'
        }`}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? 'Current Plan' : plan.price.monthly === 0 ? 'Downgrade' : 'Upgrade'}
        {!isCurrentPlan && <FiArrowRight className="inline ml-2" />}
      </button>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const map = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    free: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${map[status] || map.free}`}>
      {status}
    </span>
  );
}

/* ─── BillingPage ─────────────────────────────────────────────── */
export default function BillingPage() {
  const [billing, setBilling] = useState('monthly');
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-8">

      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Billing & Subscription</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Manage your plan, payment methods, and invoices.</p>
      </motion.div>

      {/* Current plan banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <FiStar className="text-white" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Current Plan</p>
            <p className="font-semibold text-surface-900 dark:text-white">Pro Monthly — $29/month</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-surface-500 dark:text-surface-400">
          <FiShield className="text-emerald-500" />
          Next billing: <span className="font-medium text-surface-700 dark:text-surface-300">Jan 1, 2025</span>
        </div>
        <button className="btn-outline text-sm py-2 px-4">Manage Billing</button>
      </motion.div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-surface-900 dark:text-white' : 'text-surface-400'}`}>Monthly</span>
        <button
          onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
          className={`relative w-12 h-6 rounded-full transition-colors ${billing === 'annual' ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${billing === 'annual' ? 'translate-x-6' : ''}`} />
        </button>
        <span className={`text-sm font-medium ${billing === 'annual' ? 'text-surface-900 dark:text-white' : 'text-surface-400'}`}>
          Annual <span className="text-emerald-500 font-semibold ml-1">Save 20%</span>
        </span>
      </div>

      {/* Plan cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {PLANS.map((plan) => (
          <motion.div key={plan.id} variants={item}>
            <PlanCard
              plan={plan}
              currentPlan={currentPlan}
              billing={billing}
              onSelect={handleSelectPlan}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Payment method */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Payment Method</h2>
        <div className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="font-medium text-surface-900 dark:text-white">•••• •••• •••• 4242</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">Expires 12/2027</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline text-sm py-2 px-4">Replace Card</button>
            <button className="text-sm text-red-500 hover:text-red-600 transition-colors px-3">Remove</button>
          </div>
        </div>
        <button className="mt-3 flex items-center gap-2 text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors">
          <FiCreditCard /> Add new payment method
        </button>
      </motion.div>

      {/* Billing history */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Billing History</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-3 px-4 text-surface-500 dark:text-surface-400 font-medium">Invoice</th>
                  <th className="text-left py-3 px-4 text-surface-500 dark:text-surface-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-surface-500 dark:text-surface-400 font-medium">Plan</th>
                  <th className="text-left py-3 px-4 text-surface-500 dark:text-surface-400 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-surface-500 dark:text-surface-400 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-surface-500 dark:text-surface-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {BILLING_HISTORY.map((inv, i) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.04 }}
                    className="border-b border-surface-100 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-surface-700 dark:text-surface-300">{inv.invoice}</td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{formatDate(inv.date)}</td>
                    <td className="py-3 px-4 text-surface-700 dark:text-surface-300">{inv.plan}</td>
                    <td className="py-3 px-4 font-medium text-surface-900 dark:text-white">
                      {inv.amount === 0 ? '—' : formatCurrency(inv.amount)}
                    </td>
                    <td className="py-3 px-4"><StatusBadge status={inv.status} /></td>
                    <td className="py-3 px-4 text-right">
                      {inv.status !== 'free' && (
                        <button className="inline-flex items-center gap-1 text-brand-500 hover:text-brand-600 transition-colors text-xs font-medium">
                          <FiDownload size={12} /> PDF
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Upgrade modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass-card p-6 w-full max-w-md space-y-5 z-10"
          >
            <h3 className="text-lg font-bold text-surface-900 dark:text-white">Confirm Plan Change</h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              You're switching to the <span className="font-semibold text-surface-700 dark:text-surface-300 capitalize">{selectedPlan}</span> plan.
              Your card ending in 4242 will be charged.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 btn-brand"
                onClick={() => { setCurrentPlan(selectedPlan); setShowPaymentModal(false); }}
              >
                Confirm Upgrade
              </button>
              <button
                className="flex-1 btn-outline"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
