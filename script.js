/* ==========================================
   RIIZE 취향표
========================================== */

/* 멤버 정보 (id / 이름 / 행-이니셜 / 열-이니셜 / 기본색 / 기본사진)
   rowInitial: 이 멤버가 "행"일 때 커플명 앞에 오는 글자
   colInitial: 이 멤버가 "열"일 때 커플명 뒤에 오는 글자
   순서: 쇼타로, 은석, 성찬, 원빈, 승한(옵션), 소희, 앤톤 */
const SEUNGHAN_ID = "seunghan";

const MEMBERS_BASE = [
    { id: "shotaro",  name: "쇼타로", rowInitial: "숕", colInitial: "숕", color: "#ffb733", photo: "assets/01_shotaro.png" },
    { id: "eunseok",  name: "은석",   rowInitial: "돌", colInitial: "석", color: "#ff9900", photo: "assets/02_eunseok.png" },
    { id: "sungchan", name: "성찬",   rowInitial: "숑", colInitial: "숑", color: "#e68a00", photo: "assets/03_sungchan.png" },
    { id: "wonbin",   name: "원빈",   rowInitial: "넨", colInitial: "넨", color: "#ffae42", photo: "assets/04_wonbin.png" },
    { id: SEUNGHAN_ID, name: "승한",  rowInitial: "슿", colInitial: "슿", color: "#bfbfbf", photo: "assets/07_seunghan.png" },
    { id: "sohee",    name: "소희",   rowInitial: "히", colInitial: "또", color: "#cc7a00", photo: "assets/05_sohee.png" },
    { id: "anton",    name: "앤톤",   rowInitial: "톤", colInitial: "톤", color: "#ffbf66", photo: "assets/06_anton.png" }
];

const MEMBER_MAP = {};
MEMBERS_BASE.forEach(m => { MEMBER_MAP[m.id] = m; });

/* 승한(탈퇴 멤버) 포함 여부 - 체크박스로 켜고 끔 */
const SEUNGHAN_KEY = "riize-include-seunghan";
let includeSeunghan = localStorage.getItem(SEUNGHAN_KEY) === "1";

function getActiveMembers() {
    return MEMBERS_BASE.filter(m => m.id !== SEUNGHAN_ID || includeSeunghan);
}

/*
 * 6인(쇼타로/은석/성찬/원빈/소희/앤톤) 사이의 커플명은 실제 취향표를 그대로 옮긴 값.
 * 승한이 포함된 조합은 승한의 rowInitial/colInitial("슿")을 상대방과 자동으로 조합해서 만든다.
 */
const CORE_PAIR_NAMES = {
    shotaro:  { shotaro: "숕숕", eunseok: "숕석", sungchan: "숕숑", wonbin: "숕넨", sohee: "숕또", anton: "숕톤" },
    eunseok:  { shotaro: "돌숕", eunseok: "돌돌", sungchan: "은숑", wonbin: "돌넨", sohee: "석또", anton: "돌톤" },
    sungchan: { shotaro: "숑숕", eunseok: "숑석", sungchan: "숑숑", wonbin: "숑넨", sohee: "숑또", anton: "숑톤" },
    wonbin:   { shotaro: "넨숕", eunseok: "넨석", sungchan: "넨숑", wonbin: "넨넨", sohee: "넨또", anton: "넨톤" },
    sohee:    { shotaro: "히숕", eunseok: "또석", sungchan: "히숑", wonbin: "히넨", sohee: "히히", anton: "또톤" },
    anton:    { shotaro: "앤숕", eunseok: "톤석", sungchan: "톤숑", wonbin: "톤넨", sohee: "톤또", anton: "톤톤" }
};

function getPairName(rowId, colId) {
    if (rowId !== SEUNGHAN_ID && colId !== SEUNGHAN_ID) {
        return CORE_PAIR_NAMES[rowId][colId];
    }

    if (rowId === colId) {
        return MEMBER_MAP[SEUNGHAN_ID].rowInitial + MEMBER_MAP[SEUNGHAN_ID].colInitial;
    }

    if (rowId === SEUNGHAN_ID) {
        return MEMBER_MAP[SEUNGHAN_ID].rowInitial + MEMBER_MAP[colId].colInitial;
    }

    return MEMBER_MAP[rowId].rowInitial + MEMBER_MAP[SEUNGHAN_ID].colInitial;
}

