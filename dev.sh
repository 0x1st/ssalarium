#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd uv
require_cmd npm

pids=()

cleanup() {
  for pid in "${pids[@]:-}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid" >/dev/null 2>&1 || true
    fi
  done
  wait >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

echo "Starting backend (FastAPI)..."
(
  cd "$ROOT_DIR/backend"
  uv sync
  uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
) &
pids+=("$!")

echo "Starting frontend (Vite)..."
(
  cd "$ROOT_DIR/frontend"
  npm install
  npm run dev
) &
pids+=("$!")

wait
