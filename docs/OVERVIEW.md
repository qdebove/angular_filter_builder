# Angular Filter Builder Library

## 1. Architecture générale
- **Modules**: `core` (services & utils), `models`, `components`, `operators` (operator metadata via `defaultOperatorMap`), `utils` (predicate factory), `services` (filter builder, apply, DevExtreme parser).
- **Principes**: standalone components, OnPush, Reactive Forms, strict typing, Bootstrap 5 friendly markup, DevExtreme JSON bridging.
- **Entrées principales**: `FilterExpression<T>`, `FilterFieldDefinition<T>`, `FilterBuilderComponent` pour l'UI, `FilterApplyService` pour l'exécution, `DevExtremeParserService` pour l'interop `.NET/DevExtreme`.

## 2. Modèles/types
- `FilterFieldType` (`string`, `number`, `boolean`, `date`, `enum`).
- `FilterFieldDefinition<T>` pour typer et documenter les champs disponibles.
- `FilterExpression<T>` : racine `FilterGroup<T>` + `fields` autorisés.
- `FilterGroup` : opérateur `and | or | not`, enfants récursifs.
- `FilterCondition` : champ, opérateur, valeurs (`value`, `valueTo`).
- `defaultOperatorMap` génère automatiquement les opérateurs disponibles selon le type.
- DevExtreme types (`DevExtremeExpression`, `DevExtremePayload`) pour conversion JSON.

## 3. Services
- `FilterBuilderService<T>` : initialise des expressions vides avec groupes imbriqués.
- `FilterApplyService` : `applyFilter<T>(data, expression)` en s'appuyant sur `buildPredicate`.
- `DevExtremeParserService<T>` : `toDevExtreme(expression)` et `fromDevExtreme(json)`.
- `buildPredicate` (utils) : génère une fonction `Predicate<T>` sécurisée (vérification champs existants, support `between`, `contains`, dates, nombres, booléens, enums).

## 4. Composants UI
- `FilterBuilderComponent` : conteneur principal, bouton reset.
- `FilterGroupComponent` : gestion des groupes AND/OR/NOT, ajout/suppression de conditions ou groupes.
- `FilterConditionComponent` : formulaire réactif Bootstrap pour sélectionner champ/opérateur/valeur(s).
- `OperatorSelectComponent` : CVA pour lier le select d'opérateurs aux Reactive Forms.
- Les composants sont standalone, OnPush, et utilisent des classes Bootstrap 5 prêtes à styliser.

## 5. Exemple d'intégration
Voir `docs/USAGE.md` pour un composant Angular exemple (`AppComponent`) et la configuration des champs. Le flux type :
1. Définir les champs `FilterFieldDefinition<T>[]`.
2. Créer un `FilterExpression` via `FilterBuilderService`.
3. Lier `[expression]` et `(expressionChange)` sur `<afb-filter-builder>`.
4. Appliquer le filtre sur des données avec `FilterApplyService.applyFilter` ou envoyer le JSON DevExtreme via `DevExtremeParserService.toDevExtreme`.

## 6. Tests essentiels
- Les utilitaires (`buildPredicate`) sont déterministes et séparés pour tests unitaires (voir `docs/tests.md`).
- Le script npm `test` rappelle où placer les tests. Un runner Node ou Vitest peut être ajouté facilement.

