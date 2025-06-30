
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
  }>;
  instructions: string[];
  cooking_time: number;
  difficulty: string;
  category: string;
  nutrition_info?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  source_foods: string[];
}

export const useRecipes = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  const generateRecipes = async (foods: any[]) => {
    if (!foods || foods.length === 0) {
      toast.error('Нет продуктов для генерации рецептов');
      return [];
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: { foods }
      });

      if (error) {
        console.error('Error generating recipes:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Ошибка генерации рецептов');
      }

      toast.success('Рецепты успешно сгенерированы!');
      return data.recipes;
    } catch (error) {
      console.error('Error generating recipes:', error);
      toast.error('Ошибка при генерации рецептов');
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return false;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_recipes')
        .insert({
          user_id: user.id,
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          nutrition_info: recipe.nutrition_info,
          cooking_time: recipe.cooking_time,
          difficulty: recipe.difficulty,
          category: recipe.category,
          source_foods: recipe.source_foods
        });

      if (error) {
        console.error('Error saving recipe:', error);
        throw error;
      }

      toast.success('Рецепт сохранен в "Мои рецепты"!');
      await fetchUserRecipes(); // Обновляем список рецептов
      return true;
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Ошибка при сохранении рецепта');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const fetchUserRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

      setUserRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Ошибка при загрузке рецептов');
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting recipe:', error);
        throw error;
      }

      toast.success('Рецепт удален');
      await fetchUserRecipes();
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Ошибка при удалении рецепта');
      return false;
    }
  };

  return {
    generateRecipes,
    saveRecipe,
    fetchUserRecipes,
    deleteRecipe,
    userRecipes,
    isGenerating,
    isSaving
  };
};