const options = [
    { name: "OTP",      color: "#fc5090" },
    { name: "좋아함",   color: "#faa3c1" },
    { name: "호감",     color: "#f6dc59" },
    { name: "관심있음", color: "#97d477" },
    { name: "관심 X",   color: "#ffffff" },
    { name: "별로",     color: "#90d7f3" },
    { name: "지뢰",     color: "#818181" }
];

/* 사용자가 직접 고른 커스텀 색상 (name -> hex).
   여기에 값이 있으면 기본 color 대신 이 색을 쓴다.
   options 배열의 기본값 자체는 절대 덮어쓰지 않는다. */
const CUSTOM_COLOR_KEY = "riize-custom-colors";
let customColors = JSON.parse(localStorage.getItem(CUSTOM_COLOR_KEY)) || {};

function getOptionColor(option) {
    return customColors[option.name] || option.color;
}

function setCustomColor(name, hex) {
    customColors[name] = hex;
    localStorage.setItem(CUSTOM_COLOR_KEY, JSON.stringify(customColors));
}

function resetCustomColors() {
    customColors = {};
    localStorage.removeItem(CUSTOM_COLOR_KEY);
}

const STORAGE_KEY = "riize-rat-rps";
const LR_STORAGE_KEY = "riize-lr-rps";
const LR_CELL_COUNT = 12;

/* 행/열 개별 숨기기 상태 (멤버 id 기준, rows/cols 따로 관리) */
const HIDDEN_KEY = "riize-hidden-members";
const hiddenSaved = JSON.parse(localStorage.getItem(HIDDEN_KEY)) || { rows: [], cols: [] };
let hiddenRows = new Set(hiddenSaved.rows);
let hiddenCols = new Set(hiddenSaved.cols);

function saveHiddenState() {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify({
        rows: [...hiddenRows],
        cols: [...hiddenCols]
    }));
}

const table = document.getElementById("chartTable");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const optionGrid = document.getElementById("optionGrid");
const modalExtra = document.getElementById("modalExtra");
const closeModal = document.getElementById("closeModal");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const guideListRps = document.getElementById("guideListRps");
const guideListLr = document.getElementById("guideListLr");
const legendRps = document.getElementById("legendRps");

const dateToggleWrap = document.getElementById("dateToggleWrap");
const dateToggle = document.getElementById("dateToggle");
const dateTextRps = document.getElementById("dateTextRps");
const dateTextLr = document.getElementById("dateTextLr");
const seunghanToggle = document.getElementById("seunghanToggle");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

const saveModal = document.getElementById("saveModal");
const previewImage = document.getElementById("previewImage");
const closeSaveModal = document.getElementById("closeSaveModal");

const tabRps = document.getElementById("tabRps");
const tabLr = document.getElementById("tabLr");
const captureAreaRps = document.getElementById("captureArea");
const captureAreaLr = document.getElementById("captureAreaLr");
const lrGrid = document.getElementById("lrGrid");
const photoInput = document.getElementById("photoInput");
const scaleWrap = document.getElementById("scaleWrap");

/* CSS의 @media (max-width: 768px)과 동일한 기준.
   이 폭 이하에서는 JS로 축소하지 않고, 반응형 레이아웃을 그대로 사용한다. */
const MOBILE_BREAKPOINT = 768;
const DESKTOP_CAPTURE_WIDTH = 1600;

let currentTarget = null; // { type: "cell", td, rowId, colId } | { type: "row", id } | { type: "col", id }
let currentTab = "rps";
let currentPhotoId = null;
let currentBlobUrl = null; // 저장 미리보기/다운로드에 쓰이는 Blob URL (재사용 전 해제)

const HISTORY_LIMIT = 50;
let historyStack = [];
let redoStack = [];

let saveData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

let lrData = JSON.parse(localStorage.getItem(LR_STORAGE_KEY)) || {
    texts: {},
    cells: {},
    photos: {}
};

