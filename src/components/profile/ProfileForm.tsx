
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfileData } from "@/hooks/useProfile";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  first_name: z.string().min(1, "Имя обязательно"),
  last_name: z.string().min(1, "Фамилия обязательна"),
  date_of_birth: z.date().optional().nullable(),
  gender: z.enum(["male", "female", "other", ""]).optional().nullable(),
  height: z.number().min(50).max(250).optional().nullable(),
  weight: z.number().min(30).max(300).optional().nullable(),
  medical_conditions: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medications: z.string().optional().nullable(),
  goals: z.string().optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profileData: ProfileData | null;
  isLoading: boolean;
  isUpdating: boolean;
  onUpdateProfile: (data: Partial<Omit<ProfileData, 'id'>>) => Promise<boolean>;
}

const ProfileForm = ({ profileData, isLoading, isUpdating, onUpdateProfile }: ProfileFormProps) => {
  const [dateValue, setDateValue] = useState<Date | null>(
    profileData?.date_of_birth ? new Date(profileData.date_of_birth) : null
  );

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      gender: profileData?.gender as any || "",
      height: profileData?.height || null,
      weight: profileData?.weight || null,
      medical_conditions: profileData?.medical_conditions ? profileData.medical_conditions.join(", ") : "",
      allergies: profileData?.allergies ? profileData.allergies.join(", ") : "",
      medications: profileData?.medications ? profileData.medications.join(", ") : "",
      goals: profileData?.goals ? profileData.goals.join(", ") : "",
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    // Convert comma-separated strings to arrays
    const processedData = {
      ...data,
      date_of_birth: dateValue ? dateValue.toISOString().split('T')[0] : null,
      medical_conditions: data.medical_conditions ? data.medical_conditions.split(",").map(item => item.trim()) : [],
      allergies: data.allergies ? data.allergies.split(",").map(item => item.trim()) : [],
      medications: data.medications ? data.medications.split(",").map(item => item.trim()) : [],
      goals: data.goals ? data.goals.split(",").map(item => item.trim()) : [],
    };
    
    await onUpdateProfile(processedData);
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Загрузка профиля...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Основная информация</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="first_name">Имя</Label>
              <Input id="first_name" {...register("first_name")} className="mt-1" />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="last_name">Фамилия</Label>
              <Input id="last_name" {...register("last_name")} className="mt-1" />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
            </div>
            
            <div>
              <Label>Дата рождения</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !dateValue && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateValue ? format(dateValue, "dd.MM.yyyy") : "Выберите дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(date) => {
                      setDateValue(date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label>Пол</Label>
              <RadioGroup 
                defaultValue={profileData?.gender || ""} 
                className="flex gap-4 mt-2"
                onValueChange={(value) => setValue("gender", value as any)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Мужской</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Женский</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Другое</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Физические параметры</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="height">Рост (см)</Label>
              <Input
                id="height"
                type="number"
                {...register("height", { valueAsNumber: true })}
                placeholder="175"
                className="mt-1"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="weight">Вес (кг)</Label>
              <Input
                id="weight"
                type="number"
                {...register("weight", { valueAsNumber: true })}
                placeholder="70"
                className="mt-1"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Медицинская информация</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="medical_conditions">Хронические заболевания</Label>
              <Textarea
                id="medical_conditions"
                {...register("medical_conditions")}
                placeholder="Укажите через запятую"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="allergies">Аллергии</Label>
              <Textarea
                id="allergies"
                {...register("allergies")}
                placeholder="Укажите через запятую"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="medications">Принимаемые медикаменты</Label>
              <Textarea
                id="medications"
                {...register("medications")}
                placeholder="Укажите через запятую"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Цели</h3>
          
          <div>
            <Label htmlFor="goals">Цели для здоровья</Label>
            <Textarea
              id="goals"
              {...register("goals")}
              placeholder="Укажите через запятую"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
