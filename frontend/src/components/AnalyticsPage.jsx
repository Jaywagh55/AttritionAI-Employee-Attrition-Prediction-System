import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Building2 } from 'lucide-react';
import { fetchAnalytics, plotUrl } from '../api';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page analytics-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BarChart3 size={32} className="page-icon" />
        <h1>HR Analytics Dashboard</h1>
        <p>Explore workforce data and understand the key factors that influence employee attrition.</p>
      </motion.div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-large" />
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <motion.div
            className="analytics-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="summary-card">
              <Users size={24} className="summary-icon" style={{ color: '#6366f1' }} />
              <div className="summary-info">
                <span className="summary-value">{data?.total_employees || '1,470'}</span>
                <span className="summary-label">Total Employees</span>
              </div>
            </div>
            <div className="summary-card">
              <TrendingUp size={24} className="summary-icon" style={{ color: '#ef4444' }} />
              <div className="summary-info">
                <span className="summary-value">{data?.attrition_rate || '16.1%'}</span>
                <span className="summary-label">Attrition Rate</span>
              </div>
            </div>
            <div className="summary-card">
              <Building2 size={24} className="summary-icon" style={{ color: '#22c55e' }} />
              <div className="summary-info">
                <span className="summary-value">{data?.departments || '3'}</span>
                <span className="summary-label">Departments</span>
              </div>
            </div>
            <div className="summary-card">
              <BarChart3 size={24} className="summary-icon" style={{ color: '#f59e0b' }} />
              <div className="summary-info">
                <span className="summary-value">{data?.avg_age || '36.9'}</span>
                <span className="summary-label">Average Age</span>
              </div>
            </div>
          </motion.div>

          {/* Charts Grid */}
          <motion.div
            className="charts-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="chart-card">
              <h3>Attrition Distribution</h3>
              <p className="chart-desc">Overall breakdown of employee attrition in the dataset</p>
              <img src={plotUrl('attrition_distribution.png')} alt="Attrition Distribution" className="chart-img" />
            </div>

            <div className="chart-card">
              <h3>Attrition by Department</h3>
              <p className="chart-desc">Which departments have the highest turnover rates</p>
              <img src={plotUrl('attrition_by_department.png')} alt="Attrition by Department" className="chart-img" />
            </div>

            <div className="chart-card">
              <h3>Age Distribution by Attrition</h3>
              <p className="chart-desc">Age groups most likely to leave the organization</p>
              <img src={plotUrl('age_by_attrition.png')} alt="Age by Attrition" className="chart-img" />
            </div>

            <div className="chart-card">
              <h3>Monthly Income by Attrition</h3>
              <p className="chart-desc">How compensation correlates with employee retention</p>
              <img src={plotUrl('income_by_attrition.png')} alt="Income by Attrition" className="chart-img" />
            </div>

            <div className="chart-card chart-card--wide">
              <h3>Feature Correlation Heatmap</h3>
              <p className="chart-desc">Relationships between different employee attributes and their predictive power</p>
              <img src={plotUrl('correlation_heatmap.png')} alt="Correlation Heatmap" className="chart-img" />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
