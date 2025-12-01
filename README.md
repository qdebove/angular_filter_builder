# Angular Filter Builder (Angular 20 ready)

Librairie standalone pour construire des filtres typés et agnostiques vis-à-vis des moteurs tiers.

- Angular 20 / TypeScript strict / Bootstrap 5
- Composants standalone : builder, groupes, conditions, sélecteurs d'opérateurs
- Services : création, application de filtre, interfaces pour vos propres sérialisations
- Typage fort : champs typés, opérateurs dérivés automatiquement

## Démarrage rapide
Consultez `docs/OVERVIEW.md` et `docs/USAGE.md` pour l'architecture et un exemple complet.

## Démo visuelle locale (non exportée)
Pour tester rapidement les interactions du builder sans polluer les exports publics, un composant de démo est disponible :

- `src/lib/demo/visual-demo.component.ts` rend un tableau filtrable avec un jeu de données fictif.
- Le composant est standalone et n'est **pas** exporté via `public-api.ts` : il sert uniquement aux tests locaux.

Incluez-le dans une application hôte en important directement le fichier (ex. dans un module de playground) :

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { VisualDemoComponent } from './lib/demo/visual-demo.component';

bootstrapApplication(VisualDemoComponent);
```

## Scripts
- `npm test` : rappel pour brancher vos tests unitaires (voir `docs/tests.md`).

## Export public
Toutes les API sont exportées via `src/public-api.ts` pour un packaging type Angular library.
