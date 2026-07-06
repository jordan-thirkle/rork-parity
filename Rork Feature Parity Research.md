# **Competitive Blueprint and Technical Architecture for an AI-Native Conversational Game Development Platform**

The transition of software engineering from manual syntax generation to natural-language-driven development, commonly referred to as vibe coding, represents a foundational disruption in digital product creation1. Within the mobile application development ecosystem, the platform rork.com has emerged as a pioneer of this conversational shift, enabling non-technical founders and developers to conceptualize, compile, and publish native mobile applications directly from a web browser4. Founded in 2024 by Daniel Dhawan and Levan Kvirkveliia—who previously engineered an AI-driven Next.js site generator and co-created the developer community platform 21st.dev—Rork secured $2.8M in pre-seed funding from a16z Speedrun alongside the creators of React Native and Expo, eventually scaling to a $15M seed round as its platform footprint expanded3.  
To leverage the convergence of generative artificial intelligence and interactive entertainment, a structured architectural blueprint is required to build a feature-complete "chat-to-game" website. By analyzing and adapting Rork's core mechanics, design layouts, compilation pipelines, and publishing channels, this analysis outlines how to construct an interactive game-creation ecosystem. This platform coordinates third-party generative networks to automate the delivery of high-fidelity user interfaces, 2D art, rigged 3D models, sound effects, and backend multiplayer infrastructure8.

## **Technical Scraped Feature Parity Analysis**

Achieving feature parity with Rork requires a detailed understanding of its user onboarding, project workspace structure, backend services, and multi-tier compilation runtimes3. The Rork platform is structured to remove technical friction at every phase of the development lifecycle4.  
During onboarding, Rork guides users through a structured survey to assess their project goals before sending them to the central dashboard13. Rather than starting with an empty editor, users are introduced to an "explore screen" containing thousands of active projects built by the community13. The onboarding process encourages developers to "remix" or clone existing applications to establish a proven baseline5. Once a project is initiated, users can toggle into "Plan Mode" to collaboratively brainstorm architecture, system hierarchies, and feature sets with the AI agent before executing code changes5. This mode conserves billing credits by avoiding unnecessary compilation cycles during the initial design phase3.  
For code modification, Rork operates on a split-mode architecture:

* **Conversational Agent Mode**: Users describe layout edits, gameplay loop additions, or design updates in natural language3. The AI agent parses these requests, updates the codebase, and streams the compiled output14.  
* **Developer Mode (Dev Mode)**: This workspace option provides direct, read-write access to the underlying code files12. It enables developers to manually edit the generated React Native, Expo, or SwiftUI files, inspect package dependencies, and resolve logic anomalies that the AI agent struggles to repair5.

Rork supports continuous GitHub integration, allowing users to sync their repositories, track version branches, and export clean, production-ready codebases to external IDEs like Cursor or VS Code4. Collaboration is managed through shared workspaces18. Team administrators can invite external contributors via secure links, assigning granular editor or viewer roles to organize multiple projects under a single workspace18.  
Backend operations are managed through a unified architecture3. Rork provides a pre-configured serverless database wrapper, referred to as the Rork Backend, which automatically provisions data storage, handles secure API keys, and tracks user parameters3. For identity management and monetization, Rork integrates with Supabase Auth for secure logins and RevenueCat for setting up app store paywalls and subscriptions2.  
The Rork platform is divided into two distinct technological tracks, each serving different platform targets and performance requirements:

### **Rork Pro**

This tier compiles cross-platform mobile applications using React Native and Expo, alongside native Android codebases utilizing Kotlin and Jetpack Compose5. Rork Pro converts text prompts into modular JavaScript or TypeScript components6. This architecture maintains high efficiency while reusing up to 90% of the codebase across the iOS and Android ecosystems, rendering layouts inside native view wrappers rather than slow, web-based containers5.

### **Rork Max**

Operating as an advanced, web-based replacement for Xcode, this flagship tier compiles pure Swift and SwiftUI codebases natively12. It targets the entire Apple hardware spectrum, including iPhone, iPad, Apple Watch (watchOS), Apple TV (tvOS), Vision Pro (visionOS spatial experiences), and iMessage extension apps12. By interacting directly with low-level, hardware-specific APIs, Rork Max supports 3D gaming pipelines running at a stable 60 frames per second using SceneKit and Metal, ARKit-driven physical interactions, and device-level systems like NFC, HealthKit, HomeKit, Dynamic Island, Live Activities, and Home Screen widgets3.  
To adapt these capabilities for a chat-to-game development platform, the engine must translate Rork's mobile-focused features into web-compatible and engine-native equivalents:

| Core rork.com Platform Feature | Rork Implementation Pipeline | Chat-to-Game Counterpart Target | Adapted Game-Centric Architecture |
| :---- | :---- | :---- | :---- |
| **Exploration & Remixed Scaffolds** \[cite: 7, 13\] | Onboarding database displaying public app repositories for direct cloning7. | **Remixable Game Templates & Jams** \[cite: 13, 22\] | Provides interactive game templates (e.g., RPG, Platformer, voxel playgrounds) as pre-configured code baselines22. |
| **Plan Mode Ideation** \[cite: 5\] | Structural text brainstorming and planning before generating codebase assets5. | **Game Ideator & Ludo Score Evaluation** \[cite: 24\] | Integrates real-time market trends and player metrics to evaluate a game's feasibility and design concept before writing code24. |
| **Dev Mode Code Editing** \[cite: 12\] | Direct text-editor access to generated Swift and React Native files12. | **Unified In-Browser IDE & Scene Inspector** \[cite: 11, 25\] | Combines an editable script explorer with a visual node hierarchy inspector for manual coordinate adjustments22. |
| **GitHub Continuous Synchronization** \[cite: 4, 5, 16\] | Two-way repository mirroring and code-export pipelines4. | **Vite-Mirror & Export Package** \[cite: 11, 26\] | Synchronizes script edits with GitHub, allowing users to export the project as a standard Vite/TypeScript bundle11. |
| **Serverless Backend Enablement** \[cite: 3, 4\] | Automated setup for data storage and API key management3. | **Serverless High Scores & State Sync** \[cite: 26, 27\] | Auto-provisions Supabase databases and Go serverless functions to handle persistent leaderboards and player inventory data8. |
| **Hardware-Specific API Integration** \[cite: 4, 15, 18\] | Direct access to native iOS/Android hardware sensors and features4. | **Gamepad, WebXR, and Touch Controls** \[cite: 11, 15\] | Integrates browser input APIs for gamepads, mobile touch areas, and immersive WebXR headsets11. |
| **Store EAS Deployment Pipeline** \[cite: 5, 15, 20\] | Cloud fastlane orchestration and Expo EAS build delivery5. | **Static CDN & Native Cordova Wrappers** \[cite: 27, 28\] | One-click hosting to static CDNs alongside automated packaging wrappers (e.g., Capacitor) for mobile wrapping19. |

