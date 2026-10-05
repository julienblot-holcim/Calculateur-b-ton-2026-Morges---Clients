<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculateur Béton Holcim Vaud-Ouest 2026 (depuis la centrale de Morges) </title>
    <style>
        * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        body { margin: 0; padding: 25px 15px; background-color: #f0f4f8; color: #0b1e36; }
        
        .container { 
            max-width: 950px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            box-shadow: 0 10px 30px rgba(0, 43, 73, 0.08); 
            overflow: hidden;
            border: 1px solid #e1e8ed;
        }

        /* En-tête Charte Holcim */
        .brand-header {
            background-color: #002B49;
            color: #ffffff;
            padding: 20px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            border-bottom: 4px solid #82BC00;
        }
        .brand-header img {
            max-height: 48px;
            width: auto;
            object-fit: contain;
        }
        .brand-header h1 {
            font-size: 1.35rem;
            font-weight: 700;
            margin: 0;
            letter-spacing: 0.3px;
            text-align: right;
            color: #ffffff;
        }

        .content {
            padding: 30px;
        }

        .form-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-bottom: 25px; 
        }
        .form-group { margin-bottom: 10px; }
        label { 
            display: block; 
            font-weight: 700; 
            margin-bottom: 8px; 
            font-size: 0.9rem; 
            color: #002B49; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        input { 
            width: 100%; 
            padding: 12px 14px; 
            border: 1px solid #cbd5e1; 
            border-radius: 6px; 
            font-size: 0.95rem; 
            background-color: #f8fafc;
            transition: all 0.2s ease;
            color: #002B49;
        }
        input:focus { 
            outline: none; 
            border-color: #00A3E0; 
            box-shadow: 0 0 0 3px rgba(0, 163, 224, 0.2); 
            background-color: #ffffff;
        }

        /* Indicateur de proximité */
        .proximity-indicator {
            display: inline-flex; 
            align-items: center; 
            justify-content: center;
            padding: 6px 14px; 
            border-radius: 20px; 
            font-weight: 700; 
            font-size: 0.8rem; 
            margin-left: 10px;
            color: #fff; 
            transition: background-color 0.3s; 
            white-space: nowrap;
            text-transform: uppercase;
        }
        .prox-green { background-color: #82BC00; }
        .prox-yellow { background-color: #f59e0b; }
        .prox-orange { background-color: #ea580c; }
        .prox-red { background-color: #dc2626; }

        /* Bloc Prix Total */
        .total-card {
            background: #002B49;
            color: #ffffff;
            padding: 25px 30px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 5px solid #82BC00;
        }
        .total-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #cbd5e1;
        }
        .price-tag { 
            font-size: 2.8rem; 
            font-weight: 800; 
            color: #82BC00; 
        }

        @media (max-width: 650px) {
            .brand-header { flex-direction: column; text-align: center; }
            .brand-header h1 { text-align: center; font-size: 1.15rem; }
            .form-grid { grid-template-columns: 1fr; }
            .form-group[style*="span 2"] { grid-column: span 1 !important; }
            .total-card { flex-direction: column; text-align: center; gap: 15px; }
        }
    </style>
</head>
<body>

<div class="container">
    <header class="brand-header">
        <img src="HOLCIM_Logo_2025_Negative_White_RGB.png" alt="Holcim Logo">
        <h1>Calculateur Béton & Transport<br><span style="font-size: 0.9rem; font-weight: 400; opacity: 0.85;">Vaud-Ouest (Tarifs 2026 depuis centrale de Morges )</span></h1>
    </header>
    
    <div class="content">
        <div class="form-grid">
            <div class="form-group" style="grid-column: span 2;">
                <label for="recipeInput">1. Recette Béton (Saisie ou Recherche)</label>
                <input list="recipesList" id="recipeInput" placeholder="Ex: C301ECO, Robusto, ZK7..." onchange="updateRecipe()" onkeyup="updateRecipe()">
                <datalist id="recipesList"></datalist>
            </div>

            <div class="form-group">
                <label for="discountInput">2. Rabais Accordé (CHF / m³)</label>
                <input type="number" id="discountInput" value="0.00" min="0" step="0.5" oninput="calculate()">
            </div>

            <div class="form-group">
                <label for="villageInput">3. Lieu de Livraison</label>
                <div style="display: flex; align-items: center;">
                    <input list="villagesList" id="villageInput" placeholder="Ex: Morges, Lausanne, Yverdon..." onchange="updateVillage()" onkeyup="updateVillage()">
                    <span id="proxIndicator" class="proximity-indicator" style="display:none;">Zone</span>
                </div>
                <datalist id="villagesList"></datalist>
            </div>
        </div>

        <!-- Résultat unique affiché -->
        <div class="total-card">
            <div class="total-title">Prix Total Rendu Chantier</div>
            <div class="price-tag" id="totalPrice">---</div>
        </div>
    </div>
</div>

<script>
    const FRAIS_FIXES = 1.40;
    let selectedRecipeObj = null;
    let currentTransportCost = 0.00;

    const recettes = [
        {"code": "A101ECO 0/32 C3 C25/30", "prix": 230.80, "co2": 2.50},
        {"code": "A105ECO 0/32 C3 C20/25", "prix": 228.80, "co2": 2.50},
        {"code": "A108ECO 0/32 F4 C25/30", "prix": 234.80, "co2": 2.50},
        {"code": "A120ECO 0/32 F4 C30/37", "prix": 236.80, "co2": 2.50},
        {"code": "A153ECO 0/16 C3 C25/30", "prix": 236.80, "co2": 2.50},
        {"code": "A155ECO 0/16 F4 C25/30", "prix": 240.80, "co2": 2.50},
        {"code": "B201ECO 0/32 C3 C25/30", "prix": 233.80, "co2": 2.50},
        {"code": "B206ECO 0/32 C3 C30/37", "prix": 235.80, "co2": 2.50},
        {"code": "B210ECO 0/32 C3 C25/30", "prix": 236.00, "co2": 0.00},
        {"code": "B251ECO 0/16 C3 C25/30", "prix": 239.80, "co2": 2.50},
        {"code": "B253 0/16 C3 C30/37", "prix": 247.80, "co2": 3.00},
        {"code": "B260ECO 0/16 C25/30", "prix": 261.80, "co2": 2.50},
        {"code": "C301 0/32 C3 C30/37", "prix": 231.00, "co2": 0.00},
        {"code": "C301ECO 0/32 C3 C30/37", "prix": 237.80, "co2": 2.50},
        {"code": "C301ECO Robusto 0/32 C3 C30/37", "prix": 244.80, "co2": 2.50},
        {"code": "C301ECO Susteno 4S 0/32 C3 C30/37", "prix": 236.00, "co2": 0.00},
        {"code": "C302ECO 0/32 C2 C30/37", "prix": 233.80, "co2": 2.50},
        {"code": "C306ECO 0/32 C3 C35/45", "prix": 247.80, "co2": 2.50},
        {"code": "C309 0/32 C3 C40/50", "prix": 255.80, "co2": 2.80},
        {"code": "C310ECO 0/32 F4 C30/37", "prix": 241.80, "co2": 2.50},
        {"code": "C320ECO 0/32 C30/37 F4", "prix": 245.80, "co2": 2.50},
        {"code": "C351ECO 0/16 C3 C30/37", "prix": 243.80, "co2": 2.50},
        {"code": "C357ECO 0/16 F4 C30/37", "prix": 247.80, "co2": 2.50},
        {"code": "C384 0/8 C30/37", "prix": 250.00, "co2": 0.00},
        {"code": "C385ECO 0/8 F4 C30/37", "prix": 249.80, "co2": 2.50},
        {"code": "C387ECO 0/32 F4 C30/37", "prix": 237.80, "co2": 2.50},
        {"code": "CPH4AAR 0/32 C3 C30/37", "prix": 251.00, "co2": 0.00},
        {"code": "D401TL 0/32 C3 C25/30", "prix": 242.80, "co2": 3.10},
        {"code": "D401TN 0/32 C3 C25/30", "prix": 239.80, "co2": 3.10},
        {"code": "D411TN 0/32 C30/37", "prix": 241.80, "co2": 3.10},
        {"code": "D420TN 0/16 F4 C30/37", "prix": 289.00, "co2": 0.00},
        {"code": "D451TL 0/16 C25/30", "prix": 247.00, "co2": 0.00},
        {"code": "D451TN 0/16 C25/30", "prix": 244.00, "co2": 0.00},
        {"code": "E501TL 0/32 C25/30", "prix": 240.80, "co2": 3.10},
        {"code": "E501TN 0/32 C25/30", "prix": 237.80, "co2": 3.10},
        {"code": "E551TL 0/16 C25/30", "prix": 266.00, "co2": 0.00},
        {"code": "E551TN 0/16 C25/30", "prix": 262.00, "co2": 0.00},
        {"code": "F601TL 0/32 C3 C30/37", "prix": 248.80, "co2": 3.10},
        {"code": "F601TN 0/32 C3 C30/37", "prix": 245.80, "co2": 3.10},
        {"code": "F632TN 0/32 C35/45", "prix": 254.00, "co2": 0.00},
        {"code": "F632TN AAR 0/32 C35/45", "prix": 269.00, "co2": 0.00},
        {"code": "F651TL 0/16 C3 C30/37", "prix": 253.00, "co2": 0.00},
        {"code": "F651TN 0/16 C3 C30/37", "prix": 250.00, "co2": 0.00},
        {"code": "F690TN 0/16 C30/37", "prix": 250.00, "co2": 0.00},
        {"code": "G701TL 0/32 C3 C30/37", "prix": 254.80, "co2": 3.10},
        {"code": "G701TN 0/32 C3 C30/37", "prix": 253.80, "co2": 3.10},
        {"code": "G711TN 0/32 C35/45", "prix": 263.80, "co2": 3.10},
        {"code": "G720TN 0/32 C3 C30/37", "prix": 253.80, "co2": 3.10},
        {"code": "G729TN F4 C30/37", "prix": 257.80, "co2": 3.10},
        {"code": "G751TL 0/16 C3 C30/37", "prix": 260.80, "co2": 3.10},
        {"code": "G751TN 0/16 C3 C30/37", "prix": 259.80, "co2": 3.10},
        {"code": "G752TN 0/16 C50/60", "prix": 303.80, "co2": 3.10},
        {"code": "G758TN 0/16 C30/37", "prix": 285.80, "co2": 3.90},
        {"code": "G761TN 0/16 C3 C35/45", "prix": 266.00, "co2": 0.00},
        {"code": "G765TN F4 C30/37", "prix": 257.80, "co2": 3.10},
        {"code": "G769TN C3 C35/45", "prix": 269.80, "co2": 3.00},
        {"code": "G778TN 0/8 C30/37", "prix": 293.00, "co2": 0.00},
        {"code": "3708CLECO SF2 C30/37", "prix": 274.80, "co2": 2.50},
        {"code": "3716CL SF2 C30/37", "prix": 276.80, "co2": 3.90},
        {"code": "3716CLECO SF2 C30/37", "prix": 272.80, "co2": 2.50},
        {"code": "K042 Blanc Ammocret NPKC F4 C30/37", "prix": 404.80, "co2": 3.70},
        {"code": "K043 Blanc Ammocret NPKG F4 C30/37", "prix": 432.80, "co2": 3.70},
        {"code": "IS01 0/32 F5 C30/37", "prix": 256.80, "co2": 3.30},
        {"code": "IS01 0/32 F5 C30/37 Modero 3B", "prix": 270.00, "co2": 0.00},
        {"code": "IS03 0/32 F5 C25/30", "prix": 254.80, "co2": 3.30},
        {"code": "IS51 0/16 F5 C30/37", "prix": 266.80, "co2": 3.30},
        {"code": "IS51AAR 0/16 F5 C30/37", "prix": 271.00, "co2": 0.00},
        {"code": "IS53 0/16 F5 C25/30", "prix": 264.80, "co2": 3.30},
        {"code": "IS54 0/32 C30/37", "prix": 262.80, "co2": 3.30},
        {"code": "HS03 0/32 F5 C25/30", "prix": 259.00, "co2": 0.00},
        {"code": "IN01 0/32 C25/30", "prix": 254.80, "co2": 2.50},
        {"code": "IN02 0/32 C30/37", "prix": 255.00, "co2": 0.00},
        {"code": "IN02 Robusto 0/32 C30/37", "prix": 262.00, "co2": 0.00},
        {"code": "IN51 C25/30 0/16", "prix": 263.00, "co2": 0.00},
        {"code": "IN51 Robusto 4R 0/16 C25/30", "prix": 265.00, "co2": 0.00},
        {"code": "IN52 0/16 C30/37", "prix": 265.00, "co2": 0.00},
        {"code": "IV51 0/16 C30/37", "prix": 266.80, "co2": 3.30},
        {"code": "ZK7 CP100 0/16", "prix": 180.80, "co2": 0.80},
        {"code": "ZK13 CP150 0/16", "prix": 189.80, "co2": 1.20},
        {"code": "ZK19 CP200 0/16", "prix": 198.80, "co2": 1.60},
        {"code": "ZK28 CP250 0/16", "prix": 206.80, "co2": 2.00},
        {"code": "ZK35 CP300 0/16", "prix": 215.80, "co2": 2.40},
        {"code": "ZK55 CP50 0/32", "prix": 178.00, "co2": 0.00},
        {"code": "ZK67 CP150 0/32", "prix": 185.80, "co2": 1.20},
        {"code": "ZK73 CP200 0/32", "prix": 194.80, "co2": 1.60},
        {"code": "ZK82 CP250 0/32", "prix": 202.80, "co2": 2.00},
        {"code": "ZN22 CP225 0/16", "prix": 208.00, "co2": 0.00},
        {"code": "ZN28 CP250 0/16 (Modero)", "prix": 218.00, "co2": 0.00},
        {"code": "ZN36 CP300 0/16", "prix": 219.80, "co2": 2.40},
        {"code": "ZN38 CP325 0/16", "prix": 223.80, "co2": 2.60},
        {"code": "ZN41 CP350 0/16", "prix": 228.80, "co2": 2.80},
        {"code": "ZN42 0/16 Sézegnin", "prix": 239.80, "co2": 2.80},
        {"code": "ZN45 CEM 375 0/16", "prix": 232.80, "co2": 3.00},
        {"code": "ZN51 CP425 0/16", "prix": 241.00, "co2": 0.00},
        {"code": "ZN90 CP300 0/32", "prix": 215.80, "co2": 2.40},
        {"code": "ZN93 CP325 0/32", "prix": 219.80, "co2": 2.60},
        {"code": "ZN220 CEM 375 0/32", "prix": 230.00, "co2": 0.00},
        {"code": "ZN280 CP 340 0/32", "prix": 236.00, "co2": 0.00},
        {"code": "APG6 0/8 C3 35/45", "prix": 284.00, "co2": 0.00},
        {"code": "APG7 0/32 C40/50", "prix": 281.00, "co2": 0.00},
        {"code": "APG8 0/16 C60/75", "prix": 290.00, "co2": 0.00},
        {"code": "APG15 0/32 C50/60", "prix": 321.80, "co2": 3.40},
        {"code": "APB1 0/16 F3 C30/37", "prix": 291.00, "co2": 0.00},
        {"code": "APB5 0/32 F3 C30/37", "prix": 270.00, "co2": 0.00},
        {"code": "HN01 0/32 C25/30 Pieux", "prix": 242.00, "co2": 0.00},
        {"code": "HN02 0/32 C30/37 Pieux", "prix": 239.00, "co2": 0.00},
        {"code": "KN02 0/32 C25/30", "prix": 242.00, "co2": 0.00},
        {"code": "LN52 0/16 C20/25", "prix": 269.80, "co2": 3.90},
        {"code": "LE900 CEM 400 0/4", "prix": 416.80, "co2": 3.00},
        {"code": "LE1200 CEM 400 0/4", "prix": 404.80, "co2": 3.20},
        {"code": "LE1500 CEM 400 0/4", "prix": 392.80, "co2": 3.20},
        {"code": "MN9 CP300 0/4 Maçonnerie", "prix": 230.00, "co2": 0.00},
        {"code": "MN10 CP325 0/4", "prix": 135.80, "co2": 2.60},
        {"code": "MN11 CP350 0/4", "prix": 240.80, "co2": 2.80},
        {"code": "MN13 CP400 0/4", "prix": 248.80, "co2": 3.20},
        {"code": "MN32 CP350 0/8", "prix": 232.80, "co2": 2.80},
        {"code": "MN34 CP375 0/8", "prix": 240.80, "co2": 3.20},
        {"code": "MN114 CP 350 0/8 Gris", "prix": 234.00, "co2": 0.00},
        {"code": "MN120 CP400 0/8", "prix": 239.00, "co2": 0.00}
    ];

    const villages = [
        {"nom": "Le Chalet-à-Gobet", "prix": 35.0}, {"nom": "Vers-chez-les-Blancs", "prix": 35.0},
        {"nom": "Montblesson", "prix": 35.0}, {"nom": "Lsnne-Centre Ville", "prix": 31.0},
        {"nom": "Lsnne-Centre Ouest", "prix": 33.0}, {"nom": "Lsnne-Centre Est", "prix": 34.0},
        {"nom": "Lsnne-Sud Est", "prix": 35.0}, {"nom": "Lsnne-Sud Ouest", "prix": 32.0},
        {"nom": "Prilly", "prix": 32.0}, {"nom": "Jouxtens-Mézery", "prix": 32.0},
        {"nom": "Pully", "prix": 37.0}, {"nom": "Lsnne-Nord Est", "prix": 34.0},
        {"nom": "Lsnne-Est", "prix": 36.0}, {"nom": "Lsnne-Nord", "prix": 34.0},
        {"nom": "Renens", "prix": 29.0}, {"nom": "Renens Chem. du Close", "prix": 32.0},
        {"nom": "Chavannes-près-Renens", "prix": 30.0}, {"nom": "Crissier", "prix": 27.0},
        {"nom": "Ecublens VD", "prix": 30.0}, {"nom": "Renges", "prix": 32.0},
        {"nom": "St-Sulpice", "prix": 32.0}, {"nom": "Echandens-Denges", "prix": 32.0},
        {"nom": "Denges", "prix": 29.0}, {"nom": "Echandens", "prix": 29.0},
        {"nom": "Lonay", "prix": 29.0}, {"nom": "Préverenges", "prix": 29.0},
        {"nom": "Villars-Ste-Croix", "prix": 29.0}, {"nom": "Bussigny", "prix": 29.0},
        {"nom": "Mex", "prix": 30.0}, {"nom": "Romanel-s-Lausanne", "prix": 33.0},
        {"nom": "Cheseaux-Lausanne", "prix": 31.0}, {"nom": "Boussens", "prix": 33.0},
        {"nom": "Bournens", "prix": 30.0}, {"nom": "Sullens", "prix": 30.0},
        {"nom": "Etagnières", "prix": 33.0}, {"nom": "Bercher", "prix": 46.0},
        {"nom": "Echallens", "prix": 37.0}, {"nom": "Villars-le-Terroir", "prix": 38.0},
        {"nom": "St-Barthélemy VD", "prix": 37.0}, {"nom": "Dommartin", "prix": 44.0},
        {"nom": "Naz", "prix": 44.0}, {"nom": "Poliez-le-Grand", "prix": 41.0},
        {"nom": "Poliez-Pittet", "prix": 42.0}, {"nom": "Bottens", "prix": 40.0},
        {"nom": "Assens", "prix": 35.0}, {"nom": "Bioley-Orjulaz", "prix": 34.0},
        {"nom": "Bettens", "prix": 35.0}, {"nom": "Sugnens", "prix": 42.0},
        {"nom": "Fey", "prix": 43.0}, {"nom": "Rueyres", "prix": 44.0},
        {"nom": "Lausanne Centre-Est", "prix": 36.0}, {"nom": "Le Mont-sur-Lausanne", "prix": 34.0},
        {"nom": "Cugy VD", "prix": 36.0}, {"nom": "Bretigny-sur-Morrens", "prix": 38.0},
        {"nom": "Morrens", "prix": 34.0}, {"nom": "Froideville", "prix": 41.0},
        {"nom": "Villars-Tiercelin", "prix": 42.0}, {"nom": "Peney-le-Jorat", "prix": 47.0},
        {"nom": "Chapelle-sur-Moudon", "prix": 48.0}, {"nom": "Epalinges", "prix": 35.0},
        {"nom": "Les Monts-de-Pully", "prix": 36.0}, {"nom": "Puidoux", "prix": 41.0},
        {"nom": "Chexbres", "prix": 39.0}, {"nom": "Rivaz", "prix": 41.0},
        {"nom": "Savigny", "prix": 39.0}, {"nom": "Mollie-Margot", "prix": 42.0},
        {"nom": "Servion", "prix": 46.0}, {"nom": "Les Cullayes", "prix": 41.0},
        {"nom": "Montpreveyres", "prix": 38.0}, {"nom": "Corcelles-le-Jorat", "prix": 42.0},
        {"nom": "Mézières VD", "prix": 42.0}, {"nom": "Ropraz", "prix": 43.0},
        {"nom": "La Croix", "prix": 36.0}, {"nom": "Grandvaux", "prix": 41.0},
        {"nom": "Aran", "prix": 39.0}, {"nom": "Belmont-sur-Lausanne", "prix": 36.0},
        {"nom": "La Conversion", "prix": 34.0}, {"nom": "Paudex", "prix": 39.0},
        {"nom": "Lutry", "prix": 37.0}, {"nom": "Chatelard (Lutry)", "prix": 38.0},
        {"nom": "Cully", "prix": 41.0}, {"nom": "Villette (Lavaux)", "prix": 36.0},
        {"nom": "Morges", "prix": 24.0}, {"nom": "Echichens", "prix": 27.0},
        {"nom": "St-Saphorin-s-Morges", "prix": 29.0}, {"nom": "Colombier", "prix": 31.0},
        {"nom": "Vullierens", "prix": 33.0}, {"nom": "Cottens", "prix": 35.0},
        {"nom": "Grancy", "prix": 34.0}, {"nom": "Bremblens", "prix": 30.0},
        {"nom": "Romanel-sur-Morges", "prix": 29.0}, {"nom": "Aclens", "prix": 32.0},
        {"nom": "Gollion", "prix": 34.0}, {"nom": "Monnaz", "prix": 28.0},
        {"nom": "Vaux-sur-Morges", "prix": 29.0}, {"nom": "Clarmont", "prix": 30.0},
        {"nom": "Reverolle", "prix": 30.0}, {"nom": "Tolochenaz", "prix": 24.0},
        {"nom": "Lully", "prix": 24.0}, {"nom": "Vufflens-le-Château", "prix": 27.0},
        {"nom": "Chigny", "prix": 26.0}, {"nom": "Denens", "prix": 26.0},
        {"nom": "Bussy-Chardonney", "prix": 27.0}, {"nom": "Sévery", "prix": 33.0},
        {"nom": "Pampigny", "prix": 34.0}, {"nom": "Apples", "prix": 32.0},
        {"nom": "Ballens", "prix": 35.0}, {"nom": "Bière", "prix": 38.0},
        {"nom": "Mollens", "prix": 38.0}, {"nom": "Montricher", "prix": 41.0},
        {"nom": "L'Isle", "prix": 40.0}, {"nom": "Mauraz", "prix": 37.0},
        {"nom": "Villar-Bozon", "prix": 38.0}, {"nom": "Cuarnens", "prix": 40.0},
        {"nom": "Mont-la-Ville", "prix": 44.0}, {"nom": "La Praz", "prix": 45.0},
        {"nom": "Moiry VD", "prix": 44.0}, {"nom": "Berolle", "prix": 38.0},
        {"nom": "St-Prex", "prix": 25.0}, {"nom": "Etoy", "prix": 30.0},
        {"nom": "Buchillon", "prix": 31.0}, {"nom": "Allaman", "prix": 29.0},
        {"nom": "Perroy", "prix": 32.0}, {"nom": "Lussy-sur-Morges", "prix": 25.0},
        {"nom": "Villars-sous-Yens", "prix": 29.0}, {"nom": "Yens", "prix": 31.0},
        {"nom": "Aubonne", "prix": 29.0}, {"nom": "Bougy-Villars", "prix": 33.0},
        {"nom": "Féchy", "prix": 31.0}, {"nom": "Montherod", "prix": 32.0},
        {"nom": "Pizy", "prix": 33.0}, {"nom": "Lavigny", "prix": 31.0},
        {"nom": "St-Livres", "prix": 34.0}, {"nom": "Rolle", "prix": 32.0},
        {"nom": "Tartegnin", "prix": 31.0}, {"nom": "Gilly", "prix": 33.0},
        {"nom": "Gland", "prix": 36.0}, {"nom": "Prangins", "prix": 37.0},
        {"nom": "Sécheron ONU Pâquis", "prix": 51.0}, {"nom": "Geneve", "prix": 58.0},
        {"nom": "Cologny", "prix": 97.0}, {"nom": "Carouge", "prix": 58.0},
        {"nom": "Nyon", "prix": 40.0}, {"nom": "Le Vaud", "prix": 42.0},
        {"nom": "Longirod", "prix": 39.0}, {"nom": "Eysins", "prix": 39.0},
        {"nom": "St-Cergue", "prix": 48.0}, {"nom": "Duillier", "prix": 37.0},
        {"nom": "Vich", "prix": 35.0}, {"nom": "Coinsins", "prix": 36.0},
        {"nom": "Begnins", "prix": 36.0}, {"nom": "Burtigny", "prix": 39.0},
        {"nom": "Bassins", "prix": 42.0}, {"nom": "Givrins", "prix": 41.0},
        {"nom": "Genolier", "prix": 38.0}, {"nom": "Arzier", "prix": 46.0},
        {"nom": "Signy-Avenex", "prix": 36.0}, {"nom": "Chavannes-de-Bogis", "prix": 37.0},
        {"nom": "Bellevue", "prix": 48.0}, {"nom": "Crans", "prix": 40.0},
        {"nom": "Vufflens-la-Ville", "prix": 32.0}, {"nom": "Penthaz", "prix": 32.0},
        {"nom": "Cossonay-Ville", "prix": 35.0}, {"nom": "Dizy", "prix": 37.0},
        {"nom": "Allens", "prix": 36.0}, {"nom": "Senarclens", "prix": 36.0},
        {"nom": "Penthalaz", "prix": 33.0}, {"nom": "Cossonay-Penthalaz Ga", "prix": 31.0},
        {"nom": "Daillens", "prix": 32.0}, {"nom": "Lussery-Villars", "prix": 37.0},
        {"nom": "La Chaux (Cossonay)", "prix": 39.0}, {"nom": "Eclépens", "prix": 36.0},
        {"nom": "Ferreyres", "prix": 42.0}, {"nom": "La Sarraz", "prix": 39.0},
        {"nom": "Chevilly", "prix": 40.0}, {"nom": "Orny", "prix": 41.0},
        {"nom": "Pompaples", "prix": 40.0}, {"nom": "Arnex-sur-Orbe", "prix": 41.0},
        {"nom": "Croy", "prix": 46.0}, {"nom": "Romainmôtier", "prix": 48.0},
        {"nom": "Juriens", "prix": 48.0}, {"nom": "Vallorbe", "prix": 50.0},
        {"nom": "Le Sentier", "prix": 53.0}, {"nom": "Le Brassus", "prix": 53.0},
        {"nom": "Orbe", "prix": 41.0}, {"nom": "Agiez", "prix": 46.0},
        {"nom": "Bofflens", "prix": 45.0}, {"nom": "La Russille", "prix": 46.0},
        {"nom": "Bavois", "prix": 38.0}, {"nom": "Chavornay", "prix": 39.0},
        {"nom": "Corcelles-Chavornay", "prix": 38.0}, {"nom": "Penthéréaz", "prix": 42.0},
        {"nom": "Goumoens-la-Ville", "prix": 37.0}, {"nom": "Eclagnens", "prix": 37.0},
        {"nom": "Goumoens-le-Jux", "prix": 39.0}, {"nom": "Oulens-sou-Echallens", "prix": 34.0},
        {"nom": "Yverdon-les-Bains", "prix": 46.0}, {"nom": "Pailly", "prix": 46.0},
        {"nom": "Essertines-s-Yverdon", "prix": 40.0}, {"nom": "Vuarrens", "prix": 41.0},
        {"nom": "Suchy", "prix": 41.0}, {"nom": "Ependes", "prix": 41.0},
        {"nom": "Essert-Pittet", "prix": 42.0}, {"nom": "Mathod", "prix": 44.0},
        {"nom": "Vucherens", "prix": 46.0}, {"nom": "Payerne", "prix": 53.0}
    ];

    const recipeDatalist = document.getElementById('recipesList');
    recettes.forEach(r => {
        const option = document.createElement('option');
        option.value = r.code;
        recipeDatalist.appendChild(option);
    });

    const villagesDatalist = document.getElementById('villagesList');
    villages.forEach(v => {
        const option = document.createElement('option');
        option.value = v.nom;
        villagesDatalist.appendChild(option);
    });

    function setProximityColor(price, indicator) {
        indicator.style.display = 'inline-flex';
        indicator.className = 'proximity-indicator';
        if (price <= 28) {
            indicator.classList.add('prox-green');
            indicator.innerText = "Zone Proche";
        } else if (price <= 35) {
            indicator.classList.add('prox-yellow');
            indicator.innerText = "Zone Moyenne";
        } else if (price <= 42) {
            indicator.classList.add('prox-orange');
            indicator.innerText = "Zone Éloignée";
        } else {
            indicator.classList.add('prox-red');
            indicator.innerText = "Très Éloigné";
        }
    }

    function updateRecipe() {
        const inputVal = document.getElementById('recipeInput').value;
        const recipe = recettes.find(r => r.code.toLowerCase() === inputVal.toLowerCase());
        
        if (recipe) {
            selectedRecipeObj = recipe;
        } else {
            selectedRecipeObj = null;
        }
        calculate();
    }

    function updateVillage() {
        const inputVal = document.getElementById('villageInput').value;
        const village = villages.find(v => v.nom.toLowerCase() === inputVal.toLowerCase());
        const proxIndicator = document.getElementById('proxIndicator');
        
        if (village) {
            currentTransportCost = village.prix;
            setProximityColor(village.prix, proxIndicator);
        } else {
            currentTransportCost = 0.00;
            proxIndicator.style.display = 'none';
        }
        calculate();
    }

    function calculate() {
        const discount = parseFloat(document.getElementById('discountInput').value) || 0;
        
        if (selectedRecipeObj && currentTransportCost > 0) {
            const recipeBase = selectedRecipeObj.prix;
            const co2Surcharge = selectedRecipeObj.co2;
            const total = (recipeBase + co2Surcharge + FRAIS_FIXES) - discount + currentTransportCost;

            document.getElementById('totalPrice').innerHTML = total.toFixed(2) + ' <span style="font-size: 1.1rem; color: #ffffff;">CHF / m³</span>';
        } else {
            document.getElementById('totalPrice').innerHTML = "---";
        }
    }
</script>

</body>
</html>
