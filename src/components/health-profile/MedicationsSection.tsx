
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Plus, X } from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";

interface MedicationsSectionProps {
  data: HealthProfileData;
  onChange: (updates: Partial<HealthProfileData>) => void;
}

const MedicationsSection: React.FC<MedicationsSectionProps> = ({ data, onChange }) => {
  const [customMedication, setCustomMedication] = useState("");

  const commonMedications = [
    { key: 'aspirin', label: 'Аспирин (кардиомагнил)' },
    { key: 'metformin', label: 'Метформин' },
    { key: 'statins', label: 'Статины (аторвастатин, розувастатин)' },
    { key: 'ace_inhibitors', label: 'Ингибиторы АПФ (лизиноприл, эналаприл)' },
    { key: 'beta_blockers', label: 'Бета-блокаторы (бисопролол, метопролол)' },
    { key: 'calcium_blockers', label: 'Блокаторы кальциевых каналов (амлодипин)' },
    { key: 'diuretics', label: 'Диуретики (индапамид, гидрохлортиазид)' },
    { key: 'ppi', label: 'Ингибиторы протонной помпы (омепразол, пантопразол)' },
    { key: 'thyroid_hormones', label: 'Гормоны щитовидной железы (L-тироксин)' },
    { key: 'insulin', label: 'Инсулин' },
    { key: 'warfarin', label: 'Варфарин' },
    { key: 'direct_anticoagulants', label: 'Прямые антикоагулянты (ривароксабан, апиксабан)' },
    { key: 'antidepressants', label: 'Антидепрессанты' },
    { key: 'nsaids', label: 'НПВС (ибупрофен, диклофенак)' },
    { key: 'contraceptives', label: 'Оральные контрацептивы' },
    { key: 'vitamin_d', label: 'Витамин D' },
    { key: 'b12', label: 'Витамин B12' },
    { key: 'omega3', label: 'Омега-3' },
    { key: 'magnesium', label: 'Магний' },
    { key: 'probiotics', label: 'Пробиотики' }
  ];

  const handleMedicationChange = (medication: string, checked: boolean) => {
    const currentMedications = data.medications || [];
    let newMedications;
    
    if (checked) {
      newMedications = [...currentMedications, medication];
    } else {
      newMedications = currentMedications.filter((m: string) => m !== medication);
    }
    
    onChange({ medications: newMedications });
  };

  const handleAddCustomMedication = () => {
    if (customMedication.trim()) {
      const currentMedications = data.medications || [];
      const newMedications = [...currentMedications, customMedication.trim()];
      onChange({ medications: newMedications });
      setCustomMedication("");
    }
  };

  const handleRemoveCustomMedication = (medicationToRemove: string) => {
    const currentMedications = data.medications || [];
    const newMedications = currentMedications.filter((m: string) => m !== medicationToRemove);
    onChange({ medications: newMedications });
  };

  const isCommonMedication = (medication: string) => {
    return commonMedications.some(med => med.key === medication);
  };

  const customMedications = (data.medications || []).filter(med => !isCommonMedication(med));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Принимаемые лекарства
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Список распространенных лекарств */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Выберите принимаемые лекарства</Label>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {commonMedications.map((medication) => (
              <div key={medication.key} className="flex items-center space-x-2">
                <Checkbox
                  id={medication.key}
                  checked={(data.medications || []).includes(medication.key)}
                  onCheckedChange={(checked) => handleMedicationChange(medication.key, !!checked)}
                />
                <Label htmlFor={medication.key} className="text-sm cursor-pointer">
                  {medication.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Добавление собственных лекарств */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Добавить другое лекарство</Label>
          <div className="flex gap-2">
            <Input
              value={customMedication}
              onChange={(e) => setCustomMedication(e.target.value)}
              placeholder="Введите название лекарства"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomMedication();
                }
              }}
            />
            <Button 
              type="button"
              onClick={handleAddCustomMedication}
              disabled={!customMedication.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Список добавленных пользовательских лекарств */}
        {customMedications.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Добавленные лекарства</Label>
            <div className="space-y-2">
              {customMedications.map((medication, index) => (
                <div key={`custom-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm">{medication}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCustomMedication(medication)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Информационное сообщение */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            💡 <strong>Важно:</strong> Укажите все регулярно принимаемые лекарства для точной аналитики здоровья. 
            Эта информация поможет ИИ учесть возможные взаимодействия и дать более персональные рекомендации.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationsSection;
