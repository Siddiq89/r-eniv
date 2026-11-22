# =====================================================================
# R ENIV · Niveau 1 · Premiers pas dans R et RStudio
# Enseignant : BOUHAFSI SIDDIQ
# Ouvrez d'abord le projet TP_R.Rproj, puis ce script.
# Exécutez ligne par ligne avec Ctrl + Entrée.
# =====================================================================

# R comme calculatrice
2 + 3
(1250 - 830) / 20        # dénivelé moyen par km, en m
sqrt(144)
round(pi, 2)

# Où suis-je ? (le dossier du projet)
getwd()
list.files("donnees")

# Installer un package (une seule fois par ordinateur)
# install.packages(c("tidyverse", "readxl", "sf", "terra"))

# Charger un package (à chaque session)
library(stats)

# Obtenir de l'aide
?mean
help("round")
example(round)

# Informations sur la session (utile pour signaler un problème)
sessionInfo()
