import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, AlertTriangle, CheckCircle, Info, RotateCcw, TrendingUp, Brain } from 'lucide-react';
import { fetchPredict } from '../api';

const fieldSections = [
  {
    title: '👤 Personal & Role',
    fields: [
      { name: 'Age', label: 'Age', type: 'number', min: 18, max: 65, step: 1 },
      { name: 'Gender', label: 'Gender', type: 'select', options: ['Female', 'Male'] },
      { name: 'MaritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced'] },
      { name: 'Education', label: 'Education Level', type: 'select', options: [1, 2, 3, 4, 5], optionLabels: ['Below College', 'College', 'Bachelor', 'Master', 'Doctor'] },
      { name: 'EducationField', label: 'Education Field', type: 'select', options: ['Life Sciences', 'Medical', 'Other', 'Marketing', 'Technical Degree', 'Human Resources'] },
      { name: 'Department', label: 'Department', type: 'select', options: ['Sales', 'Research & Development', 'Human Resources'] },
      { name: 'JobRole', label: 'Job Role', type: 'select', options: ['Sales Executive', 'Research Scientist', 'Laboratory Technician', 'Manager', 'Healthcare Representative', 'Sales Representative', 'Research Director', 'Manufacturing Director', 'Human Resources'] },
      { name: 'JobLevel', label: 'Job Level (1-5)', type: 'number', min: 1, max: 5, step: 1 },
    ],
  },
  {
    title: '💰 Compensation',
    fields: [
      { name: 'MonthlyIncome', label: 'Monthly Income ($)', type: 'number', min: 1000, max: 20000, step: 100 },
      { name: 'DailyRate', label: 'Daily Rate ($)', type: 'number', min: 100, max: 1500, step: 10 },
      { name: 'HourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 30, max: 100, step: 1 },
      { name: 'MonthlyRate', label: 'Monthly Rate ($)', type: 'number', min: 2000, max: 27000, step: 100 },
      { name: 'PercentSalaryHike', label: 'Percent Salary Hike', type: 'number', min: 0, max: 25, step: 1 },
      { name: 'StockOptionLevel', label: 'Stock Option Level (0-3)', type: 'number', min: 0, max: 3, step: 1 },
    ],
  },
  {
    title: '😊 Satisfaction & Performance',
    fields: [
      { name: 'JobSatisfaction', label: 'Job Satisfaction (1-4)', type: 'number', min: 1, max: 4, step: 1 },
      { name: 'EnvironmentSatisfaction', label: 'Environment Satisfaction (1-4)', type: 'number', min: 1, max: 4, step: 1 },
      { name: 'RelationshipSatisfaction', label: 'Relationship Satisfaction (1-4)', type: 'number', min: 1, max: 4, step: 1 },
      { name: 'WorkLifeBalance', label: 'Work-Life Balance (1-4)', type: 'number', min: 1, max: 4, step: 1 },
      { name: 'JobInvolvement', label: 'Job Involvement (1-4)', type: 'number', min: 1, max: 4, step: 1 },
      { name: 'PerformanceRating', label: 'Performance Rating (1-5)', type: 'number', min: 1, max: 5, step: 1 },
    ],
  },
  {
    title: '📅 Work History & Travel',
    fields: [
      { name: 'TotalWorkingYears', label: 'Total Working Years', type: 'number', min: 0, max: 40, step: 1 },
      { name: 'YearsAtCompany', label: 'Years at Company', type: 'number', min: 0, max: 40, step: 1 },
      { name: 'YearsInCurrentRole', label: 'Years in Current Role', type: 'number', min: 0, max: 18, step: 1 },
      { name: 'YearsSinceLastPromotion', label: 'Years Since Last Promotion', type: 'number', min: 0, max: 15, step: 1 },
      { name: 'YearsWithCurrManager', label: 'Years with Current Manager', type: 'number', min: 0, max: 17, step: 1 },
      { name: 'NumCompaniesWorked', label: 'Companies Worked At', type: 'number', min: 0, max: 10, step: 1 },
      { name: 'TrainingTimesLastYear', label: 'Trainings Last Year', type: 'number', min: 0, max: 6, step: 1 },
      { name: 'DistanceFromHome', label: 'Distance from Home (mi)', type: 'number', min: 0, max: 30, step: 1 },
      { name: 'BusinessTravel', label: 'Business Travel', type: 'select', options: ['Travel_Rarely', 'Travel_Frequently', 'Non-Travel'] },
      { name: 'OverTime', label: 'Overtime', type: 'select', options: ['No', 'Yes'] },
    ],
  },
];

