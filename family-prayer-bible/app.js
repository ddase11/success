/* 우리 가족 기도말씀 30 - 앱 로직
   외부 프레임워크 없이 순수 자바스크립트로 작성 */
(function () {
  'use strict';

  var STORAGE_KEY = 'familyPrayerBible30.v1';
  var TOTAL_VERSES = 30;
  var DEFAULT_NAMES = ['아빠', '엄마', '딸'];

  /* ---------------------------------------------------------
   * 0. 데이터 검증
   * --------------------------------------------------------- */
  function validateVerses(verses) {
    var errors = [];

    if (!Array.isArray(verses)) {
      return { valid: false, errors: ['BIBLE_VERSES가 배열이 아닙니다.'] };
    }
    if (verses.length !== TOTAL_VERSES) {
      errors.push('구절 개수가 ' + TOTAL_VERSES + '개가 아닙니다. (현재 ' + verses.length + '개)');
    }

    var seenIds = {};
    var scriptTagPattern = /<\s*script/i;
    var htmlTagPattern = /<\/?[a-z][\s\S]*>/i;

    verses.forEach(function (v, idx) {
      var where = 'verses[' + idx + ']';
      if (!v || typeof v !== 'object') {
        errors.push(where + ': 객체가 아닙니다.');
        return;
      }
      if (typeof v.id !== 'number' || v.id < 1 || v.id > TOTAL_VERSES) {
        errors.push(where + ': id 값이 올바르지 않습니다. (' + v.id + ')');
      } else {
        if (seenIds[v.id]) {
          errors.push('id ' + v.id + '가 중복되었습니다.');
        }
        seenIds[v.id] = true;
      }

      ['referenceKo', 'referenceEn', 'korean', 'english'].forEach(function (field) {
        var val = v[field];
        if (typeof val !== 'string' || val.trim().length === 0) {
          errors.push('id ' + v.id + ': ' + field + ' 값이 비어 있습니다.');
          return;
        }
        if (scriptTagPattern.test(val) || htmlTagPattern.test(val)) {
          errors.push('id ' + v.id + ': ' + field + ' 값에 HTML/스크립트 태그로 의심되는 내용이 포함되어 있습니다.');
        }
      });
    });

    for (var i = 1; i <= TOTAL_VERSES; i++) {
      if (!seenIds[i]) {
        errors.push('id ' + i + '에 해당하는 구절이 없습니다.');
      }
    }

    // 가족 순서가 3명 단위로 정확히 반복되는지 확인 (아빠→엄마→딸 반복 규칙 자체 점검)
    for (var id = 1; id <= TOTAL_VERSES; id++) {
      var expectedIndex = (id - 1) % 3;
      var actualIndex = personIndexForVerseId(id);
      if (expectedIndex !== actualIndex) {
        errors.push('id ' + id + '의 가족 순서 계산이 3인 반복 규칙과 일치하지 않습니다.');
        break;
      }
    }

    return { valid: errors.length === 0, errors: errors };
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
      lastVerseId: 0,
      completedIds: [],
      dailyCount: 3,
      startMode: 'restart',
      speechRate: 1.0,
      fontSize: 'normal',
      lastUsedDate: null,
      session: null
    };
  }

  function loadState() {
    var base = defaultState();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.keys(base).forEach(function (key) {
          if (parsed[key] !== undefined) base[key] = parsed[key];
        });
      }
    } catch (e) {
      console.error('저장된 데이터를 불러오는 중 오류가 발생했습니다.', e);
    }
    if (!Array.isArray(base.names) || base.names.length !== 3) {
      base.names = DEFAULT_NAMES.slice();
    }
    if (!Array.isArray(base.completedIds)) base.completedIds = [];
    return base;
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
  var versesById = {};

  function indexVerses() {
    window.BIBLE_VERSES.forEach(function (v) { versesById[v.id] = v; });
  }

  function totalCompletedCount() {
    var unique = {};
    state.completedIds.forEach(function (id) { unique[id] = true; });
    return Object.keys(unique).length;
  }

  function markCompleted(verseId) {
    if (state.completedIds.indexOf(verseId) === -1) {
      state.completedIds.push(verseId);
    }
    if (verseId > state.lastVerseId) state.lastVerseId = verseId;
  }

  function buildSessionVerseIds(startId, count) {
    var ids = [];
    for (var i = startId; i < startId + count && i <= TOTAL_VERSES; i++) {
      ids.push(i);
    }
    return ids;
  }

  /* ---------------------------------------------------------
   * 6. 홈 화면
   * --------------------------------------------------------- */
  var dailyCountGroup = $('daily-count-group');
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

  function renderHome() {
    var hasProgress = state.lastVerseId > 0 && state.lastVerseId < TOTAL_VERSES;
    setRadioGroupValue(startPointGroup, hasProgress ? state.startMode || 'resume' : 'restart');
    if (!hasProgress) {
      // 저장된 기록이 없으면 '1번부터 시작'이 기본값
      state.startMode = 'restart';
      setRadioGroupValue(startPointGroup, 'restart');
    }
    resumeHint.textContent = hasProgress
      ? (state.lastVerseId + '번까지 읽으셨어요. 이어서 읽으면 ' + (state.lastVerseId + 1) + '번부터 시작합니다.')
      : '아직 저장된 기록이 없어 1번부터 시작합니다.';

    setRadioGroupValue(dailyCountGroup, state.dailyCount);
    applyFontSize(state.fontSize);

    nameInputs.forEach(function (input, i) {
      input.value = state.names[i] || DEFAULT_NAMES[i];
    });

    renderCopyrightFooter();
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

  dailyCountGroup.addEventListener('click', function (e) {
    var btn = e.target.closest('.option-btn');
    if (!btn) return;
    state.dailyCount = parseInt(btn.getAttribute('data-value'), 10);
    setRadioGroupValue(dailyCountGroup, state.dailyCount);
    saveState();
  });

  startPointGroup.addEventListener('click', function (e) {
    var btn = e.target.closest('.option-btn');
    if (!btn) return;
    state.startMode = btn.getAttribute('data-value');
    setRadioGroupValue(startPointGroup, state.startMode);
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
    var names = state.names;
    var dailyCount = state.dailyCount;
    var fontSize = state.fontSize;
    var speechRate = state.speechRate;
    state = defaultState();
    state.names = names;
    state.dailyCount = dailyCount;
    state.fontSize = fontSize;
    state.speechRate = speechRate;
    saveState();
    renderHome();
    announce('읽기 기록이 초기화되었습니다.');
  });

  $('btn-start').addEventListener('click', withLock(function () {
    var hasProgress = state.lastVerseId > 0 && state.lastVerseId < TOTAL_VERSES;
    var startId = 1;
    if (hasProgress && state.startMode === 'resume') {
      startId = state.lastVerseId + 1;
    }
    if (startId > TOTAL_VERSES) startId = 1;

    var ids = buildSessionVerseIds(startId, state.dailyCount);
    if (ids.length === 0) ids = buildSessionVerseIds(1, state.dailyCount);

    state.session = { verseIds: ids, index: 0 };
    saveState();
    enterReading();
  }));

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

  var reviewMode = false; // 완료 화면에서 '오늘 읽은 말씀 다시 보기'로 들어온 경우

  function enterReading() {
    reviewMode = false;
    showScreen('reading');
    renderVerse();
    requestWakeLock();
  }

  function currentSessionVerseId() {
    if (!state.session) return null;
    return state.session.verseIds[state.session.index];
  }

  function renderVerse() {
    if (!state.session) return;
    var verseId = currentSessionVerseId();
    var verse = versesById[verseId];
    if (!verse) return;

    var todayTotal = state.session.verseIds.length;
    var todayCurrent = state.session.index + 1;
    elProgressText.textContent = '오늘 ' + todayCurrent + '/' + todayTotal + ' · 전체 ' + verseId + '/' + TOTAL_VERSES;
    var pct = Math.round((todayCurrent / todayTotal) * 100);
    elProgressFill.style.width = pct + '%';
    elProgressTrack.setAttribute('aria-valuenow', String(pct));

    var personIdx = personIndexForVerseId(verseId);
    var personName = state.names[personIdx] || DEFAULT_NAMES[personIdx];
    elTurnBadge.textContent = personName + ' 차례';

    elReference.textContent = verse.referenceKo + ' · ' + verse.referenceEn;
    elKorean.textContent = cleanText(verse.korean);

    Speech.cancel();
    Speech.prepare(cleanText(verse.english), elEnglish, state.speechRate);

    resetSpeechButtons();

    var alreadyDone = state.completedIds.indexOf(verseId) !== -1;
    setNextEnabled(alreadyDone || reviewMode);

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

  function setNextEnabled(enabled) {
    btnNext.disabled = !enabled;
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
        announce('영어 음성 재생이 끝났습니다. 다음 말씀으로 이동할 수 있습니다.');
        setNextEnabled(true);
        var vId = currentSessionVerseId();
        if (vId) markCompleted(vId);
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
        setNextEnabled(true);
        break;
      case 'unsupported':
        setNextEnabled(true);
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
    if (btnNext.disabled || !state.session) return;
    Speech.cancel();
    var verseId = currentSessionVerseId();
    markCompleted(verseId);

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
    showScreen('home');
    renderHome();
  }));

  /* ---------------------------------------------------------
   * 8. 완료 화면
   * --------------------------------------------------------- */
  var lastSessionSummary = null;

  function finishSession() {
    var summary = {
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
    var totalDone = totalCompletedCount();
    var nextStart = state.lastVerseId >= TOTAL_VERSES ? 1 : state.lastVerseId + 1;

    $('stat-today').textContent = '오늘 읽은 구절: ' + summary.todayCount + '개';
    $('stat-total').textContent = '전체 완료 구절: ' + totalDone + '/' + TOTAL_VERSES + '개';
    $('stat-next').textContent = '다음에 시작할 구절: ' + nextStart + '번';

    var allDone = totalDone >= TOTAL_VERSES;
    $('complete-celebrate').hidden = !allDone;
    announce(allDone ? '기도의 말씀 30구절을 모두 읽었습니다' : '오늘의 말씀 읽기를 마쳤습니다');
  }

  $('btn-review-today').addEventListener('click', withLock(function () {
    if (!lastSessionSummary) return;
    state.session = { verseIds: lastSessionSummary.verseIds.slice(), index: 0 };
    reviewMode = true;
    saveState();
    showScreen('reading');
    renderVerse();
  }));

  $('btn-continue').addEventListener('click', withLock(function () {
    var nextStart = state.lastVerseId >= TOTAL_VERSES ? 1 : state.lastVerseId + 1;
    var ids = buildSessionVerseIds(nextStart, state.dailyCount);
    if (ids.length === 0) ids = buildSessionVerseIds(1, state.dailyCount);
    state.session = { verseIds: ids, index: 0 };
    reviewMode = false;
    saveState();
    enterReading();
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
    var verses = window.BIBLE_VERSES;
    var result = validateVerses(verses);
    if (!result.valid) {
      console.error('성경 데이터 검증 실패:');
      result.errors.forEach(function (err) { console.error(' - ' + err); });
      appRoot.hidden = false;
      showScreen('error');
      return;
    }
    indexVerses();
    appRoot.hidden = false;

    if (state.session && state.session.verseIds && state.session.verseIds.length > 0) {
      showScreen('reading');
      renderVerse();
      requestWakeLock();
    } else {
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
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function (e) {
        console.error('서비스워커 등록에 실패했습니다.', e);
      });
    });
  }
})();