## **The Conversational UI/UX Editor Workspace**

A visual environment designed for natural-language development must prioritize a clean, uncluttered layout over the complex inspector panels common in legacy engines6. The proposed layout uses a dual-pane workspace that places conversational inputs and real-time visual feedback side-by-side14.  
The screen is divided into two main sections:

### **The AI Orchestrator Control Panel (Left Pane)**

This panel occupies 40% of the screen width and is divided vertically to manage the development process:

* **The Active Execution Log (Top)**: Displays the AI agent's "thought process" as it works14. It outlines plans, updates scripts, and verifies build cycles15.  
* **The File and Asset Explorer (Middle)**: A clean directory tree listing the generated game scripts, 2D sprites, 3D meshes, and sound files11.  
* **The Conversational Input Terminal (Bottom)**: A chat input bar where users enter requests3. It includes a media upload tool for adding UI sketches, layout wireframes, or reference images to guide the AI's design process3.

### **The Live Interactive Simulator (Right Pane)**

This panel occupies the remaining 60% of the screen and displays a running instance of the game14.  
A toolbar above the viewport allows users to test their game across different environments:

\+-------------------------------------------------------------------------------------------------------+  
|  \[P\] Projects  /  My Space Shooter Game (Three.js 3D)                              \[Sync GitHub\] \[Publish\] |  
\+-----------------------------------------------------+-------------------------------------------------+  
|                                                     |  Viewport: \[Desktop 16:9\] \[Mobile Portrait\] \[VR\] |  
|  AGENT LOGS & INTERACTIVE PROMPT PANEL              |  \+--------------------------------------------+ |  
|                                                     |  |                                            | |  
|  \+-----------------------------------------------+  |  |                                            | |  
|  | \[Agent Status: Compiling project...\]          |  |  |                                            | |  
|  | \> Injecting LaserCannon.ts into Player node   |  |  |                                            | |  
|  | \> Rebuilding Vite dev dependencies...         |  |  |                                            | |  
|  | \> Clean hot-reload compilation complete.      |  |  |             ACTIVE PLAY VIEWPORT           | |  
|  \+-----------------------------------------------+  |  |                                            | |  
|                                                     |  |             (WebGL Render Canvas)          | |  
|  \+-----------------------------------------------+  |  |                                            | |  
|  | \[Workspace Scripts\]                           |  |  |                                            | |  
|  | \- GameInit.ts                                 |  |  |                                            | |  
|  | \- PlayerShip.ts                               |  |  |                                            | |  
|  | \- LaserCannon.ts                              |  |  |                                            | |  
|  \+-----------------------------------------------+  |  |                                            | |  
|                                                     |  \+--------------------------------------------+ |  
|  \+-----------------------------------------------+  |  \+--------------------------------------------+ |  
|  | \[Chat Input\]                                  |  |  | \[QR Code\] Scan to play live on mobile      | |  
|  | "Add an audio loop to the laser cannon..."    |  |  \+--------------------------------------------+ |  
|  \+-----------------------------------------------+  |                                                 |  
\+-----------------------------------------------------+-------------------------------------------------+

The workspace simplifies the edit loop by mapping interactions on the preview canvas back to the code explorer29. If a developer double-clicks a 3D asset or interface element in the preview pane, the compiler highlights the corresponding code file (e.g., LaserCannon.ts) in the left panel and pre-fills the chat prompt with a targeted reference14. This allows developers to adjust values like speed, rotation, or fire rates using simple, conversational commands5.

## **Sandboxed Code Execution and Compiler Architecture**

Running AI-generated game code in real time requires a compilation and execution pipeline that is fast, secure, and isolated11. The platform runs a dynamic bundler built on Vite and esbuild11. This setup compiles TypeScript code and hot-swaps updated modules into the active session via WebSockets, eliminating the need for full browser refreshes11.  
To prevent malicious actions, such as infinite loops or unauthorized data access, the compilation system isolates the running game inside a sandboxed iframe27.

\+--------------------------------------------------------------------------------+  
|  MAIN BROWSER DOM (Host Page)                                                  |  
|                                                                                |  
|  \+--------------------------------------------------------------------------+  |  
|  |  IFRAME CONTAINER (Secure Sandbox Boundary)                             |  |  
|  |  \<iframe sandbox="allow-scripts allow-same-origin allow-pointer-lock"\>  |  |  
|  |                                                                          |  |  
|  |  \+--------------------------------------------------------------------+  |  |  
|  |  |  VITE IN-MEMORY COMPILER & PLAYBACK RUNTIME                        |  |  |  
|  |  |  \- Injects target game engines (Phaser 3 / Three.js Core)          |  |  |  
|  |  |  \- Evaluates active TS modules                                      |  |  |  
|  |  \+--------------------------------------------------------------------+  |  |  
|  |                                                                          |  |  
|  |  \+--------------------------------------------------------------------+  |  |  
|  |  |  WEBGL CANVAS VIEWPORT                                             |  |  |  
|  |  |  \- Captures controller inputs, triggers renderer callbacks         |  |  |  
|  |  \+--------------------------------------------------------------------+  |  |  
|  |                                                                          |  |  
|  \+--------------------------------------------------------------------------+  |  
|                                                                                |  
\+--------------------------------------------------------------------------------+

