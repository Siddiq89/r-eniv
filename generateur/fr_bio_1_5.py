from outils import C, lecon, q

SRC = """<div class="astuce"><b>Données du TP :</b> les fichiers de <code>donnees/biodiversite/</code> sont <b>fictifs</b> (valeurs simulées sur le bassin de l'oued Tamda, UTM 30N) mais les noms d'espèces sont réels. Le code « en ligne » de cette leçon (<code>EN_LIGNE &lt;- TRUE</code>) télécharge les vraies données ; il demande une connexion Internet et n'a pas pu être exécuté depuis notre serveur de test : vérifiez-le en salle informatique.</div>"""

B1 = dict(id="b1", numero=1, titre="Données de biodiversité en ligne", echelle="GBIF · OBIS · WorldClim",
  resume="Télécharger des occurrences d'espèces (GBIF, OBIS), des variables climatiques (WorldClim, CHELSA) et des images satellitaires (Copernicus, MODIS) depuis R, puis nettoyer, filtrer et rasteriser les occurrences.",
  lecons=[
  lecon("b1-l1", "Trouver et télécharger des données ouvertes", "35 min",
    ["Connaître les grandes bases de données ouvertes sur la biodiversité et l'environnement",
     "Interroger GBIF et OBIS depuis R avec rgbif et robis",
     "Télécharger les variables climatiques WorldClim avec geodata"],
    """
<p>Les méthodes modernes de l'écologie quantitative (modèles d'occupation, JSDM, modèles bayésiens) ont besoin de <b>données d'observation</b> d'espèces et de <b>variables environnementales</b>. Une grande partie est aujourd'hui <b>ouverte</b> et accessible directement depuis R.</p>
<table class="tab">
<tr><th>Source</th><th>Contenu</th><th>Package R</th></tr>
<tr><td><a href="https://www.gbif.org" target="_blank" rel="noopener">GBIF</a></td><td>Plus de 2 milliards d'occurrences d'espèces (musées, inventaires, sciences participatives), dont l'Algérie</td><td><code>rgbif</code></td></tr>
<tr><td><a href="https://obis.org" target="_blank" rel="noopener">OBIS</a></td><td>Biodiversité marine (côte oranaise, golfe d'Arzew, Ghazaouet)</td><td><code>robis</code></td></tr>
<tr><td><a href="https://www.worldclim.org" target="_blank" rel="noopener">WorldClim</a> / <a href="https://chelsa-climate.org" target="_blank" rel="noopener">CHELSA</a></td><td>Climat actuel et futur (19 variables bioclimatiques, 30 s ≈ 1 km)</td><td><code>geodata</code></td></tr>
<tr><td><a href="https://esa-worldcover.org" target="_blank" rel="noopener">ESA WorldCover</a> / <a href="https://land.copernicus.eu" target="_blank" rel="noopener">Copernicus Land</a></td><td>Occupation du sol à 10 m, indices de végétation</td><td><code>geodata</code>, <code>terra</code></td></tr>
<tr><td><a href="https://modis.ornl.gov" target="_blank" rel="noopener">MODIS (ORNL DAAC)</a></td><td>NDVI 250 m tous les 16 jours depuis 2000 (produit MOD13Q1)</td><td><code>MODISTools</code></td></tr>
<tr><td><a href="https://www.iucnredlist.org" target="_blank" rel="noopener">Liste rouge UICN</a></td><td>Statut de menace des espèces</td><td><code>rredlist</code></td></tr>
</table>
<p>Le principe est le même partout : on décrit <b>quoi</b> (espèce, variable), <b>où</b> (pays, emprise) et <b>quand</b> (années), et le package interroge l'API du site.</p>"""
    + C("""
# ---- Niveau B1 : données de biodiversité en ligne (R ENIV) ----
# Ouvrez le projet TP_R.Rproj : les chemins partent du dossier du projet.
library(sf); library(terra); library(dplyr)
EN_LIGNE <- FALSE   # mettez TRUE en salle informatique (connexion Internet nécessaire)

if (EN_LIGNE) {
  # install.packages(c("rgbif", "robis", "geodata"))
  library(rgbif)
  # Emprise de la wilaya de Tlemcen (longitude / latitude WGS 84)
  emprise <- "POLYGON((-2.25 34.4,-0.85 34.4,-0.85 35.3,-2.25 35.3,-2.25 34.4))"
  thuya <- occ_search(scientificName = "Tetraclinis articulata", country = "DZ",
                      geometry = emprise, hasCoordinate = TRUE, limit = 2000)$data
  # Pour une vraie étude (et une citation DOI), préférez occ_download() avec un compte GBIF
  write.csv(thuya[, c("gbifID","species","decimalLatitude","decimalLongitude","countryCode","year",
                      "basisOfRecord","coordinateUncertaintyInMeters","eventDate")],
            "donnees/biodiversite/occurrences_gbif_reelles.csv", row.names = FALSE)
  # OBIS : biodiversité marine au large de Ghazaouet
  poissons <- robis::occurrence("Sparidae", geometry = "POLYGON((-2.2 35.0,-1.6 35.0,-1.6 35.3,-2.2 35.3,-2.2 35.0))")
  # WorldClim : 19 variables bioclimatiques de l'Algérie à 30 secondes (environ 1 km)
  bio <- geodata::worldclim_country("DZA", var = "bio", res = 0.5, path = "donnees/biodiversite")
}
""")
    + SRC + """
<p>Sans connexion, on travaille sur l'export simulé <code>occurrences_gbif_simulees.csv</code>, qui a <b>exactement les mêmes colonnes</b> qu'un export GBIF : le reste du code fonctionne donc à l'identique sur les vraies données.</p>"""
    + C("""
occ <- read.csv("donnees/biodiversite/occurrences_gbif_simulees.csv")
dim(occ)
table(occ$species)
table(occ$basisOfRecord)
summary(occ$coordinateUncertaintyInMeters)
"""),
    """<ol>
  <li>Sur <a href="https://www.gbif.org/occurrence/search?country=DZ" target="_blank" rel="noopener">gbif.org</a>, cherchez <i>Tetraclinis articulata</i> en Algérie : combien d'occurrences ont des coordonnées ?</li>
  <li>Dans R, chargez <code>occurrences_gbif_simulees.csv</code> et comptez les occurrences par espèce et par décennie (<code>year %/% 10 * 10</code>).</li>
  <li>Quelle proportion des occurrences n'a pas d'incertitude de coordonnées renseignée ?</li>
</ol>"""),
  lecon("b1-l2", "Nettoyer, filtrer et rasteriser les occurrences", "40 min",
    ["Repérer les erreurs classiques des données d'occurrence (coordonnées nulles, inversées, doublons)",
     "Filtrer selon l'incertitude spatiale et le type d'observation",
     "Réduire le biais d'échantillonnage par une grille (thinning) et produire une carte de richesse"],
    """
<p>Les données ouvertes sont précieuses mais <b>brutes</b>. Avant toute modélisation, on applique une chaîne de nettoyage reproductible :</p>
<ul>
  <li>coordonnées <b>manquantes</b> ou égales à <b>(0, 0)</b> ;</li>
  <li><b>signe inversé</b> de la longitude (point qui tombe hors de la zone) ;</li>
  <li><b>doublons</b> (même espèce, mêmes coordonnées, même date) ;</li>
  <li><b>incertitude</b> trop grande par rapport à la résolution de l'analyse (ici &gt; 1 000 m) ;</li>
  <li>spécimens anciens ou fossiles selon la question posée.</li>
</ul>"""
    + C("""
propre <- occ |>
  filter(!is.na(decimalLatitude), !is.na(decimalLongitude),
         !(decimalLatitude == 0 & decimalLongitude == 0)) |>
  distinct(species, decimalLatitude, decimalLongitude, eventDate, .keep_all = TRUE) |>
  filter(is.na(coordinateUncertaintyInMeters) | coordinateUncertaintyInMeters <= 1000,
         year >= 2000)
nrow(occ); nrow(propre)

# Conversion en couche sf puis projection en UTM 30N
pts <- st_as_sf(propre, coords = c("decimalLongitude", "decimalLatitude"), crs = 4326) |>
  st_transform(32630)
zone <- st_read("donnees/tamda.gpkg", layer = "zone_etude", quiet = TRUE)
dedans <- lengths(st_intersects(pts, zone)) > 0
table(dedans)          # les longitudes de signe inversé tombent hors de la zone
pts <- pts[dedans, ]
""")
    + """
<p>Les observations se concentrent souvent près des routes et des villes : c'est le <b>biais d'échantillonnage</b>. Un remède simple consiste à garder <b>une seule occurrence par espèce et par maille</b> (ici 1 km).</p>"""
    + C("""
grille <- rast(ext(640000, 660000, 3830000, 3850000), resolution = 1000, crs = "EPSG:32630")
pts$maille <- cellFromXY(grille, st_coordinates(pts))
amincies <- pts |> group_by(species, maille) |> slice(1) |> ungroup()
nrow(pts); nrow(amincies)

# Richesse spécifique observée par maille de 1 km
rich <- amincies |> st_drop_geometry() |> count(maille, name = "nb_especes")
richesse <- grille; values(richesse) <- NA
richesse[rich$maille] <- rich$nb_especes
plot(richesse, main = "Richesse observée (espèces par km²)")
plot(st_geometry(zone), add = TRUE)
dir.create("sorties", showWarnings = FALSE)
writeRaster(richesse, "sorties/richesse_observee_1km.tif", overwrite = TRUE)
"""),
    """<ol>
  <li>Combien d'occurrences sont supprimées à chaque étape du filtrage ? Faites un petit tableau.</li>
  <li>Refaites le thinning avec une maille de 2 km : combien d'occurrences restent ?</li>
  <li>Exportez les occurrences propres en GeoPackage (<code>st_write</code>) et ouvrez-les dans QGIS ou ArcGIS.</li>
</ol>"""),
  ],
  quiz=[
    q("Quelle base de données rassemble des occurrences d'espèces du monde entier et propose un DOI pour chaque téléchargement ?", ["GBIF", "WorldClim", "MODIS", "OpenStreetMap"], 0, "GBIF (Global Biodiversity Information Facility) agrège les occurrences ; occ_download() fournit un DOI à citer."),
    q("Pourquoi supprimer les points de coordonnées (0, 0) ?", ["Ce sont presque toujours des valeurs manquantes mal codées", "Ils sont dans l'océan Indien", "Ils sont trop précis", "GBIF les interdit"], 0, "Le point (0, 0) est dans le golfe de Guinée : c'est le plus souvent une absence de coordonnées enregistrée comme 0."),
    q("Le « thinning » sur une grille de 1 km sert à…", ["réduire le biais d'échantillonnage en gardant une occurrence par espèce et par maille", "augmenter le nombre d'occurrences", "changer de système de coordonnées", "calculer le NDVI"], 0, "Les zones très prospectées (routes, villes) pèsent moins après amincissement."),
    q("Quel package R télécharge les variables bioclimatiques WorldClim ?", ["geodata", "dplyr", "ggplot2", "readxl"], 0, "geodata::worldclim_country() ou worldclim_global()."),
  ])

