# =====================================================================
# R ENIV · Niveau 6 · Programmer : conditions, boucles, fonctions
# =====================================================================
library(dplyr)
library(ggplot2)
pluie    <- read.csv("donnees/tables/pluie_mensuelle.csv")
stations <- read.csv("donnees/tables/stations_meteo.csv", encoding = "UTF-8")
dir.create("sorties/graphiques", recursive = TRUE, showWarnings = FALSE)

# 1. Condition
p_an <- 410
if (p_an < 300) {
  climat <- "aride"
} else if (p_an < 600) {
  climat <- "semi-aride"
} else {
  climat <- "subhumide"
}
climat
# Version vectorisée : ifelse() et case_when()
p <- c(250, 410, 720)
ifelse(p < 300, "aride", "non aride")
case_when(p < 300 ~ "aride", p < 600 ~ "semi-aride", TRUE ~ "subhumide")

# 2. Boucle for : cumul annuel de chaque station
for (s in stations$ID_ST) {
  total <- sum(pluie$PLUIE_MM[pluie$ID_ST == s], na.rm = TRUE) / 15
  cat(s, ":", round(total), "mm/an en moyenne\n")
}

# 3. Boucle while : combien d'années pour doubler une population à 2 % par an ?
pop <- 10000; annees <- 0
while (pop < 20000) { pop <- pop * 1.02; annees <- annees + 1 }
annees

# 4. Écrire une fonction
indice_martonne <- function(P, T) {
  # Indice d'aridité de De Martonne : I = P / (T + 10)
  if (any(T <= -10)) stop("T doit être supérieure à -10 °C")
  P / (T + 10)
}
indice_martonne(410, 16.5)

classer_martonne <- function(I) {
  cut(I, breaks = c(-Inf, 5, 10, 20, 30, Inf),
      labels = c("hyperaride", "aride", "semi-aride", "semi-humide", "humide"))
}

# 5. Appliquer la fonction à toutes les stations
bilan <- pluie |>
  group_by(ID_ST, ANNEE) |>
  summarise(P = sum(PLUIE_MM, na.rm = TRUE), T = mean(TMOY_C), .groups = "drop") |>
  group_by(ID_ST) |>
  summarise(P = mean(P), T = mean(T)) |>
  mutate(I_MARTONNE = round(indice_martonne(P, T), 1), CLASSE = classer_martonne(I_MARTONNE))
print(bilan)

# 6. lapply / sapply : une liste de résultats
cumuls <- sapply(split(pluie$PLUIE_MM, pluie$ID_ST), sum, na.rm = TRUE)
cumuls

# 7. Automatiser : un graphique par station, enregistré automatiquement
graphique_station <- function(id) {
  d <- pluie |> filter(ID_ST == id) |> group_by(MOIS) |>
    summarise(P = mean(PLUIE_MM, na.rm = TRUE), T = mean(TMOY_C))
  nom <- stations$NOM[stations$ID_ST == id]
  g <- ggplot(d, aes(MOIS)) +
    geom_col(aes(y = P), fill = "steelblue") +
    geom_line(aes(y = 2 * T), colour = "firebrick", linewidth = 1) +
    scale_x_continuous(breaks = 1:12) +
    labs(title = paste("Station", id, "-", nom), y = "P (mm) et 2T (°C)", x = "Mois") +
    theme_bw()
  fichier <- file.path("sorties/graphiques", paste0("ombro_", id, ".png"))
  ggsave(fichier, g, width = 16, height = 10, units = "cm", dpi = 200)
  fichier
}
fichiers <- vapply(stations$ID_ST, graphique_station, character(1))
fichiers
