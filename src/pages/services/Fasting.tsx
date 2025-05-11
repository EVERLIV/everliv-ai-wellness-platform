
import React from 'react';
import { FlaskRound, Activity, Heart, Brain } from 'lucide-react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import ProtocolCard from '@/components/services/ProtocolCard';
import ScientificExplanation from '@/components/services/ScientificExplanation';

const Fasting = () => {
  // Mock data for fasting therapy page
  const hero = {
    title: 'Голодание',
    subtitle: 'Активация аутофагии и улучшение метаболического здоровья',
    description: 'Периодическое голодание – мощный инструмент оздоровления, который запускает процессы клеточного самоочищения, нормализует метаболизм и улучшает чувствительность к инсулину. Наши протоколы основаны на клинических исследованиях и адаптированы для безопасного применения.'
  };

  const benefits = [
    {
      title: 'Активация аутофагии',
      description: 'Запуск процесса клеточного "самопоедания", очищающего организм от старых и дисфункциональных компонентов',
      icon: <FlaskRound className="h-8 w-8" />
    },
    {
      title: 'Улучшение метаболизма',
      description: 'Повышение чувствительности к инсулину, нормализация уровня глюкозы и улучшение липидного профиля',
      icon: <Activity className="h-8 w-8" />
    },
    {
      title: 'Периодическое голодание',
      description: 'Различные режимы ограничения времени приема пищи для достижения метаболической гибкости',
      icon: <Heart className="h-8 w-8" />
    },
    {
      title: 'Ограничение калорий',
      description: 'Практика умеренного снижения калорийности рациона без недоедания для долгосрочных эффектов',
      icon: <Brain className="h-8 w-8" />
    }
  ];

  // Placeholder content for other sections - these would be expanded in a full implementation
  const scientificBackground = (
    <ScientificExplanation
      summary="Периодическое голодание и ограничение калорий активируют множество защитных механизмов в организме. Современные исследования показывают, что эти практики запускают процессы аутофагии, улучшают митохондриальную функцию и повышают стрессоустойчивость клеток."
      mechanisms={[
        {
          title: "Аутофагия и клеточное обновление",
          description: (
            <p>Голодание запускает процесс аутофагии - механизм клеточного "самопоедания", при котором клетка перерабатывает старые, поврежденные органеллы и белки. Этот процесс критически важен для поддержания клеточного гомеостаза и замедления процессов старения.</p>
          )
        },
        {
          title: "Метаболическая гибкость",
          description: (
            <p>В период голодания организм переключается с использования глюкозы на потребление жировых запасов для производства энергии. Этот переход способствует повышению метаболической гибкости - способности организма эффективно использовать разные источники энергии.</p>
          )
        }
      ]}
      references={[
        {
          title: "Effects of Intermittent Fasting on Health, Aging, and Disease",
          authors: "de Cabo R, Mattson MP.",
          journal: "New England Journal of Medicine",
          year: 2019,
          doi: "10.1056/NEJMra1905136"
        },
        {
          title: "Fasting: Molecular Mechanisms and Clinical Applications",
          authors: "Longo VD, Mattson MP.",
          journal: "Cell Metabolism",
          year: 2022,
          doi: "10.1016/j.cmet.2022.02.040"
        }
      ]}
    />
  );

  const protocols = (
    <div className="space-y-6">
      <ProtocolCard 
        title="Интервальное голодание 16/8"
        description="Базовый протокол ограничения времени приема пищи"
        difficulty="beginner"
        duration="Ежедневно"
        steps={[
          "Ограничьте прием пищи 8-часовым окном (например, с 12:00 до 20:00)",
          "В остальные 16 часов потребляйте только воду, несладкий чай или черный кофе",
          "Начните с 12/12 и постепенно увеличивайте окно голодания",
          "Старайтесь придерживаться одного и того же времени приема пищи"
        ]}
        benefits={[
          "Улучшение чувствительности к инсулину",
          "Снижение воспаления",
          "Повышение энергии",
          "Умеренная активация аутофагии"
        ]}
      />
      
      {/* Placeholder for more protocols that would be added in a full implementation */}
    </div>
  );

  const casesStudies = (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Кейс: Улучшение метаболического здоровья</h3>
      <p>Данные о результатах применения методик периодического голодания будут добавлены в ближайшее время.</p>
    </div>
  );

  return (
    <ServicePageLayout
      hero={hero}
      benefits={benefits}
      scientificBackground={scientificBackground}
      protocols={protocols}
      casesStudies={casesStudies}
    />
  );
};

export default Fasting;
