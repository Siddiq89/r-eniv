from outils import C, lecon, q

N1 = dict(id="r1", numero=1, titre="Découvrir R et RStudio", echelle="1:1 000 000",
  resume="Installer R et RStudio, comprendre l'interface, travailler avec des scripts et des projets, installer des packages et trouver de l'aide.",
  lecons=[
  lecon("r1-l1", "R et RStudio : installer et découvrir", "20 min",
    ["Savoir ce que sont R et RStudio et pourquoi les utiliser en géomatique",
     "Installer R puis RStudio sur Windows",
     "Repérer les quatre panneaux de RStudio"],
    """
<p><b>R</b> est un langage et un logiciel libre et gratuit pour l'analyse de données, les statistiques, les graphiques et la cartographie. <b>RStudio</b> est l'environnement de travail (l'« atelier ») qui rend R confortable : éditeur de scripts, console, explorateur de fichiers, aide et graphiques.</p>
<p>Pourquoi R dans une école de géomatique et d'environnement ?</p>
<ul>
  <li>Tout est <b>écrit dans un script</b> : l'analyse peut être relue, corrigée et relancée sur de nouvelles données (reproductibilité).</li>
  <li>Des milliers de <b>packages</b> gratuits : statistiques, <code>ggplot2</code> pour les graphiques, <code>sf</code> pour les couches vecteur, <code>terra</code> pour les rasters et les MNT.</li>
  <li>R complète ArcGIS et QGIS : on prépare les données et on fait les statistiques dans R, on finalise une mise en page dans un SIG si besoin.</li>
</ul>
<h4>Installation (dans cet ordre)</h4>
<ol>
  <li>Installez <b>R</b> depuis le site du CRAN : <code>cran.r-project.org</code> &gt; <i>Download R for Windows</i> &gt; <i>base</i>.</li>
  <li>Installez <b>RStudio Desktop</b> (gratuit) depuis le site de Posit : <code>posit.co</code> &gt; <i>RStudio Desktop</i>.</li>
  <li>Lancez <b>RStudio</b> (pas R) : il trouve R automatiquement.</li>
</ol>
<h4>Les quatre panneaux de RStudio</h4>
<ul>
  <li><b>Source</b> (en haut à gauche) : vos scripts <code>.R</code>.</li>
  <li><b>Console</b> (en bas à gauche) : là où R exécute les commandes et affiche les résultats.</li>
  <li><b>Environment / History</b> (en haut à droite) : les objets créés pendant la session.</li>
  <li><b>Files / Plots / Packages / Help</b> (en bas à droite) : fichiers, graphiques, packages et aide.</li>
</ul>
<div class="astuce"><b>À retenir :</b> réglez une fois pour toutes <i>Tools &gt; Global Options &gt; General</i> : décochez <i>Restore .RData into workspace at startup</i> et choisissez <i>Never</i> pour <i>Save workspace to .RData on exit</i>. Vos résultats doivent venir du script, pas d'une mémoire cachée.</div>""",
    """<ol>
  <li>Installez R puis RStudio sur votre poste (ou vérifiez qu'ils le sont en salle informatique).</li>
  <li>Ouvrez RStudio et repérez les quatre panneaux.</li>
  <li>Dans la console, tapez <code>R.version.string</code> puis Entrée : notez la version de R.</li>
  <li>Appliquez les réglages de l'encadré « À retenir ».</li>
</ol>"""),
  lecon("r1-l2", "La console, les scripts et les commentaires", "25 min",
    ["Utiliser R comme une calculatrice dans la console",
     "Écrire, commenter et enregistrer un script .R",
     "Exécuter une ligne ou une sélection avec Ctrl + Entrée"],
    """
<p>La <b>console</b> exécute immédiatement ce que vous tapez. Essayez :</p>
""" + C("""
2 + 3
(1250 - 830) / 20     # dénivelé moyen en m par km
sqrt(144)
round(pi, 2)
10 %% 3               # reste de la division entière
""") + """
<p>Mais ce qui est tapé dans la console est vite perdu. On travaille donc dans un <b>script</b> : <i>File &gt; New File &gt; R Script</i> (ou <kbd>Ctrl + Maj + N</kbd>). Le script est un simple fichier texte d'extension <code>.R</code>.</p>
<ul>
  <li><kbd>Ctrl + Entrée</kbd> exécute la ligne où se trouve le curseur (ou la sélection) ;</li>
  <li><kbd>Ctrl + Maj + S</kbd> exécute tout le script (<i>Source</i>) ;</li>
  <li><kbd>Ctrl + S</kbd> enregistre le script.</li>
</ul>
<p>Tout ce qui suit un <code>#</code> est un <b>commentaire</b> : R l'ignore, mais il explique votre démarche au lecteur (et à vous dans trois mois).</p>
""" + C("""
# =========================================
# TP1 : premiers calculs
# Auteur : votre nom   Date : 2026-11-22
# =========================================
surface_km2 <- 400          # surface de la zone d'étude
population  <- 104120
population / surface_km2    # densité en hab./km²
""") + """
<div class="astuce"><b>Le signe <code>&gt;</code> et le signe <code>+</code></b> dans la console : <code>&gt;</code> signifie que R attend une commande ; <code>+</code> signifie qu'une commande n'est pas terminée (parenthèse ou guillemet oublié). Appuyez sur <kbd>Échap</kbd> pour annuler.</div>""",
    """<ol>
  <li>Créez un script <code>TP1_calculs.R</code> avec un en-tête commenté.</li>
  <li>Calculez la densité de population d'une commune de 26 024 habitants et de 38,5 km².</li>
  <li>Convertissez 852 m en pieds (1 pied = 0,3048 m) et arrondissez à l'unité avec <code>round()</code>.</li>
  <li>Exécutez le script ligne par ligne, puis en entier avec <i>Source</i>.</li>
</ol>"""),
  lecon("r1-l3", "Projets RStudio et dossier de travail", "20 min",
    ["Comprendre le répertoire de travail et les chemins relatifs",
     "Ouvrir le projet TP_R.Rproj fourni avec les données",
     "Organiser un projet : données, scripts, sorties"],
    """
<p>R lit et écrit les fichiers à partir d'un <b>répertoire de travail</b>. Pour éviter les chemins du type <code>C:/Users/.../Bureau/...</code> qui ne marchent que sur un seul poste, on utilise un <b>projet RStudio</b> : un fichier <code>.Rproj</code> qui fixe automatiquement le dossier de travail.</p>
<p>Les données de TP de ce site sont livrées sous forme de projet :</p>
""" + C("""
TP_R/
├── TP_R.Rproj          <- double-cliquez ici pour ouvrir le projet
├── donnees/
│   ├── shapefiles/     Communes, Oueds, Routes, Forages, Ecoles...
│   ├── tamda.gpkg      toutes les couches dans un GeoPackage
│   ├── raster/         MNT_50m.tif
│   └── tables/         pluie, stations, qualité de l'eau, population...
├── scripts/            01_premiers_pas.R ... 09_risques_multicritere.R
└── sorties/            vos résultats (cartes, tableaux, rasters)
""") + """
<p>Une fois le projet ouvert, les chemins sont <b>relatifs</b> au dossier <code>TP_R</code> :</p>
""" + C("""
getwd()                         # dossier de travail actuel
list.files("donnees/tables")    # contenu d'un sous-dossier
file.exists("donnees/raster/MNT_50m.tif")
""") + """
<div class="astuce"><b>Sous Windows</b>, R écrit les chemins avec des barres obliques <code>/</code> (ou des doubles barres inverses <code>\\\\</code>). Un chemin copié depuis l'explorateur avec <code>\\</code> simple provoque une erreur.</div>""",
    """<ol>
  <li>Téléchargez <code>TP_R_ENIV.zip</code> (page Téléchargements) et décompressez-le dans <code>C:\\ENIV\\</code>.</li>
  <li>Double-cliquez sur <code>C:\\ENIV\\TP_R\\TP_R.Rproj</code> : RStudio s'ouvre sur le projet (son nom apparaît en haut à droite).</li>
  <li>Dans la console, vérifiez <code>getwd()</code> et listez les fichiers de <code>donnees/tables</code>.</li>
  <li>Ouvrez <code>scripts/01_premiers_pas.R</code> et exécutez-le ligne par ligne.</li>
</ol>"""),
  lecon("r1-l4", "Packages et aide", "20 min",
    ["Installer un package une fois et le charger à chaque session",
     "Installer les packages du cours",
     "Lire une page d'aide et ses exemples"],
    """
<p>Un <b>package</b> ajoute des fonctions à R. On l'<b>installe une seule fois</b> par ordinateur (téléchargement depuis le CRAN), puis on le <b>charge</b> à chaque session avec <code>library()</code>.</p>
""" + C("""
# Une seule fois (connexion Internet nécessaire)
install.packages(c("tidyverse", "readxl", "sf", "terra"))

# À chaque session, en haut du script
library(dplyr)
library(ggplot2)
""") + """
<p>Les packages du cours :</p>
<ul>
  <li><code>tidyverse</code> : un ensemble (dplyr, tidyr, readr, ggplot2…) pour manipuler et représenter les données ;</li>
  <li><code>readxl</code> : lire des fichiers Excel ;</li>
  <li><code>sf</code> : données vectorielles (shapefile, GeoPackage), projections, géotraitements ;</li>
  <li><code>terra</code> : rasters, MNT, analyse de terrain, algèbre de cartes.</li>
</ul>
<h4>Trouver de l'aide</h4>
""" + C("""
?mean              # page d'aide d'une fonction
help("round")
example(round)     # exécute les exemples de la page d'aide
??"slope"          # recherche dans toutes les aides installées
sessionInfo()      # versions de R et des packages (à joindre quand on signale un problème)
""") + """
<div class="astuce"><b>Lire un message d'erreur :</b> <code>Error in library(sf) : there is no package called 'sf'</code> signifie simplement que le package n'est pas installé. Copiez le message d'erreur dans un moteur de recherche : quelqu'un a presque toujours rencontré le même problème.</div>""",
    """<ol>
  <li>Installez les packages du cours avec <code>install.packages()</code>.</li>
  <li>Chargez <code>sf</code> et <code>terra</code> : notez les versions de GDAL et PROJ affichées.</li>
  <li>Ouvrez l'aide de <code>mean</code> : à quoi sert l'argument <code>na.rm</code> ?</li>
  <li>Exécutez <code>example(boxplot)</code> et observez le panneau Plots.</li>
</ol>"""),
  ],
  quiz=[
    q("Quel logiciel faut-il installer en premier ?", ["RStudio", "R", "Les deux en même temps", "Le package tidyverse"], 1, "RStudio est l'atelier ; il a besoin de R, le moteur, déjà installé."),
    q("Quel raccourci exécute la ligne courante d'un script dans RStudio ?", ["Ctrl + S", "Ctrl + Entrée", "F5", "Ctrl + Maj + N"], 1, "Ctrl + Entrée envoie la ligne (ou la sélection) à la console."),
    q("À quoi sert le symbole # dans un script R ?", ["À multiplier", "À écrire un commentaire ignoré par R", "À créer un objet", "À charger un package"], 1, "Tout ce qui suit # sur la ligne est un commentaire."),
    q("Pourquoi utiliser un projet RStudio (.Rproj) ?", ["Pour rendre R plus rapide", "Pour fixer le dossier de travail et utiliser des chemins relatifs", "Pour installer les packages", "Pour enregistrer les graphiques en PDF"], 1, "Le projet fixe le répertoire de travail : le même script fonctionne sur tous les postes."),
    q("Quelle est la bonne démarche pour utiliser le package sf ?", ["library(sf) une fois, install.packages à chaque session", "install.packages(\"sf\") une fois, puis library(sf) à chaque session", "install.packages(\"sf\") à chaque session", "Rien : sf est intégré à R"], 1, "On installe une fois par ordinateur et on charge à chaque session."),
    q("Dans la console, que signifie un + en début de ligne ?", ["Une addition est en cours", "La commande précédente n'est pas terminée", "Un package est en cours d'installation", "R a planté"], 1, "Il manque souvent une parenthèse ou un guillemet ; Échap annule."),
  ])

