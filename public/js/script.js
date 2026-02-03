/* =========================================================
   FIX BROKEN GIFS ON LOAD (GitHub Pages is case-sensitive)
   This force-loads the correct-cased GIF filenames even if
   index.html points to lowercase versions.
   ========================================================= */
const FIXED_GIFS = {
    banner: "public/images/RedPandaFlowers.gif",
    corner: "public/images/SnoopySmacked.gif",
};

function preloadImages(urls) {
    urls.forEach((url) => {
        const img = new Image();
        img.src = url;
    });
}

function fixStartGifs() {
    // Fix banner gif
    const banner = document.getElementById("banner");
    if (banner) {
        // If src is missing OR contains the lowercase wrong name, force correct
        const srcAttr = (banner.getAttribute("src") || "").toLowerCase();
        if (!srcAttr || srcAttr.includes("redpandaflowers")) {
            banner.setAttribute("src", FIXED_GIFS.banner);
        }
        // If it fails to load, try the correct one again
        banner.onerror = () => {
            banner.onerror = null;
            banner.src = FIXED_GIFS.banner;
        };
    }

    // Fix corner gifs
    const corners = document.querySelectorAll(".corner-gif");
    corners.forEach((img) => {
        const srcAttr = (img.getAttribute("src") || "").toLowerCase();
        if (!srcAttr || srcAttr.includes("snoopysmacked")) {
            img.setAttribute("src", FIXED_GIFS.corner);
        }
        img.onerror = () => {
            img.onerror = null;
            img.src = FIXED_GIFS.corner;
        };
    });
}

// Run as early as possible (your script is at the bottom, but this is safe either way)
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        preloadImages([FIXED_GIFS.banner, FIXED_GIFS.corner]);
        fixStartGifs();
    });
} else {
    preloadImages([FIXED_GIFS.banner, FIXED_GIFS.corner]);
    fixStartGifs();
}

/* =========================================================
   YOUR ORIGINAL CODE
   ========================================================= */

const answers_no = {
    english: [
        "No",
        "Are you sure?",
        "Are you really sure??",
        "Are you really really sure???",
        "plss:(",
        "pls:(((",

    ],
    mandarin: [
        "不",
        "你确定吗？",
        "你真的确定？？",
        "你真的真的确定？？？",
        "求你了:(",
        "拜托啦:(((",
    ],
    cantonese: [
        "唔",
        "你肯定嗎？",
        "你真係肯定？？",
        "你真係真係肯定？？？",
        "求你啦:(",
        "拜託啦:(((",
    ]
};

const answers_yes = {
    "english": "Yes",
    "mandarin": "好",
    "cantonese": "好啊"
};

let language = "english"; // Default language is English
const no_button = document.getElementById('no-button');
const yes_button = document.getElementById('yes-button');
let i = 1;
let size = 120; // starting width/height for buttons (px)
let clicks = 0;
// Build an explicit sizes array that ends with 0 so the button will reach 0 exactly
function buildSizeSteps(total) {
    const INITIAL = 120;
    if (total <= 1) return [0];
    const arr = [];
    for (let k = 0; k < total; k++) {
        // evenly spaced steps from INITIAL down to 0, inclusive
        const value = Math.round(INITIAL * (1 - k / (total - 1)));
        arr.push(value);
    }
    return arr;
}

let sizeSteps = buildSizeSteps(answers_no[language].length);

