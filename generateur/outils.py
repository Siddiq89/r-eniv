import html, json, textwrap
def C(code):
    """Bloc de code R : échappé pour HTML."""
    return "<pre><code>" + html.escape(textwrap.dedent(code).strip("\n"), quote=False) + "</code></pre>"
def lecon(id, titre, duree, objectifs, contenu, exercice):
    return dict(id=id, titre=titre, duree=duree, objectifs=objectifs, contenu=contenu, exercice=exercice)
def q(question, choix, bonne, explication):
    return dict(question=question, choix=choix, bonne=bonne, explication=explication)
