import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const router = express.Router();

// Cấu hình Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Food App API',
            version: '1.0.0',
            description: 'API documentation for Food Store website',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://food-store-website-production.up.railway.app'
                    : `http://localhost:${process.env.PORT || 5000}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routers/*.js'],
};

// Khởi tạo Swagger docs
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Tích hợp Swagger UI vào Express
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default router;