B2 = dict(id="b2", numero=2, titre="Télédétection écologique et séries temporelles", echelle="NDVI · terra",
  resume="Analyser une série annuelle de NDVI (2010-2024) : tendance par pixel, test de Mann-Kendall, détection d'une perturbation, puis mesurer la fragmentation du couvert forestier entre deux dates.",
  lecons=[
  lecon("b2-l1", "Séries temporelles de NDVI et tendances", "40 min",
    ["Comprendre le NDVI et les produits satellitaires gratuits (MODIS, Sentinel-2, Landsat)",
     "Calculer une tendance par pixel avec terra::app()",
     "Tester la significativité d'une tendance (Mann-Kendall) et repérer une perturbation"],
    """
<p>Le <b>NDVI</b> (indice de végétation par différence normalisée) se calcule à partir du rouge et du proche infrarouge : <code>NDVI = (PIR − R) / (PIR + R)</code>. Il varie de −1 à 1 ; un sol nu est proche de 0,1, un maquis dense de 0,5 à 0,7. Des séries gratuites existent : <a href="https://lpdaac.usgs.gov/products/mod13q1v061/" target="_blank" rel="noopener">MODIS MOD13Q1</a> (250 m, depuis 2000), <a href="https://dataspace.copernicus.eu" target="_blank" rel="noopener">Sentinel-2</a> (10 m, depuis 2015) et Landsat (30 m, depuis 1984).</p>"""
    + C("""
# ---- Niveau B2 : télédétection écologique ----
library(terra); library(sf)
EN_LIGNE <- FALSE
if (EN_LIGNE) {
  # install.packages("MODISTools")
  # NDVI MODIS 250 m autour du parc national de Tlemcen (série 16 jours)
  m <- MODISTools::mt_subset(product = "MOD13Q1", band = "250m_16_days_NDVI",
         lat = 34.85, lon = -1.35, km_lr = 10, km_ab = 10,
         start = "2010-01-01", end = "2024-12-31", progress = FALSE)
  ndvi_modis <- MODISTools::mt_to_terra(m)   # facteur d'échelle 0.0001
}
ndvi <- rast("donnees/biodiversite/ndvi_2010_2024.tif")   # 15 couches : NDVI maximal annuel (fictif)
ndvi
plot(ndvi[[c(1, 8, 15)]])
moy_zone <- global(ndvi, "mean", na.rm = TRUE)$mean
plot(2010:2024, moy_zone, type = "b", xlab = "Année", ylab = "NDVI moyen")
""")
    + SRC + """
<h4>Tendance par pixel</h4>
<p><code>app()</code> applique une fonction à la série temporelle de <b>chaque pixel</b>. On calcule la pente d'une régression linéaire (unité NDVI par an) et le <b>tau de Kendall</b>, base du test non paramétrique de <b>Mann-Kendall</b>, robuste aux valeurs aberrantes.</p>"""
    + C("""
annees <- 2010:2024
pente_fun <- function(v) if (anyNA(v)) NA else coef(lm(v ~ annees))[2]
tendance <- app(ndvi, pente_fun)
names(tendance) <- "pente_ndvi_an"
mk_fun <- function(v) {
  if (anyNA(v)) return(c(NA, NA))
  t <- suppressWarnings(cor.test(annees, v, method = "kendall"))
  c(t$estimate, t$p.value)
}
mk <- app(ndvi, mk_fun); names(mk) <- c("tau", "p_value")
signif <- ifel(mk$p_value < 0.05, sign(mk$tau), 0)   # -1 baisse, 0 stable, +1 hausse
plot(tendance, col = hcl.colors(50, "RdYlGn"), main = "Tendance du NDVI 2010-2024 (par an)")
plot(signif, col = c("firebrick", "grey85", "forestgreen"), main = "Tendance significative (Mann-Kendall)")
freq(signif)

# Détection d'une perturbation : chute brutale entre deux années consécutives
chute <- min(diff(ndvi))          # plus forte baisse annuelle de chaque pixel
annee_chute <- which.min(diff(ndvi)) + 2010
perturbe <- chute < -0.15
plot(mask(annee_chute, perturbe, maskvalues = 0), main = "Année de la perturbation")
dir.create("sorties", showWarnings = FALSE)
writeRaster(c(tendance, signif), "sorties/tendance_ndvi.tif", overwrite = TRUE)
"""),
    """<ol>
  <li>Quelle part de la zone présente une baisse significative du NDVI ? une hausse ?</li>
  <li>Quelle année correspond à la perturbation du sud-est ? Proposez une explication (incendie, défrichement…).</li>
  <li>Calculez la tendance moyenne par commune avec <code>zonal()</code> et la couche <code>communes</code>.</li>
</ol>"""),
  lecon("b2-l2", "Fragmentation du couvert forestier", "35 min",
    ["Comparer deux cartes de forêt et calculer une matrice de changement",
     "Identifier les taches (patches) de forêt et calculer des métriques paysagères",
     "Interpréter la fragmentation pour la biodiversité"],
    """
<p>La <b>fragmentation</b> découpe un habitat continu en taches plus petites et plus isolées : la surface d'intérieur forestier diminue et les lisières augmentent. L'écologie du paysage la mesure avec des <b>métriques</b> : nombre de taches, surface moyenne, plus grande tache, densité de lisière. Le package <a href="https://r-spatialecology.github.io/landscapemetrics/" target="_blank" rel="noopener">landscapemetrics</a> en calcule plus de 100 ; ici nous calculons les principales nous-mêmes avec <code>terra</code> pour bien les comprendre.</p>"""
    + C("""
f10 <- rast("donnees/biodiversite/foret_2010.tif")
f24 <- rast("donnees/biodiversite/foret_2024.tif")
changement <- f10 * 10 + f24        # 0 = non-forêt stable, 1 = gain, 10 = perte, 11 = forêt stable
freq(changement)
plot(changement, col = c("grey90", "forestgreen", "firebrick", "darkgreen"),
     main = "Changement du couvert forestier 2010-2024")

metriques <- function(f) {
  taches <- patches(f, directions = 8, zeroAsNA = TRUE)
  surf_ha <- freq(taches)$count * prod(res(f)) / 10000
  aire_foret <- sum(surf_ha)
  lisiere <- boundaries(f, inner = TRUE) & f == 1
  long_lisiere_m <- global(lisiere, "sum", na.rm = TRUE)[1, 1] * res(f)[1]
  data.frame(foret_ha = aire_foret, nb_taches = length(surf_ha),
             taille_moyenne_ha = mean(surf_ha), plus_grande_tache_pct = 100 * max(surf_ha) / aire_foret,
             densite_lisiere_m_ha = long_lisiere_m / (ncell(f) * prod(res(f)) / 10000))
}
rbind(`2010` = metriques(f10), `2024` = metriques(f24))
"""),
    """<ol>
  <li>La surface forestière a-t-elle augmenté ou diminué ? Et le nombre de taches ?</li>
  <li>Une forêt peut gagner en surface tout en se fragmentant localement : vérifiez-le en ne gardant que le quart sud-est (<code>crop()</code>).</li>
  <li>Si vous avez Internet, installez <code>landscapemetrics</code> et comparez avec <code>lsm_c_np()</code>, <code>lsm_c_ed()</code> et <code>lsm_c_lpi()</code>.</li>
</ol>"""),
  ],
  quiz=[
    q("Le NDVI se calcule avec…", ["le proche infrarouge et le rouge", "le bleu et le vert", "l'altitude et la pente", "la température et la pluie"], 0, "NDVI = (PIR − R) / (PIR + R)."),
    q("Quelle fonction terra applique une fonction à la série temporelle de chaque pixel ?", ["app()", "crop()", "patches()", "freq()"], 0, "app() parcourt les cellules et applique la fonction aux valeurs des couches."),
    q("Le test de Mann-Kendall est apprécié en télédétection parce qu'il…", ["est non paramétrique et robuste aux valeurs aberrantes", "nécessite des données normales", "ne marche qu'avec Sentinel-2", "calcule le NDVI"], 0, "Il repose sur le rang des valeurs (tau de Kendall)."),
    q("Une forêt plus fragmentée présente en général…", ["plus de taches et plus de lisière", "moins de taches et moins de lisière", "une seule grande tache", "un NDVI plus élevé"], 0, "La fragmentation augmente le nombre de taches et la densité de lisière."),
  ])

