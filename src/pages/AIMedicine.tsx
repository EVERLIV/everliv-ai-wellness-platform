
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, HeartPulse, Microscope, Dna, LineChart, Zap } from 'lucide-react';

const AIMedicine = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 bg-white">
        <section className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Применение ИИ в медицине</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Искусственный интеллект революционно меняет подход к диагностике, лечению и профилактике заболеваний
            </p>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Возможности искусственного интеллекта в здравоохранении</h2>
              
              <div className="prose prose-lg max-w-none text-gray-700 mb-12">
                <p>
                  За последнее десятилетие искусственный интеллект (ИИ) совершил революционный прорыв в области здравоохранения. Сегодня ИИ не просто помогает врачам в принятии решений, но и во многих случаях самостоятельно выполняет сложные аналитические задачи с точностью, превосходящей человеческие возможности.
                </p>
                <p>
                  От анализа медицинских изображений до прогнозирования вспышек заболеваний и персонализации лечения — ИИ трансформирует все аспекты медицины, делая здравоохранение более эффективным, доступным и индивидуально ориентированным.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Microscope className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Ранняя диагностика</h3>
                      <p className="text-gray-700">
                        ИИ способен распознавать паттерны и аномалии в медицинских изображениях и данных, которые могут указывать на раннее развитие заболеваний, в том числе рака, диабета и сердечно-сосудистых патологий.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Dna className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Персонализированная медицина</h3>
                      <p className="text-gray-700">
                        Анализируя генетические данные и историю болезни, ИИ помогает создавать индивидуальные планы лечения, учитывающие уникальные особенности организма каждого пациента.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Brain className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Нейронные сети в радиологии</h3>
                      <p className="text-gray-700">
                        Глубокое обучение и нейронные сети революционизируют радиологию, позволяя с высокой точностью анализировать МРТ, КТ и рентгеновские снимки, выявляя патологии на самых ранних стадиях.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <LineChart className="h-16 w-16 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Предиктивная аналитика</h3>
                      <p className="text-gray-700">
                        ИИ анализирует большие объемы данных для прогнозирования риска развития заболеваний, эффективности различных методов лечения и даже вероятности повторной госпитализации.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Прорывные исследования и достижения</h2>
                
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <HeartPulse className="h-8 w-8 text-primary flex-shrink-0 mr-4 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Диагностика сердечно-сосудистых заболеваний</h3>
                        <p className="text-gray-700 mb-4">
                          Исследования, проведенные в 2023 году, показали, что нейронные сети способны определять риск инфаркта миокарда по ЭКГ с точностью до 95%, что превышает возможности опытных кардиологов.
                        </p>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <p className="text-sm text-gray-600 italic">
                            "ИИ-система анализирует не только очевидные отклонения в ЭКГ, но и минимальные изменения в электрической активности сердца, которые могут указывать на начало патологических процессов за несколько лет до клинических проявлений."
                            <br />
                            — Журнал Европейского общества кардиологов, 2023
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <Microscope className="h-8 w-8 text-primary flex-shrink-0 mr-4 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Революция в онкологии</h3>
                        <p className="text-gray-700 mb-4">
                          Алгоритмы машинного обучения научились обнаруживать опухоли на КТ и МРТ снимках на 30% эффективнее, чем традиционные методы. В некоторых исследованиях ИИ выявлял рак молочной железы по маммографии на 18-24 месяца раньше, чем это было возможно при обычном скрининге.
                        </p>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <p className="text-sm text-gray-600 italic">
                            "Особенно впечатляющие результаты ИИ показывает в области гистопатологии, где нейронные сети анализируют сотни тысяч клеточных образцов, выявляя мельчайшие признаки малигнизации, недоступные человеческому глазу."
                            <br />
                            — Международный журнал онкологии, 2024
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <Dna className="h-8 w-8 text-primary flex-shrink-0 mr-4 mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Революция в разработке лекарств</h3>
                        <p className="text-gray-700 mb-4">
                          ИИ кардинально меняет процесс создания новых лекарственных препаратов. С помощью алгоритмов глубокого обучения исследователи моделируют молекулярные взаимодействия и прогнозируют эффективность потенциальных лекарств без необходимости проведения множества лабораторных экспериментов.
                        </p>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <p className="text-sm text-gray-600 italic">
                            "Время разработки новых антибиотиков с помощью ИИ-моделей сократилось с 5-6 лет до 18-24 месяцев. В 2023 году был зарегистрирован первый антибиотик широкого спектра действия, полностью спроектированный искусственным интеллектом."
                            <br />
                            — Научный журнал Nature Biotechnology, 2024
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8">Как ИИ используется в EVERLIV</h2>
                
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 mb-8">
                  <div className="flex items-center mb-6">
                    <Zap className="h-8 w-8 text-primary mr-4" />
                    <h3 className="text-2xl font-semibold">Комплексный анализ биомаркеров</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    В платформе EVERLIV искусственный интеллект анализирует более 500 биомаркеров из анализов крови и других диагностических данных, создавая целостную картину состояния здоровья. ИИ обнаруживает скрытые паттерны и корреляции между показателями, которые могут указывать на ранние стадии заболеваний или негативные тенденции в здоровье.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="font-semibold mb-2">Пример: Анализ метаболома</h4>
                      <p className="text-gray-700 text-sm">
                        Наши алгоритмы выявляют незначительные изменения в метаболических процессах, которые могут сигнализировать о начинающемся воспалительном процессе или нарушении обмена веществ за 6-18 месяцев до появления клинических симптомов.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="font-semibold mb-2">Пример: Прогнозирование рисков</h4>
                      <p className="text-gray-700 text-sm">
                        На основе динамики изменений показателей крови и других биомаркеров ИИ создает индивидуальную карту рисков развития различных заболеваний и предлагает превентивные стратегии для их минимизации.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-8">
                  <div className="flex items-center mb-6">
                    <Brain className="h-8 w-8 text-secondary mr-4" />
                    <h3 className="text-2xl font-semibold">Персонализация протоколов здоровья</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Искусственный интеллект EVERLIV создает высокоперсонализированные протоколы оздоровления, учитывая не только медицинские данные, но и генетическую предрасположенность, образ жизни, питание, физическую активность и даже психоэмоциональное состояние.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="font-semibold mb-2">Пример: Адаптивные рекомендации</h4>
                      <p className="text-gray-700 text-sm">
                        ИИ постоянно анализирует эффективность рекомендаций и корректирует их в режиме реального времени на основе изменений в состоянии здоровья, новых данных и обратной связи от пользователя.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="font-semibold mb-2">Пример: Интеграция данных</h4>
                      <p className="text-gray-700 text-sm">
                        Система объединяет данные с носимых устройств, результаты лабораторных исследований и субъективные отчеты пользователя в единую аналитическую модель, обеспечивая комплексный подход к здоровью.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6">Будущее ИИ в медицине</h2>
                
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p>
                    Развитие искусственного интеллекта в медицине движется с невероятной скоростью. В ближайшие годы мы ожидаем появления еще более совершенных ИИ-систем, способных:
                  </p>
                  
                  <ul>
                    <li>Проводить диагностику заболеваний по голосу, походке и другим биометрическим параметрам</li>
                    <li>Создавать "цифровых двойников" внутренних органов для моделирования и прогнозирования развития патологий</li>
                    <li>Разрабатывать индивидуальные лекарства с учетом генетических особенностей пациента</li>
                    <li>Управлять роботизированными хирургическими системами с точностью, недоступной человеку</li>
                    <li>Предсказывать вспышки инфекционных заболеваний за недели и месяцы до их появления</li>
                  </ul>
                  
                  <p>
                    В EVERLIV мы следим за всеми передовыми разработками в области медицинского ИИ и интегрируем наиболее эффективные и проверенные технологии в нашу платформу. Наша цель — быть на переднем крае революции здравоохранения, делая передовые технологии доступными для каждого человека.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIMedicine;
