# Publish the template on Cloudflare Pages

Cloudflare Pages is the recommended host for this static template, including
when the intended audience is in mainland China. Do not automatically replace it
with a regional website builder. Test the actual published address with the
intended audience; do not promise access or speed you have not checked.

Use Guide mode for step-by-step instructions, or the user-granted Computer-use
mode for difficult screens. Both routes need a Cloudflare account. Preview the
finished site locally before uploading. Keep accounts and purchases in the
photographer's name.

## Direct upload: the simpler route

Use the current [Cloudflare Direct Upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/)
as the source for screen names and upload limits.

1. Have the user sign into Cloudflare. Open Workers & Pages and create a Pages
   project using direct upload (drag and drop).
2. Name the project. Upload the prepared website folder or supported ZIP, with
   `index.html` at the site's root—not a parent folder containing another folder.
3. Confirm the intended public content and publish when authorized.
4. Open the resulting `*.pages.dev` address in a fresh tab. Check images,
   navigation, language switching, contact links, and a phone-sized viewport.

Explain before project creation: a direct-upload Pages project cannot later be
switched to Git integration. If they expect automatic updates from Git, choose
that route at the start. Do not describe direct upload as account-free.

## Git integration: automatic updates

Follow the current [Cloudflare Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/).

1. Put the finished site in the user's chosen Git repository and have them
   authorize the required repository access.
2. Create a Pages project connected to it. Select the intended production branch.
3. The supplied template needs no build step. Set the output/root directory to
   the folder containing `index.html`, using the current static-HTML guidance.
4. Explain that later pushes to the production branch publish changes. Deploy
   the reviewed version when authorized, then verify the actual address.

## Connect the web address

Follow [Cloudflare's custom-domain guide](https://developers.cloudflare.com/pages/configuration/custom-domains/).
Add the domain to the Pages project first. A root/apex domain requires the zone
on Cloudflare; a subdomain can use the documented CNAME route at an external DNS
provider. Explain the difference before requesting any nameserver change.

An existing Namecheap, GoDaddy, or Squarespace registration can remain there.
Registration and DNS hosting are different services. Preserve mail and unrelated
records, use the exact values shown for this project, and check HTTPS and the
chosen www/root address after setup. Don't guess propagation times or promise
that a custom domain resolves mainland connectivity issues.

## Update and hand over

- Direct upload: update the local content, preview it, then create a new deployment
  of the same project. Keep a copy of the working website folder.
- Git: update and preview, then publish through the chosen branch workflow.

Give the user the project URL, live address, domain provider, and a short guide
to changing images and text. If publication fails, preserve the files and explain
the failed step. Offer a relevant fix or return to Guide mode; change hosts only
with the user's agreement. An explicitly chosen existing host can be retained.
