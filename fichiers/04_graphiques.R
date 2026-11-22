# =====================================================================
# R ENIV · Niveau 4 · Graphiques avec R de base et ggplot2
# Packages : install.packages(c("dplyr", "ggplot2"))
# =====================================================================
library(dplyr)
library(ggplot2)
dir.create("sorties", showWarnings = FALSE)

pluie    <- read.csv("donnees/tables/pluie_mensuelle.csv")
stations <- read.csv("donnees/tables/stations_meteo.csv", encoding = "UTF-8")
qualite  <- read.csv2("donnees/tables/qualite_eau_forages.csv", encoding = "UTF-8")

# 1. Graphiques de base R
annuel <- pluie |> group_by(ID_ST, ANNEE) |> summarise(P_AN = sum(PLUIE_MM, na.rm = TRUE), .groups = "drop")
hist(annuel$P_AN, main = "Pluie annuelle (toutes stations)", xlab = "mm", col = "skyblue")
boxplot(P_AN ~ ID_ST, data = annuel, ylab = "mm/an", col = "lightgreen")
plot(qualite$COND_USCM, qualite$NITRATES_MGL, pch = 19, xlab = "Conductivité (µS/cm)", ylab = "Nitrates (mg/L)")

# 2. ggplot2 : nuage de points avec couleur
g1 <- ggplot(qualite, aes(x = COND_USCM, y = NITRATES_MGL, colour = CAMPAGNE)) +
  geom_point(size = 2) +
  geom_hline(yintercept = 50, linetype = "dashed", colour = "red") +   # seuil de potabilité OMS
  labs(title = "Nitrates et conductivité des forages", x = "Conductivité (µS/cm)", y = "Nitrates (mg/L)", colour = "Campagne") +
  theme_minimal()
print(g1)

# 3. Diagramme ombrothermique (Gaussen : P = 2T) de la station S01
clim <- pluie |> filter(ID_ST == "S01") |> group_by(MOIS) |>
  summarise(P = mean(PLUIE_MM, na.rm = TRUE), T = mean(TMOY_C))
g2 <- ggplot(clim, aes(x = MOIS)) +
  geom_col(aes(y = P), fill = "steelblue") +
  geom_line(aes(y = 2 * T), colour = "firebrick", linewidth = 1) +
  geom_point(aes(y = 2 * T), colour = "firebrick") +
  scale_x_continuous(breaks = 1:12, labels = c("J","F","M","A","M","J","J","A","S","O","N","D")) +
  scale_y_continuous(name = "Précipitations (mm)", sec.axis = sec_axis(~ . / 2, name = "Température (°C)")) +
  labs(title = "Diagramme ombrothermique, station de Tamda (2010-2024)", x = NULL) +
  theme_bw()
print(g2)

# 4. Facettes : évolution de la pluie annuelle par station
g3 <- ggplot(annuel, aes(ANNEE, P_AN)) +
  geom_line() + geom_smooth(method = "lm", se = FALSE, colour = "orange") +
  facet_wrap(~ ID_ST) +
  labs(x = "Année", y = "Pluie annuelle (mm)") + theme_light()
print(g3)

# 5. Export
ggsave("sorties/ombrothermique_S01.png", g2, width = 18, height = 12, units = "cm", dpi = 300)
ggsave("sorties/pluie_annuelle_stations.png", g3, width = 20, height = 14, units = "cm", dpi = 300)
