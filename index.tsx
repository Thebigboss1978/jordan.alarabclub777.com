<!DOCTYPE html>
<!-- saved from url=(0056)file:///Users/macos/AlArab777/Voice_Interface/index.html -->
<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AlArab 777 — Voice</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: #0a0a0f;
            color: #e0e0e0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            user-select: none;
        }

        /* ─── Settings Panel (top-right gear) ─── */
        #settings-toggle {
            position: fixed; top: 16px; right: 16px;
            width: 40px; height: 40px;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            color: #888;
            font-size: 20px;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            z-index: 100;
            transition: all 0.2s;
        }
        #settings-toggle:hover { background: rgba(255,255,255,0.1); color: #fff; }

        #settings-panel {
            position: fixed; top: 0; right: -420px;
            width: 400px; height: 100vh;
            background: #111118;
            border-left: 1px solid rgba(255,255,255,0.08);
            z-index: 99;
            transition: right 0.3s ease;
            padding: 60px 24px 24px;
            overflow-y: auto;
        }
        #settings-panel.open { right: 0; }

        #settings-panel h2 {
            font-size: 16px; font-weight: 600;
            color: #ccc; margin-bottom: 20px;
            letter-spacing: 0.5px;
        }
        .setting-group { margin-bottom: 20px; }
        .setting-group label {
            display: block; font-size: 11px;
            color: #777; text-transform: uppercase;
            letter-spacing: 1px; margin-bottom: 6px;
        }
        .setting-group select,
        .setting-group input {
            width: 100%; padding: 10px 12px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            color: #ddd; font-size: 13px;
            outline: none;
        }
        .setting-group select:focus,
        .setting-group input:focus {
            border-color: rgba(255,255,255,0.25);
        }
        .setting-group input::placeholder { color: #555; }
        .setting-group .hint {
            font-size: 11px; color: #555; margin-top: 4px;
        }
        .key-status {
            display: inline-block; width: 8px; height: 8px;
            border-radius: 50%; margin-right: 6px;
            vertical-align: middle;
        }
        .key-status.ok { background: #2ecc71; }
        .key-status.missing { background: #e74c3c; }
        .key-status.unknown { background: #f39c12; }

        #save-settings {
            width: 100%; padding: 12px;
            background: #1a7f5a;
            border: none; border-radius: 8px;
            color: #fff; font-size: 14px; font-weight: 600;
            cursor: pointer; margin-top: 10px;
            transition: background 0.2s;
        }
        #save-settings:hover { background: #1f9b6e; }

        /* ─── Main Button ─── */
        #voice-btn {
            width: 140px; height: 140px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.08);
            background: radial-gradient(circle at 40% 40%, #1a1a2e, #0a0a14);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
            display: flex; align-items: center; justify-content: center;
        }
        #voice-btn:hover {
            border-color: rgba(255,255,255,0.15);
            transform: scale(1.03);
        }
        #voice-btn.active {
            border-color: rgba(46, 204, 113, 0.5);
            box-shadow: 0 0 40px rgba(46, 204, 113, 0.15);
            animation: pulse-active 2s ease-in-out infinite;
        }
        #voice-btn.active .btn-icon { color: #2ecc71; }

        #voice-btn.error {
            border-color: rgba(231, 76, 60, 0.5);
            box-shadow: 0 0 30px rgba(231, 76, 60, 0.1);
        }
        #voice-btn.error .btn-icon { color: #e74c3c; }

        .btn-icon {
            font-size: 36px;
            color: #555;
            transition: color 0.3s;
            pointer-events: none;
        }

        @keyframes pulse-active {
            0%, 100% { box-shadow: 0 0 40px rgba(46, 204, 113, 0.15); }
            50% { box-shadow: 0 0 60px rgba(46, 204, 113, 0.25); }
        }

        /* ─── Ripple ring when speaking ─── */
        .ripple-ring {
            position: absolute;
            width: 140px; height: 140px;
            border-radius: 50%;
            border: 1px solid rgba(46, 204, 113, 0.3);
            animation: ripple 2s ease-out infinite;
            pointer-events: none;
            opacity: 0;
        }
        #voice-btn.speaking .ripple-ring { opacity: 1; }
        .ripple-ring:nth-child(2) { animation-delay: 0.5s; }
        .ripple-ring:nth-child(3) { animation-delay: 1s; }

        @keyframes ripple {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(2.2); opacity: 0; }
        }

        /* ─── Status Area ─── */
        #status-area {
            margin-top: 32px;
            text-align: center;
            min-height: 60px;
        }
        #status-state {
            font-size: 14px;
            font-weight: 500;
            color: #888;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            transition: color 0.3s;
        }
        #status-state.state-idle { color: #555; }
        #status-state.state-connecting { color: #f39c12; }
        #status-state.state-listening { color: #2ecc71; }
        #status-state.state-thinking { color: #3498db; }
        #status-state.state-speaking { color: #9b59b6; }
        #status-state.state-error { color: #e74c3c; }

        #status-detail {
            font-size: 12px;
            color: #444;
            max-width: 400px;
            line-height: 1.4;
        }

        /* provider badge */
        #provider-badge {
            position: fixed; bottom: 20px; left: 50%;
            transform: translateX(-50%);
            font-size: 11px; color: #333;
            letter-spacing: 1px;
        }

        /* ─── Log panel (bottom) ─── */
        #log-panel {
            position: fixed; bottom: 0; left: 0; right: 0;
            height: 0; overflow: hidden;
            background: rgba(0,0,0,0.9);
            border-top: 1px solid rgba(255,255,255,0.05);
            transition: height 0.3s;
            z-index: 50;
        }
        #log-panel.open { height: 200px; }
        #log-toggle {
            position: fixed; bottom: 8px; right: 16px;
            font-size: 11px; color: #444;
            cursor: pointer; z-index: 51;
            letter-spacing: 0.5px;
        }
        #log-toggle:hover { color: #888; }
        #log-content {
            padding: 12px 16px;
            font-family: 'SF Mono', 'Menlo', monospace;
            font-size: 11px; color: #555;
            overflow-y: auto; height: 100%;
            white-space: pre-wrap;
        }
        #log-content .log-error { color: #e74c3c; }
        #log-content .log-warn { color: #f39c12; }
        #log-content .log-ok { color: #2ecc71; }

        /* overlay when settings open */
        #overlay {
            display: none;
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 98;
        }
        #overlay.show { display: block; }
    </style>
