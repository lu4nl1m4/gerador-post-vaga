const canvases = {
  story: document.querySelector("#storyCanvas"),
  feed: document.querySelector("#feedCanvas"),
};

const contexts = {
  story: canvases.story.getContext("2d"),
  feed: canvases.feed.getContext("2d"),
};

const logo = new Image();
logo.src = "assets/logo-tio-luiz.png";

const fields = {
  jobTitle: document.querySelector("#jobTitle"),
  region: document.querySelector("#region"),
  requirements: document.querySelector("#requirements"),
  requirementsFontSize: document.querySelector("#requirementsFontSize"),
  emailSubject: document.querySelector("#emailSubject"),
  deadline: document.querySelector("#deadline"),
  email: document.querySelector("#email"),
};

const statusText = document.querySelector("#statusText");
const requirementsFontSizeValue = document.querySelector("#requirementsFontSizeValue");
const downloadStoryButton = document.querySelector("#downloadStoryButton");
const downloadFeedButton = document.querySelector("#downloadFeedButton");
const resetButton = document.querySelector("#resetButton");
const presetButtons = document.querySelectorAll(".preset-button");

const GREEN = "#006b37";
const WHITE = "#ffffff";
const DEADLINE_RED = "#a65a52";
const DEADLINE_FILL = "#fff6f4";
const DEADLINE_STROKE = "#dfaaa2";
const layouts = {
  story: {
    width: 1080,
    height: 1920,
    bottomBandY: 1506,
    headlineY: 210,
    headlineSize: 68,
    titleY: 310,
    titleStart: 62,
    titleMin: 31,
    titleMaxWidth: 790,
    titleBarX: 132,
    titleBarWidth: 816,
    regionGap: 46,
    regionSize: 47,
    regionMinSize: 32,
    regionMaxWidth: 900,
    reqX: 180,
    reqWidth: 720,
    reqMinTop: 616,
    reqTopGap: 62,
    reqMinHeight: 318,
    reqAvailablePad: 80,
    reqScale: 1,
    reqMinSize: 27,
    reqTextPad: 144,
    reqLabelSize: 36,
    reqInnerTop: 70,
    bulletRadius: 12,
    emailBlockTop: 1172,
    emailBlockTopWithDeadline: 1138,
    ctaSize: 38,
    ctaLineHeight: 45,
    ctaSizeWithDeadline: 35,
    ctaLineHeightWithDeadline: 42,
    subjectGap: 14,
    subjectStart: 34,
    subjectMin: 23,
    deadlineGap: 13,
    deadlinePillHeight: 46,
    deadlinePillWidth: 520,
    deadlineStart: 30,
    deadlineMin: 20,
    emailAfterDeadlineGap: 17,
    emailX: 140,
    emailY: 1380,
    emailWidth: 800,
    emailStart: 33,
    emailMin: 21,
    logoWidth: 355,
    logoY: 1588,
  },
  feed: {
    width: 1080,
    height: 1350,
    bottomBandY: 1056,
    headlineY: 118,
    headlineSize: 58,
    titleY: 205,
    titleStart: 55,
    titleMin: 28,
    titleMaxWidth: 790,
    titleBarX: 132,
    titleBarWidth: 816,
    regionGap: 32,
    regionSize: 39,
    regionMinSize: 27,
    regionMaxWidth: 900,
    reqX: 180,
    reqWidth: 720,
    reqMinTop: 382,
    reqTopGap: 44,
    reqMinHeight: 260,
    reqAvailablePad: 46,
    reqScale: 0.82,
    reqMinSize: 22,
    reqTextPad: 142,
    reqLabelSize: 32,
    reqInnerTop: 55,
    bulletRadius: 10,
    emailBlockTop: 808,
    emailBlockTopWithDeadline: 748,
    ctaSize: 31,
    ctaLineHeight: 38,
    ctaSizeWithDeadline: 29,
    ctaLineHeightWithDeadline: 34,
    subjectGap: 12,
    subjectStart: 30,
    subjectMin: 21,
    deadlineGap: 11,
    deadlinePillHeight: 40,
    deadlinePillWidth: 470,
    deadlineStart: 25,
    deadlineMin: 18,
    emailAfterDeadlineGap: 15,
    emailX: 150,
    emailY: 976,
    emailWidth: 780,
    emailStart: 30,
    emailMin: 20,
    logoWidth: 330,
    logoY: 1126,
  },
};

