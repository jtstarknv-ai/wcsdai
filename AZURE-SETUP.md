# Move the WCSD AI Hub from Vercel to Azure Static Web Apps

The repo is ready. This is the same hosting pattern as WCSD Walk (Azure SWA, deploy = git
push to `main`, GitHub Actions does the rest). Everything below is a one-time portal setup,
about 5 minutes.

## What's already in the repo

- `staticwebapp.config.json` — SWA config: hash-routing fallback to index.html, correct
  MIME types, sensible caching (logos cached a week, index.html always fresh so updates
  appear immediately).
- Site files at repo root (`index.html`, `logos/`, `WCSD-TEACH-One-Pager.pdf`). No build
  step. This is exactly what SWA's "Custom" preset expects.

## One-time setup (Azure portal)

1. Portal > **Create a resource** > **Static Web App**.
2. Subscription / resource group: whichever you used for WCSD Walk (or a new RG like
   `rg-wcsd-aihub`).
3. Name: `wcsd-aihub` (or your preference). Plan: **Free**. Region: West US 2 or closest.
4. Deployment source: **GitHub**. Sign in as **jtstarknv-ai**.
   - Organization: `jtstarknv-ai`
   - Repository: `wcsdai`
   - Branch: `main`
5. Build presets: **Custom**
   - App location: `/`
   - Api location: *(leave empty)*
   - Output location: *(leave empty)*
6. **Review + create** > **Create**.

Azure will then, automatically:
- commit a workflow file to the repo (`.github/workflows/azure-static-web-apps-<name>.yml`),
- add the deployment token as a repo secret,
- run the first deployment (~1-2 min) and give you the `https://<name>.azurestaticapps.net` URL.

## After the first Azure deploy succeeds

1. Verify the Azure URL: nav works, AI Uses folder tabs work, TEACH PDF downloads.
2. **Disconnect Vercel** so pushes stop double-deploying: Vercel dashboard > `wcsdai`
   project > Settings > Git > Disconnect (or just delete the project). Do this only after
   the Azure URL checks out. wcsdai.vercel.app will stop serving after removal, so update
   any links you have shared (email footers, Teams posts, QR codes).
3. Optional custom domain: SWA > Custom domains > Add. If the district gives you a
   CNAME (e.g., aihub.washoeschools.net), point it at the azurestaticapps.net host.

## Day-to-day from here

Unchanged: edit `site/index.html` in the OneDrive folder, sync it to the repo root
`index.html`, commit, push to `main`. GitHub Actions deploys to Azure automatically.
The Vercel deploy scripts (`deploy/deploy.ps1`) are legacy after cutover.

## Rollback

Azure SWA redeploys whatever is on `main`; to roll back, `git revert` the bad commit and
push. GitHub Actions history (repo > Actions tab) shows every deploy.

## Contact form email (one-time, ~5 minutes)

The repo ships a working `/api/contact` function that silently emails form submissions
to ai@washoeschools.net. It needs one credential from you:

1. Portal > Create a resource > **Communication Services** (same resource group). Name: `wcsd-aihub-comms`.
2. Open it > **Email** > **Provision domains** > **Add an Azure managed domain** (free, instant,
   no DNS work). Note the sender it gives you, like `DoNotReply@xxxxxx.azurecomm.net`.
3. Communication Services resource > **Keys** > copy the **Connection string**.
4. Static Web App (`wcsd-aihub`) > **Environment variables** (Application settings) > add:
   - `ACS_CONNECTION_STRING` = the connection string
   - `CONTACT_SENDER` = the DoNotReply sender address
   - `CONTACT_TO` = ai@washoeschools.net (optional, this is the default)
5. Save. No redeploy needed; settings apply to the API immediately.

Until these are set, the form automatically falls back to opening the teacher's district
email with the message prefilled, so nothing breaks in the meantime. Replies go to the
teacher because the function sets their address as reply-to.