no_button.addEventListener('click', () => {
    // Change banner source
    let banner = document.getElementById('banner');
    if (clicks === 0) {
        banner.src = "public/images/SadSnoopy.gif";
        refreshBanner();
    }
    clicks++;
    // Use the precomputed sizeSteps array so the final value is exactly 0
    // switch corner gifs to a sad image when No is clicked
    try {
        const cornerGifs = document.querySelectorAll('.corner-gif');
        cornerGifs.forEach(img => { img.src = './public/images/SadPanda.gif'; });
    } catch (e) {
        // ignore if corners not present
    }
    try { spawnSadFaces(6); } catch (e) {}
    const idx = Math.min(clicks, sizeSteps.length - 1); // clicks starts at 1 on first click
    size = sizeSteps[idx];
    no_button.style.width = `${size}px`;
    const newHeight = Math.max(0, Math.round((size / 120) * 40));
    no_button.style.height = `${newHeight}px`;
    if (size === 0) {
        no_button.style.opacity = '0';
        setTimeout(() => { no_button.style.display = 'none'; }, 300);
    }
    let total = answers_no[language].length;
    // change button text
    // The No button should always read the first (No) entry; put the changing messages on the Yes button
    if (i < total - 1) {
        yes_button.innerHTML = answers_no[language][i];
        i++;
    } else if (i === total - 1) {
        // Final step: update Yes button with the last message, then reset state (no alert)
        yes_button.innerHTML = answers_no[language][i];
        i = 1;
        // Keep No button label as the base "No"
        no_button.innerHTML = answers_no[language][0];
        // Reset yes button to default yes text after a short delay so users see the last message
        setTimeout(() => {
            yes_button.innerHTML = answers_yes[language];
            yes_button.style.height = "40px";
            yes_button.style.width = "120px";
        }, 800);
        // Reset no button visual size and make sure it is visible again
        size = 120;
        no_button.style.display = 'inline-flex';
        // restore opacity and size (use a timeout so the display change applies before transition)
        setTimeout(() => {
            no_button.style.opacity = '1';
            no_button.style.width = `${size}px`;
            no_button.style.height = `40px`;
        }, 10);
    }
});

yes_button.addEventListener('click', () => {
    // change banner gif path
    let banner = document.getElementById('banner');
    banner.src = "public/images/yes.gif";
    refreshBanner();
    // hide buttons div
    let buttons = document.getElementsByClassName('buttons')[0];
    buttons.style.display = "none";
    // show message div
    // switch corner gifs to a happy image when Yes is clicked
    try {
        const cornerGifs = document.querySelectorAll('.corner-gif');
        cornerGifs.forEach(img => { img.src = './public/images/HappyCat.gif'; });
    } catch (e) {
        // ignore if corners not present
    }
    let message = document.getElementsByClassName('message')[0];
    message.style.display = "block";
    // start confetti
    try {
        startConfetti();
    } catch (e) {}
    // add banner pulse
    try {
        document.querySelector('.banner-gif').classList.add('pulse');
    } catch (e) {}
    // type out localized success message
    try {
        const successMessage = (language === 'mandarin') ? "耶！！我爱你！！ <3333" : (language === 'cantonese') ? "耶！！我愛你！！ <3333" : "Yay!! I love you!! <3333";
        typeSuccessMessage(successMessage, 40);
    } catch (e) {}
    // spawn a burst of floating hearts
    try { spawnFloatingHearts(18); } catch (e) {}
});

// Keyboard shortcuts: Enter or Y = Yes, N = No
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key.toLowerCase() === 'y') {
        yes_button.click();
    } else if (e.key.toLowerCase() === 'n') {
        no_button.click();
    }
});

// Spawn floating heart elements at random positions near the center or as a burst
function spawnFloatingHearts(count = 6) {
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.style.left = `${50 + (Math.random() - 0.5) * 30}%`;
        heart.style.top = `${50 + (Math.random() - 0.5) * 10}%`;
        heart.style.color = ['#ff6b9b','#ff9fd1','#e6a8ff','#ffd1dc'][Math.floor(Math.random()*4)];
        heart.textContent = '💜';
        document.body.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 2400 + Math.random() * 600);
    }
}

// Ambient hearts every few seconds
setInterval(() => { spawnFloatingHearts(2); }, 3500);

// Spawn sad face emojis near the No button when user clicks No
function spawnSadFaces(count = 6) {
    const rect = no_button.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'floating-heart';
        s.style.left = `${rect.left + rect.width/2 + (Math.random()-0.5)*80}px`;
        s.style.top = `${rect.top + (Math.random()-0.5)*20}px`;
        s.style.color = '#6b6bff';
        s.textContent = '☹️';
        document.body.appendChild(s);
        setTimeout(() => { s.remove(); }, 1600 + Math.random() * 600);
    }
}

