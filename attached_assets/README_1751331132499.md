# thegoodeth Safe Dashboard

## Setup & Deployment

1. Clone this repo.

2. Create a `.env` file in the root with these variables:

```
REACT_APP_SAFE_ADDRESS=0x821f2b40d965b81202b181Aba1c7a380C49Ed675
REACT_APP_ARBISCAN_API_KEY=YourArbiscanApiKeyHere
REACT_APP_GITHUB_REPO=thegoodeth12/Safe-bot
REACT_APP_DISCORD_WEBHOOK=https://discord.com/api/webhooks/1384032499830882454/ijOIBfKKjbdgpULAPicki2Zlch0-ADDiZTYr1tX2LhLCo3tTmRP-bbl2L-CNKUrwZgaU
```

3. Run:

```bash
npm install
npm start
```

4. For production deployment, run:

```bash
npm run build
```

5. Deploy the build folder on Vercel or your favorite static host.

6. Configure your custom domain `Chatgtp-bot-reown.xyz` on Vercel dashboard.

---

### Features

- Live Safe Wallet ETH balance & last 10 txns from Arbitrum  
- GitHub repo stats (stars, forks, open issues)  
- Discord webhook alert test button

---

Made for thegoodeth by ChatGPT v2.
