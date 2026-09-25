/* 우리 가족 기도말씀 30 - 앱 로직
   외부 프레임워크 없이 순수 자바스크립트로 작성 */
(function () {
  'use strict';

  var STORAGE_KEY = 'familyPrayerBible30.v1';
  var MIN_VERSES_PER_THEME = 30; // 주제마다 기본으로 갖춰야 하는 구절 수
  var DEFAULT_NAMES = ['아빠', '엄마', '딸'];
  var SCRIPT_TAG_PATTERN = /<\s*script/i;
  var HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

  /* ---------------------------------------------------------
   * 0. 데이터 검증
   * --------------------------------------------------------- */
  function validateThemes(themes) {
    var errors = [];

    if (!Array.isArray(themes) || themes.length === 0) {
      return { valid: false, errors: ['BIBLE_THEMES가 비어 있거나 배열이 아닙니다.'] };
    }

    var seenKeys = {};
    themes.forEach(function (theme, tIdx) {
      var where = 'themes[' + tIdx + ']';
      if (!theme || typeof theme !== 'object') {
        errors.push(where + ': 객체가 아닙니다.');
        return;
      }
      if (typeof theme.key !== 'string' || theme.key.trim().length === 0) {
        errors.push(where + ': key 값이 비어 있습니다.');
      } else if (seenKeys[theme.key]) {
        errors.push('주제 key "' + theme.key + '"가 중복되었습니다.');
      } else {
        seenKeys[theme.key] = true;
      }
      if (typeof theme.name !== 'string' || theme.name.trim().length === 0) {
        errors.push(where + ': name 값이 비어 있습니다.');
      }
      errors = errors.concat(validateVerseList(theme.verses, theme.name || theme.key || where));
    });

    // 가족 순서가 3명 단위로 정확히 반복되는지 확인 (아빠→엄마→딸 반복 규칙 자체 점검)
    for (var id = 1; id <= MIN_VERSES_PER_THEME; id++) {
      if ((id - 1) % 3 !== personIndexForVerseId(id)) {
        errors.push('id ' + id + '의 가족 순서 계산이 3인 반복 규칙과 일치하지 않습니다.');
        break;
      }
    }

    return { valid: errors.length === 0, errors: errors };
  }

  // 한 주제의 구절 목록 검사: id가 1부터 빠짐없이 이어지고, 네 항목이 모두 채워져 있어야 한다.
  function validateVerseList(verses, label) {
    var errors = [];
    if (!Array.isArray(verses)) {
      return ['[' + label + '] verses가 배열이 아닙니다.'];
    }
    if (verses.length < MIN_VERSES_PER_THEME) {
      errors.push('[' + label + '] 구절이 ' + MIN_VERSES_PER_THEME + '개보다 적습니다. (현재 ' + verses.length + '개)');
    }

    var seenIds = {};
    verses.forEach(function (v, idx) {
      var where = '[' + label + '] verses[' + idx + ']';
      if (!v || typeof v !== 'object') {
        errors.push(where + ': 객체가 아닙니다.');
        return;
      }
      if (typeof v.id !== 'number' || v.id < 1 || v.id > verses.length) {
        errors.push(where + ': id 값이 올바르지 않습니다. (' + v.id + ')');
      } else if (seenIds[v.id]) {
        errors.push('[' + label + '] id ' + v.id + '가 중복되었습니다.');
      } else {
        seenIds[v.id] = true;
      }

      ['referenceKo', 'referenceEn', 'korean', 'english'].forEach(function (field) {
        var val = v[field];
        if (typeof val !== 'string' || val.trim().length === 0) {
          errors.push('[' + label + '] id ' + v.id + ': ' + field + ' 값이 비어 있습니다.');
          return;
        }
        if (SCRIPT_TAG_PATTERN.test(val) || HTML_TAG_PATTERN.test(val)) {
          errors.push('[' + label + '] id ' + v.id + ': ' + field + ' 값에 HTML/스크립트 태그로 의심되는 내용이 포함되어 있습니다.');
        }
      });
    });

    for (var i = 1; i <= verses.length; i++) {
      if (!seenIds[i]) {
        errors.push('[' + label + '] id ' + i + '에 해당하는 구절이 없습니다.');
      }
    }

    return errors;
  }

  function personIndexForVerseId(verseId) {
    return (verseId - 1) % 3;
  }

  /* ---------------------------------------------------------
   * 1. 저장소(localStorage)
   * --------------------------------------------------------- */
  function defaultState() {
    return {
      names: DEFAULT_NAMES.slice(),
      startMode: 'restart',
      speechRate: 1.0,
      fontSize: 'normal',
      lastUsedDate: null,
      session: null, // { themeKey, verseIds, index }
      themes: {}     // 주제 key -> { lastVerseId, completedIds, customVerses }
    };
  }

  function loadState() {
    var base = defaultState();
    var parsed = null;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) parsed = JSON.parse(raw);
    } catch (e) {
      console.error('저장된 데이터를 불러오는 중 오류가 발생했습니다.', e);
    }

    if (parsed && typeof parsed === 'object') {
      Object.keys(base).forEach(function (key) {
        if (parsed[key] !== undefined) base[key] = parsed[key];
      });

      // 주제 구분이 없던 예전 버전의 기록은 첫 번째 주제(기도)의 기록으로 옮긴다.
      if (!parsed.themes && firstThemeKey()) {
        base.themes = {};
        base.themes[firstThemeKey()] = {
          lastVerseId: typeof parsed.lastVerseId === 'number' ? parsed.lastVerseId : 0,
          completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
          customVerses: Array.isArray(parsed.customVerses) ? parsed.customVerses : []
        };
      }
    }

    if (!Array.isArray(base.names) || base.names.length !== 3) {
      base.names = DEFAULT_NAMES.slice();
    }
    if (!base.themes || typeof base.themes !== 'object') base.themes = {};
    // 주제를 구분하지 않던 시절의 세션은 이어받지 않는다.
    if (base.session && typeof base.session.themeKey !== 'string') base.session = null;
    return base;
  }

  function firstThemeKey() {
    var themes = window.BIBLE_THEMES;
    return (Array.isArray(themes) && themes.length > 0 && themes[0]) ? themes[0].key : null;
  }

  var state = loadState();

  function saveState() {
    try {
      state.lastUsedDate = new Date().toISOString().slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('데이터를 저장하지 못했습니다. (localStorage 사용 불가)', e);
    }
  }

  /* ---------------------------------------------------------
   * 2. DOM 참조
   * --------------------------------------------------------- */
  var $ = function (id) { return document.getElementById(id); };

  var appRoot = $('app');
  var screens = {
    error: $('screen-error'),
    home: $('screen-home'),
    guide: $('screen-guide'),
    addVerse: $('screen-add-verse'),
    reading: $('screen-reading'),
    complete: $('screen-complete')
  };
  var liveRegion = $('live-region');

  function announce(text) {
    if (!liveRegion) return;
    liveRegion.textContent = '';
    window.setTimeout(function () { liveRegion.textContent = text; }, 30);
  }

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      if (!screens[key]) return;
      screens[key].hidden = key !== name;
    });
    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------
   * 3. 버튼 잠금(디바운스) - 연속 터치로 인한 중복 이동 방지
   * --------------------------------------------------------- */
  var navLock = false;
  function withLock(fn) {
    return function () {
      if (navLock) return;
      navLock = true;
      try {
        fn.apply(null, arguments);
      } finally {
        window.setTimeout(function () { navLock = false; }, 350);
      }
    };
  }

  /* ---------------------------------------------------------
   * 4. 음성(Web Speech API) 컨트롤러
   * --------------------------------------------------------- */
  var Speech = (function () {
    var supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    var synth = supported ? window.speechSynthesis : null;
    var voices = [];
    var selectedVoice = null;
    var sentences = [];
    var sentenceEls = [];
    var currentSentenceIndex = -1;
    var status = 'idle'; // idle | playing | paused | finished | error | unsupported
    var onStatusChange = function () {};
    var pendingCancel = false;
    var resumeVoiceRetries = 0;
    var watchdogTimer = null;
    var WATCHDOG_MS = 15000;

    function clearWatchdog() {
      if (watchdogTimer) {
        window.clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
    }

    function loadVoices() {
      if (!supported) return;
      voices = synth.getVoices() || [];
      if (voices.length > 0) {
        selectedVoice = pickVoice(voices);
      }
    }

    function pickVoice(list) {
      var enUS = list.filter(function (v) { return v.lang === 'en-US' || v.lang === 'en_US'; });
      var natural = enUS.find(function (v) { return /natural/i.test(v.name); });
      if (natural) return natural;

      var femaleHints = /female|zira|samantha|susan|victoria|karen|moira|tessa|serena|allison|ava|joanna|salli|kimberly|kendra|jenny|aria/i;
      var female = enUS.find(function (v) { return femaleHints.test(v.name); });
      if (female) return female;

      if (enUS.length > 0) return enUS[0];

      var enGB = list.filter(function (v) { return v.lang === 'en-GB' || v.lang === 'en_GB'; });
      if (enGB.length > 0) return enGB[0];

      var anyEn = list.find(function (v) { return /^en/i.test(v.lang); });
      if (anyEn) return anyEn;

      return null;
    }

    if (supported) {
      loadVoices();
      if (typeof synth.addEventListener === 'function') {
        synth.addEventListener('voiceschanged', loadVoices);
      } else {
        synth.onvoiceschanged = loadVoices;
      }
      // 일부 브라우저는 getVoices()가 초기에 비어 있다가 지연 로드되므로 재시도한다
      var retryTimer = window.setInterval(function () {
        if (selectedVoice || resumeVoiceRetries > 10) {
          window.clearInterval(retryTimer);
          return;
        }
        resumeVoiceRetries++;
        loadVoices();
      }, 400);
    }

    function splitSentences(text) {
      var parts = text
        .replace(/\s+/g, ' ')
        .trim()
        .match(/[^.!?]+[.!?]*/g);
      if (!parts || parts.length === 0) return [text];
      return parts.map(function (p) { return p.trim(); }).filter(Boolean);
    }

    function setStatus(next) {
      status = next;
      onStatusChange(status);
    }

    function prepare(text, containerEl, rate) {
      cancel();
      sentences = splitSentences(text);
      containerEl.innerHTML = '';
      sentenceEls = sentences.map(function (s, i) {
        var span = document.createElement('span');
        span.className = 'sentence';
        span.dataset.index = String(i);
        span.textContent = (i > 0 ? ' ' : '') + s;
        containerEl.appendChild(span);
        return span;
      });
      currentSentenceIndex = -1;
      setStatus('idle');
    }

    function highlight(index) {
      sentenceEls.forEach(function (el, i) {
        if (i === index) el.classList.add('speaking');
        else el.classList.remove('speaking');
      });
    }

    function clearHighlight() {
      sentenceEls.forEach(function (el) { el.classList.remove('speaking'); });
    }

    function speakFrom(index, rate) {
      if (!supported) {
        setStatus('unsupported');
        return;
      }
      if (index >= sentences.length) {
        clearHighlight();
        setStatus('finished');
        return;
      }
      currentSentenceIndex = index;
      highlight(index);
      var utter = new SpeechSynthesisUtterance(sentences[index]);
      utter.lang = 'en-US';
      if (selectedVoice) utter.voice = selectedVoice;
      utter.rate = rate || 1.0;
      utter.pitch = 1.0;

      utter.onend = function () {
        clearWatchdog();
        if (pendingCancel) { pendingCancel = false; return; }
        window.setTimeout(function () {
          if (pendingCancel) { pendingCancel = false; return; }
          speakFrom(index + 1, rate);
        }, 260);
      };
      utter.onerror = function (ev) {
        clearWatchdog();
        if (pendingCancel) { pendingCancel = false; return; }
        console.error('음성 재생 중 오류가 발생했습니다.', ev.error);
        clearHighlight();
        setStatus('error');
      };

      try {
        synth.speak(utter);
        setStatus('playing');
        // 일부 브라우저/기기에서는 onend나 onerror가 전혀 호출되지 않고
        // 재생이 멈추는 경우가 있어, 일정 시간이 지나도 응답이 없으면
        // 오류로 간주해 사용자가 다음 단계로 진행할 수 있게 한다.
        clearWatchdog();
        watchdogTimer = window.setTimeout(function () {
          watchdogTimer = null;
          if (pendingCancel) return;
          console.error('음성 재생 응답이 없어 시간 초과로 처리합니다.');
          clearHighlight();
          setStatus('error');
        }, WATCHDOG_MS);
      } catch (e) {
        console.error('음성 재생을 시작하지 못했습니다.', e);
        setStatus('error');
      }
    }

    function start(rate) {
      if (!supported) { setStatus('unsupported'); return; }
      pendingCancel = false;
      synth.cancel();
      speakFrom(0, rate);
    }

    function replay(rate) {
      if (!supported) { setStatus('unsupported'); return; }
      pendingCancel = false;
      synth.cancel();
      window.setTimeout(function () { speakFrom(0, rate); }, 30);
    }

    function pause() {
      if (!supported) return;
      try {
        synth.pause();
        setStatus('paused');
      } catch (e) { /* 지원하지 않는 환경은 무시 */ }
    }

    function resume() {
      if (!supported) return;
      try {
        synth.resume();
        setStatus('playing');
      } catch (e) { /* 지원하지 않는 환경은 무시 */ }
    }

    function cancel() {
      clearWatchdog();
      if (!supported) return;
      pendingCancel = true;
      try { synth.cancel(); } catch (e) { /* noop */ }
      clearHighlight();
      currentSentenceIndex = -1;
    }

    function isSupported() { return supported; }
    function getStatus() { return status; }
    function setOnStatusChange(fn) { onStatusChange = fn; }

    return {
      prepare: prepare,
      start: start,
      replay: replay,
      pause: pause,
      resume: resume,
      cancel: cancel,
      isSupported: isSupported,
      getStatus: getStatus,
      setOnStatusChange: setOnStatusChange
    };
  })();

  /* ---------------------------------------------------------
   * 5. 화면 흐름 상태
   * --------------------------------------------------------- */
  var THEMES = [];        // verses.js의 주제 목록 (기도 / 믿음 ...)
  var versesIndex = {};   // 주제 key -> { 구절번호: 구절 }

  function themeByKey(key) {
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].key === key) return THEMES[i];
    }
    return null;
  }

  function themeName(key) {
    var theme = themeByKey(key);
    return theme ? theme.name : '';
  }

  // 주제별 진행 기록. 없으면 만들어 준다.
  function themeState(key) {
    var t = state.themes[key];
    if (!t || typeof t !== 'object') {
      t = { lastVerseId: 0, completedIds: [], customVerses: [] };
      state.themes[key] = t;
    }
    if (typeof t.lastVerseId !== 'number') t.lastVerseId = 0;
    if (!Array.isArray(t.completedIds)) t.completedIds = [];
    if (!Array.isArray(t.customVerses)) t.customVerses = [];
    return t;
  }

  // 주제의 기본 구절 + 그 주제에 '말씀추가'로 직접 넣은 구절을 합친 전체 목록.
  // 추가 구절의 번호는 기본 구절 다음 번호(31, 32, ...)로 이어진다.
  function versesForTheme(key) {
    var theme = themeByKey(key);
    if (!theme) return [];
    return theme.verses.concat(themeState(key).customVerses);
  }

  function totalVerseCount(key) {
    return versesForTheme(key).length;
  }

  function verseOf(key, verseId) {
    var map = versesIndex[key];
    return map ? map[verseId] : null;
  }

  function nextCustomVerseId(key) {
    var maxId = 0;
    versesForTheme(key).forEach(function (v) {
      if (v.id > maxId) maxId = v.id;
    });
    return maxId + 1;
  }

  function indexVerses() {
    versesIndex = {};
    THEMES.forEach(function (theme) {
      var map = {};
      versesForTheme(theme.key).forEach(function (v) { map[v.id] = v; });
      versesIndex[theme.key] = map;
    });
  }

  function completedCount(key) {
    var unique = {};
    themeState(key).completedIds.forEach(function (id) { unique[id] = true; });
    return Object.keys(unique).length;
  }

  function markCompleted(key, verseId) {
    var t = themeState(key);
    if (t.completedIds.indexOf(verseId) === -1) {
      t.completedIds.push(verseId);
    }
    if (verseId > t.lastVerseId) t.lastVerseId = verseId;
  }

  // 주제 버튼을 누르면 시작 구절부터 그 주제의 마지막 구절까지 전부 이어서 읽는다.
  function buildSessionVerseIds(key, startId) {
    var ids = [];
    var total = totalVerseCount(key);
    for (var i = startId; i <= total; i++) {
      ids.push(i);
    }
    return ids;
  }

  function startIdFor(key) {
    var t = themeState(key);
    var total = totalVerseCount(key);
    var hasProgress = t.lastVerseId > 0 && t.lastVerseId < total;
    if (hasProgress && state.startMode === 'resume') return t.lastVerseId + 1;
    return 1;
  }

  function startSession(key, startId) {
    var ids = buildSessionVerseIds(key, startId);
    if (ids.length === 0) ids = buildSessionVerseIds(key, 1);
    state.session = { themeKey: key, verseIds: ids, index: 0 };
    saveState();
    enterReading();
  }

  /* ---------------------------------------------------------
   * 6. 홈 화면
   * --------------------------------------------------------- */
  var startPointGroup = $('start-point-group');
  var fontsizeGroup = $('fontsize-group');
  var resumeHint = $('resume-hint');
  var nameInputs = [$('name-input-0'), $('name-input-1'), $('name-input-2')];

  function setRadioGroupValue(group, value) {
    var buttons = group.querySelectorAll('.option-btn');
    buttons.forEach(function (btn) {
      var checked = btn.getAttribute('data-value') === String(value);
      btn.setAttribute('aria-checked', checked ? 'true' : 'false');
    });
  }

  function getRadioGroupValue(group) {
    var checked = group.querySelector('.option-btn[aria-checked="true"]');
    return checked ? checked.getAttribute('data-value') : null;
  }

  function applyFontSize(size) {
    state.fontSize = size;
    document.documentElement.setAttribute('data-fontsize', size);
    setRadioGroupValue(fontsizeGroup, size);
  }

  function anyThemeHasProgress() {
    return THEMES.some(function (theme) {
      var t = themeState(theme.key);
      return t.lastVerseId > 0 && t.lastVerseId < totalVerseCount(theme.key);
    });
  }

  function renderHome() {
    var hasProgress = anyThemeHasProgress();
    if (!hasProgress) {
      // 읽던 기록이 없으면 '1번부터 시작'이 기본값
      state.startMode = 'restart';
    }
    setRadioGroupValue(startPointGroup, state.startMode || 'restart');

    // 주제별 진행 상황을 한 줄로 안내한다. (예: 기도 3번까지 읽음 · 믿음 아직 시작 전)
    resumeHint.textContent = THEMES.map(function (theme) {
      var t = themeState(theme.key);
      var total = totalVerseCount(theme.key);
      if (t.lastVerseId <= 0) return theme.name + ' 아직 시작 전 (전체 ' + total + '구절)';
      if (t.lastVerseId >= total) return theme.name + ' 전체 ' + total + '구절 완료';
      return theme.name + ' ' + t.lastVerseId + '번까지 읽음 (다음 ' + (t.lastVerseId + 1) + '번 / 전체 ' + total + '구절)';
    }).join(' · ');

    renderThemeButtons();
    applyFontSize(state.fontSize);

    nameInputs.forEach(function (input, i) {
      input.value = state.names[i] || DEFAULT_NAMES[i];
    });

    renderCopyrightFooter();
  }

  // 홈 화면의 주제 버튼(기도 / 믿음 ...)을 verses.js의 주제 목록대로 만든다.
  function renderThemeButtons() {
    var wrap = $('theme-buttons');
    if (!wrap) return;
    wrap.innerHTML = '';
    THEMES.forEach(function (theme) {
      var t = themeState(theme.key);
      var total = totalVerseCount(theme.key);
      var startId = startIdFor(theme.key);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary btn-large theme-btn';
      btn.setAttribute('data-theme-key', theme.key);
      btn.setAttribute('aria-label', theme.name + ' 말씀 읽기 시작');

      var nameEl = document.createElement('span');
      nameEl.className = 'theme-btn-name';
      nameEl.textContent = theme.name;

      var subEl = document.createElement('span');
      subEl.className = 'theme-btn-sub';
      subEl.textContent = t.lastVerseId >= total
        ? ('전체 ' + total + '구절 완료 · ' + startId + '번부터')
        : (startId + '번부터 · 전체 ' + total + '구절');

      btn.appendChild(nameEl);
      btn.appendChild(subEl);
      wrap.appendChild(btn);
    });
  }

  function renderCopyrightFooter() {
    var footer = $('copyright-footer');
    if (!footer) return;
    var meta = window.BIBLE_TEXT_META || {};
    var lines = [];
    if (meta.koreanVersionName) {
      lines.push('<p>한글 성경: ' + escapeHtml(meta.koreanVersionName) + '</p>');
    }
    if (meta.englishVersionName) {
      lines.push('<p>English Bible: ' + escapeHtml(meta.englishVersionName) + '</p>');
    }
    if (meta.englishCopyrightNotice) {
      lines.push('<p>' + escapeHtml(meta.englishCopyrightNotice) + '</p>');
    }
    if (meta.koreanCopyrightNotice) {
      lines.push('<p>' + escapeHtml(meta.koreanCopyrightNotice) + '</p>');
    }
    footer.innerHTML = lines.join('');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  startPointGroup.addEventListener('click', function (e) {
    var btn = e.target.closest('.option-btn');
    if (!btn) return;
    state.startMode = btn.getAttribute('data-value');
    setRadioGroupValue(startPointGroup, state.startMode);
    renderThemeButtons(); // 주제 버튼에 표시되는 '몇 번부터' 안내를 갱신
    saveState();
  });

  fontsizeGroup.addEventListener('click', function (e) {
    var btn = e.target.closest('.option-btn');
    if (!btn) return;
    applyFontSize(btn.getAttribute('data-value'));
    saveState();
  });

  nameInputs.forEach(function (input, i) {
    input.addEventListener('change', function () {
      var v = input.value.trim();
      state.names[i] = v.length > 0 ? v : DEFAULT_NAMES[i];
      input.value = state.names[i];
      saveState();
    });
  });

  $('btn-guide').addEventListener('click', function () {
    showScreen('guide');
  });
  $('btn-guide-close').addEventListener('click', function () {
    showScreen('home');
  });

  var confirmDialog = $('confirm-dialog');
  $('btn-reset').addEventListener('click', function () {
    confirmDialog.hidden = false;
    $('confirm-cancel').focus();
  });
  $('confirm-cancel').addEventListener('click', function () {
    confirmDialog.hidden = true;
  });
  $('confirm-ok').addEventListener('click', function () {
    confirmDialog.hidden = true;
    // 읽기 기록만 지우고 가족 이름·글자 크기·직접 추가한 말씀은 그대로 둔다.
    Object.keys(state.themes).forEach(function (key) {
      var t = themeState(key);
      t.lastVerseId = 0;
      t.completedIds = [];
    });
    state.session = null;
    state.startMode = 'restart';
    saveState();
    renderHome();
    announce('읽기 기록이 초기화되었습니다.');
  });

  // 주제 버튼(기도 / 믿음 ...)은 app.js가 동적으로 만들기 때문에 상위 요소에서 클릭을 받는다.
  $('theme-buttons').addEventListener('click', withLock(function (e) {
    var btn = e.target.closest('.theme-btn');
    if (!btn) return;
    var key = btn.getAttribute('data-theme-key');
    if (!themeByKey(key)) return;
    startSession(key, startIdFor(key));
  }));

  $('btn-add-verse').addEventListener('click', withLock(function () {
    showScreen('addVerse');
    addVerseError.hidden = true;
    addVerseSuccess.hidden = true;
    renderAddThemeOptions();
  }));

  /* ---------------------------------------------------------
   * 6-1. 말씀 추가 화면
   * --------------------------------------------------------- */
  var addVerseForm = $('add-verse-form');
  var addVerseError = $('add-verse-error');
  var addVerseSuccess = $('add-verse-success');

  function showAddVerseError(msg) {
    addVerseSuccess.hidden = true;
    addVerseError.textContent = msg;
    addVerseError.hidden = false;
  }

  function clearAddVerseForm() {
    $('add-book-ko').value = '';
    $('add-chapter').value = '';
    $('add-verse-num').value = '';
    $('add-reference-en').value = '';
    $('add-korean').value = '';
    $('add-english').value = '';
  }

  // '어느 목록에 추가할까요?' 선택 버튼을 주제 목록대로 만든다.
  var addThemeGroup = $('add-theme-group');

  function renderAddThemeOptions() {
    var selected = getRadioGroupValue(addThemeGroup) || (THEMES[0] && THEMES[0].key);
    addThemeGroup.innerHTML = '';
    THEMES.forEach(function (theme) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('data-value', theme.key);
      btn.setAttribute('aria-checked', theme.key === selected ? 'true' : 'false');
      btn.textContent = theme.name;
      addThemeGroup.appendChild(btn);
    });
  }

  addThemeGroup.addEventListener('click', function (e) {
    var btn = e.target.closest('.option-btn');
    if (!btn) return;
    setRadioGroupValue(addThemeGroup, btn.getAttribute('data-value'));
  });

  $('btn-add-verse-cancel').addEventListener('click', withLock(function () {
    addVerseError.hidden = true;
    addVerseSuccess.hidden = true;
    showScreen('home');
    renderHome();
  }));

  var handleAddVerseSubmit = withLock(function () {
    var themeKey = getRadioGroupValue(addThemeGroup);
    if (!themeByKey(themeKey)) {
      showAddVerseError('어느 목록에 추가할지 먼저 선택해 주세요.');
      return;
    }
    var bookKo = $('add-book-ko').value.trim();
    var chapter = $('add-chapter').value.trim();
    var verseNum = $('add-verse-num').value.trim();
    var referenceEn = $('add-reference-en').value.trim();
    var korean = $('add-korean').value.trim();
    var english = $('add-english').value.trim();

    if (!bookKo || !chapter || !verseNum || !referenceEn || !korean || !english) {
      showAddVerseError('모든 항목을 입력해 주세요.');
      return;
    }
    if (!/^[0-9]+$/.test(chapter) || !/^[0-9]+$/.test(verseNum)) {
      showAddVerseError('장과 절은 숫자로 입력해 주세요.');
      return;
    }

    var fields = [bookKo, referenceEn, korean, english];
    for (var i = 0; i < fields.length; i++) {
      if (SCRIPT_TAG_PATTERN.test(fields[i]) || HTML_TAG_PATTERN.test(fields[i])) {
        showAddVerseError('입력 내용에 HTML/스크립트로 의심되는 내용이 포함되어 있어 추가할 수 없습니다.');
        return;
      }
    }

    var newId = nextCustomVerseId(themeKey);
    var referenceKo = bookKo + ' ' + chapter + '장 ' + verseNum + '절';

    themeState(themeKey).customVerses.push({
      id: newId,
      referenceKo: referenceKo,
      referenceEn: referenceEn,
      korean: korean,
      english: english
    });
    saveState();
    indexVerses();

    clearAddVerseForm();
    addVerseError.hidden = true;
    addVerseSuccess.textContent = themeName(themeKey) + ' 목록에 ' + newId + '번 말씀으로 추가되었습니다. (' + referenceKo + ')';
    addVerseSuccess.hidden = false;
    announce(referenceKo + '가 ' + themeName(themeKey) + ' 목록의 ' + newId + '번 말씀으로 추가되었습니다.');
  });

  addVerseForm.addEventListener('submit', function (e) {
    // 폼의 기본 제출(페이지 새로고침)은 잠금 상태와 무관하게 항상 막아야 한다.
    // withLock으로 감싼 처리 로직만 잠금 대상으로 두어, 연타로 인한 새로고침을 방지한다.
    e.preventDefault();
    handleAddVerseSubmit();
  });

  /* ---------------------------------------------------------
   * 7. 읽기 화면
   * --------------------------------------------------------- */
  var elProgressText = $('progress-text');
  var elProgressFill = $('progress-bar-fill');
  var elProgressTrack = $('progress-bar-track');
  var elTurnBadge = $('turn-badge');
  var elReference = $('reading-reference');
  var elKorean = $('verse-text-ko');
  var elEnglish = $('verse-text-en');
  var elSpeechStatus = $('speech-status');
  var btnListen = $('btn-listen');
  var btnListenLabel = $('btn-listen-label');
  var btnPause = $('btn-pause');
  var btnResume = $('btn-resume');
  var btnReplay = $('btn-replay');
  var btnStop = $('btn-stop');
  var btnPrev = $('btn-prev');
  var btnNext = $('btn-next');
  var rate08 = $('rate-08');
  var rate10 = $('rate-10');

  function enterReading() {
    showScreen('reading');
    renderVerse();
    requestWakeLock();
  }

  function currentSessionVerseId() {
    if (!state.session) return null;
    return state.session.verseIds[state.session.index];
  }

  function currentThemeKey() {
    return state.session ? state.session.themeKey : null;
  }

  function renderVerse() {
    if (!state.session) return;
    var themeKey = currentThemeKey();
    var verseId = currentSessionVerseId();
    var verse = verseOf(themeKey, verseId);
    if (!verse) return;

    var todayTotal = state.session.verseIds.length;
    var todayCurrent = state.session.index + 1;
    var total = totalVerseCount(themeKey);
    elProgressText.textContent = themeName(themeKey) + ' · 이번에 ' + todayCurrent + '/' + todayTotal +
      ' · 전체 ' + verseId + '/' + total;
    var pct = Math.round((todayCurrent / todayTotal) * 100);
    elProgressFill.style.width = pct + '%';
    elProgressTrack.setAttribute('aria-valuenow', String(pct));

    var personIdx = personIndexForVerseId(verseId);
    var personName = state.names[personIdx] || DEFAULT_NAMES[personIdx];
    elTurnBadge.textContent = personName + ' 차례';

    elReference.textContent = verseId + '번 · ' + verse.referenceKo + ' · ' + verse.referenceEn;
    elKorean.textContent = cleanText(verse.korean);

    Speech.cancel();
    Speech.prepare(cleanText(verse.english), elEnglish, state.speechRate);

    resetSpeechButtons();

    btnPrev.disabled = state.session.index === 0;

    announce(personName + ' 차례, ' + verse.referenceKo);
    updateSpeechStatus('');
  }

  function cleanText(text) {
    if (typeof text !== 'string') return '';
    return text.trim().replace(/^["'“”‘’()（）]+/, '').replace(/["'“”‘’()（）]+$/, '');
  }

  function resetSpeechButtons() {
    btnListenLabel.textContent = '영어 듣기';
    btnListen.disabled = false;
    btnListen.setAttribute('aria-label', '영어 듣기 시작');
    btnPause.disabled = true;
    btnResume.disabled = true;
    btnReplay.disabled = true;
    btnStop.disabled = true;
    rate08.setAttribute('aria-checked', state.speechRate === 0.8 ? 'true' : 'false');
    rate10.setAttribute('aria-checked', state.speechRate === 0.8 ? 'false' : 'true');

    if (!Speech.isSupported()) {
      btnListen.hidden = true;
      btnPause.hidden = true;
      btnResume.hidden = true;
      btnReplay.hidden = true;
      btnStop.hidden = true;
      updateSpeechStatus('이 기기(브라우저)에서는 음성 재생을 지원하지 않습니다. 위의 영어 본문을 직접 읽어 주세요.');
    }
  }

  function updateSpeechStatus(text) {
    elSpeechStatus.textContent = text;
  }

  Speech.setOnStatusChange(function (status) {
    switch (status) {
      case 'playing':
        btnListenLabel.textContent = '영어 읽는 중…';
        btnListen.disabled = true;
        btnPause.disabled = false;
        btnResume.disabled = true;
        btnReplay.disabled = false;
        btnStop.disabled = false;
        updateSpeechStatus('영어 음성을 재생하고 있습니다.');
        announce('영어 음성 재생 중');
        break;
      case 'paused':
        btnPause.disabled = true;
        btnResume.disabled = false;
        btnReplay.disabled = false;
        btnStop.disabled = false;
        updateSpeechStatus('일시정지되었습니다.');
        announce('영어 음성 일시정지');
        break;
      case 'finished':
        btnListenLabel.textContent = '영어 듣기';
        btnListen.disabled = false;
        btnPause.disabled = true;
        btnResume.disabled = true;
        btnReplay.disabled = false;
        btnStop.disabled = true;
        updateSpeechStatus('영어 음성 재생이 끝났습니다.');
        announce('영어 음성 재생이 끝났습니다.');
        var vId = currentSessionVerseId();
        if (vId) markCompleted(currentThemeKey(), vId);
        saveState();
        break;
      case 'error':
        btnListenLabel.textContent = '영어 듣기';
        btnListen.disabled = false;
        btnPause.disabled = true;
        btnResume.disabled = true;
        btnReplay.disabled = false;
        btnStop.disabled = true;
        updateSpeechStatus('음성 재생 중 문제가 발생했습니다. 위의 영어 본문을 직접 읽으셔도 됩니다.');
        break;
      default:
        break;
    }
  });

  btnListen.addEventListener('click', withLock(function () {
    Speech.start(state.speechRate);
  }));
  btnPause.addEventListener('click', function () { Speech.pause(); });
  btnResume.addEventListener('click', function () { Speech.resume(); });
  btnReplay.addEventListener('click', withLock(function () { Speech.replay(state.speechRate); }));
  btnStop.addEventListener('click', function () {
    Speech.cancel();
    btnListenLabel.textContent = '영어 듣기';
    btnListen.disabled = false;
    btnPause.disabled = true;
    btnResume.disabled = true;
    btnReplay.disabled = false;
    btnStop.disabled = true;
    updateSpeechStatus('음성을 정지했습니다.');
  });

  function setRate(rate) {
    state.speechRate = rate;
    rate08.setAttribute('aria-checked', rate === 0.8 ? 'true' : 'false');
    rate10.setAttribute('aria-checked', rate === 0.8 ? 'false' : 'true');
    saveState();
  }
  rate08.addEventListener('click', function () { setRate(0.8); });
  rate10.addEventListener('click', function () { setRate(1.0); });

  btnNext.addEventListener('click', withLock(function () {
    if (!state.session) return;
    Speech.cancel();
    markCompleted(currentThemeKey(), currentSessionVerseId());

    if (state.session.index + 1 < state.session.verseIds.length) {
      state.session.index += 1;
      saveState();
      renderVerse();
    } else {
      finishSession();
    }
  }));

  btnPrev.addEventListener('click', withLock(function () {
    if (btnPrev.disabled || !state.session) return;
    Speech.cancel();
    if (state.session.index > 0) {
      state.session.index -= 1;
      saveState();
      renderVerse();
    }
  }));

  $('btn-reading-home').addEventListener('click', withLock(function () {
    Speech.cancel();
    releaseWakeLock();
    // 읽던 중간이라도 '처음 화면으로'를 누르면 이번 회차는 마친 것으로 보고 세션을 비운다.
    // (이미 읽은 진행 상태(lastVerseId/completedIds)는 그대로 유지되어 '이어서 읽기'로 계속할 수 있다.)
    state.session = null;
    saveState();
    showScreen('home');
    renderHome();
  }));

  /* ---------------------------------------------------------
   * 8. 완료 화면
   * --------------------------------------------------------- */
  var lastSessionSummary = null;

  function finishSession() {
    var summary = {
      themeKey: state.session.themeKey,
      verseIds: state.session.verseIds.slice(),
      todayCount: state.session.verseIds.length
    };
    lastSessionSummary = summary;
    state.session = null;
    saveState();
    releaseWakeLock();
    renderComplete(summary);
    showScreen('complete');
  }

  function renderComplete(summary) {
    var key = summary.themeKey;
    var total = totalVerseCount(key);
    var totalDone = completedCount(key);
    var lastVerseId = themeState(key).lastVerseId;
    var nextStart = lastVerseId >= total ? 1 : lastVerseId + 1;

    $('complete-title').textContent = themeName(key) + ' 말씀 읽기를 마쳤습니다';
    $('stat-today').textContent = '오늘 읽은 구절: ' + summary.todayCount + '개';
    $('stat-total').textContent = themeName(key) + ' 완료 구절: ' + totalDone + '/' + total + '개';
    $('stat-next').textContent = '다음에 시작할 구절: ' + nextStart + '번';

    var allDone = totalDone >= total;
    var celebrateEl = $('complete-celebrate');
    celebrateEl.textContent = themeName(key) + '의 말씀 ' + total + '구절을 모두 읽었습니다';
    celebrateEl.hidden = !allDone;
    announce(allDone ? celebrateEl.textContent : '오늘의 말씀 읽기를 마쳤습니다');
  }

  $('btn-review-today').addEventListener('click', withLock(function () {
    if (!lastSessionSummary) return;
    state.session = {
      themeKey: lastSessionSummary.themeKey,
      verseIds: lastSessionSummary.verseIds.slice(),
      index: 0
    };
    saveState();
    showScreen('reading');
    renderVerse();
  }));

  $('btn-continue').addEventListener('click', withLock(function () {
    if (!lastSessionSummary) return;
    var key = lastSessionSummary.themeKey;
    var total = totalVerseCount(key);
    var lastVerseId = themeState(key).lastVerseId;
    startSession(key, lastVerseId >= total ? 1 : lastVerseId + 1);
  }));

  $('btn-complete-home').addEventListener('click', withLock(function () {
    showScreen('home');
    renderHome();
  }));

  /* ---------------------------------------------------------
   * 9. Wake Lock (선택적, 지원 시에만 사용)
   * --------------------------------------------------------- */
  var wakeLockSentinel = null;
  function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    navigator.wakeLock.request('screen').then(function (sentinel) {
      wakeLockSentinel = sentinel;
    }).catch(function () { /* 지원하지 않거나 거부된 경우 조용히 무시 */ });
  }
  function releaseWakeLock() {
    if (wakeLockSentinel) {
      wakeLockSentinel.release().catch(function () {});
      wakeLockSentinel = null;
    }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      if (Speech.getStatus() === 'playing') Speech.pause();
    } else if (document.visibilityState === 'visible') {
      if (!screens.reading.hidden) requestWakeLock();
    }
  });
  window.addEventListener('pagehide', function () { Speech.cancel(); });
  window.addEventListener('beforeunload', function () { Speech.cancel(); });

  /* ---------------------------------------------------------
   * 10. 초기화
   * --------------------------------------------------------- */
  function init() {
    var result = validateThemes(window.BIBLE_THEMES);
    if (!result.valid) {
      console.error('성경 데이터 검증 실패:');
      result.errors.forEach(function (err) { console.error(' - ' + err); });
      appRoot.hidden = false;
      showScreen('error');
      return;
    }
    THEMES = window.BIBLE_THEMES;
    THEMES.forEach(function (theme) { themeState(theme.key); });
    indexVerses();
    renderAddThemeOptions();
    appRoot.hidden = false;

    var session = state.session;
    var sessionUsable = session && themeByKey(session.themeKey) &&
      Array.isArray(session.verseIds) && session.verseIds.length > 0;

    if (sessionUsable) {
      showScreen('reading');
      renderVerse();
      requestWakeLock();
    } else {
      state.session = null;
      showScreen('home');
      renderHome();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if ('serviceWorker' in navigator) {
    // 새 버전의 서비스워커가 설치되어 제어권을 넘겨받으면, 화면을 한 번 새로고침해
    // 이미 열려 있던 탭도 최신 파일(app.js/styles.css/verses.js 등)을 바로 쓰게 한다.
    // (이 처리가 없으면 예전에 방문한 기기에서 배포 후에도 계속 옛 화면이 보일 수 있다.)
    // 단, 첫 방문(아직 서비스워커의 제어를 받지 않던 상태)에서 처음 제어권을 잡는 경우는
    // 새 버전으로의 교체가 아니므로 새로고침하지 않는다. (불필요한 새로고침 방지)
    var hadController = !!navigator.serviceWorker.controller;
    var swRefreshed = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!hadController || swRefreshed) return;
      swRefreshed = true;
      window.location.reload();
    });

    window.addEventListener('load', function () {
      // updateViaCache: 'none' — 브라우저가 service-worker.js 파일 자체를
      // HTTP 캐시에서 재사용하지 않고 매번 서버에 새로 확인하도록 강제한다.
      // 이 옵션이 없으면 서버에는 새 버전이 올라가도, 브라우저가 예전에 캐시해 둔
      // service-worker.js 응답을 계속 쓰면서 "바뀐 게 없다"고 오판할 수 있다.
      navigator.serviceWorker.register('service-worker.js', { updateViaCache: 'none' }).then(function (reg) {
        reg.update().catch(function () { /* 무시: 다음 방문 때 다시 시도됨 */ });
      }).catch(function (e) {
        console.error('서비스워커 등록에 실패했습니다.', e);
      });
    });
  }
})();
