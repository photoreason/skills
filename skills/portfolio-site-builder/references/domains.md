# Gather and connect a web address

A domain is the address people type, such as `janedoe.com`. It is separate from
the company hosting the website. A user can register with Namecheap, GoDaddy,
Squarespace Domains, or Cloudflare Registrar and host the template on Cloudflare
Pages. Keep an existing registration; a transfer is not a prerequisite.

## During resource gathering

Ask whether they already own a domain and where it is registered. Otherwise help
them consider a few clear names, based on their own name or studio. Don't impose
a suffix or purchase a name before they have reviewed availability and costs.

Check the chosen provider's official search and renewal terms. Include relevant
privacy, taxes, and renewal charges when comparing. Explain that they can use a
Cloudflare `*.pages.dev` address for the first publication and add a custom domain
later. Squarespace provides preview/built-in addresses; confirm its current plan
requirements before promising public publishing.

The user signs into their own registrar and reviews any purchase. In Computer-use
mode, you can help navigate the agreed screens with an available tool, but hand
over sign-in, verification, and payment entry. No passwords belong in chat.

## After the preview is approved

For the Cloudflare site, follow [deploy-static.md](deploy-static.md#connect-the-web-address)
and the live custom-domain instructions. Root/apex and subdomain setup differ;
explain that before changing nameservers. Keep the existing registrar and preserve
email and unrelated records. Use exact values from the hosting project.

For Squarespace, use its current domain-connection workflow. An externally
registered domain can remain with its provider. Confirm the resulting address and
HTTPS in a fresh browser tab. State any access checks still pending for the
intended audience; do not promise a domain change will solve network restrictions.
