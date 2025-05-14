import React, { useState, useEffect } from 'react';
// Remove or comment out these imports if not needed
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PageBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [steps, setSteps] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (id && id !== 'new') {
      fetchProtocol(id);
    }
  }, [id]);

  const fetchProtocol = async (protocolId: string) => {
    try {
      const { data, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('id', protocolId)
        .single();

      if (error) {
        console.error("Error fetching protocol:", error);
        toast("Ошибка загрузки протокола", {
          description: error.message
        });
        return;
      }

      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setDuration(data.duration);
        setDifficulty(data.difficulty);
        setSteps(data.steps);
        setBenefits(data.benefits);
        setWarnings(data.warnings || []);
      }
    } catch (error: any) {
      console.error("Unexpected error fetching protocol:", error);
      toast("Неожиданная ошибка", {
        description: error.message || "Не удалось загрузить протокол"
      });
    }
  };

  const saveProtocol = async () => {
    if (!user) {
      toast("Требуется авторизация", {
        description: "Для сохранения протокола необходимо войти в систему"
      });
      return;
    }

    try {
      const protocolData = {
        title,
        description,
        category,
        duration,
        difficulty,
        steps,
        benefits,
        warnings: warnings || [],
        user_id: user.id
      };

      let res;

      if (id && id !== 'new') {
        res = await supabase
          .from('protocols')
          .update(protocolData)
          .eq('id', id);
      } else {
        res = await supabase
          .from('protocols')
          .insert(protocolData);
      }

      const { error } = res;

      if (error) {
        console.error("Error saving protocol:", error);
        toast("Ошибка сохранения протокола", {
          description: error.message
        });
        return;
      }

      toast("Протокол сохранен", {
        description: "Протокол успешно сохранен"
      });
    } catch (error: any) {
      console.error("Unexpected error saving protocol:", error);
      toast("Неожиданная ошибка", {
        description: error.message || "Не удалось сохранить протокол"
      });
    }
  };

  return (
    <div>
      <h1>Page Builder</h1>
      {/* Form elements will go here */}
      <button onClick={saveProtocol}>Save Protocol</button>
    </div>
  );
};

export default PageBuilder;
