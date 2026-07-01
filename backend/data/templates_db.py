# 100+ Template Categories Engine

CATEGORIES = [
    "ATS Friendly", "Software Engineering", "Artificial Intelligence", 
    "Engineering", "Business", "Creative", "Healthcare", "International Formats", "Student Templates"
]

LAYOUTS = ["Classic", "Split-Pane", "Minimal", "Executive", "Timeline"]
COLOR_THEMES = ["Blue Professional", "Green Corporate", "Dark Mode", "Elegant Slate", "Startup Purple"]
FONTS = ["Inter", "Roboto", "Merriweather", "Outfit"]

def generate_template_catalog():
    """Generates a massive catalog of 100+ templates algorithmically."""
    catalog = []
    id_counter = 1
    
    # Generate explicit ATS ones
    ats_roles = ["Executive ATS", "Corporate ATS", "Minimal ATS", "Professional ATS", "Engineering ATS"]
    for role in ats_roles:
        catalog.append({
            "id": f"tpl_{id_counter}",
            "name": role,
            "category": "ATS Friendly",
            "layout": "Classic",
            "color": "Elegant Slate",
            "font": "Inter",
            "ats_score_modifier": 99
        })
        id_counter += 1

    # Generate specific tech ones
    tech_roles = ["Software Engineer", "Backend Developer", "Frontend Developer", "Full Stack Developer", "DevOps Engineer", "AI Engineer", "Data Scientist"]
    for role in tech_roles:
        catalog.append({
            "id": f"tpl_{id_counter}",
            "name": f"{role} Modern",
            "category": "Software Engineering" if "Engineer" in role or "Developer" in role and "AI" not in role else "Artificial Intelligence",
            "layout": "Split-Pane",
            "color": "Dark Mode",
            "font": "Outfit",
            "ats_score_modifier": 92
        })
        id_counter += 1

    # Fill the rest with combinations to reach 100+
    for layout in LAYOUTS:
        for color in COLOR_THEMES:
            for font in FONTS:
                if id_counter > 110: break
                catalog.append({
                    "id": f"tpl_{id_counter}",
                    "name": f"{layout} {color} {font}",
                    "category": "Creative",
                    "layout": layout,
                    "color": color,
                    "font": font,
                    "ats_score_modifier": 80 if layout == "Split-Pane" else 95
                })
                id_counter += 1
                
    return catalog

TEMPLATE_CATALOG = generate_template_catalog()

def get_template_by_id(template_id: str):
    for tpl in TEMPLATE_CATALOG:
        if tpl["id"] == template_id:
            return tpl
    return TEMPLATE_CATALOG[0]
