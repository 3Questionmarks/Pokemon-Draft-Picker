/* Sprite filename/source selection, shiny handling, and form-cycling sprite logic. */

// ===== SPRITES =====

    function getPokemonSpriteFilename(pokemon) {
      const specialCases = {
        "Farfetch'd": "farfetchd",
        "Urshifu-Single-Strike": "urshifu",
        "Urshifu-Rapid-Strike": "urshifu-rapidstrike",
        "Darmanitan-Zen": "darmanitan-zen",
        "Darmanitan-Galar-Zen": "darmanitan-galarzen",
        "Wishiwashi-School": "wishiwashi-school",
        "Minior-Meteor": "minior-meteor",
        "Mimikyu-Busted": "mimikyu-busted",
        "Palafin-Hero": "palafin-hero",
        "Groudon-Primal": "groudon-primal",
        "Kyogre-Primal": "kyogre-primal",
        "Dialga-Origin": "dialga-origin",
        "Palkia-Origin": "palkia-origin",
        "Giratina-Origin": "giratina-origin",
        "Zacian-Crowned": "zacian-crowned",
        "Zamazenta-Crowned": "zamazenta-crowned",
        "Ogerpon-Wellspring": "ogerpon-wellspring",
        "Ogerpon-Hearthflame": "ogerpon-hearthflame",
        "Ogerpon-Cornerstone": "ogerpon-cornerstone",
        "Farfetchd": "farfetchd",
        "Sirfetch'd": "sirfetchd",
        "Farfetch'd-Galar": "farfetchd-galar",
        "Mime Jr.": "mimejr",
        "Mr. Mime": "mrmime",
        "Mr. Mime-Galar": "mrmime-galar",
        "Mr. Rime": "mrrime",
        "Type: Null": "typenull",
        "Ho-Oh": "hooh",
        "Ho-oh": "hooh",
        "Porygon-Z": "porygonz",
        "Flabébé": "flabebe",

        "Venusaur-Mega": "venusaur-mega",
        "Charizard-Mega-X": "charizard-megax",
        "Charizard-Mega-Y": "charizard-megay",
        "Blastoise-Mega": "blastoise-mega",
        "Beedrill-Mega": "beedrill-mega",
        "Pidgeot-Mega": "pidgeot-mega",
        "Alakazam-Mega": "alakazam-mega",
        "Machamp-Mega": "machamp-mega",
        "Slowbro-Mega": "slowbro-mega",
        "Gengar-Mega": "gengar-mega",
        "Kangaskhan-Mega": "kangaskhan-mega",
        "Pinsir-Mega": "pinsir-mega",
        "Gyarados-Mega": "gyarados-mega",
        "Aerodactyl-Mega": "aerodactyl-mega",
        "Mewtwo-Mega-X": "mewtwo-megax",
        "Mewtwo-Mega-Y": "mewtwo-megay",
        "Ampharos-Mega": "ampharos-mega",
        "Steelix-Mega": "steelix-mega",
        "Scizor-Mega": "scizor-mega",
        "Heracross-Mega": "heracross-mega",
        "Houndoom-Mega": "houndoom-mega",
        "Tyranitar-Mega": "tyranitar-mega",
        "Sceptile-Mega": "sceptile-mega",
        "Blaziken-Mega": "blaziken-mega",
        "Swampert-Mega": "swampert-mega",
        "Gardevoir-Mega": "gardevoir-mega",
        "Sableye-Mega": "sableye-mega",
        "Mawile-Mega": "mawile-mega",
        "Aggron-Mega": "aggron-mega",
        "Medicham-Mega": "medicham-mega",
        "Manectric-Mega": "manectric-mega",
        "Sharpedo-Mega": "sharpedo-mega",
        "Camerupt-Mega": "camerupt-mega",
        "Altaria-Mega": "altaria-mega",
        "Banette-Mega": "banette-mega",
        "Absol-Mega": "absol-mega",
        "Glalie-Mega": "glalie-mega",
        "Salamence-Mega": "salamence-mega",
        "Metagross-Mega": "metagross-mega",
        "Latias-Mega": "latias-mega",
        "Latios-Mega": "latios-mega",
        "Rayquaza-Mega": "rayquaza-mega",
        "Lopunny-Mega": "lopunny-mega",
        "Garchomp-Mega": "garchomp-mega",
        "Lucario-Mega": "lucario-mega",
        "Abomasnow-Mega": "abomasnow-mega",
        "Gallade-Mega": "gallade-mega",
        "Audino-Mega": "audino-mega",
        "Diancie-Mega": "diancie-mega",
        "Giratina-Origin": "giratina-origin",
        "Dialga-Origin": "dialga-origin",
        "Palkia-Origin": "palkia-origin",
        "Shaymin-Sky": "shaymin-sky",
        "Hoopa-Unbound": "hoopa-unbound",
        "Deoxys-Attack": "deoxys-attack",
        "Deoxys-Defense": "deoxys-defense",
        "Deoxys-Speed": "deoxys-speed",
        "Zacian-Crowned": "zacian-crowned",
        "Zamazenta-Crowned": "zamazenta-crowned",
        "Arceus-Fighting": "arceus-fighting",
        "Arceus-Flying": "arceus-flying",
        "Arceus-Poison": "arceus-poison",
        "Arceus-Ground": "arceus-ground",
        "Arceus-Rock": "arceus-rock",
        "Arceus-Bug": "arceus-bug",
        "Arceus-Ghost": "arceus-ghost",
        "Arceus-Steel": "arceus-steel",
        "Arceus-Fire": "arceus-fire",
        "Arceus-Water": "arceus-water",
        "Arceus-Grass": "arceus-grass",
        "Arceus-Electric": "arceus-electric",
        "Arceus-Psychic": "arceus-psychic",
        "Arceus-Ice": "arceus-ice",
        "Arceus-Dragon": "arceus-dragon",
        "Arceus-Dark": "arceus-dark",
        "Arceus-Fairy": "arceus-fairy",
        "Silvally-Fighting": "silvally-fighting",
        "Silvally-Flying": "silvally-flying",
        "Silvally-Poison": "silvally-poison",
        "Silvally-Ground": "silvally-ground",
        "Silvally-Rock": "silvally-rock",
        "Silvally-Bug": "silvally-bug",
        "Silvally-Ghost": "silvally-ghost",
        "Silvally-Steel": "silvally-steel",
        "Silvally-Fire": "silvally-fire",
        "Silvally-Water": "silvally-water",
        "Silvally-Grass": "silvally-grass",
        "Silvally-Electric": "silvally-electric",
        "Silvally-Psychic": "silvally-psychic",
        "Silvally-Ice": "silvally-ice",
        "Silvally-Dragon": "silvally-dragon",
        "Silvally-Dark": "silvally-dark",
        "Silvally-Fairy": "silvally-fairy",
        "Genesect-Douse": "genesect-douse",
        "Genesect-Shock": "genesect-shock",
        "Genesect-Burn": "genesect-burn",
        "Genesect-Chill": "genesect-chill",
        "Raichu-Mega-X": "raichu-megax",
        "Raichu-Mega-Y": "raichu-megay",
        "Clefable-Mega": "clefable-mega",
        "Victreebel-Mega": "victreebel-mega",
        "Starmie-Mega": "starmie-mega",
        "Dragonite-Mega": "dragonite-mega",
        "Meganium-Mega": "meganium-mega",
        "Feraligatr-Mega": "feraligatr-mega",
        "Skarmory-Mega": "skarmory-mega",
        "Chimecho-Mega": "chimecho-mega",
        "Absol-Mega-Z": "absol-megaz",
        "Staraptor-Mega": "staraptor-mega",
        "Garchomp-Mega-Z": "garchomp-megaz",
        "Lucario-Mega-Z": "lucario-megaz",
        "Froslass-Mega": "froslass-mega",
        "Heatran-Mega": "heatran-mega",
        "Darkrai-Mega": "darkrai-mega",
        "Emboar-Mega": "emboar-mega",
        "Excadrill-Mega": "excadrill-mega",
        "Scolipede-Mega": "scolipede-mega",
        "Scrafty-Mega": "scrafty-mega",
        "Eelektross-Mega": "eelektross-mega",
        "Chandelure-Mega": "chandelure-mega",
        "Golurk-Mega": "golurk-mega",
        "Chesnaught-Mega": "chesnaught-mega",
        "Delphox-Mega": "delphox-mega",
        "Greninja-Mega": "greninja-mega",
        "Pyroar-Mega": "pyroar-mega",
        "Floette-Eternal-Mega": "floette-mega",
        "Meowstic-Mega": "meowstic-mmega",
        "Meowstic-f-Mega": "meowstic-mmega",
        "Meowstic-Mega": "meowstic-mega",
        "Malamar-Mega": "malamar-mega",
        "Barbaracle-Mega": "barbaracle-mega",
        "Dragalge-Mega": "dragalge-mega",
        "Hawlucha-Mega": "hawlucha-mega",
        "Zygarde-Mega": "zygarde-mega",
        "Crabominable-Mega": "crabominable-mega",
        "Golisopod-Mega": "golisopod-mega",
        "Drampa-Mega": "drampa-mega",
        "Magearna-Mega": "magearna-mega",
        "Zeraora-Mega": "zeraora-mega",
        "Falinks-Mega": "falinks-mega",
        "Scovillain-Mega": "scovillain-mega",
        "Glimmora-Mega": "glimmora-mega",
        "Tatsugiri-Mega": "tatsugiri-mega",
        "Baxcalibur-Mega": "baxcalibur-mega",
        "nidoran♂": "nidoranm",
        "nidoran♀": "nidoranf",
        "Calyrex-Ice": "calyrex-ice",
        "Calyrex-Shadow": "calyrex-shadow",
        "Kyurem-Black": "kyurem-black",
        "Kyurem-White": "kyurem-white",
        "Rotom-Heat": "rotom-heat",
        "Rotom-Wash": "rotom-wash",
        "Rotom-Frost": "rotom-frost",
        "Rotom-Fan": "rotom-fan",
        "Rotom-Mow": "rotom-mow",
        "Jangmo-o": "jangmoo",
        "Hakamo-o": "hakamoo",
        "Kommo-o": "kommoo",
        "Tauros-Paldea-Combat": "tauros-paldeacombat",
        "Tauros-Paldea-Blaze": "tauros-paldeablaze",
        "Tauros-Paldea-Aqua": "tauros-paldeaaqua",
        "Tauros": "tauros",
        "Zygarde-10%": "zygarde-10",
        "Zygarde-Complete": "zygarde-complete",
        "Oricorio-Baile": "oricorio",
        "Oricorio-Pom-Pom": "oricorio-pompom",
        "Oricorio-Pa'u": "oricorio-pau",
        "Oricorio-Sensu": "oricorio-sensu",
        "Wo-Chien": "wochien",
        "Chien-Pao": "chienpao",
        "Ting-Lu": "tinglu",
        "Chi-Yu": "chiyu",
        "Tornadus-Therian": "tornadus-therian",
        "Thundurus-Therian": "thundurus-therian",
        "Landorus-Therian": "landorus-therian",
        "Enamorus-Therian": "enamorus-therian",
        "Squawkabilly-Yellow/White": "squawkabilly-yellow",
        "Poltchageist": "poltchageist-artisan",
        "Necrozma-Dusk-Mane": "necrozma-duskmane",
        "Necrozma-Dawn-Wings": "necrozma-dawnwings",
        "Necrozma-Ultra": "necrozma-ultra",
        "Chillet": "chillet",
        "Wishiwashi-School-Sevii": "wishiwashi-seviischool",
        "Centiskorch-Sevii-Mega": "centiskorch-seviimega",
        "Sizzlipede-Sevii": "sizzlepede-sevii",
        "Pikachu-Starter": "pikachu-starter",
        "Pikachu-Cosplay": "pikachu-cosplay",
        "Pikachu-Rock-Star": "pikachu-rockstar",
        "Pikachu-Pop-Star": "pikachu-popstar",
        "Pikachu-PhD": "pikachu-phd",
        "Eevee-Starter": "eevee-starter",
        "Toxtricity-Low-Key": "toxtricity-lowkey",
        "Tatsugiri-Droopy": "tatsugiri-droopy",
        "Tatsugiri-Stretchy": "tatsugiri-stretchy",
        "Tatsugiri-Droopy-Mega": "tatsugiri-mega",
        "Tatsugiri-Stretchy-Mega": "tatsugiri-mega",
        "Shellos-East": "shellos-east",
        "Gastrodon-East": "gastrodon-east",
        "Keldeo-Resolute": "keldeo-resolute",
        "Meloetta-Pirouette": "meloetta-pirouette",
        "Vivillon-Pokeball": "vivillon-pokeball",
        "Flabebe-Yellow": "flabebe-yellow",
        "Flabebe-Orange": "flabebe-orange",
        "Flabebe-Blue": "flabebe-blue",
        "Flabebe-White": "flabebe-white",
        "Floette-Yellow": "floette-yellow",
        "Floette-Orange": "floette-orange",
        "Floette-Blue": "floette-blue",
        "Floette-White": "floette-white",
        "Florges-Yellow": "florges-yellow",
        "Florges-Orange": "florges-orange",
        "Florges-Blue": "florges-blue",
        "Florges-White": "florges-white",
        "Furfrou-La-Reine": "furfrou-lareine",
        "Magearna-Original": "magearna-original",
        "Magearna-Original-Mega": "magearna-mega",
        "Alcremie-Ruby-Cream": "alcremie-rubycream",
        "Alcremie-Matcha-Cream": "alcremie-matchacream",
        "Alcremie-Mint-Cream": "alcremie-mintcream",
        "Alcremie-Lemon-Cream": "alcremie-lemoncream",
        "Alcremie-Salted-Cream": "alcremie-saltedcream",
        "Alcremie-Ruby-Swirl": "alcremie-rubyswirl",
        "Alcremie-Caramel-Swirl": "alcremie-caramelswirl",
        "Alcremie-Rainbow-Swirl": "alcremie-rainbowswirl",
        "Zarude-Dada": "zarude-dada",
        "Maushold-Four": "maushold-four",
        "Dudunsparce-Three-Segment": "dudunsparce-threesegment",
        "Ogerpon-Teal-Tera": "ogerpon-tealtera",
        "Ogerpon-Wellspring-Tera": "ogerpon-wellspringtera",
        "Ogerpon-Hearthflame-Tera": "ogerpon-hearthflametera",
        "Ogerpon-Cornerstone-Tera": "ogerpon-cornerstonetera",
        "Terapagos-Terastal": "terapagos-terastal",
        "Terapagos-Stellar": "terapagos-stellar",
        "Unfezant-F": "unfezant-f",
        "Frillish-F": "frillish-f",
        "Jellicent-F": "jellicent-f"
      };

      if (specialCases[pokemon]) {
        return specialCases[pokemon];
      }

      if (pokemon.endsWith("-f")) {
        const baseName = pokemon.slice(0, -2);
        return `${getPokemonSpriteFilename(baseName)}-f`;
      }

      return pokemon
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/\./g, "")
        .replace(/'/g, "")
        .replace(/♀/g, "f")
        .replace(/♂/g, "m")
        .replace(/:/g, "")
        .replace(/[^a-z0-9-]/g, "");
    }

    function getPokemonSpriteFilenames(pokemon) {
      const alwaysCyclingSprites = {
        "Burmy": ["burmy", "burmy-sandy", "burmy-trash"],
        "Pikachu-Cosplay": [{"filename": "pikachu-cosplay", "types": ["Electric"]}, {"filename": "pikachu-rockstar", "types": ["Electric", "Steel"]}, {"filename": "pikachu-belle", "types": ["Electric", "Ice"]}, {"filename": "pikachu-popstar", "types": ["Electric", "Fairy"]}, {"filename": "pikachu-phd", "types": ["Electric"]}, {"filename": "pikachu-libre", "types": ["Electric", "Fighting"]}],
        "Castform": ["castform", "castform-sunny", "castform-rainy", "castform-snowy"],
        "Cherrim": ["cherrim", "cherrim-sunshine"],
        "Shellos": ["shellos", "shellos-east"],
        "Gastrodon": ["gastrodon", "gastrodon-east"],
        "Deerling": ["deerling", "deerling-summer", "deerling-autumn", "deerling-winter"],
        "Sawsbuck": ["sawsbuck", "sawsbuck-summer", "sawsbuck-autumn", "sawsbuck-winter"],
        "Keldeo": ["keldeo", "keldeo-resolute"],
        "Meloetta": ["meloetta", "meloetta-pirouette"],
        "Vivillon": ["vivillon", "vivillon-archipelago", "vivillon-continental", "vivillon-elegant", "vivillon-fancy", "vivillon-garden", "vivillon-highplains", "vivillon-icysnow", "vivillon-jungle", "vivillon-marine", "vivillon-meadow", "vivillon-modern", "vivillon-monsoon", "vivillon-ocean", "vivillon-pokeball", "vivillon-polar", "vivillon-river", "vivillon-sandstorm", "vivillon-savanna", "vivillon-sun", "vivillon-tundra"],
        "Flabébé": ["flabebe", "flabebe-yellow", "flabebe-orange", "flabebe-blue", "flabebe-white"],
        "Floette": ["floette", "floette-yellow", "floette-orange", "floette-blue", "floette-white"],
        "Florges": ["florges", "florges-yellow", "florges-orange", "florges-blue", "florges-white"],
        "Furfrou": ["furfrou", "furfrou-heart", "furfrou-star", "furfrou-diamond", "furfrou-debutante", "furfrou-matron", "furfrou-dandy", "furfrou-lareine", "furfrou-kabuki", "furfrou-pharaoh"],
        "Aegislash": ["aegislash", "aegislash-blade"],
        "Xerneas": ["xerneas", "xerneas-neutral"],
        "Wishiwashi": ["wishiwashi", "wishiwashi-school"],
        "Wishiwashi-Sevii": [{"filename": "wishiwashi-sevii", "source": "radicalRed", "types": ["Ghost"]}, {"filename": "wishiwashi-seviischool", "source": "radicalRed", "types": ["Ghost", "Dragon"]}],
        "Minior": ["minior", "minior-meteor", "minior-red", "minior-orange", "minior-yellow", "minior-green", "minior-blue", "minior-indigo", "minior-violet"],
        "Mimikyu": ["mimikyu", "mimikyu-busted"],
        "Magearna": ["magearna", "magearna-original"],
        "Magearna-Mega": ["magearna-mega", "magearna-mega"],
        "Cramorant": ["cramorant", "cramorant-gulping", "cramorant-gorging"],
        "Alcremie": ["alcremie", "alcremie-rubycream", "alcremie-matchacream", "alcremie-mintcream", "alcremie-lemoncream", "alcremie-saltedcream", "alcremie-rubyswirl", "alcremie-caramelswirl", "alcremie-rainbowswirl"],
        "Eiscue": ["eiscue", "eiscue-noice"],
        "Morpeko": ["morpeko", "morpeko-hangry"],
        "Zarude": ["zarude", "zarude-dada"],
        "Maushold": ["maushold", "maushold-four"],
        "Palafin": ["palafin", "palafin-hero"],
        "Dudunsparce": ["dudunsparce", "dudunsparce-threesegment"],
        "Gimmighoul": ["gimmighoul", "gimmighoul-roaming"],
        "Ogerpon": ["ogerpon", "ogerpon-tealtera"],
        "Ogerpon-Wellspring": ["ogerpon-wellspring", "ogerpon-wellspringtera"],
        "Ogerpon-Hearthflame": ["ogerpon-hearthflame", "ogerpon-hearthflametera"],
        "Ogerpon-Cornerstone": ["ogerpon-cornerstone", "ogerpon-cornerstonetera"],
        "Terapagos": ["terapagos", "terapagos-terastal", "terapagos-stellar"],
        "Unfezant": ["unfezant", "unfezant-f"],
        "Frillish": ["frillish", "frillish-f"],
        "Jellicent": ["jellicent", "jellicent-f"],
        "Pyroar": ["pyroar", "pyroar-f"],

        "Venusaur": ["venusaur", "venusaur-f"],
        "Butterfree": ["butterfree", "butterfree-f"],
        "Rattata": ["rattata", "rattata-f"],
        "Raticate": ["raticate", "raticate-f"],
        "Pikachu": ["pikachu", "pikachu-f"],
        "Raichu": ["raichu", "raichu-f"],
        "Zubat": ["zubat", "zubat-f"],
        "Golbat": ["golbat", "golbat-f"],
        "Gloom": ["gloom", "gloom-f"],
        "Vileplume": ["vileplume", "vileplume-f"],
        "Kadabra": ["kadabra", "kadabra-f"],
        "Alakazam": ["alakazam", "alakazam-f"],
        "Doduo": ["doduo", "doduo-f"],
        "Dodrio": ["dodrio", "dodrio-f"],
        "Hypno": ["hypno", "hypno-f"],
        "Rhyhorn": ["rhyhorn", "rhyhorn-f"],
        "Rhydon": ["rhydon", "rhydon-f"],
        "Goldeen": ["goldeen", "goldeen-f"],
        "Seaking": ["seaking", "seaking-f"],
        "Scyther": ["scyther", "scyther-f"],
        "Magikarp": ["magikarp", "magikarp-f"],
        "Gyarados": ["gyarados", "gyarados-f"],
        "Meganium": ["meganium", "meganium-f"],
        "Ledyba": ["ledyba", "ledyba-f"],
        "Ledian": ["ledian", "ledian-f"],
        "Xatu": ["xatu", "xatu-f"],
        "Sudowoodo": ["sudowoodo", "sudowoodo-f"],
        "Politoed": ["politoed", "politoed-f"],
        "Aipom": ["aipom", "aipom-f"],
        "Wooper": ["wooper", "wooper-f"],
        "Quagsire": ["quagsire", "quagsire-f"],
        "Murkrow": ["murkrow", "murkrow-f"],
        "Wobbuffet": ["wobbuffet", "wobbuffet-f"],
        "Girafarig": ["girafarig", "girafarig-f"],
        "Gligar": ["gligar", "gligar-f"],
        "Steelix": ["steelix", "steelix-f"],
        "Scizor": ["scizor", "scizor-f"],
        "Heracross": ["heracross", "heracross-f"],
        "Sneasel": ["sneasel", "sneasel-f"],
        "Ursaring": ["ursaring", "ursaring-f"],
        "Piloswine": ["piloswine", "piloswine-f"],
        "Octillery": ["octillery", "octillery-f"],
        "Houndoom": ["houndoom", "houndoom-f"],
        "Donphan": ["donphan", "donphan-f"],
        "Combusken": ["combusken", "combusken-f"],
        "Blaziken": ["blaziken", "blaziken-f"],
        "Beautifly": ["beautifly", "beautifly-f"],
        "Dustox": ["dustox", "dustox-f"],
        "Ludicolo": ["ludicolo", "ludicolo-f"],
        "Nuzleaf": ["nuzleaf", "nuzleaf-f"],
        "Shiftry": ["shiftry", "shiftry-f"],
        "Meditite": ["meditite", "meditite-f"],
        "Medicham": ["medicham", "medicham-f"],
        "Roselia": ["roselia", "roselia-f"],
        "Gulpin": ["gulpin", "gulpin-f"],
        "Swalot": ["swalot", "swalot-f"],
        "Numel": ["numel", "numel-f"],
        "Camerupt": ["camerupt", "camerupt-f"],
        "Cacturne": ["cacturne", "cacturne-f"],
        "Milotic": ["milotic", "milotic-f"],
        "Relicanth": ["relicanth", "relicanth-f"],
        "Starly": ["starly", "starly-f"],
        "Staravia": ["staravia", "staravia-f"],
        "Staraptor": ["staraptor", "staraptor-f"],
        "Bidoof": ["bidoof", "bidoof-f"],
        "Bibarel": ["bibarel", "bibarel-f"],
        "Kricketot": ["kricketot", "kricketot-f"],
        "Kricketune": ["kricketune", "kricketune-f"],
        "Shinx": ["shinx", "shinx-f"],
        "Luxio": ["luxio", "luxio-f"],
        "Luxray": ["luxray", "luxray-f"],
        "Roserade": ["roserade", "roserade-f"],
        "Combee": ["combee", "combee-f"],
        "Pachirisu": ["pachirisu", "pachirisu-f"],
        "Floatzel": ["floatzel", "floatzel-f"],
        "Gible": ["gible", "gible-f"],
        "Gabite": ["gabite", "gabite-f"],
        "Garchomp": ["garchomp", "garchomp-f"],
        "Hippopotas": ["hippopotas", "hippopotas-f"],
        "Hippowdon": ["hippowdon", "hippowdon-f"],
        "Croagunk": ["croagunk", "croagunk-f"],
        "Toxicroak": ["toxicroak", "toxicroak-f"],
        "Finneon": ["finneon", "finneon-f"],
        "Lumineon": ["lumineon", "lumineon-f"],
        "Snover": ["snover", "snover-f"],
        "Abomasnow": ["abomasnow", "abomasnow-f"],
        "Weavile": ["weavile", "weavile-f"],
        "Rhyperior": ["rhyperior", "rhyperior-f"],
        "Tangrowth": ["tangrowth", "tangrowth-f"],
        "Mamoswine": ["mamoswine", "mamoswine-f"],
        "Squawkabilly": ["squawkabilly", "squawkabilly-blue"],
        "Squawkabilly-Yellow/White": ["squawkabilly-yellow", "squawkabilly-white"]
      };

      const groupedRadicalRedSpritesWhenAlternateFormsHidden = {
        "Wishiwashi": [
          {"filename": "wishiwashi", "types": ["Water"]},
          {"filename": "wishiwashi-school", "types": ["Water"]},
          {"filename": "wishiwashi-sevii", "source": "radicalRed", "types": ["Ghost"]},
          {"filename": "wishiwashi-seviischool", "source": "radicalRed", "types": ["Ghost", "Dragon"]}
        ]
      };

      const groupedSpritesWhenAlternateFormsHidden = {
        "Rattata": ["rattata", "rattata-alola"],
        "Raticate": ["raticate", "raticate-alola"],
        "Raichu": ["raichu", "raichu-alola"],
        "Sandshrew": ["sandshrew", "sandshrew-alola"],
        "Sandslash": ["sandslash", "sandslash-alola"],
        "Vulpix": ["vulpix", "vulpix-alola"],
        "Ninetales": ["ninetales", "ninetales-alola"],
        "Diglett": ["diglett", "diglett-alola"],
        "Dugtrio": ["dugtrio", "dugtrio-alola"],
        "Meowth": ["meowth", "meowth-alola", "meowth-galar"],
        "Persian": ["persian", "persian-alola"],
        "Geodude": ["geodude", "geodude-alola"],
        "Graveler": ["graveler", "graveler-alola"],
        "Golem": ["golem", "golem-alola"],
        "Grimer": ["grimer", "grimer-alola"],
        "Muk": ["muk", "muk-alola"],
        "Exeggutor": ["exeggutor", "exeggutor-alola"],
        "Marowak": ["marowak", "marowak-alola"],
        "Ponyta": ["ponyta", "ponyta-galar"],
        "Rapidash": ["rapidash", "rapidash-galar"],
        "Slowpoke": ["slowpoke", "slowpoke-galar"],
        "Slowbro": ["slowbro", "slowbro-galar"],
        "Farfetch'd": ["farfetchd", "farfetchd-galar"],
        "Weezing": ["weezing", "weezing-galar"],
        "Mr. Mime": ["mrmime", "mrmime-galar"],
        "Articuno": ["articuno", "articuno-galar"],
        "Zapdos": ["zapdos", "zapdos-galar"],
        "Moltres": ["moltres", "moltres-galar"],
        "Slowking": ["slowking", "slowking-galar"],
        "Corsola": ["corsola", "corsola-galar"],
        "Zigzagoon": ["zigzagoon", "zigzagoon-galar"],
        "Linoone": ["linoone", "linoone-galar"],
        "Darumaka": ["darumaka", "darumaka-galar"],
        "Darmanitan": ["darmanitan", "darmanitan-galar"],
        "Yamask": ["yamask", "yamask-galar"],
        "Stunfisk": ["stunfisk", "stunfisk-galar"],
        "Growlithe": ["growlithe", "growlithe-hisui"],
        "Arcanine": ["arcanine", "arcanine-hisui"],
        "Voltorb": ["voltorb", "voltorb-hisui"],
        "Electrode": ["electrode", "electrode-hisui"],
        "Typhlosion": ["typhlosion", "typhlosion-hisui"],
        "Qwilfish": ["qwilfish", "qwilfish-hisui"],
        "Sneasel": ["sneasel", "sneasel-hisui"],
        "Samurott": ["samurott", "samurott-hisui"],
        "Lilligant": ["lilligant", "lilligant-hisui"],
        "Zorua": ["zorua", "zorua-hisui"],
        "Zoroark": ["zoroark", "zoroark-hisui"],
        "Braviary": ["braviary", "braviary-hisui"],
        "Sliggoo": ["sliggoo", "sliggoo-hisui"],
        "Goodra": ["goodra", "goodra-hisui"],
        "Avalugg": ["avalugg", "avalugg-hisui"],
        "Decidueye": ["decidueye", "decidueye-hisui"],
        "Wooper": ["wooper", "wooper-paldea"],
        "Tauros": ["tauros", "tauros-paldeacombat", "tauros-paldeablaze", "tauros-paldeaaqua"],
        "Pikachu": ["pikachu", {"filename": "pikachu-cosplay", "types": ["Electric"]}, {"filename": "pikachu-rockstar", "types": ["Electric", "Steel"]}, {"filename": "pikachu-belle", "types": ["Electric", "Ice"]}, {"filename": "pikachu-popstar", "types": ["Electric", "Fairy"]}, {"filename": "pikachu-phd", "types": ["Electric"]}, {"filename": "pikachu-libre", "types": ["Electric", "Fighting"]}],
        "Pikachu-Cosplay": [{"filename": "pikachu-cosplay", "types": ["Electric"]}, {"filename": "pikachu-rockstar", "types": ["Electric", "Steel"]}, {"filename": "pikachu-belle", "types": ["Electric", "Ice"]}, {"filename": "pikachu-popstar", "types": ["Electric", "Fairy"]}, {"filename": "pikachu-phd", "types": ["Electric"]}, {"filename": "pikachu-libre", "types": ["Electric", "Fighting"]}],
        "Eevee": ["eevee", "eevee-starter"],
        "Wormadam": ["wormadam", "wormadam-sandy", "wormadam-trash"],
        "Toxtricity": ["toxtricity", "toxtricity-lowkey"],
        "Lycanroc": ["lycanroc", "lycanroc-midnight", "lycanroc-dusk"],
        "Tatsugiri": ["tatsugiri", "tatsugiri-droopy", "tatsugiri-stretchy"],
        "Rotom": ["rotom", "rotom-heat", "rotom-wash", "rotom-frost", "rotom-fan", "rotom-mow"],
        "Deoxys": ["deoxys", "deoxys-attack", "deoxys-defense", "deoxys-speed"],
        "Shaymin": ["shaymin", "shaymin-sky"],
        "Squawkabilly": ["squawkabilly", "squawkabilly-blue", "squawkabilly-yellow", "squawkabilly-white"],
        "Oricorio-Baile": ["oricorio", "oricorio-pompom", "oricorio-pau", "oricorio-sensu"],
        "Tornadus": ["tornadus", "tornadus-therian"],
        "Thundurus": ["thundurus", "thundurus-therian"],
        "Landorus": ["landorus", "landorus-therian"],
        "Enamorus": ["enamorus", "enamorus-therian"],
        "Urshifu-Single-Strike": ["urshifu", "urshifu-rapidstrike"],
        "Basculegion": ["basculegion", "basculegion-f"],
        "Indeedee": ["indeedee", "indeedee-f"],
        "Meowstic": ["meowstic", "meowstic-f"],
        "Oinkologne": ["oinkologne", "oinkologne-f"]
      };

      const groupedSeviiSpritesWhenAlternateFormsHidden = {
        "Doduo": ["doduo", {"filename": "doduo-sevii", "source": "radicalRed"}],
        "Dodrio": ["dodrio", {"filename": "dodrio-sevii", "source": "radicalRed"}],
        "Teddiursa": ["teddiursa", {"filename": "teddiursa-sevii", "source": "radicalRed"}],
        "Ursaring": ["ursaring", {"filename": "ursaring-sevii", "source": "radicalRed"}],
        "Mantine": ["mantine", {"filename": "mantine-sevii", "source": "radicalRed"}],
        "Feebas": ["feebas", {"filename": "feebas-sevii", "source": "radicalRed"}],
        "Milotic": ["milotic", {"filename": "milotic-sevii", "source": "radicalRed"}],
        "Carnivine": ["carnivine", {"filename": "carnivine-sevii", "source": "radicalRed"}],
        "Mantyke": ["mantyke", {"filename": "mantyke-sevii", "source": "radicalRed"}],
        "Blitzle": ["blitzle", {"filename": "blitzle-sevii", "source": "radicalRed"}],
        "Zebstrika": ["zebstrika", {"filename": "zebstrika-sevii", "source": "radicalRed"}],
        "Clauncher": ["clauncher", {"filename": "clauncher-sevii", "source": "radicalRed"}],
        "Clawitzer": ["clawitzer", {"filename": "clawitzer-sevii", "source": "radicalRed"}],
        "Noibat": ["noibat", {"filename": "noibat-sevii", "source": "radicalRed"}],
        "Noivern": ["noivern", {"filename": "noivern-sevii", "source": "radicalRed"}],
        "Wishiwashi": ["wishiwashi", {"filename": "wishiwashi-sevii", "source": "radicalRed", "types": ["Ghost"]}],
        "Dhelmise": ["dhelmise", {"filename": "dhelmise-sevii", "source": "radicalRed"}],
        "Sizzlipede": ["sizzlipede", {"filename": "sizzlepede-sevii", "source": "radicalRed"}],
        "Centiskorch": ["centiskorch", {"filename": "centiskorch-sevii", "source": "radicalRed"}],
        "Nymble": ["nymble", {"filename": "nymble-sevii", "source": "radicalRed"}],
        "Lokix": ["lokix", {"filename": "lokix-sevii", "source": "radicalRed"}]
      };

      const groupedSpritesWhenAbilityFormsHidden = {};

      const groupedSpritesWhenItemFormsHidden = {};

      if (
        !includeAlternateFormsElement.checked &&
        isRadicalRedSelected() &&
        groupedRadicalRedSpritesWhenAlternateFormsHidden[pokemon]
      ) {
        return groupedRadicalRedSpritesWhenAlternateFormsHidden[pokemon];
      }

      if (
        !includeAlternateFormsElement.checked &&
        isRadicalRedSelected() &&
        groupedSeviiSpritesWhenAlternateFormsHidden[pokemon]
      ) {
        return groupedSeviiSpritesWhenAlternateFormsHidden[pokemon];
      }

      if (!includeAlternateFormsElement.checked && groupedSpritesWhenAlternateFormsHidden[pokemon]) {
        return groupedSpritesWhenAlternateFormsHidden[pokemon];
      }

      if (alwaysCyclingSprites[pokemon]) {
        return alwaysCyclingSprites[pokemon];
      }

      if (!includeItemFormsElement.checked && groupedSpritesWhenItemFormsHidden[pokemon]) {
        return groupedSpritesWhenItemFormsHidden[pokemon];
      }

      return [getPokemonSpriteFilename(pokemon)];
    }

    function getSpriteFilenameValue(spriteEntry) {
      return typeof spriteEntry === "string" ? spriteEntry : spriteEntry.filename;
    }

    function getSpriteEntrySource(spriteEntry, fallbackPokemon) {
      if (typeof spriteEntry === "string") return getPokemonSpriteSource(fallbackPokemon);
      return spriteEntry.source || getPokemonSpriteSource(fallbackPokemon);
    }

    function getSpriteEntryTypes(spriteEntry, fallbackPokemon) {
      if (typeof spriteEntry === "object" && Array.isArray(spriteEntry.types)) {
        return spriteEntry.types;
      }

      if (typeof spriteEntry === "object" && spriteEntry.pokemonName) {
        return getPokemonDataByName(spriteEntry.pokemonName)?.types || getPokemonDataByName(fallbackPokemon)?.types || [];
      }

      const filename = getSpriteFilenameValue(spriteEntry);
      const matchedPokemon = PokemonDraftData.pokemon.find((pokemonData) =>
        getPokemonSpriteFilename(pokemonData.name) === filename
      );

      return matchedPokemon?.types || getPokemonDataByName(fallbackPokemon)?.types || [];
    }

    function updateTypeBadgeRow(row, types) {
      if (!row) return;
      row.innerHTML = "";

      (types || []).forEach((type) => {
        const badge = document.createElement("span");
        badge.className = `type-badge ${getTypeClassName(type)}`;
        badge.textContent = type;
        badge.title = `${type} type`;
        row.appendChild(badge);
      });
    }

    function getCurrentSpriteEntry(pokemon, spriteIndex = 0) {
      const filenames = getPokemonSpriteFilenames(pokemon);
      return filenames[spriteIndex % filenames.length];
    }

    function getPokemonSpriteUrl(pokemon, isShiny = false, spriteIndex = 0) {
      const folder = isShiny ? "gen5-shiny" : "gen5";
      const filenames = getPokemonSpriteFilenames(pokemon);
      const spriteEntry = filenames[spriteIndex % filenames.length];
      const filename = getSpriteFilenameValue(spriteEntry);
      const spriteSource = getSpriteEntrySource(spriteEntry, pokemon);
      const baseUrl = spriteSource === "radicalRed"
        ? "https://play.radicalred.net/sprites"
        : "https://play.pokemonshowdown.com/sprites";

      return `${baseUrl}/${folder}/${filename}.png`;
    }

    function setupCyclingSprite(sprite, pokemon, isShinyGetter) {
      const filenames = getPokemonSpriteFilenames(pokemon);
      if (filenames.length <= 1) return;

      let spriteIndex = 0;
      setInterval(() => {
        const currentFilenames = getPokemonSpriteFilenames(pokemon);
        spriteIndex = (spriteIndex + 1) % currentFilenames.length;
        const spriteEntry = currentFilenames[spriteIndex];
        sprite.src = getPokemonSpriteUrl(pokemon, isShinyGetter(), spriteIndex);

        const card = sprite.closest(".pokemon-button");
        const typeRow = card?.querySelector(".type-badge-row");
        if (typeRow) {
          updateTypeBadgeRow(typeRow, getSpriteEntryTypes(spriteEntry, pokemon));
        }
      }, 1000);
    }

    function createPokemonSprite(pokemon, className, isShiny = false) {
      const img = document.createElement("img");
      img.src = getPokemonSpriteUrl(pokemon, isShiny);
      img.alt = isShiny ? "Shiny Pokémon sprite" : "Pokémon sprite";
      img.className = className;
      img.loading = "lazy";
      img.onerror = () => {
        img.style.display = "none";
      };
      return img;
    }

    function rollShiny() {
      return Math.floor(Math.random() * 100) === 0;
    }

    function getRandomChoices(count) {
      const shuffled = [...availablePokemon].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, availablePokemon.length));
    }

    function getChoiceColumnCount(choiceCount) {
      if (choiceCount <= 1) return 1;
      if (choiceCount <= 4) return choiceCount;
      if (choiceCount === 5 || choiceCount === 6) return 3;
      if (choiceCount <= 8) return 4;
      if (choiceCount <= 10) return 5;
      return Math.ceil(Math.sqrt(choiceCount));
    }

    function updateChoiceGridColumns(choiceCount) {
      choicesElement.style.setProperty("--choice-columns", getChoiceColumnCount(choiceCount));
    }
