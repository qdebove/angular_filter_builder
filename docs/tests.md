# Tests unitaires suggérés

- **Predicate factory** : tester `buildPredicate` avec scénarios `contains`, `between`, `isBlank`, dates, enums et booléens.
- **DevExtreme parser** : vérifier qu'un JSON DevExtreme simple est reconstruit en `FilterExpression` et que `normalizePayload` retourne la structure attendue.
- **FilterApplyService** : valider que les enregistrements filtrés correspondent au prédicat.

Exemple de squelette (Vitest) :
```ts
import { describe, expect, it } from 'vitest';
import { FilterFieldDefinition, FilterFieldType, FilterApplyService, FilterBuilderService } from '../src/public-api';

// ... compléter avec vos données spécifiques
```

Ajoutez votre runner préféré (Vitest / Jest / Angular TestBed) et mettez vos tests dans `tests/` ou `src/**/__tests__`.
