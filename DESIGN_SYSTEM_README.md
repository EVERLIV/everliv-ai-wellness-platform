# 🎨 Дизайн-система проекта

## 📋 Содержание

- [🏗️ Структура проекта](#️-структура-проекта)
- [🚀 Быстрый старт](#-быстрый-старт)
- [🎨 Цветовая палитра](#-цветовая-палитра)
- [📝 Типографика](#-типографика)
- [🧩 Компоненты](#-компоненты)
- [📱 Адаптивность](#-адаптивность)
- [🛠️ Утилиты](#️-утилиты)
- [➕ Расширение системы](#-расширение-системы)
- [✅ Правила и рекомендации](#-правила-и-рекомендации)

---

## 🏗️ Структура проекта

```
src/
├── components/
│   ├── ui/                          # Базовые UI компоненты (shadcn/ui)
│   │   ├── button.tsx              # Кнопки с вариантами
│   │   ├── input.tsx               # Поля ввода
│   │   ├── card.tsx                # Карточки
│   │   └── ...                     # Другие компоненты
│   └── custom/                     # Кастомные компоненты
├── design-system/
│   ├── tokens.ts                   # Дизайн-токены (централизованные значения)
│   └── components/                 # Составные компоненты системы
├── index.css                       # Глобальные стили и CSS переменные
├── tailwind.config.ts              # Конфигурация Tailwind CSS
└── lib/
    └── utils.ts                    # Утилиты для стилей
```

---

## 🚀 Быстрый старт

### Подключение

1. **Импорт базовых стилей** (уже подключено в `main.tsx`):
```typescript
import './index.css'
```

2. **Импорт компонентов**:
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

3. **Использование дизайн-токенов**:
```typescript
import { designTokens } from "@/design-system/tokens"
```

### Основные принципы

✅ **DO**: Используйте семантические токены из CSS переменных
✅ **DO**: Используйте компоненты с вариантами 
✅ **DO**: Следуйте мобильной адаптивности

❌ **DON'T**: Не используйте прямые цвета (`text-white`, `bg-black`)
❌ **DON'T**: Не создавайте кастомные стили без необходимости
❌ **DON'T**: Не игнорируйте breakpoints

---

## 🎨 Цветовая палитра

### 🎯 Брендовые цвета

```css
/* Основные брендовые цвета */
--brand-primary: 210 85% 45%;        /* Основной синий */
--brand-primary-dark: 210 85% 35%;   /* Темно-синий */
--brand-primary-light: 210 85% 55%;  /* Светло-синий */
--brand-secondary: 160 55% 48%;      /* Зеленый */
--brand-accent: 285 85% 65%;         /* Фиолетовый */
--brand-warning: 45 95% 55%;         /* Желтый */
--brand-success: 140 60% 45%;        /* Зеленый успеха */
--brand-error: 0 85% 60%;            /* Красный ошибки */
```

**Использование в Tailwind**:
```tsx
<div className="bg-brand-primary text-white">
  <Button className="bg-brand-accent hover:bg-brand-accent/90">
    Accent Button
  </Button>
</div>
```

### 🎨 Семантические цвета

```css
/* Семантические цвета для компонентов */
--primary: 210 85% 45%;              /* Основной цвет интерфейса */
--secondary: 210 40% 96%;            /* Вторичный цвет */
--accent: 285 85% 65%;               /* Акцентный цвет */
--muted: 210 40% 96%;                /* Приглушенный фон */
--destructive: 0 85% 60%;            /* Деструктивные действия */
```

**Использование**:
```tsx
<Button variant="default">Primary</Button>      {/* bg-primary */}
<Button variant="secondary">Secondary</Button>  {/* bg-secondary */}
<Button variant="destructive">Delete</Button>   {/* bg-destructive */}
```

### 🌈 Нейтральная палитра

```css
--neutral-50: 210 20% 98%;   /* Очень светлый */
--neutral-100: 210 20% 96%;  /* Светлый */
--neutral-200: 210 20% 90%;  /* Светло-серый */
--neutral-300: 210 20% 80%;  /* Серый */
--neutral-400: 210 20% 60%;  /* Средне-серый */
--neutral-500: 210 20% 45%;  /* Темно-серый */
--neutral-600: 210 20% 35%;  /* Очень темно-серый */
--neutral-700: 210 20% 25%;  /* Почти черный */
--neutral-800: 210 20% 15%;  /* Черный */
--neutral-900: 210 20% 10%;  /* Очень черный */
```

### 🌓 Темная тема

Система автоматически поддерживает темную тему через CSS переменные:

```tsx
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="ghost"
    >
      Toggle Theme
    </Button>
  )
}
```

---

## 📝 Типографика

### 📏 Размеры шрифтов

```css
--font-size-xs: 0.75rem;     /* 12px - мелкий текст */
--font-size-sm: 0.875rem;    /* 14px - маленький */
--font-size-base: 1rem;      /* 16px - базовый */
--font-size-lg: 1.125rem;    /* 18px - большой */
--font-size-xl: 1.25rem;     /* 20px - очень большой */
--font-size-2xl: 1.5rem;     /* 24px - заголовок */
--font-size-3xl: 1.875rem;   /* 30px - большой заголовок */
--font-size-4xl: 2.25rem;    /* 36px - огромный заголовок */
```

### 📖 Использование в компонентах

```tsx
// Заголовки
<h1 className="text-4xl font-bold text-foreground">
  Главный заголовок
</h1>

<h2 className="text-2xl font-semibold text-foreground">
  Подзаголовок
</h2>

<h3 className="text-xl font-medium text-foreground">
  Секционный заголовок
</h3>

// Текст
<p className="text-base text-muted-foreground leading-relaxed">
  Основной текст параграфа
</p>

<span className="text-sm text-muted-foreground">
  Вспомогательный текст
</span>

<small className="text-xs text-muted-foreground">
  Мелкий текст
</small>
```

### 🎨 Семантические классы для биологического возраста

Специальные утилитарные классы для страницы биологического возраста:

```tsx
<h1 className="bio-heading-primary">Основной заголовок</h1>
<h2 className="bio-heading-secondary">Вторичный заголовок</h2>
<h3 className="bio-heading-tertiary">Третичный заголовок</h3>
<p className="bio-text-body">Основной текст</p>
<span className="bio-text-small">Маленький текст</span>
<caption className="bio-text-caption">Подпись</caption>
```

### ⚡ Веса шрифтов

```css
font-weight: 400;  /* normal - обычный */
font-weight: 500;  /* medium - средний */
font-weight: 600;  /* semibold - полужирный */
font-weight: 700;  /* bold - жирный */
```

---

## 🧩 Компоненты

### 🔘 Button (Кнопка)

**Варианты**:
```tsx
<Button variant="default">Основная</Button>
<Button variant="secondary">Вторичная</Button>
<Button variant="outline">Контурная</Button>
<Button variant="ghost">Призрак</Button>
<Button variant="link">Ссылка</Button>
<Button variant="destructive">Удаление</Button>
<Button variant="accent">Акцент</Button>
```

**Размеры**:
```tsx
<Button size="xs">Очень маленькая</Button>
<Button size="sm">Маленькая</Button>
<Button size="default">Обычная</Button>
<Button size="lg">Большая</Button>
<Button size="icon">Иконка</Button>
```

**Примеры использования**:
```tsx
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

// Основная кнопка с иконкой
<Button className="gap-2">
  <PlusIcon className="h-4 w-4" />
  Добавить элемент
</Button>

// Кнопка загрузки
<Button disabled className="gap-2">
  <Loader2 className="h-4 w-4 animate-spin" />
  Загрузка...
</Button>

// Деструктивная кнопка
<Button variant="destructive" size="sm">
  Удалить
</Button>
```

### 🃏 Card (Карточка)

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Заголовок карточки</CardTitle>
    <CardDescription>
      Описание содержимого карточки
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Основное содержимое карточки.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Отмена</Button>
    <Button>Сохранить</Button>
  </CardFooter>
</Card>
```

### 📝 Input (Поле ввода)

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="Введите ваш email"
    className="w-full"
  />
</div>

// С ошибкой
<Input 
  type="text" 
  placeholder="Обязательное поле"
  className="border-destructive focus:ring-destructive"
/>
```

### 🏷️ Badge (Бейдж)

```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="default">По умолчанию</Badge>
<Badge variant="secondary">Вторичный</Badge>
<Badge variant="destructive">Деструктивный</Badge>
<Badge variant="outline">Контурный</Badge>

// Размеры
<Badge size="sm">Маленький</Badge>
<Badge size="default">Обычный</Badge>
<Badge size="lg">Большой</Badge>
```

### ⚠️ Alert (Предупреждение)

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

// Информационное уведомление
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Внимание!</AlertTitle>
  <AlertDescription>
    Это важная информация для пользователя.
  </AlertDescription>
</Alert>

// Ошибка
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Ошибка</AlertTitle>
  <AlertDescription>
    Произошла ошибка при выполнении операции.
  </AlertDescription>
</Alert>
```

---

## 📱 Адаптивность

### 📐 Breakpoints

```typescript
// tailwind.config.ts
screens: {
  'xs': '375px',        // Маленькие телефоны
  'sm': '640px',        // Обычные телефоны/планшеты
  'md': '768px',        // Планшеты
  'lg': '1024px',       // Маленький десктоп
  'xl': '1280px',       // Десктоп
  '2xl': '1400px',      // Большой десктоп
  
  // Специальные мобильные breakpoints
  'mobile-sm': '320px',  // Очень маленькие телефоны
  'mobile-md': '375px',  // iPhone 8, SE
  'mobile-lg': '414px',  // iPhone Plus
  'mobile-xl': '480px',  // Большие телефоны
}
```

### 📱 Мобильная оптимизация

**Принципы**:
- Mobile-first подход
- Минимальные размеры touch-целей: 44px × 44px
- Оптимизированные шрифты для чтения на мобильных

**Утилитарные классы**:
```tsx
<div className="safe-container">        {/* Безопасные отступы */}
<div className="mobile-container">      {/* Мобильный контейнер */}
<button className="touch-optimized">    {/* Оптимизировано для касаний */}
<p className="mobile-text">             {/* Мобильный текст */}
<h1 className="mobile-heading">         {/* Мобильный заголовок */}
```

**Адаптивные примеры**:
```tsx
// Адаптивная сетка
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// Адаптивный текст
<h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">
  Адаптивный заголовок
</h1>

// Адаптивные отступы
<div className="p-4 sm:p-6 lg:p-8">
  Контент с адаптивными отступами
</div>

// Скрытие на мобильных
<div className="hidden sm:block">
  Скрыто на мобильных устройствах
</div>

// Показ только на мобильных
<div className="block sm:hidden">
  Показано только на мобильных
</div>
```

---

## 🛠️ Утилиты

### 🎨 Градиенты

```css
/* Доступные градиенты */
--gradient-primary: linear-gradient(135deg, hsl(var(--brand-primary)), hsl(var(--brand-primary-light)));
--gradient-secondary: linear-gradient(135deg, hsl(var(--brand-secondary)), hsl(var(--brand-accent)));
--gradient-hero: linear-gradient(135deg, hsl(var(--brand-primary)), hsl(var(--brand-accent)));
--gradient-card: linear-gradient(145deg, hsl(var(--card)), hsl(var(--neutral-50)));
--gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
```

**Применение**:
```tsx
<div 
  className="h-64 rounded-lg"
  style={{ background: 'var(--gradient-hero)' }}
>
  Героический блок с градиентом
</div>
```

### 🌟 Тени

```css
--shadow-sm: 0 1px 2px 0 hsl(var(--neutral-900) / 0.05);
--shadow-md: 0 4px 6px -1px hsl(var(--neutral-900) / 0.1);
--shadow-lg: 0 10px 15px -3px hsl(var(--neutral-900) / 0.1);
--shadow-xl: 0 20px 25px -5px hsl(var(--neutral-900) / 0.1);
--shadow-glow: 0 0 40px hsl(var(--brand-primary) / 0.3);
--shadow-colored: 0 10px 30px -10px hsl(var(--brand-primary) / 0.3);
```

**Tailwind классы**:
```tsx
<Card className="shadow-card hover:shadow-card-hover transition-shadow">
  Карточка с анимированной тенью
</Card>

<div className="shadow-soft rounded-lg p-6">
  Мягкая тень
</div>
```

### ⚡ Переходы

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**Анимации**:
```tsx
<div className="animate-fade-in">Появление с fade-in</div>
<div className="animate-pulse-slow">Медленная пульсация</div>

// Кастомные переходы
<Button 
  className="transition-all duration-200 hover:scale-105 active:scale-95"
>
  Интерактивная кнопка
</Button>
```

### 🔢 Z-Index

```css
--z-hide: -1;
--z-auto: auto;
--z-base: 0;
--z-docked: 10;        /* Закрепленные элементы */
--z-dropdown: 1000;    /* Выпадающие меню */
--z-sticky: 1100;      /* Липкие элементы */
--z-banner: 1200;      /* Баннеры */
--z-overlay: 1300;     /* Оверлеи */
--z-modal: 1400;       /* Модальные окна */
--z-popover: 1500;     /* Поповеры */
--z-skiplink: 1600;    /* Skip links */
--z-toast: 1700;       /* Уведомления */
--z-tooltip: 1800;     /* Подсказки */
```

---

## ➕ Расширение системы

### 🆕 Добавление новых компонентов

1. **Создайте файл компонента**:
```typescript
// src/components/ui/new-component.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const newComponentVariants = cva(
  "base-classes", // Базовые классы
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        default: "default-size",
        sm: "small-size",
        lg: "large-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface NewComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof newComponentVariants> {
  // Дополнительные пропы
}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(newComponentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
NewComponent.displayName = "NewComponent"

export { NewComponent, newComponentVariants }
```

2. **Добавьте в индексный файл**:
```typescript
// src/components/ui/index.ts
export { NewComponent } from "./new-component"
```

3. **Обновите документацию**:
```markdown
### 🆕 NewComponent

Описание компонента и его назначения.

**Варианты**:
- `default` - базовый вариант
- `secondary` - вторичный вариант

**Размеры**:
- `sm` - маленький
- `default` - обычный
- `lg` - большой

**Пример использования**:
\```tsx
<NewComponent variant="default" size="lg">
  Содержимое компонента
</NewComponent>
\```
```

### 🎨 Добавление новых цветов

1. **Обновите CSS переменные** в `src/index.css`:
```css
:root {
  /* Новые цвета */
  --brand-info: 200 100% 50%;
  --brand-info-foreground: 0 0% 100%;
}

.dark {
  /* Версии для темной темы */
  --brand-info: 200 80% 60%;
  --brand-info-foreground: 200 20% 10%;
}
```

2. **Добавьте в Tailwind конфиг** (`tailwind.config.ts`):
```typescript
colors: {
  brand: {
    // ... существующие цвета
    info: 'hsl(var(--brand-info))',
    'info-foreground': 'hsl(var(--brand-info-foreground))',
  }
}
```

3. **Обновите типы** в `src/design-system/tokens.ts`:
```typescript
export const designTokens = {
  colors: {
    brand: {
      // ... существующие
      info: 'hsl(200, 100%, 50%)',
    }
  }
}
```

### 🔧 Добавление новых утилит

1. **Создайте утилитарные классы** в `src/index.css`:
```css
@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent;
  }
  
  .card-hover-lift {
    @apply transition-transform duration-200 hover:-translate-y-1;
  }
  
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
  }
}
```

2. **Документируйте использование**:
```tsx
<h1 className="text-gradient text-4xl font-bold">
  Заголовок с градиентом
</h1>

<Card className="card-hover-lift">
  Карточка с эффектом поднятия
</Card>

<Input className="focus-ring">
  Поле с кольцом фокуса
</Input>
```

---

## ✅ Правила и рекомендации

### 🎯 Принципы дизайна

1. **Консистентность**
   - Используйте только семантические токены
   - Придерживайтесь единого стиля
   - Следуйте установленным паттернам

2. **Доступность**
   - Обеспечивайте контраст не менее 4.5:1
   - Используйте семантические HTML теги
   - Поддерживайте навигацию с клавиатуры

3. **Производительность**
   - Используйте CSS переменные для темизации
   - Минимизируйте количество кастомных стилей
   - Применяйте оптимизацию для мобильных

### 🔒 Правила кодирования

#### ✅ DO (Рекомендуется)

```tsx
// ✅ Используйте семантические токены
<Button className="bg-primary text-primary-foreground">

// ✅ Используйте variants для вариаций
<Button variant="destructive" size="sm">

// ✅ Применяйте адаптивность
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ✅ Используйте CSS переменные для кастома
<div style={{ background: 'var(--gradient-hero)' }}>

// ✅ Группируйте связанные стили
<Card className="space-y-4 p-6 shadow-card">
```

#### ❌ DON'T (Не рекомендуется)

```tsx
// ❌ Прямые цвета
<div className="bg-blue-500 text-white">

// ❌ Магические числа
<div className="mt-[23px] ml-[17px]">

// ❌ Inline стили без переменных
<div style={{ backgroundColor: '#3b82f6' }}>

// ❌ Переопределение через !important
<Button className="!bg-red-500 !text-white">

// ❌ Игнорирование вариантов
<div className="px-4 py-2 bg-gray-100 rounded-md"> {/* Используйте Badge */}
```

### 🧪 Тестирование компонентов

1. **Визуальное тестирование**:
```tsx
// Проверьте все варианты и состояния
<div className="space-y-4">
  <Button variant="default">Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button disabled>Disabled</Button>
</div>
```

2. **Адаптивное тестирование**:
```tsx
// Проверьте на всех breakpoints
<div className="p-4 sm:p-6 lg:p-8">
  <h1 className="text-lg sm:text-xl lg:text-2xl">
    Адаптивный заголовок
  </h1>
</div>
```

3. **Темная тема**:
```tsx
// Убедитесь, что компонент работает в обеих темах
<div className="bg-card text-card-foreground p-4 rounded-lg">
  Контент, адаптированный к теме
</div>
```

### 📚 Контрольный чеклист

#### Перед добавлением нового компонента:

- [ ] Проверил, нет ли подходящего существующего компонента
- [ ] Использовал семантические токены вместо прямых цветов
- [ ] Добавил все необходимые варианты и размеры
- [ ] Обеспечил поддержку темной темы
- [ ] Протестировал на всех breakpoints
- [ ] Добавил TypeScript типы
- [ ] Обновил документацию
- [ ] Следовал принципам доступности

#### Перед релизом изменений:

- [ ] Все компоненты работают в светлой и темной теме
- [ ] Адаптивность соблюдена на всех устройствах
- [ ] Нет использования прямых цветов
- [ ] Контраст соответствует стандартам WCAG
- [ ] Код следует установленным соглашениям
- [ ] Документация актуальна

---

## 📞 Поддержка

Если у вас есть вопросы по использованию дизайн-системы или предложения по улучшению:

1. Проверьте существующую документацию
2. Найдите примеры использования в коде
3. Создайте issue с подробным описанием
4. Предложите улучшения через pull request

---

**Последнее обновление**: `$(date +'%Y-%m-%d')`
**Версия дизайн-системы**: 1.0.0

> 💡 **Совет**: Сохраните эту документацию в закладки для быстрого доступа к референсу по дизайн-системе!