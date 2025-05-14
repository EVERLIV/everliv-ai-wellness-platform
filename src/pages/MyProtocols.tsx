
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useProtocols } from '@/hooks/useProtocols';
import ProtocolCard from '@/components/services/ProtocolCard';
import { toast } from "sonner";

const MyProtocolsPage: React.FC = () => {
  const { protocols, isLoading, deleteProtocol } = useProtocols();

  const handleDeleteProtocol = async (protocolId: string) => {
    await deleteProtocol(protocolId);
  };

  if (isLoading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Мои протоколы</h1>
          <Link to="/page-builder/new">
            <Button><PlusCircle className="mr-2 h-4 w-4"/> Добавить новый протокол</Button>
          </Link>
      </div>
      {protocols.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">У вас пока нет добавленных протоколов.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols.map(protocol => (
            <ProtocolCard
              key={protocol.id}
              id={protocol.id}
              title={protocol.title}
              description={protocol.description}
              category={protocol.category}
              duration={protocol.duration}
              difficulty={protocol.difficulty as 'beginner' | 'intermediate' | 'advanced'}
              steps={protocol.steps}
              benefits={protocol.benefits}
              warnings={protocol.warnings || []}
              onDelete={handleDeleteProtocol}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProtocolsPage;