const GUIDE_TEXT = {
    rps: [
        "셀을 선택하여 호감도를 표시해주세요.",
        "멤버 이름을 누르면 줄 전체선택이 가능해요."
    ],
    lr: [
        "L-R 사이 원하는 부분의 칸을 선택하고, 아래 칸에 자유롭게 적어보세요.",
        "각 멤버의 프로필을 누르면 사진 변경이 가능해요."
    ]
};

function renderGuide(tab) {
    const target = tab === "rps" ? guideListRps : guideListLr;
    target.innerHTML = "";
    GUIDE_TEXT[tab].forEach(line => {
        const p = document.createElement("p");
        p.textContent = line;
        target.appendChild(p);
    });
}

/* 범례를 options 배열(+커스텀 색상) 기준으로 매번 새로 그린다.
   색이 바뀌어도 범례가 항상 실제 색과 일치하도록. */
function renderLegend() {
    if (!legendRps) return;
    legendRps.innerHTML = "";
    options.forEach(option => {
        const color = getOptionColor(option);
        const isNone = color.toLowerCase() === "#ffffff";
        const item = document.createElement("div");
        item.className = "legend-item";
        item.innerHTML = `
            <span class="color${isNone ? " dashed" : ""}" style="background:${color}"></span>${option.name}
        `;
        legendRps.appendChild(item);
    });
}

/* ==========================================
   날짜 표시 (제목 옆 260810 ver. 형식)
========================================== */

