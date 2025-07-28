import { useState } from "react";
import { Container, Section, Grid, Stack } from "./components/Layout";
import { Heading, Text, Display, Code, Quote, Link } from "./components/Typography";
import { Card, CardHeader, CardTitle, CardContent, FeatureCard, StatCard } from "./components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandLogo, BrandSymbol, BrandMark } from "./icons/Brand";
import { GeometricPattern, WavePattern, CircleGrid, GradientOrb, AbstractShape } from "./icons/Decorative";
import { designTokens } from "./tokens";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Palette, Type, Layout, Shapes, Code2, Sparkles } from "lucide-react";

export const StyleGuide = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Section spacing="md" background="brand">
        <Container>
          <Stack align="center" justify="center" gap="lg">
            <BrandLogo size={48} />
            <Display>Design System</Display>
            <Text size="lg" variant="muted" className="text-center max-w-2xl">
              Комплексная дизайн-система для создания современных и масштабируемых веб-приложений
            </Text>
          </Stack>
        </Container>
      </Section>

      {/* Navigation */}
      <Section spacing="sm" background="muted">
        <Container>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Sparkles size={16} />
                Обзор
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette size={16} />
                Цвета
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type size={16} />
                Типографика
              </TabsTrigger>
              <TabsTrigger value="components" className="flex items-center gap-2">
                <Layout size={16} />
                Компоненты
              </TabsTrigger>
              <TabsTrigger value="icons" className="flex items-center gap-2">
                <Shapes size={16} />
                Иконки
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code2 size={16} />
                Код
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <Grid cols={3} gap="lg">
                <FeatureCard
                  icon={<Palette size={24} />}
                  title="Цветовая система"
                  description="Полная палитра с семантическими токенами и градиентами"
                  action={
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("colors")}>
                      Смотреть цвета
                    </Button>
                  }
                />
                <FeatureCard
                  icon={<Type size={24} />}
                  title="Типографика"
                  description="Масштабируемая типографическая система с responsive дизайном"
                  action={
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("typography")}>
                      Смотреть шрифты
                    </Button>
                  }
                />
                <FeatureCard
                  icon={<Layout size={24} />}
                  title="Компоненты"
                  description="Готовые React компоненты с вариантами и состояниями"
                  action={
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("components")}>
                      Смотреть компоненты
                    </Button>
                  }
                />
              </Grid>

              <Section spacing="md">
                <Heading level={2}>Статистика использования</Heading>
                <Grid cols={4} gap="md">
                  <StatCard
                    label="Цветовых токенов"
                    value="45+"
                    change={{ value: 12, trend: "up" }}
                  />
                  <StatCard
                    label="UI Компонентов"
                    value="30+"
                    change={{ value: 8, trend: "up" }}
                  />
                  <StatCard
                    label="Иконок"
                    value="15+"
                    change={{ value: 5, trend: "neutral" }}
                  />
                  <StatCard
                    label="Токенов типографики"
                    value="20+"
                    change={{ value: 3, trend: "up" }}
                  />
                </Grid>
              </Section>
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors" className="mt-8">
              <Stack gap="xl">
                <div>
                  <Heading level={2}>Основная палитра</Heading>
                  <Text variant="muted">Основные цвета бренда и семантические цвета</Text>
                </div>

                {/* Brand Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle>Цвета бренда</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Grid cols={4} gap="md">
                      {Object.entries(designTokens.colors.brand).map(([name, value]) => (
                        <Card key={name} variant="outline" size="sm">
                          <div 
                            className="h-16 w-full rounded-t-lg mb-3" 
                            style={{ backgroundColor: value }}
                          />
                          <Text size="sm" weight="medium">{name}</Text>
                          <Code 
                            className="text-xs cursor-pointer hover:bg-muted/80"
                            onClick={() => copyToClipboard(value)}
                          >
                            {value}
                          </Code>
                        </Card>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>

                {/* Neutral Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle>Нейтральные цвета</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Grid cols="auto" gap="sm">
                      {Object.entries(designTokens.colors.neutral).map(([name, value]) => (
                        <Card key={name} variant="outline" size="sm">
                          <div 
                            className="h-12 w-full rounded-t-lg mb-2" 
                            style={{ backgroundColor: value }}
                          />
                          <Text size="xs" weight="medium">{name}</Text>
                          <Code 
                            className="text-xs cursor-pointer"
                            onClick={() => copyToClipboard(value)}
                          >
                            {value}
                          </Code>
                        </Card>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>

                {/* Gradients */}
                <Card>
                  <CardHeader>
                    <CardTitle>Градиенты</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Grid cols={2} gap="md">
                      <Card variant="outline" size="sm">
                        <div className="h-16 w-full rounded-t-lg mb-3 bg-gradient-to-r from-brand-primary to-brand-accent" />
                        <Text size="sm" weight="medium">Primary Gradient</Text>
                        <Code className="text-xs">var(--gradient-primary)</Code>
                      </Card>
                      <Card variant="outline" size="sm">
                        <div className="h-16 w-full rounded-t-lg mb-3 bg-gradient-to-r from-brand-secondary to-brand-accent" />
                        <Text size="sm" weight="medium">Secondary Gradient</Text>
                        <Code className="text-xs">var(--gradient-secondary)</Code>
                      </Card>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="mt-8">
              <Stack gap="xl">
                <div>
                  <Heading level={2}>Типографическая система</Heading>
                  <Text variant="muted">Иерархия заголовков и текстовых стилей</Text>
                </div>

                {/* Headings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Заголовки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="lg">
                      <Heading level={1}>Заголовок 1 (H1)</Heading>
                      <Heading level={2}>Заголовок 2 (H2)</Heading>
                      <Heading level={3}>Заголовок 3 (H3)</Heading>
                      <Heading level={4}>Заголовок 4 (H4)</Heading>
                      <Heading level={5}>Заголовок 5 (H5)</Heading>
                      <Heading level={6}>Заголовок 6 (H6)</Heading>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Text Variants */}
                <Card>
                  <CardHeader>
                    <CardTitle>Варианты текста</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="md">
                      <Text size="xl">Крупный текст (XL)</Text>
                      <Text size="lg">Большой текст (LG)</Text>
                      <Text size="base">Обычный текст (Base)</Text>
                      <Text size="sm">Маленький текст (SM)</Text>
                      <Text size="xs">Очень маленький текст (XS)</Text>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Special Typography */}
                <Card>
                  <CardHeader>
                    <CardTitle>Специальные элементы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="lg">
                      <Display>Display Text</Display>
                      <Quote>
                        "Это пример цитаты в нашей дизайн-системе. Она выделяется специальным стилем."
                      </Quote>
                      <Text>
                        Это обычный текст с <Link href="#">ссылкой</Link> и <Code>инлайн кодом</Code>.
                      </Text>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </TabsContent>

            {/* Components Tab */}
            <TabsContent value="components" className="mt-8">
              <Stack gap="xl">
                <div>
                  <Heading level={2}>UI Компоненты</Heading>
                  <Text variant="muted">Готовые компоненты для быстрой разработки</Text>
                </div>

                {/* Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle>Кнопки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Grid cols="auto" gap="md">
                      <Button variant="default">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="accent">Accent</Button>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle>Бейджи</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack direction="row" gap="md" wrap={true}>
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Cards */}
                <Card>
                  <CardHeader>
                    <CardTitle>Карточки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Grid cols={3} gap="md">
                      <Card variant="default">
                        <CardContent>
                          <Text>Default Card</Text>
                        </CardContent>
                      </Card>
                      <Card variant="elevated">
                        <CardContent>
                          <Text>Elevated Card</Text>
                        </CardContent>
                      </Card>
                      <Card variant="glass">
                        <CardContent>
                          <Text>Glass Card</Text>
                        </CardContent>
                      </Card>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </TabsContent>

            {/* Icons Tab */}
            <TabsContent value="icons" className="mt-8">
              <Stack gap="xl">
                <div>
                  <Heading level={2}>Система иконок</Heading>
                  <Text variant="muted">Фирменные иконки и декоративные элементы</Text>
                </div>

                {/* Brand Icons */}
                <Card>
                  <CardHeader>
                    <CardTitle>Фирменные иконки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Grid cols={3} gap="lg">
                      <Card variant="outline" size="lg">
                        <Stack align="center" gap="md">
                          <BrandLogo size={48} />
                          <Text size="sm" weight="medium">Brand Logo</Text>
                        </Stack>
                      </Card>
                      <Card variant="outline" size="lg">
                        <Stack align="center" gap="md">
                          <BrandSymbol size={48} />
                          <Text size="sm" weight="medium">Brand Symbol</Text>
                        </Stack>
                      </Card>
                      <Card variant="outline" size="lg">
                        <Stack align="center" gap="md">
                          <BrandMark size={48} />
                          <Text size="sm" weight="medium">Brand Mark</Text>
                        </Stack>
                      </Card>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Decorative Elements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Декоративные элементы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Grid cols="auto" gap="lg">
                      <Card variant="outline" size="lg">
                        <Stack align="center" gap="md">
                          <GeometricPattern size={60} />
                          <Text size="sm" weight="medium">Geometric</Text>
                        </Stack>
                      </Card>
                      <Card variant="outline" size="lg">
                        <Stack align="center" gap="md">
                          <WavePattern size={60} />
                          <Text size="sm" weight="medium">Wave</Text>
                        </Stack>
                      </Card>
                      <Card variant="outline" size="lg">
                        <Stack align="center" gap="md">
                          <CircleGrid size={60} />
                          <Text size="sm" weight="medium">Grid</Text>
                        </Stack>
                      </Card>
                      <Card variant="outline" size="lg">
                        <Stack align="center" gap="md">
                          <GradientOrb size={60} />
                          <Text size="sm" weight="medium">Orb</Text>
                        </Stack>
                      </Card>
                      <Card variant="outline" size="lg">
                        <Stack align="center" gap="md">
                          <AbstractShape size={60} />
                          <Text size="sm" weight="medium">Abstract</Text>
                        </Stack>
                      </Card>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </TabsContent>

            {/* Code Tab */}
            <TabsContent value="code" className="mt-8">
              <Stack gap="xl">
                <div>
                  <Heading level={2}>Примеры кода</Heading>
                  <Text variant="muted">Готовые примеры для быстрого старта</Text>
                </div>

                {/* Usage Examples */}
                <Card>
                  <CardHeader>
                    <CardTitle>Использование компонентов</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="lg">
                      <div>
                        <Text size="sm" weight="medium" className="mb-2">Импорт компонентов:</Text>
                        <Card variant="outline" size="sm">
                          <Code className="block text-sm">
                            {`import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/design-system/components/Card";
import { Heading, Text } from "@/design-system/components/Typography";`}
                          </Code>
                        </Card>
                      </div>

                      <div>
                        <Text size="sm" weight="medium" className="mb-2">Пример использования:</Text>
                        <Card variant="outline" size="sm">
                          <Code className="block text-sm">
                            {`<Card variant="elevated" hover="lift">
  <CardContent>
    <Heading level={3}>Заголовок</Heading>
    <Text variant="muted">Описание компонента</Text>
    <Button variant="brand">Действие</Button>
  </CardContent>
</Card>`}
                          </Code>
                        </Card>
                      </div>

                      <div>
                        <Text size="sm" weight="medium" className="mb-2">CSS переменные:</Text>
                        <Card variant="outline" size="sm">
                          <Code className="block text-sm">
                            {`/* Использование токенов */
.custom-element {
  color: hsl(var(--brand-primary));
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}`}
                          </Code>
                        </Card>
                      </div>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </TabsContent>
          </Tabs>
        </Container>
      </Section>
    </div>
  );
};