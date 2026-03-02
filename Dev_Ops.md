/root
  ├─ .ssh/                  # SSH keys, authorized_keys  (already there)
  └─ /apps
      ├─ traefik/           # ONLY Traefik stuff
      │   ├─ docker-compose.yml
      │   └─ .env
      ├─ frontend/          # Frontend repo
      │   ├─ Dockerfile
      │   ├─ docker-compose.yml
      │   └─ (your React code)
      └─ backend/           # Backend repo
          ├─ Dockerfile
          ├─ docker-compose.yml
          └─ (your Hapi code)


to see the Traefic live in terminal, when you hit the url, run -> docker logs traefik -f

To delete all all docker images/ containers: docker system prune -a -f