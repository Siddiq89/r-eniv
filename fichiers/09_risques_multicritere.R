# =====================================================================
# R ENIV · Niveau 8 · Cartes de susceptibilité aux risques naturels
# (méthode multicritère pondérée ; données FICTIVES : exercice de méthode)
# =====================================================================
library(terra)
library(sf)
dir.create("sorties", showWarnings = FALSE)

mnt    <- rast("donnees/raster/MNT_50m.tif")
pente  <- terrain(mnt, "slope", unit = "degrees")
expo   <- terrain(mnt, "aspect", unit = "degrees")
oueds  <- vect("donnees/tamda.gpkg", layer = "oueds")
routes <- vect("donnees/tamda.gpkg", layer = "routes")
occup  <- vect("donnees/tamda.gpkg", layer = "occupation_sol")
litho  <- vect("donnees/tamda.gpkg", layer = "lithologie")
communes <- vect("donnees/tamda.gpkg", layer = "communes")

# Fonction utilitaire : reclasser en notes 1 (faible) à 5 (fort)
noter <- function(r, bornes, notes) classify(r, cbind(head(bornes, -1), bornes[-1], notes), include.lowest = TRUE)

# ---- 1. Critères communs ----
dist_oued  <- distance(mnt, oueds)                # distance euclidienne (m)
dist_route <- distance(mnt, routes)
# Hauteur au-dessus de l'oued le plus proche (approche HAND simplifiée)
cellules_oued <- rasterize(oueds, mnt, touches = TRUE)
z_oued <- mask(mnt, cellules_oued)
pts_oued <- as.points(z_oued)
pts_tout <- as.points(mnt)
plus_proche <- nearest(pts_tout, pts_oued)$to_id
hand <- mnt; values(hand) <- values(mnt)[, 1] - values(z_oued)[cells(z_oued)][plus_proche]
hand <- ifel(hand < 0, 0, hand)
# Notes d'occupation du sol : une colonne par risque, puis rasterisation de la colonne
occup$N_INOND <- c(Urbain = 5, "Sol nu" = 4, Agriculture = 3, Parcours = 2, "Forêt" = 1)[occup$TYPE]
occup$N_FEUX  <- c("Forêt" = 5, Parcours = 4, Agriculture = 2, "Sol nu" = 1, Urbain = 1)[occup$TYPE]
occup$N_GLIS  <- c("Sol nu" = 5, Parcours = 4, Agriculture = 3, Urbain = 2, "Forêt" = 1)[occup$TYPE]

# ---- 2. Inondation : distance 35 %, hauteur 25 %, pente 20 %, occupation 20 % ----
n_dist  <- noter(dist_oued, c(0, 100, 250, 500, 1000, Inf), c(5, 4, 3, 2, 1))
n_hand  <- noter(hand,      c(0, 2, 5, 10, 20, Inf),        c(5, 4, 3, 2, 1))
n_pente <- noter(pente,     c(0, 2, 5, 10, 20, 90),         c(5, 4, 3, 2, 1))
n_occ_i <- rasterize(occup, mnt, field = "N_INOND")
inond <- 0.35 * n_dist + 0.25 * n_hand + 0.20 * n_pente + 0.20 * n_occ_i

# ---- 3. Feux de forêt : occupation 35 %, pente 20 %, exposition 15 %, routes 15 %, habitat 15 % ----
n_occ_f <- rasterize(occup, mnt, field = "N_FEUX")
n_pf    <- noter(pente, c(0, 5, 10, 20, 30, 90), c(1, 2, 3, 4, 5))
n_expo  <- classify(expo, rbind(c(0, 45, 1), c(45, 112.5, 2), c(112.5, 157.5, 4), c(157.5, 202.5, 5),
                                c(202.5, 247.5, 4), c(247.5, 315, 2), c(315, 360, 1)), include.lowest = TRUE)
n_route <- noter(dist_route, c(0, 100, 300, 600, 1000, Inf), c(5, 4, 3, 2, 1))
urbain  <- occup[occup$TYPE == "Urbain", ]
n_hab   <- noter(distance(mnt, urbain), c(0, 200, 500, 1000, 2000, Inf), c(5, 4, 3, 2, 1))
feux <- 0.35 * n_occ_f + 0.20 * n_pf + 0.15 * n_expo + 0.15 * n_route + 0.15 * n_hab

# ---- 4. Glissements : pente 40 %, lithologie 30 %, distance aux oueds 15 %, occupation 15 % ----
n_pg   <- noter(pente, c(0, 5, 10, 15, 25, 90), c(1, 2, 3, 4, 5))
n_lith <- rasterize(litho, mnt, field = "SUSC_GLIS")
n_og   <- noter(dist_oued, c(0, 100, 250, 500, 1000, Inf), c(5, 4, 3, 2, 1))
n_occ_g <- rasterize(occup, mnt, field = "N_GLIS")
gliss <- 0.40 * n_pg + 0.30 * n_lith + 0.15 * n_og + 0.15 * n_occ_g

# ---- 5. Classer en 5 niveaux et valider avec les événements observés ----
cinq <- function(r) {
  q <- global(r, fun = quantile, probs = c(0.2, 0.4, 0.6, 0.8), na.rm = TRUE)
  classify(r, c(-Inf, unlist(q), Inf), include.lowest = TRUE) + 1
}
cartes <- c(cinq(inond), cinq(feux), cinq(gliss))
names(cartes) <- c("inondation", "feux", "glissements")
plot(cartes, col = c("#1a9641", "#a6d96a", "#ffffbf", "#fdae61", "#d7191c"))

foyers <- vect("donnees/tamda.gpkg", layer = "foyers_incendies")
gl     <- vect("donnees/tamda.gpkg", layer = "glissements")
crues  <- vect("donnees/tamda.gpkg", layer = "laisses_crues")
table(extract(cartes$feux, foyers)[, 2])          # les feux tombent-ils dans les classes 4-5 ?
table(extract(cartes$glissements, gl)[, 2])
table(extract(cartes$inondation, crues)[, 2])

# ---- 6. Synthèse multirisque et part de surface très exposée par commune ----
synthese <- max(cartes)
plot(synthese, main = "Classe de susceptibilité maximale (1 à 5)")
tres_fort <- synthese >= 5
part <- zonal(tres_fort, rasterize(communes, mnt, field = "NOM"), fun = "mean", na.rm = TRUE)
part$PART_PCT <- round(100 * part[, 2], 1)
part[order(-part$PART_PCT), c("NOM", "PART_PCT")]

writeRaster(cartes, "sorties/susceptibilite_risques.tif", overwrite = TRUE)
writeRaster(synthese, "sorties/synthese_multirisque.tif", overwrite = TRUE)