function getDateVerText() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yy}${mm}${dd} ver.`;
}

function updateDateDisplay() {
    const text = dateToggle.checked ? getDateVerText() : "";
    dateTextRps.textContent = text;
    dateTextLr.textContent = text;
}

dateToggle.addEventListener("change", updateDateDisplay);

/* ==========================================
   승한 포함(7인) 토글
========================================== */

if (seunghanToggle) {
    seunghanToggle.checked = includeSeunghan;

    seunghanToggle.addEventListener("change", () => {
        includeSeunghan = seunghanToggle.checked;
        localStorage.setItem(SEUNGHAN_KEY, includeSeunghan ? "1" : "0");
        createTable();
        createLrGrid();
    });
}

createTable();
createLrGrid();
updateNavButtons();
renderGuide(currentTab);
renderLegend();
updateDateDisplay();

/* ==========================================
   탭 전환
========================================== */

function switchTab(tab) {
    currentTab = tab;

    if (tab === "rps") {
        captureAreaRps.classList.remove("hidden");
        captureAreaLr.classList.add("hidden");
        tabRps.classList.add("active");
        tabLr.classList.remove("active");
    } else {
        captureAreaLr.classList.remove("hidden");
        captureAreaRps.classList.add("hidden");
        tabLr.classList.add("active");
        tabRps.classList.remove("active");
    }

    renderGuide(tab);
    fitCaptureArea();
}

tabRps.addEventListener("click", () => switchTab("rps"));
tabLr.addEventListener("click", () => switchTab("lr"));

/* ==========================================
   랒페스 취향표 - 표 생성
========================================== */

function createTable() {
    table.innerHTML = "";

    const activeMembers = getActiveMembers();
    const visibleCols = activeMembers.filter(m => !hiddenCols.has(m.id));
    const visibleRows = activeMembers.filter(m => !hiddenRows.has(m.id));

    const head = document.createElement("tr");
    const empty = document.createElement("th");
    empty.className = "corner";
    head.appendChild(empty);

    visibleCols.forEach(member => {
        const th = document.createElement("th");
        th.textContent = member.name;
        th.classList.add("clickable-header");

        th.addEventListener("click", () => {
            currentTarget = { type: "col", id: member.id };
            openModal(member.name);
        });

        head.appendChild(th);
    });

    table.appendChild(head);

    visibleRows.forEach(rowMember => {
        const tr = document.createElement("tr");

        const rowHead = document.createElement("th");
        rowHead.textContent = rowMember.name;
        rowHead.classList.add("clickable-header");

        rowHead.addEventListener("click", () => {
            currentTarget = { type: "row", id: rowMember.id };
            openModal(rowMember.name);
        });

        tr.appendChild(rowHead);

        visibleCols.forEach(colMember => {
            const td = document.createElement("td");
            const key = `${rowMember.id}-${colMember.id}`;
            td.dataset.key = key;

            td.textContent = getPairName(rowMember.id, colMember.id);

            if (rowMember.id === colMember.id) {
                td.classList.add("diagonal");
            }

            if (saveData[key]) {
                td.style.backgroundColor = saveData[key];
            }

            td.addEventListener("click", () => {
                currentTarget = { type: "cell", td, rowId: rowMember.id, colId: colMember.id };
                openModal(getPairName(rowMember.id, colMember.id));
            });

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });
}

/* ==========================================
   랒페스 취향표 - 이전/이후 (실행 취소)
========================================== */

function pushHistory() {
    historyStack.push(JSON.stringify(saveData));
    if (historyStack.length > HISTORY_LIMIT) {
        historyStack.shift();
    }
    redoStack = [];
    updateNavButtons();
}

function updateNavButtons() {
    undoBtn.disabled = historyStack.length === 0;
    redoBtn.disabled = redoStack.length === 0;
}

undoBtn.addEventListener("click", () => {
    if (historyStack.length === 0) return;

    redoStack.push(JSON.stringify(saveData));
    saveData = JSON.parse(historyStack.pop());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    createTable();
    updateNavButtons();
});

redoBtn.addEventListener("click", () => {
    if (redoStack.length === 0) return;

    historyStack.push(JSON.stringify(saveData));
    saveData = JSON.parse(redoStack.pop());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    createTable();
    updateNavButtons();
});

/* ==========================================
   색상 선택 모달
========================================== */

function openModal(titleText) {
    modalTitle.textContent = titleText;
    optionGrid.innerHTML = "";

    options.forEach(option => {
        const color = getOptionColor(option);
        const item = document.createElement("div");
        item.className = "option-card";

        const isNone = color.toLowerCase() === "#ffffff";

        item.innerHTML = `
            <span class="option-dot-wrap">
                <span class="option-dot${isNone ? " dashed" : ""}" style="background:${color}"></span>
                <label class="color-edit-btn" title="이 색상 직접 고르기">
                    &#9998;
                    <input type="color" class="color-edit-input" value="${color.length === 7 ? color : "#ffffff"}">
                </label>
            </span>
            <span class="option-label">${option.name}</span>
        `;

        // 카드(동그라미) 클릭 -> 이 색을 셀에 적용
        item.addEventListener("click", () => applySelection(getOptionColor(option)));

        // 연필 아이콘 클릭은 셀 적용과 별개로, 색상 피커만 열기
        const editBtn = item.querySelector(".color-edit-btn");
        const editInput = item.querySelector(".color-edit-input");
        editBtn.addEventListener("click", (e) => e.stopPropagation());
        editInput.addEventListener("click", (e) => e.stopPropagation());
        editInput.addEventListener("input", (e) => {
            const hex = e.target.value;
            item.querySelector(".option-dot").style.background = hex;
        });
        editInput.addEventListener("change", (e) => {
            setCustomColor(option.name, e.target.value);
            renderLegend();
        });

        optionGrid.appendChild(item);
    });

    const clearItem = document.createElement("div");
    clearItem.className = "option-card clear-card";
    clearItem.innerHTML = `
        <span class="option-dot">&#128465;</span>
        <span class="option-label">선택 지우기</span>
    `;
    clearItem.addEventListener("click", () => applySelection(null));
    optionGrid.appendChild(clearItem);

    renderModalExtra(titleText);

    modal.classList.remove("hidden");
}

/* 모달 하단(색상 기본값 되돌리기 + 행/열 숨기기 체크박스) 영역.
   모달을 열 때마다 currentTarget 기준으로 다시 그린다. */
function renderModalExtra(titleText) {
    if (!modalExtra) return;
    modalExtra.innerHTML = "";

    const resetLink = document.createElement("div");
    resetLink.className = "reset-colors-link";
    resetLink.textContent = "색상 기본값으로 되돌리기";
    resetLink.addEventListener("click", () => {
        resetCustomColors();
        renderLegend();
        openModal(titleText);
    });
    modalExtra.appendChild(resetLink);

    if (!currentTarget || (currentTarget.type !== "row" && currentTarget.type !== "col")) {
        return;
    }

    const member = MEMBER_MAP[currentTarget.id];
    const isRow = currentTarget.type === "row";
    const initial = isRow ? member.rowInitial : member.colInitial;
    const suffix = isRow ? "왼" : "른";
    const hiddenSet = isRow ? hiddenRows : hiddenCols;

    const hideLabel = document.createElement("label");
    hideLabel.className = "hide-toggle";

    const hideInput = document.createElement("input");
    hideInput.type = "checkbox";
    hideInput.checked = hiddenSet.has(member.id);

    hideInput.addEventListener("change", () => {
        if (hideInput.checked) {
            hiddenSet.add(member.id);
        } else {
            hiddenSet.delete(member.id);
        }
        saveHiddenState();
        createTable();
        modal.classList.add("hidden");
    });

    hideLabel.appendChild(hideInput);
    hideLabel.appendChild(document.createTextNode(`${initial}${suffix} 숨기기`));

    modalExtra.appendChild(hideLabel);
}

function setCellColor(td, key, color) {
    if (color) {
        if (td) td.style.backgroundColor = color;
        saveData[key] = color;
    } else {
        if (td) td.style.backgroundColor = "#ffffff";
        delete saveData[key];
    }
}

function applySelection(color) {
    if (!currentTarget) return;

    pushHistory();

    const activeMembers = getActiveMembers();

    if (currentTarget.type === "cell") {
        const key = `${currentTarget.rowId}-${currentTarget.colId}`;
        setCellColor(currentTarget.td, key, color);
    } else if (currentTarget.type === "row") {
        const rowId = currentTarget.id;
        activeMembers.forEach(colMember => {
            const key = `${rowId}-${colMember.id}`;
            const td = table.querySelector(`td[data-key="${key}"]`);
            setCellColor(td, key, color);
        });
    } else if (currentTarget.type === "col") {
        const colId = currentTarget.id;
        activeMembers.forEach(rowMember => {
            const key = `${rowMember.id}-${colId}`;
            const td = table.querySelector(`td[data-key="${key}"]`);
            setCellColor(td, key, color);
        });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    modal.classList.add("hidden");
}

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }

    if (e.target === saveModal) {
        saveModal.classList.add("hidden");
    }
});

/* ==========================================
   공수 취향표 - 기본 아바타 생성 (SVG)
========================================== */

function defaultAvatar(name, color) {
    const initial = name.charAt(0);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
            <rect width="160" height="160" fill="${color}" />
            <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
                font-family="Pretendard, Noto Sans KR, sans-serif"
                font-size="64" font-weight="800" fill="#ffffff">${initial}</text>
        </svg>
    `;
    return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

