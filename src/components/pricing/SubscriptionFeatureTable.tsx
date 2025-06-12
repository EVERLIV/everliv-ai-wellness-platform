
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { FEATURE_DESCRIPTIONS } from "@/constants/subscription-features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubscriptionFeatureTable = () => {
  const planTypes = ['basic', 'standard', 'premium'] as const;
  const planNames = {
    basic: 'Базовый',
    standard: 'Стандарт',
    premium: 'Премиум'
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Сравнение возможностей планов</h2>
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle className="sr-only">Сравнение планов</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Функция
                    </th>
                    {planTypes.map(planType => (
                      <th key={planType} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {planNames[planType]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(FEATURE_DESCRIPTIONS).map(([key, feature]) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-gray-500 text-xs mt-1">{feature.description}</p>
                        </div>
                      </td>
                      {planTypes.map(planType => (
                        <td key={planType} className="px-6 py-4 whitespace-nowrap text-center">
                          {feature.includedIn[planType] ? (
                            <CheckCircle className="h-5 w-5 text-evergreen-500 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SubscriptionFeatureTable;
