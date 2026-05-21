<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const labels = {
  title: '\uac8c\uc784 \uba54\uc774\ucee4 \ud83d\udc7e',
  assistantName: 'AI \uac8c\uc784 \uba54\uc774\ucee4',
  userName: '\ub098',
  firstGuide:
    '\ub9cc\ub4e4\uace0 \uc2f6\uc740 HTML5 \ubbf8\ub2c8 \uac8c\uc784\uc744 \uc124\uba85\ud574 \uc8fc\uc138\uc694. \uc608: \ubc29\ud5a5\ud0a4\ub85c \uc6c0\uc9c1\uc774\ub294 \uc6b0\uc8fc\uc120 \ud53c\ud558\uae30 \uac8c\uc784\uc744 \ub9cc\ub4e4\uc5b4\uc918.',
  tagline:
    '\uc544\uc774\ub514\uc5b4\ub97c \uc989\uc2dc \ud50c\ub808\uc774 \uac00\ub2a5\ud55c HTML5 \uac8c\uc784 \ud504\ub85c\ud1a0\ud0c0\uc785\uc73c\ub85c \ubc14\uafb8\uace0 \ub300\ud654\ub85c \uace0\ub3c4\ud654\ud569\ub2c8\ub2e4.',
  loading: '\uac8c\uc784 \ucf54\ub4dc\ub97c \uc0dd\uc131\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4...',
  repairing: '\uc2e4\ud589 \ubb38\uc81c\ub97c \uac10\uc9c0\ud574 \uc790\ub3d9 \uc218\ub9ac \uc911\uc785\ub2c8\ub2e4...',
  placeholder: '\ub9cc\ub4e4\uace0 \uc2f6\uc740 \uac8c\uc784\uc774\ub098 \uc218\uc815\ud560 \ub0b4\uc6a9\uc744 \uc785\ub825\ud558\uc138\uc694.',
  submit: '\uc804\uc1a1\ud558\uae30',
  generating: '\uc0dd\uc131 \uc911...',
  presets: '\ube60\ub978 \uc2dc\uc791',
  upgrades: '\ube60\ub978 \uac1c\uc120',
  mode: '\uc218\uc815 \ubaa8\ub4dc',
  assets: '\uc774\ubbf8\uc9c0 \uc5d0\uc14b',
  addImage: '\uc774\ubbf8\uc9c0 \ucd94\uac00',
  clearAssets: '\uc774\ubbf8\uc9c0 \uc804\uccb4 \uc0ad\uc81c',
  quality: '\ucf54\ub4dc \ud488\uc9c8 \uccb4\ud06c',
  saved: '\uc791\uc5c5 \uc800\uc7a5\ub428',
  clearProject: '\uc791\uc5c5 \ucd08\uae30\ud654',
  changeSummary: '\ucd5c\uadfc \ubcc0\uacbd',
  history: '\ubc84\uc804 \ud788\uc2a4\ud1a0\ub9ac',
  restore: '\ubcf5\uad6c',
  current: '\ud604\uc7ac',
  gameMode: '\ud83c\udfae \uac8c\uc784 \ud50c\ub808\uc774',
  codeMode: '\ud83d\udcbb \uc18c\uc2a4\ucf54\ub4dc \ubcf4\uae30',
  reset: '\ud83d\udd04 \uac8c\uc784 \ub9ac\uc14b',
  export: '\ud83d\udcbe \ud30c\uc77c \ub0b4\ubcf4\ub0b4\uae30',
  emptyTitle: '\uc544\uc9c1 \uc0dd\uc131\ub41c \uac8c\uc784\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.',
  emptyBody:
    '\uc67c\ucabd\uc5d0\uc11c \uc6d0\ud558\ub294 \ubbf8\ub2c8 \uac8c\uc784\uc744 \uc124\uba85\ud558\uba74 \uc774\uacf3\uc5d0 \uacb0\uacfc\uac00 \ud45c\uc2dc\ub429\ub2c8\ub2e4.',
  viewMode: '\ubcf4\uae30 \ubaa8\ub4dc',
}

const userInput = ref('')
const isLoading = ref(false)
const isRepairing = ref(false)
const generatedCode = ref('')
const chatHistory = ref([{ role: 'assistant', content: labels.firstGuide }])
const viewMode = ref('game')
const iframeKey = ref(0)
const versionHistory = ref([])
const activeVersionId = ref(null)
const latestChange = ref('\uc544\uc9c1 \ubcc0\uacbd \uae30\ub85d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.')
const renderIssue = ref('')
const gameTitle = ref('AI Mini Game')
const editMode = ref('feature')
const qualityWarnings = ref([])
const lastSavedAt = ref('')
const hasHydrated = ref(false)
const imageAssets = ref([])

const chatWindow = ref(null)
const gameIframe = ref(null)