B3 = dict(id="b3", numero=3, titre="Diversité bêta et neutralité", echelle="α · β · γ",
  resume="Mesurer la diversité alpha, bêta et gamma, décomposer la diversité bêta en remplacement (turnover) et emboîtement (nestedness), puis confronter les communautés à des modèles nuls et neutres.",
  lecons=[
  lecon("b3-l1", "Diversité alpha, bêta, gamma et décomposition de Baselga", "40 min",
    ["Calculer richesse, indices de Shannon et de Simpson avec vegan",
     "Distinguer diversité alpha, bêta et gamma",
     "Décomposer la diversité bêta en remplacement et emboîtement"],
    """
<p>Whittaker distingue trois échelles : la <b>diversité alpha</b> (dans un relevé), la <b>diversité gamma</b> (dans toute la région) et la <b>diversité bêta</b> (la différence de composition entre relevés). Le fichier <code>communautes_plantes.csv</code> contient 30 relevés de végétation répartis en trois zones (piémont, versant, sommet) le long du gradient d'altitude.</p>"""
    + C("""
# ---- Niveau B3 : diversité bêta et neutralité ----
library(vegan)
com <- read.csv("donnees/biodiversite/communautes_plantes.csv", check.names = FALSE)
ab <- as.matrix(com[, -(1:3)])          # abondances : relevés en lignes, espèces en colonnes
rownames(ab) <- com$RELEVE
alpha <- data.frame(com[, 1:3], richesse = specnumber(ab),
                    shannon = diversity(ab, "shannon"), simpson = diversity(ab, "simpson"))
aggregate(cbind(richesse, shannon) ~ ZONE, data = alpha, FUN = mean)
gamma <- sum(colSums(ab) > 0)
beta_whittaker <- gamma / mean(alpha$richesse)
c(gamma = gamma, alpha_moy = mean(alpha$richesse), beta = beta_whittaker)
""")
    + """
<h4>Remplacement ou emboîtement ?</h4>
<p>Deux communautés peuvent différer parce que des espèces <b>se remplacent</b> (turnover) ou parce que la plus pauvre est un <b>sous-ensemble</b> de la plus riche (emboîtement, nestedness). Avec <i>a</i> espèces communes, <i>b</i> et <i>c</i> espèces propres à chaque relevé, Baselga (2010) propose :</p>
<ul>
  <li>β<sub>sor</sub> = (b + c) / (2a + b + c) : dissimilarité totale de Sørensen ;</li>
  <li>β<sub>sim</sub> = min(b, c) / (a + min(b, c)) : part due au <b>remplacement</b> ;</li>
  <li>β<sub>sne</sub> = β<sub>sor</sub> − β<sub>sim</sub> : part due à l'<b>emboîtement</b>.</li>
</ul>
<p>Le package <a href="https://cran.r-project.org/package=betapart" target="_blank" rel="noopener">betapart</a> fait ce calcul (<code>beta.pair()</code>, <code>beta.multi()</code>) ; voici la version « à la main », utile pour comprendre.</p>"""
    + C("""
pa <- (ab > 0) * 1
baselga <- function(x, y) {
  a <- sum(x & y); b <- sum(x & !y); c <- sum(!x & y)
  sor <- (b + c) / (2 * a + b + c); sim <- min(b, c) / (a + min(b, c))
  c(sorensen = sor, remplacement = sim, emboitement = sor - sim)
}
paires <- combn(nrow(pa), 2)
res <- t(apply(paires, 2, function(k) baselga(pa[k[1], ], pa[k[2], ])))
res <- data.frame(r1 = com$ZONE[paires[1, ]], r2 = com$ZONE[paires[2, ]], res)
res$type <- ifelse(res$r1 == res$r2, "même zone", "zones différentes")
aggregate(cbind(sorensen, remplacement, emboitement) ~ type, data = res, FUN = mean)

# Ordination NMDS de la composition
nmds <- metaMDS(ab, distance = "bray", k = 2, trace = FALSE)
plot(nmds$points, col = factor(com$ZONE), pch = 19, main = "NMDS (Bray-Curtis)")
legend("topright", legend = levels(factor(com$ZONE)), col = 1:3, pch = 19)
adonis2(ab ~ ZONE, data = com, permutations = 499)   # PERMANOVA
"""),
    """<ol>
  <li>Quelle zone a la plus forte diversité de Shannon ?</li>
  <li>Entre zones différentes, la dissimilarité vient-elle surtout du remplacement ou de l'emboîtement ? Interprétez avec le gradient d'altitude.</li>
  <li>Testez <code>betadisper()</code> pour vérifier si la dispersion des relevés diffère entre zones.</li>
</ol>"""),
  lecon("b3-l2", "Modèles nuls et théorie neutre", "35 min",
    ["Ajuster des distributions d'abondance (log-série de Fisher, log-normale de Preston, radfit)",
     "Tester une structure de communauté avec un modèle nul",
     "Simuler une communauté neutre (dérive écologique) et la comparer aux données"],
    """
<p>La <b>théorie neutre</b> de Hubbell (2001) suppose que toutes les espèces sont écologiquement équivalentes : la composition change seulement par <b>dérive</b> (naissances et morts au hasard), immigration et spéciation. C'est une <b>hypothèse nulle</b> : si les données s'en écartent, la niche (altitude, climat) joue un rôle. On commence par les distributions d'abondance classiques.</p>"""
    + C("""
total <- colSums(ab)
fisher <- fisherfit(total[total > 0]); fisher$estimate        # alpha de Fisher
preston <- prestonfit(total[total > 0]); preston
rad <- radfit(total[total > 0]); rad                          # préemption, log-normale, Zipf, Mandelbrot...
plot(rad, main = "Diagrammes rang-abondance")

# Modèle nul : l'emboîtement (NODF) est-il plus fort que le hasard ?
nodf <- oecosimu(pa, nestednodf, method = "r00", nsimul = 199)
nodf$oecosimu$statistic; nodf$oecosimu$pval[3]
""")
    + """
<h4>Une petite simulation neutre</h4>
<p>On simule une communauté locale de taille fixe <i>J</i> : à chaque pas, un individu meurt et il est remplacé par la descendance d'un individu local (probabilité 1 − <i>m</i>) ou par un immigrant tiré du pool régional (probabilité <i>m</i>).</p>"""
    + C("""
simul_neutre <- function(pool, J = 300, m = 0.1, pas = 20000) {
  com <- sample(names(pool), J, replace = TRUE, prob = pool)
  for (t in 1:pas) {
    i <- sample.int(J, 1)
    com[i] <- if (runif(1) < m) sample(names(pool), 1, prob = pool) else com[sample.int(J, 1)]
  }
  table(factor(com, levels = names(pool)))
}
set.seed(1)
pool <- total / sum(total)
neutres <- t(replicate(10, simul_neutre(pool, J = round(mean(rowSums(ab))))))
# Les relevés neutres sont-ils aussi différents entre eux que les vrais relevés ?
c(observe = mean(vegdist(ab)), neutre = mean(vegdist(neutres)))
"""),
    """<ol>
  <li>Quel modèle de <code>radfit</code> a le plus petit AIC ?</li>
  <li>Faites varier l'immigration <code>m</code> (0,01 ; 0,1 ; 0,5) : comment évolue la dissimilarité moyenne des communautés neutres ?</li>
  <li>Concluez : la structure observée est-elle compatible avec la neutralité ou dominée par la niche (altitude) ?</li>
</ol>"""),
  ],
  quiz=[
    q("La diversité gamma correspond à…", ["la diversité de toute la région", "la diversité d'un seul relevé", "la différence entre deux relevés", "l'indice de Simpson"], 0, "Gamma = échelle régionale ; alpha = locale ; bêta = différence entre les deux."),
    q("Dans la décomposition de Baselga, βsim mesure…", ["le remplacement d'espèces (turnover)", "l'emboîtement", "la richesse totale", "l'abondance moyenne"], 0, "βsim = min(b, c) / (a + min(b, c)) est la composante de remplacement."),
    q("Selon la théorie neutre de Hubbell, les espèces…", ["sont écologiquement équivalentes et la composition change par dérive", "occupent toutes une niche différente", "ne migrent jamais", "sont classées par taille"], 0, "C'est une hypothèse nulle de la structure des communautés."),
    q("Que fait oecosimu() de vegan ?", ["compare une statistique observée à sa distribution sous un modèle nul", "télécharge des occurrences", "calcule le NDVI", "dessine une carte"], 0, "Il permute la matrice selon un algorithme nul et calcule une p-valeur."),
  ])

