import json, sys, re, html
sys.path.insert(0, '.')
from fr_1_4 import N1, N2, N3, N4
from fr_5_8 import N5, N6, N7, N8
NIV = [N1, N2, N3, N4, N5, N6, N7, N8]
from melange import melanger_fr
melanger_fr(NIV)
cours = dict(cle="r", nom="R", court="RStudio", logiciel="R et RStudio", recherche="R RStudio",
  titre="R pour l'environnement et la géomatique",
  accroche="R, du premier script à la cartographie des risques",
  lead="Un parcours progressif pour apprendre le logiciel R avec RStudio : bases du langage, tableaux de données et dplyr, graphiques ggplot2, statistiques appliquées à l'environnement, programmation, puis données spatiales avec sf et terra jusqu'aux cartes de susceptibilité aux risques naturels (inondation, feux de forêt, glissements). Chaque leçon propose un exercice, des vidéos et un quiz de fin de niveau.",
  niveaux=NIV)
entete = """/*
 * CONTENU PÉDAGOGIQUE : parcours R (R et RStudio) — R ENIV, enseignant : BOUHAFSI SIDDIQ
 * ------------------------------------------------------------------
 * Niveaux, leçons, exercices et quiz. Texte en HTML simple.
 * Dans un quiz, "bonne" est le numéro de la bonne réponse en comptant à partir de 0.
 * Pour les VIDÉOS, utilisez donnees/videos.js (ou la page Administration du site).
 * Fichier généré par generateur/gen_cours.py : modifiez de préférence les fichiers fr_*.py,
 * ou modifiez directement ce fichier si vous n'utilisez pas Python.
 */
"""
open(sys.argv[1], 'w', encoding='utf-8').write(entete + "window.COURS = " + json.dumps(cours, ensure_ascii=False, indent=1) + ";\n")
# Extraction du code de chaque niveau pour test
import os
os.makedirs('codetest', exist_ok=True)
for n in NIV:
    blocs = []
    for l in n['lecons']:
        for b in re.findall(r'<pre><code>(.*?)</code></pre>', l['contenu'], re.S):
            blocs.append(f"# ---- {l['id']}\n" + html.unescape(b))
    open(f"codetest/{n['id']}.R", 'w', encoding='utf-8').write("\n".join(blocs) + "\n")
print(sum(len(n['lecons']) for n in NIV), "leçons", sum(len(n['quiz']) for n in NIV), "questions")
