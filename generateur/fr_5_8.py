from outils import C, lecon, q

N5 = dict(id="r5", numero=5, titre="Statistiques pour l'environnement", echelle="1:50 000",
  resume="Statistique descriptive, normalité, tests de comparaison (Student, Wilcoxon, ANOVA, khi-deux), corrélation, régression linéaire et tendance des séries climatiques.",
  lecons=[
  lecon("r5-l1", "Statistique descriptive", "30 min",
    ["Calculer les indicateurs de position et de dispersion",
     "Résumer une variable par groupe",
     "Interpréter moyenne, médiane, écart-type et coefficient de variation"],
    """
<p>Avant tout test, on <b>décrit</b> les données : position (moyenne, médiane), dispersion (écart-type, quartiles) et forme (histogramme).</p>
""" + C("""
library(dplyr)
qualite <- read.csv2("donnees/tables/qualite_eau_forages.csv", encoding = "UTF-8")
x <- qualite$NITRATES_MGL

summary(x)                     # min, quartiles, moyenne, max
mean(x); median(x)
sd(x); var(x)                  # écart-type, variance
IQR(x)                         # écart interquartile
quantile(x, c(0.1, 0.9))       # déciles
cv <- 100 * sd(x) / mean(x)    # coefficient de variation (%)
""") + """
<p>Par groupe, avec dplyr :</p>
""" + C("""
qualite |>
  group_by(CAMPAGNE) |>
  summarise(n = n(), moyenne = mean(NITRATES_MGL), mediane = median(NITRATES_MGL),
            ecart_type = sd(NITRATES_MGL), depasse_50 = sum(NITRATES_MGL > 50))
table(qualite$NITRATES_MGL > 50, qualite$CAMPAGNE)   # tableau croisé
""") + """
<div class="astuce"><b>Moyenne ou médiane ?</b> Si quelques valeurs extrêmes tirent la moyenne (une crue exceptionnelle, un forage très pollué), la médiane décrit mieux la valeur « typique ». Un CV &gt; 30 % indique une forte variabilité, fréquente pour la pluie en climat méditerranéen.</div>""",
    """<ol>
  <li>Décrivez la conductivité (COND_USCM) : moyenne, médiane, écart-type, CV.</li>
  <li>Comparez ces indicateurs entre hautes et basses eaux.</li>
  <li>Calculez la pluie annuelle de chaque station puis son CV : quelle station est la plus irrégulière ?</li>
</ol>"""),
  lecon("r5-l2", "Tests de comparaison", "35 min",
    ["Vérifier la normalité (Shapiro-Wilk, diagramme quantile-quantile)",
     "Comparer deux moyennes : test de Student, apparié ou non, et Wilcoxon",
     "Comparer plusieurs groupes (ANOVA, Kruskal-Wallis) et tester une indépendance (khi-deux)"],
    """
<p>Un test statistique répond à une question du type « la différence observée peut-elle être due au hasard ? ». On lit la <b>p-value</b> : si p &lt; 0,05, on rejette l'hypothèse nulle (pas de différence) au risque de 5 %.</p>
""" + C("""
shapiro.test(qualite$NITRATES_MGL)          # p > 0,05 : normalité acceptable
qqnorm(qualite$NITRATES_MGL); qqline(qualite$NITRATES_MGL)

# Les mêmes forages mesurés deux fois : test APPARIÉ
hautes <- qualite |> filter(CAMPAGNE == "Hautes eaux") |> arrange(ID_FOR)
basses <- qualite |> filter(CAMPAGNE == "Basses eaux") |> arrange(ID_FOR)
t.test(basses$NITRATES_MGL, hautes$NITRATES_MGL, paired = TRUE)
wilcox.test(basses$NITRATES_MGL, hautes$NITRATES_MGL, paired = TRUE)   # version non paramétrique
""") + """
<p>Plus de deux groupes : ANOVA (paramétrique) ou Kruskal-Wallis. Deux variables qualitatives : khi-deux.</p>
""" + C("""
forages <- read.csv("donnees/tables/forages_attributs.csv", encoding = "UTF-8")
d <- hautes |> left_join(forages, by = "ID_FOR")
summary(aov(NITRATES_MGL ~ ETAT, data = d))
kruskal.test(NITRATES_MGL ~ ETAT, data = d)

feux <- read.csv("donnees/tables/feux_inventaire.csv", encoding = "UTF-8")
tab <- table(feux$OCCUP, feux$CAUSE); tab
chisq.test(tab, simulate.p.value = TRUE)   # petits effectifs : p-value simulée
""") + """
<table class="list"><tr><th>Situation</th><th>Paramétrique</th><th>Non paramétrique</th></tr>
<tr><td>2 groupes indépendants</td><td><code>t.test(x, y)</code></td><td><code>wilcox.test(x, y)</code></td></tr>
<tr><td>2 mesures sur les mêmes individus</td><td><code>t.test(x, y, paired = TRUE)</code></td><td><code>wilcox.test(..., paired = TRUE)</code></td></tr>
<tr><td>3 groupes ou plus</td><td><code>aov()</code></td><td><code>kruskal.test()</code></td></tr>
<tr><td>2 variables qualitatives</td><td colspan="2"><code>chisq.test(table(...))</code></td></tr></table>
<div class="astuce"><b>Significatif ne veut pas dire important :</b> donnez toujours la taille de l'effet (ici, de combien de mg/L les nitrates augmentent en basses eaux), pas seulement la p-value.</div>""",
    """<ol>
  <li>Les nitrates augmentent-ils significativement en basses eaux ? De combien en moyenne (intervalle de confiance) ?</li>
  <li>Même question pour la conductivité.</li>
  <li>Les surfaces brûlées (SURF_HA) diffèrent-elles entre forêt et parcours ? Choisissez le test après avoir regardé la distribution.</li>
</ol>"""),
  lecon("r5-l3", "Corrélation et régression linéaire", "35 min",
    ["Mesurer et tester une corrélation (Pearson, Spearman)",
     "Ajuster un modèle linéaire avec lm() et lire summary()",
     "Vérifier les résidus et faire une prédiction"],
    """
<p>Les nitrates sont-ils plus faibles dans les forages profonds ? On mesure la liaison par le <b>coefficient de corrélation</b> r (de −1 à 1), puis on modélise par une <b>droite de régression</b>.</p>
""" + C("""
cor(d$PROF_M, d$NITRATES_MGL)                       # Pearson
cor.test(d$PROF_M, d$NITRATES_MGL)                  # test de significativité
cor.test(d$PROF_M, d$NITRATES_MGL, method = "spearman")

modele <- lm(NITRATES_MGL ~ PROF_M, data = d)
summary(modele)        # pente, ordonnée à l'origine, R², p-value
coef(modele)
plot(d$PROF_M, d$NITRATES_MGL, pch = 19, xlab = "Profondeur (m)", ylab = "Nitrates (mg/L)")
abline(modele, col = "red", lwd = 2)
""") + """
<p>Lire <code>summary(modele)</code> :</p>
<ul>
  <li><b>Estimate</b> de PROF_M : variation des nitrates pour 1 m de profondeur en plus (négative ici) ;</li>
  <li><b>Pr(&gt;|t|)</b> : p-value de la pente ;</li>
  <li><b>R²</b> (<i>Multiple R-squared</i>) : part de la variabilité expliquée par la profondeur.</li>
</ul>
""" + C("""
par(mfrow = c(2, 2)); plot(modele); par(mfrow = c(1, 1))   # résidus : pas de structure, à peu près normaux
predict(modele, newdata = data.frame(PROF_M = c(50, 150, 250)), interval = "prediction")
modele2 <- lm(NITRATES_MGL ~ PROF_M + COND_USCM, data = d)   # régression multiple
summary(modele2)
""") + """
<div class="astuce"><b>Corrélation n'est pas causalité :</b> la profondeur n'« enlève » pas les nitrates ; les nappes profondes sont simplement mieux protégées des engrais épandus en surface.</div>""",
    """<ol>
  <li>Calculez la corrélation entre conductivité et profondeur. Est-elle significative ?</li>
  <li>Ajustez le modèle <code>NITRATES_MGL ~ PROF_M</code> pour les basses eaux et comparez la pente avec les hautes eaux.</li>
  <li>Prévoyez la teneur en nitrates d'un nouveau forage de 120 m et donnez l'intervalle de prédiction.</li>
</ol>"""),
  lecon("r5-l4", "Tendances des séries climatiques", "30 min",
    ["Construire une série annuelle à partir de données mensuelles",
     "Tester une tendance avec le test de Mann-Kendall",
     "Estimer la pente d'une tendance et la représenter"],
    """
<p>La pluie diminue-t-elle sur le bassin ? On construit d'abord la série des cumuls annuels, puis on teste la tendance. Le <b>test de Mann-Kendall</b>, très utilisé en hydroclimatologie, est un test de corrélation de rang de Kendall entre la variable et le temps.</p>
""" + C("""
pluie  <- read.csv("donnees/tables/pluie_mensuelle.csv")
annuel <- pluie |> group_by(ANNEE) |>
  summarise(P = sum(PLUIE_MM, na.rm = TRUE) / n_distinct(ID_ST))   # moyenne des stations

cor.test(annuel$ANNEE, annuel$P, method = "kendall")   # Mann-Kendall
tendance <- lm(P ~ ANNEE, data = annuel)
coef(tendance)["ANNEE"]          # mm de variation par an
coef(tendance)["ANNEE"] * 10     # par décennie
""") + """
""" + C("""
library(ggplot2)
ggplot(annuel, aes(ANNEE, P)) +
  geom_col(fill = "steelblue") +
  geom_smooth(method = "lm", se = TRUE, colour = "red") +
  geom_hline(yintercept = mean(annuel$P), linetype = "dashed") +
  labs(title = "Pluie annuelle moyenne du bassin (données fictives)", x = NULL, y = "mm")
""") + """
<p>Un indicateur utile pour les sécheresses : l'<b>indice de pluviosité</b> (écart à la moyenne divisé par l'écart-type).</p>
""" + C("""
annuel <- annuel |> mutate(INDICE = (P - mean(P)) / sd(P),
                           TYPE = ifelse(INDICE < 0, "déficitaire", "excédentaire"))
""") + """
<div class="astuce">Quinze ans sont une série courte : un résultat non significatif ne prouve pas l'absence de tendance. Le package <code>trend</code> propose aussi <code>mk.test()</code> et la pente de Sen (<code>sens.slope()</code>). Script complet : <code>scripts/05_statistiques.R</code>.</div>""",
    """<ol>
  <li>Testez la tendance de la température moyenne annuelle (TMOY_C). Combien de °C par décennie ?</li>
  <li>Faites le test de Mann-Kendall station par station : les conclusions sont-elles les mêmes ?</li>
  <li>Représentez l'indice de pluviosité en barres colorées (bleu excédentaire, orange déficitaire).</li>
</ol>"""),
  ],
  quiz=[
    q("Une p-value de 0,002 au seuil de 5 % signifie :", ["On accepte l'hypothèse nulle", "On rejette l'hypothèse nulle", "Le test est invalide", "L'effet est forcément grand"], 1, "p < 0,05 : la différence observée est peu compatible avec le hasard seul."),
    q("Les mêmes 30 forages sont mesurés en hautes et basses eaux. Quel test ?", ["t.test indépendant", "t.test(..., paired = TRUE)", "chisq.test", "cor.test"], 1, "Mesures répétées sur les mêmes individus : test apparié."),
    q("Que mesure le R² d'une régression ?", ["La pente de la droite", "La part de variabilité expliquée par le modèle", "La p-value", "Le nombre d'observations"], 1, "R² varie de 0 à 1."),
    q("Quel test pour une tendance dans une série de pluie annuelle ?", ["Shapiro-Wilk", "Mann-Kendall (Kendall avec le temps)", "Khi-deux", "Kruskal-Wallis"], 1, "Mann-Kendall est un test non paramétrique de tendance monotone."),
    q("Quel indicateur décrit le mieux la valeur typique d'une variable avec quelques valeurs extrêmes ?", ["La moyenne", "La médiane", "Le maximum", "La variance"], 1, "La médiane est robuste aux valeurs extrêmes."),
    q("Pour tester le lien entre deux variables qualitatives (occupation du sol et cause du feu) :", ["cor.test", "t.test", "chisq.test sur un tableau croisé", "lm"], 2, "Le khi-deux teste l'indépendance de deux variables qualitatives."),
  ])