N2 = dict(id="r2", numero=2, titre="Les bases du langage R", echelle="1:500 000",
  resume="Objets et affectation, types de données, vecteurs et calcul vectorisé, indexation, valeurs manquantes, facteurs, listes et matrices.",
  lecons=[
  lecon("r2-l1", "Objets, affectation et types", "25 min",
    ["Créer des objets avec <-",
     "Reconnaître les types numeric, character et logical",
     "Respecter les règles de nommage"],
    """
<p>En R, on range une valeur dans un <b>objet</b> avec la flèche d'affectation <code>&lt;-</code> (raccourci <kbd>Alt + -</kbd>).</p>
""" + C("""
altitude   <- 852          # nombre (numeric)
station    <- "Tamda"      # texte (character), toujours entre guillemets
en_service <- TRUE         # logique (logical) : TRUE ou FALSE
altitude                   # afficher le contenu
class(altitude); class(station); class(en_service)
altitude_km <- altitude / 1000
""") + """
<p>Règles de nommage : commencer par une lettre, pas d'espace ni d'accent, pas de tiret. R distingue majuscules et minuscules (<code>Pluie</code> ≠ <code>pluie</code>). Préférez des noms explicites : <code>pluie_annuelle</code> plutôt que <code>x</code>.</p>
<h4>Comparaisons et opérateurs logiques</h4>
""" + C("""
altitude > 800              # TRUE
altitude == 852             # égalité : deux signes =
altitude != 900             # différent
altitude > 500 & altitude < 1000   # ET
altitude < 500 | altitude > 1000   # OU
as.numeric("12.5")          # conversion de texte en nombre
as.character(2024)
""") + """
<div class="astuce"><b>Décimales :</b> R utilise toujours le <b>point</b> comme séparateur décimal : <code>12.5</code>, jamais <code>12,5</code>.</div>""",
    """<ol>
  <li>Créez les objets <code>nom_commune</code>, <code>population</code> (26024) et <code>surface</code> (38.5).</li>
  <li>Calculez <code>densite</code> et vérifiez sa classe.</li>
  <li>Testez si la densité dépasse 500 hab./km².</li>
  <li>Que renvoie <code>as.numeric("12,5")</code> ? Expliquez.</li>
</ol>"""),
  lecon("r2-l2", "Vecteurs et calcul vectorisé", "30 min",
    ["Créer un vecteur avec c(), seq() et rep()",
     "Appliquer un calcul à tous les éléments d'un coup",
     "Utiliser les fonctions de résumé : sum, mean, min, max, length"],
    """
<p>Un <b>vecteur</b> est une suite de valeurs du même type. C'est la brique de base de R : une colonne d'un tableau est un vecteur.</p>
""" + C("""
mois  <- c("Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc")
pluie <- c(62, 55, 52, 40, 30, 8, 2, 4, 22, 40, 58, 64)   # mm, station fictive
names(pluie) <- mois
length(pluie)
sum(pluie)        # cumul annuel
mean(pluie); median(pluie); min(pluie); max(pluie); range(pluie)
""") + """
<p>Les opérations sont <b>vectorisées</b> : elles s'appliquent à chaque élément sans écrire de boucle.</p>
""" + C("""
pluie / 10                 # en cm
pluie * 1.1                # scénario +10 %
temp <- c(9, 10, 12.5, 14.5, 18, 22.5, 26, 26.5, 22.5, 18, 13, 10)
pluie < 2 * temp           # mois secs selon Gaussen (P < 2T)
sum(pluie < 2 * temp)      # nombre de mois secs (TRUE compte pour 1)
cumsum(pluie)              # cumul progressif
annees <- 2010:2024        # suite d'entiers
seq(0, 1000, by = 250)     # 0 250 500 750 1000
rep("S01", 3)
""") + """
<div class="astuce"><b>Attention au mélange de types :</b> <code>c(1, "a", TRUE)</code> transforme tout en texte. Un vecteur ne contient qu'un seul type.</div>""",
    """<ol>
  <li>Saisissez les températures mensuelles <code>temp</code> ci-dessus et calculez la moyenne annuelle.</li>
  <li>Calculez l'amplitude thermique (max − min).</li>
  <li>Combien de mois sont secs (P &lt; 2T) ? Lesquels ? (indice : <code>names(pluie)[pluie &lt; 2 * temp]</code>)</li>
  <li>Calculez l'indice de De Martonne <code>sum(pluie) / (mean(temp) + 10)</code>.</li>
</ol>"""),
  lecon("r2-l3", "Indexation et valeurs manquantes (NA)", "25 min",
    ["Extraire des éléments par position, par nom ou par condition",
     "Repérer et gérer les valeurs manquantes NA",
     "Utiliser which(), is.na() et l'argument na.rm"],
    """
<p>Les <b>crochets</b> <code>[ ]</code> extraient des éléments d'un vecteur.</p>
""" + C("""
pluie[1]                  # premier élément
pluie[c(6, 7, 8)]         # plusieurs positions
pluie[-1]                 # tout sauf le premier
pluie["Oct"]              # par nom
pluie[pluie > 50]         # par condition : mois humides
which(pluie > 50)         # positions qui vérifient la condition
which.max(pluie)          # position du maximum
pluie[pluie > 50] <- 50   # remplacer (écrêter) des valeurs
""") + """
<h4>Valeurs manquantes</h4>
<p>Une mesure absente (panne d'un pluviomètre, forage non jaugé) est notée <code>NA</code> (<i>Not Available</i>). Un calcul qui contient un <code>NA</code> renvoie <code>NA</code> : c'est volontaire, R refuse d'inventer.</p>
""" + C("""
debit <- c(6.5, 7.1, NA, 16.0, 4.5)   # l/s
mean(debit)                    # NA
mean(debit, na.rm = TRUE)      # moyenne des valeurs présentes
is.na(debit)
sum(is.na(debit))              # nombre de NA
debit[!is.na(debit)]           # valeurs présentes seulement
""") + """
<div class="astuce"><b>À retenir :</b> ne remplacez jamais un <code>NA</code> par 0 sans réfléchir : 0 mm de pluie et « pas de mesure » ne veulent pas dire la même chose.</div>""",
    """<ol>
  <li>Avec le vecteur <code>pluie</code>, extrayez les mois d'hiver (Déc, Jan, Fév) par leur nom.</li>
  <li>Quel est le mois le plus sec ? (utilisez <code>which.min</code> et <code>names</code>)</li>
  <li>Créez <code>prof &lt;- c(175, 65, NA, 235, 250, NA, 160)</code> : comptez les NA et calculez la profondeur moyenne.</li>
  <li>Combien de forages dépassent 150 m de profondeur (sans compter les NA) ?</li>
</ol>"""),
  lecon("r2-l4", "Facteurs, listes et matrices", "25 min",
    ["Utiliser les facteurs pour les variables qualitatives",
     "Regrouper des objets différents dans une liste",
     "Créer et manipuler une matrice"],
    """
<p>Un <b>facteur</b> représente une variable qualitative (catégories) : état d'un forage, type d'occupation du sol, classe de pente.</p>
""" + C("""
etat <- factor(c("En service", "À l'arrêt", "En service", "Abandonné", "En service"))
levels(etat)            # les modalités
table(etat)             # effectifs par modalité
classe <- factor(c("faible", "fort", "moyen"), levels = c("faible", "moyen", "fort"), ordered = TRUE)
classe < "fort"         # comparaisons possibles sur un facteur ordonné
""") + """
<p>Une <b>liste</b> regroupe des objets de types et de longueurs différents. Beaucoup de résultats de R (tests, modèles) sont des listes.</p>
""" + C("""
forage <- list(id = "F001", prof_m = 175, analyses = c(38.7, 41.2))
forage$prof_m
forage[["analyses"]][2]
names(forage)
""") + """
<p>Une <b>matrice</b> est un tableau à deux dimensions d'un seul type ; un raster est, au fond, une grande matrice de valeurs.</p>
""" + C("""
m <- matrix(c(850, 860, 870, 845, 855, 880), nrow = 2, byrow = TRUE)
m
dim(m)          # 2 lignes, 3 colonnes
m[2, 3]         # ligne 2, colonne 3
m[1, ]          # toute la ligne 1
m - min(m)      # calcul sur toutes les cellules
""") + """
<div class="astuce">Le script <code>scripts/02_bases_langage.R</code> reprend tous les exemples du niveau.</div>""",
    """<ol>
  <li>Créez un facteur <code>occup</code> avec les valeurs Forêt, Agriculture, Forêt, Parcours, Urbain, Forêt et affichez ses effectifs.</li>
  <li>Créez une liste <code>station</code> contenant le nom, l'altitude et le vecteur de pluie mensuelle ; calculez le cumul à partir de la liste.</li>
  <li>Créez une matrice 3 × 3 d'altitudes et calculez la différence entre la cellule centrale et la moyenne des cellules.</li>
</ol>"""),
  ],
  quiz=[
    q("Quel opérateur sert à affecter une valeur à un objet en R ?", ["=", "<-", "==", "->>"], 1, "<- est l'opérateur d'affectation conseillé ; == sert à comparer."),
    q("Que renvoie mean(c(4, NA, 8)) ?", ["6", "4", "NA", "Une erreur"], 2, "Il faut ajouter na.rm = TRUE pour ignorer la valeur manquante."),
    q("Que renvoie c(2, 4, 6) * 10 ?", ["120", "20 40 60", "Une erreur", "2 4 6 10"], 1, "Le calcul est vectorisé : chaque élément est multiplié par 10."),
    q("Comment extraire les valeurs de pluie supérieures à 50 ?", ["pluie(> 50)", "pluie[pluie > 50]", "pluie[[50]]", "which(pluie)"], 1, "On indexe le vecteur par une condition logique entre crochets."),
    q("Quel type d'objet convient à une variable « état du forage » (En service, À l'arrêt, Abandonné) ?", ["numeric", "matrix", "factor", "list"], 2, "Les variables qualitatives se représentent par des facteurs."),
    q("Quel est le séparateur décimal dans R ?", ["La virgule", "Le point", "Les deux", "Le point-virgule"], 1, "R utilise toujours le point : 12.5."),
  ])

