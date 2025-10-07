# Security Policy

We take security seriously and appreciate responsible disclosures.

## Reporting a Vulnerability

- Email: security@your-domain.example (or open a private advisory on GitHub)
- Include: steps to reproduce, impact, affected URLs/endpoints, and any logs.
- We aim to acknowledge within 72 hours and provide status updates until resolved.

## Scope

- All code in this repository and its deployed services.
- Excludes social engineering, physical attacks, and third‑party platforms.

## Safe Harbor

We will not pursue legal action for good-faith, non-destructive testing within scope and coordinated disclosure.

## Best Practices Deployed

- Strict TLS + HSTS, CSP, security headers
- CI security scans (Semgrep, Gitleaks, npm audit, SBOM, ZAP)
- Rate limiting, input validation, least-privileged secrets
- Regular dependency updates and key rotation

