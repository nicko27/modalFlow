# ModalFlow

ModalFlow est une bibliothèque JavaScript moderne et flexible pour la gestion des fenêtres modales dans vos applications web. Elle offre une API intuitive et personnalisable avec des fonctionnalités avancées comme le drag & drop, les animations et la gestion des formulaires.

## Installation

### Via CDN
```html
<link rel="stylesheet" href="path/to/modalFlow.css">
<script src="path/to/modalFlow.js"></script>
```

### Manuellement
1. Téléchargez les fichiers source depuis le dépôt
2. Copiez les fichiers `modalFlow.js` et `modalFlow.css` dans votre projet
3. Incluez les fichiers dans votre HTML :
```html
<link rel="stylesheet" href="path/to/modalFlow.css">
<script src="path/to/modalFlow.js"></script>
```

## Utilisation de base

### HTML
```html
<!-- Structure de base d'une modale -->
<div class="modal-flow" id="myModal">
    <div class="modal-flow-content">
        <div class="modal-flow-header">
            <h3 class="modal-flow-title">Titre de la modale</h3>
            <button class="modal-flow-close">&times;</button>
        </div>
        <div class="modal-flow-body">
            Contenu de la modale
        </div>
        <div class="modal-flow-footer">
            <button class="modal-flow-button">Fermer</button>
        </div>
    </div>
</div>
```

### JavaScript
```javascript
// Initialisation simple
const modal = new ModalFlow('#myModal');

// Ouvrir la modale
modal.open();

// Fermer la modale
modal.close();
```

## Options de configuration

```javascript
const modal = new ModalFlow('#myModal', {
    draggable: true,          // Activer le drag & drop
    resizable: true,          // Activer le redimensionnement
    closeOnClickOutside: true, // Fermer en cliquant à l'extérieur
    closeOnEsc: true,         // Fermer avec la touche ESC
    animation: 'fade',        // Animation (fade/slide)
    animationDuration: 300,   // Durée de l'animation en ms
    backdrop: true,           // Afficher l'arrière-plan
    backdropOpacity: 0.5,     // Opacité de l'arrière-plan
    maxWidth: '90%',          // Largeur maximale
    maxHeight: '90%',         // Hauteur maximale
    theme: 'light'            // Thème (light/dark)
});
```

## Méthodes principales

### open()
Ouvre la modale.

```javascript
modal.open();
```

### close()
Ferme la modale.

```javascript
modal.close();
```

### destroy()
Détruit l'instance de la modale.

```javascript
modal.destroy();
```

### setContent()
Définit le contenu de la modale.

```javascript
modal.setContent('<h2>Nouveau contenu</h2>');
```

### getContent()
Récupère le contenu de la modale.

```javascript
const content = modal.getContent();
```

## Événements

```javascript
modal.on('open', () => {
    console.log('Modale ouverte');
});

modal.on('close', () => {
    console.log('Modale fermée');
});

modal.on('drag', (position) => {
    console.log('Position:', position);
});

modal.on('resize', (size) => {
    console.log('Taille:', size);
});
```

## Personnalisation

### Styles CSS
Vous pouvez personnaliser l'apparence de la modale en modifiant les classes CSS suivantes :

```css
.modal-flow {
    /* Conteneur principal */
}

.modal-flow-content {
    /* Contenu de la modale */
}

.modal-flow-header {
    /* En-tête de la modale */
}

.modal-flow-title {
    /* Titre de la modale */
}

.modal-flow-body {
    /* Corps de la modale */
}

.modal-flow-footer {
    /* Pied de la modale */
}

.modal-flow-button {
    /* Boutons de la modale */
}

.modal-flow-close {
    /* Bouton de fermeture */
}

.modal-flow-backdrop {
    /* Arrière-plan de la modale */
}
```

### Thèmes
ModalFlow propose deux thèmes intégrés :

```javascript
// Thème clair (par défaut)
const modal = new ModalFlow('#myModal', { theme: 'light' });

// Thème sombre
const modal = new ModalFlow('#myModal', { theme: 'dark' });
```

## Exemples d'utilisation avancée

### Modale avec formulaire
```javascript
const modal = new ModalFlow('#myModal', {
    onOpen: () => {
        // Initialiser le formulaire
        const form = modal.getContent().querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Traiter le formulaire
            modal.close();
        });
    }
});
```

### Modale avec chargement dynamique
```javascript
const modal = new ModalFlow('#myModal', {
    onOpen: async () => {
        modal.setContent('Chargement...');
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            modal.setContent(`
                <h2>${data.title}</h2>
                <p>${data.content}</p>
            `);
        } catch (error) {
            modal.setContent('Erreur de chargement');
        }
    }
});
```

### Modale avec validation
```javascript
const modal = new ModalFlow('#myModal', {
    onClose: () => {
        const form = modal.getContent().querySelector('form');
        if (form && !form.checkValidity()) {
            return false; // Empêche la fermeture
        }
        return true;
    }
});
```

### Modale avec redimensionnement personnalisé
```javascript
const modal = new ModalFlow('#myModal', {
    resizable: true,
    onResize: (size) => {
        if (size.width < 300 || size.height < 200) {
            return false; // Empêche le redimensionnement
        }
        return true;
    }
});
```

## Bonnes pratiques

1. **Accessibilité** : Assurez-vous que la modale est accessible aux lecteurs d'écran
2. **Performance** : Détruisez les instances non utilisées pour libérer la mémoire
3. **Responsive** : Adaptez la taille de la modale aux différentes tailles d'écran
4. **UX** : Utilisez des animations appropriées pour une meilleure expérience utilisateur
5. **Sécurité** : Validez toujours les données des formulaires côté serveur

## Compatibilité

ModalFlow est compatible avec :
- Chrome (dernières 2 versions)
- Firefox (dernières 2 versions)
- Safari (dernières 2 versions)
- Edge (dernières 2 versions)

## Support

Pour toute question ou problème, veuillez :
1. Consulter la documentation
2. Vérifier les issues existantes sur GitHub
3. Créer une nouvelle issue si nécessaire 