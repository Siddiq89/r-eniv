# =====================================================================
# R ENIV · Niveau 8 · Raster et MNT avec terra
# Packages : install.packages(c("terra", "sf"))
# =====================================================================
library(terra)
library(sf)
dir.create("sorties", showWarnings = FALSE)

# 1. Lire et décrire le MNT
mnt <- rast("donnees/raster/MNT_50m.tif")
mnt
res(mnt); ext(mnt); crs(mnt, describe = TRUE)$code
global(mnt, c("min", "max", "mean"), na.rm = TRUE)
hist(mnt, main = "Altitudes", xlab = "m")
plot(mnt, col = terrain.colors(50), main = "MNT 50 m")

# 2. Analyse de terrain
pente <- terrain(mnt, v = "slope", unit = "degrees")
expo  <- terrain(mnt, v = "aspect", unit = "degrees")
ombre <- shade(terrain(mnt, "slope", unit = "radians"), terrain(mnt, "aspect", unit = "radians"), angle = 45, direction = 315)
plot(ombre, col = grey(0:100 / 100), legend = FALSE, main = "Ombrage")
plot(mnt, col = terrain.colors(50, alpha = 0.5), add = TRUE)

# 3. Reclassification : classes de pente
m <- matrix(c(0, 5, 1,  5, 15, 2,  15, 25, 3,  25, 90, 4), ncol = 3, byrow = TRUE)
classes_pente <- classify(pente, m, include.lowest = TRUE)
levels(classes_pente) <- data.frame(id = 1:4, classe = c("0-5°", "5-15°", "15-25°", "> 25°"))
plot(classes_pente, col = c("#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"))
freq(classes_pente)

# 4. Calculatrice raster
haut <- mnt > 800                       # TRUE / FALSE
etage <- ifel(mnt < 600, 1, ifel(mnt < 900, 2, 3))

# 5. Découper et masquer avec une commune
communes <- vect("donnees/shapefiles/Communes.shp")
tamda <- communes[communes$NOM == "Tamda", ]
mnt_tamda <- mask(crop(mnt, tamda), tamda)
plot(mnt_tamda)

# 6. Extraire des valeurs aux forages et statistiques zonales par commune
forages <- vect("donnees/shapefiles/Forages.shp")
v <- extract(c(mnt, pente), forages)
head(cbind(forages$ID_FOR, v))
alt_com <- zonal(mnt, rasterize(communes, mnt, field = "NOM"), fun = "mean", na.rm = TRUE)
alt_com
communes$PENTE_MOY <- extract(pente, communes, fun = mean, na.rm = TRUE)[, 2]

# 7. Exporter
writeRaster(pente, "sorties/pente_deg.tif", overwrite = TRUE)
writeRaster(classes_pente, "sorties/classes_pente.tif", overwrite = TRUE)
