document.addEventListener("DOMContentLoaded", () => {
  // --- MODAL ACTION TEXT LETTER ANIMATION ---
  try {
    document.querySelectorAll(".modal-action-text").forEach((text) => {
      const letters = text.textContent.split("");
      text.innerHTML = "";
      letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.className = "modal-action-text-letter";
        span.style.animationDelay = `${index * 300}ms`;
        span.style.animationDuration = `${letters.length * 300 + 1000}ms`;
        span.innerHTML = letter;
        text.appendChild(span);
      });
    });
  } catch (e) {
    console.error("Error in modal action text animation:", e);
  }

  // --- MAGIC MOUSE EFFECT ---
  try {
    let start = new Date().getTime();
    const originPosition = { x: 0, y: 0 };

    const container = document.getElementById("magic-mouse-container");
    const cursor = document.getElementById("cursor");

    // WICHTIGE PRÜFUNG: Sind die Elemente für die Magic Mouse vorhanden?
    if (!container) {
      console.error(
        "Magic Mouse Error: Element with ID 'magic-mouse-container' not found!"
      );
      return; // Beendet die Magic-Mouse-Initialisierung, wenn Container fehlt
    }
    if (!cursor) {
      console.error("Magic Mouse Error: Element with ID 'cursor' not found!");
      // Magic Mouse könnte auch ohne 'cursor' noch Sterne erzeugen, aber Cursor-Bewegung fehlt
    }

    const last = {
      starTimestamp: start,
      starPosition: originPosition,
      mousePosition: originPosition,
    };

    const config = {
      starAnimationDuration: 1500,
      minimumTimeBetweenStars: 250,
      minimumDistanceBetweenStars: 75,
      glowDuration: 75,
      maximumGlowPointSpacing: 10,
      colors: ["245 245 245", "59 130 246"],
      sizes: ["1.4rem", "1rem", "0.6rem"],
      animations: ["fall-1", "fall-2", "fall-3"],
    };

    let count = 0;

    const rand = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const selectRandom = (items) => items[rand(0, items.length - 1)];

    const withUnit = (value, unit) => `${value}${unit}`;
    const px = (value) => withUnit(value, "px");
    const ms = (value) => withUnit(value, "ms");

    const calcDistance = (a, b) => {
      const diffX = b.x - a.x,
        diffY = b.y - a.y;
      return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    };

    const calcElapsedTime = (start, end) => end - start;

    // Stellt sicher, dass container nicht null ist, bevor appendChild aufgerufen wird
    const appendElement = (element) =>
      container && container.appendChild(element);
    const removeElement = (element, delay) =>
      setTimeout(
        () =>
          container &&
          container.contains(element) &&
          container.removeChild(element),
        delay
      );

    const createStar = (position) => {
      const star = document.createElement("span");
      const color = selectRandom(config.colors);
      star.className = "item fa-solid fa-block-question"; // Stelle sicher, dass diese FontAwesome-Klassen definiert sind oder durch was anderes ersetzt werden
      star.style.left = px(position.x);
      star.style.top = px(position.y);
      star.style.fontSize = selectRandom(config.sizes);
      star.style.color = `rgb(${color})`;
      star.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
      star.style.animationName = config.animations[count++ % 3];
      star.style.setProperty(
        "--star-animation-duration",
        ms(config.starAnimationDuration)
      ); // Sicherer Weg, CSS-Variablen zu setzen, falls für Animation genutzt

      appendElement(star);
      removeElement(star, config.starAnimationDuration);
    };

    const createGlowPoint = (position) => {
      const glow = document.createElement("div");
      glow.className = "glow-point";
      glow.style.left = px(position.x);
      glow.style.top = px(position.y);
      appendElement(glow);
      removeElement(glow, config.glowDuration);
    };

    const determinePointQuantity = (distance) =>
      Math.max(Math.floor(distance / config.maximumGlowPointSpacing), 1);

    const createGlow = (last, current) => {
      const distance = calcDistance(last, current);
      const quantity = determinePointQuantity(distance);
      const dx = (current.x - last.x) / quantity;
      const dy = (current.y - last.y) / quantity;
      Array.from(Array(quantity)).forEach((_, index) => {
        const x = last.x + dx * index;
        const y = last.y + dy * index;
        createGlowPoint({ x, y });
      });
    };

    const updateLastStar = (position) => {
      last.starTimestamp = new Date().getTime();
      last.starPosition = position;
    };

    const updateLastMousePosition = (position) =>
      (last.mousePosition = position);

    const adjustLastMousePosition = (position) => {
      if (last.mousePosition.x === 0 && last.mousePosition.y === 0) {
        last.mousePosition = position;
      }
    };

    const moveCursor = (e) => {
      // Stellt sicher, dass cursor nicht null ist
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    };

    const handleOnMove = (e) => {
      const mousePosition = { x: e.clientX, y: e.clientY };
      moveCursor(e);
      adjustLastMousePosition(mousePosition);
      const now = new Date().getTime();
      const hasMovedFarEnough =
        calcDistance(last.starPosition, mousePosition) >=
        config.minimumDistanceBetweenStars;
      const hasBeenLongEnough =
        calcElapsedTime(last.starTimestamp, now) >
        config.minimumTimeBetweenStars;
      if (hasMovedFarEnough || hasBeenLongEnough) {
        createStar(mousePosition);
        updateLastStar(mousePosition);
      }
      createGlow(last.mousePosition, mousePosition);
      updateLastMousePosition(mousePosition);
    };

    window.onmousemove = (e) => handleOnMove(e);
    window.ontouchmove = (e) => handleOnMove(e.touches[0]);
    document.body.onmouseleave = () => updateLastMousePosition(originPosition);
  } catch (e) {
    console.error("Error in Magic Mouse Effect:", e);
  }

  // --- BUTTON EVENT LISTENERS & SKILL BAR LOGIC ---
  try {
    // Show introduction
    const introButton = document.getElementById("show-intro-button");
    const introSection = document.getElementById("introduction");
    if (introButton && introSection) {
      introButton.addEventListener("click", () => {
        introSection.classList.toggle("hidden");
        introSection.classList.toggle("visible"); // Behalte dies bei, wenn du .visible für deine Animationen/Styles nutzt
      });
    } else {
      console.warn("Intro button or section not found.");
    }

    // Show projects
    const projectsButton = document.getElementById("show-projects-button");
    const projectsSection = document.getElementById("modal-wrapper");
    if (projectsButton && projectsSection) {
      projectsButton.addEventListener("click", () => {
        projectsSection.classList.toggle("hidden");
        projectsSection.classList.toggle("visible"); // Behalte dies bei
      });
    } else {
      console.warn("Projects button or section not found.");
    }

    // Skill Bar Logic
    const showSkillsButton = document.getElementById("show-skills-button");
    const skillsSection = document.getElementById("skills-section");

    function updateSkillBarWidths() {
      const skillFills = skillsSection?.querySelectorAll(".skill-bar-fill");
      skillFills?.forEach((fillElement) => {
        const skillLevel = fillElement.dataset.skillLevel;
        if (skillLevel) {
          fillElement.style.width = skillLevel + "%";
        } else {
          console.warn("data-skill-level Attribut fehlt für:", fillElement);
          fillElement.style.width = "0%";
        }
      });
    }

    if (showSkillsButton && skillsSection) {
      showSkillsButton.addEventListener("click", () => {
        const isSkillsHidden = skillsSection.classList.contains("hidden");
        if (isSkillsHidden) {
          skillsSection.classList.remove("hidden");
          skillsSection.classList.add("visible");
          setTimeout(updateSkillBarWidths, 50);
        } else {
          skillsSection.classList.add("hidden");
          skillsSection.classList.remove("visible");
        }
      });
    } else {
      console.warn("Skills button or section not found.");
    }
  } catch (e) {
    console.error("Error in button/skills event listeners:", e);
  }
}); // Ende von DOMContentLoaded
