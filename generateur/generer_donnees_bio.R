# Génère les données FICTIVES du parcours Biodiversité (bassin de l'oued Tamda, UTM 30N)
# Les noms d'espèces sont réels (flore et faune de la région de Tlemcen), les valeurs sont simulées.
# Usage : Rscript generer_donnees_bio.R <dossier TP_R existant>
suppressPackageStartupMessages({library(sf); library(terra)})
out <- commandArgs(TRUE)[1]
set.seed(2026)
db <- file.path(out, "donnees", "biodiversite"); dir.create(db, recursive = TRUE, showWarnings = FALSE)
mnt <- rast(file.path(out, "donnees", "raster", "MNT_50m.tif"))
inv <- function(x) 1 / (1 + exp(-x))
sc <- function(x) as.numeric(scale(x))

# 1. Raster de covariables à 100 m ---------------------------------------
alt <- aggregate(mnt, 2, mean); names(alt) <- "altitude"
pente <- terrain(alt, "slope"); pente <- ifel(is.na(pente), 0, pente); names(pente) <- "pente"
tmoy <- 19.5 - 0.0065 * (alt - 280) ; names(tmoy) <- "tmoy"          # °C, gradient thermique
gy <- init(alt, "y"); gx <- init(alt, "x")
pluie <- 300 + 0.25 * (alt - 280) + 0.008 * (gy - 3830000) - 0.006 * (gx - 640000); names(pluie) <- "pluie"   # plus arrosé au nord-ouest
tmoy <- tmoy - 0.00005 * (gy - 3830000); names(tmoy) <- "tmoy"
xy <- crds(alt, na.rm = FALSE)
bruit <- rast(alt); values(bruit) <- 0
for (k in 1:12) {  # champ spatial lisse
  cx <- runif(1, 640000, 660000); cy <- runif(1, 3830000, 3850000); s <- runif(1, 1500, 4000)
  values(bruit) <- values(bruit) + rnorm(1, 0, 0.12) * exp(-((xy[,1]-cx)^2 + (xy[,2]-cy)^2) / (2*s^2))
}
ndvi_base <- clamp(0.12 + 0.00045 * (alt - 280) + bruit, 0.05, 0.85)
# 15 années d'NDVI maximal annuel (2010-2024) : verdissement au nord, dégradation au sud-est (incendies, pâturage)
tend <- rast(alt); values(tend) <- ifelse(xy[,2] > 3843000, 0.0015, ifelse(xy[,1] > 650000 & xy[,2] < 3838000, -0.012, -0.001))
ndvi <- rast(lapply(0:14, function(t) {
  r <- ndvi_base + tend * t + rnorm(1, 0, 0.02); values(r) <- pmin(pmax(values(r) + rnorm(ncell(r), 0, 0.02), 0), 0.9); r }))
# un incendie en 2017 au sud-est
feu <- (xy[,1]-655000)^2 + (xy[,2]-3835000)^2 < 1800^2
for (t in 8:15) { v <- values(ndvi[[t]]); v[feu] <- v[feu] * (0.45 + 0.07 * (t - 8)); values(ndvi[[t]]) <- pmin(v, 0.9) }
names(ndvi) <- paste0("ndvi_", 2010:2024); time(ndvi) <- as.Date(paste0(2010:2024, "-07-01"))
writeRaster(round(ndvi, 3), file.path(db, "ndvi_2010_2024.tif"), overwrite = TRUE, gdal = "COMPRESS=DEFLATE")
foret <- function(r) { f <- r > 0.42; f <- focal(f, 3, "modal"); names(f) <- "foret"; f }
writeRaster(foret(ndvi[["ndvi_2010"]]), file.path(db, "foret_2010.tif"), overwrite = TRUE, datatype = "INT1U", gdal = "COMPRESS=DEFLATE")
f24 <- foret(ndvi[["ndvi_2024"]])
# défrichements, pistes et coupes entre 2010 et 2024 : la forêt se fragmente
coupe <- rep(FALSE, ncell(f24)); fc <- which(values(f24) == 1)
for (k in 1:40) { c0 <- xy[sample(fc, 1), ]; coupe <- coupe | ((xy[,1]-c0[1])^2 + (xy[,2]-c0[2])^2 < runif(1, 150, 380)^2) }
coupe <- coupe | abs(xy[,2] - (3846000 + 0.4 * (xy[,1] - 650000))) < 60 | abs(xy[,1] - 647000) < 60
v <- values(f24); v[coupe] <- 0; values(f24) <- v
writeRaster(f24, file.path(db, "foret_2024.tif"), overwrite = TRUE, datatype = "INT1U", gdal = "COMPRESS=DEFLATE")
cov <- c(round(alt), round(pente, 1), round(tmoy, 2), round(pluie), round(ndvi[["ndvi_2024"]], 3)); names(cov)[5] <- "ndvi"
writeRaster(cov, file.path(db, "covariables_bio.tif"), overwrite = TRUE, gdal = "COMPRESS=DEFLATE")