N3 = dict(id="r3", numero=3, titre="Tableaux de données : importer et manipuler", echelle="1:250 000",
  resume="Data frames, import de fichiers CSV et Excel, manipulation avec dplyr (filtrer, sélectionner, calculer, résumer, joindre) et export des résultats.",
  lecons=[
  lecon("r3-l1", "Les data frames", "25 min",
    ["Créer un data frame et accéder à ses colonnes",
     "Explorer un tableau : head, str, summary, nrow",
     "Ajouter une colonne calculée"],
    """
<p>Un <b>data frame</b> est un tableau : chaque <b>ligne</b> est une observation (un forage, une station, un mois), chaque <b>colonne</b> une variable (un vecteur). C'est l'équivalent de la table attributaire d'une couche SIG.</p>
""" + C("""
stations <- data.frame(
  ID_ST = c("S01", "S02", "S03"),
  NOM   = c("Tamda", "Ain Zerga", "Bordj Lmaa"),
  ALT_M = c(548, 691, 742),
  P_AN  = c(465, 584, 552)
)
stations
stations$ALT_M                   # une colonne = un vecteur
stations[2, ]                    # ligne 2
stations[, c("NOM", "P_AN")]     # deux colonnes
stations[stations$ALT_M > 600, ] # lignes qui vérifient une condition
stations$P_CM <- stations$P_AN / 10   # nouvelle colonne
""") + """
<h4>Explorer un tableau</h4>
""" + C("""
head(stations)       # premières lignes
str(stations)        # structure : type de chaque colonne
summary(stations)    # résumé statistique de chaque colonne
nrow(stations); ncol(stations); names(stations)
View(stations)       # ouvre le tableau dans RStudio
""") + """
<div class="astuce"><b>Astuce RStudio :</b> cliquez sur le nom d'un tableau dans le panneau <i>Environment</i> pour l'afficher, le trier et le filtrer visuellement.</div>""",
    """<ol>
  <li>Créez un data frame <code>communes</code> avec 4 communes (CODE, NOM, POP, SURF_KM2) de votre choix.</li>
  <li>Ajoutez une colonne <code>DENSITE</code>.</li>
  <li>Affichez les communes de plus de 10 000 habitants.</li>
  <li>Utilisez <code>str()</code> et <code>summary()</code> et commentez le résultat.</li>
</ol>"""),
  lecon("r3-l2", "Importer des fichiers CSV et Excel", "30 min",
    ["Lire un CSV au format international (read.csv) ou français (read.csv2)",
     "Lire une feuille Excel avec readxl",
     "Vérifier l'import et corriger les problèmes courants"],
    """
<p>Les fichiers CSV existent en deux « dialectes » :</p>
<ul>
  <li><b>international</b> : séparateur virgule, décimale point → <code>read.csv()</code> ;</li>
  <li><b>français</b> (Excel réglé en français) : séparateur point-virgule, décimale virgule → <code>read.csv2()</code>.</li>
</ul>
""" + C("""
pluie   <- read.csv("donnees/tables/pluie_mensuelle.csv")                       # , et .
qualite <- read.csv2("donnees/tables/qualite_eau_forages.csv", encoding = "UTF-8") # ; et ,
pop     <- read.csv("donnees/tables/population_communes.csv", sep = ";")      # ; mais pas de décimales
gps     <- read.csv("donnees/tables/releves_gps.csv", sep = ";")              # ; et décimale point

library(readxl)
excel_sheets("donnees/tables/population_communes.xlsx")
pop_xl <- read_excel("donnees/tables/population_communes.xlsx", sheet = 1)
""") + """
<h4>Toujours vérifier l'import</h4>
""" + C("""
str(qualite)            # NITRATES_MGL doit être num, pas chr
summary(pluie)          # repérer les NA et les valeurs aberrantes
unique(pluie$ID_ST)
""") + """
<p>Problèmes fréquents : une colonne numérique lue comme texte (mauvais séparateur décimal), des accents illisibles (ajoutez <code>encoding = "UTF-8"</code>), une seule colonne au lieu de plusieurs (mauvais séparateur <code>sep</code>).</p>
<div class="astuce"><b>Exporter :</b> <code>write.csv(tableau, "sorties/resultat.csv", row.names = FALSE)</code> pour un CSV international, <code>write.csv2()</code> pour un fichier qui s'ouvre directement dans Excel en français.</div>""",
    """<ol>
  <li>Importez les cinq tables du dossier <code>donnees/tables</code> avec la bonne fonction.</li>
  <li>Lisez par erreur <code>qualite_eau_forages.csv</code> avec <code>read.csv()</code> : que se passe-t-il ?</li>
  <li>Combien de valeurs manquantes contient la colonne <code>PLUIE_MM</code> ?</li>
  <li>Combien de stations et d'années couvre la table de pluie ?</li>
</ol>"""),
  lecon("r3-l3", "Manipuler avec dplyr", "35 min",
    ["Enchaîner les opérations avec le pipe |>",
     "Utiliser filter, select, mutate et arrange",
     "Créer des classes avec case_when"],
    """
<p>Le package <code>dplyr</code> fournit des « verbes » simples pour manipuler un tableau. Le <b>pipe</b> <code>|&gt;</code> (raccourci <kbd>Ctrl + Maj + M</kbd>) passe le résultat d'une étape à la suivante : on lit « puis ».</p>
""" + C("""
library(dplyr)
pluie <- read.csv("donnees/tables/pluie_mensuelle.csv")

hiver <- pluie |>
  filter(MOIS %in% c(12, 1, 2), !is.na(PLUIE_MM)) |>   # garder des lignes
  select(ID_ST, ANNEE, MOIS, PLUIE_MM) |>               # garder des colonnes
  mutate(PLUIE_CM = PLUIE_MM / 10) |>                   # créer une colonne
  arrange(desc(PLUIE_MM))                               # trier (décroissant)
head(hiver)
""") + """
<p><code>case_when()</code> crée des classes à partir de conditions, comme une reclassification :</p>
""" + C("""
qualite <- read.csv2("donnees/tables/qualite_eau_forages.csv", encoding = "UTF-8")
qualite <- qualite |>
  mutate(CLASSE_NO3 = case_when(
    NITRATES_MGL < 25 ~ "bonne",
    NITRATES_MGL < 50 ~ "moyenne",
    TRUE              ~ "non potable"     # tous les autres cas
  ))
count(qualite, CAMPAGNE, CLASSE_NO3)
""") + """
<div class="astuce"><b>Lisibilité :</b> une étape par ligne, le pipe en fin de ligne. Si une étape plante, exécutez la chaîne morceau par morceau pour trouver laquelle.</div>""",
    """<ol>
  <li>À partir de <code>qualite</code>, gardez les forages dont les nitrates dépassent 50 mg/L en basses eaux, triés du plus pollué au moins pollué.</li>
  <li>Ajoutez une colonne <code>COND_MSCM</code> (conductivité en mS/cm = µS/cm / 1000).</li>
  <li>Dans <code>pluie</code>, gardez la station S03 de 2020 à 2024 et les mois secs (PLUIE_MM &lt; 2 × TMOY_C).</li>
</ol>"""),
  lecon("r3-l4", "Résumer, joindre et remodeler", "35 min",
    ["Calculer des statistiques par groupe avec group_by et summarise",
     "Joindre deux tables par une clé (left_join)",
     "Passer d'un format long à un format large (tidyr)"],
    """
<p><code>group_by()</code> + <code>summarise()</code> calcule une statistique par groupe, comme l'outil « Statistiques récapitulatives » d'un SIG.</p>
""" + C("""
annuel <- pluie |>
  group_by(ID_ST, ANNEE) |>
  summarise(P_AN = sum(PLUIE_MM, na.rm = TRUE), T_MOY = mean(TMOY_C), .groups = "drop")

moyennes <- annuel |>
  group_by(ID_ST) |>
  summarise(P_MOY = round(mean(P_AN)), T_MOY = round(mean(T_MOY), 1), N_ANS = n())
""") + """
<p>Une <b>jointure</b> rapproche deux tables qui partagent une clé (comme une jointure attributaire dans ArcGIS ou QGIS).</p>
""" + C("""
stations <- read.csv("donnees/tables/stations_meteo.csv", encoding = "UTF-8")
synthese <- stations |>
  left_join(moyennes, by = "ID_ST") |>
  arrange(ALT_M)
synthese        # la pluie augmente-t-elle avec l'altitude ?
""") + """
<p><code>tidyr</code> change la forme d'un tableau : format <b>long</b> (une ligne par station et par année) ou <b>large</b> (une colonne par station).</p>
""" + C("""
library(tidyr)
large <- annuel |> select(ID_ST, ANNEE, P_AN) |>
  pivot_wider(names_from = ID_ST, values_from = P_AN)
long  <- large |> pivot_longer(-ANNEE, names_to = "ID_ST", values_to = "P_AN")
write.csv(synthese, "sorties/synthese_stations.csv", row.names = FALSE)
""") + """
<div class="astuce">Le script complet du niveau est <code>scripts/03_tableaux_dplyr.R</code>.</div>""",
    """<ol>
  <li>Calculez, pour chaque campagne, la moyenne, le minimum et le maximum des nitrates, ainsi que le nombre de forages au-dessus de 50 mg/L.</li>
  <li>Joignez <code>forages_attributs.csv</code> à la table de qualité par <code>ID_FOR</code>.</li>
  <li>Calculez la pluie moyenne par mois (1 à 12) toutes stations confondues.</li>
  <li>Exportez votre synthèse en CSV français dans <code>sorties/</code> et ouvrez-la dans Excel.</li>
</ol>"""),
  ],
  quiz=[
    q("Quelle fonction lit un CSV « à la française » (point-virgule, virgule décimale) ?", ["read.csv()", "read.csv2()", "read_excel()", "read.table(dec = \".\")"], 1, "read.csv2 utilise sep = \";\" et dec = \",\" par défaut."),
    q("Quel verbe dplyr garde certaines LIGNES d'un tableau ?", ["select()", "mutate()", "filter()", "arrange()"], 2, "filter garde des lignes ; select garde des colonnes."),
    q("Que fait mutate(DENSITE = POP / SURF) ?", ["Trie le tableau", "Supprime la colonne POP", "Crée ou modifie la colonne DENSITE", "Filtre les communes denses"], 2, "mutate ajoute ou remplace des colonnes."),
    q("Comment calculer la pluie annuelle de chaque station ?", ["filter() puis arrange()", "group_by(ID_ST, ANNEE) puis summarise(sum(PLUIE_MM))", "select(PLUIE_MM)", "left_join()"], 1, "group_by définit les groupes, summarise calcule une valeur par groupe."),
    q("Une colonne de nombres apparaît en « chr » après l'import. Cause la plus probable ?", ["Le fichier est trop gros", "Mauvais séparateur décimal", "Il manque library(dplyr)", "Le fichier contient des NA"], 1, "Des valeurs comme 38,7 lues avec read.csv restent du texte."),
    q("À quoi sert left_join(stations, moyennes, by = \"ID_ST\") ?", ["À empiler deux tableaux", "À ajouter aux stations les colonnes de moyennes ayant le même ID_ST", "À supprimer les doublons", "À trier par ID_ST"], 1, "C'est une jointure attributaire par la clé ID_ST."),
  ])

