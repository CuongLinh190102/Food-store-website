import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import express from 'express';

const router = express.Router();

// Cấu hình Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Food App API',
            version: '1.0.0',
            description: 'API documentation for Food Store website',
            servers: ['http://localhost:5000'],
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        produces: ['application/json'],
        consumes: ['application/json'],
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routers/*.js'],
};

// Khởi tạo Swagger docs
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Tích hợp Swagger UI vào Express
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default router;