The iframe uses strict HTML5 sandboxing properties to restrict the execution context32:

HTML  
\<iframe  
  src\="https://runtime.sandbox.gamecreator.com/player"  
  sandbox\="allow-scripts allow-same-origin allow-pointer-lock"  
  id\="isolated-game-runtime"\>  
\</iframe\>

The configuration balances security and usability32:

* **Script Isolation**: Enforcing allow-scripts and allow-same-origin keeps code execution within the iframe's boundary, blocking access to the parent page's DOM, local cookies, or workspace credentials27.  
* **Input Capture**: The allow-pointer-lock flag lets the game capture raw mouse inputs, a requirement for first-person and camera-controlled navigation32.

Because the game runs in an isolated context, it cannot directly call parent services27. The platform resolves this by establishing a secure communication bridge using the browser's PostMessage API27.

### **Parent Window Event Listener**

TypeScript  
window.addEventListener('message', (event: MessageEvent) \=\> {  
  if (event.origin \!== 'https://runtime.sandbox.gamecreator.com') return;

  const { type, payload } \= event.data;  
  switch (type) {  
    case 'RUNTIME\_EXCEPTION\_DETECTED':  
      // Routes runtime errors directly back to the AI developer agent for debugging  
      triggerAutomatedAgentDebugging(payload.errorStack, payload.fileRef);  
      break;  
    case 'GAME\_ASSET\_CLICKED':  
      // Focuses the editor UI on the selected node's script  
      focusEditorOnFile(payload.filePath);  
      break;  
    case 'MONETIZATION\_TRIGGERED':  
      // Evaluates store transactional rules via RevenueCat  
      processInGamePurchase(payload.sku);  
      break;  
  }  
});

### **Sandboxed Iframe Error Interceptor**

TypeScript  
window.onerror \= function (message, source, lineno, colno, error) {  
  window.parent.postMessage({  
    type: 'RUNTIME\_EXCEPTION\_DETECTED',  
    payload: {  
      errorStack: error ? error.stack : message,  
      fileRef: source,  
      line: lineno  
    }  
  }, '\*');  
  return true;  
};

This bridge allows the runtime environment to catch and report errors automatically15. If a script throws an exception during play, the iframe intercepts the crash log and sends it to the AI agent15. The agent reads the trace, modifies the broken code, and reloads the frame—creating a self-correcting development loop that requires no manual troubleshooting from the user15.

## **Technical Evaluation of Target Web Game Engines**

The choice of target game engine determines the platform's loading speed, performance, and code-generation reliability11. The table below compares the technical trade-offs of Phaser 3, Three.js, and Godot 4 across development requirements.

| Technical Evaluation Axis | Phaser 3 | Three.js | Godot 4 (Wasm Export) |
| :---- | :---- | :---- | :---- |
| **Primary Dimensions** | 2D Canvas & WebGL27 | 3D WebGL & WebGPU11 | 2D & 3D (Native Native Compilation)34 |
| **Boilerplate Footprint** | Extremely low; simple setup makes it easy for AI models to parse27. | Low; requires straightforward scene, camera, and renderer code31. | Moderate; relies on structured GDScript class and node-tree networks36. |
| **Hot-Reload Support** | Instant (\<100ms) module replacement27. | Instant (\<150ms) scene and matrix updates11. | Poor; requires rebuilding and reloading heavy WebAssembly bundles22. |
| **Asset Pipeline Integration** | Transparent PNGs, standard sprite sheets, and lightweight audio formats23. | Direct GLTF, GLB, textured maps, and ambient audio systems10. | Deep engine-native asset loaders, spatial audio, and custom mesh systems38. |
| **Sandbox Portability** | High; runs reliably in restricted sandboxed containers27. | High; utilizes standard browser WebGL rendering contexts31. | Moderate; WebAssembly multi-threading can hit security walls32. |
| **Physics Performance** | Arcade Physics & Matter.js integrations15. | Physics libraries like Cannon.js or Ammo.js15. | High-performance, integrated Jolt physics engine38. |

For rapid browser prototypes, **Phaser 3** and **Three.js** are the recommended defaults11. They run efficiently inside standard sandboxed iframes, load quickly, and use simple, human-readable JavaScript codebases that AI models can easily generate and modify without breaking surrounding features11. For more complex titles that need detailed physics and native desktop compiling, **Godot 4** is the preferred choice35. Its GDScript class system is clean and accessible, and its compiled WebAssembly runtime ensures consistent gameplay across desktop environments22.

## **Third-Party API Integration Blueprint**

To build a platform that supports the entire game development cycle, the workspace coordinates a collection of generative APIs11. These services handle everything from 3D model synthesis to sound design, and are orchestrated by a central conversational agent11.

                     \[Conversational AI Orchestrator\]  
                                    |  
      \+------------------+----------+----------+------------------+  
      |                  |                     |                  |  
      v                  v                     v                  v  
\[Meshy API\]     \[Scenario.gg API\]      \[ElevenLabs API\]    \[Supabase & Agora\]  
(3D Model        (Consistent 2D Sprite  (SFX, Dialogues,    (Database, Auth,  
 Pipeline)       Sheets & Style LoRAs)   Soundscapes)       Realtime & Voice)

### **3D Asset Pipeline: Meshy API**

The platform uses the **Meshy API** to turn natural-language descriptions or flat 2D concept sketches into textured, rigged, and game-ready 3D models10.

* **Text to 3D Endpoint**: POST https://api.meshy.ai/openapi/v2/text-to-3d  
  \[cite: 40, 41\]  
* **Headers**: Authorization: Bearer \<API\_KEY\>  
  \[cite: 40, 41\]

To build an asset, the platform executes a two-stage process: first generating a low-poly draft mesh, then applying refined textures and rigging10.

#### **Step 1: Initiating the Draft Mesh**

