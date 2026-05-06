#!/bin/bash

set -euo pipefail

if [[ "${GITHUB_REF:-}" != "refs/heads/main" ]]; then
  echo "Refusing to run release from GITHUB_REF='${GITHUB_REF:-<unset>}'; expected refs/heads/main." >&2
  exit 1
fi

git config user.name github-actions[bot]
git config user.email github-actions[bot]@users.noreply.github.com

git fetch origin \
  +refs/heads/main:refs/remotes/origin/main \
  +refs/heads/dev:refs/remotes/origin/dev

git checkout -B main refs/remotes/origin/main
git merge --no-edit --no-ff refs/remotes/origin/dev
git push origin HEAD:refs/heads/main

git checkout -B dev refs/remotes/origin/dev
git rebase refs/heads/main
git push origin HEAD:refs/heads/dev