# 2. Sites d'inventaire (120 points) ---------------------------------------
n <- 120
S <- data.frame(SITE = sprintf("B%03d", 1:n), X = round(runif(n, 640500, 659500)), Y = round(runif(n, 3830500, 3849500)))
v <- extract(cov, as.matrix(S[, c("X","Y")]))
S <- cbind(S, v); S$foret <- as.integer(S$ndvi > 0.42)
write.csv(S, file.path(db, "sites_bio.csv"), row.names = FALSE)

# 3. Présences-absences de 10 plantes (JSDM, SDM) avec corrélations résiduelles
sp <- c("Tetraclinis_articulata","Quercus_ilex","Quercus_suber","Pinus_halepensis","Juniperus_oxycedrus",
        "Chamaerops_humilis","Pistacia_lentiscus","Olea_europaea","Calicotome_spinosa","Ampelodesmos_mauritanicus")
X <- cbind(1, sc(S$altitude), sc(S$pluie), sc(S$pente))
B <- rbind(c(0.2,-0.3,0.4,-0.8,0.1,0.6,0.5,0.0,-0.2,0.3),   # intercept
           c(-0.9,1.0,0.6,0.2,0.8,-1.0,-0.6,-0.7,0.1,-0.2),  # altitude
           c(-0.3,0.5,1.1,0.0,0.2,-0.4,0.2,-0.2,0.0,0.1),    # pluie
           c(0.6,0.0,-0.3,0.4,0.5,0.2,0.0,-0.3,0.4,0.6))     # pente
L <- cbind(c(0.9,-0.4,-0.5,0.7,0.1,0.6,0.2,-0.3,0.5,0.3), c(0,0.6,0.7,-0.2,0.3,-0.1,0.5,0.2,-0.4,0.1))
eta <- matrix(rnorm(n*2), n, 2)
Z <- X %*% B + eta %*% t(L) + matrix(rnorm(n*10), n, 10)
PA <- (Z > 0) * 1L; colnames(PA) <- sp
write.csv(data.frame(SITE = S$SITE, PA), file.path(db, "presences_plantes.csv"), row.names = FALSE)

# 4. Occurrences « au format GBIF » (export simulé, avec erreurs à nettoyer) -----
crs_utm <- "EPSG:32630"
occ <- do.call(rbind, lapply(1:6, function(j) {
  w <- which(PA[, j] == 1); k <- sample(w, min(length(w), 35), replace = TRUE)
  data.frame(species = gsub("_", " ", sp[j]), X = S$X[k] + round(rnorm(length(k), 0, 150)), Y = S$Y[k] + round(rnorm(length(k), 0, 150)))
}))
ll <- st_coordinates(st_transform(st_as_sf(occ, coords = c("X","Y"), crs = crs_utm), 4326))
occ <- data.frame(gbifID = 4.1e9 + sample(1e6, nrow(occ)), species = occ$species,
  decimalLatitude = round(ll[,2], 5), decimalLongitude = round(ll[,1], 5), countryCode = "DZ",
  year = sample(1995:2024, nrow(occ), TRUE), basisOfRecord = sample(c("HUMAN_OBSERVATION","PRESERVED_SPECIMEN","OCCURRENCE"), nrow(occ), TRUE, c(.75,.15,.10)),
  coordinateUncertaintyInMeters = sample(c(NA, 10, 30, 100, 250, 5000, 20000), nrow(occ), TRUE, c(.2,.25,.25,.15,.08,.04,.03)))
