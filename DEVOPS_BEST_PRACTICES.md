# WAVECARE DevOps & Development Best Practices

## 📚 Documentation et Compodoc

### Bonnes pratiques pour la couverture de documentation

1. **Documenter tous les exports publics**
   ```typescript
   /**
    * Description courte et claire
    * Optionnel: Description détaillée sur plusieurs lignes
    * @param name - Description du paramètre
    * @returns Description du retour
    */
   export function myFunction(name: string): string {
     return `Hello ${name}`;
   }
   ```

2. **Interfaces et Types**
   ```typescript
   /**
    * Représente un utilisateur du système
    */
   export interface User {
     /** Identifiant unique */
     id: string;
     /** Nom de l'utilisateur */
     name: string;
   }
   ```

3. **Classes et Composants**
   ```typescript
   /**
    * Composant principal affichant le tableau de bord
    * Gère l'authentification et l'affichage des données
    */
   @Component({...})
   export class DashboardComponent {
     // ...
   }
   ```

### Éviter les TODOs inutiles

❌ **Ne pas documenter** :
- Les opérateurs RxJS (filter, map, tap, finalize, etc.)
- Les patterns internes (if/then/else)
- Les propriétés privées sans exports
- Les fichiers générés automatiquement (orval)

✅ **À documenter** :
- Tous les exports publics (fonctions, classes, interfaces)
- Les configurations importantes
- Les services injectables
- Les composants Angular

## 🏗️ Structure du Projet

```
src/
├── app/
│   ├── api/
│   │   ├── generated/     (Généré par orval - exclure de la doc)
│   │   └── model/         (Types personnalisés)
│   ├── breadcrumb/
│   ├── core/
│   │   └── interceptors/
│   ├── features/
│   │   ├── assistance/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── navigation/
│   │   ├── notification/
│   │   └── utils/
│   ├── guards/
│   ├── app.component.*
│   ├── app.config.ts      (Configuration app)
│   ├── app.config.server.ts (Configuration SSR)
│   ├── app.routes.ts      (Routes)
│   ├── config.service.ts  (Configuration service)
│   └── ...
├── assets/
│   ├── config.json        (Configuration runtime)
│   └── i18n/             (Traductions)
├── main.ts               (Entry point client)
├── main.server.ts        (Entry point serveur)
├── server.ts             (Serveur Express)
└── translate-loader.ts   (Chargeur i18n)
```

## 🔄 Pipeline CI/CD

### Étapes du Pipeline

1. **Build** (ng build)
   - Production ou dev selon la branche
   - Temps typique: 40-50 secondes

2. **Tests** (ng test --code-coverage)
   - 123 tests unitaires
   - Couverture: 62% statements
   - Temps typique: 3-5 secondes

3. **Documentation** (compodoc)
   - Coverage requirement: 70%
   - Actual: 81%
   - Génère dans `documentation/`

4. **SonarQube** (scan)
   - Couverture de code
   - Détection de bugs
   - Analyse de sécurité

5. **Sécurité** (dépendances, SAST)
   - Scans des vulnérabilités
   - Analyse du code source

6. **Déploiement**
   - Docker image
   - Push vers registre
   - Déploiement Kubernetes

### Configuration Pipeline

```yaml
# azure-pipeline.yaml
extends:
  template: templates-general/azure-general-front-tpl.yml@templates
  parameters:
    DEPLOY_INTEG: true
    DEPLOY_TEST: true
    DEPLOY_PROD: false
    NO_DOXYGEN_FAIL: true      # Erreurs doc non-bloquantes
    SKIP_COMPODOC: false       # Documentation activée
    SKIP_SECURITY: false       # Sécurité activée
    SKIP_QUALITY: false        # Qualité activée
```

## 🐛 Dépannage Courant

### Documentation coverage trop basse

**Symptôme** : `Documentation coverage (X%) is not over threshold (70%)`

**Solutions** :
1. Ajouter JSDoc à tous les exports
2. Exécuter `node scripts/clean-todos.js`
3. Vérifier `.compodocrc.json` threshold
4. Relancer : `npm run docs:compodoc:check`

### Tests échouent

**Symptôme** : Build failure, tests ne passent pas

**Solutions** :
1. Exécuter les tests localement: `npm run test`
2. Vérifier les imports et dépendances
3. Vérifier les versions des packages
4. Nettoyer: `rm -rf node_modules && npm install`

### Build échoue

**Symptôme** : Build compilation error

**Solutions** :
1. Vérifier TypeScript strict mode
2. Vérifier les imports circulaires
3. Vérifier les versions Angular
4. Logs complets: `npm run build --verbose`

### Dépréciations SCSS

**Symptôme** : SCSS warnings sur `darken()`, `lighten()`

**Solutions** :
```scss
// Avant (deprecated)
@use "sass:color";
$new: darken($color, 10%);

// Après (recommandé)
@use "sass:color";
$new: color.adjust($color, $lightness: -10%);
```

## 🚀 Optimisations de Performance

### Build Time
- **Actuel** : 42-50 secondes
- **Cible** : < 40 secondes

### Test Coverage
- **Actuel** : 62% statements
- **Cible** : > 80% statements

### Documentation Coverage
- **Actuel** : 81%
- **Cible** : > 90%

## 📦 Dépendances Principales

- **Angular** : 21.2.4
- **Material** : 21.2.2
- **TypeScript** : ~5.7
- **RxJS** : ~7.8
- **ngx-translate** : 17.0.0
- **Compodoc** : (dépendance dev)
- **Karma** : (test runner)

## 🔐 Sécurité

- HTTPS enforced
- CORS configuré
- Content-Security-Policy
- Dependencies scanning
- Code analysis avec SonarQube

## 📞 Support & Contacts

- **DevOps Lead** : [À définir]
- **Tech Lead Frontend** : [À définir]
- **Repository** : LGE_Templates/LGE_Templates (wip-experimental-helm branch)

---

**Dernière mise à jour** : 21 Mai 2026
**Version** : 1.0.0
