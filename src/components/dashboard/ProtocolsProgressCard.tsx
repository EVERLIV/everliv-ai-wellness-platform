
import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Protocol {
  name: string;
  progress: number;
  days: string;
}

interface ProtocolsProgressCardProps {
  protocols: Protocol[];
}

const ProtocolsProgressCard = ({ protocols }: ProtocolsProgressCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Мои протоколы
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {protocols.map((protocol, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{protocol.name}</span>
                <span className="text-blue-600">{protocol.progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${protocol.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">{protocol.days}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Link to="/my-protocols">
            <Button variant="outline" size="sm">
              Все протоколы
            </Button>
          </Link>
          <Link to="/protocol-tracking">
            <Button size="sm">
              Отслеживание
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProtocolsProgressCard;