occ$eventDate <- sprintf("%d-%02d-%02d", occ$year, sample(3:6, nrow(occ), TRUE), sample(1:28, nrow(occ), TRUE))
err <- sample(nrow(occ), 12)
occ$decimalLatitude[err[1:3]] <- NA; occ$decimalLatitude[err[4:5]] <- 0; occ$decimalLongitude[err[4:5]] <- 0
occ$decimalLongitude[err[6:7]] <- -occ$decimalLongitude[err[6:7]]     # signe inversé
occ <- rbind(occ, occ[sample(nrow(occ), 15), ])                         # doublons
occ <- occ[sample(nrow(occ)), ]
write.csv(occ, file.path(db, "occurrences_gbif_simulees.csv"), row.names = FALSE, na = "")

# 5. Communautés végétales (abondances) pour la diversité bêta ----------------
esp <- c("Quercus ilex","Quercus suber","Quercus faginea","Tetraclinis articulata","Pinus halepensis","Juniperus oxycedrus",
  "Juniperus phoenicea","Chamaerops humilis","Pistacia lentiscus","Pistacia atlantica","Olea europaea","Phillyrea angustifolia",
  "Rhamnus alaternus","Calicotome spinosa","Genista tricuspidata","Cistus monspeliensis","Cistus salviifolius","Rosmarinus officinalis",
  "Thymus ciliatus","Lavandula stoechas","Erica arborea","Arbutus unedo","Ampelodesmos mauritanicus","Stipa tenacissima","Asparagus acutifolius")
opt <- seq(250, 1250, length.out = length(esp)) + rnorm(length(esp), 0, 60); larg <- runif(length(esp), 120, 320)
R <- data.frame(RELEVE = sprintf("R%02d", 1:30), ZONE = rep(c("Piémont","Versant","Sommet"), each = 10))
R$ALTITUDE <- round(c(runif(10, 300, 550), runif(10, 550, 850), runif(10, 850, 1180)))
ab <- t(sapply(R$ALTITUDE, function(a) rpois(length(esp), 14 * exp(-(a - opt)^2 / (2 * larg^2)))))
colnames(ab) <- esp
write.csv(cbind(R, ab), file.path(db, "communautes_plantes.csv"), row.names = FALSE)

# 6. Réseaux plantes-pollinisateurs et plantes-herbivores --------------------
pl <- c("Cistus monspeliensis","Cistus salviifolius","Rosmarinus officinalis","Thymus ciliatus","Lavandula stoechas","Arbutus unedo",
  "Erica arborea","Calicotome spinosa","Genista tricuspidata","Phillyrea angustifolia","Pistacia lentiscus","Olea europaea")
po <- c("Apis mellifera","Bombus terrestris","Xylocopa violacea","Anthophora sp.","Andrena sp.","Halictus sp.","Lasioglossum sp.",
  "Eristalis tenax","Episyrphus balteatus","Bombylius major","Macroglossum stellatarum","Pieris rapae","Lasiommata megera","Oxythyrea funesta")
he <- c("Capra hircus (chèvre)","Ovis aries (mouton)","Lepus capensis","Sus scrofa","Thaumetopoea pityocampa","Lymantria dispar","Orthoptera spp.","Coléoptères xylophages")
gen <- function(a, b, dens, w) { m <- outer(seq_along(a), seq_along(b), function(i, j) inv(-1.2 + 2.2 * dens[i] + 1.8 * w[j] - 0.15 * abs(i - j)))
  y <- matrix(rpois(length(m), 6 * m) * rbinom(length(m), 1, m), length(a), length(b), dimnames = list(a, b))
  d <- as.data.frame(as.table(y)); names(d) <- c("plante","partenaire","interactions"); d[d$interactions > 0, ] }
dp <- seq(1, 0, length.out = length(pl))
rp <- gen(pl, po, dp, seq(1, 0, length.out = length(po))); names(rp)[2] <- "pollinisateur"
rh <- gen(pl, he, rev(dp) * 0.8, seq(0.9, 0, length.out = length(he))); names(rh)[2] <- "herbivore"
write.csv(rp, file.path(db, "reseau_pollinisation.csv"), row.names = FALSE)
write.csv(rh, file.path(db, "reseau_herbivorie.csv"), row.names = FALSE)

# 7. Détections d'oiseaux : 60 points d'écoute x 3 passages x 8 espèces -------
ois <- c("Alectoris barbara","Picus vaillantii","Cyanistes teneriffae","Sylvia melanocephala","Pycnonotus barbatus",
  "Phoenicurus moussieri","Columba palumbus","Garrulus glandarius")