B4 = dict(id="b4", numero=4, titre="Réseaux écologiques multiplexes", echelle="igraph",
  resume="Construire des réseaux d'interactions plantes-pollinisateurs et plantes-herbivores, calculer connectance, emboîtement et modularité, assembler un réseau multiplexe et simuler des extinctions en cascade.",
  lecons=[
  lecon("b4-l1", "Réseaux bipartis d'interactions", "35 min",
    ["Transformer une table d'interactions en matrice et en graphe igraph",
     "Calculer degré, connectance, emboîtement (NODF) et modularité",
     "Identifier les espèces clés du réseau"],
    """
<p>Un <b>réseau d'interactions</b> relie des espèces de deux groupes : des plantes et leurs pollinisateurs, ou des plantes et leurs herbivores. C'est un graphe <b>biparti</b>. Les réseaux de pollinisation sont souvent <b>emboîtés</b> (les spécialistes visitent des plantes déjà visitées par les généralistes) et <b>modulaires</b> (groupes d'espèces qui interagissent surtout entre elles). Des jeux de données réels sont disponibles sur <a href="https://www.web-of-life.es" target="_blank" rel="noopener">Web of Life</a> et <a href="https://www.globalbioticinteractions.org" target="_blank" rel="noopener">GloBI</a> (package <code>rglobi</code>).</p>"""
    + C("""
# ---- Niveau B4 : réseaux écologiques multiplexes ----
library(igraph); library(vegan)
pol <- read.csv("donnees/biodiversite/reseau_pollinisation.csv")
her <- read.csv("donnees/biodiversite/reseau_herbivorie.csv")
head(pol)
M_pol <- xtabs(interactions ~ plante + pollinisateur, data = pol)
M_pol <- unclass(M_pol)
dim(M_pol)
connectance <- sum(M_pol > 0) / length(M_pol)
nodf <- nestednodf(M_pol > 0)$statistic["NODF"]
c(connectance = connectance, NODF = unname(nodf))

g <- graph_from_biadjacency_matrix(M_pol, weighted = TRUE)
V(g)$color <- ifelse(V(g)$type, "gold", "forestgreen")
plot(g, layout = layout_as_bipartite(g), vertex.label.cex = 0.6, vertex.size = 6,
     edge.width = E(g)$weight / 5, main = "Réseau plantes-pollinisateurs")
sort(degree(g)[!V(g)$type], decreasing = TRUE)[1:5]   # plantes les plus visitées
mod <- cluster_louvain(g, weights = E(g)$weight)
modularity(mod); table(membership(mod))
"""),
    """<ol>
  <li>Quelles sont les trois plantes qui reçoivent le plus de pollinisateurs différents ?</li>
  <li>Calculez la connectance et le NODF du réseau d'herbivorie et comparez avec la pollinisation.</li>
  <li>Testez l'emboîtement contre un modèle nul avec <code>oecosimu(M_pol &gt; 0, nestednodf, "r00")</code>.</li>
</ol>"""),
  lecon("b4-l2", "Réseau multiplexe et robustesse aux extinctions", "40 min",
    ["Assembler deux couches d'interactions qui partagent les mêmes plantes",
     "Calculer le degré multiplexe et le coefficient de participation",
     "Simuler la perte de plantes et mesurer la robustesse des communautés animales"],
    """
<p>Dans la nature, une même plante est à la fois pollinisée, broutée, dispersée… Un <b>réseau multiplexe</b> superpose plusieurs <b>couches</b> d'interactions sur les mêmes espèces. On peut alors se demander si les plantes importantes pour les pollinisateurs sont aussi les plus consommées, et ce que la disparition d'une plante (incendie, surpâturage) entraîne dans <b>toutes</b> les couches.</p>"""
    + C("""
M_her <- unclass(xtabs(interactions ~ plante + herbivore, data = her))
plantes <- sort(union(rownames(M_pol), rownames(M_her)))
deg <- data.frame(plante = plantes,
                  pollinisation = rowSums(M_pol > 0)[plantes],
                  herbivorie = rowSums(M_her > 0)[plantes])
deg[is.na(deg)] <- 0
deg$multiplexe <- deg$pollinisation + deg$herbivorie
# Coefficient de participation : 1 = liens répartis entre couches, 0 = une seule couche
deg$participation <- 2 * (1 - ((deg$pollinisation / deg$multiplexe)^2 + (deg$herbivorie / deg$multiplexe)^2))
deg[order(-deg$multiplexe), ]
cor.test(deg$pollinisation, deg$herbivorie, method = "spearman")
""")
    + """
<h4>Extinctions en cascade</h4>
<p>On retire les plantes une à une et on compte les animaux qui n'ont plus aucune plante partenaire (extinctions secondaires). La <b>robustesse</b> R est l'aire sous la courbe de survie (proche de 1 : réseau robuste).</p>"""
    + C("""
robustesse <- function(M, ordre) {
  survie <- sapply(0:nrow(M), function(k) {
    reste <- M[setdiff(rownames(M), ordre[seq_len(k)]), , drop = FALSE]
    mean(colSums(reste) > 0)
  })
  list(survie = survie, R = mean(survie))
}
set.seed(42)
hasard <- replicate(100, robustesse(M_pol, sample(rownames(M_pol)))$R)
plus_connectees <- names(sort(rowSums(M_pol > 0), decreasing = TRUE))
r_cible <- robustesse(M_pol, plus_connectees)
c(hasard = mean(hasard), plus_connectees_d_abord = r_cible$R)
plot(0:nrow(M_pol) / nrow(M_pol), r_cible$survie, type = "s", col = "firebrick",
     xlab = "Proportion de plantes perdues", ylab = "Pollinisateurs survivants")
"""),
    """<ol>
  <li>Quelle plante a le plus fort degré multiplexe ? Est-elle importante dans les deux couches ?</li>
  <li>Calculez la robustesse de la couche herbivorie, puis du réseau multiplexe (animaux des deux couches).</li>
  <li>Quel scénario est le plus grave : perte aléatoire ou perte des plantes les plus connectées ? Quelles conséquences pour la gestion des incendies dans les monts de Tlemcen ?</li>
</ol>"""),
  ],
  quiz=[
    q("Un réseau plantes-pollinisateurs est un graphe…", ["biparti", "orienté acyclique", "planaire", "complet"], 0, "Les liens relient uniquement des plantes à des animaux : deux groupes distincts."),
    q("La connectance d'un réseau est…", ["la proportion des interactions possibles qui sont réalisées", "le nombre d'espèces", "la longueur du plus long chemin", "le degré maximal"], 0, "Connectance = liens réalisés / (nombre de plantes × nombre d'animaux)."),
    q("Un réseau multiplexe…", ["superpose plusieurs types d'interactions entre les mêmes espèces", "ne contient qu'une espèce", "est toujours aléatoire", "remplace les données GBIF"], 0, "Chaque couche est un type d'interaction (pollinisation, herbivorie…)."),
    q("Dans une simulation d'extinctions, la robustesse est plus faible quand on retire d'abord…", ["les plantes les plus connectées", "les plantes les moins connectées", "les animaux", "aucune espèce"], 0, "Les espèces très connectées soutiennent de nombreux partenaires."),
  ])

