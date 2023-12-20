const jshttp = new XMLHttpRequest();
const trhttp = new XMLHttpRequest();
const abhttp = new XMLHttpRequest();
const avatarPrefix = "https://crafthead.net/avatar/";
const skinPrefix = "https://crafthead.net/armor/body/";
const spritePrefix = "https://api.vaulthunters.gg/static/sprites/"
const minAvatars = 5;
const textRarity = {
    "SCRAPPY": "#fdf1db",
    "COMMON": "#51aeff",
    "RARE": "#ffe800",
    "EPIC": "#ff00ff",
    "OMEGA": "#6aff00"
};
const borderRarity = {
    "SCRAPPY": "#555555",
    "COMMON": "#2d6a80",
    "RARE": "#9f780d",
    "EPIC": "#6c1c5e",
    "OMEGA": "#326622"
};
const equipLabel = {
    "HEAD": "Vault Helmet",
    "CHEST": "Vault Chestplate",
    "LEGS": "Vault Leggings",
    "FEET": "Vault Boots"
};
const advStatInfo = {
    "statAP": "the_vault:ability_power",
    "statArmor": "minecraft:generic.armor",
    "statArpodDmg": "the_vault:damage_spiders",
    "statAtkDmg": "minecraft:generic.attack_damage",
    "statAtkRng": "forge:attack_range",
    "statAtkSpd": "minecraft:generic.attack_speed",
    "statBlkPct": "the_vault:block",
    "statChain": "the_vault:on_hit_chain",
    "statCoolReduc": "the_vault:cooldown_reduction",
    "statCopious": "the_vault:copiously",
    "statCritResist": "the_vault:critical_hit_mitigation",
    "statHealEff": "the_vault:healing_effectiveness",
    "statHealth": "minecraft:generic.max_health",
    "statIllDmg": "the_vault:damage_illagers",
    "statDurInc": "the_vault:durability_wear_reduction",
    "statQuant": "the_vault:item_quantity",
    "statRarity": "the_vault:item_rarity",
    "statKnockResist": "minecraft:generic.knockback_resistance",
    "statLuckyPct": "the_vault:lucky_hit_chance",
    "statMana": "the_vault:generic.mana_max",
    "statManaRegen": "the_vault:generic.mana_regen",
    "statMineSpd": "the_vault:mining_speed",
    "statNetherDmg": "the_vault:damage_nether",
    "statReach": "the_vault:generic.reach",
    "statResist": "the_vault:resistance",
    "statShockPct": "the_vault:shocking_hit_chance",
    "statSoulPct": "the_vault:soul_chance",
    "statStunPct": "the_vault:on_hit_stun",
    "statSweepPct": "the_vault:sweeping_hit_chance",
    "statThornDmg": "the_vault:generic.thorns_damage",
    "statDisarmPct": "the_vault:trap_disarming",
    "statUndeadDmg": "the_vault:damage_undead",
    "statVelara": "the_vault:velara_affinity"
};
const equip = ["charm", "HEAD", "OFFHAND", "blue_trinket", "CHEST", "MAINHAND", "red_trinket", "LEGS", "belt", "FEET"];
const gears = document.getElementsByClassName("gear-item");
let whitelist, trinkets, p, avatars, abilities, abKeys;
let playerData = {"players": []};
let scrollIndex = 1;
let activePlayer = 1;

function defCalc(a, b, r) {
    const r_adj = r - 0.5;
    const af = Math.pow(40 / a, 2);
    const d1 = 1 - (1 / (af + 1));
    const d2 = d1 * (1 - r_adj);
    const d3 = d2 * (1 - b);
    return (1 - d3);
}

function moveScroll(n) {
    setScroll(scrollIndex + n);
}

function setScroll(n) {
    let elmnts = document.getElementsByClassName("nempty");
    if(n < 1 || n > elmnts.length - 4) { return; }
    
    scrollIndex = n;
    for(i = 1; i < n; i++) {
        elmnts[i-1].classList.add("scroll-hide");
    }
    for(i = n; i < n+5; i++) {
        elmnts[i-1].classList.remove("scroll-hide");
    }
    for(i = n+5; i <= elmnts.length; i++) {
        elmnts[i-1].classList.add("scroll-hide");
    }
}

