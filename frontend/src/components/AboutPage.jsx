import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Info, Shield, Lightbulb, Users, TrendingUp, Database, Cpu, ArrowRight } from 'lucide-react';

const advantages = [
  {
    icon: Cpu,
    title: 'Predictive, Not Reactive',
    desc: 'Unlike traditional HR platforms that focus on feedback collection after issues arise, our system predicts attrition risk before an employee decides to leave.',
  },
  {
    icon: Database,
    title: 'Data-Driven Decisions',
    desc: 'Machine learning algorithms analyze 31 employee attributes to provide objective risk assessments, removing bias from HR evaluations.',
  },
  {
    icon: Shield,
    title: 'Proactive Retention',
    desc: 'HR teams receive actionable recommendations tailored to each risk level, enabling targeted interventions that reduce turnover costs.',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Improvement',
    desc: 'The model is trained on historical employee records and can be retrained with new data to improve accuracy over time.',
  },
];

const techStack = [
  { name: 'Python', role: 'Backend & ML Pipeline' },
  { name: 'Scikit-learn', role: 'Machine Learning Models' },
  { name: 'Flask', role: 'REST API Server' },
  { name: 'React', role: 'Interactive Frontend UI' },
  { name: 'Pandas', role: 'Data Processing & Analysis' },
  { name: 'Matplotlib/Seaborn', role: 'Data Visualization' },
];

export default function AboutPage() {
  return (
    <div className="page about-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Info size={32} className="page-icon" />
        <h1>About This Platform</h1>
        <p>
          An intelligent HR platform that goes beyond traditional employee management by using
          machine learning to predict and prevent attrition.
        </p>
      </motion.div>

      {/* Problem Statement */}
      <motion.section
        className="about-section card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="about-content">
          <Lightbulb size={28} className="about-icon" style={{ color: '#f59e0b' }} />
          <h2>The Problem We Solve</h2>
          <p>
            Current HR platforms mainly focus on employee management, communication, and feedback collection.
            They tell you what happened — but not what <em>will</em> happen. Our system goes a step further
            by analyzing employee data and feedback using machine learning to <strong>predict attrition risk
            before an employee decides to leave</strong>.
          </p>
          <p>
            This enables HR teams to take proactive measures rather than reacting after a resignation.
            Employee turnover costs companies an estimated 50-200% of the employee's annual salary in
            recruitment, onboarding, and lost productivity.
          </p>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="about-section card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="about-content">
          <Users size={28} className="about-icon" style={{ color: '#6366f1' }} />
          <h2>How It Works</h2>
          <div className="process-flow">
            <div className="process-step">
              <span className="process-num">1</span>
              <h4>Collect Data</h4>
              <p>Gather employee demographics, satisfaction, work history, and compensation data.</p>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <span className="process-num">2</span>
              <h4>Preprocess</h4>
              <p>Clean, encode, and standardize data for machine learning analysis.</p>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <span className="process-num">3</span>
              <h4>ML Prediction</h4>
              <p>Trained model calculates probability of attrition for each employee.</p>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <span className="process-num">4</span>
              <h4>Risk Score</h4>
              <p>HR receives Low, Medium, or High risk with actionable recommendations.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Advantages */}
      <motion.section
        className="section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="section-header">
          <h2>Why Choose Our Platform?</h2>
          <p>Key advantages over traditional HR management tools</p>
        </div>
        <div className="advantages-grid">
          {advantages.map((a) => (
            <div key={a.title} className="advantage-card card">
              <a.icon size={28} style={{ color: '#6366f1' }} />
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Tech Stack */}
      <motion.section
        className="about-section card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2>Technology Stack</h2>
        <div className="tech-grid">
          {techStack.map((t) => (
            <div key={t.name} className="tech-item">
              <span className="tech-name">{t.name}</span>
              <span className="tech-role">{t.role}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Dataset */}
      <motion.section
        className="about-section card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2>About the Dataset</h2>
        <p>
          This project uses the <strong>IBM HR Analytics Employee Attrition & Performance</strong> dataset,
          containing 1,470 employee records with 35 features covering demographics, job satisfaction,
          compensation, work-life balance, and employment history.
        </p>
        <div className="dataset-stats">
          <div className="ds-stat">
            <span className="ds-value">1,470</span>
            <span className="ds-label">Employee Records</span>
          </div>
          <div className="ds-stat">
            <span className="ds-value">35</span>
            <span className="ds-label">Features</span>
          </div>
          <div className="ds-stat">
            <span className="ds-value">16.1%</span>
            <span className="ds-label">Attrition Rate</span>
          </div>
          <div className="ds-stat">
            <span className="ds-value">9</span>
            <span className="ds-label">Job Roles</span>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        className="about-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Link to="/predict" className="btn btn-primary btn-lg">
          Try the Predictor <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  );
}
