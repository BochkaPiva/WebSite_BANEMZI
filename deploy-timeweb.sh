#!/bin/bash

# Скрипт деплоя для Timeweb
echo "🚀 Начинаем деплой на Timeweb..."

# Останавливаем старый контейнер
docker-compose -f .timeweb.yml down

# Собираем новый образ
docker-compose -f .timeweb.yml build

# Запускаем новый контейнер
docker-compose -f .timeweb.yml up -d

echo "✅ Деплой завершен!"
echo "🌐 Сайт доступен по адресу: https://banemzi.ru"

