# Используем облегчённый Node.js
FROM node:18-alpine  

# Рабочая директория внутри контейнера
WORKDIR /app  

# 1) Копируем package.json и ставим зависимости
COPY servers/package.json ./package.json  
RUN npm install --legacy-peer-deps  

# 2) Копируем весь код сервера
COPY servers/ ./  

# 3) Копируем swagger.yaml в корень файловой системы контейнера,
#    чтобы Utils.getStringFromFile("/swagger.yaml") нашёл его
COPY swagger.yaml /swagger.yaml  

# Правильно: файл лежит в папке servers
COPY servers/products.json /products.json

# Открываем порт, на котором слушает ваш сервер
EXPOSE 3000  

# Запускаем сервер
CMD ["node", "server.js"]
