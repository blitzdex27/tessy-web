# Agent guide for tessy-web

This repo is Tessy's public website: the home page, Support, the Privacy Policy and the Terms of Use. It is usually
cloned as `web/` inside the Tessy workspace; the workspace's `AGENTS.md` covers work that spans repos.

## What's here

- Plain HTML and CSS, with no build step and no scripts:
  - `index.html` and `home.css`: the home page.
  - `support/`, `legal/privacy/` and `legal/terms/`: an `index.html` each, all styled by `legal/style.css`.
  - `images/`: the icons and the home page's hero image.
- Brand masters and store media live in `tessy-marketing`. This repo keeps only the files the pages serve.

## Publishing

- GitHub Pages builds the site from the root of `main` and serves it at <https://blitzdex27.github.io/tessy-web/>.
  A push to `main` is live within a few minutes.
- Pages runs Jekyll, which publishes a Markdown file as a page. `_config.yml` keeps `AGENTS.md` and `CLAUDE.md` off
  the site; list any other file that isn't part of the site there too.
- Don't move or rename the four pages. The iOS app links to the terms and privacy pages
  (`IDSnapper/Shared/LegalLinks.swift`), and the App Store listing points at the home, support and privacy pages
  (`Tools/AppStore/update-store-metadata.swift`). Both files are in the iOS repo.
- Links between pages stay relative (`../legal/privacy/`), because the site lives under `/tessy-web/`.

## Branches

- `main` is the live site. Do work on your own branch, in a worktree
  (`git worktree add .claude/worktrees/<task> -b claude/<task> origin/main` for Claude Code,
  `.codex/worktrees/<task>` for Codex), and merge into `main` only when Dexter asks: merging publishes.
- A change that also touches another Tessy repo (the iOS app's store copy, say) uses the same branch name in each.
- To preview a worktree, run `python3 -m http.server 8000` in it and open <http://localhost:8000/>.

## Content rules

- The App Review 1.1.6 rule in the iOS repo's `AGENTS.md` covers this site's wording too. Before merging, run the
  iOS repo's check from your worktree; it must print PASS:
  `python3 ~/.development-workspace/tessy/ios/Tools/AppStore/check-review-policy.py --web-root .`
- What the site says about the app (price, availability, languages, features) must match the app and its App Store
  listing.
- Every page's footer keeps the developer line, links to the other pages, and the copyright and Apple trademark line.
