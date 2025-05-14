import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProtocolCard } from '@/components/services/ProtocolCard';
import { toast } from "sonner";

interface UserProtocol {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  benefits: string[];
  steps: string[];
  warnings: string[] | null;
  notes: string | null;
  completion_percentage: number;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  added_at: string;
  user_id: string;
}

const MyProtocolsPage: React.FC = () => {
  const [protocols, setProtocols] = useState<UserProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserProtocols();
    }
  }, [user]);

  const fetchUserProtocols = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_protocols')
        .select('*')
        .eq('user_id', user!.id);

      if (error) {
        console.error("Error fetching protocols:", error);
        toast("Ошибка загрузки протоколов", {
          description: error.message
        });
      }

      setProtocols(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProtocol = async (protocolId: string) => {
    try {
      const { error } = await supabase
        .from('user_protocols')
        .delete()
        .eq('id', protocolId);

      if (error) {
        console.error("Error deleting protocol:", error);
        toast("Ошибка удаления протокола", {
          description: error.message
        });
        return;
      }

      setProtocols(protocols.filter(protocol => protocol.id !== protocolId));
      toast("Протокол удален", {
        description: "Протокол успешно удален из вашего списка"
      });
    } catch (error: any) {
      console.error("Unexpected error deleting protocol:", error);
      toast("Неожиданная ошибка", {
        description: error.message || "Не удалось удалить протокол"
      });
    }
  };

  if (loading) {
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
              protocol={protocol}
              onDelete={handleDeleteProtocol}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProtocolsPage;