const creationPresets = [
  '\ubc29\ud5a5\ud0a4\ub85c \uc6c0\uc9c1\uc774\uba70 \uc7a5\uc560\ubb3c\uc744 \ud53c\ud558\ub294 \ubbf8\ub2c8 \uac8c\uc784\uc744 \ub9cc\ub4e4\uc5b4\uc918.',
  '\ubc84\ud2bc\uc744 \ub204\ub974\uba74 \uc810\uc218\uac00 \uc624\ub974\ub294 \ud074\ub9ac\ucee4 \uac8c\uc784\uc744 \ub9cc\ub4e4\uc5b4\uc918.',
  '\uc6b0\uc8fc\uc120\uc73c\ub85c \uc801\uc744 \ud53c\ud558\uace0 \ud0c4\uc744 \uc3d8\ub294 \uc288\ud305 \uac8c\uc784\uc744 \ub9cc\ub4e4\uc5b4\uc918.',
  '\uae30\uc5b5\ub825\uc744 \uc2dc\ud5d8\ud558\ub294 \uce74\ub4dc \ub9e4\uce6d \ud37c\uc990 \uac8c\uc784\uc744 \ub9cc\ub4e4\uc5b4\uc918.',
]

const upgradePresets = [
  '\uc810\uc218 \uc2dc\uc2a4\ud15c\uacfc \ucd5c\uace0 \uc810\uc218\ub97c \ucd94\uac00\ud574\uc918.',
  '\uc2dc\uac04\uc774 \uc9c0\ub0a0\uc218\ub85d \ub09c\uc774\ub3c4\uac00 \uc790\uc5f0\uc2a4\ub7fd\uac8c \uc62c\ub77c\uac00\uac8c \ud574\uc918.',
  '\ubaa8\ubc14\uc77c\uc5d0\uc11c\ub3c4 \ud50c\ub808\uc774\ud560 \uc218 \uc788\ub294 \ud130\uce58 \uc870\uc791\uc744 \ucd94\uac00\ud574\uc918.',
  '\ud654\uba74 \ub514\uc790\uc778\uc744 \ub354 \uc138\ub828\ub418\uace0 \uc77d\uae30 \uc27d\uac8c \uac1c\uc120\ud574\uc918.',
]

const editModes = [
  { id: 'feature', label: '\uae30\ub2a5 \ucd94\uac00' },
  { id: 'bugfix', label: '\ubc84\uadf8 \uc218\uc815' },
  { id: 'balance', label: '\ubc38\ub7f0\uc2a4 \uc870\uc815' },
  { id: 'visual', label: '\ub514\uc790\uc778 \uac1c\uc120' },
  { id: 'mobile', label: '\ubaa8\ubc14\uc77c \ucd5c\uc801\ud654' },
]

const assetRoles = [
  { id: 'background', label: '\ubc30\uacbd' },
  { id: 'player', label: '\ud50c\ub808\uc774\uc5b4' },
  { id: 'enemy', label: '\uc801' },
  { id: 'item', label: '\uc544\uc774\ud15c' },
  { id: 'ui', label: 'UI' },
]

const storageKey = 'ai-mini-game-maker-state-v2'

const activeModeLabel = computed(() => {
  return editModes.find((mode) => mode.id === editMode.value)?.label || editModes[0].label
})

const getAssetRoleLabel = (role) => {
  return assetRoles.find((assetRole) => assetRole.id === role)?.label || role
}

const makeVersionTitle = (prompt) => {
  const normalized = prompt.replace(/\s+/g, ' ').trim()
  return normalized.length > 26 ? `${normalized.slice(0, 26)}...` : normalized
}

const makeSafeFilename = (name) => {
  return String(name || 'ai_mini_game')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣_-]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48) || 'ai_mini_game'
}