async function setActive(n) {
    statSwap(0);

    activePlayer = n;
    let pDat = playerData.players[n-1];

    /* Change Scroll Bar */
    let elmnts = document.getElementsByClassName("nempty");
    if(n < 1 || n > elmnts.length) { return; }

    for(i = 0; i < elmnts.length; i++) {
        elmnts[i].classList.remove("scroll-active");
        elmnts[i].id = elmnts[i].id.replace("active_", "");
    }
    elmnts[n-1].classList.add("scroll-active");
    elmnts[n-1].id = "active_" + elmnts[n-1].id;

    /* Change Everything Else */
    /* Sidebar */
    const hunterName = document.getElementById("hunterName");
    hunterName.innerHTML = whitelist.members[n-1].tag;

    const vaultLevel = document.getElementById("vaultLevel");
    vaultLevel.innerHTML = "Vault Level " + pDat.vaultLevel;

    const progressBar = document.getElementById("lvProgress");
    progressBar.style.width = pDat.levelPercent * 100 + "%";

    /* Skin */
    const skinImg = document.getElementById("armory-img");
    skinImg.src = skinPrefix + whitelist.members[n-1].uuid;

    /* Basic Stats */
    const statDmgAmount = document.getElementById("statDmgAmount");
    statDmgAmount.innerHTML = Math.round(pDat.vanillaAttributes["minecraft:generic.attack_damage"] * pDat.vanillaAttributes["minecraft:generic.attack_speed"] * 10) / 10;

    const statAbilityAmount = document.getElementById("statAbilityAmount");
    statAbilityAmount.innerHTML = pDat.gearAttributes["the_vault:ability_power"];

    const statHealthAmount = document.getElementById("statHealthAmount");
    statHealthAmount.innerHTML = pDat.vanillaAttributes["minecraft:generic.max_health"];

    const statDefenseAmount = document.getElementById("statDefenseAmount");
    const statDef = defCalc(
        a = pDat.vanillaAttributes["minecraft:generic.armor"],
        b = pDat.gearAttributes["the_vault:block"],
        r = pDat.gearAttributes["the_vault:resistance"]
    );
    statDefenseAmount.innerHTML = Math.round(statDef * 100) + "%";

    const statManaAmount = document.getElementById("statManaAmount");
    statManaAmount.innerHTML = pDat.vanillaAttributes["the_vault:generic.mana_max"];

    /* Vault Stats */
    const statVComplete = document.getElementById("statVComplete");
    statVComplete.innerHTML = pDat.completed;

    const statVAbandon = document.getElementById("statVAbandon");
    statVAbandon.innerHTML = pDat.survived;

    const statVFailed = document.getElementById("statVFailed");
    statVFailed.innerHTML = pDat.failed;

    const statVTotal = document.getElementById("statVTotal");
    statVTotal.innerHTML = pDat.completed + pDat.survived + pDat.failed;

    /* Gear */
    /* Icons */
    let request, imgURL;
    for(i = 0; i < equip.length; i++) {
        const e = equip[i];
        const gIcon = gears[i].getElementsByClassName("gear-icon")[0];
        const gLabel = gears[i].getElementsByClassName("gear-label")[0];
        const gBox = gears[i].getElementsByClassName("gear-box")[0];
        if(pDat.equipment[e] !== undefined) {
            const r = pDat.equipment[e].gearData.rarity;
            switch(e) {
                case "charm":
                    gIcon.style.backgroundImage = "url(" + spritePrefix + "charm/)";
                    gLabel.innerHTML = "Charm";
                    break;
                case "blue_trinket":
                    gIcon.style.backgroundImage = "url(" + spritePrefix + "trinkets/" + pDat.equipment[e].gearData.attributes[1].value.replace("the_vault:", "") + ".png)";
                    gLabel.innerHTML = pDat.equipment[e].gearData.attributes[1].value.replace("the_vault:", "").replace("_", " ").split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
                    gLabel.style.color = "rgb(50, 107, 252)";
                    break;
                case "red_trinket":
                    gIcon.style.backgroundImage = "url(" + spritePrefix + "trinkets/" + pDat.equipment[e].gearData.attributes[1].value.replace("the_vault:", "") + ".png)";
                    gLabel.innerHTML = pDat.equipment[e].gearData.attributes[1].value.replace("the_vault:", "").replace("_", " ").split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
                    gLabel.style.color = "rgb(252, 74, 50)";
                    break;
                case "belt":
                    gIcon.style.backgroundImage = "url(" + spritePrefix + pDat.equipment.belt.gearData.attributes[1].value.replace("the_vault:", "") + ".png)";
                    gLabel.innerHTML = "Vault Magnet";
                    gLabel.style.color = textRarity[r];
                    break;
                case "OFFHAND":
                    if(pDat.equipment[e].itemKey.startsWith("the_vault")) {
                        gIcon.style.backgroundImage = "url(" + spritePrefix + "gear/placeholders/shield.png)";
                        gLabel.innerHTML = "Vault Shield";
                        gLabel.style.color = textRarity[r];
                        gBox.style.borderColor = borderRarity[r];
                    } else {
                        gIcon.style.backgroundImage = "url(https://api.vaulthunters.gg/static/sprites/items/non_vault_item.png)";
                        gLabel.innerHTML = pDat.equipment[e].itemKey.replace(/^.*:/, "").replace("_", " ").split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
                        gLabel.style.color = textRarity["SCRAPPY"];
                        gBox.style.borderColor = borderRarity["SCRAPPY"];
                    }
                    break;
                case "MAINHAND":
                    if(pDat.equipment[e].itemKey.startsWith("the_vault")) {
                        gIcon.style.backgroundImage = "url(" + spritePrefix + "gear/placeholders/sword.png)";
                        gLabel.innerHTML = "Vault Sword";
                        gLabel.style.color = textRarity[r];
                        gBox.style.borderColor = borderRarity[r];
                    } else {
                        gIcon.style.backgroundImage = "url(https://api.vaulthunters.gg/static/sprites/items/non_vault_item.png)";
                        gLabel.innerHTML = pDat.equipment[e].itemKey.replace(/^.*:/, "").replace("_", " ").split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
                        gLabel.style.color = textRarity["SCRAPPY"];
                        gBox.style.borderColor = borderRarity["SCRAPPY"];
                    }
                    break;
                /*case "HEAD":
                    imgURL = spritePrefix + pDat.equipment[e].gearData.attributes[1].value.replace("the_vault:", "") + "_overlay.png"
                    console.log(imgURL);
                    request = new Request(imgURL);
                    await fetch(request).then((response) => {
                        if(response.ok) {
                            gIcon.style.backgroundImage = "url(" + imgURL + ")";
                        } else {
                            gIcon.style.backgroundImage = "url(" + imgURL.replace("_overlay", "") + ")";
                        }
                    });
                    gLabel.style.color = textRarity[r];
                    gBox.style.borderColor = borderRarity[r];
                    break;*/
                default:
                    if(pDat.equipment[e].itemKey.startsWith("the_vault")) {
                        imgURL = spritePrefix + pDat.equipment[e].gearData.attributes[1].value.replace("the_vault:", "") + "_overlay.png"
                        request = new Request(imgURL);
                        await fetch(request).then((response) => {
                            if(response.ok) {
                                gIcon.style.backgroundImage = "url(" + imgURL + ")";
                            } else {
                                gIcon.style.backgroundImage = "url(" + imgURL.replace("_overlay", "") + ")";
                            }
                        });
                        gLabel.innerHTML = equipLabel[e];
                        gLabel.style.color = textRarity[r];
                        gBox.style.borderColor = borderRarity[r];
                    } else {
                        gIcon.style.backgroundImage = "url(https://api.vaulthunters.gg/static/sprites/items/non_vault_item.png)";
                        gLabel.innerHTML = pDat.equipment[e].itemKey.replace(/^.*:/, "").replace("_", " ").split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
                        gLabel.style.color = textRarity["SCRAPPY"];
                        gBox.style.borderColor = borderRarity["SCRAPPY"];
                    }
                    break;
            }
        } else {
            gIcon.style.backgroundColor = "#555555";
            gLabel.innerHTML = "Empty";
            gLabel.style.color = "#fdf1db";
            gears[i].classList.add("gear-empty");
        }
    }

    /* Abilities */
    const playerAb = pDat.abilities;
    const pak = Object.keys(playerAb);
    for(i = 0; i < pak.length; i++) {
        const k = pak[i];
        const s = k.toLowerCase().replace("_", "-");
        document.querySelector("#ab-" + s + " .ability-box").classList.remove("grey-box");
    }
}

