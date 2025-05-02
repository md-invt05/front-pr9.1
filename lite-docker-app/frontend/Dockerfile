# Используем официальный минимальный образ nginx
FROM nginx:alpine
# Удаляем стандартные файлы из папки Nginx
RUN rm -rf /usr/share/nginx/html/*
# Копируем содержимое нашей папки frontend/ внутрь контейнера
COPY . /usr/share/nginx/html/
# Контейнер будет слушать 80-й порт
EXPOSE 80