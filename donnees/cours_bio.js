/*
 * CONTENU PÉDAGOGIQUE : parcours Biodiversité (écologie quantitative avec R) — R ENIV, enseignant : BOUHAFSI SIDDIQ
 * Niveaux b1…b9, leçons, exercices et quiz. "bonne" = numéro de la bonne réponse à partir de 0.
 * Fichier généré par generateur/gen_cours_bio.py (sources : fr_bio_*.py).
 */
window.COURS_BIO = {
 "cle": "bio",
 "nom": "Biodiversité",
 "court": "RStudio",
 "logiciel": "R et RStudio",
 "recherche": "R biodiversité écologie",
 "titre": "Biodiversité et écologie quantitative avec R",
 "accroche": "L'écologie quantitative avec R : des données ouvertes aux modèles bayésiens",
 "lead": "Un parcours avancé sur les méthodes modernes de l'écologie quantitative avec R, appuyé sur des sources de données ouvertes (GBIF, OBIS, WorldClim, Copernicus, MODIS) : télédétection et séries temporelles de NDVI, diversité bêta et neutralité, réseaux écologiques multiplexes, apprentissage automatique explicable, modèles d'occupation avec détection imparfaite, ADN environnemental, modèles joints de distribution d'espèces (JSDM) et modèles bayésiens multi-espèces et spatio-temporels. Les données de TP sont fictives mais réalistes, dans la région de Tlemcen.",
 "niveaux": [
  {
   "id": "b1",
   "numero": 1,
   "titre": "Données de biodiversité en ligne",
   "echelle": "GBIF · OBIS · WorldClim",
   "resume": "Télécharger des occurrences d'espèces (GBIF, OBIS), des variables climatiques (WorldClim, CHELSA) et des images satellitaires (Copernicus, MODIS) depuis R, puis nettoyer, filtrer et rasteriser les occurrences.",
   "lecons": [
    {
     "id": "b1-l1",
     "titre": "Trouver et télécharger des données ouvertes",
     "duree": "35 min",
     "objectifs": [
      "Connaître les grandes bases de données ouvertes sur la biodiversité et l'environnement",
      "Interroger GBIF et OBIS depuis R avec rgbif et robis",
      "Télécharger les variables climatiques WorldClim avec geodata"
     ],
     "contenu": "\n<p>Les méthodes modernes de l'écologie quantitative (modèles d'occupation, JSDM, modèles bayésiens) ont besoin de <b>données d'observation</b> d'espèces et de <b>variables environnementales</b>. Une grande partie est aujourd'hui <b>ouverte</b> et accessible directement depuis R.</p>\n<table class=\"tab\">\n<tr><th>Source</th><th>Contenu</th><th>Package R</th></tr>\n<tr><td><a href=\"https://www.gbif.org\" target=\"_blank\" rel=\"noopener\">GBIF</a></td><td>Plus de 2 milliards d'occurrences d'espèces (musées, inventaires, sciences participatives), dont l'Algérie</td><td><code>rgbif</code></td></tr>\n<tr><td><a href=\"https://obis.org\" target=\"_blank\" rel=\"noopener\">OBIS</a></td><td>Biodiversité marine (côte oranaise, golfe d'Arzew, Ghazaouet)</td><td><code>robis</code></td></tr>\n<tr><td><a href=\"https://www.worldclim.org\" target=\"_blank\" rel=\"noopener\">WorldClim</a> / <a href=\"https://chelsa-climate.org\" target=\"_blank\" rel=\"noopener\">CHELSA</a></td><td>Climat actuel et futur (19 variables bioclimatiques, 30 s ≈ 1 km)</td><td><code>geodata</code></td></tr>\n<tr><td><a href=\"https://esa-worldcover.org\" target=\"_blank\" rel=\"noopener\">ESA WorldCover</a> / <a href=\"https://land.copernicus.eu\" target=\"_blank\" rel=\"noopener\">Copernicus Land</a></td><td>Occupation du sol à 10 m, indices de végétation</td><td><code>geodata</code>, <code>terra</code></td></tr>\n<tr><td><a href=\"https://modis.ornl.gov\" target=\"_blank\" rel=\"noopener\">MODIS (ORNL DAAC)</a></td><td>NDVI 250 m tous les 16 jours depuis 2000 (produit MOD13Q1)</td><td><code>MODISTools</code></td></tr>\n<tr><td><a href=\"https://www.iucnredlist.org\" target=\"_blank\" rel=\"noopener\">Liste rouge UICN</a></td><td>Statut de menace des espèces</td><td><code>rredlist</code></td></tr>\n</table>\n<p>Le principe est le même partout : on décrit <b>quoi</b> (espèce, variable), <b>où</b> (pays, emprise) et <b>quand</b> (années), et le package interroge l'API du site.</p><pre><code># ---- Niveau B1 : données de biodiversité en ligne (R ENIV) ----\n# Ouvrez le projet TP_R.Rproj : les chemins partent du dossier du projet.\nlibrary(sf); library(terra); library(dplyr)\nEN_LIGNE &lt;- FALSE   # mettez TRUE en salle informatique (connexion Internet nécessaire)\n\nif (EN_LIGNE) {\n  # install.packages(c(\"rgbif\", \"robis\", \"geodata\"))\n  library(rgbif)\n  # Emprise de la wilaya de Tlemcen (longitude / latitude WGS 84)\n  emprise &lt;- \"POLYGON((-2.25 34.4,-0.85 34.4,-0.85 35.3,-2.25 35.3,-2.25 34.4))\"\n  thuya &lt;- occ_search(scientificName = \"Tetraclinis articulata\", country = \"DZ\",\n                      geometry = emprise, hasCoordinate = TRUE, limit = 2000)$data\n  # Pour une vraie étude (et une citation DOI), préférez occ_download() avec un compte GBIF\n  write.csv(thuya[, c(\"gbifID\",\"species\",\"decimalLatitude\",\"decimalLongitude\",\"countryCode\",\"year\",\n                      \"basisOfRecord\",\"coordinateUncertaintyInMeters\",\"eventDate\")],\n            \"donnees/biodiversite/occurrences_gbif_reelles.csv\", row.names = FALSE)\n  # OBIS : biodiversité marine au large de Ghazaouet\n  poissons &lt;- robis::occurrence(\"Sparidae\", geometry = \"POLYGON((-2.2 35.0,-1.6 35.0,-1.6 35.3,-2.2 35.3,-2.2 35.0))\")\n  # WorldClim : 19 variables bioclimatiques de l'Algérie à 30 secondes (environ 1 km)\n  bio &lt;- geodata::worldclim_country(\"DZA\", var = \"bio\", res = 0.5, path = \"donnees/biodiversite\")\n}</code></pre><div class=\"astuce\"><b>Données du TP :</b> les fichiers de <code>donnees/biodiversite/</code> sont <b>fictifs</b> (valeurs simulées sur le bassin de l'oued Tamda, UTM 30N) mais les noms d'espèces sont réels. Le code « en ligne » de cette leçon (<code>EN_LIGNE &lt;- TRUE</code>) télécharge les vraies données ; il demande une connexion Internet et n'a pas pu être exécuté depuis notre serveur de test : vérifiez-le en salle informatique.</div>\n<p>Sans connexion, on travaille sur l'export simulé <code>occurrences_gbif_simulees.csv</code>, qui a <b>exactement les mêmes colonnes</b> qu'un export GBIF : le reste du code fonctionne donc à l'identique sur les vraies données.</p><pre><code>occ &lt;- read.csv(\"donnees/biodiversite/occurrences_gbif_simulees.csv\")\ndim(occ)\ntable(occ$species)\ntable(occ$basisOfRecord)\nsummary(occ$coordinateUncertaintyInMeters)</code></pre>",
     "exercice": "<ol>\n  <li>Sur <a href=\"https://www.gbif.org/occurrence/search?country=DZ\" target=\"_blank\" rel=\"noopener\">gbif.org</a>, cherchez <i>Tetraclinis articulata</i> en Algérie : combien d'occurrences ont des coordonnées ?</li>\n  <li>Dans R, chargez <code>occurrences_gbif_simulees.csv</code> et comptez les occurrences par espèce et par décennie (<code>year %/% 10 * 10</code>).</li>\n  <li>Quelle proportion des occurrences n'a pas d'incertitude de coordonnées renseignée ?</li>\n</ol>"
    },
    {
     "id": "b1-l2",
     "titre": "Nettoyer, filtrer et rasteriser les occurrences",
     "duree": "40 min",
     "objectifs": [
      "Repérer les erreurs classiques des données d'occurrence (coordonnées nulles, inversées, doublons)",
      "Filtrer selon l'incertitude spatiale et le type d'observation",
      "Réduire le biais d'échantillonnage par une grille (thinning) et produire une carte de richesse"
     ],
     "contenu": "\n<p>Les données ouvertes sont précieuses mais <b>brutes</b>. Avant toute modélisation, on applique une chaîne de nettoyage reproductible :</p>\n<ul>\n  <li>coordonnées <b>manquantes</b> ou égales à <b>(0, 0)</b> ;</li>\n  <li><b>signe inversé</b> de la longitude (point qui tombe hors de la zone) ;</li>\n  <li><b>doublons</b> (même espèce, mêmes coordonnées, même date) ;</li>\n  <li><b>incertitude</b> trop grande par rapport à la résolution de l'analyse (ici &gt; 1 000 m) ;</li>\n  <li>spécimens anciens ou fossiles selon la question posée.</li>\n</ul><pre><code>propre &lt;- occ |&gt;\n  filter(!is.na(decimalLatitude), !is.na(decimalLongitude),\n         !(decimalLatitude == 0 &amp; decimalLongitude == 0)) |&gt;\n  distinct(species, decimalLatitude, decimalLongitude, eventDate, .keep_all = TRUE) |&gt;\n  filter(is.na(coordinateUncertaintyInMeters) | coordinateUncertaintyInMeters &lt;= 1000,\n         year &gt;= 2000)\nnrow(occ); nrow(propre)\n\n# Conversion en couche sf puis projection en UTM 30N\npts &lt;- st_as_sf(propre, coords = c(\"decimalLongitude\", \"decimalLatitude\"), crs = 4326) |&gt;\n  st_transform(32630)\nzone &lt;- st_read(\"donnees/tamda.gpkg\", layer = \"zone_etude\", quiet = TRUE)\ndedans &lt;- lengths(st_intersects(pts, zone)) &gt; 0\ntable(dedans)          # les longitudes de signe inversé tombent hors de la zone\npts &lt;- pts[dedans, ]</code></pre>\n<p>Les observations se concentrent souvent près des routes et des villes : c'est le <b>biais d'échantillonnage</b>. Un remède simple consiste à garder <b>une seule occurrence par espèce et par maille</b> (ici 1 km).</p><pre><code>grille &lt;- rast(ext(640000, 660000, 3830000, 3850000), resolution = 1000, crs = \"EPSG:32630\")\npts$maille &lt;- cellFromXY(grille, st_coordinates(pts))\namincies &lt;- pts |&gt; group_by(species, maille) |&gt; slice(1) |&gt; ungroup()\nnrow(pts); nrow(amincies)\n\n# Richesse spécifique observée par maille de 1 km\nrich &lt;- amincies |&gt; st_drop_geometry() |&gt; count(maille, name = \"nb_especes\")\nrichesse &lt;- grille; values(richesse) &lt;- NA\nrichesse[rich$maille] &lt;- rich$nb_especes\nplot(richesse, main = \"Richesse observée (espèces par km²)\")\nplot(st_geometry(zone), add = TRUE)\ndir.create(\"sorties\", showWarnings = FALSE)\nwriteRaster(richesse, \"sorties/richesse_observee_1km.tif\", overwrite = TRUE)</code></pre>",
     "exercice": "<ol>\n  <li>Combien d'occurrences sont supprimées à chaque étape du filtrage ? Faites un petit tableau.</li>\n  <li>Refaites le thinning avec une maille de 2 km : combien d'occurrences restent ?</li>\n  <li>Exportez les occurrences propres en GeoPackage (<code>st_write</code>) et ouvrez-les dans QGIS ou ArcGIS.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Quelle base de données rassemble des occurrences d'espèces du monde entier et propose un DOI pour chaque téléchargement ?",
     "choix": [
      "OpenStreetMap",
      "GBIF",
      "MODIS",
      "WorldClim"
     ],
     "bonne": 1,
     "explication": "GBIF (Global Biodiversity Information Facility) agrège les occurrences ; occ_download() fournit un DOI à citer."
    },
    {
     "question": "Pourquoi supprimer les points de coordonnées (0, 0) ?",
     "choix": [
      "Ce sont presque toujours des valeurs manquantes mal codées",
      "Ils sont trop précis",
      "GBIF les interdit",
      "Ils sont dans l'océan Indien"
     ],
     "bonne": 0,
     "explication": "Le point (0, 0) est dans le golfe de Guinée : c'est le plus souvent une absence de coordonnées enregistrée comme 0."
    },
    {
     "question": "Le « thinning » sur une grille de 1 km sert à…",
     "choix": [
      "augmenter le nombre d'occurrences",
      "changer de système de coordonnées",
      "réduire le biais d'échantillonnage en gardant une occurrence par espèce et par maille",
      "calculer le NDVI"
     ],
     "bonne": 2,
     "explication": "Les zones très prospectées (routes, villes) pèsent moins après amincissement."
    },
    {
     "question": "Quel package R télécharge les variables bioclimatiques WorldClim ?",
     "choix": [
      "ggplot2",
      "readxl",
      "dplyr",
      "geodata"
     ],
     "bonne": 3,
     "explication": "geodata::worldclim_country() ou worldclim_global()."
    }
   ]
  },
  {
   "id": "b2",
   "numero": 2,
   "titre": "Télédétection écologique et séries temporelles",
   "echelle": "NDVI · terra",
   "resume": "Analyser une série annuelle de NDVI (2010-2024) : tendance par pixel, test de Mann-Kendall, détection d'une perturbation, puis mesurer la fragmentation du couvert forestier entre deux dates.",
   "lecons": [
    {
     "id": "b2-l1",
     "titre": "Séries temporelles de NDVI et tendances",
     "duree": "40 min",
     "objectifs": [
      "Comprendre le NDVI et les produits satellitaires gratuits (MODIS, Sentinel-2, Landsat)",
      "Calculer une tendance par pixel avec terra::app()",
      "Tester la significativité d'une tendance (Mann-Kendall) et repérer une perturbation"
     ],
     "contenu": "\n<p>Le <b>NDVI</b> (indice de végétation par différence normalisée) se calcule à partir du rouge et du proche infrarouge : <code>NDVI = (PIR − R) / (PIR + R)</code>. Il varie de −1 à 1 ; un sol nu est proche de 0,1, un maquis dense de 0,5 à 0,7. Des séries gratuites existent : <a href=\"https://lpdaac.usgs.gov/products/mod13q1v061/\" target=\"_blank\" rel=\"noopener\">MODIS MOD13Q1</a> (250 m, depuis 2000), <a href=\"https://dataspace.copernicus.eu\" target=\"_blank\" rel=\"noopener\">Sentinel-2</a> (10 m, depuis 2015) et Landsat (30 m, depuis 1984).</p><pre><code># ---- Niveau B2 : télédétection écologique ----\nlibrary(terra); library(sf)\nEN_LIGNE &lt;- FALSE\nif (EN_LIGNE) {\n  # install.packages(\"MODISTools\")\n  # NDVI MODIS 250 m autour du parc national de Tlemcen (série 16 jours)\n  m &lt;- MODISTools::mt_subset(product = \"MOD13Q1\", band = \"250m_16_days_NDVI\",\n         lat = 34.85, lon = -1.35, km_lr = 10, km_ab = 10,\n         start = \"2010-01-01\", end = \"2024-12-31\", progress = FALSE)\n  ndvi_modis &lt;- MODISTools::mt_to_terra(m)   # facteur d'échelle 0.0001\n}\nndvi &lt;- rast(\"donnees/biodiversite/ndvi_2010_2024.tif\")   # 15 couches : NDVI maximal annuel (fictif)\nndvi\nplot(ndvi[[c(1, 8, 15)]])\nmoy_zone &lt;- global(ndvi, \"mean\", na.rm = TRUE)$mean\nplot(2010:2024, moy_zone, type = \"b\", xlab = \"Année\", ylab = \"NDVI moyen\")</code></pre><div class=\"astuce\"><b>Données du TP :</b> les fichiers de <code>donnees/biodiversite/</code> sont <b>fictifs</b> (valeurs simulées sur le bassin de l'oued Tamda, UTM 30N) mais les noms d'espèces sont réels. Le code « en ligne » de cette leçon (<code>EN_LIGNE &lt;- TRUE</code>) télécharge les vraies données ; il demande une connexion Internet et n'a pas pu être exécuté depuis notre serveur de test : vérifiez-le en salle informatique.</div>\n<h4>Tendance par pixel</h4>\n<p><code>app()</code> applique une fonction à la série temporelle de <b>chaque pixel</b>. On calcule la pente d'une régression linéaire (unité NDVI par an) et le <b>tau de Kendall</b>, base du test non paramétrique de <b>Mann-Kendall</b>, robuste aux valeurs aberrantes.</p><pre><code>annees &lt;- 2010:2024\npente_fun &lt;- function(v) if (anyNA(v)) NA else coef(lm(v ~ annees))[2]\ntendance &lt;- app(ndvi, pente_fun)\nnames(tendance) &lt;- \"pente_ndvi_an\"\nmk_fun &lt;- function(v) {\n  if (anyNA(v)) return(c(NA, NA))\n  t &lt;- suppressWarnings(cor.test(annees, v, method = \"kendall\"))\n  c(t$estimate, t$p.value)\n}\nmk &lt;- app(ndvi, mk_fun); names(mk) &lt;- c(\"tau\", \"p_value\")\nsignif &lt;- ifel(mk$p_value &lt; 0.05, sign(mk$tau), 0)   # -1 baisse, 0 stable, +1 hausse\nplot(tendance, col = hcl.colors(50, \"RdYlGn\"), main = \"Tendance du NDVI 2010-2024 (par an)\")\nplot(signif, col = c(\"firebrick\", \"grey85\", \"forestgreen\"), main = \"Tendance significative (Mann-Kendall)\")\nfreq(signif)\n\n# Détection d'une perturbation : chute brutale entre deux années consécutives\nchute &lt;- min(diff(ndvi))          # plus forte baisse annuelle de chaque pixel\nannee_chute &lt;- which.min(diff(ndvi)) + 2010\nperturbe &lt;- chute &lt; -0.15\nplot(mask(annee_chute, perturbe, maskvalues = 0), main = \"Année de la perturbation\")\ndir.create(\"sorties\", showWarnings = FALSE)\nwriteRaster(c(tendance, signif), \"sorties/tendance_ndvi.tif\", overwrite = TRUE)</code></pre>",
     "exercice": "<ol>\n  <li>Quelle part de la zone présente une baisse significative du NDVI ? une hausse ?</li>\n  <li>Quelle année correspond à la perturbation du sud-est ? Proposez une explication (incendie, défrichement…).</li>\n  <li>Calculez la tendance moyenne par commune avec <code>zonal()</code> et la couche <code>communes</code>.</li>\n</ol>"
    },
    {
     "id": "b2-l2",
     "titre": "Fragmentation du couvert forestier",
     "duree": "35 min",
     "objectifs": [
      "Comparer deux cartes de forêt et calculer une matrice de changement",
      "Identifier les taches (patches) de forêt et calculer des métriques paysagères",
      "Interpréter la fragmentation pour la biodiversité"
     ],
     "contenu": "\n<p>La <b>fragmentation</b> découpe un habitat continu en taches plus petites et plus isolées : la surface d'intérieur forestier diminue et les lisières augmentent. L'écologie du paysage la mesure avec des <b>métriques</b> : nombre de taches, surface moyenne, plus grande tache, densité de lisière. Le package <a href=\"https://r-spatialecology.github.io/landscapemetrics/\" target=\"_blank\" rel=\"noopener\">landscapemetrics</a> en calcule plus de 100 ; ici nous calculons les principales nous-mêmes avec <code>terra</code> pour bien les comprendre.</p><pre><code>f10 &lt;- rast(\"donnees/biodiversite/foret_2010.tif\")\nf24 &lt;- rast(\"donnees/biodiversite/foret_2024.tif\")\nchangement &lt;- f10 * 10 + f24        # 0 = non-forêt stable, 1 = gain, 10 = perte, 11 = forêt stable\nfreq(changement)\nplot(changement, col = c(\"grey90\", \"forestgreen\", \"firebrick\", \"darkgreen\"),\n     main = \"Changement du couvert forestier 2010-2024\")\n\nmetriques &lt;- function(f) {\n  taches &lt;- patches(f, directions = 8, zeroAsNA = TRUE)\n  surf_ha &lt;- freq(taches)$count * prod(res(f)) / 10000\n  aire_foret &lt;- sum(surf_ha)\n  lisiere &lt;- boundaries(f, inner = TRUE) &amp; f == 1\n  long_lisiere_m &lt;- global(lisiere, \"sum\", na.rm = TRUE)[1, 1] * res(f)[1]\n  data.frame(foret_ha = aire_foret, nb_taches = length(surf_ha),\n             taille_moyenne_ha = mean(surf_ha), plus_grande_tache_pct = 100 * max(surf_ha) / aire_foret,\n             densite_lisiere_m_ha = long_lisiere_m / (ncell(f) * prod(res(f)) / 10000))\n}\nrbind(`2010` = metriques(f10), `2024` = metriques(f24))</code></pre>",
     "exercice": "<ol>\n  <li>La surface forestière a-t-elle augmenté ou diminué ? Et le nombre de taches ?</li>\n  <li>Une forêt peut gagner en surface tout en se fragmentant localement : vérifiez-le en ne gardant que le quart sud-est (<code>crop()</code>).</li>\n  <li>Si vous avez Internet, installez <code>landscapemetrics</code> et comparez avec <code>lsm_c_np()</code>, <code>lsm_c_ed()</code> et <code>lsm_c_lpi()</code>.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Le NDVI se calcule avec…",
     "choix": [
      "le proche infrarouge et le rouge",
      "le bleu et le vert",
      "la température et la pluie",
      "l'altitude et la pente"
     ],
     "bonne": 0,
     "explication": "NDVI = (PIR − R) / (PIR + R)."
    },
    {
     "question": "Quelle fonction terra applique une fonction à la série temporelle de chaque pixel ?",
     "choix": [
      "crop()",
      "freq()",
      "app()",
      "patches()"
     ],
     "bonne": 2,
     "explication": "app() parcourt les cellules et applique la fonction aux valeurs des couches."
    },
    {
     "question": "Le test de Mann-Kendall est apprécié en télédétection parce qu'il…",
     "choix": [
      "ne marche qu'avec Sentinel-2",
      "nécessite des données normales",
      "calcule le NDVI",
      "est non paramétrique et robuste aux valeurs aberrantes"
     ],
     "bonne": 3,
     "explication": "Il repose sur le rang des valeurs (tau de Kendall)."
    },
    {
     "question": "Une forêt plus fragmentée présente en général…",
     "choix": [
      "une seule grande tache",
      "moins de taches et moins de lisière",
      "un NDVI plus élevé",
      "plus de taches et plus de lisière"
     ],
     "bonne": 3,
     "explication": "La fragmentation augmente le nombre de taches et la densité de lisière."
    }
   ]
  },
  {
   "id": "b3",
   "numero": 3,
   "titre": "Diversité bêta et neutralité",
   "echelle": "α · β · γ",
   "resume": "Mesurer la diversité alpha, bêta et gamma, décomposer la diversité bêta en remplacement (turnover) et emboîtement (nestedness), puis confronter les communautés à des modèles nuls et neutres.",
   "lecons": [
    {
     "id": "b3-l1",
     "titre": "Diversité alpha, bêta, gamma et décomposition de Baselga",
     "duree": "40 min",
     "objectifs": [
      "Calculer richesse, indices de Shannon et de Simpson avec vegan",
      "Distinguer diversité alpha, bêta et gamma",
      "Décomposer la diversité bêta en remplacement et emboîtement"
     ],
     "contenu": "\n<p>Whittaker distingue trois échelles : la <b>diversité alpha</b> (dans un relevé), la <b>diversité gamma</b> (dans toute la région) et la <b>diversité bêta</b> (la différence de composition entre relevés). Le fichier <code>communautes_plantes.csv</code> contient 30 relevés de végétation répartis en trois zones (piémont, versant, sommet) le long du gradient d'altitude.</p><pre><code># ---- Niveau B3 : diversité bêta et neutralité ----\nlibrary(vegan)\ncom &lt;- read.csv(\"donnees/biodiversite/communautes_plantes.csv\", check.names = FALSE)\nab &lt;- as.matrix(com[, -(1:3)])          # abondances : relevés en lignes, espèces en colonnes\nrownames(ab) &lt;- com$RELEVE\nalpha &lt;- data.frame(com[, 1:3], richesse = specnumber(ab),\n                    shannon = diversity(ab, \"shannon\"), simpson = diversity(ab, \"simpson\"))\naggregate(cbind(richesse, shannon) ~ ZONE, data = alpha, FUN = mean)\ngamma &lt;- sum(colSums(ab) &gt; 0)\nbeta_whittaker &lt;- gamma / mean(alpha$richesse)\nc(gamma = gamma, alpha_moy = mean(alpha$richesse), beta = beta_whittaker)</code></pre>\n<h4>Remplacement ou emboîtement ?</h4>\n<p>Deux communautés peuvent différer parce que des espèces <b>se remplacent</b> (turnover) ou parce que la plus pauvre est un <b>sous-ensemble</b> de la plus riche (emboîtement, nestedness). Avec <i>a</i> espèces communes, <i>b</i> et <i>c</i> espèces propres à chaque relevé, Baselga (2010) propose :</p>\n<ul>\n  <li>β<sub>sor</sub> = (b + c) / (2a + b + c) : dissimilarité totale de Sørensen ;</li>\n  <li>β<sub>sim</sub> = min(b, c) / (a + min(b, c)) : part due au <b>remplacement</b> ;</li>\n  <li>β<sub>sne</sub> = β<sub>sor</sub> − β<sub>sim</sub> : part due à l'<b>emboîtement</b>.</li>\n</ul>\n<p>Le package <a href=\"https://cran.r-project.org/package=betapart\" target=\"_blank\" rel=\"noopener\">betapart</a> fait ce calcul (<code>beta.pair()</code>, <code>beta.multi()</code>) ; voici la version « à la main », utile pour comprendre.</p><pre><code>pa &lt;- (ab &gt; 0) * 1\nbaselga &lt;- function(x, y) {\n  a &lt;- sum(x &amp; y); b &lt;- sum(x &amp; !y); c &lt;- sum(!x &amp; y)\n  sor &lt;- (b + c) / (2 * a + b + c); sim &lt;- min(b, c) / (a + min(b, c))\n  c(sorensen = sor, remplacement = sim, emboitement = sor - sim)\n}\npaires &lt;- combn(nrow(pa), 2)\nres &lt;- t(apply(paires, 2, function(k) baselga(pa[k[1], ], pa[k[2], ])))\nres &lt;- data.frame(r1 = com$ZONE[paires[1, ]], r2 = com$ZONE[paires[2, ]], res)\nres$type &lt;- ifelse(res$r1 == res$r2, \"même zone\", \"zones différentes\")\naggregate(cbind(sorensen, remplacement, emboitement) ~ type, data = res, FUN = mean)\n\n# Ordination NMDS de la composition\nnmds &lt;- metaMDS(ab, distance = \"bray\", k = 2, trace = FALSE)\nplot(nmds$points, col = factor(com$ZONE), pch = 19, main = \"NMDS (Bray-Curtis)\")\nlegend(\"topright\", legend = levels(factor(com$ZONE)), col = 1:3, pch = 19)\nadonis2(ab ~ ZONE, data = com, permutations = 499)   # PERMANOVA</code></pre>",
     "exercice": "<ol>\n  <li>Quelle zone a la plus forte diversité de Shannon ?</li>\n  <li>Entre zones différentes, la dissimilarité vient-elle surtout du remplacement ou de l'emboîtement ? Interprétez avec le gradient d'altitude.</li>\n  <li>Testez <code>betadisper()</code> pour vérifier si la dispersion des relevés diffère entre zones.</li>\n</ol>"
    },
    {
     "id": "b3-l2",
     "titre": "Modèles nuls et théorie neutre",
     "duree": "35 min",
     "objectifs": [
      "Ajuster des distributions d'abondance (log-série de Fisher, log-normale de Preston, radfit)",
      "Tester une structure de communauté avec un modèle nul",
      "Simuler une communauté neutre (dérive écologique) et la comparer aux données"
     ],
     "contenu": "\n<p>La <b>théorie neutre</b> de Hubbell (2001) suppose que toutes les espèces sont écologiquement équivalentes : la composition change seulement par <b>dérive</b> (naissances et morts au hasard), immigration et spéciation. C'est une <b>hypothèse nulle</b> : si les données s'en écartent, la niche (altitude, climat) joue un rôle. On commence par les distributions d'abondance classiques.</p><pre><code>total &lt;- colSums(ab)\nfisher &lt;- fisherfit(total[total &gt; 0]); fisher$estimate        # alpha de Fisher\npreston &lt;- prestonfit(total[total &gt; 0]); preston\nrad &lt;- radfit(total[total &gt; 0]); rad                          # préemption, log-normale, Zipf, Mandelbrot...\nplot(rad, main = \"Diagrammes rang-abondance\")\n\n# Modèle nul : l'emboîtement (NODF) est-il plus fort que le hasard ?\nnodf &lt;- oecosimu(pa, nestednodf, method = \"r00\", nsimul = 199)\nnodf$oecosimu$statistic; nodf$oecosimu$pval[3]</code></pre>\n<h4>Une petite simulation neutre</h4>\n<p>On simule une communauté locale de taille fixe <i>J</i> : à chaque pas, un individu meurt et il est remplacé par la descendance d'un individu local (probabilité 1 − <i>m</i>) ou par un immigrant tiré du pool régional (probabilité <i>m</i>).</p><pre><code>simul_neutre &lt;- function(pool, J = 300, m = 0.1, pas = 20000) {\n  com &lt;- sample(names(pool), J, replace = TRUE, prob = pool)\n  for (t in 1:pas) {\n    i &lt;- sample.int(J, 1)\n    com[i] &lt;- if (runif(1) &lt; m) sample(names(pool), 1, prob = pool) else com[sample.int(J, 1)]\n  }\n  table(factor(com, levels = names(pool)))\n}\nset.seed(1)\npool &lt;- total / sum(total)\nneutres &lt;- t(replicate(10, simul_neutre(pool, J = round(mean(rowSums(ab))))))\n# Les relevés neutres sont-ils aussi différents entre eux que les vrais relevés ?\nc(observe = mean(vegdist(ab)), neutre = mean(vegdist(neutres)))</code></pre>",
     "exercice": "<ol>\n  <li>Quel modèle de <code>radfit</code> a le plus petit AIC ?</li>\n  <li>Faites varier l'immigration <code>m</code> (0,01 ; 0,1 ; 0,5) : comment évolue la dissimilarité moyenne des communautés neutres ?</li>\n  <li>Concluez : la structure observée est-elle compatible avec la neutralité ou dominée par la niche (altitude) ?</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "La diversité gamma correspond à…",
     "choix": [
      "la différence entre deux relevés",
      "l'indice de Simpson",
      "la diversité d'un seul relevé",
      "la diversité de toute la région"
     ],
     "bonne": 3,
     "explication": "Gamma = échelle régionale ; alpha = locale ; bêta = différence entre les deux."
    },
    {
     "question": "Dans la décomposition de Baselga, βsim mesure…",
     "choix": [
      "le remplacement d'espèces (turnover)",
      "la richesse totale",
      "l'abondance moyenne",
      "l'emboîtement"
     ],
     "bonne": 0,
     "explication": "βsim = min(b, c) / (a + min(b, c)) est la composante de remplacement."
    },
    {
     "question": "Selon la théorie neutre de Hubbell, les espèces…",
     "choix": [
      "sont classées par taille",
      "occupent toutes une niche différente",
      "sont écologiquement équivalentes et la composition change par dérive",
      "ne migrent jamais"
     ],
     "bonne": 2,
     "explication": "C'est une hypothèse nulle de la structure des communautés."
    },
    {
     "question": "Que fait oecosimu() de vegan ?",
     "choix": [
      "dessine une carte",
      "compare une statistique observée à sa distribution sous un modèle nul",
      "télécharge des occurrences",
      "calcule le NDVI"
     ],
     "bonne": 1,
     "explication": "Il permute la matrice selon un algorithme nul et calcule une p-valeur."
    }
   ]
  },
  {
   "id": "b4",
   "numero": 4,
   "titre": "Réseaux écologiques multiplexes",
   "echelle": "igraph",
   "resume": "Construire des réseaux d'interactions plantes-pollinisateurs et plantes-herbivores, calculer connectance, emboîtement et modularité, assembler un réseau multiplexe et simuler des extinctions en cascade.",
   "lecons": [
    {
     "id": "b4-l1",
     "titre": "Réseaux bipartis d'interactions",
     "duree": "35 min",
     "objectifs": [
      "Transformer une table d'interactions en matrice et en graphe igraph",
      "Calculer degré, connectance, emboîtement (NODF) et modularité",
      "Identifier les espèces clés du réseau"
     ],
     "contenu": "\n<p>Un <b>réseau d'interactions</b> relie des espèces de deux groupes : des plantes et leurs pollinisateurs, ou des plantes et leurs herbivores. C'est un graphe <b>biparti</b>. Les réseaux de pollinisation sont souvent <b>emboîtés</b> (les spécialistes visitent des plantes déjà visitées par les généralistes) et <b>modulaires</b> (groupes d'espèces qui interagissent surtout entre elles). Des jeux de données réels sont disponibles sur <a href=\"https://www.web-of-life.es\" target=\"_blank\" rel=\"noopener\">Web of Life</a> et <a href=\"https://www.globalbioticinteractions.org\" target=\"_blank\" rel=\"noopener\">GloBI</a> (package <code>rglobi</code>).</p><pre><code># ---- Niveau B4 : réseaux écologiques multiplexes ----\nlibrary(igraph); library(vegan)\npol &lt;- read.csv(\"donnees/biodiversite/reseau_pollinisation.csv\")\nher &lt;- read.csv(\"donnees/biodiversite/reseau_herbivorie.csv\")\nhead(pol)\nM_pol &lt;- xtabs(interactions ~ plante + pollinisateur, data = pol)\nM_pol &lt;- unclass(M_pol)\ndim(M_pol)\nconnectance &lt;- sum(M_pol &gt; 0) / length(M_pol)\nnodf &lt;- nestednodf(M_pol &gt; 0)$statistic[\"NODF\"]\nc(connectance = connectance, NODF = unname(nodf))\n\ng &lt;- graph_from_biadjacency_matrix(M_pol, weighted = TRUE)\nV(g)$color &lt;- ifelse(V(g)$type, \"gold\", \"forestgreen\")\nplot(g, layout = layout_as_bipartite(g), vertex.label.cex = 0.6, vertex.size = 6,\n     edge.width = E(g)$weight / 5, main = \"Réseau plantes-pollinisateurs\")\nsort(degree(g)[!V(g)$type], decreasing = TRUE)[1:5]   # plantes les plus visitées\nmod &lt;- cluster_louvain(g, weights = E(g)$weight)\nmodularity(mod); table(membership(mod))</code></pre>",
     "exercice": "<ol>\n  <li>Quelles sont les trois plantes qui reçoivent le plus de pollinisateurs différents ?</li>\n  <li>Calculez la connectance et le NODF du réseau d'herbivorie et comparez avec la pollinisation.</li>\n  <li>Testez l'emboîtement contre un modèle nul avec <code>oecosimu(M_pol &gt; 0, nestednodf, \"r00\")</code>.</li>\n</ol>"
    },
    {
     "id": "b4-l2",
     "titre": "Réseau multiplexe et robustesse aux extinctions",
     "duree": "40 min",
     "objectifs": [
      "Assembler deux couches d'interactions qui partagent les mêmes plantes",
      "Calculer le degré multiplexe et le coefficient de participation",
      "Simuler la perte de plantes et mesurer la robustesse des communautés animales"
     ],
     "contenu": "\n<p>Dans la nature, une même plante est à la fois pollinisée, broutée, dispersée… Un <b>réseau multiplexe</b> superpose plusieurs <b>couches</b> d'interactions sur les mêmes espèces. On peut alors se demander si les plantes importantes pour les pollinisateurs sont aussi les plus consommées, et ce que la disparition d'une plante (incendie, surpâturage) entraîne dans <b>toutes</b> les couches.</p><pre><code>M_her &lt;- unclass(xtabs(interactions ~ plante + herbivore, data = her))\nplantes &lt;- sort(union(rownames(M_pol), rownames(M_her)))\ndeg &lt;- data.frame(plante = plantes,\n                  pollinisation = rowSums(M_pol &gt; 0)[plantes],\n                  herbivorie = rowSums(M_her &gt; 0)[plantes])\ndeg[is.na(deg)] &lt;- 0\ndeg$multiplexe &lt;- deg$pollinisation + deg$herbivorie\n# Coefficient de participation : 1 = liens répartis entre couches, 0 = une seule couche\ndeg$participation &lt;- 2 * (1 - ((deg$pollinisation / deg$multiplexe)^2 + (deg$herbivorie / deg$multiplexe)^2))\ndeg[order(-deg$multiplexe), ]\ncor.test(deg$pollinisation, deg$herbivorie, method = \"spearman\")</code></pre>\n<h4>Extinctions en cascade</h4>\n<p>On retire les plantes une à une et on compte les animaux qui n'ont plus aucune plante partenaire (extinctions secondaires). La <b>robustesse</b> R est l'aire sous la courbe de survie (proche de 1 : réseau robuste).</p><pre><code>robustesse &lt;- function(M, ordre) {\n  survie &lt;- sapply(0:nrow(M), function(k) {\n    reste &lt;- M[setdiff(rownames(M), ordre[seq_len(k)]), , drop = FALSE]\n    mean(colSums(reste) &gt; 0)\n  })\n  list(survie = survie, R = mean(survie))\n}\nset.seed(42)\nhasard &lt;- replicate(100, robustesse(M_pol, sample(rownames(M_pol)))$R)\nplus_connectees &lt;- names(sort(rowSums(M_pol &gt; 0), decreasing = TRUE))\nr_cible &lt;- robustesse(M_pol, plus_connectees)\nc(hasard = mean(hasard), plus_connectees_d_abord = r_cible$R)\nplot(0:nrow(M_pol) / nrow(M_pol), r_cible$survie, type = \"s\", col = \"firebrick\",\n     xlab = \"Proportion de plantes perdues\", ylab = \"Pollinisateurs survivants\")</code></pre>",
     "exercice": "<ol>\n  <li>Quelle plante a le plus fort degré multiplexe ? Est-elle importante dans les deux couches ?</li>\n  <li>Calculez la robustesse de la couche herbivorie, puis du réseau multiplexe (animaux des deux couches).</li>\n  <li>Quel scénario est le plus grave : perte aléatoire ou perte des plantes les plus connectées ? Quelles conséquences pour la gestion des incendies dans les monts de Tlemcen ?</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Un réseau plantes-pollinisateurs est un graphe…",
     "choix": [
      "biparti",
      "orienté acyclique",
      "complet",
      "planaire"
     ],
     "bonne": 0,
     "explication": "Les liens relient uniquement des plantes à des animaux : deux groupes distincts."
    },
    {
     "question": "La connectance d'un réseau est…",
     "choix": [
      "le degré maximal",
      "le nombre d'espèces",
      "la proportion des interactions possibles qui sont réalisées",
      "la longueur du plus long chemin"
     ],
     "bonne": 2,
     "explication": "Connectance = liens réalisés / (nombre de plantes × nombre d'animaux)."
    },
    {
     "question": "Un réseau multiplexe…",
     "choix": [
      "ne contient qu'une espèce",
      "superpose plusieurs types d'interactions entre les mêmes espèces",
      "remplace les données GBIF",
      "est toujours aléatoire"
     ],
     "bonne": 1,
     "explication": "Chaque couche est un type d'interaction (pollinisation, herbivorie…)."
    },
    {
     "question": "Dans une simulation d'extinctions, la robustesse est plus faible quand on retire d'abord…",
     "choix": [
      "les plantes les moins connectées",
      "aucune espèce",
      "les plantes les plus connectées",
      "les animaux"
     ],
     "bonne": 2,
     "explication": "Les espèces très connectées soutiennent de nombreux partenaires."
    }
   ]
  },
  {
   "id": "b5",
   "numero": 5,
   "titre": "Modèles de distribution et IA explicable",
   "echelle": "ranger · XAI",
   "resume": "Construire un modèle de distribution d'espèce (SDM) par forêt aléatoire, l'évaluer (AUC) et l'expliquer : importance des variables, dépendances partielles, courbes individuelles et explication locale.",
   "lecons": [
    {
     "id": "b5-l1",
     "titre": "Un SDM par forêt aléatoire",
     "duree": "40 min",
     "objectifs": [
      "Associer présences-absences et variables environnementales",
      "Ajuster une forêt aléatoire avec ranger et l'évaluer sur des données de test (AUC)",
      "Prédire et cartographier la probabilité de présence"
     ],
     "contenu": "\n<p>Un <b>modèle de distribution d'espèce</b> (SDM) relie la présence d'une espèce aux conditions du milieu. Les méthodes d'<b>apprentissage automatique</b> (forêt aléatoire, boosting) sont très performantes mais fonctionnent comme des « boîtes noires ». Nous modélisons le <b>thuya de Berbérie</b> (<i>Tetraclinis articulata</i>), arbre emblématique de l'Oranie, à partir de 120 sites d'inventaire.</p><pre><code># ---- Niveau B5 : SDM et IA explicable ----\nlibrary(ranger); library(terra)\nsites &lt;- read.csv(\"donnees/biodiversite/sites_bio.csv\")\npa &lt;- read.csv(\"donnees/biodiversite/presences_plantes.csv\")\nd &lt;- merge(sites, pa[, c(\"SITE\", \"Tetraclinis_articulata\")], by = \"SITE\")\nd$presence &lt;- factor(d$Tetraclinis_articulata, levels = c(0, 1))\nvars &lt;- c(\"altitude\", \"pente\", \"tmoy\", \"pluie\", \"ndvi\")\nset.seed(2026)\ntest &lt;- sample(nrow(d), 36)\nrf &lt;- ranger(presence ~ altitude + pente + tmoy + pluie + ndvi, data = d[-test, ],\n             probability = TRUE, num.trees = 500, importance = \"permutation\")\nrf\np_test &lt;- predict(rf, d[test, ])$predictions[, \"1\"]\nauc &lt;- function(p, y) { r &lt;- rank(p); n1 &lt;- sum(y == 1); n0 &lt;- sum(y == 0)\n  (sum(r[y == 1]) - n1 * (n1 + 1) / 2) / (n1 * n0) }\nauc(p_test, d$Tetraclinis_articulata[test])     # 0.5 = hasard, 1 = parfait\n\ncov &lt;- rast(\"donnees/biodiversite/covariables_bio.tif\")\ncarte &lt;- predict(cov, rf, fun = function(m, ...) predict(m, ...)$predictions[, \"1\"], na.rm = TRUE)\nplot(carte, main = \"Probabilité de présence du thuya (modèle fictif)\")\ndir.create(\"sorties\", showWarnings = FALSE)\nwriteRaster(carte, \"sorties/sdm_thuya.tif\", overwrite = TRUE)</code></pre>",
     "exercice": "<ol>\n  <li>Quel est l'AUC du modèle sur les données de test ? Relancez avec une autre graine : l'AUC change-t-il beaucoup ?</li>\n  <li>Comparez avec un modèle linéaire généralisé <code>glm(..., family = binomial)</code>.</li>\n  <li>Avec Internet, remplacez les covariables par les variables WorldClim (bio1, bio12) téléchargées au niveau B1.</li>\n</ol>"
    },
    {
     "id": "b5-l2",
     "titre": "Expliquer le modèle : importance, dépendance partielle, explication locale",
     "duree": "40 min",
     "objectifs": [
      "Interpréter l'importance par permutation des variables",
      "Construire des courbes de dépendance partielle et des courbes ICE",
      "Expliquer une prédiction individuelle (approche « et si… »)"
     ],
     "contenu": "\n<p>L'<b>IA explicable</b> (XAI) ouvre la boîte noire. Trois outils simples, que les packages <a href=\"https://modeloriented.github.io/DALEX/\" target=\"_blank\" rel=\"noopener\">DALEX</a> et <code>iml</code> automatisent (valeurs de Shapley, break-down…) :</p>\n<ul>\n  <li><b>importance par permutation</b> : de combien la performance chute si l'on mélange une variable ;</li>\n  <li><b>dépendance partielle</b> (PDP) : effet moyen d'une variable quand les autres restent telles qu'observées ; les courbes <b>ICE</b> montrent cet effet site par site ;</li>\n  <li><b>explication locale</b> : pour un site donné, comment la prédiction change si l'on remplace chaque variable par sa valeur moyenne.</li>\n</ul><pre><code>imp &lt;- sort(importance(rf), decreasing = TRUE); imp\nbarplot(imp, las = 2, main = \"Importance par permutation\")\n\npdp &lt;- function(modele, donnees, variable, n = 25) {\n  grille &lt;- seq(min(donnees[[variable]]), max(donnees[[variable]]), length.out = n)\n  ice &lt;- sapply(grille, function(v) { tmp &lt;- donnees; tmp[[variable]] &lt;- v\n    predict(modele, tmp)$predictions[, \"1\"] })\n  list(x = grille, ice = ice, pdp = colMeans(ice))\n}\ndp &lt;- pdp(rf, d, \"altitude\")\nmatplot(dp$x, t(dp$ice), type = \"l\", lty = 1, col = \"grey80\", xlab = \"Altitude (m)\", ylab = \"Probabilité\")\nlines(dp$x, dp$pdp, lwd = 3, col = \"darkgreen\")\n\n# Explication locale d'un site : contribution approchée de chaque variable\nsite &lt;- d[1, ]; p0 &lt;- as.numeric(predict(rf, site)$predictions[, \"1\"])\ncontrib &lt;- sapply(vars, function(v) { tmp &lt;- site; tmp[[v]] &lt;- mean(d[[v]])\n  p0 - as.numeric(predict(rf, tmp)$predictions[, \"1\"]) })\nround(c(prediction = p0, contrib), 3)</code></pre>",
     "exercice": "<ol>\n  <li>Quelle variable est la plus importante ? Est-ce écologiquement cohérent pour le thuya (espèce thermophile des basses altitudes) ?</li>\n  <li>Tracez la dépendance partielle de la pluie et de la pente.</li>\n  <li>Les courbes ICE sont-elles parallèles ? Sinon, que cela indique-t-il (interactions) ?</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "L'AUC d'un modèle de distribution vaut 0,5. Cela signifie que le modèle…",
     "choix": [
      "ne contient pas de variables",
      "est parfait",
      "surestime toujours",
      "ne fait pas mieux que le hasard"
     ],
     "bonne": 3,
     "explication": "AUC = 0,5 : discrimination nulle ; 1 : discrimination parfaite."
    },
    {
     "question": "L'importance par permutation mesure…",
     "choix": [
      "la corrélation entre variables",
      "le nombre d'arbres",
      "la pente d'une régression",
      "la perte de performance quand on mélange une variable"
     ],
     "bonne": 3,
     "explication": "Si mélanger une variable dégrade beaucoup le modèle, elle est importante."
    },
    {
     "question": "Une courbe de dépendance partielle montre…",
     "choix": [
      "la matrice de confusion",
      "les résidus",
      "la carte de prédiction",
      "l'effet moyen d'une variable sur la prédiction"
     ],
     "bonne": 3,
     "explication": "Moyenne des courbes ICE individuelles."
    },
    {
     "question": "Quel package R propose des outils d'IA explicable (Shapley, break-down) ?",
     "choix": [
      "readr",
      "DALEX",
      "igraph",
      "sf"
     ],
     "bonne": 1,
     "explication": "DALEX (et iml) sont dédiés à l'explication des modèles."
    }
   ]
  },
  {
   "id": "b6",
   "numero": 6,
   "titre": "Occupation et détection imparfaite",
   "echelle": "ψ · p",
   "resume": "Comprendre pourquoi « non détecté » ne veut pas dire « absent », estimer séparément la probabilité d'occupation et la probabilité de détection à partir de passages répétés, et dimensionner un protocole de terrain.",
   "lecons": [
    {
     "id": "b6-l1",
     "titre": "Le modèle d'occupation pas à pas",
     "duree": "45 min",
     "objectifs": [
      "Organiser des détections répétées en matrice sites × passages",
      "Écrire la vraisemblance du modèle d'occupation et l'ajuster avec optim()",
      "Comparer l'occupation estimée à l'occupation naïve"
     ],
     "contenu": "\n<p>Sur le terrain, une espèce présente peut <b>ne pas être détectée</b> (oiseau silencieux, vent, observateur). Si l'on compte seulement les sites où elle a été vue, on <b>sous-estime</b> sa distribution. Le <b>modèle d'occupation</b> (MacKenzie et al., 2002) utilise des <b>passages répétés</b> sur chaque site pour séparer deux probabilités :</p>\n<ul>\n  <li>ψ (psi) : probabilité qu'un site soit <b>occupé</b>, qui dépend de l'habitat (ici le NDVI) ;</li>\n  <li><i>p</i> : probabilité de <b>détecter</b> l'espèce lors d'un passage si elle est là, qui dépend des conditions (ici le vent).</li>\n</ul>\n<p>Pour un site où l'espèce a été vue au moins une fois, la vraisemblance vaut ψ × ∏ p<sup>y</sup>(1 − p)<sup>1 − y</sup>. Pour un site où elle n'a jamais été vue : ψ × ∏(1 − p) + (1 − ψ). Les données : 60 points d'écoute, 3 passages, 8 espèces d'oiseaux des monts de Tlemcen. Les vraies observations d'oiseaux d'Algérie sont consultables sur <a href=\"https://ebird.org\" target=\"_blank\" rel=\"noopener\">eBird</a> et <a href=\"https://www.gbif.org\" target=\"_blank\" rel=\"noopener\">GBIF</a>.</p><pre><code># ---- Niveau B6 : occupation et détection imparfaite ----\nlibrary(dplyr); library(tidyr)\ndet &lt;- read.csv(\"donnees/biodiversite/detections_oiseaux.csv\")\npts &lt;- read.csv(\"donnees/biodiversite/points_ecoute.csv\")\nesp &lt;- \"Cyanistes teneriffae\"            # Mésange maghrébine\nd &lt;- filter(det, ESPECE == esp)\nY &lt;- d |&gt; select(SITE, PASSAGE, DETECTION) |&gt;\n  pivot_wider(names_from = PASSAGE, values_from = DETECTION, names_prefix = \"passage_\")\nV &lt;- d |&gt; select(SITE, PASSAGE, VENT) |&gt;\n  pivot_wider(names_from = PASSAGE, values_from = VENT, names_prefix = \"passage_\")\nsites &lt;- Y$SITE\nY &lt;- as.matrix(Y[, -1]); V &lt;- as.matrix(V[, -1]) - 1.5    # vent centré (échelle 0 à 3)\nzndvi &lt;- as.numeric(scale(pts$ndvi[match(sites, pts$SITE)]))\nhead(Y)\nnaive &lt;- mean(rowSums(Y) &gt; 0); naive     # occupation naïve : proportion de sites avec au moins une détection\n\nnll &lt;- function(par) {                    # moins la log-vraisemblance\n  psi &lt;- plogis(par[1] + par[2] * zndvi)\n  p &lt;- plogis(par[3] + par[4] * V)\n  vu &lt;- apply(p^Y * (1 - p)^(1 - Y), 1, prod)\n  jamais &lt;- rowSums(Y) == 0\n  -sum(log(psi * vu + (1 - psi) * jamais))\n}\nfit &lt;- optim(c(0, 0, 0, 0), nll, method = \"BFGS\", hessian = TRUE)\nest &lt;- data.frame(parametre = c(\"psi: constante\", \"psi: NDVI\", \"p: constante\", \"p: vent\"),\n                  estimation = fit$par, erreur_type = sqrt(diag(solve(fit$hessian))))\nest\npsi_i &lt;- plogis(fit$par[1] + fit$par[2] * zndvi)\nc(occupation_naive = naive, occupation_estimee = mean(psi_i), detection_moyenne = plogis(fit$par[3]))\nplot(pts$ndvi[match(sites, pts$SITE)], psi_i, xlab = \"NDVI\", ylab = \"Probabilité d'occupation\")</code></pre>",
     "exercice": "<ol>\n  <li>De combien l'occupation naïve sous-estime-t-elle l'occupation estimée ?</li>\n  <li>L'effet du vent sur la détection est-il négatif ? Est-il significatif (estimation / erreur type &gt; 2) ?</li>\n  <li>Refaites l'analyse pour le Pic de Levaillant (<i>Picus vaillantii</i>), très discret : que constatez-vous ?</li>\n</ol>"
    },
    {
     "id": "b6-l2",
     "titre": "Cartographier l'occupation et dimensionner le protocole",
     "duree": "35 min",
     "objectifs": [
      "Projeter la probabilité d'occupation sur un raster de covariables",
      "Calculer le nombre de passages nécessaires pour conclure à une absence",
      "Utiliser le package unmarked pour aller plus loin"
     ],
     "contenu": "\n<p>Les coefficients estimés s'appliquent à toute la zone : il suffit de standardiser le raster de NDVI avec la <b>même moyenne et le même écart-type</b> que les données d'ajustement.</p><pre><code>library(terra)\ncov &lt;- rast(\"donnees/biodiversite/covariables_bio.tif\")\nndvi_sites &lt;- pts$ndvi[match(sites, pts$SITE)]\nz &lt;- (cov$ndvi - mean(ndvi_sites)) / sd(ndvi_sites)\npsi_carte &lt;- 1 / (1 + exp(-(fit$par[1] + fit$par[2] * z)))\nplot(psi_carte, main = \"Probabilité d'occupation de la Mésange maghrébine (fictif)\")\ndir.create(\"sorties\", showWarnings = FALSE)\nwriteRaster(psi_carte, \"sorties/occupation_mesange.tif\", overwrite = TRUE)\n\n# Combien de passages pour être sûr à 95 % qu'un site sans détection est vide ?\np_moy &lt;- plogis(fit$par[3])\nK &lt;- 1:10\nproba_detecter &lt;- 1 - (1 - p_moy)^K\nplot(K, proba_detecter, type = \"b\", ylim = c(0, 1), xlab = \"Nombre de passages\",\n     ylab = \"P(détection au moins une fois | présente)\"); abline(h = 0.95, lty = 2)\nmin(K[proba_detecter &gt;= 0.95])</code></pre>\n<p>Pour vos projets, le package <a href=\"https://cran.r-project.org/package=unmarked\" target=\"_blank\" rel=\"noopener\">unmarked</a> ajuste ce modèle et de nombreuses variantes (plusieurs saisons, abondance N-mixture, faux positifs). La syntaxe <code>~ détection ~ occupation</code> est la même que dans notre fonction (code non exécuté sur notre serveur de test) :</p><pre><code>if (requireNamespace(\"unmarked\", quietly = TRUE)) {\n  umf &lt;- unmarked::unmarkedFrameOccu(y = Y, siteCovs = data.frame(ndvi = zndvi),\n                                     obsCovs = list(vent = V))\n  m &lt;- unmarked::occu(~ vent ~ ndvi, data = umf)\n  print(m)\n}</code></pre>",
     "exercice": "<ol>\n  <li>Combien de passages faudrait-il pour la Mésange maghrébine ? pour le Pic de Levaillant ?</li>\n  <li>Comparez la carte d'occupation à la carte du NDVI : où concentrer les efforts de conservation ?</li>\n  <li>Si vous installez <code>unmarked</code>, vérifiez que ses estimations sont identiques à celles de <code>optim()</code>.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Dans un modèle d'occupation, p représente…",
     "choix": [
      "la probabilité d'occupation",
      "la proportion de sites visités",
      "la p-valeur",
      "la probabilité de détecter l'espèce lors d'un passage si elle est présente"
     ],
     "bonne": 3,
     "explication": "ψ = occupation ; p = détection conditionnelle à la présence."
    },
    {
     "question": "Pourquoi faut-il des passages répétés sur chaque site ?",
     "choix": [
      "pour augmenter le NDVI",
      "parce que GBIF l'exige",
      "pour réduire le nombre de sites",
      "pour séparer la non-détection de l'absence réelle"
     ],
     "bonne": 3,
     "explication": "La répétition informe sur la probabilité de détection."
    },
    {
     "question": "L'occupation naïve est en général…",
     "choix": [
      "inférieure à l'occupation réelle",
      "égale à p",
      "supérieure à l'occupation réelle",
      "égale à 1"
     ],
     "bonne": 0,
     "explication": "Les sites occupés mais jamais détectés sont comptés comme vides."
    },
    {
     "question": "Avec p = 0,4 par passage, la probabilité de détecter au moins une fois en 3 passages est…",
     "choix": [
      "0,4³ ≈ 0,06",
      "1 − 0,6³ ≈ 0,78",
      "3 × 0,4 = 1,2",
      "0,4"
     ],
     "bonne": 1,
     "explication": "1 − (1 − p)^K."
    }
   ]
  },
  {
   "id": "b7",
   "numero": 7,
   "titre": "ADN environnemental et modélisation",
   "echelle": "ψ · θ · p",
   "resume": "Comprendre la chaîne de l'ADN environnemental (prélèvement, extraction, PCR, métabarcoding), structurer des détections hiérarchiques et ajuster un modèle d'occupation multi-échelle bayésien avec JAGS.",
   "lecons": [
    {
     "id": "b7-l1",
     "titre": "De la mare à la donnée : la structure hiérarchique de l'ADNe",
     "duree": "35 min",
     "objectifs": [
      "Décrire les étapes d'une étude par ADN environnemental",
      "Organiser les détections par mare, échantillon d'eau et réplicat PCR",
      "Calculer la sensibilité cumulée d'un protocole"
     ],
     "contenu": "\n<p>Les organismes laissent de l'ADN dans l'eau, le sol ou l'air (mucus, cellules, excréments). En filtrant quelques litres d'eau d'une mare et en amplifiant l'ADN par <b>PCR</b>, on peut détecter des espèces discrètes comme les amphibiens, sans les capturer. Avec le <b>métabarcoding</b>, on identifie toutes les espèces d'un groupe en comparant les séquences à des bases de référence (<a href=\"https://www.ncbi.nlm.nih.gov/genbank/\" target=\"_blank\" rel=\"noopener\">GenBank</a>, <a href=\"https://boldsystems.org\" target=\"_blank\" rel=\"noopener\">BOLD</a>).</p>\n<p>La détection est imparfaite à <b>deux niveaux</b> : l'ADN peut être présent dans la mare sans être capturé dans un échantillon (θ), et présent dans l'échantillon sans être amplifié lors d'un réplicat PCR (<i>p</i>). Nos données : 40 mares, 3 échantillons d'eau par mare, 4 réplicats PCR par échantillon, 4 amphibiens d'Afrique du Nord.</p><pre><code># ---- Niveau B7 : ADN environnemental ----\nlibrary(dplyr)\nedna &lt;- read.csv(\"donnees/biodiversite/edna_amphibiens.csv\")\nmares &lt;- read.csv(\"donnees/biodiversite/mares.csv\")\nhead(edna)\n# Détection au niveau de la mare (au moins un réplicat positif)\nedna |&gt; group_by(ESPECE, MARE) |&gt; summarise(det = max(DETECTION), .groups = \"drop\") |&gt;\n  group_by(ESPECE) |&gt; summarise(mares_positives = sum(det), occupation_naive = mean(det))\n# Proportion de réplicats PCR positifs dans les échantillons positifs\nedna |&gt; group_by(ESPECE, MARE, ECHANTILLON) |&gt; filter(max(DETECTION) == 1) |&gt;\n  group_by(ESPECE) |&gt; summarise(p_pcr_brut = mean(DETECTION))\n\n# Sensibilité d'un protocole : J échantillons et K réplicats\nsensibilite &lt;- function(theta, p, J, K) 1 - (1 - theta * (1 - (1 - p)^K))^J\nouter(1:5, 1:8, function(J, K) round(sensibilite(0.5, 0.55, J, K), 2))   # lignes : J ; colonnes : K</code></pre>",
     "exercice": "<ol>\n  <li>Quelle espèce a l'occupation naïve la plus faible ?</li>\n  <li>Avec θ = 0,5 et p = 0,55, quel protocole (J échantillons, K réplicats) atteint 95 % de sensibilité au moindre coût, si un échantillon coûte 3 fois plus qu'un réplicat ?</li>\n  <li>Cherchez sur <a href=\"https://www.gbif.org/species/search?q=Pleurodeles%20nebulosus\" target=\"_blank\" rel=\"noopener\">GBIF</a> les occurrences du Triton d'Algérie (<i>Pleurodeles nebulosus</i>).</li>\n</ol>"
    },
    {
     "id": "b7-l2",
     "titre": "Modèle d'occupation multi-échelle bayésien (JAGS)",
     "duree": "45 min",
     "objectifs": [
      "Écrire un modèle hiérarchique à trois niveaux en langage BUGS",
      "Ajuster le modèle avec rjags et vérifier la convergence",
      "Interpréter ψ, θ et p et l'effet des covariables de la mare"
     ],
     "contenu": "\n<p>Le modèle multi-échelle (Nichols et al., 2008 ; Dorazio et Erickson, 2018) s'écrit avec trois variables latentes emboîtées :</p>\n<ul>\n  <li>z<sub>i</sub> ~ Bernoulli(ψ<sub>i</sub>) : la mare <i>i</i> est occupée ;</li>\n  <li>a<sub>ij</sub> ~ Bernoulli(z<sub>i</sub> θ) : l'échantillon <i>j</i> contient l'ADN ;</li>\n  <li>y<sub>ijk</sub> ~ Bernoulli(a<sub>ij</sub> p) : le réplicat PCR <i>k</i> est positif.</li>\n</ul>\n<p>ψ dépend de la durée de mise en eau de la mare (hydropériode) et de la présence de bétail. Les packages <a href=\"https://cran.r-project.org/package=eDNAoccupancy\" target=\"_blank\" rel=\"noopener\">eDNAoccupancy</a> et <code>msocc</code> proposent ce modèle prêt à l'emploi.</p><div class=\"astuce\"><b>Installer JAGS :</b> les modèles bayésiens de ce niveau utilisent le logiciel libre <a href=\"https://sourceforge.net/projects/mcmc-jags/\" target=\"_blank\" rel=\"noopener\">JAGS</a> (à installer une fois sur Windows, comme un programme) puis le package <code>rjags</code> (<code>install.packages(\"rjags\")</code>). Les calculs prennent de quelques secondes à une minute.</div><pre><code>library(rjags)\nesp &lt;- \"Pleurodeles nebulosus\"\ne &lt;- filter(edna, ESPECE == esp)\nN &lt;- nrow(mares); J &lt;- 3; K &lt;- 4\ny &lt;- array(NA, c(N, J, K))\ny[cbind(match(e$MARE, mares$MARE), e$ECHANTILLON, e$REPLICAT_PCR)] &lt;- e$DETECTION\nmodele &lt;- \"\nmodel {\n  for (i in 1:N) {\n    logit(psi[i]) &lt;- a0 + a1 * hydro[i] + a2 * betail[i]\n    z[i] ~ dbern(psi[i])\n    for (j in 1:J) {\n      a[i, j] ~ dbern(z[i] * theta)\n      for (k in 1:K) { y[i, j, k] ~ dbern(a[i, j] * p) }\n    }\n  }\n  a0 ~ dnorm(0, 0.4); a1 ~ dnorm(0, 0.4); a2 ~ dnorm(0, 0.4)\n  theta ~ dbeta(1, 1); p ~ dbeta(1, 1)\n  mares_occupees &lt;- sum(z[])\n}\"\ndonnees &lt;- list(y = y, N = N, J = J, K = K, betail = mares$betail,\n                hydro = as.numeric(scale(mares$hydroperiode_mois)))\ninits &lt;- function() list(z = rep(1, N), a = matrix(1, N, J))\nset.seed(7)\njm &lt;- jags.model(textConnection(modele), data = donnees, inits = inits, n.chains = 3, quiet = TRUE)\nupdate(jm, 1000)                                       # chauffe (burn-in)\npost &lt;- coda.samples(jm, c(\"a0\", \"a1\", \"a2\", \"theta\", \"p\", \"mares_occupees\"), n.iter = 3000)\nsummary(post)$quantiles\ngelman.diag(post)                                      # R-hat proche de 1 : convergence\nplot(post[, c(\"a1\", \"theta\", \"p\")])</code></pre>",
     "exercice": "<ol>\n  <li>Comparez le nombre de mares occupées estimé (médiane et intervalle) au nombre de mares positives observées.</li>\n  <li>L'hydropériode a-t-elle un effet positif ? La probabilité a posteriori P(a1 &gt; 0) se calcule avec <code>mean(as.matrix(post)[, \"a1\"] &gt; 0)</code>.</li>\n  <li>Refaites le modèle pour <i>Discoglossus pictus</i> et comparez θ et p entre les deux espèces.</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Dans le modèle multi-échelle de l'ADNe, θ est la probabilité…",
     "choix": [
      "d'une erreur de séquençage",
      "qu'un réplicat PCR soit positif",
      "que l'ADN soit présent dans un échantillon d'eau d'une mare occupée",
      "qu'une mare soit occupée"
     ],
     "bonne": 2,
     "explication": "ψ : mare ; θ : échantillon ; p : réplicat PCR."
    },
    {
     "question": "Le métabarcoding permet…",
     "choix": [
      "d'identifier plusieurs espèces à partir d'un seul échantillon grâce à des bases de séquences de référence",
      "de mesurer le NDVI",
      "de compter les individus à vue",
      "de géoréférencer une carte"
     ],
     "bonne": 0,
     "explication": "Les séquences sont comparées à GenBank, BOLD ou des bases locales."
    },
    {
     "question": "Dans JAGS, à quoi sert la fonction gelman.diag() ?",
     "choix": [
      "tracer une carte",
      "installer JAGS",
      "vérifier la convergence des chaînes MCMC (R-hat)",
      "calculer l'AUC"
     ],
     "bonne": 2,
     "explication": "Un R-hat proche de 1 indique que les chaînes ont convergé."
    },
    {
     "question": "Augmenter le nombre de réplicats PCR améliore surtout…",
     "choix": [
      "la qualité de l'eau",
      "la détection dans un échantillon qui contient l'ADN",
      "le nombre de mares",
      "l'occupation réelle des mares"
     ],
     "bonne": 1,
     "explication": "Les réplicats agissent sur 1 − (1 − p)^K."
    }
   ]
  },
  {
   "id": "b8",
   "numero": 8,
   "titre": "Modèles joints de distribution d'espèces (JSDM)",
   "echelle": "Hmsc · JAGS",
   "resume": "Passer des modèles espèce par espèce (SDM empilés) aux modèles joints qui estiment à la fois les réponses à l'environnement et les co-occurrences résiduelles entre espèces, avec un modèle à facteurs latents bayésien.",
   "lecons": [
    {
     "id": "b8-l1",
     "titre": "Des SDM empilés aux co-occurrences",
     "duree": "35 min",
     "objectifs": [
      "Ajuster un modèle par espèce (SDM empilés) avec glm()",
      "Distinguer co-occurrence brute et co-occurrence résiduelle",
      "Comprendre l'intérêt d'un modèle joint"
     ],
     "contenu": "\n<p>Les espèces d'une communauté répondent à l'environnement (altitude, pluie) mais aussi les unes aux autres (compétition, facilitation) ou à des facteurs <b>non mesurés</b>. Deux espèces peuvent co-occurrer simplement parce qu'elles aiment la même altitude : c'est une co-occurrence « environnementale ». Le <b>JSDM</b> (Joint Species Distribution Model) modélise toutes les espèces ensemble et estime ce qui reste une fois l'environnement pris en compte : les <b>corrélations résiduelles</b>. Nos données : présence-absence de 10 plantes ligneuses sur 120 sites.</p><pre><code># ---- Niveau B8 : JSDM ----\nsites &lt;- read.csv(\"donnees/biodiversite/sites_bio.csv\")\npa &lt;- read.csv(\"donnees/biodiversite/presences_plantes.csv\")\nY &lt;- as.matrix(pa[, -1]); colnames(Y) &lt;- sub(\"_\", \" \", colnames(Y))\nX &lt;- data.frame(altitude = scale(sites$altitude)[, 1], pluie = scale(sites$pluie)[, 1],\n                pente = scale(sites$pente)[, 1])\ncolMeans(Y)                                            # prévalence de chaque espèce\nco_brute &lt;- cor(Y)                                     # co-occurrence brute\n# SDM empilés : un GLM probit par espèce\nsdm &lt;- lapply(seq_len(ncol(Y)), function(j)\n  glm(Y[, j] ~ altitude + pluie + pente, data = X, family = binomial(\"probit\")))\ncoefs &lt;- t(sapply(sdm, coef)); rownames(coefs) &lt;- colnames(Y); round(coefs, 2)\nres &lt;- sapply(sdm, residuals, type = \"pearson\")        # résidus de chaque espèce\nco_resid &lt;- cor(res); dimnames(co_resid) &lt;- dimnames(co_brute)\nround(co_resid[1:5, 1:5], 2)\nheatmap(co_resid, symm = TRUE, col = hcl.colors(21, \"Blue-Red 3\"), main = \"Corrélations résiduelles (approx.)\")</code></pre>",
     "exercice": "<ol>\n  <li>Quelles espèces augmentent avec l'altitude ? Lesquelles diminuent ?</li>\n  <li>Trouvez une paire d'espèces avec une forte co-occurrence brute mais une faible corrélation résiduelle : comment l'expliquer ?</li>\n  <li>Pourquoi les résidus de GLM séparés ne suffisent-ils pas pour estimer proprement les corrélations ?</li>\n</ol>"
    },
    {
     "id": "b8-l2",
     "titre": "Un JSDM bayésien à facteurs latents",
     "duree": "50 min",
     "objectifs": [
      "Écrire un modèle probit multivarié à facteurs latents en langage BUGS",
      "Imposer les contraintes d'identifiabilité des facteurs",
      "Calculer et cartographier la matrice des corrélations résiduelles"
     ],
     "contenu": "\n<p>Pour <i>S</i> espèces, une matrice de corrélation compte <i>S(S − 1)/2</i> paramètres. Les <b>facteurs latents</b> (Warton et al., 2015 ; Ovaskainen et al., 2017) la résument : chaque site reçoit des scores <i>u</i> (des variables environnementales « cachées ») et chaque espèce des chargements λ. La corrélation résiduelle vient de Λ Λ<sup>T</sup>. C'est le principe de <a href=\"https://www.helsinki.fi/en/researchgroups/statistical-ecology/software/hmsc\" target=\"_blank\" rel=\"noopener\">Hmsc</a>, <code>jSDM</code>, <code>gllvm</code> et <code>boral</code>.</p><div class=\"astuce\"><b>Installer JAGS :</b> les modèles bayésiens de ce niveau utilisent le logiciel libre <a href=\"https://sourceforge.net/projects/mcmc-jags/\" target=\"_blank\" rel=\"noopener\">JAGS</a> (à installer une fois sur Windows, comme un programme) puis le package <code>rjags</code> (<code>install.packages(\"rjags\")</code>). Les calculs prennent de quelques secondes à une minute.</div><pre><code>library(rjags)\nmodele &lt;- \"\nmodel {\n  for (i in 1:N) {\n    for (f in 1:F) { u[i, f] ~ dnorm(0, 1) }\n    for (j in 1:S) {\n      eta[i, j] &lt;- inprod(X[i, ], beta[j, ]) + inprod(u[i, ], lambda[j, ])\n      Y[i, j] ~ dbern(phi(eta[i, j]))\n    }\n  }\n  for (j in 1:S) { for (k in 1:P) { beta[j, k] ~ dnorm(0, 0.5) } }\n  # contraintes d'identifiabilité (2 facteurs)\n  lambda[1, 1] ~ dnorm(0, 1) T(0, ); lambda[1, 2] &lt;- 0\n  lambda[2, 1] ~ dnorm(0, 1);        lambda[2, 2] ~ dnorm(0, 1) T(0, )\n  for (j in 3:S) { for (f in 1:F) { lambda[j, f] ~ dnorm(0, 1) } }\n}\"\nXm &lt;- cbind(1, as.matrix(X))\ndonnees &lt;- list(Y = Y, X = Xm, N = nrow(Y), S = ncol(Y), P = ncol(Xm), F = 2)\nset.seed(8)\njm &lt;- jags.model(textConnection(modele), data = donnees, n.chains = 2, quiet = TRUE)\nupdate(jm, 1000)\npost &lt;- coda.samples(jm, c(\"beta\", \"lambda\"), n.iter = 2000, thin = 2)\nm &lt;- as.matrix(post)\n# corrélations résiduelles : moyenne a posteriori de cov2cor(Lambda Lambda' + I)\nS &lt;- ncol(Y)\nR &lt;- Reduce(`+`, lapply(seq_len(nrow(m)), function(t) {\n  L &lt;- matrix(m[t, grep(\"^lambda\", colnames(m))], S, 2)\n  cov2cor(L %*% t(L) + diag(S)) })) / nrow(m)\ndimnames(R) &lt;- list(colnames(Y), colnames(Y))\nround(R[1:5, 1:5], 2)\nheatmap(R, symm = TRUE, col = hcl.colors(21, \"Blue-Red 3\"), main = \"JSDM : corrélations résiduelles\")\n# Effets de l'altitude (2e colonne de beta) : médiane a posteriori\nb_alt &lt;- apply(m[, sprintf(\"beta[%d,2]\", 1:S)], 2, median); names(b_alt) &lt;- colnames(Y)\nround(sort(b_alt), 2)</code></pre>",
     "exercice": "<ol>\n  <li>Comparez les corrélations résiduelles du JSDM à celles des GLM séparés (leçon 1).</li>\n  <li>Quelles paires d'espèces sont associées positivement une fois l'environnement pris en compte ? négativement ?</li>\n  <li>Une corrélation résiduelle prouve-t-elle une interaction biologique ? Discutez (facteurs non mesurés, échelle).</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Que modélise un JSDM en plus d'un SDM classique ?",
     "choix": [
      "le NDVI",
      "les doublons GBIF",
      "les corrélations résiduelles entre espèces",
      "uniquement la température"
     ],
     "bonne": 2,
     "explication": "Le JSDM estime conjointement les réponses à l'environnement et les co-occurrences résiduelles."
    },
    {
     "question": "À quoi servent les facteurs latents dans un JSDM ?",
     "choix": [
      "résumer la matrice de corrélation entre espèces avec peu de paramètres",
      "calculer la pente",
      "projeter en UTM",
      "remplacer les données de présence"
     ],
     "bonne": 0,
     "explication": "Σ ≈ Λ Λᵀ avec quelques facteurs."
    },
    {
     "question": "Deux espèces co-occurrent souvent mais leur corrélation résiduelle est nulle. C'est probablement parce que…",
     "choix": [
      "elles sont en compétition",
      "le modèle n'a pas convergé",
      "les données sont fausses",
      "elles répondent de la même façon aux variables environnementales"
     ],
     "bonne": 3,
     "explication": "Leur co-occurrence s'explique par l'environnement commun."
    },
    {
     "question": "Quel package R est la référence pour les JSDM hiérarchiques ?",
     "choix": [
      "ggplot2",
      "sf",
      "readxl",
      "Hmsc"
     ],
     "bonne": 3,
     "explication": "Hmsc (Hierarchical Modelling of Species Communities)."
    }
   ]
  },
  {
   "id": "b9",
   "numero": 9,
   "titre": "Modèles bayésiens multi-espèces et spatio-temporels",
   "echelle": "JAGS · mgcv",
   "resume": "Ajuster un modèle hiérarchique bayésien d'occupation de communauté (8 espèces d'oiseaux) pour estimer la richesse corrigée de la détection, puis modéliser l'évolution spatio-temporelle d'une population (2010-2024) et quantifier l'incertitude des tendances.",
   "lecons": [
    {
     "id": "b9-l1",
     "titre": "Modèle hiérarchique multi-espèces (occupation de communauté)",
     "duree": "50 min",
     "objectifs": [
      "Comprendre l'emprunt de force (partial pooling) entre espèces",
      "Ajuster un modèle d'occupation de communauté avec JAGS",
      "Estimer la richesse spécifique de chaque site en tenant compte de la détection"
     ],
     "contenu": "\n<p>Le modèle d'occupation de communauté (Dorazio et Royle, 2005 ; Kéry et Royle, 2016) ajuste <b>toutes les espèces à la fois</b>. Les paramètres de chaque espèce (ψ, p, effet du NDVI) sont tirés d'une distribution <b>commune</b> à la communauté : les espèces rares, peu détectées, « empruntent » de l'information aux espèces communes. On obtient alors la <b>richesse vraie</b> de chaque site (somme des z), corrigée de la détection imparfaite. Le package <a href=\"https://www.jeffdoser.com/files/spoccupancy-web/\" target=\"_blank\" rel=\"noopener\">spOccupancy</a> ajoute la dimension spatiale.</p><div class=\"astuce\"><b>Installer JAGS :</b> les modèles bayésiens de ce niveau utilisent le logiciel libre <a href=\"https://sourceforge.net/projects/mcmc-jags/\" target=\"_blank\" rel=\"noopener\">JAGS</a> (à installer une fois sur Windows, comme un programme) puis le package <code>rjags</code> (<code>install.packages(\"rjags\")</code>). Les calculs prennent de quelques secondes à une minute.</div><pre><code># ---- Niveau B9 : modèles bayésiens multi-espèces et spatio-temporels ----\nlibrary(rjags)\ndet &lt;- read.csv(\"donnees/biodiversite/detections_oiseaux.csv\")\npts &lt;- read.csv(\"donnees/biodiversite/points_ecoute.csv\")\nespeces &lt;- sort(unique(det$ESPECE)); sites &lt;- pts$SITE\nN &lt;- length(sites); K &lt;- 3; S &lt;- length(especes)\ny &lt;- array(NA, c(N, K, S))\ny[cbind(match(det$SITE, sites), det$PASSAGE, match(det$ESPECE, especes))] &lt;- det$DETECTION\nvent &lt;- matrix(NA, N, K); vent[cbind(match(det$SITE, sites), det$PASSAGE)] &lt;- det$VENT - 1.5\nmodele &lt;- \"\nmodel {\n  mu_a0 ~ dnorm(0, 0.4); mu_a1 ~ dnorm(0, 0.4); mu_b0 ~ dnorm(0, 0.4); b1 ~ dnorm(0, 0.4)\n  sd_a0 ~ dunif(0, 3); sd_a1 ~ dunif(0, 3); sd_b0 ~ dunif(0, 3)\n  for (s in 1:S) {\n    a0[s] ~ dnorm(mu_a0, pow(sd_a0, -2))      # occupation propre à l'espèce\n    a1[s] ~ dnorm(mu_a1, pow(sd_a1, -2))      # effet du NDVI propre à l'espèce\n    b0[s] ~ dnorm(mu_b0, pow(sd_b0, -2))      # détection propre à l'espèce\n    for (i in 1:N) {\n      logit(psi[i, s]) &lt;- a0[s] + a1[s] * ndvi[i]\n      z[i, s] ~ dbern(psi[i, s])\n      for (k in 1:K) {\n        logit(p[i, k, s]) &lt;- b0[s] + b1 * vent[i, k]\n        y[i, k, s] ~ dbern(z[i, s] * p[i, k, s])\n      }\n    }\n  }\n  for (i in 1:N) { richesse[i] &lt;- sum(z[i, ]) }\n}\"\ndonnees &lt;- list(y = y, vent = vent, ndvi = as.numeric(scale(pts$ndvi)), N = N, K = K, S = S)\ninits &lt;- function() list(z = matrix(1, N, S))\nset.seed(9)\njm &lt;- jags.model(textConnection(modele), data = donnees, inits = inits, n.chains = 3, quiet = TRUE)\nupdate(jm, 1000)\npost &lt;- coda.samples(jm, c(\"mu_a1\", \"sd_a1\", \"a1\", \"b0\", \"richesse\"), n.iter = 2000)\nm &lt;- as.matrix(post)\na1 &lt;- apply(m[, sprintf(\"a1[%d]\", 1:S)], 2, quantile, c(0.025, 0.5, 0.975))\ncolnames(a1) &lt;- especes; round(t(a1), 2)                 # effet du NDVI par espèce\nrich_obs &lt;- apply(y, 1, function(t) sum(apply(t, 2, max)))\nrich_est &lt;- apply(m[, sprintf(\"richesse[%d]\", 1:N)], 2, median)\nplot(rich_obs, rich_est, xlab = \"Richesse observée\", ylab = \"Richesse estimée\"); abline(0, 1, lty = 2)</code></pre>",
     "exercice": "<ol>\n  <li>Quelles espèces sont favorisées par un NDVI élevé (intervalle à 95 % au-dessus de 0) ? Lesquelles évitent la végétation dense ?</li>\n  <li>Pourquoi la richesse estimée est-elle toujours supérieure ou égale à la richesse observée ?</li>\n  <li>Cartographiez la richesse estimée des points d'écoute avec <code>sf</code> (coordonnées X, Y).</li>\n</ol>"
    },
    {
     "id": "b9-l2",
     "titre": "Modèle spatio-temporel et incertitude des tendances",
     "duree": "45 min",
     "objectifs": [
      "Modéliser des comptages répétés dans l'espace et le temps avec un lissage tensoriel",
      "Simuler la distribution a posteriori des prédictions",
      "Cartographier la tendance 2010-2024 et la probabilité de déclin"
     ],
     "contenu": "\n<p>Les suivis à long terme (comptages annuels sur des points fixes) posent deux questions : <b>où</b> la population change-t-elle, et avec quelle <b>certitude</b> ? Un modèle additif généralisé (GAM) avec un lissage <code>te(X, Y, ANNEE)</code> permet une surface qui évolue dans le temps. Les lissages pénalisés de <code>mgcv</code> ont une interprétation <b>bayésienne</b> (effets aléatoires gaussiens) : la matrice <code>Vp</code> est la covariance a posteriori des coefficients, ce qui permet de simuler des prédictions et de calculer des probabilités. Pour des modèles entièrement bayésiens, voir <a href=\"https://www.r-inla.org\" target=\"_blank\" rel=\"noopener\">R-INLA</a> (champs spatiaux SPDE), <code>sdmTMB</code> et <code>spOccupancy</code>. Données réelles de suivis d'oiseaux : <a href=\"https://www.gbif.org\" target=\"_blank\" rel=\"noopener\">GBIF</a>, <a href=\"https://ebird.org/science/status-and-trends\" target=\"_blank\" rel=\"noopener\">eBird Status and Trends</a>.</p><pre><code>library(mgcv); library(terra)\nsuivi &lt;- read.csv(\"donnees/biodiversite/suivi_perdrix_2010_2024.csv\")   # Perdrix gambra, fictif\nhead(suivi)\ngam_st &lt;- gam(COMPTAGE ~ te(X, Y, ANNEE, d = c(2, 1), k = c(12, 5)), family = nb(),\n              data = suivi, method = \"REML\")\nsummary(gam_st)\n\n# Grille de prédiction à 1 km pour 2010 et 2024\ngrille &lt;- rast(ext(640000, 660000, 3830000, 3850000), resolution = 1000, crs = \"EPSG:32630\")\nxy &lt;- as.data.frame(crds(grille)); names(xy) &lt;- c(\"X\", \"Y\")\nnd &lt;- rbind(cbind(xy, ANNEE = 2010), cbind(xy, ANNEE = 2024))\nXp &lt;- predict(gam_st, nd, type = \"lpmatrix\")\nset.seed(10)\nB &lt;- MASS::mvrnorm(500, coef(gam_st), vcov(gam_st))     # tirages a posteriori des coefficients\neta &lt;- Xp %*% t(B)                                      # log-abondance, 500 simulations\nn &lt;- nrow(xy)\nevol &lt;- exp(eta[(n + 1):(2 * n), ]) / exp(eta[1:n, ])   # rapport 2024 / 2010\ntendance &lt;- grille; values(tendance) &lt;- log2(apply(evol, 1, median))\np_declin &lt;- grille; values(p_declin) &lt;- rowMeans(evol &lt; 1)\nplot(tendance, col = hcl.colors(50, \"RdYlBu\"), main = \"log2(abondance 2024 / 2010)\")\nplot(p_declin, col = hcl.colors(50, \"Reds\", rev = TRUE), main = \"Probabilité de déclin\")\ndir.create(\"sorties\", showWarnings = FALSE)\nwriteRaster(c(tendance, p_declin), \"sorties/perdrix_tendance_2010_2024.tif\", overwrite = TRUE)</code></pre>",
     "exercice": "<ol>\n  <li>Dans quelle partie de la zone la Perdrix gambra décline-t-elle ? Avec quelle probabilité ?</li>\n  <li>Prédisez l'abondance pour 2017 et comparez aux comptages observés cette année-là.</li>\n  <li>Pourquoi faut-il être très prudent si l'on prédit 2030 avec ce modèle (extrapolation) ?</li>\n</ol>"
    }
   ],
   "quiz": [
    {
     "question": "Dans un modèle d'occupation de communauté, les espèces rares…",
     "choix": [
      "sont modélisées sans covariables",
      "sont supprimées",
      "ont toujours p = 1",
      "empruntent de l'information aux autres espèces via les distributions communes"
     ],
     "bonne": 3,
     "explication": "C'est l'emprunt de force (partial pooling) des modèles hiérarchiques."
    },
    {
     "question": "La richesse estimée par le modèle de communauté est…",
     "choix": [
      "supérieure ou égale à la richesse observée",
      "indépendante de la détection",
      "égale au nombre de passages",
      "toujours inférieure à la richesse observée"
     ],
     "bonne": 0,
     "explication": "Le modèle ajoute les espèces présentes mais non détectées."
    },
    {
     "question": "Dans mgcv, te(X, Y, ANNEE, d = c(2, 1)) représente…",
     "choix": [
      "un modèle d'occupation",
      "trois effets linéaires indépendants",
      "une surface spatiale qui évolue dans le temps",
      "une interaction entre espèces"
     ],
     "bonne": 2,
     "explication": "Produit tensoriel d'un lissage 2D (X, Y) et d'un lissage 1D (année)."
    },
    {
     "question": "Pourquoi simuler des coefficients avec MASS::mvrnorm(…, vcov(gam_st)) ?",
     "choix": [
      "pour changer de projection",
      "pour propager l'incertitude et calculer des probabilités, comme la probabilité de déclin",
      "pour supprimer les valeurs manquantes",
      "pour accélérer le calcul"
     ],
     "bonne": 1,
     "explication": "On obtient une distribution (approx. a posteriori) des prédictions."
    }
   ]
  }
 ]
};