N6 = dict(id="r6", numero=6, titre="Programmer avec R", echelle="1:25 000",
  resume="Conditions, boucles, écriture de fonctions et automatisation : appliquer un traitement à toutes les stations et produire les graphiques en série.",
  lecons=[
  lecon("r6-l1", "Conditions et boucles", "30 min",
    ["Écrire une condition if / else",
     "Utiliser ifelse et case_when sur des vecteurs",
     "Répéter un traitement avec for et while"],
    """
<p>On charge d'abord les packages et les tables utilisés dans tout le niveau :</p>
""" + C("""
library(dplyr)
library(ggplot2)
pluie    <- read.csv("donnees/tables/pluie_mensuelle.csv")
stations <- read.csv("donnees/tables/stations_meteo.csv", encoding = "UTF-8")
qualite  <- read.csv2("donnees/tables/qualite_eau_forages.csv", encoding = "UTF-8")
""") + """
<h4>La condition if / else</h4>
""" + C("""
p_an <- 410
if (p_an < 300) {
  climat <- "aride"
} else if (p_an < 600) {
  climat <- "semi-aride"
} else {
  climat <- "subhumide"
}
climat
""") + """
<p><code>if</code> ne traite qu'<b>une</b> valeur. Pour un vecteur ou une colonne, on utilise <code>ifelse()</code> ou <code>case_when()</code> :</p>
""" + C("""
p <- c(250, 410, 720)
ifelse(p < 300, "aride", "non aride")
dplyr::case_when(p < 300 ~ "aride", p < 600 ~ "semi-aride", TRUE ~ "subhumide")
""") + """
<h4>La boucle for</h4>
""" + C("""
for (s in stations$ID_ST) {
  total <- sum(pluie$PLUIE_MM[pluie$ID_ST == s], na.rm = TRUE) / 15
  cat(s, ":", round(total), "mm/an en moyenne\\n")
}
""") + """
<h4>La boucle while</h4>
""" + C("""
# Combien d'années pour qu'une commune de 10 000 hab. double à +2 % par an ?
pop <- 10000; annees <- 0
while (pop < 20000) {
  pop <- pop * 1.02
  annees <- annees + 1
}
annees
""") + """
<div class="astuce"><b>Boucle ou calcul vectorisé ?</b> En R, préférez les fonctions vectorisées et dplyr quand c'est possible ; gardez les boucles pour répéter des tâches lourdes (lire des fichiers, produire des cartes).</div>""",
    """<ol>
  <li>Écrivez une condition qui affiche « Potable » ou « Non potable » selon une teneur en nitrates.</li>
  <li>Avec <code>case_when</code>, classez toutes les valeurs de <code>qualite$NITRATES_MGL</code> en trois classes.</li>
  <li>Avec une boucle <code>for</code>, affichez pour chaque année 2010-2024 le cumul de pluie de la station S02.</li>
</ol>"""),
  lecon("r6-l2", "Écrire ses propres fonctions", "30 min",
    ["Définir une fonction avec arguments et valeur de retour",
     "Contrôler les entrées avec stop()",
     "Documenter et réutiliser ses fonctions"],
    """
<p>Dès qu'on copie-colle un calcul trois fois, on écrit une <b>fonction</b>. Exemple : l'indice d'aridité de De Martonne, I = P / (T + 10).</p>
""" + C("""
indice_martonne <- function(P, T) {
  # P : pluie annuelle (mm) ; T : température moyenne annuelle (°C)
  if (any(T <= -10)) stop("T doit être supérieure à -10 °C")
  P / (T + 10)
}
indice_martonne(410, 16.5)
indice_martonne(c(465, 584, 626), c(17.5, 16.5, 14.3))   # vectorisée

classer_martonne <- function(I) {
  cut(I, breaks = c(-Inf, 5, 10, 20, 30, Inf),
      labels = c("hyperaride", "aride", "semi-aride", "semi-humide", "humide"))
}
classer_martonne(indice_martonne(410, 16.5))
""") + """
<p>Une fonction peut avoir des <b>valeurs par défaut</b> et renvoyer une liste :</p>
""" + C("""
resume_serie <- function(x, seuil = 50, arrondi = 1) {
  list(moyenne = round(mean(x, na.rm = TRUE), arrondi),
       cv = round(100 * sd(x, na.rm = TRUE) / mean(x, na.rm = TRUE), arrondi),
       n_depasse = sum(x > seuil, na.rm = TRUE))
}
resume_serie(qualite$NITRATES_MGL)
resume_serie(qualite$NITRATES_MGL, seuil = 25)
""") + """
<div class="astuce">Rangez vos fonctions dans un fichier <code>scripts/mes_fonctions.R</code> et chargez-les dans chaque script avec <code>source("scripts/mes_fonctions.R")</code>.</div>""",
    """<ol>
  <li>Écrivez <code>gravelius(perimetre_km, surface_km2)</code> qui renvoie l'indice de compacité Kc = 0,28 × P / √A.</li>
  <li>Écrivez <code>densite(pop, surface)</code> qui refuse une surface nulle ou négative avec <code>stop()</code>.</li>
  <li>Placez-les dans <code>mes_fonctions.R</code> et utilisez-les depuis un autre script avec <code>source()</code>.</li>
</ol>"""),
  lecon("r6-l3", "Automatiser : appliquer et produire en série", "35 min",
    ["Appliquer une fonction à chaque élément avec sapply, lapply et vapply",
     "Produire et enregistrer un graphique par station",
     "Traiter tous les fichiers d'un dossier"],
    """
""" + C("""
cumuls <- sapply(split(pluie$PLUIE_MM, pluie$ID_ST), sum, na.rm = TRUE)
cumuls
moyennes <- lapply(split(pluie, pluie$ID_ST), function(t) mean(t$TMOY_C))
""") + """
<h4>Un graphique par station, enregistré automatiquement</h4>
""" + C("""
library(ggplot2)
dir.create("sorties/graphiques", recursive = TRUE, showWarnings = FALSE)

graphique_station <- function(id) {
  d <- pluie |> filter(ID_ST == id) |> group_by(MOIS) |>
    summarise(P = mean(PLUIE_MM, na.rm = TRUE), T = mean(TMOY_C))
  nom <- stations$NOM[stations$ID_ST == id]
  g <- ggplot(d, aes(MOIS)) +
    geom_col(aes(y = P), fill = "steelblue") +
    geom_line(aes(y = 2 * T), colour = "firebrick", linewidth = 1) +
    scale_x_continuous(breaks = 1:12) +
    labs(title = paste("Station", id, "-", nom), y = "P (mm) et 2T (°C)", x = "Mois")
  fichier <- file.path("sorties/graphiques", paste0("ombro_", id, ".png"))
  ggsave(fichier, g, width = 16, height = 10, units = "cm", dpi = 200)
  fichier
}
vapply(stations$ID_ST, graphique_station, character(1))
""") + """
<h4>Lire tous les CSV d'un dossier</h4>
""" + C("""
fichiers <- list.files("donnees/tables", pattern = "\\\\.csv$", full.names = TRUE)
tailles  <- sapply(fichiers, function(f) nrow(read.csv(f, sep = ifelse(grepl("qualite|population|releves", f), ";", ","))))
tailles
""") + """
<div class="astuce">C'est la même logique que les itérateurs de ModelBuilder ou les boucles ArcPy, mais en quelques lignes. Script complet : <code>scripts/06_fonctions_boucles.R</code>.</div>""",
    """<ol>
  <li>Exécutez <code>scripts/06_fonctions_boucles.R</code> et ouvrez le dossier <code>sorties/graphiques</code>.</li>
  <li>Modifiez la fonction pour ajouter le nombre de mois secs dans le titre.</li>
  <li>Écrivez une boucle qui exporte un CSV de pluie par station (<code>pluie_S01.csv</code>, …).</li>
</ol>"""),
  ],
  quiz=[
    q("Quelle fonction convient pour classer TOUTES les valeurs d'une colonne ?", ["if", "ifelse ou case_when", "while", "stop"], 1, "if ne traite qu'une seule valeur logique."),
    q("Que renvoie une fonction R ?", ["Rien", "La valeur de la dernière expression évaluée (ou return())", "Toujours une liste", "Un graphique"], 1, "La dernière expression évaluée est renvoyée."),
    q("À quoi sert stop() dans une fonction ?", ["À arrêter R", "À interrompre la fonction avec un message d'erreur clair", "À faire une pause", "À sortir d'une boucle sans erreur"], 1, "stop() signale une entrée invalide."),
    q("Que fait sapply(liste, f) ?", ["Applique f à chaque élément et simplifie le résultat en vecteur", "Trie la liste", "Crée une boucle infinie", "Supprime les NA"], 0, "sapply = lapply + simplification."),
    q("Comment réutiliser des fonctions écrites dans un autre fichier ?", ["library(\"mes_fonctions.R\")", "source(\"scripts/mes_fonctions.R\")", "install.packages()", "load()"], 1, "source() exécute le fichier et crée les fonctions."),
  ])

