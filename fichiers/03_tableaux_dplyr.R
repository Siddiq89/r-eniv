# =====================================================================
# R ENIV · Niveau 3 · Tableaux de données, import et dplyr
# Packages : install.packages(c("dplyr", "tidyr", "readr", "readxl"))
# =====================================================================
library(dplyr)
library(tidyr)
library(readxl)

# 1. Importer
pluie    <- read.csv("donnees/tables/pluie_mensuelle.csv")                 # virgule, point décimal
stations <- read.csv("donnees/tables/stations_meteo.csv", encoding = "UTF-8")
qualite  <- read.csv2("donnees/tables/qualite_eau_forages.csv", encoding = "UTF-8")  # ; et virgule décimale
pop      <- read.csv("donnees/tables/population_communes.csv", sep = ";")
pop_xl   <- read_excel("donnees/tables/population_communes.xlsx")

# 2. Explorer
head(pluie); str(pluie); summary(pluie)
nrow(pluie); ncol(pluie); names(pluie)
unique(pluie$ID_ST)

# 3. Indexation de base R
pluie[1:5, c("ANNEE", "PLUIE_MM")]
pluie$PLUIE_MM[pluie$ID_ST == "S01" & pluie$ANNEE == 2020]

# 4. dplyr : filtrer, sélectionner, créer, trier
hiver <- pluie |>
  filter(MOIS %in% c(12, 1, 2), !is.na(PLUIE_MM)) |>
  select(ID_ST, ANNEE, MOIS, PLUIE_MM) |>
  mutate(PLUIE_CM = PLUIE_MM / 10) |>
  arrange(desc(PLUIE_MM))
head(hiver)

# 5. Résumer par groupe : cumul annuel par station
annuel <- pluie |>
  group_by(ID_ST, ANNEE) |>
  summarise(P_AN = sum(PLUIE_MM, na.rm = TRUE), T_MOY = mean(TMOY_C), .groups = "drop")
moyennes <- annuel |>
  group_by(ID_ST) |>
  summarise(P_MOY = round(mean(P_AN)), T_MOY = round(mean(T_MOY), 1))

# 6. Joindre avec les stations (clé ID_ST)
synthese <- stations |> left_join(moyennes, by = "ID_ST") |> arrange(ALT_M)
print(synthese)

# 7. Format large <-> long
large <- annuel |> select(ID_ST, ANNEE, P_AN) |> pivot_wider(names_from = ID_ST, values_from = P_AN)
long  <- large |> pivot_longer(-ANNEE, names_to = "ID_ST", values_to = "P_AN")

# 8. Évolution de la population
pop <- pop |> mutate(TAUX_AN = round(100 * ((POP_2020 / POP_2008)^(1/12) - 1), 2))

# 9. Exporter
dir.create("sorties", showWarnings = FALSE)
write.csv(synthese, "sorties/synthese_stations.csv", row.names = FALSE)
write.csv2(pop, "sorties/population_taux.csv", row.names = FALSE)   # pour Excel en français