The platform submits a request defining the base geometry requirements41:

Bash  
curl \-X POST "https://api.meshy.ai/openapi/v2/text-to-3d" \\  
  \-H "Authorization: Bearer msy\_production\_token\_string\_here" \\  
  \-H "Content-Type: application/json" \\  
  \-d '{  
    "mode": "preview",  
    "prompt": "stylized low-poly sword with neon glowing runes, medieval fantasy weapon, game-ready",  
    "style": "realistic",  
    "should\_remesh": true,  
    "topology": "quad"  
  }'

The system returns a unique task ID41. The platform polls the status endpoint using this ID until the draft generation succeeds41:

Bash  
curl \-X GET "https://api.meshy.ai/openapi/v2/text-to-3d/task\_id\_string" \\  
  \-H "Authorization: Bearer msy\_production\_token\_string\_here"

Once complete, the platform downloads the draft GLB file and begins the texturing and animation pipeline37.

#### **Post-Processing Pipeline**

After validating the draft mesh, the engine uses Meshy's suite of post-processing endpoints to refine the model for active gameplay10:

* **AI Texturing (/openapi/v2/retexture)**: Generates and applies PBR texture maps (Diffuse, Roughness, Metallic, Normal) in under 3 minutes10.  
* **Rigging & Locomotion (/openapi/v2/rigging)**: Automatically maps humanoid skeletons and adds basic animation nodes (e.g., idle, walk, run), saving hours of manual animation work10.  
* **Convert (/openapi/v2/convert)**: Converts models to engine-friendly formats (GLB, FBX, or USDZ) while maintaining embedded texture maps30.

The table below breaks down the primary capabilities and credit costs of the Meshy integration:

| Meshy API Pipeline Node | Description of Capability | Credit Consumption Cost |
| :---- | :---- | :---- |
| **Text to 3D** | Generates full 3D models from raw text descriptions10. | 20–30 credits |
| **Image to 3D** | Converts single or multi-angle 2D photos into 3D meshes10. | 20–30 credits |
| **Retexture** | Re-textures existing meshes using new text prompts30. | 10 credits |
| **Repair Printability** | Automatically repairs meshes, fixing holes and manifold edges30. | 10 credits |
| **Remesh** | Alters polygon topology and optimizes density for real-time play30. | 5 credits |
| **Unwrap UV** | Generates clean, unwrapped UV maps for standard meshes30. | 5 credits |
| **Auto-Rigging** | Adds skeletal structures and humanoid animation loops30. | 5 credits |
| **Convert Format** | Converts model files without modifying underlying topology30. | 1 credit |

### **2D Art and Consistency: Scenario.gg**

To generate 2D sprites, UI elements, items, and environment textures, the platform integrates the **Scenario.gg API**9. Unlike general-purpose image generators that can produce inconsistent results, Scenario allows creators to train custom LoRA models43. This ensures that every generated asset adheres to the game's pre-defined art direction9.

* **Authentication**: Token passed as a Bearer string in the standard HTTP request headers40.

#### **Consistency Integration Workflow**

\[Reference Image Dataset (5-100 Images)\] \---\> \[Train Bespoke LoRA via Scenario API\]  
                                                      |  
                                                      v  
\[Natural Language Prompt Inputs\] \------------\> \[Consistent Generative Model\]  
                                                      |  
                                                      v  
\[Transparent Sprites & Sprite Sheets\] \<------ \[Automated Background Removal\]

1. **Custom Model Training**: The platform lets developers upload a dataset of 5 to 100 images showcasing the game's visual style (such as retro 16-bit pixel art, hand-drawn vector art, or sci-fi UI concepts)9. Using the Scenario API, the platform triggers a training job to build a bespoke style model9.  
2. **Consistent Sprite Generation**: When the user requests a new asset (e.g., "Create a health potion bottle"), the platform routes the prompt through the game's trained style model9. This ensures that the output matches the visual style of the existing asset library9.  
3. **Background Isolation**: The system runs the output image through an automated background removal and alpha-channel processor23. This produces clean, transparent PNG files ready to be imported into the game's canvas23.

To evaluate the character consistency and pipeline utility of Scenario.gg, the table below highlights its operational differences compared to other major image generation platforms:

| Creative Platform | Primary Optimization Profile | Public API Support | Character Consistency Profile | Best Use Case in Platform |
| :---- | :---- | :---- | :---- | :---- |
| **Scenario.gg** \[cite: 45\] | Dedicated game-asset generation pipelines45. | Yes; production-ready REST API39. | High; relies on custom style models trained on reference images9. | Generating massive batches of consistent, style-specific NPCs, sprites, and environment assets9. |
| **Leonardo.ai** \[cite: 45\] | General digital design and asset pipelines45. | Yes; full developer API39. | High; uses custom character reference points44. | Creating high-fidelity title cards, marketing banners, and complex concept art43. |
| **Ideogram** \[cite: 45\] | Image text-rendering and composition45. | Limited; web-focused pricing tiers45. | High; features a unified canvas environment45. | Designing UI overlays, dialog boxes, and card components containing embedded text45. |
| **Midjourney** \[cite: 45\] | High-quality artistic images45. | No public developer API45. | High; utilizes structural reference properties44. | Quick ideation, concept exploration, and style research during Plan Mode5. |

### **Sound Effects and Audio Design: ElevenLabs API**

To automate sound design, the platform integrates the **ElevenLabs Sound Generation API**46.

* **Endpoint**: POST https://api.elevenlabs.io/v1/sound-generation  
  \[cite: 48\]  
* **Headers**: xi-api-key: \<YOUR\_API\_KEY\>  
  \[cite: 48\]

The platform submits a text description of the desired sound alongside structural parameters48:

Bash  
curl \-X POST "https://api.elevenlabs.io/v1/sound-generation" \\  
  \-H "xi-api-key: eleven\_production\_key\_here" \\  
  \-H "Content-Type: application/json" \\  
  \-d '{  
    "text": "old wooden chest opening slowly with creaks and squeaks, dust settling, RPG sound",  
    "loop": false,  
    "duration\_seconds": 4.5,  
    "prompt\_influence": 0.4  
  }' \\  
  \--output "chest\_open\_sfx.mp3"

