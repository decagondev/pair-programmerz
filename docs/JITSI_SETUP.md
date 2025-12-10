# Jitsi Setup Guide

This guide covers two options for setting up Jitsi video calls:

1. **Jitsi as a Service (JaaS)** - Recommended (Easier, managed service)
2. **Self-Hosted Jitsi** - Advanced (Full control, requires server management)

## Option 1: Jitsi as a Service (JaaS) - Recommended

JaaS is provided by 8x8 and offers a managed Jitsi instance with better reliability than the public `meet.jit.si` service.

### Benefits:
- ✅ Free Developer Plan: Up to 25 Monthly Active Users
- ✅ No server management required
- ✅ Better reliability than public Jitsi
- ✅ No lobby/members-only restrictions
- ✅ Automatic scaling

### Setup Steps:

1. **Sign up for JaaS:**
   - Go to https://jaas.8x8.vc/
   - Create an account and create a new app
   - Get your **App ID** from the dashboard

2. **Generate JWT Tokens:**
   - JWT tokens are required for authentication
   - Tokens must be generated server-side (never expose your secret key in the client)
   - Tokens include: App ID, room name, user info, expiration

3. **Get Your Tenant Name:**
   - Your tenant name is usually part of your App ID
   - It typically looks like: `vpaas-magic-cookie-xxxxx` or similar
   - Check your JaaS dashboard for the exact tenant name
   - The tenant is required in both the JWT payload and the room URL

4. **Configure Environment Variables:**
   ```env
   # Jitsi as a Service (JaaS)
   VITE_JITSI_APP_ID=your-jaas-app-id
   VITE_JITSI_TENANT=your-tenant-name
   VITE_JITSI_JWT=your-jaas-jwt-token
   ```

### Generating JWT Tokens (Server-Side)

You'll need to create a server endpoint to generate JWT tokens. Here's an example using Node.js:

```javascript
const jwt = require('jsonwebtoken');

function generateJitsiToken(appId, tenant, roomName, userName, userEmail, isModerator = false) {
  const payload = {
    iss: appId, // App ID
    aud: 'jitsi',
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
    nbf: Math.floor(Date.now() / 1000) - 10,
    room: `${tenant}/${roomName}`, // Room name must include tenant
    sub: '8x8.vc', // JaaS domain
    context: {
      user: {
        id: userEmail,
        name: userName,
        moderator: isModerator ? 'true' : 'false',
      },
    },
    // Include tenant in the payload
    tenant: tenant,
  };

  return jwt.sign(payload, yourSecretKey, { algorithm: 'HS256' });
}
```

**Important Notes:**
- The `room` claim in the JWT must match the room name format: `{tenant}/{roomName}`
- The `tenant` claim must match your JaaS tenant name
- The room name in the URL must also be: `{tenant}/{roomName}`
- The tenant in the JWT must match the tenant in the URL

**Important:** Never expose your JaaS secret key in client-side code. Always generate tokens server-side.

### Pricing:
- **Developer Plan:** Free (up to 25 MAU)
- **Basic Plan:** $99/month (300 MAU)
- **Standard Plan:** $499/month (1,500 MAU)
- **Business Plan:** $999/month (3,000 MAU)
- **Enterprise:** Custom pricing

## Option 2: Self-Hosted Jitsi

Self-hosting gives you full control but requires server management.

### Benefits:
- ✅ Full control over configuration
- ✅ No usage limits
- ✅ Complete data privacy
- ✅ Custom branding

### Requirements:
- Server with public IP and domain name
- Ubuntu 20.04 or 22.04 recommended
- Minimum 2 CPU cores, 4GB RAM
- Good bandwidth (at least 1 Mbps per participant)

### Setup Steps:

1. **Install Jitsi Meet:**
   ```bash
   # Add Jitsi repository
   echo 'deb https://download.jitsi.org stable/' | sudo tee /etc/apt/sources.list.d/jitsi-stable.list
   wget -qO - https://download.jitsi.org/jitsi-key.gpg.key | sudo apt-key add -
   sudo apt update

   # Install Jitsi Meet
   sudo apt install jitsi-meet
   ```

2. **Configure Domain:**
   - During installation, enter your domain name
   - Set up SSL certificate (Let's Encrypt recommended)
   - Configure DNS records

3. **Configure Environment Variables:**
   ```env
   VITE_JITSI_DOMAIN=your-jitsi-domain.com
   ```

4. **Secure Your Installation:**
   - Set up firewall rules
   - Configure authentication (optional)
   - Enable recording (optional)

### Official Documentation:
- [Jitsi Self-Hosting Guide](https://jitsi.github.io/handbook/docs/devops-guide/)
- [Jitsi Handbook](https://jitsi.github.io/handbook/)

## Current Implementation

The app currently supports:
- ✅ Public Jitsi (`meet.jit.si`) - Has lobby restrictions
- ✅ Custom Jitsi domain (self-hosted)
- ✅ JaaS (Jitsi as a Service) - Recommended

### Configuration Priority:
1. If `VITE_JITSI_APP_ID` is set → Uses JaaS (8x8.vc)
2. If `VITE_JITSI_DOMAIN` is set → Uses custom domain
3. Otherwise → Falls back to `meet.jit.si` (public, has restrictions)

## Troubleshooting

### "membersOnly" / "lobby" Errors:
- **Cause:** Public Jitsi instance routing rooms to lobby
- **Solution:** Use JaaS or self-hosted Jitsi

### JWT Token Errors:
- **Cause:** Invalid or expired JWT token
- **Solution:** Regenerate token server-side with correct payload

### Connection Issues:
- **Cause:** Firewall blocking ports
- **Solution:** Ensure ports 80, 443, 10000/UDP are open

## Next Steps

1. **For Quick Setup:** Use JaaS (Option 1) - Sign up at https://jaas.8x8.vc/
2. **For Production:** Consider self-hosting or JaaS Business Plan
3. **For Development:** Public Jitsi works but has limitations

