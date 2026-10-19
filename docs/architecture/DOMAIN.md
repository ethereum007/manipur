# Custom domain preparation

The current publication is GitHub Pages at https://ethereum007.github.io/manipur/. No new domain has been selected or configured yet.

When the owner supplies the registered domain, configure it in GitHub Pages and DNS, then set the repository Actions variable CUSTOM_DOMAIN to the hostname. The build writes public/CNAME and switches NEXT_PUBLIC_BASE_PATH to the root path. Font, map, relief and PDF URLs use that base path. Do not include a URL scheme or path in CUSTOM_DOMAIN.

Keep the GitHub Pages build passing, verify DNS and HTTPS, check root and deep routes, font/geography requests and the PDF link, and confirm the old project URL redirects. No local checkout, dependency installation or project files are needed.
