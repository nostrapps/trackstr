#!/usr/bin/env node

import crypto from 'crypto';
import WebSocket from 'ws';
import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools';

// Nostr relays for publishing scrobbles
const RELAYS = [
    'wss://relay.damus.io',
    'wss://nostr.wine',
    'wss://relay.snort.social',
    'wss://nostr.mutinywallet.com',
    'wss://relay.nostr.band',
    'wss://nos.lol',
    'wss://relay.current.fyi',
    'wss://nostr.land'
];

// Utilities for hex conversion
function hexToBytes(hex) {
    return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

function bytesToHex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Create scrobble event using nostr-tools
function createScrobbleEvent(privateKeyHex, title, artist, album, spotify, isrc) {
    try {
        // Convert hex private key to Uint8Array
        const privateKeyBytes = hexToBytes(privateKeyHex);
        
        // Get public key
        const publicKeyHex = getPublicKey(privateKeyBytes);
        
        const tags = [
            ['title', title],
            ['artist', artist]
        ];
        
        if (album) tags.push(['album', album]);
        if (spotify) {
            const spotifyId = spotify.replace(/^https:\/\/open\.spotify\.com\/track\//, '');
            tags.push(['i', `spotify:track:${spotifyId}`]);
        }
        if (isrc) tags.push(['i', `isrc:${isrc}`]);
        
        const eventTemplate = {
            kind: 1073,
            created_at: Math.floor(Date.now() / 1000),
            tags: tags,
            content: `🎵 Now playing: ${title} by ${artist}${album ? ` from ${album}` : ''}`,
        };
        
        // Use nostr-tools to finalize the event (adds id, pubkey, and sig)
        const signedEvent = finalizeEvent(eventTemplate, privateKeyBytes);
        
        return signedEvent;
    } catch (error) {
        throw new Error(`Failed to create event: ${error.message}`);
    }
}

// Publish to a single relay
function publishToRelay(relayUrl, event) {
    return new Promise((resolve, reject) => {
        console.log(`🔗 Connecting to ${relayUrl}`);
        const ws = new WebSocket(relayUrl);
        let published = false;
        
        const timeout = setTimeout(() => {
            if (!published) {
                console.log(`⏰ Timeout for ${relayUrl}`);
                ws.close();
                reject(new Error(`Timeout: ${relayUrl}`));
            }
        }, 15000);
        
        ws.on('open', () => {
            console.log(`✅ Connected to ${relayUrl}`);
            const eventMessage = JSON.stringify(['EVENT', event]);
            ws.send(eventMessage);
        });
        
        ws.on('message', (data) => {
            try {
                const response = JSON.parse(data.toString());
                
                if (response[0] === 'OK') {
                    if (response[1] === event.id) {
                        if (response[2] === true) {
                            console.log(`🎉 Successfully published to ${relayUrl}`);
                            published = true;
                            clearTimeout(timeout);
                            ws.close();
                            resolve(relayUrl);
                        } else {
                            console.log(`❌ Rejected by ${relayUrl}: ${response[3] || 'Unknown reason'}`);
                            clearTimeout(timeout);
                            ws.close();
                            reject(new Error(`Rejected: ${response[3] || 'Unknown reason'}`));
                        }
                    }
                } else if (response[0] === 'NOTICE') {
                    console.log(`ℹ️  Notice from ${relayUrl}: ${response[1]}`);
                }
            } catch (e) {
                console.error(`❌ Error parsing response from ${relayUrl}:`, e.message);
            }
        });
        
        ws.on('error', (error) => {
            console.log(`❌ Connection error to ${relayUrl}:`, error.message);
            clearTimeout(timeout);
            reject(new Error(`Connection failed: ${relayUrl}`));
        });
        
        ws.on('close', () => {
            console.log(`🔌 Connection closed to ${relayUrl}`);
        });
    });
}

// Main CLI function
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
🎵 trackstr-cli - Command Line Music Scrobbler for Nostr

Usage:
  trackstr-cli --key <private-key> --title <title> --artist <artist> [options]

Required Arguments:
  --key, -k       Nostr private key (64-character hex string)
  --title, -t     Track title
  --artist, -a    Artist name

Optional Arguments:
  --album         Album name
  --spotify, -s   Spotify track URL or ID
  --isrc          ISRC code
  --help, -h      Show this help message

Examples:
  # Basic scrobble
  trackstr-cli --key abc123... --title "Bohemian Rhapsody" --artist "Queen"
  
  # With album and Spotify link
  trackstr-cli -k abc123... -t "Imagine" -a "John Lennon" --album "Imagine" -s "https://open.spotify.com/track/7pKfPomDEeI4TPT6EOYjn9"
  
  # With ISRC code
  trackstr-cli -k abc123... -t "Blinding Lights" -a "The Weeknd" --isrc "USUG11904206"

Note: Keep your private key secure! Consider using environment variables.
`);
        process.exit(0);
    }
    
    // Parse arguments
    const config = {};
    for (let i = 0; i < args.length; i += 2) {
        const flag = args[i];
        const value = args[i + 1];
        
        switch (flag) {
            case '--key':
            case '-k':
                config.privateKey = value;
                break;
            case '--title':
            case '-t':
                config.title = value;
                break;
            case '--artist':
            case '-a':
                config.artist = value;
                break;
            case '--album':
                config.album = value;
                break;
            case '--spotify':
            case '-s':
                config.spotify = value;
                break;
            case '--isrc':
                config.isrc = value;
                break;
            default:
                console.error(`❌ Unknown flag: ${flag}`);
                process.exit(1);
        }
    }
    
    // Validate required arguments
    if (!config.privateKey) {
        console.error('❌ Error: Private key is required (--key or -k)');
        process.exit(1);
    }
    
    if (!config.title) {
        console.error('❌ Error: Track title is required (--title or -t)');
        process.exit(1);
    }
    
    if (!config.artist) {
        console.error('❌ Error: Artist name is required (--artist or -a)');
        process.exit(1);
    }
    
    // Validate private key format
    if (!/^[a-fA-F0-9]{64}$/.test(config.privateKey)) {
        console.error('❌ Error: Private key must be a 64-character hex string');
        process.exit(1);
    }
    
    try {
        console.log('🎵 Creating scrobble event...');
        const event = createScrobbleEvent(
            config.privateKey,
            config.title,
            config.artist,
            config.album,
            config.spotify,
            config.isrc
        );
        
        console.log(`📝 Event created with ID: ${event.id}`);
        console.log(`🔗 View at: https://nostr.eu/${event.id}`);
        console.log();
        console.log(`🚀 Publishing to ${RELAYS.length} relays...`);
        
        // Publish to all relays
        const publishPromises = RELAYS.map(relayUrl => 
            publishToRelay(relayUrl, event).catch(error => {
                console.log(`❌ Failed to publish to ${relayUrl}: ${error.message}`);
                return null;
            })
        );
        
        const results = await Promise.allSettled(publishPromises);
        const successful = results.filter(r => r.status === 'fulfilled' && r.value !== null);
        
        console.log();
        console.log(`📊 Publishing results: ${successful.length}/${RELAYS.length} relays successful`);
        
        if (successful.length > 0) {
            console.log(`🎉 Scrobble published successfully!`);
            console.log(`🔗 View your scrobble: https://nostr.eu/${event.id}`);
            console.log(`📱 Check the feed: https://nostrapps.github.io/trackstr/`);
        } else {
            console.error('❌ Failed to publish to any relays');
            process.exit(1);
        }
        
    } catch (error) {
        console.error(`💥 Error: ${error.message}`);
        process.exit(1);
    }
}

// Handle CLI invocation
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error(`💥 Unexpected error: ${error.message}`);
        process.exit(1);
    });
}

export {
    createScrobbleEvent,
    publishToRelay,
    RELAYS
};