function loadPlayers() {
    let uuhttp = [];
    let scrollPlayers = document.querySelectorAll(".nempty");
    /*let equip = ["CHEST", "FEET", "HEAD", "LEGS", "OFFHAND", "belt", "blue_trinket", "red_trinket"];*/
    for(i = 0; i < whitelist.members.length; i++) {
        uuhttp[i] = new XMLHttpRequest();
        uuhttp[i].open("GET", "../db/" + whitelist.members[i].uuid + ".json");
        uuhttp[i].onload = function() {
            let response = JSON.parse(this.responseText);
            equip.forEach((e) => {
                if(response.equipment[e] !== undefined) {
                    response.equipment[e].gearData = JSON.parse(response.equipment[e].gearData);
                }
            });
            const lv = document.createElement("p");
            lv.innerHTML = "Level " + response.vaultLevel;
            scrollPlayers[i - 1].appendChild(lv);
            playerData.players.push(response);
        }
        uuhttp[i].send();
    }
    setTimeout(setActive, 200, n = scrollIndex);
}

jshttp.onload = function() {
    whitelist = JSON.parse(this.responseText);

    avatars = [];
    for(m in whitelist.members) {
        avatars.push(avatarPrefix + whitelist.members[m].uuid + "/32");
    }

    const scrollContent = document.getElementById("scroll-items");
    for(a in avatars) {
        if(a < minAvatars) {
            const elmnt = document.createElement("div");
            elmnt.classList.add("scroll-element");
            elmnt.classList.add("nempty");
            elmnt.setAttribute("onclick", "setActive(" + String(Number(a) + 1) + ")");
            elmnt.id = whitelist.members[a].uuid;

            const imgChild = document.createElement("img");
            imgChild.src = avatars[a];
            const txtChild = document.createElement("h3");
            txtChild.innerHTML = whitelist.members[a].tag;

            elmnt.appendChild(imgChild);
            elmnt.appendChild(txtChild);
            scrollContent.appendChild(elmnt);  
        } else {
            const elmnt = document.createElement("div");
            elmnt.classList.add("scroll-element");
            elmnt.classList.add("nempty");
            elmnt.classList.add("scroll-hide");
            elmnt.setAttribute("onclick", "setActive(" + String(Number(a) + 1) + ")");
            elmnt.id = whitelist.members[a].uuid;

            const imgChild = document.createElement("img");
            imgChild.src = avatars[a];
            const txtChild = document.createElement("h3");
            txtChild.innerHTML = whitelist.members[a].tag;

            elmnt.appendChild(imgChild);
            elmnt.appendChild(txtChild);
            scrollContent.appendChild(elmnt); 
        }
        
    }
    if (avatars.length < minAvatars) {
        for(i = avatars.length; i < minAvatars; i++) {
            const elmnt = document.createElement("div");
            elmnt.classList.add("scroll-element");
            elmnt.classList.add("elempty");

            const txtChild = document.createElement("p");
            txtChild.innerHTML = "";

            elmnt.appendChild(txtChild);
            scrollContent.appendChild(elmnt);  
        }
    }
    setScroll(scrollIndex);
}

