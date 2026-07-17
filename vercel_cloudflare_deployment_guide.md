# Vercel & Cloudflare Deployment Guide

This guide walks you through deploying your **Medium Clone** application to Vercel and routing it through Cloudflare to secure it with DDoS mitigation, custom SSL, and firewall rules—all at **100% zero cost**.

---

## Part 1: Vercel Deployment & Environment Setup

Vercel will host your application's frontend and serverless API endpoints. It integrates directly with GitHub for automated CI/CD.

### Step 1.1: Import Project to Vercel
1. Navigate to the **[Vercel Dashboard](https://vercel.com/new)**.
2. Sign in using your **GitHub account**.
3. Locate the `Medium-clone` repository under your import list and click **Import**.

### Step 1.2: Configure Environment Variables
Before clicking "Deploy", scroll down to the **Environment Variables** section and add the credentials from your local `.env` file:

| Variable Name | Description / Value |
| :--- | :--- |
| `DATABASE_URL` | Your Neon PostgreSQL connection string. |
| `NEXTAUTH_SECRET` | Your secure base64 secret (e.g., `5fW1waRUffLdKh/8RGHgJuviI3EuPXY0K3RaLFVghcU=`). |
| `NEXTAUTH_URL` | Leave blank during initial build. Once Vercel assigns your project domain (e.g. `https://yourproject.vercel.app`), update this to that URL to secure session callbacks. |

> [!NOTE]
> If you have a free **Cloudinary** account, add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to enable live photo storage. If not, the application will gracefully fall back to returning Unsplash stock placeholder images.

### Step 1.3: Trigger Build
- Click **Deploy**. Vercel will build your application, execute our database `"postinstall": "prisma generate"` script automatically, compile the route trees, and assign you a free `*.vercel.app` subdomain!

---

## Part 2: Custom Domains & Cloudflare Setup

To transition from a `.vercel.app` subdomain to a custom branded domain, you can register a free domain and proxy it via Cloudflare.

### Step 2.1: Register a Free Domain
You can obtain a custom domain name for free through one of these methods:
* **GitHub Student Developer Pack**: If you are a student, apply to get a free `.tech`, `.me`, or `.live` domain for 1 year from Namecheap/Name.com.
* **Free Subdomain alternatives**: Use the free Vercel subdomain (`your-project.vercel.app`), or apply for free DNS registers like `.eu.org` (requires approval time).

### Step 2.2: Mount Domain on Cloudflare
Cloudflare acts as your secure DNS manager and security shield.
1. Sign up for a free account at **[Cloudflare](https://dash.cloudflare.com/sign-up)**.
2. Click **Add a Site** and enter your custom domain name.
3. Select the **Free Plan** ($0/month) and click Continue.
4. Cloudflare will scan your existing domain records and output a pair of **Cloudflare Nameservers** (e.g., `ashley.ns.cloudflare.com` and `ben.ns.cloudflare.com`).
5. Log into the registrar where you registered your domain (Namecheap, Name.com, etc.), locate your domain settings, and **replace the default nameservers** with the Cloudflare nameservers.
6. Await DNS propagation (can take between 5 minutes to 24 hours depending on the registrar).

---

## Part 3: DNS Routing & Cloudflare Proxy Settings

Once Cloudflare controls your domain's DNS, you need to route traffic from Cloudflare's servers to Vercel's hosting servers.

### Step 3.1: Add Vercel DNS Records in Cloudflare
In your Cloudflare Dashboard, go to **DNS > Records** and add two records:

1. **A Record (for root domain):**
   * **Type**: `A`
   * **Name**: `@` (represents your root domain, e.g., `example.com`)
   * **IPv4 Address**: `76.76.21.21` (Vercel's global IP address)
   * **Proxy status**: **Proxied** (Orange Cloud icon enabled)
2. **CNAME Record (for www subdomain):**
   * **Type**: `CNAME`
   * **Name**: `www`
   * **Target**: `cname.vercel-dns.com`
   * **Proxy status**: **Proxied** (Orange Cloud icon enabled)

> [!IMPORTANT]
> The **Proxied (Orange Cloud)** status must be enabled. This hides your Vercel server's origin IP and forces all visitors to pass through Cloudflare's global DDoS mitigation edge nodes first.

### Step 3.2: Map Custom Domain in Vercel
1. Go to your project page in the **Vercel Dashboard**.
2. Go to **Settings > Domains**.
3. Add your custom domain (e.g., `example.com` or `www.example.com`).
4. Select the option that routes `www.example.com` to `example.com` (or vice-versa) for clean canonical routing.
5. Vercel will detect the DNS configuration and complete validation.

---

## Part 4: SSL/TLS Security & DDoS Protections

With Cloudflare proxying your traffic, you must configure SSL transport encryption and trigger active DDoS shields.

### Step 4.1: Configure SSL/TLS Encryption Mode
1. In your Cloudflare Dashboard, go to **SSL/TLS > Overview**.
2. Set the SSL/TLS encryption mode to **Full (Strict)**.
   * **Why?** Since Vercel automatically creates a free Let's Encrypt SSL certificate for your custom domain, setting this to **Full (Strict)** ensures that traffic is fully encrypted end-to-end: from the visitor's browser to Cloudflare (using Cloudflare's SSL) and from Cloudflare to Vercel (using Vercel's SSL). This prevents middleman snooping.

### Step 4.2: Enable HTTP to HTTPS Redirects
1. Go to **SSL/TLS > Edge Certificates** in Cloudflare.
2. Toggle **Always Use HTTPS** to **ON**. This automatically redirects insecure `http://` requests to secure `https://`.

### Step 4.3: Turn on DDoS Mitigation Shield
Cloudflare automatically mitigates volumetric layer 3 and 4 DDoS attacks on the free tier. To protect your server APIs from Layer 7 (application layer) HTTP flood attacks:

1. **Enable Standard WAF Protection:**
   * Go to **Security > WAF (Web Application Firewall)**.
   * Create custom rules to block suspicious traffic (like known bad user-agents or automated bot requests).
2. **Toggle "Under Attack" Mode (Emergency):**
   * If you notice your database connections or Vercel edge functions are being spammed by DDoS bots, go to the **Cloudflare Dashboard Quick Actions** panel on your home screen.
   * Switch the **Security Level** from Medium to **I'm Under Attack!**.
   * **What it does**: This displays a brief 5-second JS challenge page (managed by Cloudflare) to all visitors before redirecting them to your site. This stops bot traffic dead in its tracks while allowing genuine human readers to enter.