B5 = dict(id="b5", numero=5, titre="Modèles de distribution et IA explicable", echelle="ranger · XAI",
  resume="Construire un modèle de distribution d'espèce (SDM) par forêt aléatoire, l'évaluer (AUC) et l'expliquer : importance des variables, dépendances partielles, courbes individuelles et explication locale.",
  lecons=[
  lecon("b5-l1", "Un SDM par forêt aléatoire", "40 min",
    ["Associer présences-absences et variables environnementales",
     "Ajuster une forêt aléatoire avec ranger et l'évaluer sur des données de test (AUC)",
     "Prédire et cartographier la probabilité de présence"],
    """
<p>Un <b>modèle de distribution d'espèce</b> (SDM) relie la présence d'une espèce aux conditions du milieu. Les méthodes d'<b>apprentissage automatique</b> (forêt aléatoire, boosting) sont très performantes mais fonctionnent comme des « boîtes noires ». Nous modélisons le <b>thuya de Berbérie</b> (<i>Tetraclinis articulata</i>), arbre emblématique de l'Oranie, à partir de 120 sites d'inventaire.</p>"""
    + C("""
# ---- Niveau B5 : SDM et IA explicable ----
library(ranger); library(terra)
sites <- read.csv("donnees/biodiversite/sites_bio.csv")
pa <- read.csv("donnees/biodiversite/presences_plantes.csv")
d <- merge(sites, pa[, c("SITE", "Tetraclinis_articulata")], by = "SITE")
d$presence <- factor(d$Tetraclinis_articulata, levels = c(0, 1))
vars <- c("altitude", "pente", "tmoy", "pluie", "ndvi")
set.seed(2026)
test <- sample(nrow(d), 36)
rf <- ranger(presence ~ altitude + pente + tmoy + pluie + ndvi, data = d[-test, ],
             probability = TRUE, num.trees = 500, importance = "permutation")
rf
p_test <- predict(rf, d[test, ])$predictions[, "1"]
auc <- function(p, y) { r <- rank(p); n1 <- sum(y == 1); n0 <- sum(y == 0)
  (sum(r[y == 1]) - n1 * (n1 + 1) / 2) / (n1 * n0) }
auc(p_test, d$Tetraclinis_articulata[test])     # 0.5 = hasard, 1 = parfait

cov <- rast("donnees/biodiversite/covariables_bio.tif")
carte <- predict(cov, rf, fun = function(m, ...) predict(m, ...)$predictions[, "1"], na.rm = TRUE)
plot(carte, main = "Probabilité de présence du thuya (modèle fictif)")
dir.create("sorties", showWarnings = FALSE)
writeRaster(carte, "sorties/sdm_thuya.tif", overwrite = TRUE)
"""),
    """<ol>
  <li>Quel est l'AUC du modèle sur les données de test ? Relancez avec une autre graine : l'AUC change-t-il beaucoup ?</li>
  <li>Comparez avec un modèle linéaire généralisé <code>glm(..., family = binomial)</code>.</li>
  <li>Avec Internet, remplacez les covariables par les variables WorldClim (bio1, bio12) téléchargées au niveau B1.</li>
</ol>"""),
  lecon("b5-l2", "Expliquer le modèle : importance, dépendance partielle, explication locale", "40 min",
    ["Interpréter l'importance par permutation des variables",
     "Construire des courbes de dépendance partielle et des courbes ICE",
     "Expliquer une prédiction individuelle (approche « et si… »)"],
    """
<p>L'<b>IA explicable</b> (XAI) ouvre la boîte noire. Trois outils simples, que les packages <a href="https://modeloriented.github.io/DALEX/" target="_blank" rel="noopener">DALEX</a> et <code>iml</code> automatisent (valeurs de Shapley, break-down…) :</p>
<ul>
  <li><b>importance par permutation</b> : de combien la performance chute si l'on mélange une variable ;</li>
  <li><b>dépendance partielle</b> (PDP) : effet moyen d'une variable quand les autres restent telles qu'observées ; les courbes <b>ICE</b> montrent cet effet site par site ;</li>
  <li><b>explication locale</b> : pour un site donné, comment la prédiction change si l'on remplace chaque variable par sa valeur moyenne.</li>
</ul>"""
    + C("""
imp <- sort(importance(rf), decreasing = TRUE); imp
barplot(imp, las = 2, main = "Importance par permutation")

pdp <- function(modele, donnees, variable, n = 25) {
  grille <- seq(min(donnees[[variable]]), max(donnees[[variable]]), length.out = n)
  ice <- sapply(grille, function(v) { tmp <- donnees; tmp[[variable]] <- v
    predict(modele, tmp)$predictions[, "1"] })
  list(x = grille, ice = ice, pdp = colMeans(ice))
}
dp <- pdp(rf, d, "altitude")
matplot(dp$x, t(dp$ice), type = "l", lty = 1, col = "grey80", xlab = "Altitude (m)", ylab = "Probabilité")
lines(dp$x, dp$pdp, lwd = 3, col = "darkgreen")

# Explication locale d'un site : contribution approchée de chaque variable
site <- d[1, ]; p0 <- as.numeric(predict(rf, site)$predictions[, "1"])
contrib <- sapply(vars, function(v) { tmp <- site; tmp[[v]] <- mean(d[[v]])
  p0 - as.numeric(predict(rf, tmp)$predictions[, "1"]) })
round(c(prediction = p0, contrib), 3)
"""),
    """<ol>
  <li>Quelle variable est la plus importante ? Est-ce écologiquement cohérent pour le thuya (espèce thermophile des basses altitudes) ?</li>
  <li>Tracez la dépendance partielle de la pluie et de la pente.</li>
  <li>Les courbes ICE sont-elles parallèles ? Sinon, que cela indique-t-il (interactions) ?</li>
</ol>"""),
  ],
  quiz=[
    q("L'AUC d'un modèle de distribution vaut 0,5. Cela signifie que le modèle…", ["ne fait pas mieux que le hasard", "est parfait", "surestime toujours", "ne contient pas de variables"], 0, "AUC = 0,5 : discrimination nulle ; 1 : discrimination parfaite."),
    q("L'importance par permutation mesure…", ["la perte de performance quand on mélange une variable", "le nombre d'arbres", "la corrélation entre variables", "la pente d'une régression"], 0, "Si mélanger une variable dégrade beaucoup le modèle, elle est importante."),
    q("Une courbe de dépendance partielle montre…", ["l'effet moyen d'une variable sur la prédiction", "la carte de prédiction", "la matrice de confusion", "les résidus"], 0, "Moyenne des courbes ICE individuelles."),
    q("Quel package R propose des outils d'IA explicable (Shapley, break-down) ?", ["DALEX", "readr", "sf", "igraph"], 0, "DALEX (et iml) sont dédiés à l'explication des modèles."),
  ])