N7 = dict(id="r7", numero=7, titre="Données vectorielles et cartographie avec sf", echelle="1:10 000",
  resume="Lire des shapefiles et des GeoPackages, systèmes de coordonnées et reprojection, points à partir de coordonnées XY, géotraitements (tampon, intersection, jointure spatiale, distances) et cartes thématiques avec ggplot2.",
  lecons=[
  lecon("r7-l1", "Lire et explorer des couches vecteur", "30 min",
    ["Lire un shapefile et une couche de GeoPackage avec st_read",
     "Comprendre l'objet sf : un data frame avec une colonne géométrie",
     "Afficher rapidement une couche"],
    """
<p>Le package <code>sf</code> (<i>simple features</i>) lit les formats SIG courants (shapefile, GeoPackage, GeoJSON, KML…). Une couche devient un <b>data frame</b> ordinaire avec une colonne spéciale <code>geometry</code> : tout ce que vous avez appris sur dplyr s'applique.</p>
""" + C("""
library(sf)
communes <- st_read("donnees/shapefiles/Communes.shp")
st_layers("donnees/tamda.gpkg")                        # couches du GeoPackage
oueds   <- st_read("donnees/tamda.gpkg", layer = "oueds")
forages <- st_read("donnees/tamda.gpkg", layer = "forages")

communes                       # en-tête : type de géométrie, emprise, SCR
class(communes)                # "sf" "data.frame"
st_geometry_type(communes)[1]  # MULTIPOLYGON / POLYGON
st_bbox(communes)              # emprise
st_drop_geometry(communes)     # la table attributaire seule
""") + """
""" + C("""
plot(communes["POP"])                                  # carte rapide colorée par POP
plot(st_geometry(communes), border = "grey40")
plot(st_geometry(oueds), col = "blue", lwd = 2, add = TRUE)
plot(st_geometry(forages), pch = 16, cex = 0.7, add = TRUE)
""") + """
<div class="astuce"><b>GeoPackage ou shapefile ?</b> Un GeoPackage (<code>.gpkg</code>) est un seul fichier qui contient plusieurs couches, sans la limite de 10 caractères des noms de champs ni les fichiers .shx/.dbf/.prj séparés. C'est le format conseillé pour échanger avec QGIS et ArcGIS Pro.</div>""",
    """<ol>
  <li>Lisez toutes les couches de <code>tamda.gpkg</code> et notez pour chacune le type de géométrie et le nombre d'entités.</li>
  <li>Affichez les communes, les routes et les écoles sur une même carte rapide.</li>
  <li>Avec dplyr, gardez les communes urbaines (<code>TYPE == "Urbain"</code>) et affichez-les en rouge.</li>
</ol>"""),
  lecon("r7-l2", "Systèmes de coordonnées et points XY", "30 min",
    ["Lire et définir le système de coordonnées (st_crs, st_set_crs)",
     "Reprojeter une couche avec st_transform",
     "Créer une couche de points à partir d'une table XY avec st_as_sf"],
    """
<p>Les données du bassin sont en <b>WGS 84 / UTM zone 30N</b> (code EPSG <b>32630</b>), le système métrique adapté à l'ouest algérien. Les GPS donnent des longitudes/latitudes en <b>WGS 84</b> (EPSG <b>4326</b>). Les anciennes cartes INCT utilisent <b>Nord Sahara 1959</b>.</p>
""" + C("""
st_crs(communes)              # description complète
st_crs(communes)$epsg         # 32630
communes_wgs <- st_transform(communes, 4326)      # reprojection en degrés
st_bbox(communes_wgs)

# Définir le SCR d'une couche qui n'en a pas (sans déplacer les coordonnées)
# couche <- st_set_crs(couche, 32630)
""") + """
<h4>Des points à partir d'un tableau de coordonnées</h4>
""" + C("""
gps <- read.csv("donnees/tables/releves_gps.csv", sep = ";")
gps_utm <- st_as_sf(gps, coords = c("X", "Y"), crs = 32630)       # coordonnées UTM
gps_wgs <- st_as_sf(gps, coords = c("LON", "LAT"), crs = 4326)    # coordonnées GPS
gps_wgs_utm <- st_transform(gps_wgs, 32630)
max(st_distance(gps_utm, gps_wgs_utm, by_element = TRUE))         # écart : quelques cm

feux <- read.csv("donnees/tables/feux_inventaire.csv", encoding = "UTF-8")
feux_sf <- st_as_sf(feux, coords = c("X", "Y"), crs = 32630)
st_write(feux_sf, "sorties/feux.gpkg", delete_dsn = TRUE)
""") + """
<div class="astuce"><b>Ne confondez pas</b> <code>st_set_crs()</code> (on <i>déclare</i> le système d'une couche qui n'en a pas, comme « Définir une projection ») et <code>st_transform()</code> (on <i>convertit</i> les coordonnées, comme « Projeter »). Attention aussi à l'ordre : <code>coords = c("LON", "LAT")</code>, la longitude d'abord.</div>""",
    """<ol>
  <li>Reprojetez les communes en WGS 84 et vérifiez que les longitudes sont proches de −1,4°.</li>
  <li>Créez la couche des stations météo à partir de <code>stations_meteo.csv</code> et superposez-la aux communes.</li>
  <li>Calculez la distance (en km) entre chaque station et la station S01 avec <code>st_distance</code>.</li>
</ol>"""),
  lecon("r7-l3", "Géotraitements vecteur", "40 min",
    ["Calculer surfaces, longueurs et distances",
     "Créer des zones tampons et des intersections",
     "Faire une jointure spatiale et compter des points par polygone"],
    """
<p>Les outils de la boîte à outils « Analyse » d'un SIG existent dans sf sous forme de fonctions <code>st_...</code>.</p>
""" + C("""
library(dplyr)
routes <- st_read("donnees/tamda.gpkg", layer = "routes")
occup  <- st_read("donnees/tamda.gpkg", layer = "occupation_sol")

# Mesures (les unités viennent du SCR : mètres)
communes <- communes |> mutate(SURF_KM2 = as.numeric(st_area(geometry)) / 1e6,
                               DENSITE  = POP / SURF_KM2)
sum(st_length(oueds))                          # longueur du réseau

# Zone tampon de 250 m autour des oueds, fusionnée
tampon <- st_buffer(oueds, 250) |> st_union()
forages_proches <- forages[st_intersects(forages, tampon, sparse = FALSE)[, 1], ]
nrow(forages_proches)

# Jointure spatiale : la commune de chaque forage
forages_com <- st_join(forages, select(communes, COMMUNE = NOM))
nb <- forages_com |> st_drop_geometry() |> count(COMMUNE, name = "NB_FORAGES")

# Intersection : surface agricole de chaque commune
agri <- occup |> filter(TYPE == "Agriculture") |> st_union()
agri_com <- st_intersection(select(communes, NOM), agri) |>
  mutate(AGRI_KM2 = as.numeric(st_area(geometry)) / 1e6)

# Distance de chaque forage à la route la plus proche
forages$DIST_ROUTE_M <- round(as.numeric(st_distance(forages, st_union(routes))))
""") + """
<table class="list"><tr><th>Outil SIG</th><th>Fonction sf</th></tr>
<tr><td>Zone tampon (Buffer)</td><td><code>st_buffer()</code></td></tr>
<tr><td>Intersecter</td><td><code>st_intersection()</code></td></tr>
<tr><td>Fusionner (Dissolve)</td><td><code>st_union()</code> ou <code>group_by() |&gt; summarise()</code></td></tr>
<tr><td>Découper (Clip)</td><td><code>st_intersection()</code> ou <code>st_crop()</code></td></tr>
<tr><td>Jointure spatiale</td><td><code>st_join()</code></td></tr>
<tr><td>Sélection par emplacement</td><td><code>st_filter()</code>, <code>st_intersects()</code></td></tr>
<tr><td>Centroïdes</td><td><code>st_centroid()</code></td></tr></table>""",
    """<ol>
  <li>Combien d'écoles se trouvent à moins de 500 m d'un oued ? Lesquelles ?</li>
  <li>Calculez pour chaque commune le nombre d'écoles et l'effectif total d'élèves (jointure spatiale + summarise).</li>
  <li>Quelle part (%) de chaque commune est couverte par la forêt ?</li>
</ol>"""),
  lecon("r7-l4", "Cartes thématiques avec ggplot2", "40 min",
    ["Représenter des couches sf avec geom_sf",
     "Réaliser une carte choroplèthe avec étiquettes et légende",
     "Exporter la carte et la couche résultat"],
    """
<p><code>geom_sf()</code> dessine une couche sf dans un ggplot : on superpose les couches comme dans la table des matières d'un SIG, de la plus « basse » à la plus « haute ».</p>
""" + C("""
library(ggplot2)
pop <- read.csv("donnees/tables/population_communes.csv", sep = ";")
communes <- communes |> left_join(pop, by = "CODE") |>
  mutate(CROISS = round(100 * (POP_2020 - POP_2008) / POP_2008, 1))

carte <- ggplot() +
  geom_sf(data = communes, aes(fill = DENSITE), colour = "white") +
  geom_sf(data = oueds, colour = "#1f78b4", linewidth = 0.8) +
  geom_sf(data = forages, aes(shape = ETAT), size = 1.8) +
  geom_sf_text(data = communes, aes(label = NOM), size = 2.6) +
  scale_fill_distiller(palette = "YlOrRd", direction = 1, name = "hab./km²") +
  labs(title = "Bassin de l'oued Tamda (données fictives)",
       subtitle = "Densité de population et forages",
       caption = "Source : TP R ENIV · WGS 84 / UTM 30N", shape = "État du forage") +
  theme_minimal()
carte
ggsave("sorties/carte_densite.png", carte, width = 20, height = 16, units = "cm", dpi = 300)
st_write(communes, "sorties/communes_stats.gpkg", delete_dsn = TRUE)   # à ouvrir dans QGIS / ArcGIS
""") + """
<p>Pour des classes plutôt qu'un dégradé continu, découpez la variable avec <code>cut()</code> et utilisez <code>scale_fill_brewer()</code> :</p>
""" + C("""
communes$CLASSE <- cut(communes$CROISS, breaks = c(0, 15, 25, 35, 50),
                       labels = c("< 15 %", "15-25 %", "25-35 %", "> 35 %"))
ggplot(communes) + geom_sf(aes(fill = CLASSE)) +
  scale_fill_brewer(palette = "Greens", name = "Croissance 2008-2020") + theme_void()
""") + """
<div class="astuce">Pour une échelle graphique et une flèche du nord, installez le package <code>ggspatial</code> : <code>annotation_scale()</code> et <code>annotation_north_arrow()</code>. Pour des cartes interactives, essayez <code>mapview</code> ou <code>leaflet</code>. Script complet : <code>scripts/07_vecteur_sf.R</code>.</div>""",
    """<ol>
  <li>Réalisez la carte du taux de croissance 2008-2020 par commune en 4 classes.</li>
  <li>Ajoutez les écoles avec une taille proportionnelle à l'effectif.</li>
  <li>Exportez la carte en PNG 300 dpi et la couche <code>communes_stats.gpkg</code> ; ouvrez cette dernière dans QGIS ou ArcGIS.</li>
</ol>"""),
  ],
  quiz=[
    q("Qu'est-ce qu'un objet sf ?", ["Une image", "Un data frame avec une colonne de géométrie", "Un raster", "Un fichier Excel"], 1, "Les attributs sont des colonnes ordinaires, la géométrie est dans la colonne geometry."),
    q("Quel est le code EPSG de WGS 84 / UTM zone 30N ?", ["4326", "32630", "32631", "3857"], 1, "4326 = WGS 84 géographique ; 32630 = UTM 30N."),
    q("Quelle fonction CONVERTIT les coordonnées dans un autre système ?", ["st_set_crs()", "st_transform()", "st_crs()", "st_as_sf()"], 1, "st_set_crs déclare seulement le système, sans changer les coordonnées."),
    q("Comment créer des points à partir d'un tableau avec colonnes X et Y ?", ["st_read()", "st_as_sf(tableau, coords = c(\"X\", \"Y\"), crs = 32630)", "st_buffer()", "plot(X, Y)"], 1, "st_as_sf convertit un data frame en couche de points."),
    q("Quelle fonction réalise une jointure spatiale ?", ["left_join()", "st_join()", "st_union()", "merge()"], 1, "left_join joint par une clé attributaire, st_join par la position."),
    q("Dans un ggplot de carte, quelle couche faut-il ajouter en premier ?", ["Les points", "Les étiquettes", "Les polygones de fond", "La légende"], 2, "Les couches s'empilent : la première est dessinée en dessous."),
  ])

