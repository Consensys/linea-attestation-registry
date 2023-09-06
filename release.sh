#!/bin/bash

set -e

git config user.name github-actions[bot]
git config user.email github-actions[bot]@users.noreply.github.com

git checkout main

git merge --no-edit --no-ff dev
git push origin main

git checkout dev
git rebase main
git push origin dev
