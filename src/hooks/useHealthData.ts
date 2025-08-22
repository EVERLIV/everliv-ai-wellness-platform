import { useState, useEffect } from 'react';

// Health status type based on EVA design system
export type HealthStatus = 'critical' | 'warning' | 'normal' | 'optimal';

// Health metric interface
export interface HealthMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  status: HealthStatus;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    period?: string;
  };
  range?: {
    min: number;
    max: number;
    optimal?: [number, number];
  };
}

// Health colors hook
export const useHealthColors = () => {
  const getStatusColor = (status: HealthStatus) => {
    const colors = {
      critical: 'hsl(var(--eva-critical))',
      warning: 'hsl(var(--eva-warning))',
      normal: 'hsl(var(--eva-normal))',
      optimal: 'hsl(var(--eva-optimal))',
    };
    return colors[status];
  };

  const getStatusClass = (status: HealthStatus, prefix = 'text') => {
    const classes = {
      critical: `${prefix}-eva-critical`,
      warning: `${prefix}-eva-warning`,
      normal: `${prefix}-eva-normal`,
      optimal: `${prefix}-eva-optimal`,
    };
    return classes[status];
  };

  const getStatusBackground = (status: HealthStatus) => {
    const backgrounds = {
      critical: 'bg-eva-critical/10',
      warning: 'bg-eva-warning/10',
      normal: 'bg-eva-normal/10',
      optimal: 'bg-eva-optimal/10',
    };
    return backgrounds[status];
  };

  return {
    getStatusColor,
    getStatusClass,
    getStatusBackground,
  };
};

// Format health values
export const formatHealthValue = (value: number, unit?: string, decimals = 1): string => {
  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return unit ? `${formatted} ${unit}` : formatted;
};

// Determine health status based on value and ranges
export const getHealthStatus = (
  value: number,
  range: { min: number; max: number; optimal?: [number, number] }
): HealthStatus => {
  const { min, max, optimal } = range;
  
  // Check if in optimal range
  if (optimal && value >= optimal[0] && value <= optimal[1]) {
    return 'optimal';
  }
  
  // Check if in normal range
  if (value >= min && value <= max) {
    return 'normal';
  }
  
  // Check if critically out of range
  const criticalThreshold = 0.2; // 20% outside normal range
  const rangeSize = max - min;
  
  if (value < min - rangeSize * criticalThreshold || value > max + rangeSize * criticalThreshold) {
    return 'critical';
  }
  
  // Otherwise it's a warning
  return 'warning';
};

// Mock health data hook
export const useHealthData = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockData: HealthMetric[] = [
      {
        id: 'heart-rate',
        title: 'Пульс',
        value: 72,
        unit: 'уд/мин',
        status: 'normal',
        change: { value: 2, trend: 'up', period: 'неделя' },
        range: { min: 60, max: 100, optimal: [65, 85] },
      },
      {
        id: 'blood-pressure',
        title: 'Давление',
        value: '120/80',
        unit: 'мм рт.ст.',
        status: 'optimal',
        change: { value: 3, trend: 'down', period: 'месяц' },
      },
      {
        id: 'weight',
        title: 'Вес',
        value: 68.5,
        unit: 'кг',
        status: 'normal',
        change: { value: 1.2, trend: 'down', period: 'неделя' },
        range: { min: 60, max: 75, optimal: [65, 70] },
      },
      {
        id: 'sleep',
        title: 'Сон',
        value: 7.5,
        unit: 'часов',
        status: 'optimal',
        change: { value: 0.5, trend: 'up', period: 'неделя' },
        range: { min: 6, max: 9, optimal: [7, 8.5] },
      },
      {
        id: 'steps',
        title: 'Шаги',
        value: 8432,
        unit: 'шагов',
        status: 'normal',
        change: { value: 12, trend: 'up', period: 'вчера' },
        range: { min: 5000, max: 15000, optimal: [8000, 12000] },
      },
      {
        id: 'water',
        title: 'Вода',
        value: 1.8,
        unit: 'л',
        status: 'warning',
        change: { value: 5, trend: 'down', period: 'вчера' },
        range: { min: 1.5, max: 3, optimal: [2, 2.5] },
      },
    ];

    setTimeout(() => {
      setMetrics(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const updateMetric = (id: string, updates: Partial<HealthMetric>) => {
    setMetrics(prev => 
      prev.map(metric => 
        metric.id === id ? { ...metric, ...updates } : metric
      )
    );
  };

  const getMetricById = (id: string) => {
    return metrics.find(metric => metric.id === id);
  };

  const getMetricsByStatus = (status: HealthStatus) => {
    return metrics.filter(metric => metric.status === status);
  };

  return {
    metrics,
    loading,
    updateMetric,
    getMetricById,
    getMetricsByStatus,
  };
};