const defaultValues = {
  Age: 36, BusinessTravel: 'Travel_Rarely', Department: 'Research & Development',
  DistanceFromHome: 7, Education: 3, EducationField: 'Life Sciences',
  Gender: 'Male', MaritalStatus: 'Single', JobRole: 'Research Scientist',
  JobLevel: 2, OverTime: 'No', MonthlyIncome: 6500, DailyRate: 800,
  HourlyRate: 65, MonthlyRate: 14000, PercentSalaryHike: 14, StockOptionLevel: 1,
  JobSatisfaction: 3, EnvironmentSatisfaction: 3, RelationshipSatisfaction: 3,
  WorkLifeBalance: 3, JobInvolvement: 3, PerformanceRating: 3,
  TotalWorkingYears: 10, YearsAtCompany: 7, YearsInCurrentRole: 5,
  YearsSinceLastPromotion: 2, YearsWithCurrManager: 5, NumCompaniesWorked: 2,
  TrainingTimesLastYear: 2,
};

export default function PredictorPage() {
  const [formData, setFormData] = useState(defaultValues);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInput = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(defaultValues);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchPredict(formData);
      setResult(data);
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === 'High') return '#ef4444';
    if (level === 'Moderate') return '#f59e0b';
    return '#22c55e';
  };

  const getRiskIcon = (level) => {
    if (level === 'High') return <AlertTriangle size={32} />;
    if (level === 'Moderate') return <Info size={32} />;
    return <CheckCircle size={32} />;
  };

  return (
    <div className="page predictor-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Calculator size={32} className="page-icon" />
        <h1>Attrition Risk Predictor</h1>
        <p>Enter employee details below to get an instant attrition risk assessment powered by machine learning.</p>
      </motion.div>

      <div className="predictor-layout">
        <motion.form
          className="predictor-form card"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {fieldSections.map((section) => (
            <fieldset key={section.title} className="form-section">
              <legend>{section.title}</legend>
              <div className="field-grid">
                {section.fields.map((field) => (
                  <div key={field.name} className="field-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        value={formData[field.name]}
                        onChange={(e) => handleInput(field.name, e.target.value)}
                      >
                        {field.options.map((option, index) => (
                          <option key={option} value={option}>
                            {field.optionLabels ? field.optionLabels[index] : option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.name}
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={formData[field.name]}
                        onChange={(e) => handleInput(field.name, Number(e.target.value))}
                      />
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
          ))}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  Predict Attrition Risk
                </>
              )}
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              <RotateCcw size={18} />
              Reset
            </button>
          </div>

          {error && (
            <motion.div
              className="error-alert"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle size={18} />
              <span>{error}</span>
            </motion.div>
          )}
        </motion.form>

        <motion.div
          className="predictor-result card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Prediction Result</h2>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="empty-icon">
                  <Calculator size={48} />
                </div>
                <h3>No Prediction Yet</h3>
                <p>Fill out the employee details and click predict to see the attrition risk assessment.</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                className="result-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="result-gauge" style={{ borderColor: result.risk_color }}>
                  <div className="gauge-icon" style={{ color: result.risk_color }}>
                    {getRiskIcon(result.risk_level)}
                  </div>
                  <div className="gauge-circle" style={{ '--progress': `${result.risk_pct}%`, '--color': result.risk_color }}>
                    <span className="gauge-value">{result.risk_pct}%</span>
                  </div>
                  <div className="gauge-label">
                    <strong>{result.risk_level} Risk</strong>
                    <span>{result.label}</span>
                  </div>
                </div>

                <div className="result-meter">
                  <div className="meter-track">
                    <div
                      className="meter-fill"
                      style={{ width: `${result.risk_pct}%`, background: result.risk_color }}
                    />
                  </div>
                  <div className="meter-labels">
                    <span>0%</span>
                    <span>Low Risk</span>
                    <span>Moderate</span>
                    <span>High Risk</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="result-details">
                  <h3>Recommended Actions</h3>
                  {result.risk_level === 'High' && (
                    <ul className="recommendations">
                      <li><strong>Immediate intervention:</strong> Schedule retention conversation within 48 hours.</li>
                      <li><strong>Compensation review:</strong> Benchmark salary against market rates.</li>
                      <li><strong>Career roadmap:</strong> Present advancement opportunities and development plans.</li>
                      <li><strong>Manager engagement:</strong> Ensure direct manager provides support and recognition.</li>
                    </ul>
                  )}
                  {result.risk_level === 'Moderate' && (
                    <ul className="recommendations">
                      <li><strong>Schedule check-in:</strong> Conduct pulse survey on satisfaction and workload.</li>
                      <li><strong>Workload assessment:</strong> Review project assignments and overtime expectations.</li>
                      <li><strong>Development opportunity:</strong> Identify training or mentorship options.</li>
                      <li><strong>Monitor trends:</strong> Track satisfaction metrics over next quarter.</li>
                    </ul>
                  )}
                  {result.risk_level === 'Low' && (
                    <ul className="recommendations">
                      <li><strong>Retention status:</strong> Employee appears engaged and committed.</li>
                      <li><strong>Maintain engagement:</strong> Continue regular feedback and growth opportunities.</li>
                      <li><strong>Proactive development:</strong> Invest in career progression to sustain low risk.</li>
                      <li><strong>Ongoing monitoring:</strong> Quarterly re-assessment recommended.</li>
                    </ul>
                  )}
                </div>

                <div className="result-meta">
                  <span className="model-badge">
                    <Brain size={14} />
                    Model: {result.model_name}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
