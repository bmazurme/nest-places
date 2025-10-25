# Этап сборки
FROM node:22-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости без аудита и сбора статистики
RUN npm ci --no-audit --no-fund

# Копируем остальные файлы
COPY . .

# Собираем проект и удаляем исходники
RUN npm run build && rm -rf ./src

# Этап создания финального образа
FROM node:22-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json для production зависимостей
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --production --no-audit --no-fund

# Копируем собранный код из этапа сборки
COPY --from=builder /app/dist ./dist

# Копируем конфигурацию pm2
COPY ecosystem.config.js .

# Устанавливаем pm2 глобально
RUN npm install -g pm2

# Открываем порт
EXPOSE 3000

# Запускаем приложение через pm2
ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js" ]
