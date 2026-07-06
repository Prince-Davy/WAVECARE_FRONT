#!/bin/bash

WORKSPACE="/var/workspace/wavecare-front"
TARGET_DIR="${WORKSPACE}/target"

# --- Chrome setup for Karma CI ---
export CHROME_BIN="${CHROME_BIN:-/usr/bin/chromium}"
export NO_AT_BRIDGE=1

# Clean invalid DBus env variables inherited from the container/agent
unset DBUS_SESSION_BUS_ADDRESS
unset DBUS_SYSTEM_BUS_ADDRESS

# Optional system bus for Chromium, without forcing address variables
mkdir -p /run/dbus
rm -f /run/dbus/pid
dbus-daemon --system --fork || true

mkdir -p /tmp/chrome-headless
chmod 777 /tmp/chrome-headless

echo "--- Chrome / DBus diagnostic ---"
echo "CHROME_BIN=${CHROME_BIN}"
"${CHROME_BIN}" --version || true
env | grep '^DBUS_' || true
echo "--------------------------------"

cd "$WORKSPACE"

exitcode=0

mkdir -p "${TARGET_DIR}/coverage" "${TARGET_DIR}/documentation"

# --- Installation des dépendances ---
npm install
if [ $? -ne 0 ]; then
  echo "npm install failed"
  exit 1
fi

# --- Tests + couverture ---
npm run test:ci
if [ $? -ne 0 ]; then
  echo "test:ci failed"
  exitcode=1
fi

# --- Documentation (Compodoc) ---
npm run docs:compodoc:check
if [ $? -ne 0 ]; then
  echo "docs:compodoc:check failed — run 'npm run docs:compodoc' locally to fix documentation coverage"
  exitcode=1
fi

# --- Copie des artefacts ---
[ -d "${WORKSPACE}/coverage" ]      && cp -R "${WORKSPACE}/coverage/."      "${TARGET_DIR}/coverage/"      || true
[ -d "${WORKSPACE}/documentation" ] && cp -R "${WORKSPACE}/documentation/." "${TARGET_DIR}/documentation/" || true

# --- Badge de couverture ---
COVERAGE_JSON="${WORKSPACE}/coverage/coverage-summary.json"

if [ ! -f "$COVERAGE_JSON" ]; then
  echo "Coverage report not found: $COVERAGE_JSON"
  anybadge --value="Failed" --file="${TARGET_DIR}/coverage.svg" --label=coverage -c red -o
  exit 1
fi

cov=$(python3 -c "
import json
with open('${COVERAGE_JSON}') as f:
    data = json.load(f)
print(data['total']['lines']['pct'])
")

echo "Coverage lines: ${cov}%"

if [ -z "$cov" ]; then
  echo "Coverage parsing failed"
  anybadge --value="Failed" --file="${TARGET_DIR}/coverage.svg" --label=coverage -c red -o
  exitcode=1
elif [[ $(bc -l <<< "$cov < 20") -eq 1 ]]; then
  echo "Coverage under 20% ($cov%)"
  anybadge --value="${cov}%" --file="${TARGET_DIR}/coverage.svg" --label=coverage -c red -o
  exitcode=1
else
  echo "Coverage above 20% ($cov%)"
  anybadge --value="${cov}%" --file="${TARGET_DIR}/coverage.svg" --label=coverage -c green -o
fi

echo "--- target content ---"
find "${TARGET_DIR}" -maxdepth 3 -type f | sort || true

exit $exitcode