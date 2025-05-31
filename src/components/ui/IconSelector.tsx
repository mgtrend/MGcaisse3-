/**
 * Composant de sélection d'icônes pour MGcaisse3.0
 * Permet de choisir un emoji ou une icône pour un produit
 */

import React, { useState, useEffect } from 'react';

// Liste d'emojis populaires pour les produits
const POPULAR_EMOJIS = [
  '🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🍳', '🧇', '🥞', '🧈',
  '🍞', '🥐', '🥨', '🥯', '🥖', '🧀', '🥗', '🥙', '🥪', '🌮', '🌯', '🥫',
  '🍖', '🍗', '🥩', '🍠', '🥟', '🥠', '🥡', '🍱', '🍘', '🍙', '🍚', '🍛',
  '🍜', '🍝', '🍣', '🍤', '🍥', '🥮', '🍢', '🧆', '🥘', '🍲', '🥣', '🥧',
  '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '🍮',
  '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻',
  '🥂', '🥃', '🥤', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🏺', '🧋',
  '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳',
  '👙', '👚', '👛', '👜', '👝', '🛍️', '🎒', '👞', '👟', '🥾', '🥿', '👠',
  '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '💄', '💍', '💼',
  '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '📷', '📸', '📹', '📼', '🔍',
  '🔎', '🕯️', '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚',
  '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰', '💴',
  '💵', '💶', '💷', '💸', '💳', '🧾', '✉️', '📧', '📨', '📩', '📤', '📥',
];

interface IconSelectorProps {
  value?: string;
  onChange: (icon: string) => void;
  className?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({ 
  value = '', 
  onChange,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmojis, setFilteredEmojis] = useState(POPULAR_EMOJIS);
  const [selectedIcon, setSelectedIcon] = useState(value);

  // Filtrer les emojis en fonction du terme de recherche
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmojis(POPULAR_EMOJIS);
      return;
    }

    // Simple filtre basé sur la description (pourrait être amélioré avec des tags)
    const filtered = POPULAR_EMOJIS.filter(() => {
      // Cette approche est simplifiée, idéalement nous aurions des descriptions/tags pour chaque emoji
      return true; // Pour l'instant, on ne filtre pas réellement
    });

    setFilteredEmojis(filtered);
  }, [searchTerm]);

  // Mettre à jour la valeur sélectionnée et notifier le parent
  const handleSelectIcon = (icon: string) => {
    setSelectedIcon(icon);
    onChange(icon);
  };

  return (
    <div className={`icon-selector ${className}`}>
      <div className="mb-4">
        <label htmlFor="icon-search" className="block text-sm font-medium text-gray-700 mb-1">
          Rechercher une icône
        </label>
        <input
          type="text"
          id="icon-search"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="selected-icon mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icône sélectionnée
        </label>
        <div className="flex items-center justify-center h-16 w-16 border border-gray-300 rounded-md bg-gray-50">
          {selectedIcon ? (
            <span className="text-4xl">{selectedIcon}</span>
          ) : (
            <span className="text-gray-400">Aucune</span>
          )}
        </div>
      </div>

      <div className="emoji-grid">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Choisir une icône
        </label>
        <div className="grid grid-cols-8 gap-2 p-2 border border-gray-300 rounded-md bg-white max-h-60 overflow-y-auto">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectIcon(emoji)}
              className={`flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 ${
                selectedIcon === emoji ? 'bg-indigo-100 border border-indigo-500' : ''
              }`}
            >
              <span className="text-xl">{emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconSelector;
