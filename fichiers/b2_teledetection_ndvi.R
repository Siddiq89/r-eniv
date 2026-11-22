# R ENIV — parcours Biodiversité — Niveau 2 : Télédétection écologique et séries temporelles
# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.
# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).

# ==== Leçon b2-l1 : Séries temporelles de NDVI et tendances
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

# ==== Leçon b2-l1 : Séries temporelles de NDVI et tendances
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

# ==== Leçon b2-l2 : Fragmentation du couvert forestier
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