N8 = dict(id="r8", numero=8, titre="Raster, MNT et risques naturels avec terra", echelle="1:5 000",
  resume="Lire et analyser un MNT avec terra : pente, exposition, ombrage, reclassification, statistiques zonales, puis cartes de susceptibilité aux inondations, feux de forêt et glissements de terrain par analyse multicritère.",
  lecons=[
  lecon("r8-l1", "Lire et décrire un raster", "30 min",
    ["Lire un MNT avec rast() et décrire sa résolution, son emprise et son SCR",
     "Calculer des statistiques globales et un histogramme",
     "Utiliser la calculatrice raster"],
    """
<p>Le package <code>terra</code> manipule les rasters (MNT, images satellites, cartes de risque). Un raster est une grille de cellules ; chaque cellule porte une valeur (ici une altitude en mètres).</p>
""" + C("""
library(terra)
mnt <- rast("donnees/raster/MNT_50m.tif")
mnt                       # dimensions, résolution, emprise, SCR
res(mnt)                  # 50 x 50 m
ext(mnt)
crs(mnt, describe = TRUE)$code      # "32630"
ncell(mnt)
global(mnt, c("min", "max", "mean"), na.rm = TRUE)
hist(mnt, main = "Altitudes", xlab = "m")
plot(mnt, col = terrain.colors(50), main = "MNT 50 m")
""") + """
<h4>Calculatrice raster</h4>
<p>Les opérations s'appliquent à toutes les cellules, comme la « Calculatrice raster » d'un SIG :</p>
""" + C("""
mnt_km <- mnt / 1000
haut   <- mnt > 800                                   # raster logique
etage  <- ifel(mnt < 600, 1, ifel(mnt < 900, 2, 3))   # trois étages altitudinaux
freq(etage)
communes <- vect("donnees/shapefiles/Communes.shp")   # vect() : couche vecteur pour terra
tamda <- communes[communes$NOM == "Tamda", ]
mnt_tamda <- mask(crop(mnt, tamda), tamda)            # découper puis masquer
plot(mnt_tamda)
""") + """
<div class="astuce"><b>sf ou terra pour les vecteurs ?</b> terra a son propre format vecteur (<code>vect()</code>), plus rapide pour les échanges avec les rasters. On passe de l'un à l'autre avec <code>vect(objet_sf)</code> et <code>sf::st_as_sf(objet_terra)</code>.</div>""",
    """<ol>
  <li>Quelle est l'altitude minimale, maximale et moyenne du bassin ? Quelle surface (km²) se trouve au-dessus de 800 m ? (indice : <code>global(haut, "sum") * 50 * 50 / 1e6</code>)</li>
  <li>Découpez le MNT sur la commune de Taourirt Nath et donnez son altitude moyenne.</li>
  <li>Enregistrez le raster des étages avec <code>writeRaster()</code> dans <code>sorties/</code>.</li>
</ol>"""),
  lecon("r8-l2", "Analyse de terrain : pente, exposition, ombrage", "35 min",
    ["Calculer pente, exposition et ombrage avec terrain() et shade()",
     "Reclasser une pente en classes avec classify()",
     "Extraire des valeurs raster aux points et par commune"],
    """
""" + C("""
pente <- terrain(mnt, v = "slope", unit = "degrees")
expo  <- terrain(mnt, v = "aspect", unit = "degrees")     # 0 = nord, 90 = est...
ombre <- shade(terrain(mnt, "slope", unit = "radians"),
               terrain(mnt, "aspect", unit = "radians"), angle = 45, direction = 315)
plot(ombre, col = grey(0:100 / 100), legend = FALSE)
plot(mnt, col = terrain.colors(50, alpha = 0.5), add = TRUE)   # MNT sur l'ombrage
""") + """
<h4>Reclassification</h4>
<p><code>classify()</code> prend une matrice « de, à, nouvelle valeur » :</p>
""" + C("""
m <- matrix(c( 0,  5, 1,
               5, 15, 2,
              15, 25, 3,
              25, 90, 4), ncol = 3, byrow = TRUE)
classes_pente <- classify(pente, m, include.lowest = TRUE)
levels(classes_pente) <- data.frame(id = 1:4, classe = c("0-5°", "5-15°", "15-25°", "> 25°"))
plot(classes_pente, col = c("#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"))
freq(classes_pente)
""") + """
<h4>Extraire et résumer</h4>
""" + C("""
forages <- vect("donnees/shapefiles/Forages.shp")
v <- extract(c(mnt, pente), forages)                       # altitude et pente de chaque forage
head(cbind(forages$ID_FOR, v))
zonal(mnt, rasterize(communes, mnt, field = "NOM"), fun = "mean", na.rm = TRUE)  # statistiques zonales
communes$PENTE_MOY <- extract(pente, communes, fun = mean, na.rm = TRUE)[, 2]
writeRaster(pente, "sorties/pente_deg.tif", overwrite = TRUE)
""") + """
<div class="astuce">Script complet : <code>scripts/08_raster_terra.R</code>. Les rasters écrits en GeoTIFF s'ouvrent directement dans ArcGIS et QGIS.</div>""",
    """<ol>
  <li>Calculez la part (%) du bassin dans chaque classe de pente.</li>
  <li>Reclassez l'exposition en 4 classes (Nord, Est, Sud, Ouest) et cartographiez-la.</li>
  <li>Quelle commune a la pente moyenne la plus forte ? Les forages en service sont-ils sur des pentes plus faibles ?</li>
</ol>"""),
  lecon("r8-l3", "Inondation : distance, hauteur au-dessus de l'oued", "40 min",
    ["Calculer une distance aux oueds en raster",
     "Approcher la hauteur au-dessus du cours d'eau le plus proche (HAND simplifié)",
     "Combiner des critères notés de 1 à 5 avec des poids"],
    """
<p>Une méthode simple de susceptibilité aux inondations combine des critères notés de 1 (faible) à 5 (fort) et pondérés : <b>distance à l'oued</b> (35 %), <b>hauteur au-dessus de l'oued le plus proche</b> (25 %), <b>pente</b> (20 %) et <b>occupation du sol</b> (20 %). Les poids sont donnés dans <code>tables/poids_multicritere.csv</code>.</p>
""" + C("""
oueds <- vect("donnees/tamda.gpkg", layer = "oueds")
occup <- vect("donnees/tamda.gpkg", layer = "occupation_sol")
dist_oued <- distance(mnt, oueds)                       # mètres

# Hauteur au-dessus de l'oued le plus proche (approche HAND simplifiée)
z_oued   <- mask(mnt, rasterize(oueds, mnt, touches = TRUE))   # altitude des cellules d'oued
pts_oued <- as.points(z_oued)
proche   <- nearest(as.points(mnt), pts_oued)$to_id             # cellule d'oued la plus proche
hand <- mnt
values(hand) <- values(mnt)[, 1] - values(z_oued)[cells(z_oued)][proche]
hand <- ifel(hand < 0, 0, hand)
""") + """
<h4>Noter chaque critère de 1 à 5</h4>
""" + C("""
noter <- function(r, bornes, notes) {
  classify(r, cbind(head(bornes, -1), bornes[-1], notes), include.lowest = TRUE)
}
n_dist  <- noter(dist_oued, c(0, 100, 250, 500, 1000, Inf), c(5, 4, 3, 2, 1))
n_hand  <- noter(hand,      c(0, 2, 5, 10, 20, Inf),        c(5, 4, 3, 2, 1))
n_pente <- noter(pente,     c(0, 2, 5, 10, 20, 90),         c(5, 4, 3, 2, 1))
occup$N_INOND <- c(Urbain = 5, "Sol nu" = 4, Agriculture = 3, Parcours = 2, "Forêt" = 1)[occup$TYPE]
n_occ <- rasterize(occup, mnt, field = "N_INOND")

inond <- 0.35 * n_dist + 0.25 * n_hand + 0.20 * n_pente + 0.20 * n_occ
plot(inond, col = hcl.colors(20, "YlGnBu", rev = TRUE), main = "Susceptibilité aux inondations")
""") + """
<div class="astuce"><b>Valider :</b> les repères de crue observés (<code>laisses_crues</code>) doivent tomber dans les classes fortes : <code>extract(inond, vect("donnees/tamda.gpkg", layer = "laisses_crues"))</code>. Pour une vraie hydrologie (remplissage, directions et accumulation de flux), utilisez le package <code>whitebox</code> ou les outils hydrologie d'ArcGIS / GRASS.</div>""",
    """<ol>
  <li>Reproduisez la carte de susceptibilité aux inondations.</li>
  <li>Changez les poids (par exemple 50 % pour la distance) : les zones fortes changent-elles beaucoup ?</li>
  <li>Combien de repères de crue tombent dans les 20 % de cellules les plus susceptibles ?</li>
</ol>"""),
  lecon("r8-l4", "Feux, glissements et synthèse multirisque", "45 min",
    ["Construire les cartes de susceptibilité aux feux de forêt et aux glissements",
     "Classer en 5 niveaux et valider avec les événements observés",
     "Produire une synthèse multirisque et un bilan par commune"],
    """
<p>On applique la même méthode avec d'autres critères (données <b>fictives</b> : c'est un exercice de méthode, pas une évaluation réelle du risque).</p>
""" + C("""
routes <- vect("donnees/tamda.gpkg", layer = "routes")
litho  <- vect("donnees/tamda.gpkg", layer = "lithologie")

# Feux : occupation 35 %, pente 20 %, exposition 15 %, routes 15 %, habitations 15 %
occup$N_FEUX <- c("Forêt" = 5, Parcours = 4, Agriculture = 2, "Sol nu" = 1, Urbain = 1)[occup$TYPE]
n_occ_f <- rasterize(occup, mnt, field = "N_FEUX")
n_pf    <- noter(pente, c(0, 5, 10, 20, 30, 90), c(1, 2, 3, 4, 5))
n_expo  <- classify(expo, rbind(c(0, 45, 1), c(45, 112.5, 2), c(112.5, 157.5, 4), c(157.5, 202.5, 5),
                                c(202.5, 247.5, 4), c(247.5, 315, 2), c(315, 360, 1)), include.lowest = TRUE)
n_route <- noter(distance(mnt, routes), c(0, 100, 300, 600, 1000, Inf), c(5, 4, 3, 2, 1))
n_hab   <- noter(distance(mnt, occup[occup$TYPE == "Urbain", ]), c(0, 200, 500, 1000, 2000, Inf), c(5, 4, 3, 2, 1))
feux <- 0.35 * n_occ_f + 0.20 * n_pf + 0.15 * n_expo + 0.15 * n_route + 0.15 * n_hab

# Glissements : pente 40 %, lithologie 30 %, distance aux oueds 15 %, occupation 15 %
occup$N_GLIS <- c("Sol nu" = 5, Parcours = 4, Agriculture = 3, Urbain = 2, "Forêt" = 1)[occup$TYPE]
gliss <- 0.40 * noter(pente, c(0, 5, 10, 15, 25, 90), c(1, 2, 3, 4, 5)) +
         0.30 * rasterize(litho, mnt, field = "SUSC_GLIS") +
         0.15 * n_dist + 0.15 * rasterize(occup, mnt, field = "N_GLIS")
""") + """
<h4>Classer, valider, synthétiser</h4>
""" + C("""
cinq <- function(r) {          # 5 classes d'effectifs égaux (quantiles)
  q <- global(r, fun = quantile, probs = c(0.2, 0.4, 0.6, 0.8), na.rm = TRUE)
  classify(r, c(-Inf, unlist(q), Inf), include.lowest = TRUE) + 1
}
cartes <- c(cinq(inond), cinq(feux), cinq(gliss))
names(cartes) <- c("inondation", "feux", "glissements")
plot(cartes, col = c("#1a9641", "#a6d96a", "#ffffbf", "#fdae61", "#d7191c"))

table(extract(cartes$feux, vect("donnees/tamda.gpkg", layer = "foyers_incendies"))[, 2])
table(extract(cartes$glissements, vect("donnees/tamda.gpkg", layer = "glissements"))[, 2])

synthese  <- max(cartes)                         # classe la plus forte des trois
tres_fort <- synthese >= 5
part <- zonal(tres_fort, rasterize(communes, mnt, field = "NOM"), fun = "mean", na.rm = TRUE)
part$PART_PCT <- round(100 * part[, 2], 1)
part[order(-part$PART_PCT), c("NOM", "PART_PCT")]
writeRaster(cartes, "sorties/susceptibilite_risques.tif", overwrite = TRUE)
""") + """
<div class="astuce">Si la méthode est bonne, la majorité des feux et des glissements observés tombent dans les classes 4 et 5. Script complet, testé sur les données du TP : <code>scripts/09_risques_multicritere.R</code>.</div>""",
    """<ol>
  <li>Exécutez <code>scripts/09_risques_multicritere.R</code> et commentez la validation : quelle part des feux tombe en classes 4-5 ?</li>
  <li>Quelle commune a la plus grande part de territoire en classe 5 (synthèse) ? Proposez deux mesures de prévention.</li>
  <li>Réalisez une planche de trois cartes (inondation, feux, glissements) avec ggplot2 (indice : <code>as.data.frame(cartes, xy = TRUE)</code> et <code>geom_raster()</code>), exportée en PNG.</li>
</ol>"""),
  ],
  quiz=[
    q("Quelle fonction lit un raster avec terra ?", ["st_read()", "rast()", "raster.read()", "read.csv()"], 1, "rast() lit GeoTIFF, ASCII et la plupart des formats raster."),
    q("Quelle fonction calcule la pente d'un MNT ?", ["slope(mnt)", "terrain(mnt, v = \"slope\")", "classify(mnt)", "global(mnt)"], 1, "terrain() calcule pente, exposition, rugosité…"),
    q("À quoi sert classify() ?", ["À reprojeter", "À reclasser les valeurs d'un raster selon des intervalles", "À découper", "À lire un fichier"], 1, "C'est l'équivalent de l'outil Reclassification."),
    q("Que fait zonal(mnt, zones, fun = \"mean\") ?", ["Découpe le MNT", "Calcule l'altitude moyenne de chaque zone", "Crée des zones tampons", "Lisse le MNT"], 1, "Statistiques zonales : une valeur par zone."),
    q("Dans une analyse multicritère, que vaut la somme des poids ?", ["5", "100 % (ou 1)", "Le nombre de critères", "Elle n'a pas d'importance"], 1, "Les poids se partagent 100 % de l'importance."),
    q("Comment vérifier qu'une carte de susceptibilité aux feux est cohérente ?", ["En changeant les couleurs", "En vérifiant que les feux observés tombent surtout dans les classes fortes", "En augmentant la résolution", "Ce n'est pas possible"], 1, "On confronte la carte aux événements observés (validation)."),
  ])
