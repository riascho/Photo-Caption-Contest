import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Photo Caption Contest API",
      version: "1.0.0",
      description:
        "A backend API for a photo caption contest platform where users can view images and submit captions. Users must be authenticated to create captions.",
      contact: {
        name: "API Support",
        email: "support@photocaptioncontest.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://your-production-url.onrender.com",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the user",
              example: 1,
            },
            userName: {
              type: "string",
              description: "Username for the user",
              example: "john_doe",
            },
            email: {
              type: "string",
              format: "email",
              description:
                "Email address of the user (not returned in responses)",
              example: "john@example.com",
            },
          },
          required: ["id", "userName"],
        },
        Image: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the image",
              example: 1,
            },
            url: {
              type: "string",
              description: "URL or path to the image file",
              example: "/images/photo1.jpg",
            },
            captions: {
              type: "array",
              description: "Array of captions submitted for this image",
              items: {
                $ref: "#/components/schemas/Caption",
              },
            },
          },
          required: ["id", "url"],
        },
        Caption: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier for the caption",
              example: 1,
            },
            text: {
              type: "string",
              description: "The caption text submitted by the user",
              example: "When you realize it's Monday tomorrow",
            },
            user: {
              $ref: "#/components/schemas/User",
              description: "The user who submitted this caption",
            },
            image: {
              $ref: "#/components/schemas/Image",
              description: "The image this caption belongs to",
            },
          },
          required: ["id", "text"],
        },
        CaptionInput: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "The caption text to submit",
              example: "When you realize it's Monday tomorrow",
              minLength: 1,
            },
          },
          required: ["text"],
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message describing what went wrong",
              example: "Image not found",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message",
              example: "Operation completed successfully",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Images",
        description: "Endpoints for retrieving images and their captions",
      },
      {
        name: "Captions",
        description:
          "Endpoints for creating captions (requires authentication)",
      },
    ],
  },
  apis: ["./src/swagger-docs.ts"], // Path to the API documentation
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
