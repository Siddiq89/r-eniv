/*
 * FICHIERS D'EXEMPLE À TÉLÉCHARGER — parcours R
 * Pour ajouter un fichier : copiez-le dans fichiers/ puis ajoutez un bloc { ... } ci-dessous.
 * Champs : niveau ("r1"…"r8", "b1"…"b9" ou "" pour un fichier général), lecon (ex. "r3-l2" ou ""),
 *          fichier (chemin depuis le dossier du site), titre, taille, description.
 */
window.FICHIERS = [
  {
    "niveau": "",
    "lecon": "",
    "fichier": "fichiers/TP_R_ENIV.zip",
    "titre": "Toutes les données et scripts du TP (projet RStudio, parcours R et Biodiversité)",
    "taille": "1,7 Mo",
    "description": "Décompressez dans C:\\ENIV\\ puis double-cliquez sur C:\\ENIV\\TP_R\\TP_R.Rproj."
  },
  {
    "niveau": "",
    "lecon": "",
    "fichier": "fichiers/scripts_R.zip",
    "titre": "Les 9 scripts R du parcours",
    "taille": "12 Ko",
    "description": "Un script par niveau, testés sur les données du TP."
  },
  {
    "niveau": "",
    "lecon": "",
    "fichier": "fichiers/shapefiles_tamda.zip",
    "titre": "Couches de base en shapefile",
    "taille": "13 Ko",
    "description": "Zone d'étude, communes, occupation du sol, routes, oueds, forages, écoles (UTM 30N)."
  },
  {
    "niveau": "",
    "lecon": "",
    "fichier": "fichiers/tamda.gpkg",
    "titre": "GeoPackage du bassin de l'oued Tamda",
    "taille": "348 Ko",
    "description": "14 couches vecteur dans un seul fichier, dont les données de risques."
  },
  {
    "niveau": "",
    "lecon": "",
    "fichier": "fichiers/MNT_50m.tif",
    "titre": "MNT 50 m (GeoTIFF)",
    "taille": "339 Ko",
    "description": "Modèle numérique de terrain du bassin, WGS 84 / UTM 30N."
  },
  {
    "niveau": "",
    "lecon": "",
    "fichier": "fichiers/donnees_biodiversite.zip",
    "titre": "Données du parcours Biodiversité (dossier donnees/biodiversite)",
    "taille": "1,3 Mo",
    "description": "Données fictives (noms d'espèces réels) : occurrences au format GBIF, NDVI 2010-2024, forêts, communautés, réseaux, oiseaux, ADN environnemental. Déjà incluses dans TP_R_ENIV.zip."
  },
  {
    "niveau": "",
    "lecon": "",
    "fichier": "fichiers/scripts_biodiversite.zip",
    "titre": "Les 9 scripts R du parcours Biodiversité",
    "taille": "15 Ko",
    "description": "Un script par niveau (B1 à B9), testés sur les données du TP. À placer dans TP_R/scripts/biodiversite."
  },
  {
    "niveau": "r1",
    "lecon": "r1-l3",
    "fichier": "fichiers/TP_R_ENIV.zip",
    "titre": "Le projet TP_R complet",
    "taille": "1,7 Mo",
    "description": "Décompressez dans C:\\ENIV\\ et ouvrez TP_R.Rproj."
  },
  {
    "niveau": "r1",
    "lecon": "r1-l4",
    "fichier": "fichiers/01_premiers_pas.R",
    "titre": "Script du niveau 1",
    "taille": "1 Ko",
    "description": "Calculs, dossier de travail, packages et aide."
  },
  {
    "niveau": "r2",
    "lecon": "r2-l1",
    "fichier": "fichiers/02_bases_langage.R",
    "titre": "Script du niveau 2",
    "taille": "1 Ko",
    "description": "Objets, vecteurs, indexation, NA, facteurs, listes, matrices."
  },
  {
    "niveau": "r3",
    "lecon": "r3-l2",
    "fichier": "fichiers/pluie_mensuelle.csv",
    "titre": "Pluie et température mensuelles",
    "taille": "20 Ko",
    "description": "5 stations, 2010-2024. CSV international (virgule, point décimal)."
  },
  {
    "niveau": "r3",
    "lecon": "r3-l2",
    "fichier": "fichiers/qualite_eau_forages.csv",
    "titre": "Qualité de l'eau des forages",
    "taille": "3 Ko",
    "description": "Nitrates, conductivité, pH. CSV français (point-virgule, virgule décimale)."
  },
  {
    "niveau": "r3",
    "lecon": "r3-l2",
    "fichier": "fichiers/population_communes.xlsx",
    "titre": "Population des communes (Excel)",
    "taille": "5 Ko",
    "description": "CODE, POP_2008, POP_2020, MENAGES."
  },
  {
    "niveau": "r3",
    "lecon": "r3-l2",
    "fichier": "fichiers/population_communes.csv",
    "titre": "Population des communes (CSV)",
    "taille": "0 Ko",
    "description": "Séparateur point-virgule."
  },
  {
    "niveau": "r3",
    "lecon": "r3-l4",
    "fichier": "fichiers/stations_meteo.csv",
    "titre": "Stations météo",
    "taille": "0 Ko",
    "description": "ID_ST, NOM, X, Y, ALT_M : clé de jointure ID_ST."
  },
  {
    "niveau": "r3",
    "lecon": "r3-l4",
    "fichier": "fichiers/forages_attributs.csv",
    "titre": "Attributs des forages",
    "taille": "2 Ko",
    "description": "Profondeur, débit, état, année : clé de jointure ID_FOR."
  },
  {
    "niveau": "r3",
    "lecon": "r3-l4",
    "fichier": "fichiers/03_tableaux_dplyr.R",
    "titre": "Script du niveau 3",
    "taille": "2 Ko",
    "description": "Import, dplyr, jointures, tidyr, export."
  },
  {
    "niveau": "r4",
    "lecon": "r4-l3",
    "fichier": "fichiers/04_graphiques.R",
    "titre": "Script du niveau 4",
    "taille": "3 Ko",
    "description": "Graphiques de base, ggplot2, diagramme ombrothermique, export."
  },
  {
    "niveau": "r5",
    "lecon": "r5-l2",
    "fichier": "fichiers/feux_inventaire.csv",
    "titre": "Inventaire des feux",
    "taille": "3 Ko",
    "description": "45 départs de feu : année, surface, occupation, cause, X, Y."
  },
  {
    "niveau": "r5",
    "lecon": "r5-l3",
    "fichier": "fichiers/05_statistiques.R",
    "titre": "Script du niveau 5",
    "taille": "2 Ko",
    "description": "Descriptives, tests, corrélation, régression, Mann-Kendall."
  },
  {
    "niveau": "r6",
    "lecon": "r6-l3",
    "fichier": "fichiers/06_fonctions_boucles.R",
    "titre": "Script du niveau 6",
    "taille": "3 Ko",
    "description": "Conditions, boucles, fonctions, graphiques en série."
  },
  {
    "niveau": "r7",
    "lecon": "r7-l1",
    "fichier": "fichiers/shapefiles_tamda.zip",
    "titre": "Couches de base en shapefile",
    "taille": "13 Ko",
    "description": "À décompresser ; ou utilisez le projet TP_R complet."
  },
  {
    "niveau": "r7",
    "lecon": "r7-l1",
    "fichier": "fichiers/tamda.gpkg",
    "titre": "GeoPackage du bassin",
    "taille": "348 Ko",
    "description": "Toutes les couches vecteur dans un seul fichier."
  },
  {
    "niveau": "r7",
    "lecon": "r7-l2",
    "fichier": "fichiers/releves_gps.csv",
    "titre": "Relevés GPS",
    "taille": "1 Ko",
    "description": "20 points avec X, Y (UTM 30N) et LON, LAT (WGS 84)."
  },
  {
    "niveau": "r7",
    "lecon": "r7-l4",
    "fichier": "fichiers/07_vecteur_sf.R",
    "titre": "Script du niveau 7",
    "taille": "3 Ko",
    "description": "Lecture, projections, géotraitements, carte choroplèthe."
  },
  {
    "niveau": "r8",
    "lecon": "r8-l1",
    "fichier": "fichiers/MNT_50m.tif",
    "titre": "MNT 50 m (GeoTIFF)",
    "taille": "339 Ko",
    "description": "Altitudes du bassin, cellules de 50 m."
  },
  {
    "niveau": "r8",
    "lecon": "r8-l2",
    "fichier": "fichiers/08_raster_terra.R",
    "titre": "Script du niveau 8 (raster)",
    "taille": "2 Ko",
    "description": "MNT, pente, exposition, ombrage, reclassification, statistiques zonales."
  },
  {
    "niveau": "r8",
    "lecon": "r8-l3",
    "fichier": "fichiers/poids_multicritere.csv",
    "titre": "Poids des critères",
    "taille": "0 Ko",
    "description": "Poids (%) des critères des cartes d'inondation, de feux et de glissements."
  },
  {
    "niveau": "r8",
    "lecon": "r8-l4",
    "fichier": "fichiers/09_risques_multicritere.R",
    "titre": "Script des cartes de risques",
    "taille": "5 Ko",
    "description": "Inondation, feux, glissements, validation et synthèse multirisque."
  },
  {
    "niveau": "b1",
    "lecon": "",
    "fichier": "fichiers/b1_donnees_en_ligne.R",
    "titre": "Script du niveau B1",
    "taille": "3 Ko",
    "description": "Recherche GBIF/OBIS/WorldClim (EN_LIGNE), nettoyage, thinning et carte de richesse."
  },
  {
    "niveau": "b1",
    "lecon": "b1-l2",
    "fichier": "fichiers/occurrences_gbif_simulees.csv",
    "titre": "Export GBIF simulé (à nettoyer)",
    "taille": "20 Ko",
    "description": "Mêmes colonnes qu'un export GBIF réel : coordonnées manquantes, (0, 0), signes inversés et doublons volontaires."
  },
  {
    "niveau": "b2",
    "lecon": "",
    "fichier": "fichiers/b2_teledetection_ndvi.R",
    "titre": "Script du niveau B2",
    "taille": "3 Ko",
    "description": "Tendance NDVI par pixel, Mann-Kendall, perturbation, fragmentation forestière."
  },
  {
    "niveau": "b3",
    "lecon": "",
    "fichier": "fichiers/b3_diversite_beta_neutralite.R",
    "titre": "Script du niveau B3",
    "taille": "3 Ko",
    "description": "Alpha, bêta, gamma, décomposition de Baselga, NMDS, modèles nuls et simulation neutre."
  },
  {
    "niveau": "b4",
    "lecon": "",
    "fichier": "fichiers/b4_reseaux_multiplexes.R",
    "titre": "Script du niveau B4",
    "taille": "3 Ko",
    "description": "Réseaux bipartis, connectance, NODF, modularité, réseau multiplexe et robustesse."
  },
  {
    "niveau": "b5",
    "lecon": "",
    "fichier": "fichiers/b5_sdm_ia_explicable.R",
    "titre": "Script du niveau B5",
    "taille": "2 Ko",
    "description": "SDM ranger, AUC, carte, importance, dépendance partielle, ICE, explication locale."
  },
  {
    "niveau": "b6",
    "lecon": "",
    "fichier": "fichiers/b6_occupation_detection.R",
    "titre": "Script du niveau B6",
    "taille": "3 Ko",
    "description": "Vraisemblance du modèle d'occupation avec optim(), carte de ψ, nombre de passages."
  },
  {
    "niveau": "b7",
    "lecon": "",
    "fichier": "fichiers/b7_adn_environnemental.R",
    "titre": "Script du niveau B7",
    "taille": "2 Ko",
    "description": "ADNe : sensibilité d'un protocole et modèle multi-échelle bayésien avec JAGS."
  },
  {
    "niveau": "b8",
    "lecon": "",
    "fichier": "fichiers/b8_jsdm.R",
    "titre": "Script du niveau B8",
    "taille": "3 Ko",
    "description": "SDM empilés, corrélations résiduelles et JSDM à facteurs latents avec JAGS."
  },
  {
    "niveau": "b9",
    "lecon": "",
    "fichier": "fichiers/b9_bayesien_spatiotemporel.R",
    "titre": "Script du niveau B9",
    "taille": "4 Ko",
    "description": "Occupation de communauté bayésienne (JAGS) et GAM spatio-temporel avec incertitude."
  }
];
