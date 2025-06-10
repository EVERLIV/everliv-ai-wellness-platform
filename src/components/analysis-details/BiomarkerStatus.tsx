
import React from "react";
import { CheckCircle, AlertTriangle, Minus } from "lucide-react";

interface BiomarkerStatusProps {
  status: string;
}

const BiomarkerStatus: React.FC<BiomarkerStatusProps> = ({ status }) => {
  console.log('BiomarkerStatus component rendering with status:', status);
  
  const getStatusColor = (status: string) => {
    console.log('Определяем цвет для статуса:', status);
    switch (status) {
      case 'optimal':
      case 'normal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'attention':
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'risk':
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    console.log('Определяем текст для статуса:', status);
    switch (status) {
      case 'optimal':
        return 'Оптимально';
      case 'normal':
        return 'Норма';
      case 'good':
        return 'Хорошо';
      case 'attention':
        return 'Внимание';
      case 'low':
        return 'Ниже нормы';
      case 'risk':
        return 'Риск';
      case 'high':
        return 'Выше нормы';
      default:
        return 'Требует оценки';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'normal':
      case 'good':
        return <CheckCircle className="h-3 w-3" />;
      case 'attention':
      case 'low':
      case 'risk':
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);
  const statusIcon = getStatusIcon(status);

  console.log('Final status display:', { status, statusColor, statusText });

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColor} print:px-1 print:py-0`}>
      {statusIcon}
      <span className="ml-1 print:text-xs">{statusText}</span>
    </div>
  );
};

export default BiomarkerStatus;
