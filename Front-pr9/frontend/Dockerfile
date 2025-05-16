# Берём минимальный образ nginx
FROM nginx:alpine

# Копируем наш кастомный конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Переключаем рабочую директорию на папку со статиκой
WORKDIR /usr/share/nginx/html

# Очищаем дефолтные файлы
RUN rm -rf ./*

# Копируем пользовательскую часть
COPY public_user/ ./

# Копируем админку
COPY public_admin/ ./admin/

# Открываем порт 80
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
