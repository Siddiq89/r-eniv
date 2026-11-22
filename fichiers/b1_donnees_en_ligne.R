# R ENIV — parcours Biodiversité — Niveau 1 : Données de biodiversité en ligne
# Enseignant : BOUHAFSI SIDDIQ. Données FICTIVES (dossier donnees/biodiversite), noms d'espèces réels.
# Ouvrez TP_R.Rproj puis exécutez ce script ligne par ligne (Ctrl + Entrée).

# ==== Leçon b1-l1 : Trouver et télécharger des données ouvertes
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

# ==== Leçon b1-l1 : Trouver et télécharger des données ouvertes
occ <- read.csv("donnees/biodiversite/occurrences_gbif_simulees.csv")
dim(occ)
table(occ$species)
table(occ$basisOfRecord)
summary(occ$coordinateUncertaintyInMeters)

# ==== Leçon b1-l2 : Nettoyer, filtrer et rasteriser les occurrences
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

# ==== Leçon b1-l2 : Nettoyer, filtrer et rasteriser les occurrences
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