The API returns an MP3 audio file that the compiler automatically saves into the project's asset directory48.  
The platform applies specific billing and parameter rules depending on whether audio is requested through the editor UI or directly via the API:

* **Fidelity Controls**: The prompt\_influence parameter (ranging from 0.0 to 1.0) controls how closely the model adheres to the description48. Higher values enforce precise details, while lower values give the model creative freedom to generate richer variation48.  
* **Looping Soundscapes**: When loop is enabled, the API ensures the audio's final frames blend smoothly back into its opening48. This allows the platform to generate seamless background loops for rain, engines, or ambient drones47.  
* **Credit Consumption Rules**: The platform uses different credit metrics depending on the interaction context51:  
  * **API-Driven Generation (Default Developer Loop)**: Each request generates a single audio track51. Automated-duration requests consume a flat **100 credits** per build, while specified-duration requests consume **20 credits per generated second**51.  
  * **Browser UI Playground (Manual Sandbox)**: Generates 4 variations of the sound for the developer to review51. Automated-duration generations consume **200 credits**, while specified-duration creations consume **40 credits per generated second**51.

## **Technical Mitigations for Common AI Code Generation Risks**

Building a development platform around conversational code generation introduces specific operational challenges52. The compiler must prevent system lockups, manage context limits, and provide intuitive design tools25.  
To ensure a stable developer experience, the platform applies specific engineering safeguards:

### **Rebuilding Broken Code Frameworks (Self-Correction Logs)**

* **The Problem**: AI models occasionally write code containing syntax errors, missing variables, or incorrect types54. If the compiler attempts to run this code, it can crash the preview panel or drag the model into an infinite self-correction loop, wasting the user's compute credits on repetitive, failed attempts25.  
* **The Solution**: The platform uses an automated Abstract Syntax Tree (AST) checker and linter on the server15. When the AI agent writes a code update, the system parses the code and checks for syntax errors *before* updating the database or charging credits12. If a syntax error is detected, the write is blocked, the code is returned to the model with the error trace, and a recovery thread is initialized15. The platform enforces a strict cap of **3 automated correction cycles** per update54. If the code still fails to compile after three attempts, the system pauses execution, rolls back to the last stable git commit, and displays a clean error report with helpful recommendations16.

### **Structural Component Boundaries (File Scoping and Modular Isolation)**

* **The Problem**: As games grow in complexity, codebases become larger25. When a user asks the AI to add a new feature, the model can struggle to manage the larger context, occasionally overwriting existing mechanics or corrupting code blocks in other files53.  
* **The Solution**: The compiler enforces a strict **Component Modularization Pattern**11. The AI is programmed to write isolated, single-responsibility scripts (e.g., PlayerPhysics.ts, ScoreTracker.ts, SoundManager.ts) rather than maintaining one large file11. When the user requests an update, a lightweight parsing model identifies which files are affected11. The system feeds only those relevant scripts into the model's active context window, protecting the rest of the codebase from regressions11. Additionally, the platform triggers a background git commit before every update, allowing users to restore their project to any previous stable version16.

### **Real-Time Parameter Overlays (Reducing Natural Language Fatigue)**

* **The Problem**: Describing precise layout details—such as exact positions, scales, or UI paddings—using only text commands is difficult and inefficient3. Forcing these minor design adjustments through a chat interface can quickly exhaust a developer's patience and monthly credits3.  
* **The Solution**: The platform includes visual overlays on top of the preview canvas25. When a developer selects a sprite or 3D node in the preview, the editor displays graphical adjustment controls (e.g., position gizmos, scale handles, and color wheels)17. Adjusting these handles updates the component's coordinates in real time25. The compiler captures these visual changes and writes the corresponding values directly into the script files5. This hybrid workflow lets users handle design adjustments visually, saving their AI credits for coding complex game mechanics5.

The table below summarizes these common development challenges and the platform's technical mitigations:

| Operational Risk | Primary System Trigger | Core Negative Impact | Platform Mitigation Architecture |
| :---- | :---- | :---- | :---- |
| **Self-Correction Loops** \[cite: 54\] | Code syntax errors or missing variables54. | Loop lockup, platform crashes, credit waste53. | Server-side AST checker, automatic file check, and a 3-cycle rollback cap12. |
| **Context Overwrites** \[cite: 53\] | Large, un-modular single-file codebases53. | Regressions, broken features, lost work53. | Component Scoping Pattern, routing agents, and automatic background commits11. |
| **Prompt Fatigue** \[cite: 3, 5\] | Describing precise UI coordinates in text3. | Inefficient edits, credit loss, frustration3. | Real-time parameter controllers, visual handle tracking, and automated file-value writes5. |

## **Compute Credits and Platform Monetization Mechanics**

To sustain the infrastructure costs of running in-browser bundlers, interactive simulators, and third-party generative networks, the platform uses a clear, usage-based subscription model8. This credit system balances compute expenses against user activities while keeping prices predictable12.  
The platform determines credit usage using a structured formula:  
![][image1]  
Standard activities are billed using flat rates to help users manage their balances:

* **Code Update Command**: Submitting a natural-language request to update code or change UI layouts consumes **1 credit**12.  
* **System Additions**: Generating complex, multi-system elements (such as persistent leaderboards or inventory databases) consumes **5 credits**4.  
* **Generative Asset Sourcing**: Using third-party generative networks consumes credits mapped directly to the partner API's computational usage (e.g., a Meshy 3D generation task consumes **20 to 30 credits**)30.

The platform organizes these features into structured, value-driven pricing tiers:

