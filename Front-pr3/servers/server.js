const { ApolloServer, gql } = require('apollo-server-express'); 

const express = require("express");
const path = require("path");

const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const WebSocket = require('ws'); // Подключаем WebSocket

// Вставка json файла
const fs = require('fs');
const { json } = require("stream/consumers");
const productsFile = path.join(__dirname, "products.json");

// Функция для чтения товаров из файла
function loadProducts() {
    return JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
  }

// Определение схемы GraphQL
const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
    categories: [String]
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }
`;


const app = express();
const PORT = 3000;

const resolvers = {
    Query: {
        products: () => loadProducts(), 
        product: (_, { id }) => loadProducts().find(p => p.id == id),
    }
};

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
}


// Настройка папки для middleware
app.use(express.json());
app.use("/admin", express.static(path.join(__dirname, "../public_admin")));
app.use("/", express.static(path.join(__dirname, "../public_user")));

// Настройка API-эндпоинтов
app.get("/api/products", (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productsFile,'utf-8'));
        res.json(products);
    } catch (error) {
        res.status(500).json({error: "Ошибка загрузки товаров"});
    }
});

// Добавление товара
app.post("/api/products", (req, res) => {
    try {
        const newProducts = req.body;
        let products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));

        // Находим максимальный существующий ID
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;

        // Добавляем новые товары с увеличивающимся ID
        newProducts.forEach((product, index) => {
            product.id = maxId + index + 1; // Увеличиваем ID для каждого нового товара
            products.push(product);
        });

        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        res.status(201).json({ message: "Товар(ы) добавлен(ы)", products });
    } catch (error) {
        res.status(500).json({ error: "Ошибка добавления товара" });
    }
});

// Редактирование товара
app.put("/api/products/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        let products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        products[index] = { ...products[index], ...req.body };
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        res.json({ message: "Товар обновлён", product: products[index] });
    } catch (error) {
        res.status(500).json({ error: "Ошибка обновления товара" });
    }
});

// Удаление товара
app.delete("/api/products/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        let products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
        products = products.filter(p => p.id !== id);

        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        res.json({ message: "Товар удалён" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка удаления товара" });
    }
});




// Main page admin
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public_admin/index.html"));
});

// Главная страница user
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public_user/index.html"));
    //console.log(`Отправка файла: ${filePath}`);
    //res.sendFile(filePath);
});

// Создаём GraphQL-сервер
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });


    // Swagger
    const swaggerDocument = yaml.load(path.join(__dirname, "../swagger.yaml"));
    console.log("Swagger YAML загружен:", swaggerDocument);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    
    app.listen(PORT, () => {
        console.log(`GraphQL API запущен на http://localhost:${PORT}/graphql`);
        console.log(`Swagger API Docs: http://localhost:${PORT}/api-docs`);
        // Создаём WebSocket-сервер на порту 8080
        const wss = new WebSocket.Server({ port: 8080 });
        wss.on('connection', (ws) => {
            console.log('Новое подключение к WebSocket серверу');

            ws.on('message', (message) => {
                console.log('📩 Сообщение получено:', message.toString());

                let data;
                try {
                    // Пытаемся распарсить входящее сообщение как JSON
                    data = JSON.parse(message);
                } catch (e) {
                    console.error('Ошибка парсинга сообщения:', e);
                    return;
                }
                // Рассылаем сообщение всем подключенным клиентам
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        // Отправляем сообщение в виде JSON
                        client.send(JSON.stringify({ text: data.text }));
                    }
                });
            });

            ws.on('close', () => {
                console.log('Клиент отключился');
            });
        });
        console.log('WebSocket сервер запущен на ws://localhost:8080');
    });

}

startServer(); // Запуск сервера