const runQualityCheck = (code) => {
  const checks = []
  const source = String(code || '')

  if (/location\.reload\s*\(/i.test(source)) {
    checks.push('location.reload() 사용 감지: 부모 리셋 방식과 충돌할 수 있습니다.')
  }
  if (/<script[^>]+src=/i.test(source)) {
    checks.push('외부 script src 감지: 오프라인 실행이나 보안 검토가 필요합니다.')
  }
  if (/<iframe/i.test(source)) {
    checks.push('게임 내부 iframe 감지: 중첩 실행으로 입력 포커스가 불안정할 수 있습니다.')
  }
  if ((source.match(/setInterval\s*\(/gi) || []).length > 3) {
    checks.push('setInterval이 여러 개 감지됨: 성능 저하 가능성이 있습니다.')
  }
  if (!/requestAnimationFrame|setInterval|setTimeout|addEventListener/i.test(source)) {
    checks.push('게임 루프나 이벤트 처리 코드가 약해 보입니다.')
  }
  if (!/<body[\s>]/i.test(source)) {
    checks.push('body 태그가 명확하지 않습니다.')
  }

  qualityWarnings.value = checks
}

const saveState = () => {
  if (!hasHydrated.value) return

  const state = {
    generatedCode: generatedCode.value,
    chatHistory: chatHistory.value,
    versionHistory: versionHistory.value,
    activeVersionId: activeVersionId.value,
    latestChange: latestChange.value,
    gameTitle: gameTitle.value,
    editMode: editMode.value,
    qualityWarnings: qualityWarnings.value,
    imageAssets: imageAssets.value,
  }

  localStorage.setItem(storageKey, JSON.stringify(state))
  lastSavedAt.value = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadState = async () => {
  const raw = localStorage.getItem(storageKey)
  if (!raw) {
    hasHydrated.value = true
    return
  }

  try {
    const state = JSON.parse(raw)
    generatedCode.value = state.generatedCode || ''
    chatHistory.value = Array.isArray(state.chatHistory) && state.chatHistory.length
      ? state.chatHistory
      : [{ role: 'assistant', content: labels.firstGuide }]
    versionHistory.value = Array.isArray(state.versionHistory) ? state.versionHistory : []
    activeVersionId.value = state.activeVersionId || null
    latestChange.value = state.latestChange || latestChange.value
    gameTitle.value = state.gameTitle || gameTitle.value
    editMode.value = state.editMode || editMode.value
    qualityWarnings.value = Array.isArray(state.qualityWarnings) ? state.qualityWarnings : []
    imageAssets.value = Array.isArray(state.imageAssets) ? state.imageAssets : []

    if (generatedCode.value) {
      runQualityCheck(generatedCode.value)
      await renderGameCode(generatedCode.value, { remount: true })
    }
  } catch {
    localStorage.removeItem(storageKey)
  } finally {
    hasHydrated.value = true
  }
}

const clearProject = () => {
  localStorage.removeItem(storageKey)
  userInput.value = ''
  generatedCode.value = ''
  chatHistory.value = [{ role: 'assistant', content: labels.firstGuide }]
  viewMode.value = 'game'
  versionHistory.value = []
  activeVersionId.value = null
  latestChange.value = '\uc544\uc9c1 \ubcc0\uacbd \uae30\ub85d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.'
  gameTitle.value = 'AI Mini Game'
  qualityWarnings.value = []
  imageAssets.value = []
  renderIssue.value = ''
  iframeKey.value += 1
  lastSavedAt.value = ''
}

const pushVersion = ({ code, prompt, type, metadata = {} }) => {
  const id = `${Date.now()}-${versionHistory.value.length}`
  const version = {
    id,
    code,
    prompt,
    type,
    title: metadata.title || makeVersionTitle(prompt),
    summary: metadata.summary || '',
    createdAt: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }

  versionHistory.value.unshift(version)
  versionHistory.value = versionHistory.value.slice(0, 8)
  activeVersionId.value = id
  gameTitle.value = version.title || gameTitle.value
  latestChange.value =
    metadata.summary ||
    (type === 'repair'
      ? '\uc2e4\ud589 \ubb38\uc81c\ub97c \uac10\uc9c0\ud574 AI\uac00 \uc790\ub3d9 \uc218\ub9ac\ud55c \ubc84\uc804\uc785\ub2c8\ub2e4.'
      : type === 'revision'
        ? `\uc218\uc815 \uc694\uccad \ubc18\uc601: ${makeVersionTitle(prompt)}`
        : `\uc0c8 \uac8c\uc784 \uc0dd\uc131: ${makeVersionTitle(prompt)}`)
  runQualityCheck(code)
}

const scrollToBottom = async () => {
  await nextTick()
  if (!chatWindow.value) return
  chatWindow.value.scrollTop = chatWindow.value.scrollHeight
}

watch(
  chatHistory,
  () => {
    scrollToBottom()
  },
  { deep: true },
)

const writeCodeToIframe = async (code = generatedCode.value) => {
  await nextTick()
  if (!gameIframe.value || !code) return

  const doc = gameIframe.value.contentDocument || gameIframe.value.contentWindow?.document
  if (!doc) return

  renderIssue.value = ''
  doc.open()
  doc.write(code)
  doc.close()

  const win = gameIframe.value.contentWindow
  if (win) {
    win.onerror = (message) => {
      renderIssue.value = String(message || '\uac8c\uc784 \uc2a4\ud06c\ub9bd\ud2b8 \uc624\ub958')
    }
    win.onunhandledrejection = (event) => {
      renderIssue.value = String(event?.reason?.message || event?.reason || '\ube44\ub3d9\uae30 \uc2e4\ud589 \uc624\ub958')
    }
  }

  setTimeout(() => {
    gameIframe.value?.contentWindow?.focus()
  }, 80)
}

const renderGameCode = async (code = generatedCode.value, options = {}) => {
  if (!code) return
  viewMode.value = 'game'
  if (options.remount) {
    iframeKey.value += 1
  }
  await writeCodeToIframe(code)
}

const inspectGameRender = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 900)
  })

  const doc = gameIframe.value?.contentDocument
  if (!doc) return { ok: false, reason: '\uac8c\uc784 iframe \ubb38\uc11c\uc5d0 \uc811\uadfc\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.' }
  if (renderIssue.value) return { ok: false, reason: renderIssue.value }

  const body = doc.body
  if (!body) return { ok: false, reason: 'HTML body\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.' }

  const hasVisualElement = Boolean(
    body.querySelector('canvas, button, svg, input, .game, #game, [role="button"]'),
  )
  const hasMeaningfulText = body.innerText.trim().length > 12
  const hasVisibleLayout = body.scrollWidth > 20 && body.scrollHeight > 20

  if (!hasVisibleLayout || (!hasVisualElement && !hasMeaningfulText)) {
    return {
      ok: false,
      reason: '\uc0dd\uc131\ub41c HTML\uc774 \ube48 \ud654\uba74\uc73c\ub85c \ub80c\ub354\ub9c1\ub418\uc5c8\uc2b5\ub2c8\ub2e4.',
    }
  }

  return { ok: true, reason: '' }
}

