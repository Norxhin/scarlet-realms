function openTab(tabName) {
    var i, tabcontent, tablinks, activetab;
    const img = {
        Barowyn: ["./img/recrafted-img2.png", "./img/recrafted-img-end.png"],
        VH: ["./img/vh-img-combat.png", "./img/vh-img-crates.png"],
        Vanilla: ["./img/recrafted-img1.png", "./img/recrafted-img1.png"]
    };
    const capHeads = {
        Barowyn: ["Modified World Generation", "New Experiences"],
        VH: ["Challenging Combat", "Epic Rewards"],
        Vanilla: ["Classic Minecraft", "Creativity Unlocked"]
    };
    const captions = {
        Barowyn: [
            "The ModWorld uses a custom terrain datapack to generate stunning landscapes and thrilling environments. The terrain generation is built on the Terra mod, which offers an astounding amount of configurability. The world contains many new biomes to explore, with new blocks and ores to be found!",
            "This redefined Minecraft experience leaves no stone unturned, adding new touches to almost every facet of the underlying game. The modpack includes everything from new crafting and forging systems to new structures, challenges, and materials."
        ],
        VH: [
            "Test your might by attempting to complete challenging vaults. While there is a primary objective for each vault, your attention will constantly be pulled by the many new and varying mobs you will encounter throughout the dungeons. As the vault difficulty increases, so too do the mobs. While mobs will simply get stronger at first, the higher difficulties will introduce new modifiers and special abilities that mobs can use in their quest to end your runs early.",
            "Of course, the greatest part of any quest is collecting the loot. Throughout your time in the dungeons, you will come across many different kinds of loot chests containing rare and unique drops. These can range from exotic crafting materials to consumables and even rare vault gear. If you are able to successfully complete the vault's primary objective and escape before time runs out, you will be granted additional high-powered loot as a bonus reward."
        ],
        Vanilla: [
            "Minecraft: in its original form. The vanilla server provides the classic experience for those who like to spend their days mining and crafting like the good old days. While the server currently uses the most recent Minecraft version (1.20.2), the ultimate plan is to rotate through older versions to deliver a more 'legacy' vanilla experience.",
            "What will you build?"
        ]
    };
    if(document.getElementsByClassName("tl-" + tabName.toLowerCase())[0].style.backgroundColor != 'rgb(119, 119, 119)') {
        tabcontent = document.getElementsByClassName("tabcontent");
        for(i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
    
        tablinks = document.getElementsByClassName("tablink");
        for(i = 0; i < tablinks.length; i++) {
            tablinks[i].style.backgroundColor = "";
        }
    
        activetab = document.getElementsByClassName("tl-" + tabName.toLowerCase());
        for(i = 0; i < activetab.length; i++) {
            activetab[i].style.backgroundColor = "#777";
        }
    
        document.getElementById(tabName).style.display = "flex";
    
        var leftBox = document.getElementById("left-img-box");
        var rightBox = document.getElementById("right-img-box");
    
        leftBox.style.opacity = "0";
        rightBox.style.opacity = "0";
        leftBox.getElementsByTagName("img")[0].src = img[tabName][0];
        rightBox.getElementsByTagName("img")[0].src = img[tabName][1];
        setTimeout(() => {leftBox.style.transition = "all 1s";}, 20);
        setTimeout(() => {rightBox.style.transition = "all 1s";}, 20);
        setTimeout(() => {leftBox.style.opacity = "1";}, 100);
        setTimeout(() => {rightBox.style.opacity = "1";}, 100);
        setTimeout(() => {leftBox.style.transition = "none";}, 1000);
        setTimeout(() => {rightBox.style.transition = "none";}, 1000);
    
        var leftCap = document.getElementById("left-caption-box");
        var rightCap = document.getElementById("right-caption-box");
    
        leftCap.style.right = "-100vw";
        rightCap.style.left = "-100vw";
        leftCap.getElementsByTagName("h1")[0].innerHTML = capHeads[tabName][0];
        leftCap.getElementsByTagName("p")[0].innerHTML = captions[tabName][0];
        rightCap.getElementsByTagName("h1")[0].innerHTML = capHeads[tabName][1];
        rightCap.getElementsByTagName("p")[0].innerHTML = captions[tabName][1];
        setTimeout(() => {leftCap.style.transition = "all 1s";}, 20);
        setTimeout(() => {rightCap.style.transition = "all 1s";}, 20);
        setTimeout(() => {leftCap.style.right = "12vw";}, 100);
        setTimeout(() => {rightCap.style.left = "12vw";}, 100);
        setTimeout(() => {leftCap.style.transition = "none";}, 1000);
        setTimeout(() => {rightCap.style.transition = "none";}, 1000);
    }
}

document.getElementById("defaultOpen").click();