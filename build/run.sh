#!/bin/bash

set -uo pipefail

set -x
export PATH="/root/.local/bin:$PATH"

WORKSPACE="/var/workspace/wavecare-front"
TARGET_DIR="${WORKSPACE}/target"

echo "=== START run.sh ==="
echo "Current user: $(whoami)"
echo "Workspace: ${WORKSPACE}"

cd "$WORKSPACE" || {
  echo "Cannot cd to ${WORKSPACE}"
  exit 1
}

echo "[INFO] node: $(node --version)"
echo "[INFO] npm: $(npm --version)"

echo "=== START run.sh ==="
echo "Current user: $(whoami)"
echo "Workspace: ${WORKSPACE}"

cd "$WORKSPACE" || {
  echo "Cannot cd to ${WORKSPACE}"
  exit 1
}


exitcode=0

mkdir -p "${TARGET_DIR}/coverage" "${TARGET_DIR}/documentation"


# --- Installation des dépendances ---


echo "=== npm install ==="

if ! npm ci; then
  echo "npm ci failed"

echo "=== npm install ==="
npm install

npm ci

if [ $? -ne 0 ]; then
  echo "npm ci failed"

  exit 1
fi


# --- Tests + couverture ---

echo "=== npm run test:ci ==="

if ! npm run test:ci; then

echo "=== npm run test:ci ==="
npm run test:ci
if [ $? -ne 0 ]; then

  echo "test:ci failed"
  exitcode=1
fi

echo "=== npm run docs:compodoc:check ==="
npm run docs:compodoc:check
if [ $? -ne 0 ]; then

  echo "docs:compodoc:check failed"
  exitcode=1
fi

# --- SonarQube Scan ---
if [ -z "${SONAR_TOKEN:-}" ]; then
  echo "[WARNING] SONAR_TOKEN not set, skipping SonarQube scan"
else
  echo "[INFO] Running SonarQube scan..."
  echo "[INFO] Current working directory: $(pwd)"

  # Verify sonar-project.properties exists
  if [ ! -f "${WORKSPACE}/sonar-project.properties" ]; then
    echo "[ERROR] sonar-project.properties not found at ${WORKSPACE}/sonar-project.properties"
    ls -la "${WORKSPACE}" | grep sonar || true
    exitcode=1
  else
    echo "[INFO] Found sonar-project.properties"
    ls -la "${WORKSPACE}/sonar-project.properties"

    # Verify lcov.info exists
    if [ ! -f "${WORKSPACE}/coverage/lcov.info" ]; then
      echo "[WARNING] lcov.info not found - coverage report will not be included in scan"
    else
      echo "[INFO] Found coverage/lcov.info"
    fi

    if ! npm run sonar:scan; then
      echo "sonar:scan failed"

  echo "docs:compodoc:check failed"

      exitcode=1
    fi
  fi
fi

echo "=== Copy artifacts ==="

echo "=== Copy artifacts ==="

[ -d "${WORKSPACE}/coverage" ]      && cp -R "${WORKSPACE}/coverage/."      "${TARGET_DIR}/coverage/"      || true
[ -d "${WORKSPACE}/documentation" ] && cp -R "${WORKSPACE}/documentation/." "${TARGET_DIR}/documentation/" || true

COVERAGE_JSON="${WORKSPACE}/coverage/coverage-summary.json"

echo "=== Check coverage file ==="
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

echo "=== END run.sh with exitcode=${exitcode} ==="
exit $exitcode

echo "=== START run.sh ==="
echo "Current user: $(whoami)"
echo "PWD=$(pwd)"
echo "PATH=$PATH"
echo "CHROME_BIN=$CHROME_BIN"
echo "Workspace: ${WORKSPACE}"

echo "=== /var/workspace content ==="
ls -la /var/workspace || true

echo "=== workspace content ==="
ls -la "$WORKSPACE" || true

cd "$WORKSPACE" || {
  echo "Cannot cd to ${WORKSPACE}"
  exit 2
}
