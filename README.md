# Severe Weather Outlook Dashboard

A real-time severe weather threat analysis and forecasting web application leveraging NOAA/NWS government data sources and Storm Prediction Center (SPC) outlooks.

![Severe Weather Outlook](https://img.shields.io/badge/status-Active-brightgreen) 
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![NOAA Partner](https://img.shields.io/badge/Data%20Source-NOAA%2FNWS-blue)

## Overview

The Severe Weather Outlook Dashboard provides meteorologists, weather enthusiasts, and concerned citizens with:

- **Real-time threat analysis** displaying tornado, hail, and wind probabilities
- **Timing information** for severe weather development and impacts
- **Active weather alerts and warnings** from the National Weather Service
- **SPC convective outlooks** for Days 1-8
- **Interactive maps** from official NOAA/NWS services
- **Location-based search** by city/state or ZIP code
- **Geolocation support** for automatic location detection

## Data Sources

This application uses **official government data** exclusively:

### Storm Prediction Center (SPC)
- **Organization**: Part of NOAA/NWS National Centers for Environmental Prediction (NCEP)
- **Convective Outlooks**: Days 1-8 with tornado, hail, and wind threat categories
- **Products**:
  - Day 1-2 Probabilistic Tornado Outlooks
  - Day 1-2 Hail and Wind Outlooks
  - Days 3-8 Probabilistic Outlooks
  - Mesoscale Discussions (MCDs)
  - Severe Weather Watch products
- **Access**: [SPC Official Website](https://www.spc.noaa.gov/)
- **Map Services**: NOAA Vector Map Services

### National Weather Service (NWS)
- **API Endpoint**: `https://api.weather.gov`
- **Data Products**:
  - Current weather alerts and warnings
  - Point forecasts (latitude/longitude based)
  - Hazardous weather products
  - Tornado/Severe Thunderstorm Watches
  - Fire Weather Outlooks
- **Documentation**: [weather-gov API](https://weather-gov.github.io/api/)

### Additional Resources
- [NOAA Weather.gov](https://www.weather.gov/)
- [National Centers for Environmental Prediction](https://www.ncep.noaa.gov/)
- [Storm Data Publication](https://www.ncdc.noaa.gov/stormevents/)

## Features

### 🎯 Threat Analysis Panel
- **Severity Classification**: Extreme, High, Moderate, Marginal
- **Probability Metrics**: Tornado %, Hail %, Wind % for each threat level
- **Detailed Descriptions**: English-language threat summaries
- **Timing Information**: Specific timeframes for threat development

### 📍 Location Search
- **City & State Input**: Natural language location search
- **ZIP Code Search**: Direct postal code lookup
- **Geolocation**: Automatic current location detection
- **Reverse Geocoding**: Converts coordinates to location names

### ⚠️ Active Alerts
- **Real-Time Warnings**: Tornado, Severe Thunderstorm, Flash Flood alerts
- **Watches**: Tornado and Severe Thunderstorm watch products
- **Advisories**: Winter Storm, Fire Weather, etc.
- **Timestamp Information**: When alerts were issued
- **Color Coding**: Severity-based alert highlighting

### 🗺️ Threat Maps
- **SPC Day 1 & Day 2 Outlooks**: Interactive probability polygons
- **Direct Links**: Quick access to NOAA/SPC products
- **Probability Contours**: Risk categories from Marginal to Extreme
- **Updated Regularly**: Synchronized with official forecasts

### 📱 Responsive Design
- **Mobile Optimized**: Full functionality on phones and tablets
- **Dark Theme**: Optimized for readability and reduced eye strain
- **Accessibility**: WCAG compliant color contrasts and semantic HTML

## Installation

### Quick Start (Static File)
Simply open `index.html` in a modern web browser:
```bash
# Clone the repository
git clone https://github.com/yourusername/severe-weather-outlook.git
cd severe-weather-outlook

# Open in browser
open index.html
# or
firefox index.html
```

### Local Development Server
For development with live reload:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js/http-server
npx http-server

# Using Ruby
ruby -run -ehttpd . -p8000
```

Then visit: `http://localhost:8000`

### GitHub Pages Deployment
1. Push code to GitHub
2. Go to Repository Settings → Pages
3. Select "main" branch as source
4. Enable GitHub Pages
5. Access at: `https://yourusername.github.io/severe-weather-outlook`

## Usage

### Search by City & State
1. Enter location in format: "Oklahoma City, OK"
2. Click "Analyze Threats" or press Enter
3. View threat analysis and alerts for that location

### Search by ZIP Code
1. Enter 5-digit ZIP code (e.g., 73102)
2. Click "Analyze Threats"
3. Results displayed for that postal code area

### Use Current Location
1. Click "📡 Use Current Location"
2. Grant geolocation permissions (browser prompt)
3. Dashboard updates with your current location's threats

### Interpreting Threat Levels

| Severity | Icon | Description | Action |
|----------|------|-------------|--------|
| **EXTREME** | 🌪️ | Significant tornado threat | Take shelter immediately |
| **HIGH** | ⚡ | Major severe weather likely | Be prepared to take action |
| **MODERATE** | 🌩️ | Scattered severe storms | Monitor conditions |
| **LOW** | ☁️ | Isolated storms possible | Low threat level |

## API Integration

### NOAA Weather.gov API
The application uses the free, public NOAA API:

```javascript
// Get alerts for a location
const lat = 35.4676;
const lon = -97.5164;
const response = await fetch(
  `https://api.weather.gov/alerts/active?point=${lat},${lon}`
);
```

**Rate Limits**: 
- No more than one request every 30 seconds per IP
- Automatic rate limiting firewall in place
- Violators may be temporarily blocked

**Documentation**: https://weather-gov.github.io/api/

### SPC Map Services
Access SPC outlooks via NOAA Vector Map Services:

```
Base URL: https://mapservices.weather.noaa.gov/vector/rest/services/
Service: outlooks/SPC_wx_outlks/MapServer
Layers: Day 1-8 outlooks, probabilistic and categorical
```

## Development

### Project Structure
```
severe-weather-outlook/
├── index.html              # Main application file
├── README.md               # This file
├── LICENSE                 # MIT License
├── .gitignore              # Git ignore rules
├── CONTRIBUTING.md         # Contribution guidelines
├── API_REFERENCE.md        # Detailed API documentation
└── docs/
    ├── setup-guide.md      # Setup instructions
    ├── deployment.md       # Deployment guide
    └── architecture.md     # Technical architecture
```

### Technology Stack
- **Frontend**: HTML5, CSS3 (CSS Variables), Vanilla JavaScript
- **APIs**: 
  - NOAA/NWS Weather.gov API (REST)
  - OpenStreetMap Nominatim API (Geocoding)
- **No Dependencies**: Runs without npm or build process
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Building & Deployment

### Production Optimization
For production use, consider:

1. **Minification**: Minify CSS and JavaScript
2. **Caching**: Implement cache headers for static assets
3. **CDN**: Serve assets through a CDN for faster global access
4. **CORS**: Configure CORS properly if self-hosting backend

### Docker Deployment
Example Dockerfile for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["npx", "http-server", "-p", "8080"]
```

Build and run:
```bash
docker build -t weather-outlook .
docker run -p 8080:8080 weather-outlook
```

### Environment Configuration
No environment variables required. All APIs use public endpoints:
- No API keys needed
- No backend required
- Fully static hosting compatible

## Performance

- **Lightweight**: ~50KB total (HTML+CSS+JS)
- **Fast Load**: <2 seconds on average connection
- **No Build Step**: Runs directly in browser
- **Low Bandwidth**: Minimal data transfers

## Troubleshooting

### "Location not found"
- Verify spelling and format: "City, State" or "Zip Code"
- Try different variations of the location name
- Check ZIP code has 5 digits

### Alerts not loading
- Check browser console for CORS errors
- Verify internet connection
- Refresh page to retry API call
- NOAA servers occasionally have maintenance windows

### Geolocation not working
- Grant location permission when browser prompts
- Some browsers require HTTPS for geolocation
- Geolocation may not work in private/incognito mode

### Maps not displaying
- Direct links to SPC maps always available
- NOAA map services may require JavaScript enabled
- Try accessing maps directly via links provided

## API Limits & Best Practices

### Rate Limiting
- **NOAA API**: Max 1 request per 30 seconds per location
- **Nominatim**: ~1 request per second (delays implemented)
- **Respect limits**: Violations result in temporary IP blocking

### Best Practices
- Cache results when possible
- Implement request throttling in production
- Monitor browser console for API errors
- Contact NOAA for commercial/high-volume use cases

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute
- 🐛 Report bugs and issues
- 💡 Suggest feature improvements
- 🎨 Improve UI/UX design
- 📝 Enhance documentation
- 🌍 Add internationalization
- 🔌 Integrate additional data sources

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### NOAA Data Usage
This project uses public domain data from NOAA. No licensing restrictions apply to NOAA/NWS data. Attribution appreciated but not required.

## Disclaimer

**This application is for informational purposes only.**

- **Always rely on official NWS/NOAA sources** for life-threatening weather decisions
- **Follow local emergency management** guidance and evacuation orders
- **Monitor NOAA Weather Radio** for official warnings
- Application data accuracy depends on real-time API availability
- Severe weather is unpredictable; plan multiple safety options

For emergencies, call 911 or your local emergency services.

## Support

### Need Help?
- **Documentation**: See `/docs` folder
- **API Issues**: Contact [NOAA Support](https://www.weather.gov/)
- **Bug Reports**: Open an issue on GitHub
- **Feature Requests**: Discuss in GitHub Discussions

### Useful Links
- [SPC Official Products](https://www.spc.noaa.gov/products/)
- [NWS API Documentation](https://weather-gov.github.io/api/)
- [Storm Data](https://www.ncdc.noaa.gov/stormevents/)
- [NOAA Weather.gov](https://www.weather.gov/)

## Roadmap

### Planned Features
- [ ] WebSocket real-time updates
- [ ] Push notifications for alerts
- [ ] Historical threat analysis
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Custom alert subscriptions
- [ ] Integration with third-party APIs (Twitter, Discord)
- [ ] Advanced threat forecasting model

## Credits

- **Data Source**: NOAA/National Weather Service
- **Storm Prediction Center**: SPC.NOAA.GOV
- **Weather API**: api.weather.gov
- **Geocoding**: OpenStreetMap Nominatim
- **Icons**: Unicode weather symbols

## Contact & Social

- 📧 Email: contact@example.com
- 🐦 Twitter: [@weatheroutlook](https://twitter.com)
- 💬 Discussions: [GitHub Discussions](https://github.com)
- 🌐 Website: [Example.com](https://example.com)

---

**Made with ❤️ for severe weather awareness and safety**

*Last Updated: May 2026*
