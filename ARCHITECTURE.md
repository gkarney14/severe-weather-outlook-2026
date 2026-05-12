# Architecture & Technical Overview

## Project Goals

The Severe Weather Outlook Dashboard is designed to:

1. **Provide timely threat analysis** - Display tornado, hail, and wind probabilities
2. **Use authoritative data sources** - Exclusively NOAA/NWS government data
3. **Enable location-based searches** - Find threats for any US location
4. **Display active alerts** - Real-time warnings and watches
5. **Be highly accessible** - Work on any device, any browser
6. **Require no backend** - Fully static, can be hosted anywhere

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Web Browser                            │
│  (Chrome, Firefox, Safari, Edge, Mobile Browsers)        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTPS Requests
                   │
       ┌───────────┴──────────────┬──────────────┐
       │                          │              │
       ▼                          ▼              ▼
┌─────────────────┐     ┌──────────────────┐  ┌────────────────────┐
│  NOAA Weather   │     │   OpenStreetMap  │  │ NOAA Vector Map    │
│    API          │     │   Nominatim      │  │ Services (SPC)     │
│ api.weather.gov │     │ nominatim.org    │  │ mapservices.       │
│                 │     │                  │  │ weather.noaa.gov   │
│ • Alerts        │     │ • Geocoding      │  │                    │
│ • Forecasts     │     │ • Reverse        │  │ • Outlooks         │
│ • Warnings      │     │   Geocoding      │  │ • Threat layers    │
│ • Current Cond  │     │ • Location Lookup│  │ • Polygons         │
└─────────────────┘     └──────────────────┘  └────────────────────┘
```

## Data Flow

### Search by Location

```
User Input (City/State or ZIP)
         │
         ▼
┌──────────────────────────┐
│  Location Validation     │
│  (Empty check, format)   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Nominatim Geocoding API │
│  (Address → Coordinates) │
└──────────┬───────────────┘
           │
           ├─► Latitude, Longitude
           │
           ▼
┌──────────────────────────┐
│  Display Threat Analysis │
│  (Uses cached examples   │
│   and live API data)     │
└──────────────────────────┘
           │
           ├─► Fetch Alerts (api.weather.gov)
           ├─► Display Alert Section
           ├─► Show Maps Section
           │
           ▼
┌──────────────────────────┐
│  Display Results to User │
│  • Threat cards          │
│  • Alerts section        │
│  • Maps with links       │
└──────────────────────────┘
```

## Components

### 1. HTML Structure
- **Header**: Branding and status
- **Location Section**: User input form
- **Threat Container**: Dynamic threat analysis cards
- **Alerts Section**: Active alerts list
- **Maps Section**: SPC outlook links and placeholders
- **Footer**: Credits and links

### 2. CSS Styling
- **Design System**: CSS variables for colors and themes
- **Responsive**: Mobile-first approach
- **Theming**: Dark theme optimized for weather data
- **Animations**: Subtle transitions and hover effects
- **Accessibility**: High contrast colors, semantic elements

### 3. JavaScript Functions

#### Location Search
```javascript
searchLocation()
├─ Validate user input
├─ Call Nominatim API
├─ Extract coordinates
├─ Call displayThreatAnalysis()
└─ Handle errors
```

#### Threat Analysis
```javascript
displayThreatAnalysis(lat, lon, location)
├─ Clear previous results
├─ Create threat cards
├─ Fetch alerts
├─ Display alerts
└─ Show maps section
```

#### Alert Fetching
```javascript
fetchAlerts(lat, lon)
├─ Call api.weather.gov/alerts
├─ Parse response
├─ Call displayAlerts()
└─ Handle errors
```

#### Geolocation
```javascript
useCurrentLocation()
├─ Request browser geolocation
├─ Reverse geocode coordinates
├─ Update location field
└─ Call displayThreatAnalysis()
```

## API Integrations

### NOAA Weather.gov API
- **Purpose**: Get active alerts and warnings
- **Endpoint**: `https://api.weather.gov/alerts/active`
- **Parameters**: Latitude, longitude
- **Response**: GeoJSON with alert features
- **Rate Limit**: 1 request per 30 seconds per location

**Error Handling**:
- Network errors → Display error banner
- No alerts → Show "No Active Alerts"
- CORS errors → Use documentation links instead

### Nominatim (OpenStreetMap)
- **Purpose**: Convert addresses to coordinates
- **Endpoint**: `https://nominatim.openstreetmap.org/search`
- **Parameters**: Location name/ZIP code
- **Response**: Array of matching locations
- **Rate Limit**: ~1 request per second

**Error Handling**:
- Location not found → "Location not found" error
- Network error → Retry with backoff

### SPC Map Services
- **Purpose**: Display threat outlook maps
- **Endpoint**: `https://mapservices.weather.noaa.gov/vector/rest/services/`
- **Format**: REST, GeoJSON, PNG
- **Usage**: Direct links to official SPC maps

## State Management

