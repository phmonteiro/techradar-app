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

  // Trends will have different rating fields - adjust these as needed
  return [
    {
      key: 'trend-impact',
      displayName: 'Trend Impact',
      value: item.RatingTrendImpactValue || 0,
      maxValue: 5,
      label: item.RatingTrendImpact || 'Not Rated',
      category: 'impact',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '?'
    },
    {
      key: 'trend-certainty',
      displayName: 'Trend Certainty',
      value: item.RatingTrendCertaintyValue || 0,
      maxValue: 5,
      label: item.RatingTrendCertainty || 'Not Rated',
      category: 'scope',
      scaleLabels: ['None', 'Very Low', 'Low', 'Medium', 'High', 'Very High'],
      icon: '?'
    },
    // Add more trend-specific ratings as needed
  ].filter(rating => rating.value !== undefined && rating.value !== null);
};