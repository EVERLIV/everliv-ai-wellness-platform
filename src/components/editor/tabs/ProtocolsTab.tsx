
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProtocols } from '@/hooks/useProtocols';

const ProtocolsTab: React.FC = () => {
  const { protocols, isLoading, error, deleteProtocol } = useProtocols();
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Список протоколов</h2>
        <Button>Создать протокол</Button>
      </div>
      
      {isLoading ? (
        <p>Загрузка протоколов...</p>
      ) : protocols.length === 0 ? (
        <p>Протоколы не найдены</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {protocols.map(protocol => (
            <div key={protocol.id} className="border p-4 rounded-md">
              <h3 className="font-semibold">{protocol.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{protocol.category}</p>
              <p className="text-sm mb-4">{protocol.description}</p>
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  Редактировать
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteProtocol(protocol.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProtocolsTab;
