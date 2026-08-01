# Security Policy

## Reporting a vulnerability

If you believe you've found a security issue in this repository — a skill, the
portfolio template, the registry pipeline, or the generated `registry.json` —
thank you for taking the time to investigate it responsibly. We welcome
good-faith security research and ask that you contact us **privately** before
disclosing the issue publicly:

- **Email: [contact@photoreason.com](mailto:contact@photoreason.com)** with the
  subject line `[SECURITY] skills`.
- Please **do not open a public issue or pull request** for security reports.

Include what you can: a description of the issue, steps to reproduce or a
proof of concept, the affected file(s)/skill(s), and any suggested fix. If you
prefer, you can also use GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
on this repository.

## What to expect

- **Acknowledgement** of your report within **72 hours**.
- An assessment and, for confirmed issues, a fix or mitigation plan — we aim to
  resolve confirmed vulnerabilities within **30 days**.
- Credit in the release notes if you'd like it (tell us how you want to be
  named), or anonymity if you prefer.

We ask that you give us a reasonable window to remediate before any public
disclosure.

## Good-faith research

Please avoid privacy violations, data destruction, service disruption, and
accessing more data than is necessary to demonstrate the issue. If you discover
private information, stop testing and include that fact in your private report.
We will work constructively with researchers who follow this policy and make a
good-faith effort to avoid harm.

## Supported versions

Only the latest release (the `main` branch and the most recent tagged version)
receives security fixes.

## Scope notes

- **Skills are instructions executed by AI coding agents.** Prompt-injection
  vectors, instructions that could exfiltrate user data, and anything that
  would cause an agent to take unsafe actions are all in scope — treat them as
  vulnerabilities, not content bugs.
- **The portfolio template** ships to end users' websites; XSS or unsafe
  handling of user-provided content in `templates/` is in scope.
- **Dependencies / supply chain:** this repository is monitored by the
  [Socket](https://socket.dev) security platform, which scans every pull
  request and the dependency graph for supply-chain risks. Socket alerts are
  triaged by the maintainers; you're still welcome to report anything Socket
  misses.

Thank you for helping keep photographers' sites and the skills ecosystem safe.
