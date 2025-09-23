#!/usr/bin/env python3
"""
Script pour supprimer TOUTES les instances de jaune dans ÉMÉRÉS
Remplace par les couleurs officielles : Saphir, Émeraude, Ambre (orange), Onyx
"""

import os
import re
import glob

def replace_yellow_in_file(file_path):
    """Remplace toutes les instances de jaune dans un fichier"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remplacements CSS Tailwind - JAUNE vers SAPHIR (bleu)
        content = re.sub(r'bg-yellow-50', 'bg-blue-50', content)
        content = re.sub(r'bg-yellow-100', 'bg-blue-100', content)
        content = re.sub(r'bg-yellow-200', 'bg-blue-200', content)
        content = re.sub(r'bg-yellow-300', 'bg-blue-300', content)
        content = re.sub(r'bg-yellow-400', 'bg-blue-400', content)
        content = re.sub(r'bg-yellow-500', 'bg-emerald-500', content)
        content = re.sub(r'bg-yellow-600', 'bg-amber-600', content)  # Ambre pour les boutons importants
        content = re.sub(r'bg-yellow-700', 'bg-amber-700', content)
        content = re.sub(r'bg-yellow-800', 'bg-amber-800', content)
        content = re.sub(r'bg-yellow-900', 'bg-amber-900', content)
        
        # Texte jaune vers couleurs appropriées
        content = re.sub(r'text-yellow-50', 'text-blue-50', content)
        content = re.sub(r'text-yellow-100', 'text-blue-100', content)
        content = re.sub(r'text-yellow-200', 'text-blue-200', content)
        content = re.sub(r'text-yellow-300', 'text-blue-300', content)
        content = re.sub(r'text-yellow-400', 'text-blue-400', content)
        content = re.sub(r'text-yellow-500', 'text-emerald-500', content)
        content = re.sub(r'text-yellow-600', 'text-amber-600', content)
        content = re.sub(r'text-yellow-700', 'text-amber-700', content)
        content = re.sub(r'text-yellow-800', 'text-amber-800', content)
        content = re.sub(r'text-yellow-900', 'text-amber-900', content)
        
        # Bordures jaunes
        content = re.sub(r'border-yellow-50', 'border-blue-50', content)
        content = re.sub(r'border-yellow-100', 'border-blue-100', content)
        content = re.sub(r'border-yellow-200', 'border-blue-200', content)
        content = re.sub(r'border-yellow-300', 'border-blue-300', content)
        content = re.sub(r'border-yellow-400', 'border-blue-400', content)
        content = re.sub(r'border-yellow-500', 'border-emerald-500', content)
        content = re.sub(r'border-yellow-600', 'border-amber-600', content)
        content = re.sub(r'border-yellow-700', 'border-amber-700', content)
        
        # Gradients avec yellow
        content = re.sub(r'from-yellow-(\d+)', r'from-amber-\1', content)
        content = re.sub(r'to-yellow-(\d+)', r'to-amber-\1', content)
        content = re.sub(r'via-yellow-(\d+)', r'via-amber-\1', content)
        
        # Codes couleur hex jaune
        content = re.sub(r'#f59e0b', '#f97316', content)  # ambre-500
        content = re.sub(r'#d97706', '#ea580c', content)  # ambre-600
        content = re.sub(r'#fbbf24', '#f59e0b', content)  # ambre-500
        content = re.sub(r'#fcd34d', '#fbbf24', content)  # ambre-400
        
        # Ring et focus jaunes
        content = re.sub(r'ring-yellow-(\d+)', r'ring-blue-\1', content)
        content = re.sub(r'focus:ring-yellow-(\d+)', r'focus:ring-blue-\1', content)
        
        # Hover états jaunes
        content = re.sub(r'hover:bg-yellow-(\d+)', r'hover:bg-amber-\1', content)
        content = re.sub(r'hover:text-yellow-(\d+)', r'hover:text-amber-\1', content)
        
        # Si des changements ont été faits
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Supprimé jaune de: {file_path}")
            return True
        return False
        
    except Exception as e:
        print(f"❌ Erreur avec {file_path}: {e}")
        return False

def main():
    """Supprime tout le jaune du frontend"""
    frontend_path = "/app/frontend/src"
    
    # Trouve tous les fichiers JS/JSX/CSS
    patterns = [
        f"{frontend_path}/**/*.js",
        f"{frontend_path}/**/*.jsx", 
        f"{frontend_path}/**/*.css",
        f"{frontend_path}/**/*.scss"
    ]
    
    files_changed = 0
    total_files = 0
    
    for pattern in patterns:
        for file_path in glob.glob(pattern, recursive=True):
            total_files += 1
            if replace_yellow_in_file(file_path):
                files_changed += 1
    
    print(f"\n🎯 SUPPRESSION JAUNE TERMINÉE:")
    print(f"📁 Fichiers traités: {total_files}")
    print(f"✨ Fichiers modifiés: {files_changed}")
    print(f"🎨 ÉMÉRÉS utilise maintenant: Saphir, Émeraude, Ambre, Onyx")

if __name__ == "__main__":
    main()