const presets = {
  vendedor: {
    jobTitle: "Vendedor Externo",
    region: "Região: Aracaju",
    requirements: [
      "Ter mais de 18 anos;",
      "Ter experiência na área de vendas;",
      "Ter CNH categoria AB;",
      "Ter transporte;",
      "Ter disponibilidade para viajar;",
      "Conhecer a região;",
      "Cordialidade no atendimento;",
      "Prospecção de clientes;",
    ].join("\n"),
    emailSubject: "VEND EXT DIST - AJU",
    deadline: "",
    email: "supervisor1@distribuidoratioluiz.com.br",
  },
  motorista: {
    jobTitle: "Motorista de Caminhão",
    region: "Para entregas em todo o estado",
    requirements: [
      "Residir em Itabaiana;",
      "Ter experiência com entregas;",
      "Ter CNH categoria C;",
      "Ter disponibilidade para viajar;",
      "Conhecer a região;",
      "Cordialidade no atendimento;",
    ].join("\n"),
    emailSubject: "VAGA MOTORISTA",
    deadline: "",
    email: "adilliotransportestioluiz@gmail.com",
  },
  promotor: {
    jobTitle: "Promotor(a) de Vendas",
    region: "Região de atuação: N. Sra. da Glória",
    requirements: [
      "Ter mais de 18 anos;",
      "Ter experiência na área;",
      "Ter disponibilidade para viajar;",
      "Conhecer a região;",
      "Cordialidade no atendimento;",
      "Boa comunicação;",
    ].join("\n"),
    emailSubject: "PROMO - GLORIA",
    deadline: "",
    email: "rodrigonunes@distribuidoratioluiz.com.br",
  },
};

let activePreset = "vendedor";
let ctx = contexts.story;

function font(weight, size) {
  return `${weight} ${size}px Inter, Arial, sans-serif`;
}

function normalizeLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function drawRoundedRect(x, y, width, height, radius, fill, stroke, lineWidth = 2) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function wrapText(text, maxWidth, size, weight = 400) {
  ctx.font = font(weight, size);
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word;
    if (ctx.measureText(attempt).width <= maxWidth || !current) {
      current = attempt;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : [""];
}

function fitFont(text, maxWidth, start, min, weight = 800) {
  for (let size = start; size >= min; size -= 1) {
    ctx.font = font(weight, size);
    if (ctx.measureText(text).width <= maxWidth) {
      return size;
    }
  }

  return min;
}

function drawCenteredLines(lines, x, y, size, lineHeight, weight = 400, color = GREEN) {
  ctx.fillStyle = color;
  ctx.font = font(weight, size);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
}

function drawBadgeCheck(x, y, radius) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = GREEN;
  ctx.beginPath();

  const points = 16;
  for (let i = 0; i < points * 2; i += 1) {
    const angle = (Math.PI * i) / points;
    const r = i % 2 === 0 ? radius : radius * 0.78;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = WHITE;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = radius * 0.34;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.46, radius * 0.02);
  ctx.lineTo(-radius * 0.14, radius * 0.34);
  ctx.lineTo(radius * 0.48, -radius * 0.34);
  ctx.stroke();
  ctx.restore();
}

function drawDeadlinePill(text, x, y, width, height, startSize, minSize) {
  drawRoundedRect(x, y, width, height, height / 2, DEADLINE_FILL, DEADLINE_STROKE, 1.5);
  const deadlineFont = fitFont(text, width - 44, startSize, minSize, 800);
  ctx.fillStyle = DEADLINE_RED;
  ctx.font = font(800, deadlineFont);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + width / 2, y + height / 2 + 1);
}

function measureRequirementLayout(items, maxTextWidth, availableHeight, config) {
  let size = Math.round(Number(fields.requirementsFontSize.value || 42) * config.reqScale);
  let wrapped = [];
  let totalHeight = 0;

  while (size >= config.reqMinSize) {
    const lineHeight = Math.round(size * 1.17);
    wrapped = items.map((item) => wrapText(item, maxTextWidth, size, 400));
    totalHeight = wrapped.reduce((sum, lines) => sum + lines.length * lineHeight, 0);

    if (totalHeight <= availableHeight) {
      return { size, lineHeight, wrapped, totalHeight };
    }

    size -= 1;
  }

  const lineHeight = Math.round(size * 1.16);
  wrapped = items.map((item) => wrapText(item, maxTextWidth, size, 400));
  totalHeight = wrapped.reduce((sum, lines) => sum + lines.length * lineHeight, 0);
  return { size, lineHeight, wrapped, totalHeight };
}

