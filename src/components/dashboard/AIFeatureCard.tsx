
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AIFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  isDisabled?: boolean;
  disabledText?: string;
  enabledText?: string;
}

const AIFeatureCard: React.FC<AIFeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  path,
  isDisabled = false,
  disabledText = "Требуется подписка",
  enabledText = "Перейти",
}) => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Icon className="h-8 w-8 text-everliv-600 shrink-0" />
          <div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-gray-500 mb-4 text-sm">{description}</p>
            <Link to={path}>
              <Button
                variant="outline"
                className="w-full"
                disabled={isDisabled}
              >
                {isDisabled ? disabledText : enabledText}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFeatureCard;
