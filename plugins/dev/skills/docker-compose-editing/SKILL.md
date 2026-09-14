---
name: docker-compose-editing
description: "Safely create, modify, or diagnose docker-compose.yml files across a self-hosted service stack. Use when: Adding a new service, Changing volumes, networks, environment files, Migrating containers to new storage locations, Debugging service startup issues."
metadata:
  category: dev
---

## Purpose
Safely create, modify, or diagnose docker-compose.yml files across a self-hosted service stack.

## When to Use
- Adding a new service
- Changing volumes, networks, environment files
- Migrating containers to new storage locations
- Debugging service startup issues

## Inputs Required
- The current docker-compose.yml
- The desired change
- Port mappings, volume paths, .env locations
- Networking mode (bridge, host, macvlan, tailscale exposure)

## Outputs Produced
- Updated compose snippet or full file
- Validation notes (does YML parse? conflicting ports?)
- Service dependency graph
- Post-change run instructions

## Workflow
1. **Validate YAML structure** - Check syntax, indentation, version compatibility
2. **Identify dependencies** - Service dependencies, network paths, volume mounts
3. **Check current state** - Running containers, volume locations, network configs
4. **Apply targeted edits** - Minimal changes, preserve existing config
5. **Verify syntax** - YAML validation, port conflicts, volume paths exist
6. **Output updated config** - Full file or targeted snippet
7. **Provide restart instructions** - `docker-compose down/up` sequence
8. **Verification steps** - Check logs, test endpoints, confirm volumes

## Constraints & Guardrails
- Never overwrite volumes blindly.
- Do not assume a service uses host networking.
- Keep formatting consistent with industry-standard Compose style.

## Integration Points
- Homelab Change Plan Skill
- Proxmox storage migration operations

## Example Usage

**Common Operations:**
- Add new service to existing stack
- Change volume mounts to new storage location
- Update environment variables or .env file references
- Modify network configuration (bridge, host, macvlan)
- Add health checks or restart policies
- Update image versions or tags

**Example: Adding Service**
```yaml
services:
  new-service:
    image: service:latest
    container_name: new-service
    volumes:
      - /srv/appdata/new-service:/data
    environment:
      - VAR=value
    networks:
      - default
    restart: unless-stopped
```

**Example: named volume → bind mount**

Switch when you want the written data inspectable from the host; keep the named
volume when nothing outside Docker reads it.

```yaml
# Before — named volume, managed by Docker, opaque from the host
volumes:
  - app-data:/data

# After — bind mount under the app directory, readable from the host
volumes:
  - ./data:/data
```

The bind mount needs `user: "1000:1000"` on the service, or the container writes
as root and the files are unreadable from the host — the exact problem the change
was meant to solve. See the `new-app` skill's
`references/compose-and-containers.md`.

**Check whether the Docker data-root has been relocated**, which is common when
`/var/lib/docker` is a symlink onto a larger disk. Do not write either path into
a compose file: named volumes are referenced by name, not by their on-disk
location.

## Anti-Patterns
- Mixing tabs and spaces (use 2 spaces)
- Reconstructing entire files unnecessarily
- **Changing volume paths without stopping containers first** - Always `docker-compose down` before volume changes
- **Not checking volume existence** - Verify volumes exist or will be created
- **Port conflicts** - Always check `docker ps` for existing port mappings
- **Hardcoding paths** - Use environment variables or relative paths when possible
- **Not preserving restart policies** - Maintain existing restart: unless-stopped patterns
