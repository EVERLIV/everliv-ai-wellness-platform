
import React from "react";
import { FileBarChart, FileText, Upload } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";
import { Link } from "react-router-dom";

const AnalysisHistoryCard = () => {
  const { canUseFeature, subscription, recordFeatureTrial } = useSubscription();
  const canAnalyzeBlood = canUseFeature(FEATURES.BLOOD_ANALYSIS);

  const handleUploadClick = () => {
    if (!subscription && canUseFeature(FEATURES.BLOOD_ANALYSIS)) {
      // Record feature trial usage if this is a free trial (no subscription)
      recordFeatureTrial(FEATURES.BLOOD_ANALYSIS);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <FileBarChart className="h-5 w-5 mr-2 text-everliv-600" />
          Ваши Анализы
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-10 w-10 mx-auto text-gray-300 mb-2" />
          <p>У вас пока нет загруженных анализов</p>
          {canAnalyzeBlood ? (
            <Link to="/lab-analyses">
              <Button 
                size="sm" 
                className="mt-4 flex items-center gap-2"
                onClick={handleUploadClick}
              >
                <Upload className="h-4 w-4" />
                Загрузить результаты
              </Button>
            </Link>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-amber-600 mb-2">
                Требуется подписка для доступа к анализу крови
              </p>
              <Link to="/dashboard/subscription">
                <Button variant="outline" size="sm" className="border-everliv-600 text-everliv-600 hover:bg-everliv-50">
                  Активировать подписку
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisHistoryCard;
