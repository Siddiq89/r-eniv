/*
 * CONTENU PÉDAGOGIQUE : parcours R (R et RStudio) — R ENIV, enseignant : BOUHAFSI SIDDIQ
 * ------------------------------------------------------------------
 * Niveaux, leçons, exercices et quiz. Texte en HTML simple.
 * Dans un quiz, "bonne" est le numéro de la bonne réponse en comptant à partir de 0.
 * Pour les VIDÉOS, utilisez donnees/videos.js (ou la page Administration du site).
 * Fichier généré par generateur/gen_cours.py : modifiez de préférence les fichiers fr_*.py,
 * ou modifiez directement ce fichier si vous n'utilisez pas Python.
 */
window.COURS = {
 "cle": "r",
 "nom": "R",
 "court": "RStudio",
 "logiciel": "R et RStudio",
 "recherche": "R RStudio",
 "titre": "R pour l'environnement et la géomatique",
 "accroche": "R, du premier script à la cartographie des risques",
 "lead": "Un parcours progressif pour apprendre le logiciel R avec RStudio : bases du langage, tableaux de données et dplyr, graphiques ggplot2, statistiques appliquées à l'environnement, programmation, puis données spatiales avec sf et terra jusqu'aux cartes de susceptibilité aux risques naturels (inondation, feux de forêt, glissements). Chaque leçon propose un exercice, des vidéos et un quiz de fin de niveau.",
 "niveaux": [
  {
   "id": "r1",
   "numero": 1,
   "titre": "Découvrir R et RStudio",
   "echelle": "1:1 000 000",
   "resume": "Installer R et RStudio, comprendre l'interface, travailler avec des scripts et des projets, installer des packages et trouver de l'aide.",
   "lecons": [
    {
     "id": "r1-l1",
     "titre": "R et RStudio : installer et découvrir",
     "duree": "20 min",
     "objectifs": [
      "Savoir ce que sont R et RStudio et pourquoi les utiliser en géomatique",
      "Installer R puis RStudio sur Windows",
      "Repérer les quatre panneaux de RStudio"
     ],
     "contenu": "\n<p><b>R</b> est un langage et un logiciel libre et gratuit pour l'analyse de données, les statistiques, les graphiques et la cartographie. <b>RStudio</b> est l'environnement de travail (l'« atelier ») qui rend R confortable : éditeur de scripts, console, explorateur de fichiers, aide et graphiques.</p>\n<p>Pourquoi R dans une école de géomatique et d'environnement ?</p>\n<ul>\n  <li>Tout est <b>écrit dans un script</b> : l'analyse peut être relue, corrigée et relancée sur de nouvelles données (reproductibilité).</li>\n  <li>Des milliers de <b>packages</b> gratuits : statistiques, <code>ggplot2</code> pour les graphiques, <code>sf</code> pour les couches vecteur, <code>terra</code> pour les rasters et les MNT.</li>\n  <li>R complète ArcGIS et QGIS : on prépare les données et on fait les statistiques dans R, on finalise une mise en page dans un SIG si besoin.</li>\n</ul>\n<h4>Installation (dans cet ordre)</h4>\n<ol>\n  <li>Installez <b>R</b> depuis le site du CRAN : <code>cran.r-project.org</code> &gt; <i>Download R for Windows</i> &gt; <i>base</i>.</li>\n  <li>Installez <b>RStudio Desktop</b> (gratuit) depuis le site de Posit : <code>posit.co</code> &gt; <i>RStudio Desktop</i>.</li>\n  <li>Lancez <b>RStudio</b> (pas R) : il trouve R automatiquement.</li>\n</ol>\n<h4>Les quatre panneaux de RStudio</h4>\n<ul>\n  <li><b>Source</b> (en haut à gauche) : vos scripts <code>.R</code>.</li>\n  <li><b>Console</b> (en bas à gauche) : là où R exécute les commandes et affiche les résultats.</li>\n  <li><b>Environment / History</b> (en haut à droite) : les objets créés pendant la session.</li>\n  <li><b>Files / Plots / Packages / Help</b> (en bas à droite) : fichiers, graphiques, packages et aide.</li>\n</ul>\n<div class=\"astuce\"><b>À retenir :</b> réglez une fois pour toutes <i>Tools &gt; Global Options &gt; General</i> : décochez <i>Restore .RData into workspace at startup</i> et choisissez <i>Never</i> pour <i>Save workspace to .RData on exit</i>. Vos résultats doivent venir du script, pas d'une mémoire cachée.</div>",
     "exercice": "<ol>\n  <li>Installez R puis RStudio sur votre poste (ou vérifiez qu'ils le sont en salle informatique).</li>\n  <li>Ouvrez RStudio et repérez les quatre panneaux.</li>\n  <li>Dans la console, tapez <code>R.version.string</code> puis Entrée : notez la version de R.</li>\n  <li>Appliquez les réglages de l'encadré « À retenir ».</li>\n</ol>"
    },
    {
     "id": "r1-l2",
     "titre": "La console, les scripts et les commentaires",
     "duree": "25 min",
     "objectifs": [
      "Utiliser R comme une calculatrice dans la console",
      "Écrire, commenter et enregistrer un script .R",
      "Exécuter une ligne ou une sélection avec Ctrl + Entrée"
     ],
     "contenu": "\n<p>La <b>console</b> exécute immédiatement ce que vous tapez. Essayez :</p>\n<pre><code>2 + 3\n(1250 - 830) / 20     # dénivelé moyen en m par km\nsqrt(144)\nround(pi, 2)\n10 %% 3               # reste de la division entière</code></pre>\n<p>Mais ce qui est tapé dans la console est vite perdu. On travaille donc dans un <b>script</b> : <i>File &gt; New File &gt; R Script</i> (ou <kbd>Ctrl + Maj + N</kbd>). Le script est un simple fichier texte d'extension <code>.R</code>.</p>\n<ul>\n  <li><kbd>Ctrl + Entrée</kbd> exécute la ligne où se trouve le curseur (ou la sélection) ;</li>\n  <li><kbd>Ctrl + Maj + S</kbd> exécute tout le script (<i>Source</i>) ;</li>\n  <li><kbd>Ctrl + S</kbd> enregistre le script.</li>\n</ul>\n<p>Tout ce qui suit un <code>#</code> est un <b>commentaire</b> : R l'ignore, mais il explique votre démarche au lecteur (et à vous dans trois mois).</p>\n<pre><code># =========================================\n# TP1 : premiers calculs\n# Auteur : votre nom   Date : 2026-11-22\n# =========================================\nsurface_km2 &lt;- 400          # surface de la zone d'étude\npopulation  &lt;- 104120\npopulation / surface_km2    # densité en hab./km²</code></pre>\n<div class=\"astuce\"><b>Le signe <code>&gt;</code> et le signe <code>+</code></b> dans la console : <code>&gt;</code> signifie que R attend une commande ; <code>+</code> signifie qu'une commande n'est pas terminée (parenthèse ou guillemet oublié). Appuyez sur <kbd>Échap</kbd> pour annuler.</div>",
     "exercice": "<ol>\n  <li>Créez un script <code>TP1_calculs.R</code> avec un en-tête commenté.</li>\n  <li>Calculez la densité de population d'une commune de 26 024 habitants et de 38,5 km².</li>\n  <li>Convertissez 852 m en pieds (1 pied = 0,3048 m) et arrondissez à l'unité avec <code>round()</code>.</li>\n  <li>Exécutez le script ligne par ligne, puis en entier avec <i>Source</i>.</li>\n</ol>"
    },
    {
     "id": "r1-l3",
     "titre": "Projets RStudio et dossier de travail",
     "duree": "20 min",
     "objectifs": [
      "Comprendre le répertoire de travail et les chemins relatifs",
      "Ouvrir le projet TP_R.Rproj fourni avec les données",
      "Organiser un projet : données, scripts, sorties"
     ],
     "contenu": "\n<p>R lit et écrit les fichiers à partir d'un <b>répertoire de travail</b>. Pour éviter les chemins du type <code>C:/Users/.../Bureau/...</code> qui ne marchent que sur un seul poste, on utilise un <b>projet RStudio</b> : un fichier <code>.Rproj</code> qui fixe automatiquement le dossier de travail.</p>\n<p>Les données de TP de ce site sont livrées sous forme de projet :</p>\n<pre><code>TP_R/\n├── TP_R.Rproj          &lt;- double-cliquez ici pour ouvrir le projet\n├── donnees/\n│   ├── shapefiles/     Communes, Oueds, Routes, Forages, Ecoles...\n│   ├── tamda.gpkg      toutes les couches dans un GeoPackage\n│   ├── raster/         MNT_50m.tif\n│   └── tables/         pluie, stations, qualité de l'eau, population...\n├── scripts/            01_premiers_pas.R ... 09_risques_multicritere.R\n└── sorties/            vos résultats (cartes, tableaux, rasters)</code></pre>\n<p>Une fois le projet ouvert, les chemins sont <b>relatifs</b> au dossier <code>TP_R</code> :</p>\n<pre><code>getwd()                         # dossier de travail actuel\nlist.files(\"donnees/tables\")    # contenu d'un sous-dossier\nfile.exists(\"donnees/raster/MNT_50m.tif\")</code></pre>\n<div class=\"astuce\"><b>Sous Windows</b>, R écrit les chemins avec des barres obliques <code>/</code> (ou des doubles barres inverses <code>\\\\</code>). Un chemin copié depuis l'explorateur avec <code>\\</code> simple provoque une erreur.</div>",
     "exercice": "<ol>\n  <li>Téléchargez <code>TP_R_ENIV.zip</code> (page Téléchargements) et décompressez-le dans <code>C:\\ENIV\\</code>.</li>\n  <li>Double-cliquez sur <code>C:\\ENIV\\TP_R\\TP_R.Rproj</code> : RStudio s'ouvre sur le projet (son nom apparaît en haut à droite).</li>\n  <li>Dans la console, vérifiez <code>getwd()</code> et listez les fichiers de <code>donnees/tables</code>.</li>\n  <li>Ouvrez <code>scripts/01_premiers_pas.R</code> et exécutez-le ligne par ligne.</li>\n</ol>"
    },
    {
     "id": "r1-l4",
     "titre": "Packages et aide",
     "duree": "20 min",
     "objectifs": [
      "Installer un package une fois et le charger à chaque session",
      "Installer les packages du cours",
      "Lire une page d'aide et ses exemples"
     ],
     "contenu": "\n<p>Un <b>package</b> ajoute des fonctions à R. On l'<b>installe une seule fois</b> par ordinateur (téléchargement depuis le CRAN), puis on le <b>charge</b> à chaque session avec <code>library()</code>.</p>\n<pre><code># Une seule fois (connexion Internet nécessaire)\ninstall.packages(c(\"tidyverse\", \"readxl\", \"sf\", \"terra\"))\n\n# À chaque session, en haut du script\nlibrary(dplyr)\nlibrary(ggplot2)</code></pre>\n<p>Les packages du cours :</p>\n<ul>\n  <li><code>tidyverse</code> : un ensemble (dplyr, tidyr, readr, ggplot2…) pour manipuler et représenter les données ;</li>\n  <li><code>readxl</code> : lire des fichiers Excel ;</li>\n  <li><code>sf</code> : données vectorielles (shapefile, GeoPackage), projections, géotraitements ;</li>\n  <li><code>terra</code> : rasters, MNT, analyse de terrain, algèbre de cartes.</li>\n</ul>\n<h4>Trouver de l'aide</h4>\n<pre><code>?mean              # page d'aide d'une fonction\nhelp(\"round\")\nexample(round)     # exécute les exemples de la page d'aide\n??\"slope\"          # recherche dans toutes les aides installées\nsessionInfo()      # versions de R et des packages (à joindre quand on signale un problème)</code></pre>\n<div class=\"astuce\"><b>Lire un message d'erreur :</b> <code>Error in library(sf) : there is no package called 'sf'</code> signifie simplement que le package n'est pas installé. Copiez le message d'erreur dans un moteur de recherche : quelqu'un a presque toujours rencontré le même problème.</div>",
     "exercice": "<ol>\n  <li>Installez les packages du cours avec <code>install.packages()</code>.</li>\n  <li>Chargez <code>sf</code> et <code>terra</code> : notez les versions de GDAL et PROJ affichées.</li>\n  <li>Ouvrez l'aide de <code>mean</code> : à quoi sert l'argument <code>na.rm</code> ?</li>\n  <li>Exécutez <code>example(boxplot)</code> et observez le panneau Plots.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Quel logiciel faut-il installer en premier ?",
     "choix": [
      "Les deux en même temps",
      "RStudio",
      "R",
      "Le package tidyverse"
     ],
     "bonne": 2,
     "explication": "RStudio est l'atelier ; il a besoin de R, le moteur, déjà installé."
    },
    {
     "question": "Quel raccourci exécute la ligne courante d'un script dans RStudio ?",
     "choix": [
      "Ctrl + Entrée",
      "F5",
      "Ctrl + S",
      "Ctrl + Maj + N"
     ],
     "bonne": 0,
     "explication": "Ctrl + Entrée envoie la ligne (ou la sélection) à la console."
    },
    {
     "question": "À quoi sert le symbole # dans un script R ?",
     "choix": [
      "À écrire un commentaire ignoré par R",
      "À charger un package",
      "À créer un objet",
      "À multiplier"
     ],
     "bonne": 0,
     "explication": "Tout ce qui suit # sur la ligne est un commentaire."
    },
    {
     "question": "Pourquoi utiliser un projet RStudio (.Rproj) ?",
     "choix": [
      "Pour fixer le dossier de travail et utiliser des chemins relatifs",
      "Pour rendre R plus rapide",
      "Pour enregistrer les graphiques en PDF",
      "Pour installer les packages"
     ],
     "bonne": 0,
     "explication": "Le projet fixe le répertoire de travail : le même script fonctionne sur tous les postes."
    },
    {
     "question": "Quelle est la bonne démarche pour utiliser le package sf ?",
     "choix": [
      "install.packages(\"sf\") à chaque session",
      "library(sf) une fois, install.packages à chaque session",
      "Rien : sf est intégré à R",
      "install.packages(\"sf\") une fois, puis library(sf) à chaque session"
     ],
     "bonne": 3,
     "explication": "On installe une fois par ordinateur et on charge à chaque session."
    },
    {
     "question": "Dans la console, que signifie un + en début de ligne ?",
     "choix": [
      "Un package est en cours d'installation",
      "R a planté",
      "La commande précédente n'est pas terminée",
      "Une addition est en cours"
     ],
     "bonne": 2,
     "explication": "Il manque souvent une parenthèse ou un guillemet ; Échap annule."
    }
   ]
  },
  {
   "id": "r2",
   "numero": 2,
   "titre": "Les bases du langage R",
   "echelle": "1:500 000",
   "resume": "Objets et affectation, types de données, vecteurs et calcul vectorisé, indexation, valeurs manquantes, facteurs, listes et matrices.",
   "lecons": [
    {
     "id": "r2-l1",
     "titre": "Objets, affectation et types",
     "duree": "25 min",
     "objectifs": [
      "Créer des objets avec <-",
      "Reconnaître les types numeric, character et logical",
      "Respecter les règles de nommage"
     ],
     "contenu": "\n<p>En R, on range une valeur dans un <b>objet</b> avec la flèche d'affectation <code>&lt;-</code> (raccourci <kbd>Alt + -</kbd>).</p>\n<pre><code>altitude   &lt;- 852          # nombre (numeric)\nstation    &lt;- \"Tamda\"      # texte (character), toujours entre guillemets\nen_service &lt;- TRUE         # logique (logical) : TRUE ou FALSE\naltitude                   # afficher le contenu\nclass(altitude); class(station); class(en_service)\naltitude_km &lt;- altitude / 1000</code></pre>\n<p>Règles de nommage : commencer par une lettre, pas d'espace ni d'accent, pas de tiret. R distingue majuscules et minuscules (<code>Pluie</code> ≠ <code>pluie</code>). Préférez des noms explicites : <code>pluie_annuelle</code> plutôt que <code>x</code>.</p>\n<h4>Comparaisons et opérateurs logiques</h4>\n<pre><code>altitude &gt; 800              # TRUE\naltitude == 852             # égalité : deux signes =\naltitude != 900             # différent\naltitude &gt; 500 &amp; altitude &lt; 1000   # ET\naltitude &lt; 500 | altitude &gt; 1000   # OU\nas.numeric(\"12.5\")          # conversion de texte en nombre\nas.character(2024)</code></pre>\n<div class=\"astuce\"><b>Décimales :</b> R utilise toujours le <b>point</b> comme séparateur décimal : <code>12.5</code>, jamais <code>12,5</code>.</div>",
     "exercice": "<ol>\n  <li>Créez les objets <code>nom_commune</code>, <code>population</code> (26024) et <code>surface</code> (38.5).</li>\n  <li>Calculez <code>densite</code> et vérifiez sa classe.</li>\n  <li>Testez si la densité dépasse 500 hab./km².</li>\n  <li>Que renvoie <code>as.numeric(\"12,5\")</code> ? Expliquez.</li>\n</ol>"
    },
    {
     "id": "r2-l2",
     "titre": "Vecteurs et calcul vectorisé",
     "duree": "30 min",
     "objectifs": [
      "Créer un vecteur avec c(), seq() et rep()",
      "Appliquer un calcul à tous les éléments d'un coup",
      "Utiliser les fonctions de résumé : sum, mean, min, max, length"
     ],
     "contenu": "\n<p>Un <b>vecteur</b> est une suite de valeurs du même type. C'est la brique de base de R : une colonne d'un tableau est un vecteur.</p>\n<pre><code>mois  &lt;- c(\"Jan\",\"Fév\",\"Mar\",\"Avr\",\"Mai\",\"Juin\",\"Juil\",\"Août\",\"Sep\",\"Oct\",\"Nov\",\"Déc\")\npluie &lt;- c(62, 55, 52, 40, 30, 8, 2, 4, 22, 40, 58, 64)   # mm, station fictive\nnames(pluie) &lt;- mois\nlength(pluie)\nsum(pluie)        # cumul annuel\nmean(pluie); median(pluie); min(pluie); max(pluie); range(pluie)</code></pre>\n<p>Les opérations sont <b>vectorisées</b> : elles s'appliquent à chaque élément sans écrire de boucle.</p>\n<pre><code>pluie / 10                 # en cm\npluie * 1.1                # scénario +10 %\ntemp &lt;- c(9, 10, 12.5, 14.5, 18, 22.5, 26, 26.5, 22.5, 18, 13, 10)\npluie &lt; 2 * temp           # mois secs selon Gaussen (P &lt; 2T)\nsum(pluie &lt; 2 * temp)      # nombre de mois secs (TRUE compte pour 1)\ncumsum(pluie)              # cumul progressif\nannees &lt;- 2010:2024        # suite d'entiers\nseq(0, 1000, by = 250)     # 0 250 500 750 1000\nrep(\"S01\", 3)</code></pre>\n<div class=\"astuce\"><b>Attention au mélange de types :</b> <code>c(1, \"a\", TRUE)</code> transforme tout en texte. Un vecteur ne contient qu'un seul type.</div>",
     "exercice": "<ol>\n  <li>Saisissez les températures mensuelles <code>temp</code> ci-dessus et calculez la moyenne annuelle.</li>\n  <li>Calculez l'amplitude thermique (max − min).</li>\n  <li>Combien de mois sont secs (P &lt; 2T) ? Lesquels ? (indice : <code>names(pluie)[pluie &lt; 2 * temp]</code>)</li>\n  <li>Calculez l'indice de De Martonne <code>sum(pluie) / (mean(temp) + 10)</code>.</li>\n</ol>"
    },
    {
     "id": "r2-l3",
     "titre": "Indexation et valeurs manquantes (NA)",
     "duree": "25 min",
     "objectifs": [
      "Extraire des éléments par position, par nom ou par condition",
      "Repérer et gérer les valeurs manquantes NA",
      "Utiliser which(), is.na() et l'argument na.rm"
     ],
     "contenu": "\n<p>Les <b>crochets</b> <code>[ ]</code> extraient des éléments d'un vecteur.</p>\n<pre><code>pluie[1]                  # premier élément\npluie[c(6, 7, 8)]         # plusieurs positions\npluie[-1]                 # tout sauf le premier\npluie[\"Oct\"]              # par nom\npluie[pluie &gt; 50]         # par condition : mois humides\nwhich(pluie &gt; 50)         # positions qui vérifient la condition\nwhich.max(pluie)          # position du maximum\npluie[pluie &gt; 50] &lt;- 50   # remplacer (écrêter) des valeurs</code></pre>\n<h4>Valeurs manquantes</h4>\n<p>Une mesure absente (panne d'un pluviomètre, forage non jaugé) est notée <code>NA</code> (<i>Not Available</i>). Un calcul qui contient un <code>NA</code> renvoie <code>NA</code> : c'est volontaire, R refuse d'inventer.</p>\n<pre><code>debit &lt;- c(6.5, 7.1, NA, 16.0, 4.5)   # l/s\nmean(debit)                    # NA\nmean(debit, na.rm = TRUE)      # moyenne des valeurs présentes\nis.na(debit)\nsum(is.na(debit))              # nombre de NA\ndebit[!is.na(debit)]           # valeurs présentes seulement</code></pre>\n<div class=\"astuce\"><b>À retenir :</b> ne remplacez jamais un <code>NA</code> par 0 sans réfléchir : 0 mm de pluie et « pas de mesure » ne veulent pas dire la même chose.</div>",
     "exercice": "<ol>\n  <li>Avec le vecteur <code>pluie</code>, extrayez les mois d'hiver (Déc, Jan, Fév) par leur nom.</li>\n  <li>Quel est le mois le plus sec ? (utilisez <code>which.min</code> et <code>names</code>)</li>\n  <li>Créez <code>prof &lt;- c(175, 65, NA, 235, 250, NA, 160)</code> : comptez les NA et calculez la profondeur moyenne.</li>\n  <li>Combien de forages dépassent 150 m de profondeur (sans compter les NA) ?</li>\n</ol>"
    },
    {
     "id": "r2-l4",
     "titre": "Facteurs, listes et matrices",
     "duree": "25 min",
     "objectifs": [
      "Utiliser les facteurs pour les variables qualitatives",
      "Regrouper des objets différents dans une liste",
      "Créer et manipuler une matrice"
     ],
     "contenu": "\n<p>Un <b>facteur</b> représente une variable qualitative (catégories) : état d'un forage, type d'occupation du sol, classe de pente.</p>\n<pre><code>etat &lt;- factor(c(\"En service\", \"À l'arrêt\", \"En service\", \"Abandonné\", \"En service\"))\nlevels(etat)            # les modalités\ntable(etat)             # effectifs par modalité\nclasse &lt;- factor(c(\"faible\", \"fort\", \"moyen\"), levels = c(\"faible\", \"moyen\", \"fort\"), ordered = TRUE)\nclasse &lt; \"fort\"         # comparaisons possibles sur un facteur ordonné</code></pre>\n<p>Une <b>liste</b> regroupe des objets de types et de longueurs différents. Beaucoup de résultats de R (tests, modèles) sont des listes.</p>\n<pre><code>forage &lt;- list(id = \"F001\", prof_m = 175, analyses = c(38.7, 41.2))\nforage$prof_m\nforage[[\"analyses\"]][2]\nnames(forage)</code></pre>\n<p>Une <b>matrice</b> est un tableau à deux dimensions d'un seul type ; un raster est, au fond, une grande matrice de valeurs.</p>\n<pre><code>m &lt;- matrix(c(850, 860, 870, 845, 855, 880), nrow = 2, byrow = TRUE)\nm\ndim(m)          # 2 lignes, 3 colonnes\nm[2, 3]         # ligne 2, colonne 3\nm[1, ]          # toute la ligne 1\nm - min(m)      # calcul sur toutes les cellules</code></pre>\n<div class=\"astuce\">Le script <code>scripts/02_bases_langage.R</code> reprend tous les exemples du niveau.</div>",
     "exercice": "<ol>\n  <li>Créez un facteur <code>occup</code> avec les valeurs Forêt, Agriculture, Forêt, Parcours, Urbain, Forêt et affichez ses effectifs.</li>\n  <li>Créez une liste <code>station</code> contenant le nom, l'altitude et le vecteur de pluie mensuelle ; calculez le cumul à partir de la liste.</li>\n  <li>Créez une matrice 3 × 3 d'altitudes et calculez la différence entre la cellule centrale et la moyenne des cellules.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Quel opérateur sert à affecter une valeur à un objet en R ?",
     "choix": [
      "==",
      "->>",
      "<-",
      "="
     ],
     "bonne": 2,
     "explication": "<- est l'opérateur d'affectation conseillé ; == sert à comparer."
    },
    {
     "question": "Que renvoie mean(c(4, NA, 8)) ?",
     "choix": [
      "6",
      "4",
      "NA",
      "Une erreur"
     ],
     "bonne": 2,
     "explication": "Il faut ajouter na.rm = TRUE pour ignorer la valeur manquante."
    },
    {
     "question": "Que renvoie c(2, 4, 6) * 10 ?",
     "choix": [
      "Une erreur",
      "120",
      "20 40 60",
      "2 4 6 10"
     ],
     "bonne": 2,
     "explication": "Le calcul est vectorisé : chaque élément est multiplié par 10."
    },
    {
     "question": "Comment extraire les valeurs de pluie supérieures à 50 ?",
     "choix": [
      "pluie[pluie > 50]",
      "which(pluie)",
      "pluie(> 50)",
      "pluie[[50]]"
     ],
     "bonne": 0,
     "explication": "On indexe le vecteur par une condition logique entre crochets."
    },
    {
     "question": "Quel type d'objet convient à une variable « état du forage » (En service, À l'arrêt, Abandonné) ?",
     "choix": [
      "list",
      "numeric",
      "matrix",
      "factor"
     ],
     "bonne": 3,
     "explication": "Les variables qualitatives se représentent par des facteurs."
    },
    {
     "question": "Quel est le séparateur décimal dans R ?",
     "choix": [
      "La virgule",
      "Le point",
      "Les deux",
      "Le point-virgule"
     ],
     "bonne": 1,
     "explication": "R utilise toujours le point : 12.5."
    }
   ]
  },
  {
   "id": "r3",
   "numero": 3,
   "titre": "Tableaux de données : importer et manipuler",
   "echelle": "1:250 000",
   "resume": "Data frames, import de fichiers CSV et Excel, manipulation avec dplyr (filtrer, sélectionner, calculer, résumer, joindre) et export des résultats.",
   "lecons": [
    {
     "id": "r3-l1",
     "titre": "Les data frames",
     "duree": "25 min",
     "objectifs": [
      "Créer un data frame et accéder à ses colonnes",
      "Explorer un tableau : head, str, summary, nrow",
      "Ajouter une colonne calculée"
     ],
     "contenu": "\n<p>Un <b>data frame</b> est un tableau : chaque <b>ligne</b> est une observation (un forage, une station, un mois), chaque <b>colonne</b> une variable (un vecteur). C'est l'équivalent de la table attributaire d'une couche SIG.</p>\n<pre><code>stations &lt;- data.frame(\n  ID_ST = c(\"S01\", \"S02\", \"S03\"),\n  NOM   = c(\"Tamda\", \"Ain Zerga\", \"Bordj Lmaa\"),\n  ALT_M = c(548, 691, 742),\n  P_AN  = c(465, 584, 552)\n)\nstations\nstations$ALT_M                   # une colonne = un vecteur\nstations[2, ]                    # ligne 2\nstations[, c(\"NOM\", \"P_AN\")]     # deux colonnes\nstations[stations$ALT_M &gt; 600, ] # lignes qui vérifient une condition\nstations$P_CM &lt;- stations$P_AN / 10   # nouvelle colonne</code></pre>\n<h4>Explorer un tableau</h4>\n<pre><code>head(stations)       # premières lignes\nstr(stations)        # structure : type de chaque colonne\nsummary(stations)    # résumé statistique de chaque colonne\nnrow(stations); ncol(stations); names(stations)\nView(stations)       # ouvre le tableau dans RStudio</code></pre>\n<div class=\"astuce\"><b>Astuce RStudio :</b> cliquez sur le nom d'un tableau dans le panneau <i>Environment</i> pour l'afficher, le trier et le filtrer visuellement.</div>",
     "exercice": "<ol>\n  <li>Créez un data frame <code>communes</code> avec 4 communes (CODE, NOM, POP, SURF_KM2) de votre choix.</li>\n  <li>Ajoutez une colonne <code>DENSITE</code>.</li>\n  <li>Affichez les communes de plus de 10 000 habitants.</li>\n  <li>Utilisez <code>str()</code> et <code>summary()</code> et commentez le résultat.</li>\n</ol>"
    },
    {
     "id": "r3-l2",
     "titre": "Importer des fichiers CSV et Excel",
     "duree": "30 min",
     "objectifs": [
      "Lire un CSV au format international (read.csv) ou français (read.csv2)",
      "Lire une feuille Excel avec readxl",
      "Vérifier l'import et corriger les problèmes courants"
     ],
     "contenu": "\n<p>Les fichiers CSV existent en deux « dialectes » :</p>\n<ul>\n  <li><b>international</b> : séparateur virgule, décimale point → <code>read.csv()</code> ;</li>\n  <li><b>français</b> (Excel réglé en français) : séparateur point-virgule, décimale virgule → <code>read.csv2()</code>.</li>\n</ul>\n<pre><code>pluie   &lt;- read.csv(\"donnees/tables/pluie_mensuelle.csv\")                       # , et .\nqualite &lt;- read.csv2(\"donnees/tables/qualite_eau_forages.csv\", encoding = \"UTF-8\") # ; et ,\npop     &lt;- read.csv(\"donnees/tables/population_communes.csv\", sep = \";\")      # ; mais pas de décimales\ngps     &lt;- read.csv(\"donnees/tables/releves_gps.csv\", sep = \";\")              # ; et décimale point\n\nlibrary(readxl)\nexcel_sheets(\"donnees/tables/population_communes.xlsx\")\npop_xl &lt;- read_excel(\"donnees/tables/population_communes.xlsx\", sheet = 1)</code></pre>\n<h4>Toujours vérifier l'import</h4>\n<pre><code>str(qualite)            # NITRATES_MGL doit être num, pas chr\nsummary(pluie)          # repérer les NA et les valeurs aberrantes\nunique(pluie$ID_ST)</code></pre>\n<p>Problèmes fréquents : une colonne numérique lue comme texte (mauvais séparateur décimal), des accents illisibles (ajoutez <code>encoding = \"UTF-8\"</code>), une seule colonne au lieu de plusieurs (mauvais séparateur <code>sep</code>).</p>\n<div class=\"astuce\"><b>Exporter :</b> <code>write.csv(tableau, \"sorties/resultat.csv\", row.names = FALSE)</code> pour un CSV international, <code>write.csv2()</code> pour un fichier qui s'ouvre directement dans Excel en français.</div>",
     "exercice": "<ol>\n  <li>Importez les cinq tables du dossier <code>donnees/tables</code> avec la bonne fonction.</li>\n  <li>Lisez par erreur <code>qualite_eau_forages.csv</code> avec <code>read.csv()</code> : que se passe-t-il ?</li>\n  <li>Combien de valeurs manquantes contient la colonne <code>PLUIE_MM</code> ?</li>\n  <li>Combien de stations et d'années couvre la table de pluie ?</li>\n</ol>"
    },
    {
     "id": "r3-l3",
     "titre": "Manipuler avec dplyr",
     "duree": "35 min",
     "objectifs": [
      "Enchaîner les opérations avec le pipe |>",
      "Utiliser filter, select, mutate et arrange",
      "Créer des classes avec case_when"
     ],
     "contenu": "\n<p>Le package <code>dplyr</code> fournit des « verbes » simples pour manipuler un tableau. Le <b>pipe</b> <code>|&gt;</code> (raccourci <kbd>Ctrl + Maj + M</kbd>) passe le résultat d'une étape à la suivante : on lit « puis ».</p>\n<pre><code>library(dplyr)\npluie &lt;- read.csv(\"donnees/tables/pluie_mensuelle.csv\")\n\nhiver &lt;- pluie |&gt;\n  filter(MOIS %in% c(12, 1, 2), !is.na(PLUIE_MM)) |&gt;   # garder des lignes\n  select(ID_ST, ANNEE, MOIS, PLUIE_MM) |&gt;               # garder des colonnes\n  mutate(PLUIE_CM = PLUIE_MM / 10) |&gt;                   # créer une colonne\n  arrange(desc(PLUIE_MM))                               # trier (décroissant)\nhead(hiver)</code></pre>\n<p><code>case_when()</code> crée des classes à partir de conditions, comme une reclassification :</p>\n<pre><code>qualite &lt;- read.csv2(\"donnees/tables/qualite_eau_forages.csv\", encoding = \"UTF-8\")\nqualite &lt;- qualite |&gt;\n  mutate(CLASSE_NO3 = case_when(\n    NITRATES_MGL &lt; 25 ~ \"bonne\",\n    NITRATES_MGL &lt; 50 ~ \"moyenne\",\n    TRUE              ~ \"non potable\"     # tous les autres cas\n  ))\ncount(qualite, CAMPAGNE, CLASSE_NO3)</code></pre>\n<div class=\"astuce\"><b>Lisibilité :</b> une étape par ligne, le pipe en fin de ligne. Si une étape plante, exécutez la chaîne morceau par morceau pour trouver laquelle.</div>",
     "exercice": "<ol>\n  <li>À partir de <code>qualite</code>, gardez les forages dont les nitrates dépassent 50 mg/L en basses eaux, triés du plus pollué au moins pollué.</li>\n  <li>Ajoutez une colonne <code>COND_MSCM</code> (conductivité en mS/cm = µS/cm / 1000).</li>\n  <li>Dans <code>pluie</code>, gardez la station S03 de 2020 à 2024 et les mois secs (PLUIE_MM &lt; 2 × TMOY_C).</li>\n</ol>"
    },
    {
     "id": "r3-l4",
     "titre": "Résumer, joindre et remodeler",
     "duree": "35 min",
     "objectifs": [
      "Calculer des statistiques par groupe avec group_by et summarise",
      "Joindre deux tables par une clé (left_join)",
      "Passer d'un format long à un format large (tidyr)"
     ],
     "contenu": "\n<p><code>group_by()</code> + <code>summarise()</code> calcule une statistique par groupe, comme l'outil « Statistiques récapitulatives » d'un SIG.</p>\n<pre><code>annuel &lt;- pluie |&gt;\n  group_by(ID_ST, ANNEE) |&gt;\n  summarise(P_AN = sum(PLUIE_MM, na.rm = TRUE), T_MOY = mean(TMOY_C), .groups = \"drop\")\n\nmoyennes &lt;- annuel |&gt;\n  group_by(ID_ST) |&gt;\n  summarise(P_MOY = round(mean(P_AN)), T_MOY = round(mean(T_MOY), 1), N_ANS = n())</code></pre>\n<p>Une <b>jointure</b> rapproche deux tables qui partagent une clé (comme une jointure attributaire dans ArcGIS ou QGIS).</p>\n<pre><code>stations &lt;- read.csv(\"donnees/tables/stations_meteo.csv\", encoding = \"UTF-8\")\nsynthese &lt;- stations |&gt;\n  left_join(moyennes, by = \"ID_ST\") |&gt;\n  arrange(ALT_M)\nsynthese        # la pluie augmente-t-elle avec l'altitude ?</code></pre>\n<p><code>tidyr</code> change la forme d'un tableau : format <b>long</b> (une ligne par station et par année) ou <b>large</b> (une colonne par station).</p>\n<pre><code>library(tidyr)\nlarge &lt;- annuel |&gt; select(ID_ST, ANNEE, P_AN) |&gt;\n  pivot_wider(names_from = ID_ST, values_from = P_AN)\nlong  &lt;- large |&gt; pivot_longer(-ANNEE, names_to = \"ID_ST\", values_to = \"P_AN\")\nwrite.csv(synthese, \"sorties/synthese_stations.csv\", row.names = FALSE)</code></pre>\n<div class=\"astuce\">Le script complet du niveau est <code>scripts/03_tableaux_dplyr.R</code>.</div>",
     "exercice": "<ol>\n  <li>Calculez, pour chaque campagne, la moyenne, le minimum et le maximum des nitrates, ainsi que le nombre de forages au-dessus de 50 mg/L.</li>\n  <li>Joignez <code>forages_attributs.csv</code> à la table de qualité par <code>ID_FOR</code>.</li>\n  <li>Calculez la pluie moyenne par mois (1 à 12) toutes stations confondues.</li>\n  <li>Exportez votre synthèse en CSV français dans <code>sorties/</code> et ouvrez-la dans Excel.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Quelle fonction lit un CSV « à la française » (point-virgule, virgule décimale) ?",
     "choix": [
      "read.csv2()",
      "read.table(dec = \".\")",
      "read.csv()",
      "read_excel()"
     ],
     "bonne": 0,
     "explication": "read.csv2 utilise sep = \";\" et dec = \",\" par défaut."
    },
    {
     "question": "Quel verbe dplyr garde certaines LIGNES d'un tableau ?",
     "choix": [
      "filter()",
      "mutate()",
      "select()",
      "arrange()"
     ],
     "bonne": 0,
     "explication": "filter garde des lignes ; select garde des colonnes."
    },
    {
     "question": "Que fait mutate(DENSITE = POP / SURF) ?",
     "choix": [
      "Supprime la colonne POP",
      "Filtre les communes denses",
      "Trie le tableau",
      "Crée ou modifie la colonne DENSITE"
     ],
     "bonne": 3,
     "explication": "mutate ajoute ou remplace des colonnes."
    },
    {
     "question": "Comment calculer la pluie annuelle de chaque station ?",
     "choix": [
      "left_join()",
      "group_by(ID_ST, ANNEE) puis summarise(sum(PLUIE_MM))",
      "filter() puis arrange()",
      "select(PLUIE_MM)"
     ],
     "bonne": 1,
     "explication": "group_by définit les groupes, summarise calcule une valeur par groupe."
    },
    {
     "question": "Une colonne de nombres apparaît en « chr » après l'import. Cause la plus probable ?",
     "choix": [
      "Mauvais séparateur décimal",
      "Le fichier est trop gros",
      "Il manque library(dplyr)",
      "Le fichier contient des NA"
     ],
     "bonne": 0,
     "explication": "Des valeurs comme 38,7 lues avec read.csv restent du texte."
    },
    {
     "question": "À quoi sert left_join(stations, moyennes, by = \"ID_ST\") ?",
     "choix": [
      "À ajouter aux stations les colonnes de moyennes ayant le même ID_ST",
      "À trier par ID_ST",
      "À empiler deux tableaux",
      "À supprimer les doublons"
     ],
     "bonne": 0,
     "explication": "C'est une jointure attributaire par la clé ID_ST."
    }
   ]
  },
  {
   "id": "r4",
   "numero": 4,
   "titre": "Graphiques avec ggplot2",
   "echelle": "1:100 000",
   "resume": "Graphiques rapides de R de base, grammaire des graphiques de ggplot2, diagramme ombrothermique, facettes, thèmes et export en haute résolution.",
   "lecons": [
    {
     "id": "r4-l1",
     "titre": "Graphiques rapides avec R de base",
     "duree": "20 min",
     "objectifs": [
      "Tracer un histogramme, une boîte à moustaches et un nuage de points",
      "Personnaliser titres, axes et couleurs",
      "Choisir le graphique adapté à la question"
     ],
     "contenu": "\n<p>R de base permet d'explorer rapidement une variable :</p>\n<pre><code>library(dplyr)\npluie   &lt;- read.csv(\"donnees/tables/pluie_mensuelle.csv\")\nqualite &lt;- read.csv2(\"donnees/tables/qualite_eau_forages.csv\", encoding = \"UTF-8\")\nannuel  &lt;- pluie |&gt; group_by(ID_ST, ANNEE) |&gt;\n  summarise(P_AN = sum(PLUIE_MM, na.rm = TRUE), .groups = \"drop\")\n\nhist(annuel$P_AN, main = \"Pluie annuelle\", xlab = \"mm\", col = \"skyblue\")       # distribution\nboxplot(P_AN ~ ID_ST, data = annuel, ylab = \"mm/an\", col = \"lightgreen\")       # comparer des groupes\nplot(qualite$COND_USCM, qualite$NITRATES_MGL, pch = 19,\n     xlab = \"Conductivité (µS/cm)\", ylab = \"Nitrates (mg/L)\")                   # relation entre 2 variables\nabline(h = 50, col = \"red\", lty = 2)                                            # seuil de potabilité\nbarplot(table(qualite$CAMPAGNE))                                                 # effectifs</code></pre>\n<table class=\"list\"><tr><th>Question</th><th>Graphique</th></tr>\n<tr><td>Comment se répartit une variable ?</td><td>Histogramme</td></tr>\n<tr><td>Les groupes diffèrent-ils ?</td><td>Boîtes à moustaches</td></tr>\n<tr><td>Deux variables sont-elles liées ?</td><td>Nuage de points</td></tr>\n<tr><td>Comment évolue une valeur dans le temps ?</td><td>Courbe</td></tr>\n<tr><td>Combien d'éléments par catégorie ?</td><td>Diagramme en barres</td></tr></table>",
     "exercice": "<ol>\n  <li>Tracez l'histogramme des nitrates et ajoutez une ligne verticale au seuil de 50 mg/L (<code>abline(v = 50)</code>).</li>\n  <li>Comparez la conductivité des deux campagnes avec un boxplot.</li>\n  <li>Enregistrez un graphique depuis le panneau Plots (<i>Export &gt; Save as Image</i>).</li>\n</ol>"
    },
    {
     "id": "r4-l2",
     "titre": "La grammaire de ggplot2",
     "duree": "35 min",
     "objectifs": [
      "Construire un graphique couche par couche : données, aes, geom",
      "Associer couleur, taille et forme à des variables",
      "Ajouter titres, légendes et lignes de référence"
     ],
     "contenu": "\n<p><code>ggplot2</code> construit un graphique en <b>couches</b>, un peu comme une carte dans un SIG :</p>\n<ul>\n  <li><code>ggplot(données, aes(...))</code> : le tableau et la correspondance variables → axes, couleurs, tailles (<i>aesthetics</i>) ;</li>\n  <li><code>geom_...()</code> : la forme géométrique (points, lignes, barres, boîtes) ;</li>\n  <li><code>labs()</code>, <code>theme_...()</code>, <code>scale_...()</code> : habillage.</li>\n</ul>\n<pre><code>library(ggplot2)\nggplot(qualite, aes(x = COND_USCM, y = NITRATES_MGL, colour = CAMPAGNE)) +\n  geom_point(size = 2) +\n  geom_hline(yintercept = 50, linetype = \"dashed\", colour = \"red\") +\n  labs(title = \"Nitrates et conductivité des forages\",\n       x = \"Conductivité (µS/cm)\", y = \"Nitrates (mg/L)\", colour = \"Campagne\") +\n  theme_minimal()</code></pre>\n<p>Quelques géométries utiles :</p>\n<pre><code>ggplot(annuel, aes(x = ID_ST, y = P_AN)) + geom_boxplot(fill = \"lightblue\")\nggplot(annuel, aes(x = P_AN)) + geom_histogram(bins = 15, fill = \"steelblue\", colour = \"white\")\nggplot(annuel, aes(x = ANNEE, y = P_AN, colour = ID_ST)) + geom_line()\nggplot(qualite, aes(x = CAMPAGNE)) + geom_bar()</code></pre>\n<div class=\"astuce\"><b>Le + en fin de ligne :</b> chaque couche s'ajoute avec <code>+</code> placé à la fin de la ligne précédente, jamais au début de la suivante.</div>",
     "exercice": "<ol>\n  <li>Tracez avec ggplot2 un nuage de points nitrates en fonction de la profondeur (joignez d'abord <code>forages_attributs.csv</code>).</li>\n  <li>Colorez les points selon l'état du forage et ajoutez <code>geom_smooth(method = \"lm\")</code>.</li>\n  <li>Donnez un titre, des noms d'axes avec unités et un thème de votre choix.</li>\n</ol>"
    },
    {
     "id": "r4-l3",
     "titre": "Diagramme ombrothermique, facettes et export",
     "duree": "35 min",
     "objectifs": [
      "Construire un diagramme ombrothermique de Gaussen",
      "Répéter un graphique par groupe avec facet_wrap",
      "Exporter en PNG haute résolution avec ggsave"
     ],
     "contenu": "\n<p>Le <b>diagramme ombrothermique</b> de Bagnouls et Gaussen superpose les précipitations (barres) et la température (courbe) avec l'échelle <b>P = 2T</b> : un mois est sec quand la barre passe sous la courbe.</p>\n<pre><code>clim &lt;- pluie |&gt; filter(ID_ST == \"S01\") |&gt; group_by(MOIS) |&gt;\n  summarise(P = mean(PLUIE_MM, na.rm = TRUE), T = mean(TMOY_C))\n\nombro &lt;- ggplot(clim, aes(x = MOIS)) +\n  geom_col(aes(y = P), fill = \"steelblue\") +\n  geom_line(aes(y = 2 * T), colour = \"firebrick\", linewidth = 1) +\n  geom_point(aes(y = 2 * T), colour = \"firebrick\") +\n  scale_x_continuous(breaks = 1:12, labels = c(\"J\",\"F\",\"M\",\"A\",\"M\",\"J\",\"J\",\"A\",\"S\",\"O\",\"N\",\"D\")) +\n  scale_y_continuous(name = \"Précipitations (mm)\",\n                     sec.axis = sec_axis(~ . / 2, name = \"Température (°C)\")) +\n  labs(title = \"Diagramme ombrothermique, station de Tamda (2010-2024)\", x = NULL) +\n  theme_bw()\nombro</code></pre>\n<p>Les <b>facettes</b> répètent le même graphique pour chaque groupe :</p>\n<pre><code>evol &lt;- ggplot(annuel, aes(ANNEE, P_AN)) +\n  geom_line() +\n  geom_smooth(method = \"lm\", se = FALSE, colour = \"orange\") +\n  facet_wrap(~ ID_ST) +\n  labs(x = \"Année\", y = \"Pluie annuelle (mm)\")\n\nggsave(\"sorties/ombrothermique_S01.png\", ombro, width = 18, height = 12, units = \"cm\", dpi = 300)\nggsave(\"sorties/pluie_annuelle_stations.png\", evol, width = 20, height = 14, units = \"cm\", dpi = 300)</code></pre>\n<div class=\"astuce\">300 dpi suffisent pour un mémoire imprimé. Le script <code>scripts/04_graphiques.R</code> contient tous les graphiques du niveau.</div>",
     "exercice": "<ol>\n  <li>Tracez le diagramme ombrothermique de la station S04 (la plus haute). Combien de mois secs compte-t-elle ?</li>\n  <li>Faites un diagramme ombrothermique pour chaque station avec <code>facet_wrap(~ ID_ST)</code>.</li>\n  <li>Exportez-le en PNG à 300 dpi et insérez-le dans un document Word.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Dans ggplot2, que définit aes() ?",
     "choix": [
      "Le format d'export",
      "La correspondance entre variables et propriétés visuelles (x, y, couleur…)",
      "Le titre",
      "La couleur du fond"
     ],
     "bonne": 1,
     "explication": "aes = aesthetics : quelles variables vont sur les axes, les couleurs, les tailles."
    },
    {
     "question": "Quel graphique pour comparer la conductivité de deux campagnes ?",
     "choix": [
      "Carte",
      "Courbe",
      "Boîtes à moustaches",
      "Camembert"
     ],
     "bonne": 2,
     "explication": "Le boxplot compare la distribution d'une variable entre groupes."
    },
    {
     "question": "Dans un diagramme ombrothermique de Gaussen, un mois est sec quand :",
     "choix": [
      "P = 0",
      "P < 2T",
      "P > 2T",
      "T > 30 °C"
     ],
     "bonne": 1,
     "explication": "Le mois est sec quand la courbe 2T passe au-dessus des précipitations."
    },
    {
     "question": "Quelle fonction répète un graphique pour chaque station ?",
     "choix": [
      "theme_bw()",
      "facet_wrap(~ ID_ST)",
      "group_by(ID_ST)",
      "geom_line()"
     ],
     "bonne": 1,
     "explication": "facet_wrap crée un petit graphique par modalité."
    },
    {
     "question": "Comment enregistrer un ggplot en PNG à 300 dpi ?",
     "choix": [
      "ggsave(\"fichier.png\", graphique, dpi = 300)",
      "save.png()",
      "write.csv()",
      "png = TRUE"
     ],
     "bonne": 0,
     "explication": "ggsave choisit le format selon l'extension du fichier."
    },
    {
     "question": "Où se place le signe + qui ajoute une couche ggplot ?",
     "choix": [
      "À la fin de la ligne",
      "Entre parenthèses",
      "Au début de la ligne suivante",
      "Il n'est pas nécessaire"
     ],
     "bonne": 0,
     "explication": "Placé en début de ligne, R considère la commande précédente comme terminée."
    }
   ]
  },
  {
   "id": "r5",
   "numero": 5,
   "titre": "Statistiques pour l'environnement",
   "echelle": "1:50 000",
   "resume": "Statistique descriptive, normalité, tests de comparaison (Student, Wilcoxon, ANOVA, khi-deux), corrélation, régression linéaire et tendance des séries climatiques.",
   "lecons": [
    {
     "id": "r5-l1",
     "titre": "Statistique descriptive",
     "duree": "30 min",
     "objectifs": [
      "Calculer les indicateurs de position et de dispersion",
      "Résumer une variable par groupe",
      "Interpréter moyenne, médiane, écart-type et coefficient de variation"
     ],
     "contenu": "\n<p>Avant tout test, on <b>décrit</b> les données : position (moyenne, médiane), dispersion (écart-type, quartiles) et forme (histogramme).</p>\n<pre><code>library(dplyr)\nqualite &lt;- read.csv2(\"donnees/tables/qualite_eau_forages.csv\", encoding = \"UTF-8\")\nx &lt;- qualite$NITRATES_MGL\n\nsummary(x)                     # min, quartiles, moyenne, max\nmean(x); median(x)\nsd(x); var(x)                  # écart-type, variance\nIQR(x)                         # écart interquartile\nquantile(x, c(0.1, 0.9))       # déciles\ncv &lt;- 100 * sd(x) / mean(x)    # coefficient de variation (%)</code></pre>\n<p>Par groupe, avec dplyr :</p>\n<pre><code>qualite |&gt;\n  group_by(CAMPAGNE) |&gt;\n  summarise(n = n(), moyenne = mean(NITRATES_MGL), mediane = median(NITRATES_MGL),\n            ecart_type = sd(NITRATES_MGL), depasse_50 = sum(NITRATES_MGL &gt; 50))\ntable(qualite$NITRATES_MGL &gt; 50, qualite$CAMPAGNE)   # tableau croisé</code></pre>\n<div class=\"astuce\"><b>Moyenne ou médiane ?</b> Si quelques valeurs extrêmes tirent la moyenne (une crue exceptionnelle, un forage très pollué), la médiane décrit mieux la valeur « typique ». Un CV &gt; 30 % indique une forte variabilité, fréquente pour la pluie en climat méditerranéen.</div>",
     "exercice": "<ol>\n  <li>Décrivez la conductivité (COND_USCM) : moyenne, médiane, écart-type, CV.</li>\n  <li>Comparez ces indicateurs entre hautes et basses eaux.</li>\n  <li>Calculez la pluie annuelle de chaque station puis son CV : quelle station est la plus irrégulière ?</li>\n</ol>"
    },
    {
     "id": "r5-l2",
     "titre": "Tests de comparaison",
     "duree": "35 min",
     "objectifs": [
      "Vérifier la normalité (Shapiro-Wilk, diagramme quantile-quantile)",
      "Comparer deux moyennes : test de Student, apparié ou non, et Wilcoxon",
      "Comparer plusieurs groupes (ANOVA, Kruskal-Wallis) et tester une indépendance (khi-deux)"
     ],
     "contenu": "\n<p>Un test statistique répond à une question du type « la différence observée peut-elle être due au hasard ? ». On lit la <b>p-value</b> : si p &lt; 0,05, on rejette l'hypothèse nulle (pas de différence) au risque de 5 %.</p>\n<pre><code>shapiro.test(qualite$NITRATES_MGL)          # p &gt; 0,05 : normalité acceptable\nqqnorm(qualite$NITRATES_MGL); qqline(qualite$NITRATES_MGL)\n\n# Les mêmes forages mesurés deux fois : test APPARIÉ\nhautes &lt;- qualite |&gt; filter(CAMPAGNE == \"Hautes eaux\") |&gt; arrange(ID_FOR)\nbasses &lt;- qualite |&gt; filter(CAMPAGNE == \"Basses eaux\") |&gt; arrange(ID_FOR)\nt.test(basses$NITRATES_MGL, hautes$NITRATES_MGL, paired = TRUE)\nwilcox.test(basses$NITRATES_MGL, hautes$NITRATES_MGL, paired = TRUE)   # version non paramétrique</code></pre>\n<p>Plus de deux groupes : ANOVA (paramétrique) ou Kruskal-Wallis. Deux variables qualitatives : khi-deux.</p>\n<pre><code>forages &lt;- read.csv(\"donnees/tables/forages_attributs.csv\", encoding = \"UTF-8\")\nd &lt;- hautes |&gt; left_join(forages, by = \"ID_FOR\")\nsummary(aov(NITRATES_MGL ~ ETAT, data = d))\nkruskal.test(NITRATES_MGL ~ ETAT, data = d)\n\nfeux &lt;- read.csv(\"donnees/tables/feux_inventaire.csv\", encoding = \"UTF-8\")\ntab &lt;- table(feux$OCCUP, feux$CAUSE); tab\nchisq.test(tab, simulate.p.value = TRUE)   # petits effectifs : p-value simulée</code></pre>\n<table class=\"list\"><tr><th>Situation</th><th>Paramétrique</th><th>Non paramétrique</th></tr>\n<tr><td>2 groupes indépendants</td><td><code>t.test(x, y)</code></td><td><code>wilcox.test(x, y)</code></td></tr>\n<tr><td>2 mesures sur les mêmes individus</td><td><code>t.test(x, y, paired = TRUE)</code></td><td><code>wilcox.test(..., paired = TRUE)</code></td></tr>\n<tr><td>3 groupes ou plus</td><td><code>aov()</code></td><td><code>kruskal.test()</code></td></tr>\n<tr><td>2 variables qualitatives</td><td colspan=\"2\"><code>chisq.test(table(...))</code></td></tr></table>\n<div class=\"astuce\"><b>Significatif ne veut pas dire important :</b> donnez toujours la taille de l'effet (ici, de combien de mg/L les nitrates augmentent en basses eaux), pas seulement la p-value.</div>",
     "exercice": "<ol>\n  <li>Les nitrates augmentent-ils significativement en basses eaux ? De combien en moyenne (intervalle de confiance) ?</li>\n  <li>Même question pour la conductivité.</li>\n  <li>Les surfaces brûlées (SURF_HA) diffèrent-elles entre forêt et parcours ? Choisissez le test après avoir regardé la distribution.</li>\n</ol>"
    },
    {
     "id": "r5-l3",
     "titre": "Corrélation et régression linéaire",
     "duree": "35 min",
     "objectifs": [
      "Mesurer et tester une corrélation (Pearson, Spearman)",
      "Ajuster un modèle linéaire avec lm() et lire summary()",
      "Vérifier les résidus et faire une prédiction"
     ],
     "contenu": "\n<p>Les nitrates sont-ils plus faibles dans les forages profonds ? On mesure la liaison par le <b>coefficient de corrélation</b> r (de −1 à 1), puis on modélise par une <b>droite de régression</b>.</p>\n<pre><code>cor(d$PROF_M, d$NITRATES_MGL)                       # Pearson\ncor.test(d$PROF_M, d$NITRATES_MGL)                  # test de significativité\ncor.test(d$PROF_M, d$NITRATES_MGL, method = \"spearman\")\n\nmodele &lt;- lm(NITRATES_MGL ~ PROF_M, data = d)\nsummary(modele)        # pente, ordonnée à l'origine, R², p-value\ncoef(modele)\nplot(d$PROF_M, d$NITRATES_MGL, pch = 19, xlab = \"Profondeur (m)\", ylab = \"Nitrates (mg/L)\")\nabline(modele, col = \"red\", lwd = 2)</code></pre>\n<p>Lire <code>summary(modele)</code> :</p>\n<ul>\n  <li><b>Estimate</b> de PROF_M : variation des nitrates pour 1 m de profondeur en plus (négative ici) ;</li>\n  <li><b>Pr(&gt;|t|)</b> : p-value de la pente ;</li>\n  <li><b>R²</b> (<i>Multiple R-squared</i>) : part de la variabilité expliquée par la profondeur.</li>\n</ul>\n<pre><code>par(mfrow = c(2, 2)); plot(modele); par(mfrow = c(1, 1))   # résidus : pas de structure, à peu près normaux\npredict(modele, newdata = data.frame(PROF_M = c(50, 150, 250)), interval = \"prediction\")\nmodele2 &lt;- lm(NITRATES_MGL ~ PROF_M + COND_USCM, data = d)   # régression multiple\nsummary(modele2)</code></pre>\n<div class=\"astuce\"><b>Corrélation n'est pas causalité :</b> la profondeur n'« enlève » pas les nitrates ; les nappes profondes sont simplement mieux protégées des engrais épandus en surface.</div>",
     "exercice": "<ol>\n  <li>Calculez la corrélation entre conductivité et profondeur. Est-elle significative ?</li>\n  <li>Ajustez le modèle <code>NITRATES_MGL ~ PROF_M</code> pour les basses eaux et comparez la pente avec les hautes eaux.</li>\n  <li>Prévoyez la teneur en nitrates d'un nouveau forage de 120 m et donnez l'intervalle de prédiction.</li>\n</ol>"
    },
    {
     "id": "r5-l4",
     "titre": "Tendances des séries climatiques",
     "duree": "30 min",
     "objectifs": [
      "Construire une série annuelle à partir de données mensuelles",
      "Tester une tendance avec le test de Mann-Kendall",
      "Estimer la pente d'une tendance et la représenter"
     ],
     "contenu": "\n<p>La pluie diminue-t-elle sur le bassin ? On construit d'abord la série des cumuls annuels, puis on teste la tendance. Le <b>test de Mann-Kendall</b>, très utilisé en hydroclimatologie, est un test de corrélation de rang de Kendall entre la variable et le temps.</p>\n<pre><code>pluie  &lt;- read.csv(\"donnees/tables/pluie_mensuelle.csv\")\nannuel &lt;- pluie |&gt; group_by(ANNEE) |&gt;\n  summarise(P = sum(PLUIE_MM, na.rm = TRUE) / n_distinct(ID_ST))   # moyenne des stations\n\ncor.test(annuel$ANNEE, annuel$P, method = \"kendall\")   # Mann-Kendall\ntendance &lt;- lm(P ~ ANNEE, data = annuel)\ncoef(tendance)[\"ANNEE\"]          # mm de variation par an\ncoef(tendance)[\"ANNEE\"] * 10     # par décennie</code></pre>\n<pre><code>library(ggplot2)\nggplot(annuel, aes(ANNEE, P)) +\n  geom_col(fill = \"steelblue\") +\n  geom_smooth(method = \"lm\", se = TRUE, colour = \"red\") +\n  geom_hline(yintercept = mean(annuel$P), linetype = \"dashed\") +\n  labs(title = \"Pluie annuelle moyenne du bassin (données fictives)\", x = NULL, y = \"mm\")</code></pre>\n<p>Un indicateur utile pour les sécheresses : l'<b>indice de pluviosité</b> (écart à la moyenne divisé par l'écart-type).</p>\n<pre><code>annuel &lt;- annuel |&gt; mutate(INDICE = (P - mean(P)) / sd(P),\n                           TYPE = ifelse(INDICE &lt; 0, \"déficitaire\", \"excédentaire\"))</code></pre>\n<div class=\"astuce\">Quinze ans sont une série courte : un résultat non significatif ne prouve pas l'absence de tendance. Le package <code>trend</code> propose aussi <code>mk.test()</code> et la pente de Sen (<code>sens.slope()</code>). Script complet : <code>scripts/05_statistiques.R</code>.</div>",
     "exercice": "<ol>\n  <li>Testez la tendance de la température moyenne annuelle (TMOY_C). Combien de °C par décennie ?</li>\n  <li>Faites le test de Mann-Kendall station par station : les conclusions sont-elles les mêmes ?</li>\n  <li>Représentez l'indice de pluviosité en barres colorées (bleu excédentaire, orange déficitaire).</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Une p-value de 0,002 au seuil de 5 % signifie :",
     "choix": [
      "L'effet est forcément grand",
      "On rejette l'hypothèse nulle",
      "Le test est invalide",
      "On accepte l'hypothèse nulle"
     ],
     "bonne": 1,
     "explication": "p < 0,05 : la différence observée est peu compatible avec le hasard seul."
    },
    {
     "question": "Les mêmes 30 forages sont mesurés en hautes et basses eaux. Quel test ?",
     "choix": [
      "cor.test",
      "chisq.test",
      "t.test indépendant",
      "t.test(..., paired = TRUE)"
     ],
     "bonne": 3,
     "explication": "Mesures répétées sur les mêmes individus : test apparié."
    },
    {
     "question": "Que mesure le R² d'une régression ?",
     "choix": [
      "La pente de la droite",
      "La part de variabilité expliquée par le modèle",
      "La p-value",
      "Le nombre d'observations"
     ],
     "bonne": 1,
     "explication": "R² varie de 0 à 1."
    },
    {
     "question": "Quel test pour une tendance dans une série de pluie annuelle ?",
     "choix": [
      "Kruskal-Wallis",
      "Mann-Kendall (Kendall avec le temps)",
      "Shapiro-Wilk",
      "Khi-deux"
     ],
     "bonne": 1,
     "explication": "Mann-Kendall est un test non paramétrique de tendance monotone."
    },
    {
     "question": "Quel indicateur décrit le mieux la valeur typique d'une variable avec quelques valeurs extrêmes ?",
     "choix": [
      "La moyenne",
      "Le maximum",
      "La médiane",
      "La variance"
     ],
     "bonne": 2,
     "explication": "La médiane est robuste aux valeurs extrêmes."
    },
    {
     "question": "Pour tester le lien entre deux variables qualitatives (occupation du sol et cause du feu) :",
     "choix": [
      "chisq.test sur un tableau croisé",
      "t.test",
      "lm",
      "cor.test"
     ],
     "bonne": 0,
     "explication": "Le khi-deux teste l'indépendance de deux variables qualitatives."
    }
   ]
  },
  {
   "id": "r6",
   "numero": 6,
   "titre": "Programmer avec R",
   "echelle": "1:25 000",
   "resume": "Conditions, boucles, écriture de fonctions et automatisation : appliquer un traitement à toutes les stations et produire les graphiques en série.",
   "lecons": [
    {
     "id": "r6-l1",
     "titre": "Conditions et boucles",
     "duree": "30 min",
     "objectifs": [
      "Écrire une condition if / else",
      "Utiliser ifelse et case_when sur des vecteurs",
      "Répéter un traitement avec for et while"
     ],
     "contenu": "\n<p>On charge d'abord les packages et les tables utilisés dans tout le niveau :</p>\n<pre><code>library(dplyr)\nlibrary(ggplot2)\npluie    &lt;- read.csv(\"donnees/tables/pluie_mensuelle.csv\")\nstations &lt;- read.csv(\"donnees/tables/stations_meteo.csv\", encoding = \"UTF-8\")\nqualite  &lt;- read.csv2(\"donnees/tables/qualite_eau_forages.csv\", encoding = \"UTF-8\")</code></pre>\n<h4>La condition if / else</h4>\n<pre><code>p_an &lt;- 410\nif (p_an &lt; 300) {\n  climat &lt;- \"aride\"\n} else if (p_an &lt; 600) {\n  climat &lt;- \"semi-aride\"\n} else {\n  climat &lt;- \"subhumide\"\n}\nclimat</code></pre>\n<p><code>if</code> ne traite qu'<b>une</b> valeur. Pour un vecteur ou une colonne, on utilise <code>ifelse()</code> ou <code>case_when()</code> :</p>\n<pre><code>p &lt;- c(250, 410, 720)\nifelse(p &lt; 300, \"aride\", \"non aride\")\ndplyr::case_when(p &lt; 300 ~ \"aride\", p &lt; 600 ~ \"semi-aride\", TRUE ~ \"subhumide\")</code></pre>\n<h4>La boucle for</h4>\n<pre><code>for (s in stations$ID_ST) {\n  total &lt;- sum(pluie$PLUIE_MM[pluie$ID_ST == s], na.rm = TRUE) / 15\n  cat(s, \":\", round(total), \"mm/an en moyenne\\n\")\n}</code></pre>\n<h4>La boucle while</h4>\n<pre><code># Combien d'années pour qu'une commune de 10 000 hab. double à +2 % par an ?\npop &lt;- 10000; annees &lt;- 0\nwhile (pop &lt; 20000) {\n  pop &lt;- pop * 1.02\n  annees &lt;- annees + 1\n}\nannees</code></pre>\n<div class=\"astuce\"><b>Boucle ou calcul vectorisé ?</b> En R, préférez les fonctions vectorisées et dplyr quand c'est possible ; gardez les boucles pour répéter des tâches lourdes (lire des fichiers, produire des cartes).</div>",
     "exercice": "<ol>\n  <li>Écrivez une condition qui affiche « Potable » ou « Non potable » selon une teneur en nitrates.</li>\n  <li>Avec <code>case_when</code>, classez toutes les valeurs de <code>qualite$NITRATES_MGL</code> en trois classes.</li>\n  <li>Avec une boucle <code>for</code>, affichez pour chaque année 2010-2024 le cumul de pluie de la station S02.</li>\n</ol>"
    },
    {
     "id": "r6-l2",
     "titre": "Écrire ses propres fonctions",
     "duree": "30 min",
     "objectifs": [
      "Définir une fonction avec arguments et valeur de retour",
      "Contrôler les entrées avec stop()",
      "Documenter et réutiliser ses fonctions"
     ],
     "contenu": "\n<p>Dès qu'on copie-colle un calcul trois fois, on écrit une <b>fonction</b>. Exemple : l'indice d'aridité de De Martonne, I = P / (T + 10).</p>\n<pre><code>indice_martonne &lt;- function(P, T) {\n  # P : pluie annuelle (mm) ; T : température moyenne annuelle (°C)\n  if (any(T &lt;= -10)) stop(\"T doit être supérieure à -10 °C\")\n  P / (T + 10)\n}\nindice_martonne(410, 16.5)\nindice_martonne(c(465, 584, 626), c(17.5, 16.5, 14.3))   # vectorisée\n\nclasser_martonne &lt;- function(I) {\n  cut(I, breaks = c(-Inf, 5, 10, 20, 30, Inf),\n      labels = c(\"hyperaride\", \"aride\", \"semi-aride\", \"semi-humide\", \"humide\"))\n}\nclasser_martonne(indice_martonne(410, 16.5))</code></pre>\n<p>Une fonction peut avoir des <b>valeurs par défaut</b> et renvoyer une liste :</p>\n<pre><code>resume_serie &lt;- function(x, seuil = 50, arrondi = 1) {\n  list(moyenne = round(mean(x, na.rm = TRUE), arrondi),\n       cv = round(100 * sd(x, na.rm = TRUE) / mean(x, na.rm = TRUE), arrondi),\n       n_depasse = sum(x &gt; seuil, na.rm = TRUE))\n}\nresume_serie(qualite$NITRATES_MGL)\nresume_serie(qualite$NITRATES_MGL, seuil = 25)</code></pre>\n<div class=\"astuce\">Rangez vos fonctions dans un fichier <code>scripts/mes_fonctions.R</code> et chargez-les dans chaque script avec <code>source(\"scripts/mes_fonctions.R\")</code>.</div>",
     "exercice": "<ol>\n  <li>Écrivez <code>gravelius(perimetre_km, surface_km2)</code> qui renvoie l'indice de compacité Kc = 0,28 × P / √A.</li>\n  <li>Écrivez <code>densite(pop, surface)</code> qui refuse une surface nulle ou négative avec <code>stop()</code>.</li>\n  <li>Placez-les dans <code>mes_fonctions.R</code> et utilisez-les depuis un autre script avec <code>source()</code>.</li>\n</ol>"
    },
    {
     "id": "r6-l3",
     "titre": "Automatiser : appliquer et produire en série",
     "duree": "35 min",
     "objectifs": [
      "Appliquer une fonction à chaque élément avec sapply, lapply et vapply",
      "Produire et enregistrer un graphique par station",
      "Traiter tous les fichiers d'un dossier"
     ],
     "contenu": "\n<pre><code>cumuls &lt;- sapply(split(pluie$PLUIE_MM, pluie$ID_ST), sum, na.rm = TRUE)\ncumuls\nmoyennes &lt;- lapply(split(pluie, pluie$ID_ST), function(t) mean(t$TMOY_C))</code></pre>\n<h4>Un graphique par station, enregistré automatiquement</h4>\n<pre><code>library(ggplot2)\ndir.create(\"sorties/graphiques\", recursive = TRUE, showWarnings = FALSE)\n\ngraphique_station &lt;- function(id) {\n  d &lt;- pluie |&gt; filter(ID_ST == id) |&gt; group_by(MOIS) |&gt;\n    summarise(P = mean(PLUIE_MM, na.rm = TRUE), T = mean(TMOY_C))\n  nom &lt;- stations$NOM[stations$ID_ST == id]\n  g &lt;- ggplot(d, aes(MOIS)) +\n    geom_col(aes(y = P), fill = \"steelblue\") +\n    geom_line(aes(y = 2 * T), colour = \"firebrick\", linewidth = 1) +\n    scale_x_continuous(breaks = 1:12) +\n    labs(title = paste(\"Station\", id, \"-\", nom), y = \"P (mm) et 2T (°C)\", x = \"Mois\")\n  fichier &lt;- file.path(\"sorties/graphiques\", paste0(\"ombro_\", id, \".png\"))\n  ggsave(fichier, g, width = 16, height = 10, units = \"cm\", dpi = 200)\n  fichier\n}\nvapply(stations$ID_ST, graphique_station, character(1))</code></pre>\n<h4>Lire tous les CSV d'un dossier</h4>\n<pre><code>fichiers &lt;- list.files(\"donnees/tables\", pattern = \"\\\\.csv$\", full.names = TRUE)\ntailles  &lt;- sapply(fichiers, function(f) nrow(read.csv(f, sep = ifelse(grepl(\"qualite|population|releves\", f), \";\", \",\"))))\ntailles</code></pre>\n<div class=\"astuce\">C'est la même logique que les itérateurs de ModelBuilder ou les boucles ArcPy, mais en quelques lignes. Script complet : <code>scripts/06_fonctions_boucles.R</code>.</div>",
     "exercice": "<ol>\n  <li>Exécutez <code>scripts/06_fonctions_boucles.R</code> et ouvrez le dossier <code>sorties/graphiques</code>.</li>\n  <li>Modifiez la fonction pour ajouter le nombre de mois secs dans le titre.</li>\n  <li>Écrivez une boucle qui exporte un CSV de pluie par station (<code>pluie_S01.csv</code>, …).</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Quelle fonction convient pour classer TOUTES les valeurs d'une colonne ?",
     "choix": [
      "stop",
      "while",
      "if",
      "ifelse ou case_when"
     ],
     "bonne": 3,
     "explication": "if ne traite qu'une seule valeur logique."
    },
    {
     "question": "Que renvoie une fonction R ?",
     "choix": [
      "Toujours une liste",
      "Rien",
      "Un graphique",
      "La valeur de la dernière expression évaluée (ou return())"
     ],
     "bonne": 3,
     "explication": "La dernière expression évaluée est renvoyée."
    },
    {
     "question": "À quoi sert stop() dans une fonction ?",
     "choix": [
      "À sortir d'une boucle sans erreur",
      "À faire une pause",
      "À arrêter R",
      "À interrompre la fonction avec un message d'erreur clair"
     ],
     "bonne": 3,
     "explication": "stop() signale une entrée invalide."
    },
    {
     "question": "Que fait sapply(liste, f) ?",
     "choix": [
      "Applique f à chaque élément et simplifie le résultat en vecteur",
      "Supprime les NA",
      "Trie la liste",
      "Crée une boucle infinie"
     ],
     "bonne": 0,
     "explication": "sapply = lapply + simplification."
    },
    {
     "question": "Comment réutiliser des fonctions écrites dans un autre fichier ?",
     "choix": [
      "load()",
      "library(\"mes_fonctions.R\")",
      "source(\"scripts/mes_fonctions.R\")",
      "install.packages()"
     ],
     "bonne": 2,
     "explication": "source() exécute le fichier et crée les fonctions."
    }
   ]
  },
  {
   "id": "r7",
   "numero": 7,
   "titre": "Données vectorielles et cartographie avec sf",
   "echelle": "1:10 000",
   "resume": "Lire des shapefiles et des GeoPackages, systèmes de coordonnées et reprojection, points à partir de coordonnées XY, géotraitements (tampon, intersection, jointure spatiale, distances) et cartes thématiques avec ggplot2.",
   "lecons": [
    {
     "id": "r7-l1",
     "titre": "Lire et explorer des couches vecteur",
     "duree": "30 min",
     "objectifs": [
      "Lire un shapefile et une couche de GeoPackage avec st_read",
      "Comprendre l'objet sf : un data frame avec une colonne géométrie",
      "Afficher rapidement une couche"
     ],
     "contenu": "\n<p>Le package <code>sf</code> (<i>simple features</i>) lit les formats SIG courants (shapefile, GeoPackage, GeoJSON, KML…). Une couche devient un <b>data frame</b> ordinaire avec une colonne spéciale <code>geometry</code> : tout ce que vous avez appris sur dplyr s'applique.</p>\n<pre><code>library(sf)\ncommunes &lt;- st_read(\"donnees/shapefiles/Communes.shp\")\nst_layers(\"donnees/tamda.gpkg\")                        # couches du GeoPackage\noueds   &lt;- st_read(\"donnees/tamda.gpkg\", layer = \"oueds\")\nforages &lt;- st_read(\"donnees/tamda.gpkg\", layer = \"forages\")\n\ncommunes                       # en-tête : type de géométrie, emprise, SCR\nclass(communes)                # \"sf\" \"data.frame\"\nst_geometry_type(communes)[1]  # MULTIPOLYGON / POLYGON\nst_bbox(communes)              # emprise\nst_drop_geometry(communes)     # la table attributaire seule</code></pre>\n<pre><code>plot(communes[\"POP\"])                                  # carte rapide colorée par POP\nplot(st_geometry(communes), border = \"grey40\")\nplot(st_geometry(oueds), col = \"blue\", lwd = 2, add = TRUE)\nplot(st_geometry(forages), pch = 16, cex = 0.7, add = TRUE)</code></pre>\n<div class=\"astuce\"><b>GeoPackage ou shapefile ?</b> Un GeoPackage (<code>.gpkg</code>) est un seul fichier qui contient plusieurs couches, sans la limite de 10 caractères des noms de champs ni les fichiers .shx/.dbf/.prj séparés. C'est le format conseillé pour échanger avec QGIS et ArcGIS Pro.</div>",
     "exercice": "<ol>\n  <li>Lisez toutes les couches de <code>tamda.gpkg</code> et notez pour chacune le type de géométrie et le nombre d'entités.</li>\n  <li>Affichez les communes, les routes et les écoles sur une même carte rapide.</li>\n  <li>Avec dplyr, gardez les communes urbaines (<code>TYPE == \"Urbain\"</code>) et affichez-les en rouge.</li>\n</ol>"
    },
    {
     "id": "r7-l2",
     "titre": "Systèmes de coordonnées et points XY",
     "duree": "30 min",
     "objectifs": [
      "Lire et définir le système de coordonnées (st_crs, st_set_crs)",
      "Reprojeter une couche avec st_transform",
      "Créer une couche de points à partir d'une table XY avec st_as_sf"
     ],
     "contenu": "\n<p>Les données du bassin sont en <b>WGS 84 / UTM zone 30N</b> (code EPSG <b>32630</b>), le système métrique adapté à l'ouest algérien. Les GPS donnent des longitudes/latitudes en <b>WGS 84</b> (EPSG <b>4326</b>). Les anciennes cartes INCT utilisent <b>Nord Sahara 1959</b>.</p>\n<pre><code>st_crs(communes)              # description complète\nst_crs(communes)$epsg         # 32630\ncommunes_wgs &lt;- st_transform(communes, 4326)      # reprojection en degrés\nst_bbox(communes_wgs)\n\n# Définir le SCR d'une couche qui n'en a pas (sans déplacer les coordonnées)\n# couche &lt;- st_set_crs(couche, 32630)</code></pre>\n<h4>Des points à partir d'un tableau de coordonnées</h4>\n<pre><code>gps &lt;- read.csv(\"donnees/tables/releves_gps.csv\", sep = \";\")\ngps_utm &lt;- st_as_sf(gps, coords = c(\"X\", \"Y\"), crs = 32630)       # coordonnées UTM\ngps_wgs &lt;- st_as_sf(gps, coords = c(\"LON\", \"LAT\"), crs = 4326)    # coordonnées GPS\ngps_wgs_utm &lt;- st_transform(gps_wgs, 32630)\nmax(st_distance(gps_utm, gps_wgs_utm, by_element = TRUE))         # écart : quelques cm\n\nfeux &lt;- read.csv(\"donnees/tables/feux_inventaire.csv\", encoding = \"UTF-8\")\nfeux_sf &lt;- st_as_sf(feux, coords = c(\"X\", \"Y\"), crs = 32630)\nst_write(feux_sf, \"sorties/feux.gpkg\", delete_dsn = TRUE)</code></pre>\n<div class=\"astuce\"><b>Ne confondez pas</b> <code>st_set_crs()</code> (on <i>déclare</i> le système d'une couche qui n'en a pas, comme « Définir une projection ») et <code>st_transform()</code> (on <i>convertit</i> les coordonnées, comme « Projeter »). Attention aussi à l'ordre : <code>coords = c(\"LON\", \"LAT\")</code>, la longitude d'abord.</div>",
     "exercice": "<ol>\n  <li>Reprojetez les communes en WGS 84 et vérifiez que les longitudes sont proches de −1,4°.</li>\n  <li>Créez la couche des stations météo à partir de <code>stations_meteo.csv</code> et superposez-la aux communes.</li>\n  <li>Calculez la distance (en km) entre chaque station et la station S01 avec <code>st_distance</code>.</li>\n</ol>"
    },
    {
     "id": "r7-l3",
     "titre": "Géotraitements vecteur",
     "duree": "40 min",
     "objectifs": [
      "Calculer surfaces, longueurs et distances",
      "Créer des zones tampons et des intersections",
      "Faire une jointure spatiale et compter des points par polygone"
     ],
     "contenu": "\n<p>Les outils de la boîte à outils « Analyse » d'un SIG existent dans sf sous forme de fonctions <code>st_...</code>.</p>\n<pre><code>library(dplyr)\nroutes &lt;- st_read(\"donnees/tamda.gpkg\", layer = \"routes\")\noccup  &lt;- st_read(\"donnees/tamda.gpkg\", layer = \"occupation_sol\")\n\n# Mesures (les unités viennent du SCR : mètres)\ncommunes &lt;- communes |&gt; mutate(SURF_KM2 = as.numeric(st_area(geometry)) / 1e6,\n                               DENSITE  = POP / SURF_KM2)\nsum(st_length(oueds))                          # longueur du réseau\n\n# Zone tampon de 250 m autour des oueds, fusionnée\ntampon &lt;- st_buffer(oueds, 250) |&gt; st_union()\nforages_proches &lt;- forages[st_intersects(forages, tampon, sparse = FALSE)[, 1], ]\nnrow(forages_proches)\n\n# Jointure spatiale : la commune de chaque forage\nforages_com &lt;- st_join(forages, select(communes, COMMUNE = NOM))\nnb &lt;- forages_com |&gt; st_drop_geometry() |&gt; count(COMMUNE, name = \"NB_FORAGES\")\n\n# Intersection : surface agricole de chaque commune\nagri &lt;- occup |&gt; filter(TYPE == \"Agriculture\") |&gt; st_union()\nagri_com &lt;- st_intersection(select(communes, NOM), agri) |&gt;\n  mutate(AGRI_KM2 = as.numeric(st_area(geometry)) / 1e6)\n\n# Distance de chaque forage à la route la plus proche\nforages$DIST_ROUTE_M &lt;- round(as.numeric(st_distance(forages, st_union(routes))))</code></pre>\n<table class=\"list\"><tr><th>Outil SIG</th><th>Fonction sf</th></tr>\n<tr><td>Zone tampon (Buffer)</td><td><code>st_buffer()</code></td></tr>\n<tr><td>Intersecter</td><td><code>st_intersection()</code></td></tr>\n<tr><td>Fusionner (Dissolve)</td><td><code>st_union()</code> ou <code>group_by() |&gt; summarise()</code></td></tr>\n<tr><td>Découper (Clip)</td><td><code>st_intersection()</code> ou <code>st_crop()</code></td></tr>\n<tr><td>Jointure spatiale</td><td><code>st_join()</code></td></tr>\n<tr><td>Sélection par emplacement</td><td><code>st_filter()</code>, <code>st_intersects()</code></td></tr>\n<tr><td>Centroïdes</td><td><code>st_centroid()</code></td></tr></table>",
     "exercice": "<ol>\n  <li>Combien d'écoles se trouvent à moins de 500 m d'un oued ? Lesquelles ?</li>\n  <li>Calculez pour chaque commune le nombre d'écoles et l'effectif total d'élèves (jointure spatiale + summarise).</li>\n  <li>Quelle part (%) de chaque commune est couverte par la forêt ?</li>\n</ol>"
    },
    {
     "id": "r7-l4",
     "titre": "Cartes thématiques avec ggplot2",
     "duree": "40 min",
     "objectifs": [
      "Représenter des couches sf avec geom_sf",
      "Réaliser une carte choroplèthe avec étiquettes et légende",
      "Exporter la carte et la couche résultat"
     ],
     "contenu": "\n<p><code>geom_sf()</code> dessine une couche sf dans un ggplot : on superpose les couches comme dans la table des matières d'un SIG, de la plus « basse » à la plus « haute ».</p>\n<pre><code>library(ggplot2)\npop &lt;- read.csv(\"donnees/tables/population_communes.csv\", sep = \";\")\ncommunes &lt;- communes |&gt; left_join(pop, by = \"CODE\") |&gt;\n  mutate(CROISS = round(100 * (POP_2020 - POP_2008) / POP_2008, 1))\n\ncarte &lt;- ggplot() +\n  geom_sf(data = communes, aes(fill = DENSITE), colour = \"white\") +\n  geom_sf(data = oueds, colour = \"#1f78b4\", linewidth = 0.8) +\n  geom_sf(data = forages, aes(shape = ETAT), size = 1.8) +\n  geom_sf_text(data = communes, aes(label = NOM), size = 2.6) +\n  scale_fill_distiller(palette = \"YlOrRd\", direction = 1, name = \"hab./km²\") +\n  labs(title = \"Bassin de l'oued Tamda (données fictives)\",\n       subtitle = \"Densité de population et forages\",\n       caption = \"Source : TP R ENIV · WGS 84 / UTM 30N\", shape = \"État du forage\") +\n  theme_minimal()\ncarte\nggsave(\"sorties/carte_densite.png\", carte, width = 20, height = 16, units = \"cm\", dpi = 300)\nst_write(communes, \"sorties/communes_stats.gpkg\", delete_dsn = TRUE)   # à ouvrir dans QGIS / ArcGIS</code></pre>\n<p>Pour des classes plutôt qu'un dégradé continu, découpez la variable avec <code>cut()</code> et utilisez <code>scale_fill_brewer()</code> :</p>\n<pre><code>communes$CLASSE &lt;- cut(communes$CROISS, breaks = c(0, 15, 25, 35, 50),\n                       labels = c(\"&lt; 15 %\", \"15-25 %\", \"25-35 %\", \"&gt; 35 %\"))\nggplot(communes) + geom_sf(aes(fill = CLASSE)) +\n  scale_fill_brewer(palette = \"Greens\", name = \"Croissance 2008-2020\") + theme_void()</code></pre>\n<div class=\"astuce\">Pour une échelle graphique et une flèche du nord, installez le package <code>ggspatial</code> : <code>annotation_scale()</code> et <code>annotation_north_arrow()</code>. Pour des cartes interactives, essayez <code>mapview</code> ou <code>leaflet</code>. Script complet : <code>scripts/07_vecteur_sf.R</code>.</div>",
     "exercice": "<ol>\n  <li>Réalisez la carte du taux de croissance 2008-2020 par commune en 4 classes.</li>\n  <li>Ajoutez les écoles avec une taille proportionnelle à l'effectif.</li>\n  <li>Exportez la carte en PNG 300 dpi et la couche <code>communes_stats.gpkg</code> ; ouvrez cette dernière dans QGIS ou ArcGIS.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Qu'est-ce qu'un objet sf ?",
     "choix": [
      "Un data frame avec une colonne de géométrie",
      "Un raster",
      "Un fichier Excel",
      "Une image"
     ],
     "bonne": 0,
     "explication": "Les attributs sont des colonnes ordinaires, la géométrie est dans la colonne geometry."
    },
    {
     "question": "Quel est le code EPSG de WGS 84 / UTM zone 30N ?",
     "choix": [
      "32631",
      "4326",
      "3857",
      "32630"
     ],
     "bonne": 3,
     "explication": "4326 = WGS 84 géographique ; 32630 = UTM 30N."
    },
    {
     "question": "Quelle fonction CONVERTIT les coordonnées dans un autre système ?",
     "choix": [
      "st_as_sf()",
      "st_crs()",
      "st_set_crs()",
      "st_transform()"
     ],
     "bonne": 3,
     "explication": "st_set_crs déclare seulement le système, sans changer les coordonnées."
    },
    {
     "question": "Comment créer des points à partir d'un tableau avec colonnes X et Y ?",
     "choix": [
      "st_as_sf(tableau, coords = c(\"X\", \"Y\"), crs = 32630)",
      "st_read()",
      "st_buffer()",
      "plot(X, Y)"
     ],
     "bonne": 0,
     "explication": "st_as_sf convertit un data frame en couche de points."
    },
    {
     "question": "Quelle fonction réalise une jointure spatiale ?",
     "choix": [
      "st_union()",
      "merge()",
      "left_join()",
      "st_join()"
     ],
     "bonne": 3,
     "explication": "left_join joint par une clé attributaire, st_join par la position."
    },
    {
     "question": "Dans un ggplot de carte, quelle couche faut-il ajouter en premier ?",
     "choix": [
      "La légende",
      "Les étiquettes",
      "Les polygones de fond",
      "Les points"
     ],
     "bonne": 2,
     "explication": "Les couches s'empilent : la première est dessinée en dessous."
    }
   ]
  },
  {
   "id": "r8",
   "numero": 8,
   "titre": "Raster, MNT et risques naturels avec terra",
   "echelle": "1:5 000",
   "resume": "Lire et analyser un MNT avec terra : pente, exposition, ombrage, reclassification, statistiques zonales, puis cartes de susceptibilité aux inondations, feux de forêt et glissements de terrain par analyse multicritère.",
   "lecons": [
    {
     "id": "r8-l1",
     "titre": "Lire et décrire un raster",
     "duree": "30 min",
     "objectifs": [
      "Lire un MNT avec rast() et décrire sa résolution, son emprise et son SCR",
      "Calculer des statistiques globales et un histogramme",
      "Utiliser la calculatrice raster"
     ],
     "contenu": "\n<p>Le package <code>terra</code> manipule les rasters (MNT, images satellites, cartes de risque). Un raster est une grille de cellules ; chaque cellule porte une valeur (ici une altitude en mètres).</p>\n<pre><code>library(terra)\nmnt &lt;- rast(\"donnees/raster/MNT_50m.tif\")\nmnt                       # dimensions, résolution, emprise, SCR\nres(mnt)                  # 50 x 50 m\next(mnt)\ncrs(mnt, describe = TRUE)$code      # \"32630\"\nncell(mnt)\nglobal(mnt, c(\"min\", \"max\", \"mean\"), na.rm = TRUE)\nhist(mnt, main = \"Altitudes\", xlab = \"m\")\nplot(mnt, col = terrain.colors(50), main = \"MNT 50 m\")</code></pre>\n<h4>Calculatrice raster</h4>\n<p>Les opérations s'appliquent à toutes les cellules, comme la « Calculatrice raster » d'un SIG :</p>\n<pre><code>mnt_km &lt;- mnt / 1000\nhaut   &lt;- mnt &gt; 800                                   # raster logique\netage  &lt;- ifel(mnt &lt; 600, 1, ifel(mnt &lt; 900, 2, 3))   # trois étages altitudinaux\nfreq(etage)\ncommunes &lt;- vect(\"donnees/shapefiles/Communes.shp\")   # vect() : couche vecteur pour terra\ntamda &lt;- communes[communes$NOM == \"Tamda\", ]\nmnt_tamda &lt;- mask(crop(mnt, tamda), tamda)            # découper puis masquer\nplot(mnt_tamda)</code></pre>\n<div class=\"astuce\"><b>sf ou terra pour les vecteurs ?</b> terra a son propre format vecteur (<code>vect()</code>), plus rapide pour les échanges avec les rasters. On passe de l'un à l'autre avec <code>vect(objet_sf)</code> et <code>sf::st_as_sf(objet_terra)</code>.</div>",
     "exercice": "<ol>\n  <li>Quelle est l'altitude minimale, maximale et moyenne du bassin ? Quelle surface (km²) se trouve au-dessus de 800 m ? (indice : <code>global(haut, \"sum\") * 50 * 50 / 1e6</code>)</li>\n  <li>Découpez le MNT sur la commune de Taourirt Nath et donnez son altitude moyenne.</li>\n  <li>Enregistrez le raster des étages avec <code>writeRaster()</code> dans <code>sorties/</code>.</li>\n</ol>"
    },
    {
     "id": "r8-l2",
     "titre": "Analyse de terrain : pente, exposition, ombrage",
     "duree": "35 min",
     "objectifs": [
      "Calculer pente, exposition et ombrage avec terrain() et shade()",
      "Reclasser une pente en classes avec classify()",
      "Extraire des valeurs raster aux points et par commune"
     ],
     "contenu": "\n<pre><code>pente &lt;- terrain(mnt, v = \"slope\", unit = \"degrees\")\nexpo  &lt;- terrain(mnt, v = \"aspect\", unit = \"degrees\")     # 0 = nord, 90 = est...\nombre &lt;- shade(terrain(mnt, \"slope\", unit = \"radians\"),\n               terrain(mnt, \"aspect\", unit = \"radians\"), angle = 45, direction = 315)\nplot(ombre, col = grey(0:100 / 100), legend = FALSE)\nplot(mnt, col = terrain.colors(50, alpha = 0.5), add = TRUE)   # MNT sur l'ombrage</code></pre>\n<h4>Reclassification</h4>\n<p><code>classify()</code> prend une matrice « de, à, nouvelle valeur » :</p>\n<pre><code>m &lt;- matrix(c( 0,  5, 1,\n               5, 15, 2,\n              15, 25, 3,\n              25, 90, 4), ncol = 3, byrow = TRUE)\nclasses_pente &lt;- classify(pente, m, include.lowest = TRUE)\nlevels(classes_pente) &lt;- data.frame(id = 1:4, classe = c(\"0-5°\", \"5-15°\", \"15-25°\", \"&gt; 25°\"))\nplot(classes_pente, col = c(\"#ffffcc\", \"#a1dab4\", \"#41b6c4\", \"#225ea8\"))\nfreq(classes_pente)</code></pre>\n<h4>Extraire et résumer</h4>\n<pre><code>forages &lt;- vect(\"donnees/shapefiles/Forages.shp\")\nv &lt;- extract(c(mnt, pente), forages)                       # altitude et pente de chaque forage\nhead(cbind(forages$ID_FOR, v))\nzonal(mnt, rasterize(communes, mnt, field = \"NOM\"), fun = \"mean\", na.rm = TRUE)  # statistiques zonales\ncommunes$PENTE_MOY &lt;- extract(pente, communes, fun = mean, na.rm = TRUE)[, 2]\nwriteRaster(pente, \"sorties/pente_deg.tif\", overwrite = TRUE)</code></pre>\n<div class=\"astuce\">Script complet : <code>scripts/08_raster_terra.R</code>. Les rasters écrits en GeoTIFF s'ouvrent directement dans ArcGIS et QGIS.</div>",
     "exercice": "<ol>\n  <li>Calculez la part (%) du bassin dans chaque classe de pente.</li>\n  <li>Reclassez l'exposition en 4 classes (Nord, Est, Sud, Ouest) et cartographiez-la.</li>\n  <li>Quelle commune a la pente moyenne la plus forte ? Les forages en service sont-ils sur des pentes plus faibles ?</li>\n</ol>"
    },
    {
     "id": "r8-l3",
     "titre": "Inondation : distance, hauteur au-dessus de l'oued",
     "duree": "40 min",
     "objectifs": [
      "Calculer une distance aux oueds en raster",
      "Approcher la hauteur au-dessus du cours d'eau le plus proche (HAND simplifié)",
      "Combiner des critères notés de 1 à 5 avec des poids"
     ],
     "contenu": "\n<p>Une méthode simple de susceptibilité aux inondations combine des critères notés de 1 (faible) à 5 (fort) et pondérés : <b>distance à l'oued</b> (35 %), <b>hauteur au-dessus de l'oued le plus proche</b> (25 %), <b>pente</b> (20 %) et <b>occupation du sol</b> (20 %). Les poids sont donnés dans <code>tables/poids_multicritere.csv</code>.</p>\n<pre><code>oueds &lt;- vect(\"donnees/tamda.gpkg\", layer = \"oueds\")\noccup &lt;- vect(\"donnees/tamda.gpkg\", layer = \"occupation_sol\")\ndist_oued &lt;- distance(mnt, oueds)                       # mètres\n\n# Hauteur au-dessus de l'oued le plus proche (approche HAND simplifiée)\nz_oued   &lt;- mask(mnt, rasterize(oueds, mnt, touches = TRUE))   # altitude des cellules d'oued\npts_oued &lt;- as.points(z_oued)\nproche   &lt;- nearest(as.points(mnt), pts_oued)$to_id             # cellule d'oued la plus proche\nhand &lt;- mnt\nvalues(hand) &lt;- values(mnt)[, 1] - values(z_oued)[cells(z_oued)][proche]\nhand &lt;- ifel(hand &lt; 0, 0, hand)</code></pre>\n<h4>Noter chaque critère de 1 à 5</h4>\n<pre><code>noter &lt;- function(r, bornes, notes) {\n  classify(r, cbind(head(bornes, -1), bornes[-1], notes), include.lowest = TRUE)\n}\nn_dist  &lt;- noter(dist_oued, c(0, 100, 250, 500, 1000, Inf), c(5, 4, 3, 2, 1))\nn_hand  &lt;- noter(hand,      c(0, 2, 5, 10, 20, Inf),        c(5, 4, 3, 2, 1))\nn_pente &lt;- noter(pente,     c(0, 2, 5, 10, 20, 90),         c(5, 4, 3, 2, 1))\noccup$N_INOND &lt;- c(Urbain = 5, \"Sol nu\" = 4, Agriculture = 3, Parcours = 2, \"Forêt\" = 1)[occup$TYPE]\nn_occ &lt;- rasterize(occup, mnt, field = \"N_INOND\")\n\ninond &lt;- 0.35 * n_dist + 0.25 * n_hand + 0.20 * n_pente + 0.20 * n_occ\nplot(inond, col = hcl.colors(20, \"YlGnBu\", rev = TRUE), main = \"Susceptibilité aux inondations\")</code></pre>\n<div class=\"astuce\"><b>Valider :</b> les repères de crue observés (<code>laisses_crues</code>) doivent tomber dans les classes fortes : <code>extract(inond, vect(\"donnees/tamda.gpkg\", layer = \"laisses_crues\"))</code>. Pour une vraie hydrologie (remplissage, directions et accumulation de flux), utilisez le package <code>whitebox</code> ou les outils hydrologie d'ArcGIS / GRASS.</div>",
     "exercice": "<ol>\n  <li>Reproduisez la carte de susceptibilité aux inondations.</li>\n  <li>Changez les poids (par exemple 50 % pour la distance) : les zones fortes changent-elles beaucoup ?</li>\n  <li>Combien de repères de crue tombent dans les 20 % de cellules les plus susceptibles ?</li>\n</ol>"
    },
    {
     "id": "r8-l4",
     "titre": "Feux, glissements et synthèse multirisque",
     "duree": "45 min",
     "objectifs": [
      "Construire les cartes de susceptibilité aux feux de forêt et aux glissements",
      "Classer en 5 niveaux et valider avec les événements observés",
      "Produire une synthèse multirisque et un bilan par commune"
     ],
     "contenu": "\n<p>On applique la même méthode avec d'autres critères (données <b>fictives</b> : c'est un exercice de méthode, pas une évaluation réelle du risque).</p>\n<pre><code>routes &lt;- vect(\"donnees/tamda.gpkg\", layer = \"routes\")\nlitho  &lt;- vect(\"donnees/tamda.gpkg\", layer = \"lithologie\")\n\n# Feux : occupation 35 %, pente 20 %, exposition 15 %, routes 15 %, habitations 15 %\noccup$N_FEUX &lt;- c(\"Forêt\" = 5, Parcours = 4, Agriculture = 2, \"Sol nu\" = 1, Urbain = 1)[occup$TYPE]\nn_occ_f &lt;- rasterize(occup, mnt, field = \"N_FEUX\")\nn_pf    &lt;- noter(pente, c(0, 5, 10, 20, 30, 90), c(1, 2, 3, 4, 5))\nn_expo  &lt;- classify(expo, rbind(c(0, 45, 1), c(45, 112.5, 2), c(112.5, 157.5, 4), c(157.5, 202.5, 5),\n                                c(202.5, 247.5, 4), c(247.5, 315, 2), c(315, 360, 1)), include.lowest = TRUE)\nn_route &lt;- noter(distance(mnt, routes), c(0, 100, 300, 600, 1000, Inf), c(5, 4, 3, 2, 1))\nn_hab   &lt;- noter(distance(mnt, occup[occup$TYPE == \"Urbain\", ]), c(0, 200, 500, 1000, 2000, Inf), c(5, 4, 3, 2, 1))\nfeux &lt;- 0.35 * n_occ_f + 0.20 * n_pf + 0.15 * n_expo + 0.15 * n_route + 0.15 * n_hab\n\n# Glissements : pente 40 %, lithologie 30 %, distance aux oueds 15 %, occupation 15 %\noccup$N_GLIS &lt;- c(\"Sol nu\" = 5, Parcours = 4, Agriculture = 3, Urbain = 2, \"Forêt\" = 1)[occup$TYPE]\ngliss &lt;- 0.40 * noter(pente, c(0, 5, 10, 15, 25, 90), c(1, 2, 3, 4, 5)) +\n         0.30 * rasterize(litho, mnt, field = \"SUSC_GLIS\") +\n         0.15 * n_dist + 0.15 * rasterize(occup, mnt, field = \"N_GLIS\")</code></pre>\n<h4>Classer, valider, synthétiser</h4>\n<pre><code>cinq &lt;- function(r) {          # 5 classes d'effectifs égaux (quantiles)\n  q &lt;- global(r, fun = quantile, probs = c(0.2, 0.4, 0.6, 0.8), na.rm = TRUE)\n  classify(r, c(-Inf, unlist(q), Inf), include.lowest = TRUE) + 1\n}\ncartes &lt;- c(cinq(inond), cinq(feux), cinq(gliss))\nnames(cartes) &lt;- c(\"inondation\", \"feux\", \"glissements\")\nplot(cartes, col = c(\"#1a9641\", \"#a6d96a\", \"#ffffbf\", \"#fdae61\", \"#d7191c\"))\n\ntable(extract(cartes$feux, vect(\"donnees/tamda.gpkg\", layer = \"foyers_incendies\"))[, 2])\ntable(extract(cartes$glissements, vect(\"donnees/tamda.gpkg\", layer = \"glissements\"))[, 2])\n\nsynthese  &lt;- max(cartes)                         # classe la plus forte des trois\ntres_fort &lt;- synthese &gt;= 5\npart &lt;- zonal(tres_fort, rasterize(communes, mnt, field = \"NOM\"), fun = \"mean\", na.rm = TRUE)\npart$PART_PCT &lt;- round(100 * part[, 2], 1)\npart[order(-part$PART_PCT), c(\"NOM\", \"PART_PCT\")]\nwriteRaster(cartes, \"sorties/susceptibilite_risques.tif\", overwrite = TRUE)</code></pre>\n<div class=\"astuce\">Si la méthode est bonne, la majorité des feux et des glissements observés tombent dans les classes 4 et 5. Script complet, testé sur les données du TP : <code>scripts/09_risques_multicritere.R</code>.</div>",
     "exercice": "<ol>\n  <li>Exécutez <code>scripts/09_risques_multicritere.R</code> et commentez la validation : quelle part des feux tombe en classes 4-5 ?</li>\n  <li>Quelle commune a la plus grande part de territoire en classe 5 (synthèse) ? Proposez deux mesures de prévention.</li>\n  <li>Réalisez une planche de trois cartes (inondation, feux, glissements) avec ggplot2 (indice : <code>as.data.frame(cartes, xy = TRUE)</code> et <code>geom_raster()</code>), exportée en PNG.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Quelle fonction lit un raster avec terra ?",
     "choix": [
      "rast()",
      "read.csv()",
      "raster.read()",
      "st_read()"
     ],
     "bonne": 0,
     "explication": "rast() lit GeoTIFF, ASCII et la plupart des formats raster."
    },
    {
     "question": "Quelle fonction calcule la pente d'un MNT ?",
     "choix": [
      "slope(mnt)",
      "global(mnt)",
      "terrain(mnt, v = \"slope\")",
      "classify(mnt)"
     ],
     "bonne": 2,
     "explication": "terrain() calcule pente, exposition, rugosité…"
    },
    {
     "question": "À quoi sert classify() ?",
     "choix": [
      "À reclasser les valeurs d'un raster selon des intervalles",
      "À découper",
      "À reprojeter",
      "À lire un fichier"
     ],
     "bonne": 0,
     "explication": "C'est l'équivalent de l'outil Reclassification."
    },
    {
     "question": "Que fait zonal(mnt, zones, fun = \"mean\") ?",
     "choix": [
      "Crée des zones tampons",
      "Découpe le MNT",
      "Lisse le MNT",
      "Calcule l'altitude moyenne de chaque zone"
     ],
     "bonne": 3,
     "explication": "Statistiques zonales : une valeur par zone."
    },
    {
     "question": "Dans une analyse multicritère, que vaut la somme des poids ?",
     "choix": [
      "100 % (ou 1)",
      "Le nombre de critères",
      "5",
      "Elle n'a pas d'importance"
     ],
     "bonne": 0,
     "explication": "Les poids se partagent 100 % de l'importance."
    },
    {
     "question": "Comment vérifier qu'une carte de susceptibilité aux feux est cohérente ?",
     "choix": [
      "Ce n'est pas possible",
      "En vérifiant que les feux observés tombent surtout dans les classes fortes",
      "En augmentant la résolution",
      "En changeant les couleurs"
     ],
     "bonne": 1,
     "explication": "On confronte la carte aux événements observés (validation)."
    }
   ]
  }
 ]
};