P <- S[1:60, c("SITE","X","Y","altitude","ndvi","foret")]
a0 <- c(0.3,-0.6,0.4,1.0,0.6,-0.2,0.2,-0.9); a1 <- c(-0.4,1.4,1.0,-0.3,-0.2,-0.8,0.6,1.5)   # effet NDVI
b0 <- c(-0.2,-1.0,0.3,0.6,0.9,-0.4,0.2,-0.6); b1 <- rep(-0.6, 8)                            # effet du vent
zndvi <- sc(P$ndvi)
vent <- matrix(sample(0:3, 60 * 3, TRUE), 60, 3); heure <- matrix(sample(6:10, 60 * 3, TRUE), 60, 3)
D <- NULL
for (s in seq_along(ois)) { z <- rbinom(60, 1, inv(a0[s] + a1[s] * zndvi))
  for (v in 1:3) D <- rbind(D, data.frame(SITE = P$SITE, PASSAGE = v, ESPECE = ois[s], VENT = vent[, v], HEURE = heure[, v],
                                          DETECTION = rbinom(60, 1, z * inv(b0[s] + b1[s] * (vent[, v] - 1.5))))) }
write.csv(D, file.path(db, "detections_oiseaux.csv"), row.names = FALSE)
write.csv(P, file.path(db, "points_ecoute.csv"), row.names = FALSE)

# 8. ADN environnemental : 40 mares x 3 échantillons d'eau x 4 réplicats PCR ---
M <- data.frame(MARE = sprintf("M%02d", 1:40), X = round(runif(40, 641000, 659000)), Y = round(runif(40, 3831000, 3849000)))
M$altitude <- round(extract(alt, as.matrix(M[, c("X","Y")]))[, 1])
M$hydroperiode_mois <- sample(2:9, 40, TRUE); M$betail <- rbinom(40, 1, 0.4)
amph <- list(c("Discoglossus pictus", 0.2, 0.9, 0.8, 0.7), c("Pelophylax saharicus", 1.2, 0.6, 0.85, 0.8),
             c("Sclerophrys mauritanica", -0.2, 0.3, 0.6, 0.6), c("Pleurodeles nebulosus", -1.0, 1.2, 0.5, 0.55))
E <- NULL
for (a in amph) { psi <- inv(as.numeric(a[2]) + as.numeric(a[3]) * sc(M$hydroperiode_mois) - 0.5 * M$betail)
  z <- rbinom(40, 1, psi)
  for (e in 1:3) { ae <- rbinom(40, 1, z * as.numeric(a[4]))
    for (r in 1:4) E <- rbind(E, data.frame(MARE = M$MARE, ECHANTILLON = e, REPLICAT_PCR = r, ESPECE = a[1],
                                            DETECTION = rbinom(40, 1, ae * as.numeric(a[5])))) } }
write.csv(M, file.path(db, "mares.csv"), row.names = FALSE)
write.csv(E, file.path(db, "edna_amphibiens.csv"), row.names = FALSE)

# 9. Suivi spatio-temporel : comptages de la Perdrix gambra, 40 points x 2010-2024
Q <- S[61:100, c("SITE","X","Y","altitude","ndvi")]
T <- expand.grid(i = 1:40, annee = 2010:2024)
cx <- (Q$X[T$i] - 650000) / 10000; cy <- (Q$Y[T$i] - 3840000) / 10000; tt <- (T$annee - 2017) / 7
mu <- exp(1.2 + 0.6 * cx - 0.3 * cy - 0.4 * tt * (cx > 0) + 0.25 * tt * (cx <= 0) + rnorm(nrow(T), 0, 0.15))
suivi <- data.frame(SITE = Q$SITE[T$i], X = Q$X[T$i], Y = Q$Y[T$i], ANNEE = T$annee, COMPTAGE = rnbinom(nrow(T), mu = mu, size = 8))
write.csv(suivi[order(suivi$SITE, suivi$ANNEE), ], file.path(db, "suivi_perdrix_2010_2024.csv"), row.names = FALSE)

writeLines(c("DONNÉES FICTIVES du parcours Biodiversité (R ENIV, enseignant : BOUHAFSI SIDDIQ).",
 "Zone : bassin de l'oued Tamda (fictif), WGS 84 / UTM 30N (EPSG:32630). Les noms d'espèces sont réels, les valeurs sont simulées.",
 "Pour travailler sur de vraies données, suivez la leçon 1 : GBIF, OBIS, WorldClim, Copernicus, MODIS."), file.path(db, "LISEZ-MOI.txt"))
cat("Données biodiversité écrites dans", db, "\n"); print(list.files(db))
