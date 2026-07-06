#!/bin/bash

WORKSPACE="/var/workspace/wavecare-front"
TARGET_DIR="${WORKSPACE}/target"

# --- Chrome setup for Karma CI ---
export CHROME_BIN="${CHROME_BIN:-/usr/bin/chromium-shell}"
export NO_AT_BRIDGE=1

# Clean invalid DBus env variables inherited from the container/agent
unset DBUS_SESSION_BUS_ADDRESS
unset DBUS_SYSTEM_BUS_ADDRESS

mkdir -p /tmp/chrome-headless
chmod 777 /tmp/chrome-headless

echo "--- Chrome / DBus diagnostic ---"
echo "CHROME_BIN=${CHROME_BIN}"
"${CHROME_BIN}" --no-sandbox --version || true
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
# --- Tests + couverture ---
TEST_LOG="${TARGET_DIR}/test-ci.log"

timeout 10m npm run test:ci 2>&1 | tee "$TEST_LOG"
test_status=${PIPESTATUS[0]}

if [ "$test_status" -eq 124 ]; then
  if grep -Eq "TOTAL: [0-9]+ SUCCESS" "$TEST_LOG" && [ -f "${WORKSPACE}/coverage/coverage-summary.json" ]; then
    echo "test:ci reached SUCCESS and coverage was generated, but Karma did not exit cleanly. Continuing."
    test_status=0
    pkill -f chromium || true
    pkill -f chrome || true
    pkill -f karma || true
  else
    echo "test:ci timed out before successful completion"
  fi
fi

if [ "$test_status" -ne 0 ]; then
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