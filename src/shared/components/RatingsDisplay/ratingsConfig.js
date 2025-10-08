// Rating configuration utilities
export const createTechnologyRatings = (item) => {
  if (!item) return [];

  return [
    {
      key: 'potential-benefit',
      displayName: 'Potential Benefit',
      value: item.RatingPotentialBenefitValue || 0,
      maxValue: 3,
      label: item.RatingPotentialBenefit || 'Not Rated',
      category: 'benefit',
      scaleLabels: ['Low', 'Moderate', 'High', 'Transformational'],
      icon: '?'
    },
    {
      key: 'application-scope',
      displayName: 'Application Scope',
      value: item.RatingApplicationScopeValue || 0,
      maxValue: 5,
      label: item.RatingApplicationScope || 'Not Rated',
      category: 'scope',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '?'
    },
    {
      key: 'business-model-fit',
      displayName: 'Business Model Fit',
      value: item.RatingBusinessModelFitValue || 0,
      maxValue: 5,
      label: item.RatingBusinessModelFit || 'Not Rated',
      category: 'impact',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '?'
    },
    {
      key: 'business-impact',
      displayName: 'Business Impact',
      value: item.RatingBusinessImpactValue || 0,
      maxValue: 5,
      label: item.RatingBusinessImpact || 'Not Rated',
      category: 'impact',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '?'
    },
    {
      key: 'disruptive-potential',
      displayName: 'Disruptive Potential',
      value: item.RatingDisruptivePotentialValue || 0,
      maxValue: 5,
      label: item.RatingDisruptivePotential || 'Not Rated',
      category: 'impact',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '?'
    },
    {
      key: 'internal-know-how',
      displayName: 'Internal Know-How',
      value: item.RatingInternalKnowHowValue || 0,
      maxValue: 5,
      label: item.RatingInternalKnowHow || 'Not Rated',
      category: 'scope',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '?'
    },
    {
      key: 'time-to-maturity',
      displayName: 'Time to Maturity',
      value: item.RatingTimetoMaturityValue || 0,
      maxValue: 4,
      label: item.RatingTimetoMaturity || 'Not Rated',
      category: 'time',
      scaleLabels: ['<2 years', '2-5 years', '5-10 years', '>10 years'],
      icon: '?'
    }
  ].filter(rating => rating.value !== undefined && rating.value !== null);
};

export const createTrendRatings = (item) => {
  if (!item) return [];

  return [
    {
      key: 'business-relevance-fidelidade',
      displayName: 'Business Relevance for Fidelidade',
      value: item.RatingBusinessRelevanceforFidelidadeValue || 0,
      maxValue: 5,
      label: item.RatingBusinessRelevanceforFidelidade || 'Not Rated',
      category: 'relevance',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '🏢'
    },
    {
      key: 'disruptive-potential',
      displayName: 'Disruptive Potential',
      value: item.RatingDisruptivePotentialValue || 0,
      maxValue: 5,
      label: item.RatingDisruptivePotential || 'Not Rated',
      category: 'impact',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '💥'
    },
    {
      key: 'internal-know-how',
      displayName: 'Internal Know-How',
      value: item.RatingInternalKnowHowValue || 0,
      maxValue: 5,
      label: item.RatingInternalKnowHow || 'Not Rated',
      category: 'scope',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '🧠'
    },
    {
      key: 'market-potential',
      displayName: 'Market Potential',
      value: item.RatingMarketPotentialValue || 0,
      maxValue: 5,
      label: item.RatingMarketPotential || 'Not Rated',
      category: 'impact',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '📈'
    },
    {
      key: 'need-for-action',
      displayName: 'Need for Action',
      value: item.RatingNeedforActionValue || 0,
      maxValue: 5,
      label: item.RatingNeedforAction || 'Not Rated',
      category: 'urgency',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '⚡'
    },
    {
      key: 'strategic-fit',
      displayName: 'Strategic Fit',
      value: item.RatingStrategicFitValue || 0,
      maxValue: 5,
      label: item.RatingStrategicFit || 'Not Rated',
      category: 'strategy',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '🎯'
    },
    {
      key: 'time-to-market-impact',
      displayName: 'Time to Market Impact',
      value: item.RatingTimetoMarketImpactValue || 0,
      maxValue: 5,
      label: item.RatingTimetoMarketImpact || 'Not Rated',
      category: 'time',
      scaleLabels: ['0–2 years', '3–5 years', '6–10 years', '11–15 years', '15+ years'],
      icon: '⏰'
    }
  ].filter(rating => rating.value !== undefined && rating.value !== null);
};