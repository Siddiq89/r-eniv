# =====================================================================
# R ENIV · Niveau 7 · Données vectorielles et cartographie avec sf
# Packages : install.packages(c("sf", "dplyr", "ggplot2"))
# =====================================================================
library(sf)
library(dplyr)
library(ggplot2)
dir.create("sorties", showWarnings = FALSE)

# 1. Lire des couches (shapefile et GeoPackage)
communes <- st_read("donnees/shapefiles/Communes.shp")
st_layers("donnees/tamda.gpkg")
oueds    <- st_read("donnees/tamda.gpkg", layer = "oueds")
forages  <- st_read("donnees/tamda.gpkg", layer = "forages")
routes   <- st_read("donnees/tamda.gpkg", layer = "routes")
occup    <- st_read("donnees/tamda.gpkg", layer = "occupation_sol")

# 2. Explorer
communes
st_crs(communes)$epsg          # 32630 = WGS 84 / UTM zone 30N
st_geometry_type(communes)[1]
st_bbox(communes)
plot(st_geometry(communes)); plot(st_geometry(oueds), col = "blue", add = TRUE)

# 3. Créer des points à partir d'une table XY
gps <- read.csv("donnees/tables/releves_gps.csv", sep = ";")
gps_utm <- st_as_sf(gps, coords = c("X", "Y"), crs = 32630)
gps_wgs <- st_as_sf(gps, coords = c("LON", "LAT"), crs = 4326)
gps_wgs_utm <- st_transform(gps_wgs, 32630)        # reprojection
max(st_distance(gps_utm, gps_wgs_utm, by_element = TRUE))   # quelques centimètres d'écart

# 4. Attributs : surface, densité, jointure de la table de population
communes <- communes |>
  mutate(SURF_KM2 = as.numeric(st_area(geometry)) / 1e6,
         DENSITE  = POP / SURF_KM2)
pop <- read.csv("donnees/tables/population_communes.csv", sep = ";")
communes <- communes |> left_join(pop, by = "CODE") |>
  mutate(CROISS = round(100 * (POP_2020 - POP_2008) / POP_2008, 1))

# 5. Géotraitements
tampon_oued <- st_buffer(oueds, 250) |> st_union()             # zone de 250 m autour des oueds
forages_proches <- forages[st_intersects(forages, tampon_oued, sparse = FALSE)[, 1], ]
nrow(forages_proches)
forages_com <- st_join(forages, select(communes, COMMUNE = NOM))   # jointure spatiale
table(forages_com$COMMUNE)
nb <- forages_com |> st_drop_geometry() |> count(COMMUNE, name = "NB_FORAGES")
communes <- communes |> left_join(nb, by = c("NOM" = "COMMUNE")) |> mutate(NB_FORAGES = coalesce(NB_FORAGES, 0L))
agri <- occup |> filter(TYPE == "Agriculture") |> st_union()
agri_com <- st_intersection(communes["NOM"], agri) |>
  mutate(AGRI_KM2 = as.numeric(st_area(geometry)) / 1e6)
d_route <- st_distance(forages, st_union(routes))
forages$DIST_ROUTE_M <- round(as.numeric(d_route))

# 6. Carte choroplèthe avec ggplot2
carte <- ggplot() +
  geom_sf(data = communes, aes(fill = DENSITE), colour = "white") +
  geom_sf(data = oueds, colour = "#1f78b4", linewidth = 0.8) +
  geom_sf(data = forages, aes(shape = ETAT), size = 1.8) +
  geom_sf_text(data = communes, aes(label = NOM), size = 2.6) +
  scale_fill_distiller(palette = "YlOrRd", direction = 1, name = "hab./km²") +
  labs(title = "Bassin de l'oued Tamda (données fictives)", subtitle = "Densité de population et forages",
       caption = "Source : TP R ENIV · UTM 30N", shape = "État du forage") +
  theme_minimal()
print(carte)
ggsave("sorties/carte_densite.png", carte, width = 20, height = 16, units = "cm", dpi = 300)

# 7. Exporter
st_write(communes, "sorties/communes_stats.gpkg", delete_dsn = TRUE)
st_write(forages_proches, "sorties/forages_zone_oued.shp", delete_dsn = TRUE)
