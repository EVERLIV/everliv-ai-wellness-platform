
import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { AdminSubscriptionPlan, PlanFeatureDetail } from "@/services/admin-service";

interface PlanEditorProps {
  plan: AdminSubscriptionPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (plan: Partial<AdminSubscriptionPlan>) => void;
  isNew?: boolean;
}

const PlanEditor = ({ plan, open, onOpenChange, onSave, isNew = false }: PlanEditorProps) => {
  const [formData, setFormData] = useState<Partial<AdminSubscriptionPlan>>({
    name: "",
    type: "basic",
    price: 0,
    description: "",
    features: [],
    is_active: true,
    is_popular: false
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        type: plan.type,
        price: plan.price,
        description: plan.description,
        features: [...plan.features], // Create a copy to avoid mutating props
        is_active: plan.is_active,
        is_popular: plan.is_popular
      });
    } else {
      // Reset form for new plan
      setFormData({
        name: "",
        type: "basic",
        price: 0,
        description: "",
        features: [],
        is_active: true,
        is_popular: false
      });
    }
  }, [plan, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      const numValue = parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), { name: "", description: "" }]
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index: number, field: keyof PlanFeatureDetail, value: string) => {
    setFormData(prev => {
      const features = [...(prev.features || [])];
      features[index] = { ...features[index], [field]: value };
      return { ...prev, features };
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const isFormValid = () => {
    return (
      formData.name?.trim() !== "" && 
      formData.type?.trim() !== "" && 
      formData.description?.trim() !== "" &&
      (formData.features || []).every(f => f.name.trim() !== "")
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "Создание нового тарифа" : "Редактирование тарифа"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название тарифа</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="Например: Премиум"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Тип тарифа</Label>
              <Input 
                id="type"
                name="type"
                value={formData.type || ""}
                onChange={handleInputChange}
                placeholder="basic, standard, premium"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Стоимость (₽)</Label>
              <Input 
                id="price"
                name="price"
                type="number"
                value={formData.price || 0}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center justify-end space-x-5 mt-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  checked={formData.is_active} 
                  onCheckedChange={(checked) => handleSwitchChange("is_active", checked)} 
                />
                <Label htmlFor="is_active">Активный</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_popular" 
                  checked={formData.is_popular} 
                  onCheckedChange={(checked) => handleSwitchChange("is_popular", checked)} 
                />
                <Label htmlFor="is_popular">Популярный</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Краткое описание тарифного плана"
              rows={3}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Особенности и преимущества</Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={handleAddFeature}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Добавить
              </Button>
            </div>
            
            {(formData.features || []).map((feature, index) => (
              <div key={index} className="grid grid-cols-[1fr_auto] gap-2 items-start">
                <div className="grid grid-cols-1 gap-2">
                  <Input 
                    placeholder="Название особенности"
                    value={feature.name}
                    onChange={(e) => handleFeatureChange(index, "name", e.target.value)}
                  />
                  <Input 
                    placeholder="Описание особенности (необязательно)"
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveFeature(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid()}>
            {isNew ? "Создать" : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanEditor;
