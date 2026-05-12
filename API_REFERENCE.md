# API Reference

This document provides detailed information about the APIs used by the Severe Weather Outlook Dashboard.

## NOAA Weather.gov API

### Overview
The National Weather Service API provides comprehensive weather data for any location in the United States using latitude/longitude coordinates.

**Base URL**: `https://api.weather.gov`  
**Rate Limit**: Max 1 request per 30 seconds per location  
**Authentication**: None required (public API)  
**Response Format**: JSON (REST)

### Endpoints

#### 1. Get Point Metadata
Returns grid point information for a given latitude/longitude.

```
GET /points/{latitude},{longitude}
```

**Parameters**:
- `latitude`: Number between -90 and 90 (max 4 decimals)
- `longitude`: Number between -180 and 180 (max 4 decimals)

**Example**:
```bash
curl https://api.weather.gov/points/35.4676,-97.5164
```

**Response**:
```json
{
  "properties": {
    "forecast": "https://api.weather.gov/gridpoints/OKX/31,80/forecast",
    "forecastHourly": "https://api.weather.gov/gridpoints/OKX/31,80/forecast/hourly",
    "alerts": "https://api.weather.gov/alerts?point=35.4676,-97.5164"
  }
}
```

#### 2. Get Forecast
Returns a 7-day forecast for a gridpoint.

```
GET /gridpoints/{wfo}/{gridX},{gridY}/forecast
```

**Parameters**:
- `wfo`: Weather Forecast Office (3 letters, from /points response)
- `gridX`: X coordinate (from /points response)
- `gridY`: Y coordinate (from /points response)

**Example**:
```bash
curl https://api.weather.gov/gridpoints/OKX/31,80/forecast
```

**Response Fields**:
```json
{
  "properties": {
    "periods": [
      {
        "number": 1,
        "name": "Today",
        "startTime": "2026-05-12T08:00:00-05:00",
        "endTime": "2026-05-12T20:00:00-05:00",
        "isDaytime": true,
        "temperature": 85,
        "temperatureUnit": "F",
        "windSpeed": "10 mph",
        "windDirection": "S",
        "shortForecast": "Sunny, high 85",
        "detailedForecast": "Sunny. High 85..."
      }
    ]
  }
}
```

#### 3. Get Hourly Forecast
Returns hourly forecast data.

```
GET /gridpoints/{wfo}/{gridX},{gridY}/forecast/hourly
```

**Same parameters and response structure as forecast, but with hourly periods**

#### 4. Get Active Alerts
Returns current active alerts for a specific point or area.

```
GET /alerts/active?point={latitude},{longitude}
```

**Parameters**:
- `latitude`: Location latitude
- `longitude`: Location longitude

**Query Filters**:
- `area`: US state code (e.g., `?area=OK`)
- `point`: Lat,Lon coordinates (e.g., `?point=35.4676,-97.5164`)
- `region_type`: `land` or `marine`

**Example**:
```bash
curl "https://api.weather.gov/alerts/active?point=35.4676,-97.5164"
```

