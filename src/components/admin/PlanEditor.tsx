
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanFeatureDetail, SubscriptionPlan } from "@/services/admin-service";
import { Plus, X, Save } from "lucide-react";

interface PlanEditorProps {
  plan: Partial<SubscriptionPlan> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (plan: Partial<SubscriptionPlan>) => Promise<void>;
  isNew?: boolean;
}

const DEFAULT_PLAN: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'> = {
  name: "",
  type: "basic",
  price: 0,
  description: "",
  features: [],
  is_popular: false,
  is_active: true
};

const PlanEditor: React.FC<PlanEditorProps> = ({ 
  plan, 
  open, 
  onOpenChange, 
  onSave,
  isNew = false 
}) => {
  const [editedPlan, setEditedPlan] = useState<Partial<SubscriptionPlan>>(DEFAULT_PLAN);
  const [newFeature, setNewFeature] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (plan) {
      setEditedPlan(plan);
    } else {
      setEditedPlan(DEFAULT_PLAN);
    }
  }, [plan]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "price") {
      setEditedPlan({ ...editedPlan, [name]: parseInt(value) || 0 });
    } else {
      setEditedPlan({ ...editedPlan, [name]: value });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setEditedPlan({ ...editedPlan, [name]: checked });
  };

  const handleAddFeature = () => {
    if (!newFeature.name) return;
    
    const updatedFeatures = [...(editedPlan.features || []), newFeature];
    setEditedPlan({ ...editedPlan, features: updatedFeatures });
    setNewFeature({ name: "", description: "" });
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...(editedPlan.features || [])];
    updatedFeatures.splice(index, 1);
    setEditedPlan({ ...editedPlan, features: updatedFeatures });
  };

  const handleNewFeatureChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFeature({ ...newFeature, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave(editedPlan);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isNew ? "Создать новый тариф" : "Редактировать тариф"}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Основная информация</TabsTrigger>
            <TabsTrigger value="features">Особенности</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название тарифа</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={editedPlan.name || ""} 
                  onChange={handleInputChange} 
                  placeholder="Например: Базовый"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Тип тарифа</Label>
                <select 
                  id="type" 
                  name="type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                  value={editedPlan.type || "basic"}
                  onChange={(e) => setEditedPlan({ ...editedPlan, type: e.target.value })}
                >
                  <option value="basic">Базовый</option>
                  <option value="standard">Стандартный</option>
                  <option value="premium">Премиум</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽)</Label>
              <Input 
                id="price" 
                name="price"
                type="number"
                value={editedPlan.price || 0} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea 
                id="description" 
                name="description"
                value={editedPlan.description || ""} 
                onChange={handleInputChange} 
                placeholder="Краткое описание тарифа"
                className="h-20"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_popular" 
                  name="is_popular"
                  checked={editedPlan.is_popular || false}
                  onCheckedChange={(checked) => handleSwitchChange("is_popular", checked)} 
                />
                <Label htmlFor="is_popular">Популярный выбор</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  name="is_active"
                  checked={editedPlan.is_active !== false} 
                  onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                />
                <Label htmlFor="is_active">Активный</Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Особенности тарифа</h3>
              
              <div className="space-y-4 mb-6">
                {(editedPlan.features || []).map((feature, index) => (
                  <div key={index} className="flex gap-2 items-start border-b pb-3">
                    <div className="flex-grow">
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-gray-500">{feature.description}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 h-8 w-8 p-0"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <div className="space-y-2 mb-2">
                  <Label htmlFor="feature-name">Название особенности</Label>
                  <Input 
                    id="feature-name" 
                    name="name"
                    value={newFeature.name} 
                    onChange={handleNewFeatureChange} 
                    placeholder="Например: Доступ к премиум контенту"
                  />
                </div>
                <div className="space-y-2 mb-3">
                  <Label htmlFor="feature-description">Описание (опционально)</Label>
                  <Input 
                    id="feature-description" 
                    name="description"
                    value={newFeature.description} 
                    onChange={handleNewFeatureChange} 
                    placeholder="Краткое описание особенности"
                  />
                </div>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleAddFeature}
                  disabled={!newFeature.name}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Добавить особенность
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !editedPlan.name || editedPlan.price === undefined}
          >
            <Save className="h-4 w-4 mr-1" />
            {isNew ? "Создать" : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanEditor;