watch(viewMode, async (mode) => {
  if (mode === 'game' && generatedCode.value) {
    await writeCodeToIframe()
  }
})

const extractErrorMessage = async (response) => {
  try {
    const data = await response.json()
    return data?.error || response.statusText
  } catch {
    return response.statusText
  }
}

const requestGameCode = async ({ requestText, currentCode }) => {
  const response = await fetch('/api/generate-game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      request: requestText,
      currentCode,
      assets: imageAssets.value,
    }),
  })

  if (!response.ok) {
    const message = await extractErrorMessage(response)
    const apiError = new Error(message)
    apiError.status = response.status
    throw apiError
  }

  return response.json()
}

const composeRequest = (requestText, hadGeneratedCode) => {
  const assetPrompt = imageAssets.value.length
    ? `

[첨부 이미지 에셋]
${imageAssets.value
  .map((asset, index) => {
    return `- asset_${index + 1}: 역할=${getAssetRoleLabel(asset.role)}, 이름=${asset.name}, dataUrl=${asset.dataUrl}`
  })
  .join('\n')}

이미지 에셋 지침:
- 위 dataUrl을 HTML 내부 상수 또는 img src로 그대로 포함한다.
- 배경 이미지는 화면을 덮되 게임 UI를 가리지 않게 처리한다.
- 플레이어/적/아이템 이미지는 canvas drawImage 또는 img 요소로 실제 게임 오브젝트에 사용한다.
- 내보낸 단일 HTML 파일만으로 이미지가 보이도록 외부 URL에 의존하지 않는다.
`
    : ''

  if (!hadGeneratedCode) return `${requestText}${assetPrompt}`

  return `
[수정 모드: ${activeModeLabel.value}]
${requestText}
${assetPrompt}

모드 지침:
- 기능 추가: 기존 플레이 감각을 유지하면서 새 기능을 자연스럽게 통합한다.
- 버그 수정: 불필요한 디자인 변경보다 문제 해결과 안정성을 우선한다.
- 밸런스 조정: 난이도, 속도, 점수, 시간 흐름을 플레이 가능하게 다듬는다.
- 디자인 개선: 정보 구조, 가독성, 시각적 완성도를 높인다.
- 모바일 최적화: 터치 조작, 화면 크기, 버튼 배치를 개선한다.
`
}

const tryAutoRepair = async (reason, originalPrompt) => {
  if (!generatedCode.value || isRepairing.value) return false

  isRepairing.value = true
  chatHistory.value.push({
    role: 'assistant',
    content: `${labels.repairing}\n\uc6d0\uc778: ${reason}`,
  })

  try {
    const repairPrompt = `
The generated HTML game failed to run or rendered incorrectly.
Failure reason: ${reason}
Original user request: ${originalPrompt}

Fix the problem and return the entire runnable single HTML document again.
Keep the intended game design, but remove the runtime/rendering issue.
`
    const data = await requestGameCode({
      requestText: repairPrompt,
      currentCode: generatedCode.value,
    })

    generatedCode.value = data.html
    await renderGameCode(data.html, { remount: true })
    pushVersion({ code: data.html, prompt: originalPrompt, type: 'repair', metadata: data.metadata })
    chatHistory.value.push({
      role: 'assistant',
      content: '\uc2e4\ud589 \ubb38\uc81c\ub97c \uc790\ub3d9\uc73c\ub85c \uc218\ub9ac\ud558\uace0 \uac8c\uc784\uc744 \ub2e4\uc2dc \uc2e4\ud589\ud588\uc2b5\ub2c8\ub2e4.',
    })
    return true
  } catch (error) {
    chatHistory.value.push({
      role: 'assistant',
      content: `\uc790\ub3d9 \uc218\ub9ac\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4. \ub9ac\uc14b \ub610\ub294 \uc774\uc804 \ubc84\uc804 \ubcf5\uad6c\ub97c \uc2dc\ub3c4\ud574 \ubcf4\uc138\uc694.\n\n${error?.message || error}`,
    })
    return false
  } finally {
    isRepairing.value = false
  }
}

