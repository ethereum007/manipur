# Mandate Terrain domain

Configured 19 October 2026. Site brand: Mandate Terrain — Manipur Analysis.

- GitHub Pages custom domain: mandateterrain.com.
- Repository Actions variable CUSTOM_DOMAIN: mandateterrain.com; root-path build.
- GoDaddy apex A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153. TTL 600 seconds.
- www CNAME: ethereum007.github.io.
- Existing nameservers, domain-connect and DMARC records retained.
- Google and Cloudflare public DNS plus authoritative GoDaddy nameserver return GitHub addresses.
- Certificate approved for apex and www; HTTPS enforcement enabled. Certificate-validated root/deep routes, fonts, map JSON and PDF return 200. www redirects to the apex.
- Source, dependencies, testing, PDFs and review images remain in GitHub; no local project installation.
