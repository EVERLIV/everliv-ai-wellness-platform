
import { CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PLAN_FEATURES } from "@/constants/subscription-features";

const PricingFeaturesTable = () => {
  const planFeaturesList = Object.values(PLAN_FEATURES);
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Сравнение тарифных планов</h2>
            <p className="text-gray-600">
              Подробное сравнение возможностей, доступных на разных тарифах
            </p>
          </div>
          
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Функция</TableHead>
                  <TableHead className="text-center">Базовый</TableHead>
                  <TableHead className="text-center">Стандарт</TableHead>
                  <TableHead className="text-center">Премиум</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planFeaturesList.map((feature, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {feature.name}
                      <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.includedIn.basic ? (
                        <CheckCircle className="h-5 w-5 text-evergreen-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.includedIn.standard ? (
                        <CheckCircle className="h-5 w-5 text-evergreen-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.includedIn.premium ? (
                        <CheckCircle className="h-5 w-5 text-evergreen-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingFeaturesTable;