/* ==========================================
   공수 취향표 - 그리드 생성
========================================== */

function createLrGrid() {
    lrGrid.innerHTML = "";

    const activeMembers = getActiveMembers();

    /* 왼쪽 열에 앞쪽 절반(반올림)이 채워지도록 행 개수를 정한다.
       6인이면 3-3, 7인(승한 포함)이면 4-3으로 원빈까지 왼쪽,
       승한부터 앤톤까지 오른쪽에 배치된다. */
    lrGrid.style.setProperty("--lr-rows", Math.ceil(activeMembers.length / 2));

    activeMembers.forEach(member => {
        const index = member.id;

        const row = document.createElement("div");
        row.className = "lr-row";

        /* 아바타 */
        const avatar = document.createElement("div");
        avatar.className = "lr-avatar";
        avatar.dataset.index = index;

        const img = document.createElement("img");
        img.src = lrData.photos[index] || member.photo;
        img.alt = member.name;
        img.onerror = () => {
            img.onerror = null;
            img.src = defaultAvatar(member.name, member.color);
        };
        avatar.appendChild(img);

        const editHint = document.createElement("div");
        editHint.className = "avatar-edit";
        editHint.textContent = "사진 변경";
        avatar.appendChild(editHint);

        avatar.addEventListener("click", () => {
            currentPhotoId = index;
            photoInput.value = "";
            photoInput.click();
        });

        row.appendChild(avatar);

        /* 오른쪽 내용 (바 + 텍스트) */
        const content = document.createElement("div");
        content.className = "lr-content";

        const barWrap = document.createElement("div");
        barWrap.className = "lr-bar-wrap";

        const labelL = document.createElement("span");
        labelL.className = "lr-label-l";
        labelL.textContent = "L";

        const bar = document.createElement("div");
        bar.className = "lr-bar";
        bar.dataset.index = index;

        const filledCells = lrData.cells[index] || [];

        for (let c = 0; c < LR_CELL_COUNT; c++) {
            const cell = document.createElement("div");
            cell.className = "lr-cell";
            cell.dataset.cell = c;

            if (filledCells[c]) {
                cell.classList.add("filled");
            }

            cell.addEventListener("click", () => {
                toggleLrCell(index, c, cell);
            });

            bar.appendChild(cell);
        }

        const labelR = document.createElement("span");
        labelR.className = "lr-label-r";
        labelR.textContent = "R";

        barWrap.appendChild(labelL);
        barWrap.appendChild(bar);
        barWrap.appendChild(labelR);

        const textWrap = document.createElement("div");
        textWrap.className = "lr-text-wrap";

        const text = document.createElement("textarea");
        text.className = "lr-text";
        text.rows = 5;
        text.maxLength = 150;
        text.placeholder = "자유롭게 적어보세요";
        text.value = lrData.texts[index] || "";
        text.dataset.index = index;

        const charCount = document.createElement("span");
        charCount.className = "lr-char-count";
        charCount.textContent = `${text.value.length}/150`;

        text.addEventListener("input", () => {
            lrData.texts[index] = text.value;
            charCount.textContent = `${text.value.length}/150`;
            saveLrData();
        });

        textWrap.appendChild(text);
        textWrap.appendChild(charCount);

        content.appendChild(barWrap);
        content.appendChild(textWrap);

        row.appendChild(content);

        lrGrid.appendChild(row);
    });
}

