
import React, { useState } from "react";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Activity, 
  Brain, 
  Apple, 
  Moon, 
  Stethoscope
} from "lucide-react";
import PersonalInfoSection from "@/components/health-profile/PersonalInfoSection";
import PhysicalHealthSection from "@/components/health-profile/PhysicalHealthSection";
import MentalHealthSection from "@/components/health-profile/MentalHealthSection";
import LifestyleSection from "@/components/health-profile/LifestyleSection";
import SleepSection from "@/components/health-profile/SleepSection";
import MedicalHistorySection from "@/components/health-profile/MedicalHistorySection";
import HealthProfileHeader from "@/components/health-profile/HealthProfileHeader";
import SectionNavigation from "@/components/health-profile/SectionNavigation";
import NavigationControls from "@/components/health-profile/NavigationControls";
import { useHealthProfile } from "@/hooks/useHealthProfile";

const HealthProfile: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const { healthProfile, isLoading, updateHealthProfile, saveHealthProfile } = useHealthProfile();

  const sections = [
    { 
      title: "Личная информация", 
      icon: Heart, 
      component: PersonalInfoSection 
    },
    { 
      title: "Физическое здоровье", 
      icon: Activity, 
      component: PhysicalHealthSection 
    },
    { 
      title: "Психическое здоровье", 
      icon: Brain, 
      component: MentalHealthSection 
    },
    { 
      title: "Образ жизни", 
      icon: Apple, 
      component: LifestyleSection 
    },
    { 
      title: "Сон", 
      icon: Moon, 
      component: SleepSection 
    },
    { 
      title: "Медицинская история", 
      icon: Stethoscope, 
      component: MedicalHistorySection 
    }
  ];

  const CurrentSectionComponent = sections[currentSection].component;
  const CurrentIcon = sections[currentSection].icon;

  const handlePrevious = () => {
    setCurrentSection(Math.max(0, currentSection - 1));
  };

  const handleNext = () => {
    setCurrentSection(Math.min(sections.length - 1, currentSection + 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <div className="pt-16 flex-grow">
        <HealthProfileHeader
          currentSection={currentSection}
          totalSections={sections.length}
          currentSectionTitle={sections[currentSection].title}
          CurrentIcon={CurrentIcon}
        />

        {/* Content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CurrentIcon className="h-5 w-5 text-blue-600" />
                {sections[currentSection].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CurrentSectionComponent 
                data={healthProfile}
                onChange={updateHealthProfile}
              />
            </CardContent>
          </Card>

          <NavigationControls
            currentSection={currentSection}
            totalSections={sections.length}
            isLoading={isLoading}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSave={saveHealthProfile}
          />

          <SectionNavigation
            sections={sections}
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
          />
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default HealthProfile;
