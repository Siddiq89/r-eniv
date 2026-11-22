# Génère le dossier TP_R (données FICTIVES, bassin de l'oued Tamda, UTM 30N)
# Usage : Rscript generer_donnees_R.R <dossier TP source (site SIG)> <dossier sortie>
suppressPackageStartupMessages({library(sf); library(terra)})
a <- commandArgs(TRUE); src <- a[1]; out <- a[2]
set.seed(2026)
d <- function(...) { p <- file.path(out, ...); dir.create(p, recursive = TRUE, showWarnings = FALSE); p }
dv <- d("donnees", "shapefiles"); dt <- d("donnees", "tables"); dr <- d("donnees", "raster"); d("sorties"); d("scripts")

# 1. Shapefiles de base (copie) + GeoPackage unique
base <- c("Zone_etude","Communes","Occupation_sol","Routes","Oueds","Forages","Ecoles")
risq <- c("Exutoire","Lithologie","Failles","Epicentres","Foyers_incendies","Glissements","Laisses_crues")
for (n in base) { x <- st_read(file.path(src,"Shapefiles",paste0(n,".shp")), quiet=TRUE)
  st_write(x, file.path(dv, paste0(n,".shp")), quiet=TRUE, delete_dsn=file.exists(file.path(dv, paste0(n,".shp"))), layer_options="ENCODING=UTF-8") }
gp <- file.path(out,"donnees","tamda.gpkg"); if (file.exists(gp)) file.remove(gp)
for (n in base) st_write(st_read(file.path(src,"Shapefiles",paste0(n,".shp")),quiet=TRUE), gp, layer=tolower(n), quiet=TRUE)
for (n in risq) st_write(st_read(file.path(src,"Risques",paste0(n,".shp")),quiet=TRUE), gp, layer=tolower(n), quiet=TRUE)

# 2. MNT en GeoTIFF
m <- rast(file.path(src,"MNT","MNT_50m.asc")); crs(m) <- "EPSG:32630"; names(m) <- "altitude"
writeRaster(m, file.path(dr,"MNT_50m.tif"), overwrite=TRUE, gdal=c("COMPRESS=DEFLATE"))

# 3. Tables reprises du site SIG
file.copy(file.path(src,"Tables",c("population_communes.csv","population_communes.xlsx","releves_gps.csv")), dt, overwrite=TRUE)

# 4. Stations météo et pluie mensuelle (format international : virgule + point décimal)
st <- data.frame(ID_ST=sprintf("S%02d",1:5),
  NOM=c("Tamda","Ain Zerga","Bordj Lmaa","Taourirt Nath","Tizi Ousmane"),
  X=c(646500,652300,657800,643200,655100), Y=c(3836200,3841500,3834800,3846900,3847300))
st$ALT_M <- round(extract(m, as.matrix(st[,c("X","Y")]))[,1])
write.csv(st, file.path(dt,"stations_meteo.csv"), row.names=FALSE, fileEncoding="UTF-8")
norm_p <- c(62,55,52,40,30,8,2,4,22,40,58,64)       # mm, profil méditerranéen
norm_t <- c(9,10,12.5,14.5,18,22.5,26,26.5,22.5,18,13,10)
pl <- do.call(rbind, lapply(seq_len(nrow(st)), function(i) {
  f <- 1 + (st$ALT_M[i]-600)/1500
  do.call(rbind, lapply(2010:2024, function(an) {
    ya <- exp(rnorm(1,0,0.25)) * (1 - 0.006*(an-2010))
    data.frame(ID_ST=st$ID_ST[i], ANNEE=an, MOIS=1:12,
      PLUIE_MM=round(pmax(0, norm_p*f*ya*exp(rnorm(12,0,0.45))),1),
      TMOY_C=round(norm_t - 0.0055*(st$ALT_M[i]-600) + 0.03*(an-2010) + rnorm(12,0,0.9),1))
  }))
}))
pl$PLUIE_MM[sample(nrow(pl), 9)] <- NA     # quelques valeurs manquantes, exprès
write.csv(pl, file.path(dt,"pluie_mensuelle.csv"), row.names=FALSE)

# 5. Qualité de l'eau des forages (format français : point-virgule + virgule décimale)
fo <- st_read(file.path(src,"Shapefiles","Forages.shp"), quiet=TRUE)
os <- st_read(file.path(src,"Shapefiles","Occupation_sol.shp"), quiet=TRUE)
occ <- st_join(fo, os["TYPE"])$TYPE
q <- do.call(rbind, lapply(c("2023-03-15","2023-09-15"), function(dd) {
  agri <- ifelse(occ %in% "Agriculture", 18, 0); bas <- ifelse(dd=="2023-09-15", 6, 0)
  data.frame(ID_FOR=fo$ID_FOR, DATE=dd, CAMPAGNE=ifelse(dd=="2023-03-15","Hautes eaux","Basses eaux"),
    NITRATES_MGL=round(pmax(2, 45 - 0.12*fo$PROF_M + agri + bas + rnorm(nrow(fo),0,6)),1),
    COND_USCM=round(650 + 1.6*fo$PROF_M + 90*(bas>0) + rnorm(nrow(fo),0,70)),
    PH=round(7.2 + rnorm(nrow(fo),0,0.25),2), TEMP_C=round(17 + 0.02*fo$PROF_M + rnorm(nrow(fo),0,0.8),1))
}))
write.csv2(q, file.path(dt,"qualite_eau_forages.csv"), row.names=FALSE, fileEncoding="UTF-8")

write.csv(st_drop_geometry(fo), file.path(dt,"forages_attributs.csv"), row.names=FALSE, fileEncoding="UTF-8")

# 6. Inventaire des feux en table (pour st_as_sf)
fe <- st_read(file.path(src,"Risques","Foyers_incendies.shp"), quiet=TRUE)
xy <- st_coordinates(fe)
write.csv(data.frame(st_drop_geometry(fe), X=round(xy[,1],1), Y=round(xy[,2],1)), file.path(dt,"feux_inventaire.csv"), row.names=FALSE, fileEncoding="UTF-8")

# 7. Poids multicritère (version CSV simple, une ligne par critère)
pm <- data.frame(RISQUE=c(rep("Inondation",5),rep("Feux",5),rep("Glissements",4)),
  CRITERE=c("dist_oued","hand","pente","accumulation","occupation",
            "occupation","pente","exposition","dist_routes","dist_habitat",
            "pente","lithologie","dist_oued","occupation"),
  POIDS=c(35,25,20,10,10, 35,20,15,15,15, 40,30,15,15))
write.csv(pm, file.path(dt,"poids_multicritere.csv"), row.names=FALSE)
writeLines(c("Version: 1.0","","RestoreWorkspace: No","SaveWorkspace: No","AlwaysSaveHistory: Default","","EnableCodeIndexing: Yes","Encoding: UTF-8","","RnwWeave: Sweave","LaTeX: pdfLaTeX"), file.path(out,"TP_R.Rproj"))
cat("TP_R généré dans", out, "\n")