function fillTooltip(toolId, tt) {
    let ind = 0;
    for(i = 0; i < gears.length; i++) {
        if(gears[i].id === toolId) { ind = i; }
    }

    const par = document.querySelector("#" + toolId);
    const e = equip[ind];
    const g = playerData.players[activePlayer - 1].equipment[e];
    

    if(/*e === "charm" ||*/ e === "blue_trinket" || e === "red_trinket") {
        /* Clears */
        if(tt.querySelector("#tt-info") !== null) { tt.querySelector("#tt-info").remove() }
        if(tt.querySelector("#tt-imp") !== null) { tt.querySelector("#tt-imp").remove() }
        if(tt.querySelector("#tt-pfx") !== null) { tt.querySelector("#tt-pfx").remove() }
        if(tt.querySelector("#tt-sfx") !== null) { tt.querySelector("#tt-sfx").remove() }
        
        /* Title */
        const title = tt.querySelector("#tt-title");
        title.innerHTML = par.querySelector(".gear-label").innerHTML;
        switch(e) {
            case "charm":
                break;
            case "blue_trinket":
                title.style.color = "#326bfc";
                tt.style.borderColor = "#326bfc";
                break;
            case "red_trinket":
                title.style.color = "#fc4a32";
                tt.style.borderColor = "#fc4a32";
                break;
        }

        /* Description */
        if(tt.querySelector("#tt-des") !== null) {
            const des = tt.querySelector("#tt-des");
            des.querySelector("p").innerHTML = trinkets.trinkets[g.gearData.attributes[1].value.replace("the_vault:", "")].text;
        } else {
            const des = document.createElement("div");
            des.id = "tt-des";
            const txt = document.createElement("p");
            txt.innerHTML = trinkets.trinkets[g.gearData.attributes[1].value.replace("the_vault:", "")].text;
            des.appendChild(txt);
            tt.appendChild(des);
        }
    } else {
        /* Border */
        tt.style.borderColor = (g.gearData.rarity === "SCRAPPY") ? "#555555" : textRarity[g.gearData.rarity];

        /* Clears */
        if(tt.querySelector("#tt-des") !== null) { tt.querySelector("#tt-des").remove() }

        /* Grabs */
        if(tt.querySelector("#tt-imp") !== null) { var imp = tt.querySelector("#tt-imp") }
        if(tt.querySelector("#tt-pfx") !== null) { var pfx = tt.querySelector("#tt-pfx") }
        if(tt.querySelector("#tt-sfx") !== null) { var sfx = tt.querySelector("#tt-sfx") }

        /* Title */
        const title = tt.querySelector("#tt-title");
        title.innerHTML = par.querySelector(".gear-label").innerHTML;
        title.style.color = (g.gearData.rarity === "SCRAPPY") ? "#fdf1db" : textRarity[g.gearData.rarity];

        /* Basic Info */
        if(tt.querySelector("#tt-info") !== null) {
            /* Level */
            const lv = tt.querySelector("#tt-lv");
            lv.innerHTML = g.gearData.level;
    
            /* Rarity */
            const rt = tt.querySelector("#tt-rt");
            rt.innerHTML = g.gearData.rarity.charAt(0) + g.gearData.rarity.substring(1).toLowerCase();
            rt.style.color = (g.gearData.rarity === "SCRAPPY") ? "#fdf1db" : textRarity[g.gearData.rarity];
    
            /* Repairs */
            const rp = tt.querySelector("#tt-rp");
            rp.innerHTML = String(g.gearData.maxRepairs - g.gearData.usedRepairs) + " / " + g.gearData.maxRepairs;
        } else {
            const info = document.createElement("div");
            info.id = "tt-info";
            /* Level */
            const lvInfo = document.createElement("p");
            const lvI1 = document.createElement("span");
            lvI1.innerHTML = "Level: ";
            const lvI2 = document.createElement("span");
            lvI2.id = "tt-lv";
            lvI2.innerHTML = g.gearData.level;
            lvInfo.appendChild(lvI1);
            lvInfo.appendChild(lvI2);

            /* Rarity */
            const rarityInfo = document.createElement("p");
            const lvR1 = document.createElement("span");
            lvR1.innerHTML = "Rarity: ";
            const lvR2 = document.createElement("span");
            lvR2.id = "tt-rt";
            lvR2.innerHTML = g.gearData.rarity.charAt(0) + g.gearData.rarity.substring(1).toLowerCase();
            lvR2.style.color = (g.gearData.rarity === "SCRAPPY") ? "#fdf1db" : textRarity[g.gearData.rarity];
            rarityInfo.appendChild(lvR1);
            rarityInfo.appendChild(lvR2);

            /* Repairs */
            const repairInfo = document.createElement("p");
            const lvP1 = document.createElement("span");
            lvP1.innerHTML = "Repairs: ";
            const lvP2 = document.createElement("span");
            lvP2.id = "tt-rp";
            lvP2.innerHTML = String(g.gearData.maxRepairs - g.gearData.usedRepairs) + " / " + g.gearData.maxRepairs;
            repairInfo.appendChild(lvP1);
            repairInfo.appendChild(lvP2);

            info.appendChild(lvInfo);
            info.appendChild(rarityInfo);
            info.appendChild(repairInfo);
            const br = document.createElement("br");
            info.appendChild(br);
            tt.appendChild(info);
        }

        /* Implicits */
        if(tt.querySelector("#tt-imp") !== null) {
            const impL = imp.querySelector("ul");
            if(g.gearData.implicits.length > 0) {
                impL.replaceChildren();
                for(i = 0; i < g.gearData.implicits.length; i++) {
                    const mod = g.gearData.implicits[i];
                    const modC = "#" + mod.display.color.toString(16);
                    const modT = mod.display.elements.toString().replaceAll(",", "");
                    const impM = document.createElement("li");
                    
                    impM.style.color = modC;
                    impM.innerHTML = modT;
                    impL.appendChild(impM);
                }
            } else {
                imp.remove();
            }
        } else {
            if(g.gearData.implicits.length > 0) {
                imp = document.createElement("div");
                imp.id = "tt-imp";
                const impT = document.createElement("p");
                impT.innerHTML = "Implicits:";
                const impL = document.createElement("ul");

                for(i = 0; i < g.gearData.implicits.length; i++) {
                    const mod = g.gearData.implicits[i];
                    const modC = "#" + mod.display.color.toString(16);
                    const modT = mod.display.elements.toString().replaceAll(",", "");
                    const impM = document.createElement("li");
                    
                    impM.style.color = modC;
                    impM.innerHTML = modT;
                    impL.appendChild(impM);
                }
                imp.appendChild(impT);
                imp.appendChild(impL);
                if(tt.querySelector("#tt-pfx") !== null) {
                    let br = document.createElement("br");
                    imp.appendChild(br);
                    tt.insertBefore(imp, pfx);
                } else if(tt.querySelector("#tt-sfx") !== null) {
                    let br = document.createElement("br");
                    imp.appendChild(br);
                    tt.insertBefore(imp, sfx);
                } else {
                    tt.appendChild(imp);
                }
            }
        }
        
        /* Prefixes */
        if(tt.querySelector("#tt-pfx") !== null) {
            const pfxL = pfx.querySelector("ul");
            if(g.gearData.prefixes.length > 0) {
                pfxL.replaceChildren();
                for(i = 0; i < g.gearData.prefixes.length; i++) {
                    const mod = g.gearData.prefixes[i];
                    const modC = "#" + mod.display.color.toString(16);
                    const modT = mod.display.elements.toString().replaceAll(",", "");
                    const pfxM = document.createElement("li");
                    
                    pfxM.style.color = modC;
                    pfxM.innerHTML = modT;
                    pfxL.appendChild(pfxM);
                }
            } else {
                pfx.remove();
            }
        } else {
            if(g.gearData.prefixes.length > 0) {
                pfx = document.createElement("div");
                pfx.id = "tt-pfx";
                const pfxT = document.createElement("p");
                pfxT.innerHTML = "Prefixes:";
                const pfxL = document.createElement("ul");

                for(i = 0; i < g.gearData.prefixes.length; i++) {
                    const mod = g.gearData.prefixes[i];
                    const modC = "#" + mod.display.color.toString(16);
                    const modT = mod.display.elements.toString().replaceAll(",", "");
                    const pfxM = document.createElement("li");
                    
                    pfxM.style.color = modC;
                    pfxM.innerHTML = modT;
                    pfxL.appendChild(pfxM);
                }
                pfx.appendChild(pfxT);
                pfx.appendChild(pfxL);
                if(tt.querySelector("#tt-sfx") !== null) {
                    let br = document.createElement("br");
                    pfx.appendChild(br);
                    tt.insertBefore(pfx, sfx);
                } else {
                    tt.appendChild(pfx);
                }
            }
        }

        /* Suffixes */
        if(tt.querySelector("#tt-sfx") !== null) {
            const sfxL = sfx.querySelector("ul");
            if(g.gearData.suffixes.length > 0) {
                sfxL.replaceChildren();
                for(i = 0; i < g.gearData.suffixes.length; i++) {
                    const mod = g.gearData.suffixes[i];
                    const modC = "#" + mod.display.color.toString(16);
                    const modT = mod.display.elements.toString().replaceAll(",", "");
                    const sfxM = document.createElement("li");
                    
                    sfxM.style.color = modC;
                    sfxM.innerHTML = modT;
                    sfxL.appendChild(sfxM);
                }
            } else {
                sfx.remove();
            }
        } else {
            if(g.gearData.suffixes.length > 0) {
                sfx = document.createElement("div");
                sfx.id = "tt-sfx";
                const sfxT = document.createElement("p");
                sfxT.innerHTML = "Suffixes:";
                const sfxL = document.createElement("ul");

                for(i = 0; i < g.gearData.suffixes.length; i++) {
                    const mod = g.gearData.suffixes[i];
                    const modC = "#" + mod.display.color.toString(16);
                    const modT = mod.display.elements.toString().replaceAll(",", "");
                    const sfxM = document.createElement("li");
                    
                    sfxM.style.color = modC;
                    sfxM.innerHTML = modT;
                    sfxL.appendChild(sfxM);
                }
                sfx.appendChild(sfxT);
                sfx.appendChild(sfxL);

                tt.appendChild(sfx);
            }
        }
    } 
    par.appendChild(tt);
    tt.classList.add("active-tooltip");
    tt.style.display = "block";
    setTimeout(function (o) { o.style.opacity = 1 }, 50, o = tt);
}