function formatDeadline(value) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function getFormData() {
  return {
    jobTitle: fields.jobTitle.value.trim() || "Vaga",
    region: fields.region.value.trim() || "Região",
    requirements: normalizeLines(fields.requirements.value),
    emailSubject: fields.emailSubject.value.trim() || "TITULO DA VAGA",
    deadline: formatDeadline(fields.deadline.value),
    email: fields.email.value.trim() || "email@distribuidoratioluiz.com.br",
  };
}

function drawPoster(format) {
  const canvas = canvases[format];
  const config = layouts[format];
  const data = getFormData();
  ctx = contexts[format];

  ctx.clearRect(0, 0, config.width, config.height);
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, config.width, config.height);

  const contentCenter = config.width / 2;
  const hasDeadline = Boolean(data.deadline);
  const emailBlockTop = hasDeadline ? config.emailBlockTopWithDeadline : config.emailBlockTop;
  const ctaSize = hasDeadline ? config.ctaSizeWithDeadline : config.ctaSize;
  const ctaLineHeight = hasDeadline ? config.ctaLineHeightWithDeadline : config.ctaLineHeight;

  ctx.fillStyle = GREEN;
  ctx.font = font(300, config.headlineSize);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Estamos Contratando:", contentCenter, config.headlineY);

  const titleFontSize = fitFont(
    data.jobTitle,
    config.titleMaxWidth,
    config.titleStart,
    config.titleMin,
    900,
  );
  const titleHeight = Math.round(titleFontSize + 28);
  drawRoundedRect(config.titleBarX, config.titleY, config.titleBarWidth, titleHeight, 3, GREEN);
  ctx.fillStyle = WHITE;
  ctx.font = font(900, titleFontSize);
  ctx.textBaseline = "middle";
  ctx.fillText(data.jobTitle, contentCenter, config.titleY + titleHeight / 2 + 2);

  let regionSize = config.regionSize;
  let regionLines = wrapText(data.region, config.regionMaxWidth, regionSize, 400);
  while (regionLines.length > 3 && regionSize > config.regionMinSize) {
    regionSize -= 2;
    regionLines = wrapText(data.region, config.regionMaxWidth, regionSize, 400);
  }

  const regionLineHeight = Math.round(regionSize * 1.2);
  const regionY = config.titleY + titleHeight + config.regionGap;
  drawCenteredLines(regionLines, contentCenter, regionY, regionSize, regionLineHeight, 400);
  const regionBottom = regionY + regionLines.length * regionLineHeight;

  const reqTop = Math.max(regionBottom + config.reqTopGap, config.reqMinTop);
  const availableReqHeight = Math.max(
    210,
    emailBlockTop - reqTop - config.reqAvailablePad,
  );
  const reqLayout = measureRequirementLayout(
    data.requirements,
    config.reqWidth - config.reqTextPad,
    availableReqHeight - config.reqInnerTop,
    config,
  );
  const reqBoxHeight = Math.min(
    Math.max(config.reqMinHeight, reqLayout.totalHeight + config.reqInnerTop + 24),
    emailBlockTop - reqTop - 24,
  );

  drawRoundedRect(config.reqX, reqTop, config.reqWidth, reqBoxHeight, 18, null, GREEN, 2.5);

  ctx.fillStyle = WHITE;
  ctx.fillRect(config.reqX + 58, reqTop - 22, 214, 40);
  ctx.fillStyle = GREEN;
  ctx.font = font(800, config.reqLabelSize);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Requisitos:", config.reqX + 61, reqTop - 28);

  const reqBodyTop = reqTop + config.reqInnerTop;
  const reqBodyHeight = reqBoxHeight - config.reqInnerTop - 24;
  let reqCursor = reqBodyTop + Math.max(0, (reqBodyHeight - reqLayout.totalHeight) / 2);
  const bulletX = config.reqX + 43;
  const textX = config.reqX + 82;
  ctx.textBaseline = "top";

  reqLayout.wrapped.forEach((lines) => {
    drawBadgeCheck(bulletX, reqCursor + reqLayout.lineHeight * 0.48, config.bulletRadius);
    lines.forEach((line, index) => {
      ctx.fillStyle = GREEN;
      ctx.font = font(400, reqLayout.size);
      ctx.fillText(line, textX, reqCursor + index * reqLayout.lineHeight);
    });
    reqCursor += lines.length * reqLayout.lineHeight;
  });

  const ctaLines = [
    "Se você preenche todos esses requisitos e deseja",
    "fazer parte do nosso time, deve enviar seu",
    "currículo para o e-mail abaixo com o título:",
  ];
  drawCenteredLines(
    ctaLines,
    contentCenter,
    emailBlockTop,
    ctaSize,
    ctaLineHeight,
    400,
  );

  const subjectY = emailBlockTop + ctaLineHeight * ctaLines.length + config.subjectGap;
  const subjectFont = fitFont(
    `(${data.emailSubject})`,
    760,
    config.subjectStart,
    config.subjectMin,
    900,
  );
  ctx.fillStyle = GREEN;
  ctx.font = font(900, subjectFont);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(`(${data.emailSubject})`, contentCenter, subjectY);

  let emailY = config.emailY;
  if (hasDeadline) {
    const deadlineText = `Enviar currículo até: ${data.deadline}`;
    const deadlineY = subjectY + subjectFont + config.deadlineGap;
    drawDeadlinePill(
      deadlineText,
      (config.width - config.deadlinePillWidth) / 2,
      deadlineY,
      config.deadlinePillWidth,
      config.deadlinePillHeight,
      config.deadlineStart,
      config.deadlineMin,
    );
    emailY = deadlineY + config.deadlinePillHeight + config.emailAfterDeadlineGap;
  }

  const emailFont = fitFont(data.email, config.emailWidth + 8, config.emailStart, config.emailMin, 900);
  drawRoundedRect(config.emailX, emailY, config.emailWidth, 48, 18, WHITE, GREEN, 1.4);
  ctx.fillStyle = GREEN;
  ctx.font = font(900, emailFont);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(data.email, contentCenter, emailY + 24);

  ctx.fillStyle = GREEN;
  ctx.fillRect(0, config.bottomBandY, config.width, config.height - config.bottomBandY);

  if (logo.complete && logo.naturalWidth) {
    const logoHeight = config.logoWidth * (logo.naturalHeight / logo.naturalWidth);
    ctx.drawImage(logo, (canvas.width - config.logoWidth) / 2, config.logoY, config.logoWidth, logoHeight);
  }
}

