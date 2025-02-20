# Directory Structure
backend/
├── config/
│   ├── db.js          # Database connection
│   └── ai.js          # AI service configuration
├── controllers/
│   ├── recController.js # Recommendation logic
│   └── restController.js # Restaurant search logic
├── models/
│   └── Restaurant.js  # MongoDB schema
├── routes/
│   ├── recRoutes.js   # Recommendation endpoints
│   └── restRoutes.js  # Restaurant endpoints
├── middleware/  
│   └── errorHandler.js # Error handling
└── server.js          # Main entry point