function advStats() {
    let pDat = playerData.players[activePlayer-1];
    var n;

    Object.keys(advStatInfo).forEach((i) => {
        const e = advStatInfo[i];
        const s = document.querySelector("#" + i);
        if(s.classList.contains("vanilla-stat")) {
            n = pDat.vanillaAttributes[e];
            n *= (s.classList.contains("stat-pct") ? 100 : 1);
            n *= s.classList.contains("stat-r1") ? 10 : 1;
            n *= s.classList.contains("stat-r2") ? 100 : 1;
            n = Math.round(n);
            n /= s.classList.contains("stat-r1") ? 10 : 1;
            n /= s.classList.contains("stat-r2") ? 100 : 1;
            s.innerHTML = n + (s.classList.contains("stat-pct") ? "%" : "");
        } else {
            n = pDat.gearAttributes[e];
            n *= (s.classList.contains("stat-pct") ? 100 : 1);
            n *= s.classList.contains("stat-r1") ? 10 : 1;
            n *= s.classList.contains("stat-r2") ? 100 : 1;
            n = Math.round(n);
            n /= s.classList.contains("stat-r1") ? 10 : 1;
            n /= s.classList.contains("stat-r2") ? 100 : 1;
            s.innerHTML = n + (s.classList.contains("stat-pct") ? "%" : "");
        }
    });
}

