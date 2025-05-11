/**
 * ModalFlow - A modern, flexible modal library
 * Version: 1.0.0
 * Author: TableFlow Team
 * License: MIT
 */

class ModalFlow {
    constructor() {
        this.activeModals = [];
        this.modalCounter = 0;
        this.zIndexCounter = 1000;
        this.defaultOptions = {
            id: null,
            title: '',
            content: '',
            width: '500px',
            maxWidth: '90%',
            height: 'auto',
            maxHeight: '90vh',
            position: 'center', // center, top, custom
            customPosition: null, // {x: '10px', y: '10px'}
            theme: 'light', // light, dark, custom
            customClass: '',
            closeOnEscape: true,
            closeOnOverlayClick: true,
            showCloseButton: true,
            showOverlay: true,
            overlayOpacity: 0.5,
            draggable: false,
            resizable: false,
            animation: 'fade', // fade, slide, none
            animationDuration: 300,
            buttons: [],
            onOpen: null,
            onClose: null,
            beforeOpen: null,
            beforeClose: null,
            afterOpen: null,
            afterClose: null
        };
        
        // Initialize event listeners
        this._initGlobalEvents();
    }

    /**
     * Initialize global event listeners
     * @private
     */
    _initGlobalEvents() {
        // Handle escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const topModal = this._getTopModal();
                if (topModal && topModal.options.closeOnEscape) {
                    this.close(topModal.id);
                }
            }
        });
    }

    /**
     * Get the top-most modal
     * @private
     * @returns {Object|null} The top modal object or null if none exists
     */
    _getTopModal() {
        if (this.activeModals.length === 0) return null;
        return this.activeModals[this.activeModals.length - 1];
    }

    /**
     * Generate a unique ID for a modal
     * @private
     * @returns {string} A unique ID
     */
    _generateId() {
        this.modalCounter++;
        return `modal-flow-${this.modalCounter}`;
    }

    /**
     * Create a modal with the given options
     * @param {Object} options - Modal configuration options
     * @returns {string} The ID of the created modal
     */
    create(options) {
        // Merge default options with provided options
        const modalOptions = { ...this.defaultOptions, ...options };
        
        // Generate ID if not provided
        if (!modalOptions.id) {
            modalOptions.id = this._generateId();
        }
        
        // Create modal DOM structure
        const modal = this._createModalDOM(modalOptions);
        
        // Store modal reference
        this.activeModals.push({
            id: modalOptions.id,
            element: modal,
            options: modalOptions,
            zIndex: this.zIndexCounter++
        });
        
        return modalOptions.id;
    }

    /**
     * Create the DOM structure for a modal
     * @private
     * @param {Object} options - Modal options
     * @returns {HTMLElement} The modal element
     */
    _createModalDOM(options) {
        // Create container
        const container = document.createElement('div');
        container.className = `modal-flow-container ${options.theme === 'dark' ? 'modal-flow-dark' : ''}`;
        container.id = options.id;
        container.style.zIndex = this.zIndexCounter;
        
        if (options.customClass) {
            container.classList.add(options.customClass);
        }
        
        // Create overlay if needed
        if (options.showOverlay) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-flow-overlay';
            overlay.style.opacity = options.overlayOpacity;
            
            // Add click handler to close on overlay click if enabled
            if (options.closeOnOverlayClick) {
                overlay.addEventListener('click', () => this.close(options.id));
            }
            
            container.appendChild(overlay);
        }
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal-flow';
        modal.style.width = options.width;
        modal.style.maxWidth = options.maxWidth;
        modal.style.height = options.height;
        modal.style.maxHeight = options.maxHeight;
        
        // Set position
        if (options.position === 'center') {
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
        } else if (options.position === 'top') {
            modal.style.top = '10%';
            modal.style.left = '50%';
            modal.style.transform = 'translateX(-50%)';
        } else if (options.position === 'custom' && options.customPosition) {
            modal.style.top = options.customPosition.y;
            modal.style.left = options.customPosition.x;
        }
        
        // Create header
        const header = document.createElement('div');
        header.className = 'modal-flow-header';
        
        const title = document.createElement('h3');
        title.className = 'modal-flow-title';
        title.textContent = options.title;
        header.appendChild(title);
        
        if (options.showCloseButton) {
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-flow-close';
            closeButton.innerHTML = '&times;';
            closeButton.addEventListener('click', () => this.close(options.id));
            header.appendChild(closeButton);
        }
        
        modal.appendChild(header);
        
        // Create content
        const content = document.createElement('div');
        content.className = 'modal-flow-content';
        
        // Handle content (string or HTML element)
        if (typeof options.content === 'string') {
            content.innerHTML = options.content;
        } else if (options.content instanceof HTMLElement) {
            content.appendChild(options.content);
        }
        
        modal.appendChild(content);
        
        // Create footer if buttons are provided
        if (options.buttons && options.buttons.length > 0) {
            const footer = document.createElement('div');
            footer.className = 'modal-flow-footer';
            
            options.buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.className = `modal-flow-button ${buttonConfig.class || ''}`;
                button.textContent = buttonConfig.text || 'Button';
                
                if (buttonConfig.onClick) {
                    button.addEventListener('click', (e) => {
                        const shouldClose = buttonConfig.onClick(e);
                        if (shouldClose) {
                            this.close(options.id);
                        }
                    });
                }
                
                footer.appendChild(button);
            });
            
            modal.appendChild(footer);
        }
        
        container.appendChild(modal);
        
        // Setup draggable functionality if enabled
        if (options.draggable) {
            this._makeDraggable(modal, header);
        }
        
        // Setup resizable functionality if enabled
        if (options.resizable) {
            this._makeResizable(modal);
        }
        
        return container;
    }

    /**
     * Make a modal draggable
     * @private
     * @param {HTMLElement} modal - The modal element
     * @param {HTMLElement} handle - The element to use as drag handle
     */
    _makeDraggable(modal, handle) {
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;
        
        handle.style.cursor = 'move';
        
        const startDrag = (e) => {
            // Only handle left mouse button
            if (e.button !== 0) return;
            
            e.preventDefault();
            
            // Get the current position of the modal
            const rect = modal.getBoundingClientRect();
            
            // Calculate the offset from the mouse position to the modal position
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            isDragging = true;
            
            // Add event listeners for dragging
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            // Add a class to indicate dragging
            modal.classList.add('modal-flow-dragging');
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            
            // Calculate new position
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // Apply new position
            modal.style.left = `${x}px`;
            modal.style.top = `${y}px`;
            modal.style.transform = 'none';
        };
        
        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            modal.classList.remove('modal-flow-dragging');
        };
        
        handle.addEventListener('mousedown', startDrag);
    }

    /**
     * Make a modal resizable
     * @private
     * @param {HTMLElement} modal - The modal element
     */
    _makeResizable(modal) {
        const directions = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'];
        const handles = {};
        
        // Create resize handles
        directions.forEach(dir => {
            const handle = document.createElement('div');
            handle.className = `modal-flow-resize-handle modal-flow-resize-${dir}`;
            modal.appendChild(handle);
            handles[dir] = handle;
            
            this._setupResizeHandle(modal, handle, dir);
        });
    }

    /**
     * Setup a resize handle for a specific direction
     * @private
     * @param {HTMLElement} modal - The modal element
     * @param {HTMLElement} handle - The resize handle element
     * @param {string} direction - The resize direction
     */
    _setupResizeHandle(modal, handle, direction) {
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        
        const startResize = (e) => {
            e.preventDefault();
            
            // Get initial dimensions and position
            const rect = modal.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startWidth = rect.width;
            startHeight = rect.height;
            startLeft = rect.left;
            startTop = rect.top;
            
            // Add event listeners for resizing
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            
            // Add a class to indicate resizing
            modal.classList.add('modal-flow-resizing');
        };
        
        const resize = (e) => {
            e.preventDefault();
            
            // Calculate the change in position
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // Apply changes based on direction
            if (direction.includes('e')) {
                modal.style.width = `${startWidth + dx}px`;
            }
            if (direction.includes('s')) {
                modal.style.height = `${startHeight + dy}px`;
            }
            if (direction.includes('w')) {
                modal.style.width = `${startWidth - dx}px`;
                modal.style.left = `${startLeft + dx}px`;
            }
            if (direction.includes('n')) {
                modal.style.height = `${startHeight - dy}px`;
                modal.style.top = `${startTop + dy}px`;
            }
        };
        
        const stopResize = () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            modal.classList.remove('modal-flow-resizing');
        };
        
        handle.addEventListener('mousedown', startResize);
    }

    /**
     * Open a modal by ID
     * @param {string} id - The ID of the modal to open
     * @returns {boolean} True if the modal was opened, false otherwise
     */
    open(id) {
        const modalObj = this.activeModals.find(m => m.id === id);
        if (!modalObj) return false;
        
        // Call beforeOpen callback if provided
        if (modalObj.options.beforeOpen) {
            const shouldOpen = modalObj.options.beforeOpen();
            if (shouldOpen === false) return false;
        }
        
        // Append modal to body
        document.body.appendChild(modalObj.element);
        
        // Apply animation
        if (modalObj.options.animation !== 'none') {
            modalObj.element.classList.add(`modal-flow-animation-${modalObj.options.animation}`);
            setTimeout(() => {
                modalObj.element.classList.add('modal-flow-open');
            }, 10);
        } else {
            modalObj.element.classList.add('modal-flow-open');
        }
        
        // Call onOpen callback if provided
        if (modalObj.options.onOpen) {
            modalObj.options.onOpen();
        }
        
        // Call afterOpen callback after animation completes
        setTimeout(() => {
            if (modalObj.options.afterOpen) {
                modalObj.options.afterOpen();
            }
        }, modalObj.options.animationDuration);
        
        return true;
    }

    /**
     * Create and open a modal in one step
     * @param {Object} options - Modal configuration options
     * @returns {string} The ID of the created modal
     */
    createAndOpen(options) {
        const id = this.create(options);
        this.open(id);
        return id;
    }

    /**
     * Close a modal by ID
     * @param {string} id - The ID of the modal to close
     * @returns {boolean} True if the modal was closed, false otherwise
     */
    close(id) {
        const modalIndex = this.activeModals.findIndex(m => m.id === id);
        if (modalIndex === -1) return false;
        
        const modalObj = this.activeModals[modalIndex];
        
        // Call beforeClose callback if provided
        if (modalObj.options.beforeClose) {
            const shouldClose = modalObj.options.beforeClose();
            if (shouldClose === false) return false;
        }
        
        // Apply closing animation
        if (modalObj.options.animation !== 'none') {
            modalObj.element.classList.remove('modal-flow-open');
            
            // Call onClose callback if provided
            if (modalObj.options.onClose) {
                modalObj.options.onClose();
            }
            
            // Remove modal after animation completes
            setTimeout(() => {
                this._removeModal(modalObj, modalIndex);
                
                // Call afterClose callback
                if (modalObj.options.afterClose) {
                    modalObj.options.afterClose();
                }
            }, modalObj.options.animationDuration);
        } else {
            // Call onClose callback if provided
            if (modalObj.options.onClose) {
                modalObj.options.onClose();
            }
            
            // Remove modal immediately
            this._removeModal(modalObj, modalIndex);
            
            // Call afterClose callback
            if (modalObj.options.afterClose) {
                modalObj.options.afterClose();
            }
        }
        
        return true;
    }

    /**
     * Remove a modal from the DOM and the active modals list
     * @private
     * @param {Object} modalObj - The modal object
     * @param {number} modalIndex - The index of the modal in the activeModals array
     */
    _removeModal(modalObj, modalIndex) {
        // Remove from DOM
        if (modalObj.element.parentNode) {
            modalObj.element.parentNode.removeChild(modalObj.element);
        }
        
        // Remove from active modals list
        this.activeModals.splice(modalIndex, 1);
    }

    /**
     * Close all open modals
     */
    closeAll() {
        // Create a copy of the array to avoid issues when modifying during iteration
        const modals = [...this.activeModals];
        modals.forEach(modal => {
            this.close(modal.id);
        });
    }

    /**
     * Update the content of a modal
     * @param {string} id - The ID of the modal to update
     * @param {string|HTMLElement} content - The new content
     * @returns {boolean} True if the modal was updated, false otherwise
     */
    updateContent(id, content) {
        const modalObj = this.activeModals.find(m => m.id === id);
        if (!modalObj) return false;
        
        const contentEl = modalObj.element.querySelector('.modal-flow-content');
        if (!contentEl) return false;
        
        // Update content
        if (typeof content === 'string') {
            contentEl.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            contentEl.innerHTML = '';
            contentEl.appendChild(content);
        }
        
        return true;
    }

    /**
     * Update the title of a modal
     * @param {string} id - The ID of the modal to update
     * @param {string} title - The new title
     * @returns {boolean} True if the modal was updated, false otherwise
     */
    updateTitle(id, title) {
        const modalObj = this.activeModals.find(m => m.id === id);
        if (!modalObj) return false;
        
        const titleEl = modalObj.element.querySelector('.modal-flow-title');
        if (!titleEl) return false;
        
        titleEl.textContent = title;
        return true;
    }

    /**
     * Check if a modal is currently open
     * @param {string} id - The ID of the modal to check
     * @returns {boolean} True if the modal is open, false otherwise
     */
    isOpen(id) {
        return this.activeModals.some(m => m.id === id);
    }

    /**
     * Get the number of currently open modals
     * @returns {number} The number of open modals
     */
    getOpenCount() {
        return this.activeModals.length;
    }
}

// Create a singleton instance
const modalFlow = new ModalFlow();

// Export for module systems
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = modalFlow;
} else {
    window.modalFlow = modalFlow;
}