function drawAllPosters() {
  drawPoster("story");
  drawPoster("feed");
}

function setPreset(name) {
  const preset = presets[name];
  activePreset = name;

  Object.entries(preset).forEach(([key, value]) => {
    fields[key].value = value;
  });

  presetButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === name);
  });

  updateRequirementFontOutput();
  drawAllPosters();
}

function updateRequirementFontOutput() {
  requirementsFontSizeValue.textContent = `${fields.requirementsFontSize.value} px`;
}

function safeFilenameTitle() {
  return fields.jobTitle.value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function downloadPoster(format) {
  drawPoster(format);
  const config = layouts[format];
  const link = document.createElement("a");
  link.download = `${safeFilenameTitle() || "vaga"}-${config.width}x${config.height}.png`;
  link.href = canvases[format].toDataURL("image/png");
  link.click();
  statusText.textContent = `PNG ${config.width}x${config.height} gerado`;
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => {
    updateRequirementFontOutput();
    statusText.textContent = "Prévia atualizada";
    drawAllPosters();
  });
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => setPreset(button.dataset.preset));
});

resetButton.addEventListener("click", () => setPreset(activePreset));
downloadStoryButton.addEventListener("click", () => downloadPoster("story"));
downloadFeedButton.addEventListener("click", () => downloadPoster("feed"));

logo.addEventListener("load", drawAllPosters);

document.fonts?.ready.then(drawAllPosters);
updateRequirementFontOutput();
drawAllPosters();