**Response**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "event": "Severe Thunderstorm Watch",
        "headline": "Severe Thunderstorm Watch issued May 12",
        "description": "A severe thunderstorm watch has been issued...",
        "sent": "2026-05-12T14:30:00-05:00",
        "effective": "2026-05-12T14:30:00-05:00",
        "expires": "2026-05-12T22:00:00-05:00",
        "status": "Actual",
        "severity": "Moderate",
        "urgency": "Expected"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[...]]]
      }
    }
  ]
}
```

#### 5. Get Alerts (Last 7 Days)
Returns all alerts from the past 7 days.

```
GET /alerts?area={state}
```

**Parameters**:
- `area`: US state code (required)

**Example**:
```bash
curl "https://api.weather.gov/alerts?area=OK"
```

### Alert Properties Reference

| Property | Description | Example |
|----------|-------------|---------|
| `event` | Type of alert | "Tornado Warning", "Flood Advisory" |
| `headline` | Brief summary | "Tornado Warning issued May 12" |
| `description` | Full alert text | "A tornado warning has been issued..." |
| `severity` | Impact level | "Extreme", "Severe", "Moderate", "Minor" |
| `urgency` | Response urgency | "Immediate", "Expected", "Future", "Past", "Unknown" |
| `status` | Alert status | "Actual", "Exercise", "Test", "Draft" |
| `sent` | Issue timestamp | "2026-05-12T14:30:00-05:00" |
| `effective` | Start time | "2026-05-12T14:30:00-05:00" |
| `expires` | End time | "2026-05-12T22:00:00-05:00" |
| `geometry` | Geographic polygon | GeoJSON Polygon object |

### Error Handling

The API returns standard HTTP status codes:

```
200 OK - Request successful
404 Not Found - Location/resource not found
500 Internal Server Error - Server error (retry after 30 seconds)
```

Error response format:
```json
{
  "title": "Not Found",
  "type": "https://api.weather.gov/problems/NotFound",
  "status": 404,
  "detail": "Point is outside the United States"
}
```

### Rate Limiting

- **Limits**: No more than 1 request per 30 seconds per location/IP
- **Headers**: Check response headers for rate limit info
- **Exceeding**: Auto-blocked temporarily if limits exceeded
- **Recovery**: Wait until rate limit window expires (~1 hour)

### Caching Best Practices

Implement caching to reduce API calls:

```javascript
// Cache results for 30 minutes
const CACHE_DURATION = 30 * 60 * 1000;
const cache = new Map();

async function cachedFetch(url) {
  const now = Date.now();
  if (cache.has(url) && (now - cache.get(url).time) < CACHE_DURATION) {
    return cache.get(url).data;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, { data, time: now });
  return data;
}
```

---

## Nominatim OpenStreetMap API

Used for geocoding (converting addresses to coordinates).

### Overview
**Base URL**: `https://nominatim.openstreetmap.org`  
**Rate Limit**: ~1 request per second  
**Authentication**: None required (public API)  
**Response Format**: JSON

### Endpoints

#### Search (Geocoding)
Convert address to coordinates.

```
GET /search?format=json&q={query}
```

**Parameters**:
- `q`: Search query (address or place name)
- `format`: Response format (`json`, `xml`, `jsonv2`)
- `limit`: Max results (default 10)
- `countrycodes`: Limit to countries (e.g., `us`)

**Example**:
```bash
curl "https://nominatim.openstreetmap.org/search?format=json&q=Oklahoma+City,+OK"
```

**Response**:
```json
[
  {
    "place_id": 123456,
    "lat": "35.4676",
    "lon": "-97.5164",
    "display_name": "Oklahoma City, Canadian County, Oklahoma, United States",
    "address": {
      "city": "Oklahoma City",
      "county": "Canadian County",
      "state": "Oklahoma",
      "country": "United States"
    }
  }
]
```

#### Reverse Geocoding
Convert coordinates to address.

```
GET /reverse?format=json&lat={latitude}&lon={longitude}
```

**Parameters**:
- `lat`: Latitude
- `lon`: Longitude
- `format`: Response format

**Example**:
```bash
curl "https://nominatim.openstreetmap.org/reverse?format=json&lat=35.4676&lon=-97.5164"
```

---

## Storm Prediction Center (SPC) Map Services

Provides severe weather outlooks and threat data.

### Overview
**Service**: NOAA Vector Map Services  
**Base URL**: `https://mapservices.weather.noaa.gov/vector/rest/services/`  
**Service**: `outlooks/SPC_wx_outlks/MapServer`  
**Format**: REST, GeoJSON, PNG  
**Authentication**: None required (public)

### Available Layers

| Layer ID | Description | Products |
|----------|-------------|----------|
| 0-7 | Day 1 Categorical Outlook | Tornado, Hail, Wind Categories |
| 8 | Day 1 Significant Severe Outlook | Significant threat areas |
| 9-16 | Day 2 Categorical Outlook | Tornado, Hail, Wind Categories |
| 17 | Day 2 Significant Severe Outlook | Significant threat areas |
| 18+ | Days 3-8 Probabilistic Outlooks | 8-day forecasts |

### Example Request

