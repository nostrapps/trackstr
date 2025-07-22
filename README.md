# trackstr 🎵

**Decentralized Music Scrobbling on Nostr**

A real-time music scrobbling dashboard that aggregates listening activity from the decentralized Nostr network. View what people are listening to across the globe without any central authority or data collection.

![trackstr Demo](https://via.placeholder.com/800x400/0f172a/06b6d4?text=trackstr%20-%20Decentralized%20Music%20Scrobbling)

## ✨ Features

- **Real-time Scrobbles**: Live feed of music listening activity from Nostr relays
- **Decentralized**: No central server or database - all data comes from the Nostr network
- **Privacy-First**: No tracking, no cookies, no data collection
- **Multi-Platform Links**: Direct links to Spotify, YouTube, MusicBrainz, and more
- **Responsive Design**: Beautiful interface that works on all devices
- **Network Statistics**: Live stats showing total scrobbles, active users, and connected relays

## 🎯 What is Music Scrobbling?

Music scrobbling is the process of tracking and sharing what music you're listening to. Originally popularized by Last.fm, trackstr brings this concept to the decentralized web using the Nostr protocol.

## 🔗 How It Works

1. **Nostr Integration**: Uses Nostr Kind 1073 events for music scrobbling
2. **Multi-Relay Support**: Connects to multiple Nostr relays simultaneously
3. **Event Aggregation**: Collects and deduplicates scrobbles across the network
4. **Real-time Updates**: WebSocket connections provide live updates as they happen

### Supported Nostr Relays

- `wss://spotify-scrobbler.fiatjaf.com`
- `wss://nostr.wine`
- `wss://theforest.nostr1.com`
- `wss://nostr.land`
- `wss://pyramid.fiatjaf.com`

## 🚀 Getting Started

### Quick Start

Simply open `index.html` in any modern web browser - no build process or server required!

```bash
# Clone the repository
git clone https://github.com/nostrapps/trackstr.git

# Open in browser
cd trackstr
open index.html  # macOS
# or
xdg-open index.html  # Linux
# or just double-click index.html
```

### Local Development

For local development with live reload:

```bash
# Using Python (built-in)
python -m http.server 8000

# Using Node.js
npx http-server

# Using any static file server
```

Then visit `http://localhost:8000`

## 📊 Scrobble Data Format

trackstr reads Nostr events of kind `1073` with the following tag structure:

```json
{
  "kind": 1073,
  "tags": [
    ["title", "Song Title"],
    ["artist", "Artist Name"],
    ["album", "Album Name"],
    ["i", "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"],
    ["i", "isrc:USAT21904578"]
  ]
}
```

## 🛠 Tech Stack

- **Frontend**: Vanilla JavaScript with Preact for reactivity
- **Styling**: CSS3 with modern flexbox/grid layouts
- **Protocol**: Nostr (Notes and Other Stuff Transmitted by Relays)
- **WebSockets**: Native WebSocket API for real-time connections
- **No Dependencies**: Single HTML file with CDN resources

### Libraries Used

- [Preact](https://preactjs.com/) - Lightweight React alternative
- [HTM](https://github.com/developit/htm) - JSX-like syntax without build tools
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools) - Nostr protocol implementation

## 🎨 Screenshots

### Desktop View
The main dashboard showing recent scrobbles with user avatars, track information, and action links.

### Mobile View
Fully responsive design optimized for mobile devices with touch-friendly interface.

## 🌐 Live Demo

Visit the live demo: [https://nostrapps.github.io/trackstr/](https://nostrapps.github.io/trackstr/)

## 📱 Mobile Support

trackstr is fully responsive and works great on:
- 📱 Mobile phones
- 📟 Tablets  
- 💻 Desktop computers
- 🖥 Large screens

## 🔧 Configuration

### Adding Custom Relays

To add more Nostr relays, edit the `RELAYS` array in the JavaScript section:

```javascript
const RELAYS = [
    'wss://your-custom-relay.com',
    'wss://another-relay.nostr',
    // ... existing relays
];
```

### Customizing Appearance

All styling is contained within the `<style>` tag. Key CSS variables:

- Background: `#0f172a` (dark slate)
- Primary accent: `#06b6d4` (cyan)
- Text colors: Various shades of slate/gray
- Gradient logo: Purple → Cyan → Green

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Keep the single-file architecture
- Maintain mobile responsiveness
- Follow existing code style
- Test across multiple browsers
- Ensure accessibility standards

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Nostr Community** - For building the decentralized protocol
- **fiatjaf** - For Nostr development and relay infrastructure
- **Music Lovers** - For sharing their listening habits on the network

## 🔮 Roadmap

- [ ] User profile pages
- [ ] Advanced filtering and search
- [ ] Dark/light theme toggle
- [ ] Playlist generation from scrobbles
- [ ] Integration with more music services
- [ ] Statistical analysis and charts
- [ ] Export functionality for personal data

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/nostrapps/trackstr/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nostrapps/trackstr/discussions)
- **Nostr**: Find us on the Nostr network
- **Twitter**: [@nostrapps](https://twitter.com/nostrapps)

---

**Built with ❤️ for the decentralized web**

*trackstr - Because music is universal, but your data shouldn't be centralized.*