function hideTooltip() {
    tt.style.opacity = 0;
    /*setTimeout(function(o) { o.style.display = "none"}, 400, o = tt);*/
    tt.classList.remove("active-tooltip");
}

function moveTooltip(e) {
    const t = document.querySelector(".active-tooltip");
    const m = t.parentElement.classList.contains("box-right") ? -1 : 0.05;
    t.style.left = e.pageX + 'px';
    t.style.top = e.pageY + 5 + 'px';
}

function statSwap(id) {
    switch(id) {
        case 0:
            document.querySelectorAll(".basic-stats").forEach((e) => { e.style.display = "block" });
            document.querySelectorAll(".adv-stats").forEach((e) => { e.style.display = "none" });
            document.querySelectorAll(".abilities").forEach((e) => { e.style.display = "none" });

            document.querySelector("#armory-header-stats").innerHTML = "Statistics";
            document.querySelector("#armory-header-gear").innerHTML = "Vault Gear";
            break;
        case 1:
            advStats();

            document.querySelectorAll(".basic-stats").forEach((e) => { e.style.display = "none" });
            document.querySelectorAll(".adv-stats").forEach((e) => { e.style.display = "block" });
            document.querySelectorAll(".abilities").forEach((e) => { e.style.display = "none" });

            document.querySelector("#armory-header-stats").innerHTML = "Vault Statistics";
            document.querySelector("#armory-header-gear").innerHTML = "Detailed Statistics";
            break;
        case 2:
            document.querySelectorAll(".basic-stats").forEach((e) => { e.style.display = "none" });
            document.querySelectorAll(".adv-stats").forEach((e) => { e.style.display = "none" });
            document.querySelectorAll(".abilities").forEach((e) => { e.style.display = "block" });

            document.querySelector("#armory-header-stats").innerHTML = "Offensive/Buff Abilities";
            document.querySelector("#armory-header-gear").innerHTML = "Defensive/Movement/Other Abilities";
    }
}