Get Day 1 Tornado Outlook (Layer 0):

```
GET /outlooks/SPC_wx_outlks/MapServer/0/query?where=1=1&outSR=4326&f=geojson
```

**Response**: GeoJSON FeatureCollection with polygons for each threat category

### Threat Categories

- **TSTM**: Thunderstorms expected
- **MRGL**: Marginal (1-5% probability)
- **SLGT**: Slight (5-15% probability)
- **ENH**: Enhanced (15-30% probability)
- **MDT**: Moderate (30-45% probability)
- **HIGH**: High (45%+ probability)

---

## Integration Examples

### Example 1: Get Alerts for Location

```javascript
async function getAlertsForLocation(latitude, longitude) {
  const url = `https://api.weather.gov/alerts/active?point=${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.features.map(feature => ({
      event: feature.properties.event,
      headline: feature.properties.headline,
      severity: feature.properties.severity,
      expires: feature.properties.expires
    }));
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

// Usage
const alerts = await getAlertsForLocation(35.4676, -97.5164);
```

### Example 2: Get Forecast for City

```javascript
async function getForecast(city, state) {
  try {
    // Step 1: Geocode location
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city},${state}&limit=1&countrycodes=us`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();
    
    if (!geoData.length) throw new Error('Location not found');
    
    const { lat, lon } = geoData[0];
    
    // Step 2: Get grid point info
    const pointUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const pointResponse = await fetch(pointUrl);
    const pointData = await pointResponse.json();
    
    // Step 3: Get forecast
    const forecastUrl = pointData.properties.forecast;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();
    
    return forecastData.properties.periods;
  } catch (error) {
    console.error('Error getting forecast:', error);
    return null;
  }
}

// Usage
const forecast = await getForecast('Oklahoma City', 'OK');
```

### Example 3: Implement Alert Polling

```javascript
class AlertMonitor {
  constructor(latitude, longitude, updateCallback) {
    this.lat = latitude;
    this.lon = longitude;
    this.callback = updateCallback;
    this.interval = null;
  }
  
  start(pollIntervalMs = 300000) { // Default 5 minutes
    this.poll(); // Initial poll
    this.interval = setInterval(() => this.poll(), pollIntervalMs);
  }
  
  stop() {
    if (this.interval) clearInterval(this.interval);
  }
  
  async poll() {
    try {
      const url = `https://api.weather.gov/alerts/active?point=${this.lat.toFixed(4)},${this.lon.toFixed(4)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      this.callback({
        success: true,
        alertCount: data.features.length,
        alerts: data.features
      });
    } catch (error) {
      this.callback({
        success: false,
        error: error.message
      });
    }
  }
}

// Usage
const monitor = new AlertMonitor(35.4676, -97.5164, (result) => {
  if (result.success) {
    console.log(`${result.alertCount} alerts active`);
  } else {
    console.error('Poll failed:', result.error);
  }
});

monitor.start(); // Start polling every 5 minutes
```

---

## Troubleshooting

### CORS Errors
**Issue**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
- Ensure requests are to HTTPS endpoints
- Use JSONP or server-side proxy for cross-origin requests
- For development, use browser extensions like CORS-Anywhere

### Rate Limit Exceeded
**Issue**: `429 Too Many Requests`

**Solutions**:
- Implement request throttling (max 1 per 30 seconds)
- Use caching for repeated requests
- Implement exponential backoff for retries

### Location Not Found
**Issue**: Invalid coordinates or outside US

**Solutions**:
- Verify latitude is between -90 and 90
- Verify longitude is between -180 and 180
- Check coordinates are for contiguous United States
- Use Nominatim to verify coordinates first

### No Alerts Returned
**Issue**: Empty alerts list

**Reasons**:
- No active alerts for location
- Location may be outside alert boundaries
- Alerts may have expired

---

## Additional Resources

- [NWS API GitHub](https://github.com/weather-gov/api)
- [SPC Official Products](https://www.spc.noaa.gov/products/)
- [NOAA Vector Map Services](https://mapservices.weather.noaa.gov/)
- [OpenStreetMap Nominatim](https://nominatim.org/)