</head>
<body>

    <!-- Settings gear -->
    <button id="settings-toggle" title="Settings">⚙</button>
    <div id="overlay" onclick="toggleSettings()" class=""></div>

    <!-- Settings Panel -->
    <div id="settings-panel" class="">
        <h2>VOICE SETTINGS</h2>

        <div class="setting-group">
            <label>Active Provider</label>
            <select id="cfg-provider">
                <option value="openai">OpenAI Realtime (WebRTC)</option>
                <option value="gemini">Google Gemini Live</option>
                <option value="elevenlabs">ElevenLabs Conversational</option>
                <option value="hume">Hume EVI</option>
            </select>
        </div>

        <div class="setting-group">
            <label><span class="key-status ok" id="ks-openai"></span>OpenAI API Key</label>
            <input type="password" id="cfg-openai-key" placeholder="sk-proj-...">
            <div class="hint">Used for OpenAI Realtime API via WebRTC</div>
        </div>

        <div class="setting-group">
            <label><span class="key-status ok" id="ks-gemini"></span>Google Gemini API Key</label>
            <input type="password" id="cfg-gemini-key" placeholder="AIzaSy...">
            <div class="hint">Used for Gemini 2.0 Flash Multimodal Live</div>
        </div>

        <div class="setting-group">
            <label><span class="key-status ok" id="ks-elevenlabs"></span>ElevenLabs API Key</label>
            <input type="password" id="cfg-elevenlabs-key" placeholder="sk_...">
            <div class="hint">Used for ElevenLabs Conversational AI</div>
        </div>

        <div class="setting-group">
            <label>ElevenLabs Agent ID</label>
            <input type="text" id="cfg-elevenlabs-agent" placeholder="agent_...">
        </div>

        <div class="setting-group">
            <label><span class="key-status ok" id="ks-hume"></span>Hume API Key</label>
            <input type="password" id="cfg-hume-key" placeholder="...">
            <div class="hint">Used for Hume Empathic Voice Interface</div>
        </div>

        <div class="setting-group">
            <label>System Prompt</label>
            <input type="text" id="cfg-system-prompt" value="You are a helpful voice assistant for AlArab Club 777, a premium tourism company based at the Giza Pyramids, Egypt. Be concise, friendly, and professional.">
        </div>

        <button id="save-settings" onclick="saveSettings()">Save &amp; Close</button>
    </div>

    <!-- Main Voice Button -->
    <div id="voice-btn" ondblclick="toggleVoice()" class="">
        <div class="ripple-ring"></div>
        <div class="ripple-ring"></div>
        <div class="ripple-ring"></div>
        <span class="btn-icon">🎙</span>
    </div>

    <!-- Status -->
    <div id="status-area">
        <div id="status-state" class="state-idle">READY</div>
        <div id="status-detail">Session ended — double-click to start again</div>
    </div>

    <!-- Provider Badge -->
    <div id="provider-badge">OpenAI Realtime</div>

    <!-- Log Toggle -->
    <div id="log-toggle" onclick="toggleLog()">▲ LOG</div>
    <div id="log-panel">
        <div id="log-content"><span class="">[11:39:51 AM] Voice interface ready</span>