function popModal(evt) {
    const id = evt.currentTarget.abId;
    const modal = document.querySelector("#armory-modal");
    const i = abKeys.indexOf(id);
    let nI;
    let maxLvs = [], lvs = [];

    /* Remove stuff */
    modal.querySelectorAll(".ability-block").forEach((e) => { e.remove() });
    
    /* Name */
    modal.querySelector("h1").innerHTML = abilities[id].name;

    modal.style.display = "block";
    setTimeout(() => { modal.style.backgroundColor = "rgba(0, 0, 0, 0.6" }, 50);
    /*modal.style.backgroundColor = "rgba(0, 0, 0, 0.6)";*/

    if(abKeys[i+1] === undefined) {
        nI = i+1;
    } else {
        for(let k = i+1; k < abKeys.length; k++) {
            if(abKeys[k].includes("Base")) { 
                nI = k;
                break;
            }
        }
    }
    

    for(let k = i; k < nI; k++) {
        a = abilities[abKeys[k]];
        const pLev = playerData.players[activePlayer - 1].abilities[abKeys[k]];
        maxLvs.push(a.maxLevels);
        lvs.push(pLev);

        const abilityBlock = document.createElement("div");
        abilityBlock.classList.add("ability-block");
        abilityBlock.ab = abKeys[k];

        const box = document.createElement("div");
        box.classList.add("modal-box");

        const icon = document.createElement("div");
        icon.classList.add("modal-icon");
        if(pLev === undefined) { icon.classList.add("grey-box") }
        icon.style.backgroundImage = "url(" + spritePrefix + "abilities/" + a.id + ".png)"

        const barContainer = document.createElement("div");
        barContainer.style.position = "relative";

        const lvBar = document.createElement("div");
        lvBar.style.height = "20px";
        lvBar.style.width = "80%";
        lvBar.style.backgroundColor = "rgba(34, 34, 34, 0)";
        lvBar.style.border = "5px solid #555555";
        lvBar.style.display = "flex";
        lvBar.style.position = "absolute";

        for(let l = 0; l < a.maxLevels; l++) {
            const lvSeg = document.createElement("div");
            lvSeg.style.width = (100 / a.maxLevels) + "%";
            lvSeg.style.border = "2px solid white";
            lvSeg.style.textAlign = "center";

            /*lvSeg.innerHTML = l + 1;*/

            if(l < pLev) {
                /*lvSeg.style.backgroundColor = "#e00543";*/
                lvSeg.style.color = "#fdf1db";
            } else {
                lvSeg.style.backgroundColor = null;
                lvSeg.style.color = "white";
            }

            lvBar.appendChild(lvSeg);
        }

        const fakeBar = document.createElement("div");
        fakeBar.style.height = "20px";
        fakeBar.style.width = "80%";
        fakeBar.style.backgroundColor = "#222222";
        fakeBar.style.border = "5px solid #555555";
        fakeBar.style.display = "flex";

        const animBar = document.createElement("div");
        animBar.classList.add("anim-bar");

        fakeBar.appendChild(animBar);

        box.appendChild(icon);

        abilityBlock.appendChild(box);
        barContainer.appendChild(lvBar);
        barContainer.appendChild(fakeBar);
        abilityBlock.appendChild(barContainer);

        modal.querySelector("#ability-levels").appendChild(abilityBlock);
    }

    setTimeout(() => {
        modal.querySelectorAll(".anim-bar").forEach((e,i) => {
            e.style.width = 100 * (lvs[i] / maxLvs[i]) + "%";
        });
    }, 50);

    modal.querySelectorAll(".ability-block").forEach((e) => {
        e.addEventListener("mouseenter", function() {
            modal.querySelector("#ability-name").innerHTML = abilities[e.ab].name;
            modal.querySelector("#ability-text").innerHTML = abilities[e.ab].text;
        });
    });

    const e = document.createEvent("HTMLEvents");
    e.initEvent("mouseenter", true, false);
    modal.querySelector(".ability-block").dispatchEvent(e);
}

