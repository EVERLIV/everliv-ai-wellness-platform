
const TechnologyShowcase = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-everliv-800">
                Технология, которая постоянно совершенствуется
              </h2>
              <p className="text-lg mb-6 text-gray-600">
                Наш ИИ непрерывно обучается на новых данных, внедряя последние научные открытия в области здоровья и долголетия, чтобы обеспечить наиболее точные и актуальные рекомендации.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-evergreen-500 mr-3"></div>
                  <span className="text-gray-700">Самообучающиеся алгоритмы</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-evergreen-500 mr-3"></div>
                  <span className="text-gray-700">Автоматические обновления базы знаний</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-evergreen-500 mr-3"></div>
                  <span className="text-gray-700">Проверка результатов медицинскими экспертами</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-everliv-100 to-everliv-200 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-everliv-800 text-lg font-medium">
                  [Интерактивная демонстрация технологии]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;
