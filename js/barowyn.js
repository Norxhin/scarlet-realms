let slideIndex = 1;
let instSlideIndex = 1;
showSlides(slideIndex);
showSlidesInst(instSlideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}
function plusSlidesInst(n) {
    showSlidesInst(instSlideIndex += n);
}

function currentSlide(n) {
    console.log(n);
    showSlides(slideIndex = n);
}
function currentSlideInst(n) {
    showSlidesInst(instSlideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("slideshow-dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-slide", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active-slide";
}
function showSlidesInst(n) {
    let i;
    let slides = document.getElementsByClassName("inst-slide");
    let dots = document.getElementsByClassName("inst-slideshow-dot");
    if (n > slides.length) {instSlideIndex = 1}
    if (n < 1) {instSlideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-slide", "");
    }
    slides[instSlideIndex-1].style.display = "block";
    dots[instSlideIndex-1].className += " active-slide";
}

var acc = document.getElementsByClassName("accordion-btn");
for(i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("accordion-active");

        var panel = this.nextElementSibling;
        if(panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    })
}