* **Free Plan ($0/mo)**: Designed for beginners12. Includes a daily cap of **5 credits** and up to **35 credits per month** in major markets (US, UK, CA, EU, JP, KR, AU) to prevent abuse, while minor markets receive a flat **5 credits per month**12. Projects are always public, allowing other developers to search, clone, and remix their games12.  
* **Creator Pro ($25/mo)**: Ideal for solo developers and indie studios4. Includes a larger monthly pool of **150 credits** and removes the daily generation cap4. Unlocks private projects, custom LoRA model training via Scenario.gg, and full codebase exports to external environments5.  
* **Studio Max ($200/mo)**: Optimized for professional teams and agencies4. Includes **1,000 credits per month** (scalable up to 10,000 for heavier enterprise users)12. Unlocks spatial computing projects, multiplayer integrations, serverless databases, and one-click deployment pipelines to Google Play and the Apple App Store12.

The table below compares the platform's core tiers, features, and target developers:

| Platform Tier | Subscription Price | Monthly Credit Limit | Engine Options & Core Feature Access | Customer Support Axis |
| :---- | :---- | :---- | :---- | :---- |
| **Free Plan** \[cite: 12\] | $0 / month12 | 35 credits / month12 | Web-only games, Phaser 3 2D runtime, public repositories only, community access12. | Community Forums52. |
| **Creator Pro** \[cite: 12\] | $25 / month4 | 150 credits / month4 | Private projects, 3D engines (Three.js), full code export, custom LoRA styles5. | Priority Email Support12. |
| **Studio Max** \[cite: 12\] | $200 / month12 | 1,000 credits / month4 | Multiplayer runtimes, serverless databases, Wasm compiling, one-click app store publishing8. | Dedicated Live Chat12. |

To support its developer community, the platform includes specific ways for users to earn free compute credits12:

* **Monetization Rewards**: Linking an active RevenueCat account to a published game rewards developers with up to **1,000 free compute credits per month**, scaled to the game's store revenue12.  
* **Community Contributions**: Developers can earn credits by sharing first-hand guides on the platform's forum, hosting community events, or helping other creators solve technical challenges in the Discord developer server12.

## **Technical Comparison of AI-Native Creation Platforms**

To position the platform effectively within the broader ecosystem of development tools, it is helpful to analyze the design choices of its key competitors25:

* **Rosebud AI**: Specialized in fast, browser-based games, Rosebud excels at speed-to-market prototyping but lacks clean options to export codebases or publish to mobile app stores22.  
* **Summer Engine**: An AI-native editor built on Godot 4, Summer Engine provides excellent 3D physics and deep coding control but requires a heavier local installer and a more technical learning curve22.  
* **Bilt.me**: Highly optimized for professional teams, Bilt provides structured code management and strong deployment support, though its subscription pricing scales aggressively for solo developers25.

The table below evaluates the design, runtimes, and limitations of these alternative platform approaches:

| Platform | Core Target Output | Script Language | Code Export & Version Control | Deployment Options | Core Limitation |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Rosebud AI** \[cite: 22\] | Browser-based 2D and 3D web games22. | JavaScript34. | No raw codebase or offline project exports22. | Shareable web preview links22. | Games are locked to the browser, with no native mobile compiling22. |
| **Summer Engine** \[cite: 22\] | High-performance desktop and web titles22. | GDScript36. | Deep integration with local workspaces and Git38. | Direct exports for PC, Console, and Web34. | Steeper learning curve; requires downloading a local editor36. |
| **Bilt.me** \[cite: 25\] | Native cross-platform mobile apps25. | TypeScript / Swift12. | Full repository exports and GitHub syncing25. | Store publication with deployment help25. | Tailored for standard apps rather than rich 3D gaming pipelines25. |
| **Proposed Engine** | Multi-engine 2D/3D mobile and web games26. | TypeScript / GDScript27. | Secure repository exports and two-way GitHub sync5. | Standard web hosting and automated app store wrappers27. | High network reliance for real-time asset generation30. |

## **Actionable Recommendations for Platform Deployment**

To build a reliable chat-to-game development platform, engineers should focus on four core deployment steps11:

1. **Deploy a Lightweight Runtime First**: Start by implementing a simple 2D preview environment powered by Phaser 327. This engine is highly reliable and handles frequent code changes with minimal memory overhead, making it ideal for testing and refining the platform's core code-generation pipeline27.  
2. **Implement Structural Git Versioning**: Save a clean git commit in the database before every conversational update16. This ensures that if the AI agent writes a bug that crashes the preview canvas, the developer can instantly roll back to the last stable build with a single click16.  
3. **Isolate Running Code Safely**: Run the active game viewport inside a secure, sandboxed iframe using strict browser-level permissions27. This isolates the game's execution thread, protecting parent workspace databases and local APIs from security exploits27.  
4. **Use Custom AI Art Styles**: Avoid generic text-to-image generators that can produce disjointed visual designs44. Use style-consistent API pipelines (like Scenario's trained LoRAs) to ensure that characters, environments, and UI elements share a unified, cohesive art direction9.

#### **Works cited**

1. Rork Ai vibecode guide \- App Store \- Apple, [https://apps.apple.com/us/app/rork-ai-vibecode-guide/id6752721626](https://apps.apple.com/us/app/rork-ai-vibecode-guide/id6752721626)  
2. Rork : Build real mobile apps by chatting with AI | Product Hunt, [https://www.producthunt.com/products/rork-app-for-ios](https://www.producthunt.com/products/rork-app-for-ios)  
3. Rork \- HKU SPACE AI Hub, [https://aihub.hkuspace.hku.hk/ai-tools/developer-and-programming/rork/](https://aihub.hkuspace.hku.hk/ai-tools/developer-and-programming/rork/)  
4. Rork AI Review & Tutorial 2026: Build Mobile Apps | No Code MBA, [https://www.nocode.mba/articles/rork-tutorial-ai-apps](https://www.nocode.mba/articles/rork-tutorial-ai-apps)  
5. Rork AI Reviewed by an AI Product Designer (2026), [https://www.banani.co/blog/rork-ai-review](https://www.banani.co/blog/rork-ai-review)  
6. Rork.com Review: Can This No-Code Platform Really Build Your Mobile App? \- Medium, [https://medium.com/@e2larsen/rork-com-review-can-this-no-code-platform-really-build-your-mobile-app-d17f32bd2870](https://medium.com/@e2larsen/rork-com-review-can-this-no-code-platform-really-build-your-mobile-app-d17f32bd2870)  
7. Rork — Build mobile apps with AI, no code. | Founders, Inc., [https://f.inc/portfolio/rork/](https://f.inc/portfolio/rork/)  
8. Complete Guide to Building a Live Streaming App with Rork & Agora SDK — Real-Time Video, Gifting, and Monetization, [https://rorklab.net/en/articles/rork-dev/rork-agora-live-streaming-complete-guide](https://rorklab.net/en/articles/rork-dev/rork-agora-live-streaming-complete-guide)  
9. Scenario v1.80 \- AI Tool For Game assets \- There's An AI For That, [https://theresanaiforthat.com/ai/scenario/](https://theresanaiforthat.com/ai/scenario/)  
10. meshy-dev/Meshy-guide \- AI 3D Model Generator \- GitHub, [https://github.com/meshy-dev/Meshy-guide](https://github.com/meshy-dev/Meshy-guide)  
11. GitHub \- majidmanzarpour/threejs-game-skills: Agent skills for building playable, polished Three.js browser games with gameplay, AAA-style graphics, UI, QA, and optional AI-generated 3D, image, and audio assets., [https://github.com/majidmanzarpour/threejs-game-skills](https://github.com/majidmanzarpour/threejs-game-skills)  
12. Plans & Subscriptions \- Rork, [https://docs.rork.com/introduction/subscriptions](https://docs.rork.com/introduction/subscriptions)  
13. How to build your first app \- Rork, [https://docs.rork.com/introduction/build-your-first-app](https://docs.rork.com/introduction/build-your-first-app)  
14. Rork App Review 2025: Building a Mobile App with AI? My Honest Take \- Skywork, [https://skywork.ai/skypage/en/Rork-App-Review-2025-Building-a-Mobile-App-with-AI-My-Honest-Take/1974517911827181568](https://skywork.ai/skypage/en/Rork-App-Review-2025-Building-a-Mobile-App-with-AI-My-Honest-Take/1974517911827181568)  
15. Rork Max — The best way to build mobile apps, [https://rork.com/max](https://rork.com/max)  
16. Rork AI App Builder Might Be The Fastest Way To Ship An App Right Now \- Reddit, [https://www.reddit.com/r/AISEOInsider/comments/1rfgpxy/rork\_ai\_app\_builder\_might\_be\_the\_fastest\_way\_to/](https://www.reddit.com/r/AISEOInsider/comments/1rfgpxy/rork_ai_app_builder_might_be_the_fastest_way_to/)  
17. Rork AI Alternatives: Why Some Builders Choose Rocket.new, [https://www.rocket.new/blog/rork-ai-alternatives-why-some-builders-choose-rocket-new](https://www.rocket.new/blog/rork-ai-alternatives-why-some-builders-choose-rocket-new)  
18. Rork FAQ \- Frequently Asked Questions, [https://rork.com/faq](https://rork.com/faq)  
19. Rork AI Review What It Is and How It Works \- Momen, [https://momen.app/blogs/rork-ai-review-what-it-is-and-how-it-works/](https://momen.app/blogs/rork-ai-review-what-it-is-and-how-it-works/)  
20. Rork AI Review 2026: What It Is and How It Works | Rapid Dev, [https://www.rapidevelopers.com/blog/rork-ai-review](https://www.rapidevelopers.com/blog/rork-ai-review)  
21. From AI Prompts to App Store: My Journey Building a Fitness App with Grok and Rork, [https://rimusz.net/from-ai-prompts-to-app-store-my-journey-building-a-fitness-app-with-grok-and-rork/](https://rimusz.net/from-ai-prompts-to-app-store-my-journey-building-a-fitness-app-with-grok-and-rork/)  
22. Is Rosebud AI Worth It? An Honest 2026 Review | Summer Engine, [https://www.summerengine.com/blog/is-rosebud-ai-worth-it](https://www.summerengine.com/blog/is-rosebud-ai-worth-it)  
23. Free AI Game Asset Generator — Sprites, Tilesets & Pixel Art | Rosebud AI, [https://lab.rosebud.ai/ai-game-assets](https://lab.rosebud.ai/ai-game-assets)  
24. 2026 Choosing the Ultimate AI game development platform for Your Next Hit Game · community · Discussion \#193398 \- GitHub, [https://github.com/orgs/community/discussions/193398](https://github.com/orgs/community/discussions/193398)  
25. Top 10 Rork Alternatives in 2026 | Bilt Blog, [https://bilt.me/blog/best-rork-alternatives-mobile-app-builders](https://bilt.me/blog/best-rork-alternatives-mobile-app-builders)  
26. Building a Serverless Web Game With WebAssembly and Three.js \- DEV Community, [https://dev.to/samyfodil/building-a-serverless-web-game-with-webassembly-and-threejs-3mbl](https://dev.to/samyfodil/building-a-serverless-web-game-with-webassembly-and-threejs-3mbl)  
27. How to integrate your Phaser 3 game with any JavaScript Framework | by François \- Medium, [https://franzeus.medium.com/how-to-integrate-your-phaser-3-game-with-any-javascript-framework-879c1354e766](https://franzeus.medium.com/how-to-integrate-your-phaser-3-game-with-any-javascript-framework-879c1354e766)  
28. 10 Best AI Tools for Mobile App Design (2026 Ranking), [https://sleek.design/blog/best-ai-tools-mobile-app-design-2026-ranking](https://sleek.design/blog/best-ai-tools-mobile-app-design-2026-ranking)  
29. What Did Rork Actually Change as an AI Mobile App Builder? A Six-Month Field Review, [https://rorklab.net/en/articles/rork-ai/rork-ai-mobile-app-builder-review-2026](https://rorklab.net/en/articles/rork-ai/rork-ai-mobile-app-builder-review-2026)  
30. Meshy 3D Agent \- GitHub, [https://github.com/meshy-dev/meshy-3d-agent](https://github.com/meshy-dev/meshy-3d-agent)  
31. Building up a basic demo with Three.js \- Game development \- MDN Web Docs, [https://developer.mozilla.org/en-US/docs/Games/Techniques/3D\_on\_the\_web/Building\_up\_a\_basic\_demo\_with\_Three.js?language=fr](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/Building_up_a_basic_demo_with_Three.js?language=fr)  
32. Play safely in sandboxed IFrames | Articles \- web.dev, [https://web.dev/articles/sandboxed-iframes](https://web.dev/articles/sandboxed-iframes)  
33. Making a 3d game but don't know where to start \- three.js forum, [https://discourse.threejs.org/t/making-a-3d-game-but-dont-know-where-to-start/90511](https://discourse.threejs.org/t/making-a-3d-game-but-dont-know-where-to-start/90511)  
34. AI GameDevToolkit: Comprehensive AI Tools for Indie Game Development in 2026 | PPTX, [https://www.slideshare.net/slideshow/ai-gamedevtoolkit-comprehensive-ai-tools-for-indie-game-development-in-2026/288190014](https://www.slideshare.net/slideshow/ai-gamedevtoolkit-comprehensive-ai-tools-for-indie-game-development-in-2026/288190014)  
35. Godot vs Unity in 2026: An Honest, Data-Backed Comparison \- Ziva, [https://ziva.sh/blogs/godot-vs-unity](https://ziva.sh/blogs/godot-vs-unity)  
36. How to Use AI with Godot Game Engine: Complete Tutorial (2025) \- Ziva, [https://ziva.sh/blogs/how-to-use-ai-with-godot-game-engine](https://ziva.sh/blogs/how-to-use-ai-with-godot-game-engine)  
37. Meshy: AI 3D Model Generator from Text & Image | Meshy Docs, [https://docs.meshy.ai/en](https://docs.meshy.ai/en)  
38. Can Godot Handle 3D Games? What Shipped Games and Real Benchmarks Show \- Ziva, [https://ziva.sh/blogs/godot-3d](https://ziva.sh/blogs/godot-3d)  
39. Scenario.gg Review (2026): Pricing & Alternatives | Stork.AI, [https://www.stork.ai/en/scenario-gg](https://www.stork.ai/en/scenario-gg)  
40. Meshy Python API Docs | dltHub, [https://dlthub.com/context/source/meshy](https://dlthub.com/context/source/meshy)  
41. Quickstart \- Meshy API Docs, [https://docs.meshy.ai/en/api/quick-start](https://docs.meshy.ai/en/api/quick-start)  
42. Top Scenario Alternatives in 2026 \- Slashdot, [https://slashdot.org/software/p/Scenario.gg/alternatives](https://slashdot.org/software/p/Scenario.gg/alternatives)  
43. Scenario | The Creative AI Infrastructure, [https://www.scenario.com/](https://www.scenario.com/)  
44. Best AI Character Generator for Consistent Characters (2026) \- Neolemon, [https://www.neolemon.com/blog/best-ai-character-generator-for-consistent-characters/](https://www.neolemon.com/blog/best-ai-character-generator-for-consistent-characters/)  
45. Best AI Character Generator API for Game Developers (2026) — 5 Tools Compared, [https://anycap.ai/page/en-US/blog/best-ai-character-generator-api-game-developers](https://anycap.ai/page/en-US/blog/best-ai-character-generator-api-game-developers)  
46. Free AI Sound Effect Generator | Text to Sound Effects \- ElevenLabs, [https://elevenlabs.io/sound-effects](https://elevenlabs.io/sound-effects)  
47. ElevenLabs Voice Generator: The Ultimate AI Audio Guide \- Dirty Disco, [https://www.dirtydiscoradio.com/elevenlabs-voice-generator-ultimate-guide/](https://www.dirtydiscoradio.com/elevenlabs-voice-generator-ultimate-guide/)  
48. Create sound effect | ElevenLabs Documentation, [https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert](https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert)  
49. AI Sound Effects Generator — Text to SFX | Seedream 4.0, [https://seedream-4.ai/sound-effects](https://seedream-4.ai/sound-effects)  
50. A Complete Guide to ElevenLabs: Create Natural, Human-Like Voices, [https://learnprompting.org/blog/guide-elevenlabs](https://learnprompting.org/blog/guide-elevenlabs)  
51. Get the 'Sound Effects You Want' in Seconds: Why ElevenLabs is Changing SFX Production, [https://note.com/rarsan/n/ne551a6dbd07e?hl=en](https://note.com/rarsan/n/ne551a6dbd07e?hl=en)  
52. My Honest Thoughts on Rork.app: AI App Builder Worth the Hype? | by AI Benchmarked, [https://aibenchmarked.medium.com/my-honest-thoughts-on-rork-app-ai-app-builder-worth-the-hype-9749015eb503](https://aibenchmarked.medium.com/my-honest-thoughts-on-rork-app-ai-app-builder-worth-the-hype-9749015eb503)  
53. Best Rork Alternatives for Mobile Apps in 2026 (6 Tested) \- CatDoes, [https://catdoes.com/blog/rork-alternative](https://catdoes.com/blog/rork-alternative)  
54. Getting Started | Rork Lab, [https://rorklab.net/en/articles/rork-basics](https://rorklab.net/en/articles/rork-basics)  
55. Rork \- AI Tool For Vibe coding, [https://theresanaiforthat.com/ai/rork/](https://theresanaiforthat.com/ai/rork/)  
56. Blogs | Ziva, [https://ziva.sh/blogs/](https://ziva.sh/blogs/)  
57. Best Game Making Software for Beginners (AI Compared) \- Rosebud AI, [https://lab.rosebud.ai/blog/game-making-software](https://lab.rosebud.ai/blog/game-making-software)

[image1]: <data:image/png;base64,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>