const sendMessage = async (presetText = '') => {
  const currentInput = userInput.value
  const requestText = (presetText || currentInput).trim()
  if (!requestText || isLoading.value) return

  const hadGeneratedCode = Boolean(generatedCode.value)
  const finalRequestText = composeRequest(requestText, hadGeneratedCode)

  if (!presetText) {
    userInput.value = ''
  }
  isLoading.value = true
  chatHistory.value.push({ role: 'user', content: requestText })

  try {
    const data = await requestGameCode({
      requestText: finalRequestText,
      currentCode: generatedCode.value,
    })
    generatedCode.value = data.html
    await renderGameCode(data.html, { remount: true })
    pushVersion({
      code: data.html,
      prompt: requestText,
      type: hadGeneratedCode ? 'revision' : 'creation',
      metadata: data.metadata,
    })
    chatHistory.value.push({
      role: 'assistant',
      content: hadGeneratedCode
        ? '\uc694\uccad\uc744 \ubc18\uc601\ud574 \uac8c\uc784 \ucf54\ub4dc\ub97c \ub2e4\uc2dc \uc0dd\uc131\ud588\uc2b5\ub2c8\ub2e4. \uc624\ub978\ucabd\uc5d0\uc11c \ubc14\ub85c \ud50c\ub808\uc774\ud560 \uc218 \uc788\uc5b4\uc694.'
        : '\uac8c\uc784\uc744 \uc0dd\uc131\ud588\uc2b5\ub2c8\ub2e4. \uc624\ub978\ucabd\uc5d0\uc11c \ubc14\ub85c \ud50c\ub808\uc774\ud560 \uc218 \uc788\uc5b4\uc694.',
    })

    const health = await inspectGameRender()
    if (!health.ok) {
      await tryAutoRepair(health.reason, requestText)
    }
  } catch (error) {
    if (!presetText) {
      userInput.value = currentInput
    }
    chatHistory.value.pop()

    const status = error?.status
    const errorText = String(error?.message || error || '')
    const isQuotaOrOverload = status === 429 || status === 503 || /\b(429|503)\b/.test(errorText)
    const message = isQuotaOrOverload
      ? '\ud604\uc7ac AI \uc11c\ubc84\uac00 \ubc14\uc058\uac70\ub098 \ud638\ucd9c \ud55c\ub3c4\uac00 \ucd08\uacfc\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \uc785\ub825 \ub0b4\uc6a9\uc740 \ubcf5\uad6c\ud574 \ub450\uc5c8\uc73c\ub2c8 \uc7a0\uc2dc \ud6c4 \ub2e4\uc2dc \uc804\uc1a1\ud574 \uc8fc\uc138\uc694.'
      : `\uac8c\uc784 \uc0dd\uc131 \uc911 \ubb38\uc81c\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4. \uc785\ub825 \ub0b4\uc6a9\uc740 \ubcf5\uad6c\ud574 \ub450\uc5c8\uc2b5\ub2c8\ub2e4.\n\n${errorText}`

    alert(message)
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const applyPreset = (text) => {
  if (isLoading.value) return
  sendMessage(text)
}

const addImageAssets = async (event) => {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  if (!files.length) return

  const nextAssets = []

  for (const file of files.slice(0, 5)) {
    if (!file.type.startsWith('image/')) continue
    if (file.size > 700 * 1024) {
      alert(`${file.name} 파일이 너무 큽니다. 700KB 이하 이미지를 사용해 주세요.`)
      continue
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    nextAssets.push({
      id: `${Date.now()}-${file.name}-${nextAssets.length}`,
      name: file.name,
      role: nextAssets.length === 0 && !imageAssets.value.length ? 'player' : 'item',
      dataUrl,
      size: file.size,
      type: file.type,
    })
  }

  imageAssets.value = [...imageAssets.value, ...nextAssets].slice(0, 8)
}

const updateAssetRole = (assetId, role) => {
  imageAssets.value = imageAssets.value.map((asset) => {
    return asset.id === assetId ? { ...asset, role } : asset
  })
}

const removeAsset = (assetId) => {
  imageAssets.value = imageAssets.value.filter((asset) => asset.id !== assetId)
}

const handleEnter = (event) => {
  if (event.isComposing || event.shiftKey) return
  event.preventDefault()
  sendMessage()
}

const resetGame = () => {
  if (!generatedCode.value) return
  renderGameCode(generatedCode.value, { remount: true })
}

const restoreVersion = (version) => {
  generatedCode.value = version.code
  activeVersionId.value = version.id
  gameTitle.value = version.title || gameTitle.value
  latestChange.value = `\uc774\uc804 \ubc84\uc804 \ubcf5\uad6c: ${version.title}`
  runQualityCheck(version.code)
  chatHistory.value.push({
    role: 'assistant',
    content: `\uc774\uc804 \ubc84\uc804\uc744 \ubcf5\uad6c\ud588\uc2b5\ub2c8\ub2e4: ${version.title}`,
  })
  renderGameCode(version.code, { remount: true })
}

const exportFile = () => {
  if (!generatedCode.value) return

  const blob = new Blob([generatedCode.value], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${makeSafeFilename(gameTitle.value)}.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

watch(
  [
    generatedCode,
    chatHistory,
    versionHistory,
    activeVersionId,
    latestChange,
    gameTitle,
    editMode,
    qualityWarnings,
    imageAssets,
  ],
  () => {
    saveState()
  },
  { deep: true },
)

onMounted(() => {
  loadState()
})
</script>

<template>
  <main class="app-shell">
    <section class="prompt-pane">
      <header class="pane-header">
        <div>
          <h1>{{ labels.title }}</h1>
          <p>{{ labels.tagline }}</p>
          <span v-if="lastSavedAt" class="save-state">{{ labels.saved }} {{ lastSavedAt }}</span>
        </div>
      </header>

      <div ref="chatWindow" class="chat-window" aria-live="polite">
        <article
          v-for="(message, index) in chatHistory"
          :key="`${message.role}-${index}`"
          class="chat-message"
          :class="message.role"
        >
          <div class="message-author">
            {{ message.role === 'user' ? labels.userName : labels.assistantName }}
          </div>
          <p>{{ message.content }}</p>
        </article>

        <article v-if="isLoading" class="chat-message assistant loading-message">
          <div class="message-author">{{ labels.assistantName }}</div>
          <p>{{ isRepairing ? labels.repairing : labels.loading }}</p>
        </article>
      </div>

      <section class="quick-panel">
        <div class="panel-block asset-panel">
          <div class="panel-title">{{ labels.assets }}</div>
          <div class="asset-actions">
            <label class="asset-upload">
              {{ labels.addImage }}
              <input type="file" accept="image/*" multiple @change="addImageAssets" />
            </label>
            <button
              type="button"
              :disabled="!imageAssets.length || isLoading"
              @click="imageAssets = []"
            >
              {{ labels.clearAssets }}
            </button>
          </div>

          <div v-if="imageAssets.length" class="asset-list">
            <article v-for="asset in imageAssets" :key="asset.id" class="asset-item">
              <img :src="asset.dataUrl" :alt="asset.name" />
              <div class="asset-info">
                <strong>{{ asset.name }}</strong>
                <select
                  :value="asset.role"
                  :disabled="isLoading"
                  @change="updateAssetRole(asset.id, $event.target.value)"
                >
                  <option v-for="role in assetRoles" :key="role.id" :value="role.id">
                    {{ role.label }}
                  </option>
                </select>
              </div>
              <button type="button" :disabled="isLoading" @click="removeAsset(asset.id)">×</button>
            </article>
          </div>
        </div>

        <div v-if="generatedCode" class="panel-block">
          <div class="panel-title">{{ labels.mode }}</div>
          <div class="mode-grid">
            <button
              v-for="mode in editModes"
              :key="mode.id"
              type="button"
              :class="{ active: editMode === mode.id }"
              :disabled="isLoading"
              @click="editMode = mode.id"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <div class="panel-block">
          <div class="panel-title">{{ generatedCode ? labels.upgrades : labels.presets }}</div>
          <div class="preset-grid">
            <button
              v-for="preset in generatedCode ? upgradePresets : creationPresets"
              :key="preset"
              type="button"
              :disabled="isLoading"
              @click="applyPreset(preset)"
            >
              {{ preset }}
            </button>
          </div>
        </div>

        <div class="panel-block change-note">
          <div class="panel-title">{{ labels.changeSummary }}</div>
          <p>{{ latestChange }}</p>
        </div>

        <div class="panel-block quality-note">
          <div class="panel-title">{{ labels.quality }}</div>
          <p v-if="!generatedCode">게임 생성 후 코드 품질 체크가 표시됩니다.</p>
          <p v-else-if="!qualityWarnings.length">감지된 위험 요소가 없습니다.</p>
          <ul v-else>
            <li v-for="warning in qualityWarnings" :key="warning">{{ warning }}</li>
          </ul>
        </div>
      </section>

      <form class="composer" @submit.prevent="sendMessage()">
        <textarea
          v-model="userInput"
          :disabled="isLoading"
          :placeholder="labels.placeholder"
          rows="4"
          @keydown.enter="handleEnter"
        />
        <button type="submit" :disabled="isLoading || !userInput.trim()">
          {{ isLoading ? labels.generating : labels.submit }}
        </button>
      </form>
    </section>

    <section class="viewer-pane">
      <div v-if="generatedCode" class="control-bar">
        <div class="project-title">
          <strong>{{ gameTitle }}</strong>
        </div>

        <div class="view-toggle" role="group" :aria-label="labels.viewMode">
          <button
            type="button"
            :class="{ active: viewMode === 'game' }"
            @click="viewMode = 'game'"
          >
            {{ labels.gameMode }}
          </button>
          <button
            type="button"
            :class="{ active: viewMode === 'code' }"
            @click="viewMode = 'code'"
          >
            {{ labels.codeMode }}
          </button>
        </div>

        <div class="utility-actions">
          <button type="button" @click="resetGame">{{ labels.reset }}</button>
          <button type="button" @click="exportFile">{{ labels.export }}</button>
          <button type="button" @click="clearProject">{{ labels.clearProject }}</button>
        </div>
      </div>

      <div class="viewer-content">
        <aside class="history-panel">
          <div class="history-head">
            <strong>{{ labels.history }}</strong>
            <span>{{ versionHistory.length }}</span>
          </div>

          <div v-if="!versionHistory.length" class="history-empty">
            {{ labels.emptyBody }}
          </div>

          <button
            v-for="version in versionHistory"
            :key="version.id"
            type="button"
            class="history-item"
            :class="{ active: activeVersionId === version.id }"
            @click="restoreVersion(version)"
          >
            <span class="history-meta">
              <b>{{ activeVersionId === version.id ? labels.current : labels.restore }}</b>
              <time>{{ version.createdAt }}</time>
            </span>
            <span class="history-title">{{ version.title }}</span>
          </button>
        </aside>

        <div class="stage-area">
          <div v-if="!generatedCode" class="empty-state">
            <strong>{{ labels.emptyTitle }}</strong>
            <span>{{ labels.emptyBody }}</span>
          </div>

          <iframe
            v-show="generatedCode && viewMode === 'game'"
            :key="iframeKey"
            ref="gameIframe"
            class="game-frame"
            title="AI generated mini game preview"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          />

          <textarea
            v-if="generatedCode && viewMode === 'code'"
            class="code-viewer"
            :value="generatedCode"
            readonly
            spellcheck="false"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  overflow: hidden;
  background: #1e1e1e;
  color: #f4f4f5;
  font-family:
    Inter, Pretendard, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button,
textarea {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 4fr 6fr;
  width: 100vw;
  height: 100vh;
  background: #1e1e1e;
}

.prompt-pane,
.viewer-pane {
  min-width: 0;
  min-height: 0;
}

.prompt-pane {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  border-right: 1px solid #343434;
  background: #202020;
}

.pane-header {
  display: flex;
  align-items: center;
  min-height: 76px;
  padding: 0 24px;
  border-bottom: 1px solid #343434;
}

.pane-header h1 {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: 0;
}

.pane-header p {
  max-width: 620px;
  margin: 7px 0 0;
  color: #b5b5b5;
  font-size: 13px;
  line-height: 1.45;
}

.save-state {
  display: inline-block;
  margin-top: 7px;
  color: #76d6b0;
  font-size: 12px;
  font-weight: 700;
}

.chat-window {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  padding: 22px;
  overflow-y: auto;
  scrollbar-color: #5a5a5a #252525;
}

.chat-message {
  width: min(88%, 620px);
  padding: 14px 16px;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #292929;
  color: #ededed;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.chat-message.user {
  align-self: flex-end;
  border-color: #4b6758;
  background: #253a30;
}

.chat-message.assistant {
  align-self: flex-start;
}

.message-author {
  margin-bottom: 6px;
  color: #a7f3d0;
  font-size: 12px;
  font-weight: 700;
}

.chat-message p {
  margin: 0;
  white-space: pre-wrap;
}

.loading-message p::after {
  content: "";
  display: inline-block;
  width: 1.2em;
  animation: dots 1.2s steps(4, end) infinite;
}

.quick-panel {
  display: grid;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid #343434;
  background: #202020;
}

.panel-block {
  min-width: 0;
}

.panel-title {
  margin-bottom: 8px;
  color: #a7f3d0;
  font-size: 12px;
  font-weight: 800;
}

.asset-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.asset-upload,
.asset-actions button {
  display: grid;
  place-items: center;
  min-height: 36px;
  border: 1px solid #414141;
  border-radius: 8px;
  background: #292929;
  color: #ededed;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}

.asset-upload input {
  display: none;
}

.asset-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.asset-list {
  display: grid;
  gap: 8px;
  margin-top: 8px;
}

.asset-item {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 30px;
  gap: 8px;
  align-items: center;
  padding: 8px;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #181818;
}

.asset-item img {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  background: #101010;
}

.asset-info {
  min-width: 0;
}

.asset-info strong {
  display: block;
  margin-bottom: 5px;
  color: #eeeeee;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.asset-info select {
  width: 100%;
  min-height: 30px;
  border: 1px solid #454545;
  border-radius: 6px;
  background: #242424;
  color: #f4f4f5;
  font-size: 12px;
}

.asset-item > button {
  width: 30px;
  height: 30px;
  border: 1px solid #4b4b4b;
  border-radius: 8px;
  background: #2d2d2d;
  color: #f4f4f5;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.mode-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.mode-grid button {
  min-height: 34px;
  padding: 0 10px;
  border: 1px solid #414141;
  border-radius: 8px;
  background: #262626;
  color: #dedede;
  cursor: pointer;
  font-size: 12px;
}

.mode-grid button.active {
  border-color: #34d399;
  background: #0f3d30;
  color: #d1fae5;
  font-weight: 800;
}

.preset-grid button,
.history-item {
  border: 1px solid #414141;
  border-radius: 8px;
  background: #292929;
  color: #ededed;
  cursor: pointer;
  text-align: left;
}

.preset-grid button {
  min-height: 44px;
  padding: 9px 10px;
  font-size: 12px;
  line-height: 1.35;
}

.preset-grid button:hover,
.history-item:hover {
  border-color: #34d399;
  background: #25342f;
}

.preset-grid button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.change-note {
  padding: 10px 12px;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #181818;
}

.change-note p,
.quality-note p {
  margin: 0;
  color: #d6d6d6;
  font-size: 13px;
  line-height: 1.45;
}

.quality-note {
  padding: 10px 12px;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #181818;
}

.quality-note ul {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 17px;
  color: #f4c7c7;
  font-size: 12px;
  line-height: 1.45;
}

.composer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 18px;
  border-top: 1px solid #343434;
  background: #1c1c1c;
}

.composer textarea {
  min-width: 0;
  min-height: 96px;
  max-height: 180px;
  resize: vertical;
  padding: 13px 14px;
  border: 1px solid #414141;
  border-radius: 8px;
  outline: none;
  background: #111111;
  color: #f4f4f5;
  line-height: 1.5;
}

.composer textarea:focus {
  border-color: #34d399;
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.16);
}

.composer textarea:disabled {
  opacity: 0.72;
}

.composer button,
.control-bar button {
  min-height: 42px;
  border: 1px solid #454545;
  border-radius: 8px;
  background: #2d2d2d;
  color: #f5f5f5;
  cursor: pointer;
  transition:
    background 0.16s ease,
    border-color 0.16s ease,
    transform 0.16s ease;
}

.composer button {
  align-self: end;
  min-width: 112px;
  padding: 0 18px;
  background: #10b981;
  border-color: #10b981;
  color: #071711;
  font-weight: 800;
}

.composer button:not(:disabled):hover,
.control-bar button:hover {
  transform: translateY(-1px);
}

.composer button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
  transform: none;
}

.viewer-pane {
  display: grid;
  grid-template-rows: auto 1fr;
  background: #181818;
}

.control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 64px;
  padding: 10px 16px;
  border-bottom: 1px solid #343434;
  background: #202020;
}

.project-title {
  min-width: 140px;
  max-width: 220px;
  color: #f4f4f5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.view-toggle,
.utility-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.control-bar button {
  padding: 0 13px;
  white-space: nowrap;
}

.control-bar button.active {
  border-color: #34d399;
  background: #0f3d30;
  color: #d1fae5;
}

.viewer-content {
  display: grid;
  grid-template-columns: minmax(190px, 240px) minmax(0, 1fr);
  gap: 12px;
  min-height: 0;
  padding: 16px;
}

.history-panel,
.stage-area {
  min-height: 0;
}

.history-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid #343434;
  border-radius: 8px;
  background: #202020;
}

.history-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #f4f4f5;
  font-size: 14px;
}

.history-head span {
  display: inline-grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #0f3d30;
  color: #d1fae5;
  font-size: 12px;
  font-weight: 800;
}

.history-empty {
  color: #a6a6a6;
  font-size: 12px;
  line-height: 1.45;
}

.history-item {
  display: grid;
  gap: 7px;
  width: 100%;
  padding: 10px;
}

.history-item.active {
  border-color: #34d399;
  background: #0f3d30;
}

.history-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #b8b8b8;
  font-size: 11px;
}

