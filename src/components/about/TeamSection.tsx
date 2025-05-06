
import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const TeamMember = ({ name, role, image, bio }: TeamMemberProps) => {
  return (
    <Card className="card-shadow overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-evergreen-600 font-medium mb-2">{role}</p>
        <p className="text-gray-600 text-sm">{bio}</p>
      </CardContent>
    </Card>
  );
};

const TeamSection = () => {
  const teamMembers: TeamMemberProps[] = [
    {
      name: "Др. Анна Соколова",
      role: "Главный медицинский консультант",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      bio: "Специалист с 15-летним опытом в превентивной медицине и геронтологии. Консультирует по вопросам научной обоснованности рекомендаций."
    },
    {
      name: "Алексей Петров",
      role: "Технический директор",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400",
      bio: "Эксперт в области машинного обучения и ИИ с опытом работы в ведущих технологических компаниях. Руководит разработкой алгоритмов."
    },
    {
      name: "Елена Иванова",
      role: "Руководитель исследований",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
      bio: "Кандидат биологических наук, специализируется на исследованиях в области долголетия и превентивной медицины."
    },
    {
      name: "Михаил Орлов",
      role: "Директор по данным",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      bio: "Специалист по анализу больших данных с опытом работы в медицинской индустрии. Отвечает за точность и безопасность данных."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-everliv-800">Наша команда</h2>
          <p className="text-lg text-gray-600">
            EVERLIV создан командой опытных специалистов в области медицины, биологии, технологий и анализа данных, объединенных общей миссией улучшения здоровья и увеличения продолжительности жизни.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
