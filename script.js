const elapsedEl = document.querySelector("[data-elapsed]");
const petalsField = document.querySelector(".petals");
const sweetAlbumTrigger = document.querySelector("[data-open-album='sweet']");
const albumOverlay = document.querySelector("[data-album-overlay]");
const mapOverlay = document.querySelector("[data-overlay='map']");
const momentsOverlay = document.querySelector("[data-overlay='moments']");
const albumClosers = document.querySelectorAll("[data-album-close]");
const generalOverlayTriggers = document.querySelectorAll("[data-open-overlay]");
const generalOverlayClosers = document.querySelectorAll("[data-close-overlay]");
const albumView = document.querySelector("[data-album='sweet']");
const albumImg = document.querySelector(".album-view__img");
const albumPrev = document.querySelector("[data-album-prev]");
const albumNext = document.querySelector("[data-album-next]");
const albumCounter = document.querySelector("[data-album-counter]");
const albumStrip = document.querySelector("[data-album-strip]");
const albumCaption = document.querySelector("[data-album-caption]");

const pad2 = (value) => String(value).padStart(2, "0");

const startAt = new Date(2025, 5, 24, 0, 0, 0); // 2025-06-24 (local time)

const renderElapsed = () => {
  if (!elapsedEl) {
    return;
  }

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - startAt.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  elapsedEl.textContent = `${days}天 ${pad2(hours)}小时 ${pad2(minutes)}分钟 ${pad2(seconds)}秒`;
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const createPetals = (count = 28) => {
  if (!petalsField) {
    return;
  }

  petalsField.replaceChildren();

  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${randomBetween(-5, 105)}vw`;
    petal.style.setProperty("--size", `${randomBetween(8, 16)}px`);
    petal.style.setProperty("--alpha", `${randomBetween(0.45, 0.95)}`);
    petal.style.setProperty("--duration", `${randomBetween(9, 15)}s`);
    petal.style.setProperty("--delay", `${randomBetween(-15, 0)}s`);
    petal.style.setProperty("--drift", `${randomBetween(-80, 80)}px`);
    petal.style.setProperty("--spin", `${randomBetween(-180, 180)}deg`);
    petalsField.appendChild(petal);
  }
};

renderElapsed();
createPetals();
setInterval(renderElapsed, 1000);

const setLocked = (locked) => {
  document.body.classList.toggle("is-locked", locked);
};

const openAlbum = () => {
  if (!albumOverlay) {
    return;
  }
  albumOverlay.hidden = false;
  setLocked(true);
};

const closeAlbum = () => {
  if (!albumOverlay) {
    return;
  }
  albumOverlay.hidden = true;
  setLocked(false);
};

const openMapOverlay = () => {
  if (!mapOverlay) {
    return;
  }
  mapOverlay.hidden = false;
  setLocked(true);
};

const closeMapOverlay = () => {
  if (!mapOverlay) {
    return;
  }
  mapOverlay.hidden = true;
  setLocked(false);
};

const openOverlay = (id) => {
  const overlay = document.querySelector(`[data-overlay="${id}"]`);
  if (overlay) {
    overlay.hidden = false;
    setLocked(true);
  }
};

const closeOverlay = (overlayEl) => {
  overlayEl.hidden = true;
  setLocked(false);
};

const setupFlipCards = () => {
  const cards = document.querySelectorAll(".flip-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
  });
};

setupFlipCards();

generalOverlayTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    openOverlay(trigger.dataset.openOverlay);
  });
});

generalOverlayClosers.forEach((closer) => {
  closer.addEventListener("click", () => {
    const overlay = closer.closest(".overlay");
    if (overlay) {
      closeOverlay(overlay);
    }
  });
});

let albumIndex = 0;
let albumList = [];
const albumTexts = [
  "你一出现，世界就自动变得温柔起来。",
  "把今天的甜，收藏进明天的期待里。",
  "谢谢你，让平凡的日子也闪闪发光。",
  "你在镜头里笑的时候，我在心里又心动一次。",
  "我们不赶路，我们把路走成故事。",
  "最好的瞬间，是你在我身边的瞬间。",
  "这一页写给拥抱：不需要理由，只要是你。",
  "你是我反复确认过的答案，也是我唯一的偏爱。",
  "小小的日常，装满了大大的喜欢。",
  "想把所有浪漫都给你，再把你放在我的未来里。",
  "翻到这里也不结束：我们还有很多页要一起写。",
];

const buildAlbumList = () => {
  if (!albumView) {
    return [];
  }
  const count = Number(albumView.getAttribute("data-count")) || 0;
  const list = [];
  for (let i = 1; i <= count; i += 1) {
    const n = String(i).padStart(2, "0");
    list.push(`photos/sweet/sweet-${n}.png`);
  }
  return list;
};

const ensureStrip = () => {
  if (!albumStrip || albumStrip.childElementCount > 0) {
    return;
  }

  albumStrip.replaceChildren();

  albumList.forEach((src, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thumb";
    btn.setAttribute("data-index", String(index));
    btn.setAttribute("aria-label", `查看 ${index + 1}`);

    const img = document.createElement("img");
    img.src = src;
    img.alt = `缩略图 ${index + 1}`;
    img.loading = "lazy";

    btn.appendChild(img);
    albumStrip.appendChild(btn);
  });
};

const renderAlbum = () => {
  if (!albumImg || albumList.length === 0) {
    return;
  }
  const safeIndex = Math.min(Math.max(0, albumIndex), albumList.length - 1);
  albumIndex = safeIndex;
  albumImg.src = albumList[albumIndex];
  albumImg.alt = `甜蜜相册 ${albumIndex + 1}`;
  if (albumCaption) {
    albumCaption.textContent = albumTexts[albumIndex] || "";
  }

  if (albumCounter) {
    albumCounter.textContent = `${albumIndex + 1} / ${albumList.length}`;
  }
  if (albumPrev) {
    albumPrev.disabled = albumIndex === 0;
  }
  if (albumNext) {
    albumNext.disabled = albumIndex === albumList.length - 1;
  }
  if (albumStrip) {
    Array.from(albumStrip.querySelectorAll(".thumb")).forEach((el) => {
      el.classList.toggle("is-active", Number(el.getAttribute("data-index")) === albumIndex);
    });
    const active = albumStrip.querySelector(".thumb.is-active");
    if (active) {
      active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }
};

const openSweetAlbum = (startIndex = 0) => {
  if (!albumOverlay) {
    return;
  }
  albumList = buildAlbumList();
  albumIndex = startIndex;
  ensureStrip();
  albumOverlay.hidden = false;
  setLocked(true);
  renderAlbum();
};

const mapClosers = document.querySelectorAll("[data-close-overlay]");

if (sweetAlbumTrigger) {
  sweetAlbumTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    openSweetAlbum(0);
  });
}

albumClosers.forEach((el) => el.addEventListener("click", closeAlbum));
mapClosers.forEach((el) => el.addEventListener("click", closeMapOverlay));

const mapTrigger = document.querySelector("[data-open-overlay='map']");

if (albumPrev) {
  albumPrev.addEventListener("click", () => {
    albumIndex -= 1;
    renderAlbum();
  });
}

if (albumNext) {
  albumNext.addEventListener("click", () => {
    albumIndex += 1;
    renderAlbum();
  });
}

if (albumStrip) {
  albumStrip.addEventListener("click", (event) => {
    const thumb = event.target.closest(".thumb");
    if (!thumb) {
      return;
    }
    const index = Number(thumb.getAttribute("data-index"));
    if (!Number.isFinite(index)) {
      return;
    }
    albumIndex = index;
    renderAlbum();
  });
}

const setupMessages = () => {
  const submitBtn = document.querySelector(".messages-submit");
  const input = document.querySelector(".messages-input");
  const list = document.querySelector(".messages-list");

  if (!submitBtn || !input || !list) return;

  submitBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;

    const msgCard = document.createElement("div");
    msgCard.className = "message-card";
    msgCard.innerHTML = `
      <div class="message-card__content">
        <p class="message-card__user">我说：</p>
        <p class="message-card__text">${text}</p>
        <p class="message-card__time">${timeStr}</p>
      </div>
    `;

    list.appendChild(msgCard);
    input.value = "";
    list.scrollTop = list.scrollHeight;
  });
};

setupMessages();

document.addEventListener("keydown", (event) => {
  const isAlbumOpen = albumOverlay && !albumOverlay.hidden;
  const isMapOpen = mapOverlay && !mapOverlay.hidden;
  const isMomentsOpen = momentsOverlay && !momentsOverlay.hidden;
  const isMessagesOpen = document.querySelector("[data-overlay='messages']") && !document.querySelector("[data-overlay='messages']").hidden;
  const isStoryOpen = document.querySelector("[data-overlay='story']") && !document.querySelector("[data-overlay='story']").hidden;

  if (event.key === "Escape") {
    if (isAlbumOpen) closeAlbum();
    if (isMapOpen) closeMapOverlay();
    if (isMomentsOpen) {
      const overlay = document.querySelector("[data-overlay='moments']");
      if (overlay) closeOverlay(overlay);
    }
    if (isMessagesOpen) {
      const overlay = document.querySelector("[data-overlay='messages']");
      if (overlay) closeOverlay(overlay);
    }
    if (isStoryOpen) {
      const overlay = document.querySelector("[data-overlay='story']");
      if (overlay) closeOverlay(overlay);
    }
    return;
  }

  if (isAlbumOpen) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      albumIndex -= 1;
      renderAlbum();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      albumIndex += 1;
      renderAlbum();
    }
  }
});
