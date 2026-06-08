# SonarQube & SonarLint — Connexion rapide

Ceci est un guide court pour connecter votre IDE au serveur SonarQube, tester votre token, et lancer une analyse locale.

## But
- Permettre aux développeurs de voir et corriger les problèmes directement dans l'éditeur via SonarLint (connected mode).
- Fournir des commandes rapides pour tester le token et lancer un scan local si besoin.

## Pré-requis
- Accès réseau au serveur SonarQube: `https://sonarqube.innovation-factory.io` (VPN/proxy si nécessaire).
- Token SonarQube (personal user token). Ne le partagez jamais publiquement.
- Node.js / npm si vous voulez lancer `sonar-scanner` localement.

## Fichiers utiles
- Configuration Sonar du projet: [sonar-project.properties](sonar-project.properties)
- Script NPM pour lancer le scanner: `npm run sonar:scan` ([package.json](package.json))
- Pipeline Azure: [azure-pipeline.yaml](azure-pipeline.yaml)

## 1) VS Code — SonarLint (Connected Mode)
1. Installer l'extension **SonarLint** (SonarSource.sonarlint-vscode). (Elle est recommandée dans `.vscode/extensions.json`.)
2. Ouvrir la Palette (Ctrl+Shift+P) → `SonarLint: Bind to SonarQube or SonarCloud`.
3. `Add SonarQube server` → Server URL: `https://sonarqube.innovation-factory.io` (utiliser l'URL de base, pas `/dashboard...`).
4. Coller votre *User Token* (généré depuis SonarQube → My Account → Security → Generate Token).
5. Sauvegarder la connexion, puis sélectionner le projet `wavecare-front` pour binder le workspace.
6. Lancer `SonarLint: Analyze all files in workspace` ou enregistrer un fichier pour voir les problèmes dans le panneau Problems.

## 2) Tester le token (PowerShell / curl)
> Test rapide de l'API : si la commande renvoie la version Sonar (ex. `25.1.0`), le token fonctionne.

PowerShell:
```powershell
$env:SONAR_TOKEN = 'VOTRE_TOKEN'   # temporaire, ne pas committer
Invoke-RestMethod -Uri 'https://sonarqube.innovation-factory.io/api/server/version' -Headers @{ 
  Authorization = 'Basic ' + [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$env:SONAR_TOKEN:"))
}
```

curl (Linux / WSL / Git Bash):
```bash
curl -u VOTRE_TOKEN: 'https://sonarqube.innovation-factory.io/api/server/version'
```

## 3) Lancer un scan local
- Option A (utiliser le scanner système si installé):
```powershell
#$env:SONAR_TOKEN = 'VOTRE_TOKEN'
#sonar-scanner
```
- Option B (via npm / npx):
```powershell
npm install --save-dev sonar-scanner
$env:SONAR_TOKEN = 'VOTRE_TOKEN'
npx sonar-scanner
# ou utiliser le script du package
npm run sonar:scan
```

Remarque: `sonar-project.properties` doit contenir `sonar.host.url=https://sonarqube.innovation-factory.io` (URL de base).

## 4) Intégration CI (Azure Pipelines)
Le pipeline du projet utilise déjà un Variable Group `sonar_token`. Si vous devez ajouter manuellement les tâches Sonar dans un pipeline, voici un extrait minimal :

```yaml
- task: SonarQubePrepare@5
  inputs:
    SonarQube: 'SonarQubeServiceConnection' # config à créer dans Project Settings → Service connections
    scannerMode: 'CLI'
    configMode: 'manual'
    cliProjectKey: 'wavecare-front'
    cliProjectName: 'Wavecare Front'

- script: npm run build

- task: SonarQubeAnalyze@5

- task: SonarQubePublish@5
  inputs:
    pollingTimeoutSec: '300'
```

## 5) Sécurité et bonnes pratiques
- Ne commitez jamais de token dans le code ou les fichiers du repo.
- Si un token a été exposé (par erreur), révoquez-le immédiatement depuis SonarQube → My Account → Security → Revoke, puis générez-en un nouveau.
- Après tests locaux, supprimez la variable d'environnement :
```powershell
Remove-Item Env:SONAR_TOKEN
# ou
$env:SONAR_TOKEN = $null
```

## 6) Résolution de problèmes courants
- Si SonarLint/sonar-scanner retourne une page HTML (UI) au lieu d'une réponse JSON, vérifiez :
  - que `sonar.host.url` est l'URL de base (pas `/dashboard`),
  - que votre poste est sur le réseau autorisé (VPN),
  - que le token est valide.
- Si le serveur utilise SSO / reverse-proxy bloquant les API, demandez à l'équipe DevOps d'autoriser l'accès API pour les développeurs ou d'exécuter les analyses en CI.

---

