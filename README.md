# Alex's Grill makin'

A lightweight browser game where Alex cooks barbecue ribs and potato chips in a basement kitchen, then serves them in the middle of the street for a critic's grade.

## Run locally

Open `index.html` directly in a browser, or serve locally:

```bash
npm run start
```

Then visit `http://localhost:8000`.

## Validation

```bash
npm run lint
```

## Make PRs successfully

If you couldn't create a pull request before, it's usually because the branch wasn't pushed to a remote.

1. Add your GitHub remote (one-time):
   ```bash
   git remote add origin <your-repo-url>
   ```
2. Push your branch:
   ```bash
   git push -u origin work
   ```
3. Open GitHub and click **Compare & pull request**.

A CI workflow is included at `.github/workflows/ci.yml` so PRs automatically run `npm run lint`.