function toggleLrCell(memberIndex, cellIndex, cellEl) {
    if (!lrData.cells[memberIndex]) {
        lrData.cells[memberIndex] = [];
    }

    lrData.cells[memberIndex][cellIndex] = !lrData.cells[memberIndex][cellIndex];
    cellEl.classList.toggle("filled");

    saveLrData();
}

function saveLrData() {
    localStorage.setItem(LR_STORAGE_KEY, JSON.stringify(lrData));
}

/* 사진 업로드 */
photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file || currentPhotoId === null) return;

    const reader = new FileReader();

    reader.onload = () => {
        lrData.photos[currentPhotoId] = reader.result;
        saveLrData();

        const avatarEl = lrGrid.querySelector(`.lr-avatar[data-index="${currentPhotoId}"] img`);
        if (avatarEl) {
            avatarEl.src = reader.result;
        }
    };

    reader.readAsDataURL(file);
});

/* ==========================================
   초기화
========================================== */

resetBtn.addEventListener("click", () => {
    if (!confirm("현재 화면의 모든 선택을 초기화할까요?")) return;

    if (currentTab === "rps") {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(HIDDEN_KEY);
        saveData = {};
        hiddenRows = new Set();
        hiddenCols = new Set();
        historyStack = [];
        redoStack = [];
        updateNavButtons();
        createTable();
    } else {
        localStorage.removeItem(LR_STORAGE_KEY);
        lrData = { texts: {}, cells: {}, photos: {} };
        createLrGrid();
    }
});

/* ==========================================
   이미지 저장
========================================== */

/*
 * html2canvas는 <textarea> 내부 글자를 자기 방식대로 다시 그리는데,
 * 이 과정에서 줄바꿈(word-wrap)이 무시되고 한 줄로 이어져 박스 밖으로
 * 삐져나가는 문제가 있다. 캡처 직전에만 textarea를 똑같이 생긴
 * <div>로 바꿔치기해서 이 문제를 피하고, 캡처가 끝나면 원래대로 되돌린다.
 */
function prepareTextareasForCapture(area) {
    const textareas = area.querySelectorAll(".lr-text");
    const replacements = [];

    textareas.forEach(textarea => {
        const mirror = document.createElement("div");
        mirror.className = "lr-text lr-text-capture";
        mirror.textContent = textarea.value;

        textarea.style.display = "none";
        textarea.insertAdjacentElement("afterend", mirror);

        replacements.push({ textarea, mirror });
    });

    return replacements;
}

