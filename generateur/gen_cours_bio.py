import json, sys, re, html, os
sys.path.insert(0, '.')
from fr_bio_1_5 import B1, B2, B3, B4, B5
from fr_bio_6_9 import B6, B7, B8, B9
NIV = [B1, B2, B3, B4, B5, B6, B7, B8, B9]
from melange import melanger_fr
melanger_fr(NIV)
cours = dict(cle="bio", nom="Biodiversité", court="RStudio", logiciel="R et RStudio", recherche="R biodiversité écologie",
  titre="Biodiversité et écologie quantitative avec R",
  accroche="L'écologie quantitative avec R : des données ouvertes aux modèles bayésiens",
  lead="Un parcours avancé sur les méthodes modernes de l'écologie quantitative avec R, appuyé sur des sources de données ouvertes (GBIF, OBIS, WorldClim, Copernicus, MODIS) : télédétection et séries temporelles de NDVI, diversité bêta et neutralité, réseaux écologiques multiplexes, apprentissage automatique explicable, modèles d'occupation avec détection imparfaite, ADN environnemental, modèles joints de distribution d'espèces (JSDM) et modèles bayésiens multi-espèces et spatio-temporels. Les données de TP sont fictives mais réalistes, dans la région de Tlemcen.",
  niveaux=NIV)
entete = """/*
 * CONTENU PÉDAGOGIQUE : parcours Biodiversité (écologie quantitative avec R) — R ENIV, enseignant : BOUHAFSI SIDDIQ
 * Niveaux b1…b9, leçons, exercices et quiz. "bonne" = numéro de la bonne réponse à partir de 0.
 * Fichier généré par generateur/gen_cours_bio.py (sources : fr_bio_*.py).
 */
"""
open(sys.argv[1], 'w', encoding='utf-8').write(entete + "window.COURS_BIO = " + json.dumps(cours, ensure_ascii=False, indent=1) + ";\n")
noms = {"b1":"donnees_en_ligne","b2":"teledetection_ndvi","b3":"diversite_beta_neutralite","b4":"reseaux_multiplexes",
        "b5":"sdm_ia_explicable","b6":"occupation_detection","b7":"adn_environnemental","b8":"jsdm","b9":"bayesien_spatiotemporel"}
out = sys.argv[2]; os.makedirs(out, exist_ok=True)
for n in NIV:
    blocs = []
    for l in n['lecons']:
        for b in re.findall(r'<pre><code>(.*?)</code></pre>', l['contenu'], re.S):
            blocs.append(f"# ==== Leçon {l['id']} : {l['titre']}\n" + html.unescape(b))
    tete = (f"# R ENIV — parcours Biodiversité — Niveau {n['numero']} : {n['titre']}\n# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.\n"
            "# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).\n\n")
    open(f"{out}/{n['id']}_{noms[n['id']]}.R", 'w', encoding='utf-8').write(tete + "\n\n".join(blocs) + "\n")
print(sum(len(n['lecons']) for n in NIV), "leçons", sum(len(n['quiz']) for n in NIV), "questions")
