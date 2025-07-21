# TWA Build Instructions for EVERLIV

## Требования
- Node.js 18+
- Android Studio
- Java 8+

## Установка Bubblewrap CLI
```bash
npm install -g @bubblewrap/cli
```

## Создание TWA проекта

1. **Инициализация TWA проекта:**
```bash
bubblewrap init --manifest https://everliv.online/site.webmanifest
```

2. **Настройка Digital Asset Links:**
   - Обновите файл `public/.well-known/assetlinks.json` с правильным SHA256 отпечатком
   - Получите отпечаток после создания keystore:
   ```bash
   keytool -list -v -keystore android.keystore -alias android -storepass android
   ```

3. **Сборка TWA:**
```bash
bubblewrap build
```

4. **Установка на устройство:**
```bash
bubblewrap install
```

## Настройка для продакшена

### 1. Создание production keystore:
```bash
keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Обновление конфигурации:
Отредактируйте `twa-manifest.json`:
- Измените `signingKey.path` на `./release.keystore`
- Измените `signingKey.alias` на `release`

### 3. Верификация домена:
- Загрузите `assetlinks.json` на `https://everliv.online/.well-known/assetlinks.json`
- Проверьте через Google Search Console

### 4. Google Play Store:
- Создайте App Bundle: `bubblewrap build --mode=appbundle`
- Загрузите в Google Play Console
- Настройте store listing с описанием на русском языке

## Необходимые графические ресурсы

Создайте следующие файлы в папке `public/`:
- `android-chrome-192x192.png` (192x192px)
- `android-chrome-512x512.png` (512x512px)
- `screenshot-mobile.png` (390x844px)
- `screenshot-desktop.png` (1920x1080px)

## Автоматическое обновление

TWA автоматически обновляется при изменении веб-приложения. Убедитесь, что:
- Service Worker корректно кеширует ресурсы
- Веб-манифест остается доступным
- Digital Asset Links не изменяются

## Тестирование

1. **Локальное тестирование:**
```bash
bubblewrap build
adb install app-release-signed.apk
```

2. **Проверка Digital Asset Links:**
```bash
bubblewrap validate --url https://everliv.online
```

## Публикация обновлений

1. Обновите веб-приложение
2. При необходимости обновите манифест
3. TWA автоматически подхватит изменения
4. Для изменений в манифесте пересоберите TWA

## Отладка

- Используйте Chrome DevTools для отладки веб-части
- Включите USB отладку для Android
- Проверяйте логи через `adb logcat`