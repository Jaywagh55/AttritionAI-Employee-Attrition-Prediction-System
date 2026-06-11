import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calculator, BarChart3, Brain, Shield, TrendingUp, Users, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const stats = [
  { value: '87%', label: 'Model Accuracy', icon: CheckCircle2 },
  { value: '1,470', label: 'Employees Analyzed', icon: Users },
  { value: '31', label: 'Features Used', icon: Zap },
  { value: '< 1s', label: 'Prediction Time', icon: TrendingUp },
];

const features = [
  {
    icon: Calculator,
    title: 'Risk Prediction',
    desc: 'Enter employee details and get instant attrition risk score with actionable recommendations.',
    link: '/predict',
    color: '#6366f1',
  },
  {
    icon: BarChart3,
    title: 'HR Analytics',
    desc: 'Explore interactive data visualizations showing attrition patterns across departments and demographics.',
    link: '/analytics',
    color: '#06b6d4',
  },
  {
    icon: Brain,
    title: 'Model Insights',
    desc: 'Understand how the ML model works with performance metrics, confusion matrix, and feature importance.',
    link: '/model',
    color: '#f59e0b',
  },
];

const steps = [
  { step: '01', title: 'Collect Data', desc: 'Gather employee demographics, satisfaction scores, and work history.' },
  { step: '02', title: 'Analyze Patterns', desc: 'ML model identifies key factors that predict attrition risk.' },
  { step: '03', title: 'Get Risk Score', desc: 'Receive Low, Medium, or High risk assessment with probability.' },
  { step: '04', title: 'Take Action', desc: 'HR teams get proactive recommendations to improve retention.' },
];

export default function HomePage() {
  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="hero-badge">
            <Shield size={14} />
            <span>AI-Powered HR Intelligence</span>
          </div>
          <h1 className="hero-title">
            Predict Employee
            <span className="gradient-text"> Attrition Risk</span>
            <br />Before It Happens
          </h1>
          <p className="hero-subtitle">
            Our machine learning system analyzes employee data to predict the likelihood of turnover,
            enabling HR teams to take proactive measures and reduce costly attrition by up to 25%.
          </p>
          <div className="hero-actions">
            <Link to="/predict" className="btn btn-primary btn-lg">
              <Calculator size={20} />
              Start Prediction
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-ghost btn-lg">
              Learn More
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="hero-card">
            <div className="hero-card-header">
              <div className="pulse-dot" />
              <span>Live Risk Assessment</span>
            </div>
            <div className="hero-card-body">
              <div className="risk-gauge">
                <svg viewBox="0 0 200 120" className="gauge-svg">
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGradient)" strokeWidth="12" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="150" />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <text x="100" y="85" textAnchor="middle" className="gauge-text">38%</text>
                  <text x="100" y="105" textAnchor="middle" className="gauge-label">Moderate Risk</text>
                </svg>
              </div>
              <div className="hero-card-metrics">
                <div className="metric-row">
                  <span>Job Satisfaction</span>
                  <div className="metric-bar"><div className="metric-fill" style={{ width: '50%', background: '#f59e0b' }} /></div>
                </div>
                <div className="metric-row">
                  <span>Work-Life Balance</span>
                  <div className="metric-bar"><div className="metric-fill" style={{ width: '75%', background: '#22c55e' }} /></div>
                </div>
                <div className="metric-row">
                  <span>Monthly Income</span>
                  <div className="metric-bar"><div className="metric-fill" style={{ width: '40%', background: '#ef4444' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.section
        className="stats-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <stat.icon size={24} className="stat-icon" />
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-header">
          <h2>How It Works</h2>
          <p>From data collection to actionable insights in four simple steps</p>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.step} className="step-card">
              <div className="step-number">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Feature Cards */}
      <motion.section
        className="section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="section-header">
          <h2>Platform Features</h2>
          <p>Everything HR teams need to predict and prevent employee attrition</p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <Link key={f.link} to={f.link} className="feature-card">
              <div className="feature-icon" style={{ background: `${f.color}15`, color: f.color }}>
                <f.icon size={28} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-link" style={{ color: f.color }}>
                Explore <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2>Ready to Reduce Attrition?</h2>
        <p>Start predicting employee flight risk today and take proactive measures to retain top talent.</p>
        <Link to="/predict" className="btn btn-primary btn-lg">
          <Calculator size={20} />
          Try the Predictor
        </Link>
      </motion.section>
    </div>
  );
}
