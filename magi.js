/**
 * ARCANA 探究システム v5.50 - JS
 * P3R Reload Style Logic & Audio
 */

'use strict';

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// ━━━━━━━━━━━━━━━━━━━━━━━━ SOUND SETS (Web Audio Synthesis) ━━━━━━━━━━━━━━━━━━━━━━━━
const ArcanaSound = {
  ctx: null,
  currentSet: 1,
  init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
  
  createOsc(freq, type, vol, duration, startTime = 0, sweep = 0, decay = true) {
    this.init();
    const t = this.ctx.currentTime + startTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if(sweep) osc.frequency.exponentialRampToValueAtTime(sweep, t + duration);
    
    gain.gain.setValueAtTime(vol, t);
    if(decay) gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  },

  // Noise generator for whoosh effects
  createNoise(vol, duration, startTime = 0, type = 'white') {
    this.init();
    const t = this.ctx.currentTime + startTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + duration);
    
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  },

  setAudioSet(set) { this.currentSet = parseInt(set); },

  playBoot() {
    if (this.currentSet === 1) {
      this.createOsc(1760, 'sine', 0.1, 1.5);
      this.createOsc(1320, 'sine', 0.1, 2.0, 0.2);
    } else {
      // SET No.02: Soft electronic rise + bright chime
      this.createOsc(100, 'sine', 0.1, 1.0, 0, 800);
      this.createOsc(1760, 'sine', 0.1, 2.0, 0.8);
      this.createOsc(2637, 'sine', 0.05, 1.5, 0.9);
    }
  },

  playClick() {
    if (this.currentSet === 1) {
      this.createOsc(1200, 'square', 0.05, 0.05);
    } else {
      // SET No.02: Bright synth pluck
      this.createOsc(2500, 'sine', 0.1, 0.15, 0, 1500);
    }
  },

  playMove() {
    if (this.currentSet === 1) {
      this.createOsc(3000, 'sine', 0.05, 0.1, 0, 400);
    } else {
      // SET No.02: Fast electronic swipe
      this.createOsc(800, 'triangle', 0.08, 0.1, 0, 2400);
    }
  },

  playDecision() {
    if (this.currentSet === 1) {
      this.createOsc(880, 'sine', 0.1, 0.5);
    } else {
      // SET No.02: Bright synth bell with echo
      this.createOsc(1200, 'sine', 0.1, 0.4);
      this.createOsc(1200, 'sine', 0.05, 0.3, 0.1);
    }
  },

  playCardAppear() {
    // SET No.02: Soft metallic chime + light sweep
    this.createOsc(1500, 'sine', 0.05, 0.6, 0, 1000);
    this.createOsc(3000, 'sine', 0.03, 0.4, 0.1);
  },

  playCardSpin() {
    // SET No.02: Light futuristic whoosh
    this.createNoise(0.05, 0.8);
    this.createOsc(400, 'triangle', 0.05, 0.8, 0, 1200);
  },

  playCardStop() {
    // SET No.02: Short metallic stop
    this.createOsc(1800, 'sine', 0.1, 0.2);
  },

  playAnalysisStart() {
    // SET No.02: Soft digital pulses
    for(let i=0; i<3; i++) {
      this.createOsc(1000, 'square', 0.03, 0.1, i * 0.3);
    }
  },

  playDataScan() {
    // SET No.02: Light electronic pulses repeating
    for(let i=0; i<10; i++) {
        this.createOsc(1200 + (i*100), 'sine', 0.02, 0.05, i * 0.15);
    }
  },

  playArcanaSpeak(id) {
    if (this.currentSet === 1) {
      if (id === 'magician') this.createOsc(1046, 'sine', 0.1, 0.4);
      if (id === 'justice')  this.createOsc(523, 'square', 0.03, 0.2);
      if (id === 'lovers')   this.createOsc(880, 'sine', 0.1, 0.5);
      if (id === 'empress')  this.createOsc(220, 'triangle', 0.1, 0.4);
      if (id === 'star') {
        [1320, 1567, 1975, 2637].forEach((f, i) => setTimeout(() => this.createOsc(f, 'sine', 0.03, 0.5), i * 30));
      }
    } else {
        // SET No.02: Short elegant crystal chime
        this.createOsc(2093, 'sine', 0.08, 0.4);
        this.createOsc(2637, 'sine', 0.04, 0.3, 0.05);
    }
  },

  playConflict() {
    // SET No.02: Sharp digital clash
    this.createOsc(400, 'sawtooth', 0.1, 0.5);
    this.createOsc(450, 'sawtooth', 0.1, 0.5);
  },

  playHarmony() {
    // SET No.02: Warm harmonic synth tone
    [440, 554, 659, 880].forEach(f => this.createOsc(f, 'sine', 0.05, 0.8));
  },

  playFinalDecision() {
    if (this.currentSet === 1) {
      this.createOsc(880, 'sine', 0.2, 3.0);
      this.createOsc(60, 'triangle', 0.3, 1.5);
    } else {
      // SET No.02: Epic decision with rising effect
      this.createOsc(220, 'sawtooth', 0.1, 1.2, 0, 880);
      this.createOsc(1760, 'sine', 0.1, 1.2, 0.2);
    }
  },

  playResult() {
    // SET No.02: Clear confirmation chime
    this.createOsc(1320, 'sine', 0.1, 0.6);
  },

  playShutdown() {
    // SET No.02: Descending synth tone
    this.createOsc(800, 'sine', 0.1, 1.0, 0, 100);
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━ APP LOGIC ━━━━━━━━━━━━━━━━━━━━━━━━

const PERSONAS = [
  { id: 'magician', code: 'MELCHIOR', name: 'MAGICIAN', role: '科学・技術', color: '#00f2ff', criteria: ['知識・技術', '実現可能性', 'データ整合性', '論理的構造', '効率化'] },
  { id: 'justice',  code: 'BALTHASAR', name: 'JUSTICE', role: '倫理・社会', color: '#d1e8ff', criteria: ['公平・正義', '倫理的配慮', '社会的影響', '法の順守', '公共的利益'] },
  { id: 'lovers',   code: 'CASPER', name: 'LOVERS', color: '#ff4081', role: '感情・人間関係', criteria: ['共感・心理', '人間関係', '情緒的価値', '文化的受容', '信頼性'] },
  { id: 'empress',  code: 'MERCURIUS', name: 'EMPRESS', color: '#69ff47', role: '豊穣・資源', criteria: ['経済的価値', '資源分配', '市場持続性', '生産効率', 'コスト効果'] },
  { id: 'star',     code: 'FUTURUM', name: 'STAR', color: '#b388ff', role: '希望・未来', criteria: ['未来の可能性', '長期ビジョン', 'イノベーション', '持続的可能性', '理想追求'] }
];

const dom = {
  boot: $('#boot-overlay'),
  kadai: $('#kadai-input'),
  teian: $('#teian-input'),
  startBtn: $('#start-judgment-btn'),
  matrix: $('#matrix-rotator'),
  finalBox: $('#final-box'),
  finalRes: $('#fb-result'),
  finalAnly: $('#ab-content'),
  sumKadai: $('#summary-kadai'),
  sumTeian: $('#summary-teian'),
  clock: $('#clock-display'),
  statusLed: $('#status-led'),
  statusLabel: $('#status-label'),
  coreLabel: $('.core-label'),
  loreOverlay: $('#lore-overlay'),
  fileInput: $('#file-input')
};

async function bootSequence() {
  await delay(1000);
  ArcanaSound.playBoot();
  await delay(2000);
  dom.boot.style.opacity = '0';
  await delay(800);
  dom.boot.style.display = 'none';
}

async function runAnalysisSequence() {
  const kadai = dom.kadai.value.trim();
  const teian = dom.teian.value.trim();
  if (!kadai || !teian) { showToast("INPUT DATA REQUIRED"); return; }

  dom.sumKadai.textContent = kadai;
  dom.sumTeian.textContent = teian;
  setState('result');
  resetUI();
  
  if(dom.coreLabel) dom.coreLabel.textContent = "INITIALIZING...";

  // ① START: Pentagon Layout
  dom.matrix.classList.add('pentagon-mode');
  ArcanaSound.playAnalysisStart();
  await delay(800);

  // ② SUMMON: Reveal in Pentagon
  for(const p of PERSONAS) {
    const el = $(`#unit-${p.id}`);
    ArcanaSound.playCardAppear();
    el.classList.add('summoned');
    await delay(300);
  }

  await delay(1000);

  // ③ TRANSITION: Move to Linear Fan
  if(dom.coreLabel) dom.coreLabel.textContent = "DEPLOYING...";
  dom.matrix.classList.remove('pentagon-mode');
  dom.matrix.classList.add('linear-mode');
  ArcanaSound.playMove();
  await delay(1200);

  // ④ RESPONSE: Flip & Analyze
  const results = [];
  ArcanaSound.playDataScan();
  for(const p of PERSONAS) {
    const res = await processArcana(p);
    results.push(res);
    await delay(300);
  }

  // ⑤ MATRIX SYNC
  await delay(500);
  if(dom.coreLabel) dom.coreLabel.textContent = "SYNCING...";
  dom.matrix.classList.add('rotating');
  // ArcanaSound.playMatrix(); -> Set 2 playDataScan or dynamic sound
  await delay(2000);
  dom.matrix.classList.remove('rotating');

  const approveCount = results.filter(r => r.vote === '賛成').length;
  
  if (approveCount >= 4) ArcanaSound.playHarmony();
  else if (approveCount <= 1) ArcanaSound.playConflict();

  showFinalVerdict(approveCount);
}

async function processArcana(p) {
  const el = $(`#unit-${p.id}`);
  
  // Flip to info
  ArcanaSound.playCardSpin();
  el.classList.add('flipped');
  await delay(500);
  ArcanaSound.playCardStop();
  
  el.classList.add('responding');
  ArcanaSound.playArcanaSpeak(p.id);

  const scoreContainer = el.querySelector('.unit-scores');
  const reasonText = el.querySelector('.unit-reason');
  const voteBadge = el.querySelector('.unit-vote');

  reasonText.textContent = "コアデータの深層解析を実行中...";
  await delay(800);

  const scores = p.criteria.map(() => (Math.random() * 5).toFixed(1));
  const avg = scores.reduce((a,b) => a + parseFloat(b), 0) / scores.length;
  const vote = avg >= 3.0 ? '賛成' : '反対';

  scoreContainer.innerHTML = p.criteria.map((c, i) => `
    <div class="score-bar-wrap" style="margin-bottom:8px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
        <span style="font-size:0.65rem; color:#fff; font-weight:700;">${c}</span>
        <span style="font-family:var(--f-mono); font-size:0.75rem; color:${p.color}; font-weight:900;">${scores[i]}</span>
      </div>
      <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
        <div class="sb-fill" style="width:0%; height:100%; background:${p.color}; box-shadow: 0 0 10px ${p.color}; transition:1s cubic-bezier(0.19,1,0.22,1);"></div>
      </div>
    </div>
  `).join('');
  
  setTimeout(() => {
    scoreContainer.querySelectorAll('.sb-fill').forEach((fill, i) => {
      fill.style.width = (parseFloat(scores[i]) / 5 * 100) + '%';
    });
  }, 100);

  voteBadge.textContent = vote;
  voteBadge.className = `unit-vote ${vote === '賛成' ? 'approve' : 'reject'}`;
  
  const msg = vote === '賛成' 
    ? `【解析完了】 ${p.role}の観点から有効性を確認。基準値をクリア。承認する。`
    : `【解析完了】 ${p.role}の観点においてリスクを検知。現段階では否決。`;
  
  typeWriter(reasonText, msg);
  
  await delay(600);
  el.classList.remove('responding');
  return { vote };
}

function showFinalVerdict(approveCount) {
  const isAdopt = approveCount >= 3;
  ArcanaSound.playFinalDecision();
  dom.statusLed.className = 'status-led active';
  dom.statusLabel.textContent = 'RESULT LOADED';
  
  if(dom.coreLabel) dom.coreLabel.textContent = isAdopt ? "SUCCESS" : "FAILED";

  dom.finalBox.className = `final-box flash ${isAdopt ? 'adopt' : 'reject'}`;
  dom.finalRes.textContent = isAdopt ? '承認' : '否決';
  $('#fb-tally').textContent = `賛成: ${approveCount} / 反対: ${5 - approveCount}`;

  const summary = isAdopt 
    ? "承認。アルカナは道を示した。進め。"
    : "否決。再考せよ。道は未だ閉ざされている。";
  
  typeWriter(dom.finalAnly, summary);
  ArcanaSound.playResult();
}

function setState(state) {
  document.body.className = `state-${state}`;
  if (state === 'result') {
    dom.statusLed.classList.add('active');
    dom.statusLabel.textContent = 'DIVE (審議中)';
  } else {
    dom.statusLed.classList.remove('active');
    dom.statusLabel.textContent = 'STANDBY (待機中)';
  }
}

function resetUI() {
  $$('.ai-unit').forEach(el => {
    el.classList.remove('summoned', 'responding', 'flipped');
    const pid = el.id.replace('unit-', '');
    const p = PERSONAS.find(x => x.id === pid);
    
    if (p) {
      const nameEl = el.querySelector('.unit-name');
      const roleEl = el.querySelector('.unit-role');
      if (nameEl) nameEl.textContent = p.name;
      if (roleEl) roleEl.textContent = `${p.code} / ${p.role}`;
    }

    const reason = el.querySelector('.unit-reason');
    if(reason) reason.textContent = 'Waiting...';
    const vote = el.querySelector('.unit-vote');
    if(vote) { vote.textContent = '—'; vote.className = 'unit-vote'; }
    const scores = el.querySelector('.unit-scores');
    if(scores) scores.innerHTML = '';
  });
  dom.matrix.className = 'matrix-rotator'; 
  dom.finalBox.className = 'final-box';
  dom.finalRes.textContent = 'WAITING';
  dom.finalAnly.textContent = '分析待機中...';
}

function typeWriter(el, text) {
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) { el.textContent += text.charAt(i); i++; }
    else { clearInterval(timer); }
  }, 20);
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }
function showToast(m) { const t=$('#toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 3000); }

// Event Listeners
dom.startBtn.addEventListener('click', runAnalysisSequence);
$('#reset-btn').addEventListener('click', () => { setState('input'); ArcanaSound.playShutdown(); });
$('#back-to-input-btn').addEventListener('click', () => setState('input'));

$('#lore-open-btn').addEventListener('click', () => {
  dom.loreOverlay.classList.add('active');
  ArcanaSound.playDecision();
});
$('#lore-close-btn').addEventListener('click', () => {
  dom.loreOverlay.classList.remove('active');
  ArcanaSound.playShutdown();
});

// Sound Set Toggle
$$('.audio-set-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.audio-set-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ArcanaSound.setAudioSet(btn.dataset.set);
    ArcanaSound.playDecision();
  });
});

// Auto-Extraction Feature
dom.fileInput?.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  showToast(`Extracting: ${file.name}`);
  ArcanaSound.playDataScan();
  
  const reader = new FileReader();
  reader.onload = (ev) => {
    const text = ev.target.result;
    // Basic text extraction placeholder - in real app would use PDF.js etc.
    dom.teian.value = `【FILE: ${file.name}】\n` + text.substring(0, 1000) + "...";
    showToast("Extraction Complete");
  };
  
  if (file.type === "text/plain") {
    reader.readAsText(file);
  } else {
    // For PDF etc, just dummy for now as actual worker needs setup
    setTimeout(() => {
        dom.teian.value = `【ANALYSIS OF ${file.name}】\n(Automated text extraction from documents is active. Summary of content is being generated...)`;
        showToast("Extracted metadata from document.");
    }, 1000);
  }
});

setInterval(() => {
  const d = new Date();
  dom.clock.textContent = d.toLocaleTimeString('ja-JP', { hour12: false }) + ' JST';
}, 1000);

window.onload = bootSequence;
