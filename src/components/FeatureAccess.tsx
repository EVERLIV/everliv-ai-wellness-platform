
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, LockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureAccessProps {
  featureName: string;
  title: string;
  description?: string;
  children: ReactNode;
}

const FeatureAccess = ({ 
  featureName, 
  title,
  description,
  children 
}: FeatureAccessProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Если пользователь не авторизован, показываем предложение войти
  if (!user) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockIcon className="h-5 w-5 text-gray-400" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium">Требуется авторизация</h3>
            <p className="text-gray-500 text-center mt-2">
              Для доступа к этой функции необходимо войти в систему
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Войти
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Если пользователь авторизован, показываем контент (выбор чатов)
  return <>{children}</>;
};

export default FeatureAccess;