function restoreTextareasAfterCapture(replacements) {
    replacements.forEach(({ textarea, mirror }) => {
        mirror.remove();
        textarea.style.display = "";
    });
}

saveBtn.addEventListener("click", async () => {
    const buttonWrap = document.querySelector(".button-wrap");
    const tabWrap = document.querySelector(".tab-wrap");
    const area = currentTab === "rps" ? captureAreaRps : captureAreaLr;

    buttonWrap.style.display = "none";
    tabWrap.style.display = "none";
    dateToggleWrap.style.display = "none";

    /* 안내 문구, 이전/이후 버튼은 이미지에는 나오지 않도록 캡처 중에만 숨김 */
    area.classList.add("capturing");

    /* 화면(특히 모바일)에 적용돼 있던 축소/반응형 스타일을 잠시 걷어내고,
       항상 PC 버전과 동일한 1600px 레이아웃으로 저장되도록 한다. */
    const prevTransform = area.style.transform;
    area.style.transform = "none";

    const textareaReplacements = prepareTextareasForCapture(area);

    try {
        const canvas = await html2canvas(area, {
            backgroundColor: "#ffffff",
            scale: 4,
            useCORS: true,
            logging: false,
            windowWidth: DESKTOP_CAPTURE_WIDTH,
            windowHeight: Math.max(area.scrollHeight, 1600)
        });

        /*
         * data: URL 대신 Blob URL을 사용한다.
         * 표가 커지고 고화질(scale 4)로 캡처하면서 이미지 용량이 커졌는데,
         * 아이폰 사파리는 큰 data: URL을 <a download>로 다운로드할 때
         * "다운로드하시겠습니까?" 확인창까지만 뜨고 실제 저장은 안 되는
         * 경우가 있다. Blob URL은 이런 용량 제한 없이 정상적인
         * 다운로드(하단 진행 표시 → 다운로드 항목 저장)로 이어진다.
         */
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

        if (!blob) {
            throw new Error("이미지 변환에 실패했습니다.");
        }

        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
        }
        currentBlobUrl = URL.createObjectURL(blob);

        previewImage.src = currentBlobUrl;
        saveModal.classList.remove("hidden");

        const fileLabel = currentTab === "rps" ? "랒페스_취향표" : "공수_취향표";

        const link = document.createElement("a");
        link.href = currentBlobUrl;
        link.download = `RIIZE_${fileLabel}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(error);
        alert("이미지 저장 중 문제가 발생했습니다.");
    } finally {
        restoreTextareasAfterCapture(textareaReplacements);
        area.classList.remove("capturing");
        area.style.transform = prevTransform;
        buttonWrap.style.display = "flex";
        tabWrap.style.display = "flex";
        dateToggleWrap.style.display = "flex";
    }
});

closeSaveModal.addEventListener("click", () => {
    saveModal.classList.add("hidden");
});

/* ==========================================
   ESC
========================================== */

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modal.classList.add("hidden");
        saveModal.classList.add("hidden");
    }
});

/* ==========================================
   모바일 자동 축소
========================================== */

function fitCaptureArea() {
    const area = currentTab === "rps" ? captureAreaRps : captureAreaLr;
    const wrap = scaleWrap;

    if (!area || !wrap) return;

    const screenWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth
    );

    if (screenWidth <= MOBILE_BREAKPOINT) {
        /* 모바일: 축소 대신 CSS 반응형 레이아웃을 그대로 사용하고,
           세로로 길어진 내용은 화면을 드래그해서 내려보는 방식으로 확인한다. */
        area.style.transform = "none";
        area.style.transformOrigin = "";
        wrap.style.width = "";
        wrap.style.height = "";
        return;
    }

    const scale = Math.min(1, screenWidth / DESKTOP_CAPTURE_WIDTH);

    area.style.transformOrigin = "top left";
    area.style.transform = `scale(${scale})`;

    wrap.style.width = `${DESKTOP_CAPTURE_WIDTH * scale}px`;
    wrap.style.height = `${area.scrollHeight * scale}px`;
}

fitCaptureArea();

window.addEventListener("load", fitCaptureArea);
window.addEventListener("resize", fitCaptureArea);

window.addEventListener("orientationchange", () => {
    setTimeout(fitCaptureArea, 200);
});
