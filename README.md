# Chez Gustave

E-commerce platform for restaurant management with TypeScript server and React frontend.

## Features

- **Menu Management**: CRUD operations for restaurant menu
- **Order System**: Order processing and tracking
- **User Authentication**: Customer and admin roles
- **Real-time Updates**: WebSocket support for live orders
- **Responsive UI**: React-based web interface

## Architecture

```
ChezGustave/
├── server/              # TypeScript backend
├── client/              # React frontend
├── docker-compose.yml   # Local development
├── Dockerfile          # Production container
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker Desktop

### Run with Docker

```bash
docker compose up --build
```

### Manual Setup

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm start
```

## API Endpoints

- `GET /api/menu` - Get menu items
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

## License

MIT
