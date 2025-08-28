# Smart House Locator

A modern React application for real estate agents to record and navigate to house locations with automatic GPS coordinate recording and Google Maps integration.

## Features

- 🏠 **Add Houses**: Record house names, agent information, and notes
- 📍 **Automatic Location Recording**: Automatically captures GPS coordinates when adding houses
- 🗺️ **Google Maps Integration**: One-click navigation to any saved house location
- 🔍 **Search Functionality**: Search through saved houses by name or agent
- 💾 **Local Storage**: All data is saved locally in the browser
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS and Lucide React icons

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Containerization**: Docker with Nginx
- **Development**: Hot reload with Vite

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-house-locator
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Open your browser and go to `http://localhost:3000`

### Development Mode

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Open your browser and go to `http://localhost:3000`

## Usage

### Adding a New House

1. Fill in the house name/address
2. Enter the agent name
3. Add optional notes about the property
4. Click "Record Location & Add House"
5. Allow location access when prompted
6. The house will be automatically saved with GPS coordinates

### Navigating to a House

1. Find the house in the saved houses list
2. Click the "Navigate" button
3. Google Maps will open with the route to the house
4. Follow the navigation instructions

### Searching Houses

1. Use the search box in the top right of the houses list
2. Search by house name or agent name
3. Results will filter in real-time

## Docker Commands

### Production Build
```bash
# Build and run production container
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the application
docker-compose down
```

### Development Mode
```bash
# Run development server with hot reload
docker-compose --profile dev up --build
```

### Individual Docker Commands
```bash
# Build the image
docker build -t smart-house-locator .

# Run the container
docker run -p 3000:80 smart-house-locator

# Run with custom port
docker run -p 8080:80 smart-house-locator
```

## Project Structure

```
smart-house-locator/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── AddHouse.jsx
│   │   ├── HousesList.jsx
│   │   ├── LocationModal.jsx
│   │   └── SuccessModal.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Location Services

The application uses the browser's Geolocation API to record house coordinates. Make sure to:

- Allow location access when prompted
- Use HTTPS in production (required for geolocation)
- Have GPS enabled on mobile devices

## Data Storage

All house data is stored locally in the browser's localStorage. This means:

- Data persists between browser sessions
- Data is not shared between devices
- Clearing browser data will remove saved houses
- No server-side storage required

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue in the repository.
