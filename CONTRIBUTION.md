# Guide de contribution à Collaboro

Merci de votre intérêt pour contribuer à Collaboro ! 🎉

## 🎯 Vision du projet

Collaboro est une plateforme québécoise en phase prototype. Nous construisons un écosystème d'entraide locale connectant citoyens, OBNL et commerces.

**Philosophie :** Itérations rapides, transparence, impact social.

## 🚀 Comment contribuer

### Types de contributions bienvenues

#### 💻 Code
- Corrections de bugs sur le site web
- Améliorations UI/UX (responsive, accessibilité)
- Optimisations performance
- Nouvelles fonctionnalités (après validation)

#### 🎨 Design
- Maquettes Figma
- Améliorations visuelles
- Icônes et illustrations
- Guide de style

#### 📝 Contenu
- Traductions (EN → FR)
- Documentation technique
- Articles de blog
- Guides utilisateur

#### 🧪 Tests & feedback
- Tests utilisateur du site
- Signalement de bugs
- Suggestions d'amélioration
- Retours d'expérience

## 📋 Processus de contribution

### 1. Avant de commencer

**Pour les nouvelles fonctionnalités :**
1. Ouvrez une **Discussion GitHub** dans la catégorie "Ideas"
2. Décrivez votre proposition et attendez validation
3. Un mainteneur vous assignera un **Issue** si approuvé

**Pour les bugs :**
1. Vérifiez qu'il n'existe pas déjà un Issue similaire
2. Créez un nouvel Issue avec le template "Bug Report"

### 2. Développement

```bash
# 1. Forkez le repo
# 2. Clonez votre fork
git clone https://github.com/VOTRE_USERNAME/community_app.git

# 3. Créez une branche depuis main
git checkout -b feature/nom-de-votre-feature
# OU
git checkout -b fix/description-du-bug

# 4. Installez les dépendances
npm install

# 5. Développez et testez
npm run dev

# 6. Committez avec des messages clairs
git commit -m "feat: ajoute section FAQ sur page Sécurité"
# OU
git commit -m "fix: corrige responsive menu mobile"
```

### 3. Soumission de Pull Request

1. Poussez votre branche sur votre fork
2. Ouvrez une PR vers `main` du repo principal
3. Remplissez le template de PR (description, screenshots si UI)
4. Liez l'Issue correspondant (#123)
5. Attendez la revue de code

**Critères d'acceptation :**
- ✅ Le code compile sans erreur (`npm run build`)
- ✅ Pas de warnings TypeScript
- ✅ Responsive testé (mobile + desktop)
- ✅ Respecte le style du projet (Tailwind CSS)
- ✅ Documentation mise à jour si nécessaire

## 🎨 Standards de code

### React/TypeScript
- Composants fonctionnels avec TypeScript
- Props typées
- Noms de fichiers en PascalCase (`MonComposant.tsx`)
- Hooks React pour la logique

### CSS
- Tailwind CSS uniquement (pas de CSS custom sauf exception)
- Classes utilitaires responsive (`sm:`, `md:`, `lg:`)
- Animations via Tailwind (`transition-all`, `duration-300`)

### Commits
Format : `type(scope): description`

Types acceptés :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, CSS
- `refactor`: Refactorisation sans changement fonctionnel
- `test`: Ajout de tests
- `chore`: Tâches de maintenance

Exemples :
```
feat(accueil): ajoute section témoignages
fix(navbar): corrige liens brisés sur mobile
docs(readme): met à jour instructions installation
```

## 🚫 Ce qui ne sera PAS accepté

- Code sans validation préalable (nouvelles features)
- PR massive (>500 lignes sans justification)
- Changements de dépendances sans discussion
- Modifications du plan stratégique (`/plan`)
- Contributions commerciales ou promotionnelles

## 🏷️ Labels & priorités

Les Issues sont taggués :
- `good first issue` - Idéal pour débuter
- `help wanted` - Nous cherchons de l'aide
- `priority: high` - Urgent
- `priority: low` - Nice to have
- `bug` - Correction nécessaire
- `enhancement` - Amélioration
- `design` - Besoin de design
- `documentation` - Besoin de docs

## 📞 Besoin d'aide ?

- 💬 Posez vos questions dans **Discussions**
- 📧 Contactez [@pierr] (mainteneur principal)
- 📖 Consultez le [README.md](../README.md)
- 🗺️ Explorez le [plan/workspace.md](../plan/workspace.md)

## 📜 Code de conduite

Nous attendons de tous les contributeurs :
- 🤝 Respect et bienveillance
- 💡 Ouverture aux idées diverses
- 🎯 Focus sur l'impact social
- 🇫🇷 Communication en français (traductions bienvenues)

Les comportements inacceptables entraîneront un bannissement.

## 🙏 Remerciements

Chaque contribution compte ! Vous serez crédité dans :
- La section Contributors GitHub
- Les release notes
- Notre page Communauté (future plateforme)

## Description

<!-- Décrivez clairement ce que cette PR apporte -->

Fixes #(issue)

## Type de changement

- [ ] 🐛 Bug fix (correction sans breaking change)
- [ ] ✨ New feature (fonctionnalité sans breaking change)
- [ ] 💥 Breaking change (correction ou feature qui casse la compatibilité)
- [ ] 📝 Documentation
- [ ] 🎨 Style/UI (CSS, design, responsive)

## Screenshots (si applicable)

<!-- Ajoutez des captures avant/après pour les changements UI -->

### Desktop
<!-- Screenshot desktop -->

### Mobile
<!-- Screenshot mobile -->

## Checklist

- [ ] Mon code compile sans erreur (`npm run build`)
- [ ] J'ai testé sur mobile ET desktop
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Mon code respecte les conventions du projet
- [ ] J'ai lié l'Issue correspondant
- [ ] J'ai testé que ma PR ne casse rien d'autre

## Notes additionnelles

<!-- Informations complémentaires pour les reviewers -->

Merci de construire Collaboro avec nous ! 💪