<span class="">[11:39:51 AM] Active provider: openai</span>
<span class="">[11:42:02 AM] Starting session with provider: openai</span>
<span class="log-error">[11:42:02 AM] Missing API key for openai</span>
<span class="log-ok">[11:44:42 AM] Settings saved</span>
<span class="">[11:44:44 AM] Starting session with provider: openai</span>
<span class="">[11:44:44 AM] OpenAI: Requesting ephemeral token...</span>
<span class="log-error">[11:45:14 AM] Connection error: Failed to fetch</span>
<span class="">[11:45:50 AM] Starting session with provider: openai</span>
<span class="">[11:45:50 AM] OpenAI: Requesting ephemeral token...</span>
<span class="log-error">[11:46:21 AM] Connection error: Failed to fetch</span>
<span class="">[12:04:40 PM] Starting session with provider: openai</span>
<span class="">[12:04:40 PM] OpenAI: Requesting ephemeral token...</span>
<span class="">[12:04:42 PM] OpenAI: Ephemeral token received</span>
<span class="">[12:04:45 PM] OpenAI: Microphone access granted</span>
<span class="">[12:04:46 PM] OpenAI: Audio track received</span>
<span class="log-ok">[12:04:46 PM] OpenAI: WebRTC connection established</span>
<span class="">[12:04:48 PM] OpenAI: Data channel open</span>
<span class="">[12:04:48 PM] OpenAI: Session created</span>
<span class="">[12:04:51 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:04:51 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:04:51 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:05:02 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:05:05 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:05:05 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:05:05 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:05:08 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:05:11 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:05:11 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:05:11 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:05:21 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:05:27 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:05:27 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:05:27 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:05:32 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:05:37 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:05:38 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:05:38 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:05:48 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:05:50 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:05:51 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:05:51 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:05:58 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:06:52 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:06:53 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:06:53 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:07:01 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:07:10 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:07:11 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:07:11 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:07:20 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:07:25 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:07:25 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:07:25 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:07:38 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:07:59 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:07:59 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:03 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:03 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:05 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:08:05 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:05 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:15 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:08:15 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:08:15 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:08:15 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:08:15 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:08:17 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:17 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:18 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:18 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:24 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:08:24 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:24 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:24 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:08:24 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:08:31 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:31 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:35 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:08:36 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:36 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:39 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:08:39 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:08:41 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:08:42 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:08:42 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:08:42 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:42 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:42 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:42 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:43 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:08:43 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:08:43 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:08:47 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:09:36 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:09:36 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:09:36 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:09:45 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:09:50 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:09:50 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:09:50 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:09:50 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:09:50 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:09:54 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:09:55 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:09:55 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:09:58 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:09:58 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:09:59 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:09:59 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:10:02 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:10:02 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:10:02 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:10:10 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:10:10 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:10:21 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:10:22 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:10:22 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:10:31 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:10:37 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:10:38 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:10:38 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:10:45 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:10:50 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:10:50 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:10:51 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:11:04 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:11:04 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:11:06 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:11:06 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:11:06 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:11:12 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:11:12 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:11:14 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:11:14 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:11:15 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:11:15 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:11:15 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:11:24 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:11:30 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:11:31 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:11:31 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:11:31 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:11:31 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:11:35 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:11:35 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:11:39 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:11:39 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:11:39 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:11:46 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:11:55 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:11:56 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:11:56 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:11:56 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:11:56 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:00 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:00 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:03 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:03 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:06 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:06 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:08 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:08 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:09 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:09 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:15 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:15 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:17 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:17 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:24 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:24 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:24 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:12:41 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[12:12:45 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:45 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:45 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:12:48 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:12:48 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:12:51 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:51 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:12:52 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:12:52 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:13:01 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:13:01 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:13:05 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:13:05 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:13:06 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:13:07 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[12:13:07 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[12:13:09 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:13:09 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:13:14 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:13:14 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:13:18 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:13:18 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:13:18 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:13:18 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:13:21 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:13:21 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:13:28 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:13:28 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:13:29 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[12:13:35 PM] Stopping session...</span>
<span class="log-ok">[12:13:35 PM] Session stopped</span>
<span class="">[12:13:36 PM] OpenAI: Data channel closed</span>
<span class="">[12:14:13 PM] Starting session with provider: openai</span>
<span class="">[12:14:13 PM] OpenAI: Requesting ephemeral token...</span>
<span class="">[12:14:15 PM] OpenAI: Ephemeral token received</span>
<span class="">[12:14:18 PM] OpenAI: Microphone access granted</span>
<span class="">[12:14:19 PM] OpenAI: Audio track received</span>
<span class="log-ok">[12:14:19 PM] OpenAI: WebRTC connection established</span>
<span class="">[12:14:20 PM] OpenAI: Data channel open</span>
<span class="">[12:14:21 PM] OpenAI: Session created</span>
<span class="">[12:14:21 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[12:14:21 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[12:14:21 PM] OpenAI event: output_audio_buffer.started</span>
<span class="log-ok">[12:14:22 PM] Settings saved</span>
<span class="">[12:14:24 PM] Stopping session...</span>
<span class="log-ok">[12:14:24 PM] Session stopped</span>
<span class="">[12:14:24 PM] OpenAI: Data channel closed</span>
<span class="">[12:14:28 PM] Starting session with provider: gemini</span>
<span class="">[12:14:28 PM] Gemini: Connecting via WebSocket...</span>
<span class="log-error">[12:14:28 PM] Gemini: WebSocket error</span>
<span class="">[12:14:28 PM] Gemini: WebSocket closed (code: 1006, reason: none)</span>
<span class="">[12:14:29 PM] Starting session with provider: gemini</span>
<span class="">[12:14:29 PM] Gemini: Connecting via WebSocket...</span>
<span class="log-error">[12:14:29 PM] Gemini: WebSocket error</span>
<span class="">[12:14:29 PM] Gemini: WebSocket closed (code: 1006, reason: none)</span>
<span class="log-ok">[12:14:33 PM] Settings saved</span>
<span class="">[12:14:34 PM] Starting session with provider: gemini</span>
<span class="">[12:14:34 PM] Gemini: Connecting via WebSocket...</span>
<span class="log-error">[12:14:34 PM] Gemini: WebSocket error</span>
<span class="">[12:14:35 PM] Gemini: WebSocket closed (code: 1006, reason: none)</span>
<span class="">[12:14:36 PM] Starting session with provider: gemini</span>
<span class="">[12:14:36 PM] Gemini: Connecting via WebSocket...</span>
<span class="log-error">[12:14:36 PM] Gemini: WebSocket error</span>
<span class="">[12:14:36 PM] Gemini: WebSocket closed (code: 1006, reason: none)</span>
<span class="log-ok">[12:14:45 PM] Settings saved</span>
<span class="">[12:14:48 PM] Starting session with provider: elevenlabs</span>
<span class="">[12:14:48 PM] ElevenLabs: Starting conversational session...</span>
<span class="log-error">[12:14:49 PM] Connection error: ElevenLabs signed URL failed (401): {"detail":{"status":"missing_permissions","message":"The API key you used is missing the permission convai_write to execute this operation."}}</span>
<span class="log-ok">[12:15:10 PM] Settings saved</span>
<span class="">[12:15:12 PM] Starting session with provider: hume</span>
<span class="">[12:15:12 PM] Hume: Starting EVI session...</span>
<span class="log-error">[12:15:13 PM] Hume: WebSocket error</span>
<span class="">[12:15:13 PM] Hume: Disconnected (1006)</span>
<span class="">[12:15:17 PM] Starting session with provider: hume</span>
<span class="">[12:15:17 PM] Hume: Starting EVI session...</span>
<span class="log-error">[12:15:17 PM] Hume: WebSocket error</span>
<span class="">[12:15:17 PM] Hume: Disconnected (1006)</span>
<span class="">[1:15:22 PM] Starting session with provider: hume</span>
<span class="">[1:15:22 PM] Hume: Starting EVI session...</span>
<span class="log-error">[1:15:22 PM] Hume: WebSocket error</span>
<span class="">[1:15:22 PM] Hume: Disconnected (1006)</span>
<span class="log-ok">[1:15:26 PM] Settings saved</span>
<span class="">[1:15:28 PM] Starting session with provider: hume</span>
<span class="">[1:15:28 PM] Hume: Starting EVI session...</span>
<span class="log-error">[1:15:28 PM] Hume: WebSocket error</span>
<span class="">[1:15:28 PM] Hume: Disconnected (1006)</span>
<span class="log-ok">[1:15:35 PM] Settings saved</span>
<span class="">[1:15:37 PM] Starting session with provider: openai</span>
<span class="">[1:15:37 PM] OpenAI: Requesting ephemeral token...</span>
<span class="">[1:15:39 PM] OpenAI: Ephemeral token received</span>
<span class="">[1:15:40 PM] OpenAI: Microphone access granted</span>
<span class="">[1:15:42 PM] OpenAI: Audio track received</span>
<span class="log-ok">[1:15:42 PM] OpenAI: WebRTC connection established</span>
<span class="">[1:15:43 PM] OpenAI: Data channel open</span>
<span class="">[1:15:43 PM] OpenAI: Session created</span>
<span class="">[1:15:56 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:15:56 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:15:56 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:16:02 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:16:06 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:16:07 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:16:07 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:16:19 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[1:16:19 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[1:16:22 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:16:22 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:16:23 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:16:23 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:16:23 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:16:33 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:16:35 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:16:35 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:16:35 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:16:42 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:16:47 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:16:47 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:16:48 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:16:49 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:16:49 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:16:55 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[1:16:55 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[1:16:58 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:16:58 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:17:01 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:17:01 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:17:01 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:17:09 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:17:13 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:17:13 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:17:16 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:17:17 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:17:17 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:17:33 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:17:45 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:17:45 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:17:46 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:17:46 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:17:46 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:17:57 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:18:07 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:18:09 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:18:09 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:18:11 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[1:18:11 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[1:18:12 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:18:12 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:18:12 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:18:18 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[1:18:18 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[1:18:19 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:18:19 PM] OpenAI event: output_audio_buffer.cleared</span>
<span class="">[1:18:19 PM] OpenAI event: conversation.item.truncated</span>
<span class="">[1:18:19 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:18:19 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:18:24 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:18:25 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:18:25 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:18:39 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:18:48 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:18:48 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:18:48 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:19:05 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:19:13 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:19:13 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:19:13 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:19:30 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:19:35 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:19:35 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:19:36 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:19:36 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:19:36 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:19:50 PM] OpenAI event: output_audio_buffer.stopped</span>
<span class="">[1:19:55 PM] OpenAI event: output_audio_buffer.started</span>
<span class="">[1:19:56 PM] OpenAI event: conversation.item.input_audio_transcription.delta</span>
<span class="">[1:19:56 PM] OpenAI event: conversation.item.input_audio_transcription.completed</span>
<span class="">[1:20:00 PM] Stopping session...</span>
<span class="log-ok">[1:20:00 PM] Session stopped</span>
<span class="">[1:20:00 PM] OpenAI: Data channel closed</span>
</div>
    </div>

<script>
// ═══════════════════════════════════════════════════════════
// AlArab 777 Voice Interface — Multi-Provider Engine
// ═══════════════════════════════════════════════════════════

const STATE = {
    IDLE: 'IDLE',
    CONNECTING: 'CONNECTING',
    LISTENING: 'LISTENING',
    THINKING: 'THINKING',
    SPEAKING: 'SPEAKING',
    ERROR: 'ERROR'
};

let currentState = STATE.IDLE;
let isSessionActive = false;
let peerConnection = null;
let audioElement = null;
let dataChannel = null;
let mediaStream = null;
let geminiWs = null;
let audioContext = null;
let audioWorklet = null;
let elevenLabsWs = null;
let humeWs = null;

// ─── Config ───
const DEFAULT_CONFIG = {
    provider: 'openai',
    openaiKey: '',
    geminiKey: '',
    elevenlabsKey: '',
    elevenlabsAgent: '',
    humeKey: '',
    systemPrompt: 'You are a helpful voice assistant for AlArab Club 777, a premium tourism company based at the Giza Pyramids, Egypt. Be concise, friendly, and professional.'
};

let config = loadConfig();

// ─── DOM ───
const btnEl = document.getElementById('voice-btn');
const stateEl = document.getElementById('status-state');
const detailEl = document.getElementById('status-detail');
const badgeEl = document.getElementById('provider-badge');
const logEl = document.getElementById('log-content');

// ═══════════════════════════════════════════
// Config Load / Save
// ═══════════════════════════════════════════
function loadConfig() {
    try {
        const saved = localStorage.getItem('alarab777_voice_config');
        if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch(e) {}
    return { ...DEFAULT_CONFIG };
}

function saveSettings() {
    config.provider = document.getElementById('cfg-provider').value;
    config.openaiKey = document.getElementById('cfg-openai-key').value.trim();
    config.geminiKey = document.getElementById('cfg-gemini-key').value.trim();
    config.elevenlabsKey = document.getElementById('cfg-elevenlabs-key').value.trim();
    config.elevenlabsAgent = document.getElementById('cfg-elevenlabs-agent').value.trim();
    config.humeKey = document.getElementById('cfg-hume-key').value.trim();
    config.systemPrompt = document.getElementById('cfg-system-prompt').value.trim();
    localStorage.setItem('alarab777_voice_config', JSON.stringify(config));
    updateKeyIndicators();
    toggleSettings();
    updateBadge();
    log('Settings saved', 'ok');
    setState(STATE.IDLE, 'Settings saved — double-click to start');
}

function populateSettingsUI() {
    document.getElementById('cfg-provider').value = config.provider;
    document.getElementById('cfg-openai-key').value = config.openaiKey;
    document.getElementById('cfg-gemini-key').value = config.geminiKey;
    document.getElementById('cfg-elevenlabs-key').value = config.elevenlabsKey;
    document.getElementById('cfg-elevenlabs-agent').value = config.elevenlabsAgent;
    document.getElementById('cfg-hume-key').value = config.humeKey;
    document.getElementById('cfg-system-prompt').value = config.systemPrompt;
    updateKeyIndicators();
}

function updateKeyIndicators() {
    setKeyStatus('ks-openai', config.openaiKey);
    setKeyStatus('ks-gemini', config.geminiKey);
    setKeyStatus('ks-elevenlabs', config.elevenlabsKey);
    setKeyStatus('ks-hume', config.humeKey);
}

function setKeyStatus(id, key) {
    const el = document.getElementById(id);
    el.className = 'key-status ' + (key ? 'ok' : 'missing');
}

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');
    panel.classList.toggle('open');
    overlay.classList.toggle('show');
    if (panel.classList.contains('open')) populateSettingsUI();
}

document.getElementById('settings-toggle').onclick = toggleSettings;

// ═══════════════════════════════════════════
// State Machine
// ═══════════════════════════════════════════
function setState(state, detail) {
    currentState = state;
    const labels = {
        [STATE.IDLE]: 'READY',
        [STATE.CONNECTING]: 'CONNECTING...',
        [STATE.LISTENING]: '● LISTENING',
        [STATE.THINKING]: '⟳ THINKING...',
        [STATE.SPEAKING]: '◉ SPEAKING',
        [STATE.ERROR]: '✕ ERROR'
    };
    stateEl.textContent = labels[state] || state;
    stateEl.className = 'state-' + state.toLowerCase();
    if (detail) detailEl.textContent = detail;

    // Button classes
    btnEl.className = '';
    if (state === STATE.LISTENING || state === STATE.THINKING) btnEl.classList.add('active');
    if (state === STATE.SPEAKING) { btnEl.classList.add('active', 'speaking'); }
    if (state === STATE.ERROR) btnEl.classList.add('error');
}

function updateBadge() {
    const names = { openai: 'OpenAI Realtime', gemini: 'Google Gemini', elevenlabs: 'ElevenLabs', hume: 'Hume EVI' };
    badgeEl.textContent = names[config.provider] || '';
}

// ═══════════════════════════════════════════
// Logging
// ═══════════════════════════════════════════
function log(msg, level = 'info') {
    const ts = new Date().toLocaleTimeString();
    const cls = level === 'error' ? 'log-error' : level === 'warn' ? 'log-warn' : level === 'ok' ? 'log-ok' : '';
    logEl.innerHTML += `<span class="${cls}">[${ts}] ${msg}</span>\n`;
    logEl.scrollTop = logEl.scrollHeight;
    console.log(`[Voice ${level}] ${msg}`);
}

function toggleLog() {
    document.getElementById('log-panel').classList.toggle('open');
}

// ═══════════════════════════════════════════
// Main Toggle (Double-Click)
// ═══════════════════════════════════════════
async function toggleVoice() {
    if (isSessionActive) {
        stopSession();
    } else {
        await startSession();
    }
}

async function startSession() {
    const provider = config.provider;
    log(`Starting session with provider: ${provider}`);

    // Validate key
    const keyMap = { openai: 'openaiKey', gemini: 'geminiKey', elevenlabs: 'elevenlabsKey', hume: 'humeKey' };
    const key = config[keyMap[provider]];
    if (!key) {
        setState(STATE.ERROR, `No API key set for ${provider}. Open Settings (⚙) to add your key.`);
        log(`Missing API key for ${provider}`, 'error');
        return;
    }

    setState(STATE.CONNECTING, `Connecting to ${provider}...`);

    try {
        switch (provider) {
            case 'openai': await startOpenAI(); break;
            case 'gemini': await startGemini(); break;
            case 'elevenlabs': await startElevenLabs(); break;
            case 'hume': await startHume(); break;
        }
    } catch (err) {
        setState(STATE.ERROR, `Failed to connect: ${err.message}`);
        log(`Connection error: ${err.message}`, 'error');
        isSessionActive = false;
    }
}

function stopSession() {
    log('Stopping session...');
    isSessionActive = false;

    // Clean up all possible connections
    if (peerConnection) { peerConnection.close(); peerConnection = null; }
    if (dataChannel) { dataChannel = null; }
    if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
    if (audioElement) { audioElement.pause(); audioElement.srcObject = null; audioElement = null; }
    if (geminiWs) { geminiWs.close(); geminiWs = null; }
    if (elevenLabsWs) { elevenLabsWs.close(); elevenLabsWs = null; }
    if (humeWs) { humeWs.close(); humeWs = null; }
    if (audioContext) { audioContext.close().catch(()=>{}); audioContext = null; }

    setState(STATE.IDLE, 'Session ended — double-click to start again');
    log('Session stopped', 'ok');
}

// ═══════════════════════════════════════════
// 1. OpenAI Realtime (WebRTC)
// ═══════════════════════════════════════════
async function startOpenAI() {
    log('OpenAI: Requesting ephemeral token...');

    // 1. Get ephemeral token
    const tokenResp = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.openaiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o-realtime-preview-2024-12-17',
            voice: 'verse',
            instructions: config.systemPrompt,
            input_audio_transcription: { model: 'whisper-1' }
        })
    });

    if (!tokenResp.ok) {
        const errBody = await tokenResp.text();
        throw new Error(`OpenAI token request failed (${tokenResp.status}): ${errBody}`);
    }

    const tokenData = await tokenResp.json();
    const ephemeralKey = tokenData.client_secret?.value;
    if (!ephemeralKey) throw new Error('No ephemeral key in response');
    log('OpenAI: Ephemeral token received');

    // 2. Create PeerConnection
    peerConnection = new RTCPeerConnection();

    // Audio output
    audioElement = document.createElement('audio');
    audioElement.autoplay = true;
    peerConnection.ontrack = (e) => {
        audioElement.srcObject = e.streams[0];
        log('OpenAI: Audio track received');
    };

    // Data channel for events
    dataChannel = peerConnection.createDataChannel('oai-events');
    dataChannel.onopen = () => {
        log('OpenAI: Data channel open');
        isSessionActive = true;
        setState(STATE.LISTENING, 'Connected — speak now');
    };
    dataChannel.onmessage = (e) => {
        try {
            const evt = JSON.parse(e.data);
            handleOpenAIEvent(evt);
        } catch(err) {}
    };
    dataChannel.onclose = () => {
        log('OpenAI: Data channel closed');
        if (isSessionActive) stopSession();
    };

    // 3. Microphone
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStream.getTracks().forEach(t => peerConnection.addTrack(t, mediaStream));
    log('OpenAI: Microphone access granted');

    // 4. Create offer and set local description
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // 5. Send to OpenAI
    const sdpResp = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ephemeralKey}`,
            'Content-Type': 'application/sdp'
        },
        body: offer.sdp
    });

    if (!sdpResp.ok) throw new Error(`OpenAI SDP exchange failed (${sdpResp.status})`);

    const answerSdp = await sdpResp.text();
    await peerConnection.setRemoteDescription({ type: 'answer', sdp: answerSdp });
    log('OpenAI: WebRTC connection established', 'ok');
}

function handleOpenAIEvent(evt) {
    switch (evt.type) {
        case 'session.created':
            log('OpenAI: Session created');
            break;
        case 'input_audio_buffer.speech_started':
            setState(STATE.LISTENING, 'Hearing you...');
            break;
        case 'input_audio_buffer.speech_stopped':
            setState(STATE.THINKING, 'Processing your speech...');
            break;
        case 'response.audio.delta':
            if (currentState !== STATE.SPEAKING) {
                setState(STATE.SPEAKING, 'Responding...');
            }
            break;
        case 'response.audio.done':
            setState(STATE.LISTENING, 'Listening...');
            break;
        case 'response.done':
            setState(STATE.LISTENING, 'Listening...');
            break;
        case 'error':
            const errMsg = evt.error?.message || 'Unknown error';
            setState(STATE.ERROR, `OpenAI error: ${errMsg}`);
            log(`OpenAI error: ${errMsg}`, 'error');
            break;
        case 'input_audio_buffer.committed':
        case 'conversation.item.created':
        case 'response.created':
        case 'response.output_item.added':
        case 'response.content_part.added':
        case 'response.audio_transcript.delta':
        case 'response.audio_transcript.done':
        case 'response.output_item.done':
        case 'response.content_part.done':
        case 'rate_limits.updated':
            // Silent events
            break;
        default:
            log(`OpenAI event: ${evt.type}`);
    }
}

// ═══════════════════════════════════════════
// 2. Google Gemini Live (WebSocket)
// ═══════════════════════════════════════════
async function startGemini() {
    log('Gemini: Connecting via WebSocket...');

    const model = 'gemini-2.0-flash-exp';
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${config.geminiKey}`;

    geminiWs = new WebSocket(wsUrl);

    geminiWs.onopen = () => {
        log('Gemini: WebSocket connected');
        // Send setup message
        const setup = {
            setup: {
                model: `models/${model}`,
                generation_config: {
                    response_modalities: ["AUDIO"],
                    speech_config: {
                        voice_config: {
                            prebuilt_voice_config: { voice_name: "Aoede" }
                        }
                    }
                },
                system_instruction: {
                    parts: [{ text: config.systemPrompt }]
                }
            }
        };
        geminiWs.send(JSON.stringify(setup));
    };

    geminiWs.onmessage = async (event) => {
        try {
            const data = JSON.parse(typeof event.data === 'string' ? event.data : await event.data.text());

            if (data.setupComplete) {
                log('Gemini: Setup complete, starting microphone', 'ok');
                isSessionActive = true;
                setState(STATE.LISTENING, 'Connected — speak now');
                startGeminiAudioStream();
                return;
            }

            if (data.serverContent) {
                const parts = data.serverContent.modelTurn?.parts || [];
                for (const part of parts) {
                    if (part.inlineData?.data) {
                        setState(STATE.SPEAKING, 'Responding...');
                        playBase64Audio(part.inlineData.data, part.inlineData.mimeType || 'audio/pcm;rate=24000');
                    }
                }
                if (data.serverContent.turnComplete) {
                    setState(STATE.LISTENING, 'Listening...');
                }
            }
        } catch(e) {
            log(`Gemini parse error: ${e.message}`, 'warn');
        }
    };

    geminiWs.onerror = (err) => {
        setState(STATE.ERROR, 'Gemini WebSocket error — check your API key or quota');
        log('Gemini: WebSocket error', 'error');
    };

    geminiWs.onclose = (e) => {
        log(`Gemini: WebSocket closed (code: ${e.code}, reason: ${e.reason || 'none'})`);
        if (e.code !== 1000 && isSessionActive) {
            setState(STATE.ERROR, `Gemini disconnected: ${e.reason || 'Connection lost'}`);
        }
        if (isSessionActive) stopSession();
    };
}

async function startGeminiAudioStream() {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
    audioContext = new AudioContext({ sampleRate: 16000 });
    const source = audioContext.createMediaStreamSource(mediaStream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
        if (!isSessionActive || !geminiWs || geminiWs.readyState !== 1) return;
        const pcmData = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
            int16[i] = Math.max(-32768, Math.min(32767, pcmData[i] * 32768));
        }
        const base64 = arrayBufferToBase64(int16.buffer);
        geminiWs.send(JSON.stringify({
            realtimeInput: {
                mediaChunks: [{
                    mimeType: "audio/pcm;rate=16000",
                    data: base64
                }]
            }
        }));
    };
}

function playBase64Audio(base64Data, mimeType) {
    try {
        const raw = atob(base64Data);
        const bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

        // PCM data — play via AudioContext
        const playCtx = new AudioContext({ sampleRate: 24000 });
        const int16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;

        const buffer = playCtx.createBuffer(1, float32.length, 24000);
        buffer.getChannelData(0).set(float32);
        const src = playCtx.createBufferSource();
        src.buffer = buffer;
        src.connect(playCtx.destination);
        src.start();
    } catch(e) {
        log(`Audio play error: ${e.message}`, 'warn');
    }
}

// ═══════════════════════════════════════════
// 3. ElevenLabs Conversational AI (WebSocket)
// ═══════════════════════════════════════════
async function startElevenLabs() {
    log('ElevenLabs: Starting conversational session...');

    const agentId = config.elevenlabsAgent;
    if (!agentId) {
        throw new Error('ElevenLabs Agent ID is required. Set it in Settings.');
    }

    // Get signed URL
    const signResp = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`, {
        headers: { 'xi-api-key': config.elevenlabsKey }
    });

    if (!signResp.ok) {
        const errText = await signResp.text();
        throw new Error(`ElevenLabs signed URL failed (${signResp.status}): ${errText}`);
    }

    const { signed_url } = await signResp.json();
    log('ElevenLabs: Got signed URL');

    elevenLabsWs = new WebSocket(signed_url);

    elevenLabsWs.onopen = async () => {
        log('ElevenLabs: WebSocket connected', 'ok');
        isSessionActive = true;
        setState(STATE.LISTENING, 'Connected — speak now');

        // Start sending mic audio
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
        audioContext = new AudioContext({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(mediaStream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
            if (!isSessionActive || !elevenLabsWs || elevenLabsWs.readyState !== 1) return;
            const pcmData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(pcmData.length);
            for (let i = 0; i < pcmData.length; i++) {
                int16[i] = Math.max(-32768, Math.min(32767, pcmData[i] * 32768));
            }
            const base64 = arrayBufferToBase64(int16.buffer);
            elevenLabsWs.send(JSON.stringify({
                user_audio_chunk: base64
            }));
        };
    };

    elevenLabsWs.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'audio') {
                setState(STATE.SPEAKING, 'Responding...');
                if (data.audio?.chunk) {
                    playBase64Audio(data.audio.chunk, 'audio/pcm;rate=16000');
                }
            } else if (data.type === 'agent_response') {
                log(`ElevenLabs agent: ${data.agent_response_event || ''}`);
            } else if (data.type === 'user_transcript') {
                log(`You: ${data.user_transcript?.text || ''}`);
            } else if (data.type === 'interruption') {
                setState(STATE.LISTENING, 'Listening...');
            } else if (data.type === 'ping') {
                elevenLabsWs.send(JSON.stringify({ type: 'pong', event_id: data.event_id }));
            }
        } catch(e) {}
    };

    elevenLabsWs.onerror = () => {
        setState(STATE.ERROR, 'ElevenLabs connection error — check API key or Agent ID');
        log('ElevenLabs: WebSocket error', 'error');
    };

    elevenLabsWs.onclose = (e) => {
        log(`ElevenLabs: Disconnected (${e.code})`);
        if (isSessionActive) stopSession();
    };
}

// ═══════════════════════════════════════════
// 4. Hume EVI (WebSocket)
// ═══════════════════════════════════════════
async function startHume() {
    log('Hume: Starting EVI session...');

    const wsUrl = `wss://api.hume.ai/v0/evi/chat?api_key=${config.humeKey}`;
    humeWs = new WebSocket(wsUrl);

    humeWs.onopen = async () => {
        log('Hume: WebSocket connected', 'ok');
        isSessionActive = true;
        setState(STATE.LISTENING, 'Connected — speak now');

        // Start mic streaming
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
        audioContext = new AudioContext({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(mediaStream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
            if (!isSessionActive || !humeWs || humeWs.readyState !== 1) return;
            const pcmData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(pcmData.length);
            for (let i = 0; i < pcmData.length; i++) {
                int16[i] = Math.max(-32768, Math.min(32767, pcmData[i] * 32768));
            }
            const base64 = arrayBufferToBase64(int16.buffer);
            humeWs.send(JSON.stringify({
                type: 'audio_input',
                data: base64
            }));
        };
    };

    humeWs.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'audio_output') {
                setState(STATE.SPEAKING, 'Responding...');
                if (data.data) {
                    playBase64Audio(data.data, 'audio/pcm;rate=24000');
                }
            } else if (data.type === 'user_message') {
                setState(STATE.THINKING, 'Processing...');
            } else if (data.type === 'assistant_end') {
                setState(STATE.LISTENING, 'Listening...');
            } else if (data.type === 'error') {
                setState(STATE.ERROR, `Hume error: ${data.message || 'Unknown'}`);
                log(`Hume error: ${data.message}`, 'error');
            }
        } catch(e) {}
    };

    humeWs.onerror = () => {
        setState(STATE.ERROR, 'Hume connection error — verify your API key');
        log('Hume: WebSocket error', 'error');
    };

    humeWs.onclose = (e) => {
        log(`Hume: Disconnected (${e.code})`);
        if (isSessionActive) stopSession();
    };
}

// ═══════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

// ═══════════════════════════════════════════
// Init
// ═══════════════════════════════════════════
updateBadge();
updateKeyIndicators();

// Pre-fill keys from defaults if empty
if (!config.openaiKey) {
    // Show a helpful first-time message
    setState(STATE.IDLE, 'Open Settings (⚙) to add your API keys, then double-click to start');
}

log('Voice interface ready');
log(`Active provider: ${config.provider}`);
</script>



</body></html>
