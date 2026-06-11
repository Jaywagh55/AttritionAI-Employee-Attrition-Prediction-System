import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, BarChart2, Activity, CheckCircle } from 'lucide-react';
import { fetchModelInfo, plotUrl } from '../api';

export default function ModelEvalPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelInfo()
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page model-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Brain size={32} className="page-icon" />
        <h1>Model Performance & Insights</h1>
        <p>Understand how the machine learning model evaluates employee attrition risk and which features matter most.</p>
      </motion.div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-large" />
          <p>Loading model information...</p>
        </div>
      ) : (
        <>
          {/* Model Info Cards */}
          <motion.div
            className="model-info-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="model-info-card">
              <Target size={24} className="info-icon" style={{ color: '#6366f1' }} />
              <div>
                <h4>Model Algorithm</h4>
                <p className="info-value">{data?.model_name || 'Random Forest'}</p>
              </div>
            </div>
            <div className="model-info-card">
              <BarChart2 size={24} className="info-icon" style={{ color: '#22c55e' }} />
              <div>
                <h4>Features Used</h4>
                <p className="info-value">{data?.n_features || '31'} features</p>
              </div>
            </div>
            <div className="model-info-card">
              <Activity size={24} className="info-icon" style={{ color: '#f59e0b' }} />
              <div>
                <h4>Training Samples</h4>
                <p className="info-value">{data?.train_samples || '1,176'}</p>
              </div>
            </div>
            <div className="model-info-card">
              <CheckCircle size={24} className="info-icon" style={{ color: '#06b6d4' }} />
              <div>
                <h4>Test Samples</h4>
                <p className="info-value">{data?.test_samples || '294'}</p>
              </div>
            </div>
          </motion.div>

          {/* Evaluation Charts */}
          <motion.div
            className="model-charts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="chart-card">
              <h3>Confusion Matrix</h3>
              <p className="chart-desc">Shows how accurately the model classifies employees who leave vs. stay</p>
              <img src={plotUrl('confusion_matrix.png')} alt="Confusion Matrix" className="chart-img" />
            </div>

            <div className="chart-card">
              <h3>ROC Curve Comparison</h3>
              <p className="chart-desc">Receiver Operating Characteristic curve comparing different model algorithms</p>
              <img src={plotUrl('roc_curve.png')} alt="ROC Curve" className="chart-img" />
            </div>

            {data?.has_feature_importance && (
              <div className="chart-card chart-card--wide">
                <h3>Top 15 Feature Importance</h3>
                <p className="chart-desc">Which employee attributes have the strongest influence on attrition prediction</p>
                <img src={plotUrl('feature_importance.png')} alt="Feature Importance" className="chart-img" />
              </div>
            )}
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            className="model-how-it-works card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2>How the Prediction Works</h2>
            <div className="how-grid">
              <div className="how-step">
                <div className="how-number">1</div>
                <h4>Data Input</h4>
                <p>You provide employee attributes including demographics, compensation, satisfaction scores, and work history.</p>
              </div>
              <div className="how-step">
                <div className="how-number">2</div>
                <h4>Feature Encoding</h4>
                <p>Categorical variables are label-encoded and all features are standardized using StandardScaler.</p>
              </div>
              <div className="how-step">
                <div className="how-number">3</div>
                <h4>ML Prediction</h4>
                <p>The trained {data?.model_name || 'Random Forest'} model analyzes patterns learned from historical employee data.</p>
              </div>
              <div className="how-step">
                <div className="how-number">4</div>
                <h4>Risk Assessment</h4>
                <p>The model outputs a probability score that is mapped to Low (&lt;20%), Moderate (20-50%), or High (&gt;50%) risk.</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
