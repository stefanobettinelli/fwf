def get_simplified_countries(json_countries):
    return [
        {
            "name": country["name"],
            "capital": country["capital"],
            "region": country["region"],
            "flag": country["flag"],
        }
        for country in json_countries
    ]
