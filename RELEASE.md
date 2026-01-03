# Release Guide

This guide explains how to create a new release and publish Docker images.

## Creating a Release

### 1. **Tag a Release**
```bash
# Create a version tag (e.g., v1.0.0)
git tag -a v1.0.0 -m "Release v1.0.0: Etherlink integration"
git push origin v1.0.0
```

### 2. **Create GitHub Release**
1. Go to: https://github.com/etherlink-intern/revoke.cash/releases/new
2. Select your tag (e.g., `v1.0.0`)
3. Title: `v1.0.0 - Etherlink Integration`
4. Description: Describe the changes
5. Click **"Publish release"**

This will automatically trigger the Docker build workflow.

---

## Using the Published Docker Image

Once the release is published, users can pull the image:

```bash
# Pull the latest release
docker pull ghcr.io/etherlink-intern/revoke.cash:latest

# Pull a specific version
docker pull ghcr.io/etherlink-intern/revoke.cash:v1.0.0

# Run the container
docker run -p 3000:3000 \
  -e IRON_SESSION_PASSWORD="your-session-password" \
  -e NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-id" \
  ghcr.io/etherlink-intern/revoke.cash:latest
```

---

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **Major (v1.0.0)**: Breaking changes
- **Minor (v1.1.0)**: New features (backward compatible)
- **Patch (v1.0.1)**: Bug fixes

### Examples:
- `v1.0.0` → First stable release with Etherlink support
- `v1.1.0` → Add new chain support
- `v1.0.1` → Fix Blockscout parsing bug

---

## GitHub Container Registry (GHCR)

Images are published to: `ghcr.io/etherlink-intern/revoke.cash`

**Available tags:**
- `latest` - Most recent release
- `v1.0.0` - Specific version
- `v1.0` - Minor version (always points to latest patch)
- `v1` - Major version (always points to latest minor)

---

## Make Image Public

After the first release, make the package public:

1. Go to: https://github.com/etherlink-intern/revoke.cash/pkgs/container/revoke.cash
2. Click **"Package settings"**
3. Scroll to **"Danger Zone"**
4. Click **"Change visibility"** → **"Public"**

This allows anyone to pull the image without authentication.
