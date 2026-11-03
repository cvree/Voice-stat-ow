# Publish and maintain the website

This repository is ready for GitHub Pages. A repository has not been created and a deployment has not been run from this environment. The connected GitHub tools could inspect and edit existing repositories but did not expose repository creation or Pages configuration.

## 1. Create the destination

Sign in as the intended owner and [create a GitHub repository](https://github.com/new) named `voice-stat-ow`. For GitHub Free, use a public repository for Pages; private-repository Pages eligibility depends on your plan. Do not initialize additional files if you are uploading this complete folder.

Keep the analysis application separate. Neither repository should contain session data or secrets. A public website is a publishing surface, not a private coaching dashboard.

## 2. Verify and push

Open a terminal inside this website folder:

```bash
npm run verify
git init -b main
git add .
git commit -m "Build Voice Stat - OW public website and review lab"
git remote add origin https://github.com/cvree/voice-stat-ow.git
git push -u origin main
```

The URL assumes the owner `cvree` and the repository name `voice-stat-ow`. Change it if necessary. Authenticate using GitHub’s supported Git sign-in flow; never put a token into a committed file. If this folder is already a Git checkout, inspect its status and remotes before initializing or adding a remote.

## 3. Enable Pages and run the workflow

In the repository, open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**. Then open **Actions → Verify and deploy Pages → Run workflow**, choose `main`, and run it.

The first push may fail its Pages configuration step if you have not enabled Pages yet. Enable the source, then rerun the workflow. Repository policies may require an owner to enable Actions or approve environment deployment.

The workflow builds and verifies before uploading only `dist/`. Its deploy job depends on verification, uses the `github-pages` environment, and receives only the Pages/OIDC permissions it needs. Pull requests run verification but never upload a Pages artifact or deploy production. A push to `main` redeploys after checks pass.

## 4. Confirm the actual URL

Use the URL displayed by the successful workflow/environment. With the exact account/repository above, the expected address is:

```text
https://cvree.github.io/voice-stat-ow/
```

That is an expected address, not a statement that a site is currently live. Check homepage assets, all documentation links, mobile navigation, lab tabs, filters, offset control, notes, and export at the live URL. GitHub project sites use a repository subpath; all internal assets here are relative.

## 5. Add real project links

Set `repositoryUrl` in `site.config.json` after the new repository exists. `applicationUrl` is reserved for an actual separate application source destination; it is currently empty. No public application download link is fabricated when either is empty. Commit and push to update the website.

## Maintain and recover

- Use pull requests for review. Require the `verify` job in repository rules if you want to prevent unverified merges; this workflow alone does not configure branch protection.
- Keep Actions updated through the supplied Dependabot configuration. Major versions are pinned; organizations can additionally pin reviewed full commit SHAs.
- To roll back, revert the problematic website commit, push to `main`, and verify the new deployment. Avoid force-pushing production history.
- If the build fails, run `npm run verify` locally and fix the reported link, anchor, fixture, or renderer error.
- If deployment fails after verification, check Pages source, Actions policy, environment rules, and repository plan eligibility.
- A custom domain is optional. Configure it through Pages settings and verify its DNS/HTTPS according to GitHub’s guide before advertising it.

## Official references

- [Custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Configuring the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages documentation](https://docs.github.com/en/pages)

Reviewed November 3, 2026. Provider UI, plans, and policies can change; the current GitHub documentation governs those details.