.history-meta b {
  color: #a7f3d0;
}

.history-title {
  color: #f2f2f2;
  font-size: 12px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.stage-area {
  position: relative;
}

.empty-state {
  display: grid;
  place-content: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  border: 1px dashed #454545;
  border-radius: 8px;
  color: #b7b7b7;
  text-align: center;
}

.empty-state strong {
  color: #f4f4f5;
  font-size: 22px;
  letter-spacing: 0;
}

.game-frame,
.code-viewer {
  width: 100%;
  height: 100%;
  border: 1px solid #3b3b3b;
  border-radius: 8px;
  background: #ffffff;
}

.game-frame {
  display: block;
}

.code-viewer {
  display: block;
  resize: none;
  padding: 18px;
  outline: none;
  background: #0f0f0f;
  color: #d4d4d4;
  font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
}

@keyframes dots {
  0% {
    content: "";
  }
  25% {
    content: ".";
  }
  50% {
    content: "..";
  }
  75%,
  100% {
    content: "...";
  }
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-rows: 48vh 52vh;
  }

  .prompt-pane {
    border-right: 0;
    border-bottom: 1px solid #343434;
  }

  .pane-header {
    min-height: 58px;
    padding: 0 16px;
  }

  .pane-header h1 {
    font-size: 20px;
  }

  .chat-window {
    padding: 14px;
  }

  .quick-panel {
    padding: 10px 12px;
  }

  .preset-grid {
    grid-template-columns: 1fr;
  }

  .mode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .composer {
    grid-template-columns: 1fr;
    padding: 12px;
  }

  .composer textarea {
    min-height: 76px;
  }

  .composer button {
    width: 100%;
  }

  .control-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .project-title {
    max-width: none;
  }

  .view-toggle,
  .utility-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .control-bar button {
    min-width: 0;
    white-space: normal;
  }

  .viewer-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    padding: 10px;
  }

  .history-panel {
    max-height: 130px;
  }
}
</style>
