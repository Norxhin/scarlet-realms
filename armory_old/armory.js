const jshttp = new XMLHttpRequest();
const avatarPrefix = "https://crafthead.net/avatar/";
const skinPrefix = "https://crafthead.net/armor/body/";
const spritePrefix = "https://api.vaulthunters.gg/static/sprites/"
const minAvatars = 5;
const textRarity = {
    "SCRAPPY": "black",
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
const equip = ["charm", "HEAD", "blue_trinket", "CHEST", "red_trinket", "LEGS", "belt", "FEET", "OFFHAND", "MAINHAND"];
const gears = document.getElementsByClassName("gear-item");
let whitelist, p, avatars;
let playerData = {"players": []};
let scrollIndex = 1;
let activePlayer = 1;

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
    statDmgAmount.innerHTML = "?";

    const statAbilityAmount = document.getElementById("statAbilityAmount");
    statAbilityAmount.innerHTML = pDat.gearAttributes["the_vault:ability_power"];

    const statHealthAmount = document.getElementById("statHealthAmount");
    statHealthAmount.innerHTML = pDat.vanillaAttributes["minecraft:generic.max_health"];

    const statDefenseAmount = document.getElementById("statDefenseAmount");
    statDefenseAmount.innerHTML = "?";

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
                    break;
                case "OFFHAND":
                    gIcon.style.backgroundImage = "url(" + spritePrefix + "gear/placeholders/shield.png)";
                    gLabel.innerHTML = "Vault Shield";
                    gLabel.style.color = textRarity[r];
                    gBox.style.borderColor = borderRarity[r];
                    break;
                case "MAINHAND":
                    gIcon.style.backgroundImage = "url(" + spritePrefix + "gear/placeholders/sword.png)";
                    gLabel.innerHTML = "Vault Sword";
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
                    break;
            }
        } else {
            gIcon.style.backgroundColor = "#555555";
            gLabel.innerHTML = "Empty";
            gears[i].classList.add("gear-empty");
        }
    }

    /* Advanced Stats */

    /* Tooltips */
    for(i = 0; i < gears.length; i++) {
        if(!gears[i].classList.contains("gear-empty")) { setTimeout(buildTooltip, 50, toolId = gears[i].id) }
    }
}

function loadPlayers() {
    let uuhttp = [];
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

            playerData.players.push(response);
        }
        uuhttp[i].send();
    }
    setTimeout(setActive, 50, n = scrollIndex);
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
            const txtChild = document.createElement("p");
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
            const txtChild = document.createElement("p");
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

function buildTooltip(toolId) {
    let ind = 0;
    for(i = 0; i < gears.length; i++) {
        if(gears[i].id === toolId) { ind = i; }
    }

    const par = document.getElementById(toolId);
    const e = equip[ind];
    const g = playerData.players[activePlayer - 1].equipment[e];
    const tt = document.createElement("div");
    tt.classList.add("gear-tooltip");
    tt.style.borderColor = borderRarity[g.gearData.rarity];

    if(e === "charm" || e === "blue_trinket" || e === "red_trinket") {

    } else {
        /* Title */
        const title = document.createElement("h2");
        title.innerHTML = par.getElementsByClassName("gear-label")[0].innerHTML;
        title.style.color = (g.gearData.rarity === "SCRAPPY") ? "white" : textRarity[g.gearData.rarity];
        tt.appendChild(title);
        let br = document.createElement("br");
        tt.appendChild(br);

        /* Basic Info */
        /* Level */
        const lvInfo = document.createElement("p");
        const lvI1 = document.createElement("span");
        lvI1.innerHTML = "Level: ";
        const lvI2 = document.createElement("span");
        lvI2.innerHTML = g.gearData.level;
        lvInfo.appendChild(lvI1);
        lvInfo.appendChild(lvI2);
        tt.appendChild(lvInfo);

        /* Rarity */
        const rarityInfo = document.createElement("p");
        const lvR1 = document.createElement("span");
        lvR1.innerHTML = "Rarity: ";
        const lvR2 = document.createElement("span");
        lvR2.innerHTML = g.gearData.rarity.charAt(0) + g.gearData.rarity.substring(1).toLowerCase();
        lvR2.style.color = textRarity[g.gearData.rarity];
        rarityInfo.appendChild(lvR1);
        rarityInfo.appendChild(lvR2);
        tt.appendChild(rarityInfo);

        /* Repairs */
        const repairInfo = document.createElement("p");
        const lvP1 = document.createElement("span");
        lvP1.innerHTML = "Repairs: ";
        const lvP2 = document.createElement("span");
        lvP2.innerHTML = String(g.gearData.maxRepairs - g.gearData.usedRepairs) + " / " + g.gearData.maxRepairs;
        repairInfo.appendChild(lvP1);
        repairInfo.appendChild(lvP2);
        tt.appendChild(repairInfo);

        /* Implicits */
        if(g.gearData.implicits.length > 0) {
            const imp = document.createElement("div");
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

            let br = document.createElement("br");
            tt.appendChild(br);
            tt.appendChild(imp);
        }
        
        /* Prefixes */
        if(g.gearData.prefixes.length > 0) {
            const pre = document.createElement("div");
            const preT = document.createElement("p");
            preT.innerHTML = "Prefixes:";
            const preL = document.createElement("ul");
    
            for(i = 0; i < g.gearData.prefixes.length; i++) {
                const mod = g.gearData.prefixes[i];
                const modC = "#" + mod.display.color.toString(16);
                const modT = mod.display.elements.toString().replaceAll(",", "");
                const preM = document.createElement("li");
                
                preM.style.color = modC;
                preM.innerHTML = modT;
                preL.appendChild(preM);
            }
            pre.appendChild(preT);
            pre.appendChild(preL);

            let br = document.createElement("br");
            tt.appendChild(br);
            tt.appendChild(pre);
        }

        /* Suffixes */
        if(g.gearData.suffixes.length > 0) {
            const sfx = document.createElement("div");
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

            let br = document.createElement("br");
            tt.appendChild(br);
            tt.appendChild(sfx);
        }
    } 
    par.appendChild(tt);
}

function destroyTooltip(toolId) {
    const par = document.getElementById(toolId);
    const tt = par.getElementsByClassName("gear-tooltip")[0];
    tt.remove();
}

function moveTooltip(e) {
    const t = document.getElementsByClassName("active-tooltip")[0];
    const m = t.parentElement.classList.contains("box-right") ? -1 : 0.05;
    t.style.left = e.pageX + (m * 305) + 'px';
    t.style.top = e.pageY + 15 + 'px';
}

jshttp.open("GET", "../db/whitelist.json");
jshttp.send();

setTimeout(loadPlayers, 50);

for(let i = 0; i < gears.length; i++) {
    gears[i].addEventListener("mouseover", function() {
        gears[i].addEventListener("mousemove", moveTooltip, false);
        gears[i].getElementsByClassName("gear-tooltip")[0].style.display = "block";
        setTimeout(function() {
            gears[i].getElementsByClassName("gear-tooltip")[0].style.opacity = 1;
        }, 50);
        gears[i].getElementsByClassName("gear-tooltip")[0].classList.add("active-tooltip");
    });
    gears[i].addEventListener("mouseleave", function() {
        gears[i].removeEventListener("mouseover", moveTooltip, false);
        gears[i].getElementsByClassName("gear-tooltip")[0].style.opacity = 0;
        setTimeout(function() {
            gears[i].getElementsByClassName("gear-tooltip")[0].style.display = "none";
        }, 200);
        gears[i].getElementsByClassName("gear-tooltip")[0].classList.remove("active-tooltip");
    })
}