```javascript
// Application State
{
  currentLocation: {
    name: "Oklahoma City, OK",
    latitude: 35.4676,
    longitude: -97.5164
  },
  threats: [
    {
      type: "tornado|severe|moderate|marginal",
      severity: "EXTREME|HIGH|MODERATE|LOW",
      timing: "2:00 PM - 8:00 PM",
      probability: { tornado: 45, hail: 60, wind: 40 }
    }
  ],
  alerts: [
    {
      event: "Tornado Warning",
      headline: "...",
      severity: "Extreme",
      sent: "2026-05-12T..."
    }
  ]
}
```

## Error Handling Strategy

```
API Request
    │
    ├─ Success → Process data
    │
    ├─ 404 Error → "Location not found"
    │
    ├─ 429 Rate Limited → "Service temporarily busy"
    │
    ├─ 500+ Server Error → "Service unavailable"
    │
    └─ Network Error → "Connection failed"
         │
         └─ Show retry button or cached data
```

## Performance Optimization

### Caching
- Location search results cached for 30 minutes
- Alert data refreshed on-demand
- No page reloads required

### Network
- Minimal API calls
- Parallel requests where possible
- Graceful degradation if APIs unavailable

### Rendering
- DOM updates only when necessary
- CSS animations for smooth transitions
- No heavy JavaScript processing

## Security Considerations

### Data Privacy
- No user data collected or stored
- No analytics or tracking
- Location data only used client-side
- No third-party scripts

### API Security
- HTTPS only for all external requests
- Rate limiting prevents abuse
- No API keys exposed (all public APIs)
- No sensitive data transmitted

### Content Security
- No eval() or dangerous functions
- No external stylesheets or fonts
- All content self-hosted
- Semantic HTML prevents injection

## Browser Compatibility

Tested and working:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ iOS Safari
- ✅ Chrome Mobile
- ✅ Firefox Mobile

Uses standard features:
- Fetch API (all modern browsers)
- CSS Grid/Flexbox
- ES6 JavaScript (const, let, arrow functions)
- Geolocation API
- No polyfills needed

## Testing Strategy

### Manual Testing Checklist
- [ ] Location search works
- [ ] ZIP code search works
- [ ] Geolocation works
- [ ] Alerts load correctly
- [ ] Error handling displays properly
- [ ] Mobile layout responsive
- [ ] Keyboard navigation works
- [ ] Works without JavaScript disabled
- [ ] All external links work
- [ ] Maps section displays

### Browser Testing
```bash
# Chrome
open -a "Google Chrome" http://localhost:8000

# Firefox
open -a Firefox http://localhost:8000

# Safari
open http://localhost:8000

# Edge
open /Applications/Microsoft\ Edge.app http://localhost:8000
```

### Mobile Testing
- iPhone Safari
- Android Chrome
- Tablet browsers
- Touch interactions

## Deployment Checklist

- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Mobile responsive verified
- [ ] Performance acceptable
- [ ] External APIs working
- [ ] Links all valid
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Deployment guide followed

## Future Enhancement Possibilities

### Near-term
- WebSocket for real-time alert push
- Push notifications for critical alerts
- User preferences (favorite locations)
- Alert threshold customization
- Historical threat data

### Medium-term
- Mobile app (React Native)
- Multi-language support
- Advanced threat forecasting
- Integration with Twitter/Discord
- Custom alert subscriptions

### Long-term
- ML-based threat prediction
- Crowd-sourced storm reports
- Advanced radar integration
- Community forecasting
- Educational modules

## Maintenance Tasks

### Weekly
- Monitor error logs (if deployed)
- Check API health

### Monthly
- Review and update documentation
- Test all external links
- Check for browser updates

### Quarterly
- Security review
- Performance audit
- UI/UX review
- Data validation

### Annually
- Major version updates
- Feature review
- Architecture assessment

## Support & Troubleshooting

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Alerts not loading | API down | Show cached data |
| Location not found | Geocoding error | Try different format |
| Maps not showing | NOAA service issue | Provide direct links |
| Slow performance | Network latency | Implement caching |
| CORS error | Browser policy | Proxy or documentation |

## Performance Metrics

Target metrics:
- Page load: <2 seconds
- Search response: <1 second
- Alert fetch: <2 seconds
- Total interaction: <3 seconds

Current performance:
- Lightweight: ~50KB total
- No build step required
- Minimal dependencies
- Fast CDN delivery

## Code Quality

### Standards
- Semantic HTML5
- CSS BEM methodology
- JavaScript best practices
- Accessibility WCAG 2.1

### Tools (Recommended)
- ESLint: JavaScript linting
- StyleLint: CSS linting
- Prettier: Code formatting
- axe DevTools: Accessibility testing

## Documentation

- **README.md**: Project overview
- **API_REFERENCE.md**: API documentation
- **CONTRIBUTING.md**: Contribution guide
- **DEPLOYMENT.md**: Deployment options
- **Code comments**: In-code documentation

## Contact & Support

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Questions: Contact maintainers
- Security: Report privately to maintainers

---

*Last updated: May 2026*
*Version: 1.0.0*
