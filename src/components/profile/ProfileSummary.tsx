
import { ProfileData } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileSummaryProps {
  profileData: ProfileData | null;
  isLoading: boolean;
}

const ProfileSummary = ({ profileData, isLoading }: ProfileSummaryProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-content">Загрузка...</div>
      </div>
    );
  }

  const getInitials = () => {
    const firstName = profileData?.first_name || '';
    const lastName = profileData?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const calculateAge = () => {
    if (!profileData?.date_of_birth) return null;
    
    const birthDate = new Date(profileData.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const getGenderText = () => {
    switch (profileData?.gender) {
      case 'male': return 'Мужской';
      case 'female': return 'Женский';
      case 'other': return 'Другой';
      default: return 'Не указан';
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="card-content-padding">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-4 text-center md:text-left flex-1">
            <h2 className="heading-responsive-lg">
              {profileData?.first_name || ''} {profileData?.last_name || ''}
            </h2>
            
            <div className="responsive-grid-4">
              <div className="stats-item">
                <div className="text-sm text-gray-500 mb-1">Возраст</div>
                <div className="info-value">{calculateAge() || 'Не указан'}</div>
              </div>
              
              <div className="stats-item">
                <div className="text-sm text-gray-500 mb-1">Пол</div>
                <div className="info-value">{getGenderText()}</div>
              </div>
              
              <div className="stats-item">
                <div className="text-sm text-gray-500 mb-1">Рост</div>
                <div className="info-value">{profileData?.height ? `${profileData.height} см` : 'Не указан'}</div>
              </div>
              
              <div className="stats-item">
                <div className="text-sm text-gray-500 mb-1">Вес</div>
                <div className="info-value">{profileData?.weight ? `${profileData.weight} кг` : 'Не указан'}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