jshttp.open("GET", "../db/whitelist.json");
jshttp.send();


trhttp.onload = function() {
    trinkets = JSON.parse(this.responseText);
}
trhttp.open("GET", "../db/trinkets.json");
trhttp.send();

abhttp.onload = function() {
    abilities = JSON.parse(this.responseText);
    abKeys = Object.keys(abilities);

    const labDiv = document.querySelector(".armory-sidebar-left .abilities");
    const rabDiv = document.querySelector(".armory-sidebar-right .abilities");

    let k = 0;
    let side = 'l';
    for(let i = 0; i < abKeys.length; i++) {
        a = abKeys[i];
        let base = a.includes("Base"); /* Is this a base ability */
        /* Switch sides */
        if(a == "Vein_Miner_Base") { 
            side = 'r';
            k = 0;
        } 
        /* Ordinary handler stuff */
        if(base) {
            /* Create a new row on every third */
            if(k % 3 == 0) {
                const newRow = document.createElement("div");
                newRow.classList.add("ability-row");
                if(side == 'l') {
                    labDiv.appendChild(newRow);
                } else {
                    rabDiv.appendChild(newRow);
                }
            }
            
            /* Create box */
            const boxContainer = document.createElement("div");
            boxContainer.classList.add("ability", "box-left");
            boxContainer.id = "ab-" + a.toLowerCase().replace("_", "-");

            const box = document.createElement("div");
            box.classList.add("ability-box", "grey-box");
            box.addEventListener("click", popModal);
            box.abId = a;

            const icon = document.createElement("div");
            icon.classList.add("ability-icon");
            icon.style.backgroundImage = "url(" + spritePrefix + "/abilities/" + abilities[a].id + ".png)";

            const tt = document.createElement("span");
            tt.classList.add("ability-tt");
            tt.innerHTML = abilities[a].name;

            box.appendChild(icon);
            box.appendChild(tt);
            boxContainer.appendChild(box);

            if(side == 'l') {
                const rows = labDiv.querySelectorAll(".ability-row");
                const r = rows[rows.length - 1];
                r.appendChild(boxContainer);
            } else {
                const rows = rabDiv.querySelectorAll(".ability-row");
                const r = rows[rows.length - 1];
                r.appendChild(boxContainer);
            }
            k += 1;
        }
    }
}
abhttp.open("GET", "../db/abilities.json");
abhttp.send();

window.onclick = function(evt) {
    if(evt.target == document.querySelector("#armory-modal")) {
        document.querySelector("#armory-modal").style.backgroundColor = null;
        document.querySelector("#armory-modal").style.display = "none";
    }
}

setTimeout(loadPlayers, 200);

for(let i = 0; i < gears.length; i++) {
    gears[i].addEventListener("mouseenter", function() {
        tt = document.querySelector(".gear-tooltip");
        fillTooltip(gears[i].id, tt);
        gears[i].addEventListener("mousemove", moveTooltip, false);
    });
    gears[i].addEventListener("mouseleave", function() {
        tt = document.querySelector(".gear-tooltip");
        hideTooltip(tt);
        gears[i].removeEventListener("mousemove", moveTooltip, false);
    })
}