N4 = dict(id="r4", numero=4, titre="Graphiques avec ggplot2", echelle="1:100 000",
  resume="Graphiques rapides de R de base, grammaire des graphiques de ggplot2, diagramme ombrothermique, facettes, thèmes et export en haute résolution.",
  lecons=[
  lecon("r4-l1", "Graphiques rapides avec R de base", "20 min",
    ["Tracer un histogramme, une boîte à moustaches et un nuage de points",
     "Personnaliser titres, axes et couleurs",
     "Choisir le graphique adapté à la question"],
    """
<p>R de base permet d'explorer rapidement une variable :</p>
""" + C("""
library(dplyr)
pluie   <- read.csv("donnees/tables/pluie_mensuelle.csv")
qualite <- read.csv2("donnees/tables/qualite_eau_forages.csv", encoding = "UTF-8")
annuel  <- pluie |> group_by(ID_ST, ANNEE) |>
  summarise(P_AN = sum(PLUIE_MM, na.rm = TRUE), .groups = "drop")

hist(annuel$P_AN, main = "Pluie annuelle", xlab = "mm", col = "skyblue")       # distribution
boxplot(P_AN ~ ID_ST, data = annuel, ylab = "mm/an", col = "lightgreen")       # comparer des groupes
plot(qualite$COND_USCM, qualite$NITRATES_MGL, pch = 19,
     xlab = "Conductivité (µS/cm)", ylab = "Nitrates (mg/L)")                   # relation entre 2 variables
abline(h = 50, col = "red", lty = 2)                                            # seuil de potabilité
barplot(table(qualite$CAMPAGNE))                                                 # effectifs
""") + """
<table class="list"><tr><th>Question</th><th>Graphique</th></tr>
<tr><td>Comment se répartit une variable ?</td><td>Histogramme</td></tr>
<tr><td>Les groupes diffèrent-ils ?</td><td>Boîtes à moustaches</td></tr>
<tr><td>Deux variables sont-elles liées ?</td><td>Nuage de points</td></tr>
<tr><td>Comment évolue une valeur dans le temps ?</td><td>Courbe</td></tr>
<tr><td>Combien d'éléments par catégorie ?</td><td>Diagramme en barres</td></tr></table>""",
    """<ol>
  <li>Tracez l'histogramme des nitrates et ajoutez une ligne verticale au seuil de 50 mg/L (<code>abline(v = 50)</code>).</li>
  <li>Comparez la conductivité des deux campagnes avec un boxplot.</li>
  <li>Enregistrez un graphique depuis le panneau Plots (<i>Export &gt; Save as Image</i>).</li>
</ol>"""),
  lecon("r4-l2", "La grammaire de ggplot2", "35 min",
    ["Construire un graphique couche par couche : données, aes, geom",
     "Associer couleur, taille et forme à des variables",
     "Ajouter titres, légendes et lignes de référence"],
    """
<p><code>ggplot2</code> construit un graphique en <b>couches</b>, un peu comme une carte dans un SIG :</p>
<ul>
  <li><code>ggplot(données, aes(...))</code> : le tableau et la correspondance variables → axes, couleurs, tailles (<i>aesthetics</i>) ;</li>
  <li><code>geom_...()</code> : la forme géométrique (points, lignes, barres, boîtes) ;</li>
  <li><code>labs()</code>, <code>theme_...()</code>, <code>scale_...()</code> : habillage.</li>
</ul>
""" + C("""
library(ggplot2)
ggplot(qualite, aes(x = COND_USCM, y = NITRATES_MGL, colour = CAMPAGNE)) +
  geom_point(size = 2) +
  geom_hline(yintercept = 50, linetype = "dashed", colour = "red") +
  labs(title = "Nitrates et conductivité des forages",
       x = "Conductivité (µS/cm)", y = "Nitrates (mg/L)", colour = "Campagne") +
  theme_minimal()
""") + """
<p>Quelques géométries utiles :</p>
""" + C("""
ggplot(annuel, aes(x = ID_ST, y = P_AN)) + geom_boxplot(fill = "lightblue")
ggplot(annuel, aes(x = P_AN)) + geom_histogram(bins = 15, fill = "steelblue", colour = "white")
ggplot(annuel, aes(x = ANNEE, y = P_AN, colour = ID_ST)) + geom_line()
ggplot(qualite, aes(x = CAMPAGNE)) + geom_bar()
""") + """
<div class="astuce"><b>Le + en fin de ligne :</b> chaque couche s'ajoute avec <code>+</code> placé à la fin de la ligne précédente, jamais au début de la suivante.</div>""",
    """<ol>
  <li>Tracez avec ggplot2 un nuage de points nitrates en fonction de la profondeur (joignez d'abord <code>forages_attributs.csv</code>).</li>
  <li>Colorez les points selon l'état du forage et ajoutez <code>geom_smooth(method = "lm")</code>.</li>
  <li>Donnez un titre, des noms d'axes avec unités et un thème de votre choix.</li>
</ol>"""),
  lecon("r4-l3", "Diagramme ombrothermique, facettes et export", "35 min",
    ["Construire un diagramme ombrothermique de Gaussen",
     "Répéter un graphique par groupe avec facet_wrap",
     "Exporter en PNG haute résolution avec ggsave"],
    """
<p>Le <b>diagramme ombrothermique</b> de Bagnouls et Gaussen superpose les précipitations (barres) et la température (courbe) avec l'échelle <b>P = 2T</b> : un mois est sec quand la barre passe sous la courbe.</p>
""" + C("""
clim <- pluie |> filter(ID_ST == "S01") |> group_by(MOIS) |>
  summarise(P = mean(PLUIE_MM, na.rm = TRUE), T = mean(TMOY_C))

ombro <- ggplot(clim, aes(x = MOIS)) +
  geom_col(aes(y = P), fill = "steelblue") +
  geom_line(aes(y = 2 * T), colour = "firebrick", linewidth = 1) +
  geom_point(aes(y = 2 * T), colour = "firebrick") +
  scale_x_continuous(breaks = 1:12, labels = c("J","F","M","A","M","J","J","A","S","O","N","D")) +
  scale_y_continuous(name = "Précipitations (mm)",
                     sec.axis = sec_axis(~ . / 2, name = "Température (°C)")) +
  labs(title = "Diagramme ombrothermique, station de Tamda (2010-2024)", x = NULL) +
  theme_bw()
ombro
""") + """
<p>Les <b>facettes</b> répètent le même graphique pour chaque groupe :</p>
""" + C("""
evol <- ggplot(annuel, aes(ANNEE, P_AN)) +
  geom_line() +
  geom_smooth(method = "lm", se = FALSE, colour = "orange") +
  facet_wrap(~ ID_ST) +
  labs(x = "Année", y = "Pluie annuelle (mm)")

ggsave("sorties/ombrothermique_S01.png", ombro, width = 18, height = 12, units = "cm", dpi = 300)
ggsave("sorties/pluie_annuelle_stations.png", evol, width = 20, height = 14, units = "cm", dpi = 300)
""") + """
<div class="astuce">300 dpi suffisent pour un mémoire imprimé. Le script <code>scripts/04_graphiques.R</code> contient tous les graphiques du niveau.</div>""",
    """<ol>
  <li>Tracez le diagramme ombrothermique de la station S04 (la plus haute). Combien de mois secs compte-t-elle ?</li>
  <li>Faites un diagramme ombrothermique pour chaque station avec <code>facet_wrap(~ ID_ST)</code>.</li>
  <li>Exportez-le en PNG à 300 dpi et insérez-le dans un document Word.</li>
</ol>"""),
  ],
  quiz=[
    q("Dans ggplot2, que définit aes() ?", ["La couleur du fond", "La correspondance entre variables et propriétés visuelles (x, y, couleur…)", "Le format d'export", "Le titre"], 1, "aes = aesthetics : quelles variables vont sur les axes, les couleurs, les tailles."),
    q("Quel graphique pour comparer la conductivité de deux campagnes ?", ["Camembert", "Boîtes à moustaches", "Courbe", "Carte"], 1, "Le boxplot compare la distribution d'une variable entre groupes."),
    q("Dans un diagramme ombrothermique de Gaussen, un mois est sec quand :", ["P > 2T", "P < 2T", "T > 30 °C", "P = 0"], 1, "Le mois est sec quand la courbe 2T passe au-dessus des précipitations."),
    q("Quelle fonction répète un graphique pour chaque station ?", ["facet_wrap(~ ID_ST)", "group_by(ID_ST)", "geom_line()", "theme_bw()"], 0, "facet_wrap crée un petit graphique par modalité."),
    q("Comment enregistrer un ggplot en PNG à 300 dpi ?", ["save.png()", "ggsave(\"fichier.png\", graphique, dpi = 300)", "write.csv()", "png = TRUE"], 1, "ggsave choisit le format selon l'extension du fichier."),
    q("Où se place le signe + qui ajoute une couche ggplot ?", ["Au début de la ligne suivante", "À la fin de la ligne", "Entre parenthèses", "Il n'est pas nécessaire"], 1, "Placé en début de ligne, R considère la commande précédente comme terminée."),
  ])