/* --- Confetti --- */
const confettiCanvas = document.getElementById('confetti-canvas');
let confettiCtx = null;
if (confettiCanvas) {
    confettiCtx = confettiCanvas.getContext('2d');
    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function randomRange(a, b) { return Math.random() * (b - a) + a; }

function startConfetti() {
    if (!confettiCtx) return;
    const particles = [];
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#ff9ff3'];
    const count = 80;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: randomRange(0, confettiCanvas.width),
            y: randomRange(-confettiCanvas.height * 0.2, 0),
            vx: randomRange(-2, 2),
            vy: randomRange(2, 6),
            size: randomRange(6, 12),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: randomRange(0, Math.PI * 2),
            spin: randomRange(-0.1, 0.1),
            life: 0
        });
    }

    let t0 = performance.now();
    function drawHeart(ctx, x, y, size, color, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(size / 20, size / 20);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -3, -5, -12, -12, -12);
        ctx.bezierCurveTo(-25, -12, -25, 5, -25, 5);
        ctx.bezierCurveTo(-25, 18, -12, 25, 0, 35);
        ctx.bezierCurveTo(12, 25, 25, 18, 25, 5);
        ctx.bezierCurveTo(25, 5, 25, -12, 12, -12);
        ctx.bezierCurveTo(5, -12, 0, -3, 0, 0);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    function frame(now) {
        const dt = (now - t0) / 1000; t0 = now;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.06; // gravity
            p.rotation += p.spin;
            p.life += dt;
            drawHeart(confettiCtx, p.x, p.y, p.size, p.color, p.rotation);
        }
        // remove off-screen particles
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].y > confettiCanvas.height + 50) particles.splice(i, 1);
        }
        if (particles.length > 0) requestAnimationFrame(frame);
        else confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
    requestAnimationFrame(frame);
}

// small chime sound using WebAudio API
// (sound removed by request)

// typing animation for success message
function typeSuccessMessage(text, speed = 50) {
    const el = document.getElementById('success-message');
    el.textContent = '';
    let k = 0;
    const iv = setInterval(() => {
        el.textContent += text[k] || '';
        k++;
        if (k > text.length) clearInterval(iv);
    }, speed);
}

function refreshBanner() {
    // Reload banner gif to force load  
    let banner = document.getElementById('banner');
    let src = banner.src;
    banner.src = '';
    banner.src = src;
}

function changeLanguage() {
    const selectElement = document.getElementById("language-select");
    const selectedLanguage = selectElement.value;
    language = selectedLanguage;

    // Rebuild size steps for the newly selected language and reset button visuals
    sizeSteps = buildSizeSteps(answers_no[language].length);
    clicks = 0;
    size = sizeSteps[0] || 120;
    no_button.style.display = 'inline-flex';
    no_button.style.opacity = '1';
    no_button.style.width = `${size}px`;
    no_button.style.height = `${Math.max(0, Math.round((size / 120) * 40))}px`;

    // Update question heading
    const questionHeading = document.getElementById("question-heading");
    if (language === "mandarin") {
        questionHeading.textContent = "你愿意做我的情人吗?";
    } else if (language === "cantonese") {
        questionHeading.textContent = "你願意當我嘅情人嗎？";
    } else {
        questionHeading.textContent = "Will you be my valentine?";
    }

    // Reset yes button text
    yes_button.innerHTML = answers_yes[language];

    // Reset button text to first in the new language
    if (clicks === 0) {
        no_button.innerHTML = answers_no[language][0];
    } else {
        no_button.innerHTML = answers_no[language][clicks];
    }

    // Update success message
    const successMessage = document.getElementById("success-message");
    if (language === "mandarin") {
        successMessage.textContent = "耶！！我爱你！！ <3333";
    } else if (language === "cantonese") {
        successMessage.textContent = "耶！！我愛你！！ <3333";
    } else {
        successMessage.textContent = "Yay!! I love you!! <3333";
    }
}
