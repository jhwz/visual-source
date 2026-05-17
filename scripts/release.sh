#!/usr/bin/env bash
# Cut a release from main: bump version in package.json, tauri.conf.json, and
# Cargo.toml; commit; push main; fast-forward release; push release (which
# triggers .github/workflows/release.yml).
#
# Usage:  bun run release <version>
#         ./scripts/release.sh 0.3.1

set -euo pipefail

VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
	echo "Usage: bun run release <version>   (e.g. 0.3.1)" >&2
	exit 1
fi

if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]]; then
	echo "Version must look like X.Y.Z (got: $VERSION)" >&2
	exit 1
fi

cd "$(git rev-parse --show-toplevel)"

branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$branch" != "main" ]]; then
	echo "Must run from main (currently on '$branch')" >&2
	exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
	echo "Working tree is not clean — commit or stash first" >&2
	exit 1
fi

git fetch origin --tags
if [[ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]]; then
	echo "main is out of sync with origin/main — pull or push first" >&2
	exit 1
fi

tag="visual-source-v$VERSION"
if git rev-parse --verify --quiet "refs/tags/$tag" >/dev/null \
	|| git ls-remote --exit-code --tags origin "$tag" >/dev/null 2>&1; then
	echo "Tag $tag already exists" >&2
	exit 1
fi

# Portable in-place sed (BSD on macOS + GNU on linux both accept -i.bak).
sed_inplace() {
	local expr="$1" file="$2"
	sed -i.bak -E "$expr" "$file"
	rm -f "$file.bak"
}

ver_line='s/^([[:space:]]*"version"[[:space:]]*:[[:space:]]*")[^"]+(".*)$/\1'"$VERSION"'\2/'
sed_inplace "$ver_line" package.json
sed_inplace "$ver_line" src-tauri/tauri.conf.json

# Cargo.toml: rewrite only the first `version = "..."` (the [package] one;
# dependency versions live inside `{ version = "..." }` so anchoring to BOL
# avoids them).
awk -v v="$VERSION" '
	!done && /^version[[:space:]]*=/ { print "version = \"" v "\""; done = 1; next }
	{ print }
' src-tauri/Cargo.toml > src-tauri/Cargo.toml.tmp
mv src-tauri/Cargo.toml.tmp src-tauri/Cargo.toml

# Sanity-check that all three files now agree.
got_pkg="$(grep -E '^[[:space:]]*"version"' package.json | head -1)"
got_tauri="$(grep -E '^[[:space:]]*"version"' src-tauri/tauri.conf.json | head -1)"
got_cargo="$(grep -E '^version[[:space:]]*=' src-tauri/Cargo.toml | head -1)"
for line in "$got_pkg" "$got_tauri" "$got_cargo"; do
	if ! [[ "$line" == *"\"$VERSION\""* ]]; then
		echo "Version rewrite failed — got: $line" >&2
		exit 1
	fi
done

git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "v$VERSION"
git push origin main

git checkout release
git pull --ff-only origin release
git merge --ff-only main
git push origin release
git checkout main

remote_url="$(git remote get-url origin)"
slug="$(echo "$remote_url" | sed -E 's|.*github\.com[:/]([^/]+/[^/.]+)(\.git)?$|\1|')"
echo
echo "Pushed v$VERSION to release. The publish workflow is starting:"
echo "  https://github.com/$slug/actions"
echo "Once builds finish, open the draft release and publish it:"
echo "  https://github.com/$slug/releases"
