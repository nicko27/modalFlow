# ModalFlow

ModalFlow est une bibliothèque JavaScript moderne, accessible et flexible pour la gestion des fenêtres modales dans les applications web.

## Table des matières

- [Caractéristiques](#caractéristiques)
- [Installation](#installation)
- [Utilisation de base](#utilisation-de-base)
- [Configuration](#configuration)
- [API](#api)
  - [Méthodes principales](#méthodes-principales)
  - [Méthodes utilitaires](#méthodes-utilitaires)
  - [Gestion des événements](#gestion-des-événements)
- [Fonctionnalités avancées](#fonctionnalités-avancées)
  - [Drag & Drop](#drag--drop)
  - [Redimensionnement](#redimensionnement)
  - [Validation de formulaires](#validation-de-formulaires)
  - [Chargement AJAX](#chargement-ajax)
  - [Accessibilité](#accessibilité)
- [Personnalisation](#personnalisation)
  - [Thèmes](#thèmes)
  - [CSS](#css)
- [Exemples](#exemples)
- [Compatibilité](#compatibilité)
- [Changelog](#changelog)

## Caractéristiques

- 🎨 **Design moderne et personnalisable** - Thèmes clairs et sombres, styles facilement personnalisables
- ♿ **Accessibilité intégrée** - Support ARIA, navigation au clavier, piège de focus
- 🔌 **API flexible** - Méthodes simples et intuitives pour créer et gérer les modales
- 📱 **Design responsive** - S'adapte parfaitement à tous les appareils
- 🎭 **Animations fluides** - Transitions douces et personnalisables
- 🔄 **Gestion d'état avancée** - Système d'événements complet
- 🧩 **Fonctionnalités intégrées** - Drag & drop, redimensionnement, validation de formulaires, chargement AJAX

## Installation

1. Incluez les fichiers nécessaires :

```html
<link rel="stylesheet" href="path/to/modalFlow/src/modalFlow.css">
<script src="path/to/modalFlow/src/modalFlow.js"></script>
```

## Utilisation de base

```javascript
// Créer une instance
const modal = new ModalFlow({
    theme: 'light',
    animation: true,
    closeOnEscape: true
});

// Créer et ouvrir une modal simple
modal.createAndOpen({
    title: 'Ma Modal',
    content: 'Contenu de la modal',
    buttons: [
        {
            text: 'Fermer',
            onClick: () => true // Retourne true pour fermer la modal
        }
    ]
});
```

## Configuration

Vous pouvez configurer ModalFlow globalement lors de l'initialisation ou individuellement pour chaque modal.

### Options globales (constructeur)

```javascript
const modal = new ModalFlow({
    // Apparence
    theme: 'light',           // 'light' ou 'dark'
    animation: true,          // Activer/désactiver les animations
    maxWidth: '800px',        // Largeur maximale
    width: '90%',             // Largeur par défaut
    height: 'auto',           // Hauteur par défaut
    position: 'center',       // 'center', 'top', 'bottom'
    overlayOpacity: 0.5,      // Opacité de l'overlay
    zIndex: 1000,             // Z-index de base
    
    // Comportement
    closeOnEscape: true,      // Fermer avec la touche Escape
    closeOnOverlayClick: true, // Fermer en cliquant sur l'overlay
    showCloseButton: true,    // Afficher le bouton de fermeture
    
    // Drag & Drop
    draggable: false,         // Activer le déplacement
    dragHandle: '.modal-flow-header', // Sélecteur pour la zone de préhension
    
    // Redimensionnement
    resizable: false,         // Activer le redimensionnement
    minWidth: 200,            // Largeur minimale
    minHeight: 150,           // Hauteur minimale
    handles: ['se', 'sw', 'ne', 'nw'], // Poignées de redimensionnement
    keepAspectRatio: false,   // Conserver les proportions
    
    // Validation
    validateLive: true,       // Validation en temps réel
    validateErrorClass: 'invalid', // Classe pour les champs invalides
    validateErrorPlacement: 'after', // Placement des messages d'erreur
    
    // Accessibilité
    focusTrap: true,          // Piéger le focus dans la modal
    role: 'dialog',           // Rôle ARIA
    ariaLabelledBy: null,     // ID de l'élément qui étiquette la modal
    ariaDescribedBy: null     // ID de l'élément qui décrit la modal
});
```

### Options par modal

Toutes les options globales peuvent être surchargées lors de la création d'une modal spécifique :

```javascript
modal.create({
    title: 'Titre de la modal',
    content: '<p>Contenu HTML</p>',
    width: '600px',
    theme: 'dark',
    draggable: true,
    buttons: [
        {
            text: 'Annuler',
            class: 'modal-flow-button-secondary',
            onClick: () => true
        },
        {
            text: 'Confirmer',
            class: 'modal-flow-button-primary',
            onClick: () => {
                // Traitement...
                return true; // Ferme la modal
            }
        }
    ]
});
```

## API

### Méthodes principales

#### `create(options)`

Crée une nouvelle modal sans l'afficher. Retourne l'ID unique de la modal.

```javascript
const modalId = modal.create({
    title: 'Ma Modal',
    content: '<p>Contenu</p>'
});
```

#### `createAndOpen(options)`

Crée et ouvre immédiatement une modal. Retourne l'ID unique de la modal.

```javascript
const modalId = modal.createAndOpen({
    title: 'Ma Modal',
    content: '<p>Contenu</p>'
});
```

#### `open(modalId)`

Ouvre une modal précédemment créée.

```javascript
modal.open(modalId);
```

#### `close(modalId)`

Ferme une modal spécifique. Si `modalId` est omis, ferme toutes les modals.

```javascript
modal.close(modalId);
```

#### `update(modalId, options)`

Met à jour le contenu ou les options d'une modal existante.

```javascript
modal.update(modalId, {
    title: 'Nouveau titre',
    content: '<p>Nouveau contenu</p>'
});
```

#### `destroy(modalId)`

Supprime complètement une modal et nettoie les ressources associées.

```javascript
modal.destroy(modalId);
```

### Méthodes utilitaires

#### `ajax(options)`

Crée et ouvre une modal avec du contenu chargé via AJAX.

```javascript
modal.ajax({
    url: '/api/data',
    method: 'POST',
    params: { id: 123 },
    modalOptions: {
        title: 'Données AJAX'
    },
    onSuccess: (data) => `<div>${data.content}</div>`,
    onError: (error) => `<div class="error">${error.message}</div>`
});
```

#### `confirm(options)`

Crée une modal de confirmation avec boutons Annuler/Confirmer.

```javascript
modal.confirm({
    title: 'Confirmation',
    content: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    onConfirm: () => {
        // Action de confirmation
    },
    onCancel: () => {
        // Action d'annulation
    }
});
```

#### `alert(options)`

Crée une modal d'alerte simple avec un bouton OK.

```javascript
modal.alert({
    title: 'Information',
    content: 'Opération réussie !',
    okText: 'OK',
    onOk: () => {
        // Action après OK
    }
});

// Version simplifiée
modal.alert('Opération réussie !');
```

### Gestion des événements

#### `on(event, callback)`

Ajoute un écouteur d'événement.

```javascript
modal.on('open', ({ modalId, element }) => {
    console.log(`Modal ${modalId} ouverte`);
});
```

#### `off(event, callback)`

Supprime un écouteur d'événement.

```javascript
const handler = ({ modalId }) => console.log(`Modal ${modalId} fermée`);
modal.on('close', handler);
// Plus tard...
modal.off('close', handler);
```

#### Événements disponibles

| Événement | Données | Description |
|-----------|---------|-------------|
| `create` | `{ modalId, element }` | Modal créée |
| `open` | `{ modalId, element }` | Modal ouverte |
| `close` | `{ modalId }` | Modal fermée |
| `closeAll` | - | Toutes les modals fermées |
| `update` | `{ modalId, element, options }` | Modal mise à jour |
| `destroy` | `{ modalId }` | Modal détruite |
| `contentLoaded` | `{ modalId, element, data }` | Contenu AJAX chargé |
| `error` | `{ modalId, element, error }` | Erreur lors du chargement AJAX |
| `dragStart` | `{ modalId, x, y }` | Début du déplacement |
| `drag` | `{ modalId, x, y }` | Pendant le déplacement |
| `dragEnd` | `{ modalId, x, y }` | Fin du déplacement |
| `resizeStart` | `{ modalId, width, height }` | Début du redimensionnement |
| `resize` | `{ modalId, width, height }` | Pendant le redimensionnement |
| `resizeEnd` | `{ modalId, width, height }` | Fin du redimensionnement |
| `formValid` | `{ modalId, form, data }` | Formulaire valide soumis |
| `formInvalid` | `{ modalId, form }` | Formulaire invalide soumis |

## Fonctionnalités avancées

### Drag & Drop

Activez le déplacement des modals en définissant `draggable: true` :

```javascript
modal.createAndOpen({
    title: 'Modal déplaçable',
    content: 'Cliquez sur le header pour me déplacer',
    draggable: true
});
```

Par défaut, le header (`.modal-flow-header`) sert de zone de préhension. Vous pouvez personnaliser cela avec l'option `dragHandle`.

### Redimensionnement

Activez le redimensionnement des modals avec `resizable: true` :

```javascript
modal.createAndOpen({
    title: 'Modal redimensionnable',
    content: 'Utilisez les coins pour me redimensionner',
    resizable: true,
    minWidth: 300,
    minHeight: 200
});
```

Vous pouvez contrôler les poignées de redimensionnement avec l'option `handles` et définir des dimensions minimales avec `minWidth` et `minHeight`.

### Validation de formulaires

ModalFlow intègre un système de validation de formulaires simple mais puissant :

```javascript
modal.createAndOpen({
    title: 'Formulaire',
    content: `
        <form>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" data-validate="required|email">
            </div>
            <div class="form-group">
                <label for="password">Mot de passe:</label>
                <input type="password" id="password" name="password" data-validate="required|minLength:8">
            </div>
            <button type="submit">Envoyer</button>
        </form>
    `,
    validate: true
});

// Écouter les soumissions de formulaire valides
modal.on('formValid', ({ modalId, form, data }) => {
    console.log('Données du formulaire:', data);
    // Envoyer les données au serveur...
    modal.close(modalId);
});
```

#### Règles de validation disponibles

| Règle | Format | Description |
|-------|--------|-------------|
| `required` | `required` | Champ obligatoire |
| `email` | `email` | Doit être un email valide |
| `min` | `min:5` | Valeur numérique minimale |
| `max` | `max:100` | Valeur numérique maximale |
| `minLength` | `minLength:8` | Longueur minimale |
| `maxLength` | `maxLength:255` | Longueur maximale |
| `pattern` | `pattern:^[A-Za-z]+$` | Expression régulière |
| `match` | `match:password` | Doit correspondre au champ spécifié |
| `phone` | `phone` | Doit être un numéro de téléphone valide |

### Chargement AJAX

Chargez du contenu dynamiquement via AJAX :

```javascript
modal.ajax({
    url: '/api/user/123',
    method: 'GET',
    params: { details: 'full' },
    modalOptions: {
        title: 'Profil utilisateur',
        width: '700px'
    },
    onSuccess: (data) => `
        <div class="user-profile">
            <h3>${data.name}</h3>
            <p>${data.bio}</p>
        </div>
    `,
    onError: (error) => `
        <div class="error">
            Impossible de charger le profil: ${error.message}
        </div>
    `
});
```

### Accessibilité

ModalFlow est conçu avec l'accessibilité en tête :

- Attributs ARIA appropriés (`role="dialog"`, `aria-modal="true"`, etc.)
- Navigation au clavier (Tab, Shift+Tab, Escape)
- Piège de focus pour garder le focus dans la modal
- Restauration du focus après fermeture
- Support des lecteurs d'écran

## Personnalisation

### Thèmes

ModalFlow propose deux thèmes intégrés : `light` (par défaut) et `dark`.

```javascript
// Thème global
const modal = new ModalFlow({ theme: 'dark' });

// Thème par modal
modal.createAndOpen({
    title: 'Modal sombre',
    content: 'Contenu avec thème sombre',
    theme: 'dark'
});
```

### CSS

Vous pouvez personnaliser l'apparence en surchargeant les classes CSS :

```css
/* Personnalisation de base */
.modal-flow {
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-flow-header {
    background-color: #f8f9fa;
}

.modal-flow-title {
    font-family: 'Poppins', sans-serif;
    color: #333;
}

.modal-flow-button-primary {
    background-color: #4f46e5;
}

.modal-flow-button-primary:hover {
    background-color: #4338ca;
}

/* Thème personnalisé */
.modal-flow.custom-theme {
    background-color: #fffbf5;
    color: #1a1a1a;
}

.modal-flow.custom-theme .modal-flow-header {
    background-color: #f8f0e5;
    border-bottom: 2px solid #eadbc8;
}
```

## Exemples

### Modal avec formulaire et validation

```javascript
modal.createAndOpen({
    title: 'Inscription',
    content: `
        <form>
            <div class="form-group">
                <label for="name">Nom:</label>
                <input type="text" id="name" name="name" data-validate="required|minLength:2">
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" data-validate="required|email">
            </div>
            <div class="form-group">
                <label for="age">Âge:</label>
                <input type="number" id="age" name="age" data-validate="required|min:18|max:120">
            </div>
        </form>
    `,
    validate: true,
    buttons: [
        {
            text: 'Annuler',
            class: 'modal-flow-button-secondary',
            onClick: () => true
        },
        {
            text: 'S\'inscrire',
            class: 'modal-flow-button-primary',
            onClick: function() {
                const form = document.querySelector('form');
                if (form && form._validateForm) {
                    const isValid = form._validateForm(new Event('submit'));
                    return isValid; // Ferme la modal seulement si le formulaire est valide
                }
                return false;
            }
        }
    ]
});
```

### Modal de confirmation avec actions

```javascript
modal.confirm({
    title: 'Supprimer l\'article',
    content: 'Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.',
    confirmText: 'Supprimer',
    confirmClass: 'modal-flow-button-danger',
    cancelText: 'Annuler',
    onConfirm: () => {
        // Appel API pour supprimer l'article
        fetch('/api/articles/123', { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    modal.alert('Article supprimé avec succès');
                } else {
                    modal.alert({
                        title: 'Erreur',
                        content: 'Impossible de supprimer l\'article'
                    });
                }
            });
    }
});
```

### Modal avec contenu complexe et déplaçable

```javascript
modal.createAndOpen({
    title: 'Statistiques',
    content: `
        <div class="tabs">
            <button class="tab active" data-tab="daily">Quotidien</button>
            <button class="tab" data-tab="weekly">Hebdomadaire</button>
            <button class="tab" data-tab="monthly">Mensuel</button>
        </div>
        <div class="tab-content active" id="daily">
            <div class="chart-container">
                <canvas id="dailyChart"></canvas>
            </div>
        </div>
        <div class="tab-content" id="weekly">
            <div class="chart-container">
                <canvas id="weeklyChart"></canvas>
            </div>
        </div>
        <div class="tab-content" id="monthly">
            <div class="chart-container">
                <canvas id="monthlyChart"></canvas>
            </div>
        </div>
    `,
    width: '800px',
    height: '500px',
    draggable: true,
    resizable: true,
    onContentLoaded: () => {
        // Initialiser les graphiques et les onglets
        // (code d'initialisation des graphiques ici)
        
        // Gestion des onglets
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Activer l'onglet cliqué
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Afficher le contenu correspondant
                const tabId = tab.getAttribute('data-tab');
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
});
```

## Compatibilité

ModalFlow est compatible avec :

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Opera 47+
- iOS Safari 12+
- Android Browser 76+

## Changelog

### Version 1.1.0
- Amélioration de l'accessibilité (ARIA, navigation au clavier, piège de focus)
- Ajout des méthodes utilitaires `alert()` et `confirm()`
- Amélioration de la gestion des événements
- Meilleure prise en charge des formulaires et de la validation
- Optimisation des performances
- Corrections de bugs

### Version 1.0.0
- Version initiale