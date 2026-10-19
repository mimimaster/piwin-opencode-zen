# piwin OpenCode Zen (experimental)

Independent MIT-licensed piwin Agent-runtime extension. Adapted from [ZhiAo1120/pi-opencode-zen](https://github.com/ZhiAo1120/pi-opencode-zen), inspected commit `bebac80a40ec52136fdf6563ddfdae3e417b708a`. Original copyright/license retained in LICENSE.

## Requirements and installation

- Node >=22.19 and a piwin Host containing the generic `modelProvider` manifest support developed with this package. Older released Hosts may not publish its models. Packaging this extension does **not** upgrade the running Desktop/Host.
- Tested against the actual Host-provided Pi 0.84.2 APIs. No npm install or lifecycle script is needed when loaded by piwin; peers come from the Host.
- In piwin's **Extension Marketplace**, search **OpenCode Zen** and install/enable the extension published by **mimimaster**. Marketplace installs are pinned to the published source commit. A running task changes extensions only at its run boundary.
- For local development, extract `piwin-opencode-zen-0.2.0.tgz` and install the extracted `package` directory as a local extension.
- Select OpenCode Zen in model settings/composer. There is no login card or API-key entry. Do not edit native Pi models.json or CC Switch.
- Disable/uninstall through piwin to withdraw the catalog from future sessions. No installer is run automatically by this deliverable.

Source: [mimimaster/piwin-opencode-zen](https://github.com/mimimaster/piwin-opencode-zen). This source package and its versioned marketplace entry are independent of piwin's workspace and release bundles. No npm publication or automatic upgrade of your running Host is required.

## Models and scope

There are **no bundled models or hardcoded model limits**. The provider starts empty. On installation/enable or Host startup, the Host fetches the live Zen model IDs and current models.dev OpenCode metadata. Only explicitly free, non-deprecated Chat Completions models with text output, tool calling, and valid remote limits appear. Models absent from either source are omitted. Free status is based on catalog metadata, not an inference/entitlement probe.

Use **Models → OpenCode Zen → Fetch models** to refresh. A failed or empty live check clears the visible catalog and its persisted session snapshot; it never falls back to static or stale models. Requests are cancellable and bounded to six seconds. SDK and RPC sessions restore only previously fetched results from the Host's Pi models store. This requires the Host update adding automatic public-provider discovery and extension-aware `models/discover`; older Hosts do not initiate this hook automatically.

The provider owns a dedicated Pi API identity and delegates HTTP/SSE parsing to native Pi OpenAI Completions. It composes async payload hooks, forces streaming/public credentials and session headers, and removes `x-opencode-request` case-insensitively. `OPENCODE_ZEN_SESSION` can pin a valid upstream-format session id; otherwise one ephemeral id is generated per module/process. It is not an authentication credential and is not persisted.

The gate's missing `bash`/`read` declarations are protocol placeholders, never Host tool registrations. Real schemas are preserved. Tool-less/compaction requests force `tool_choice: 'none'`; an unexpected call to an unavailable tool fails explicitly with no executable terminal tool result. No new proxy, global fetch patch, inference probes, paid-key mode, account rotation, or retry policy is added.

## Important service warning

Upstream imitates an official OpenCode client for a tier described as OpenCode-only. This is experimental compatibility, not a grant of entitlement. Service terms, served-region restrictions, quotas, IP blocking, model withdrawals, or changes to the client gate can make it stop working. Enabling this extension is an explicit opt-in to that risk. Do not submit sensitive data unless you accept the upstream service's terms and privacy policy. It runs with the Host user's OS permissions, like other Agent extensions.

**No live Zen inference has been performed for this adaptation.** Mocked 403/429 errors stay errors; live access, region eligibility and whether the service accepts tool_choice:none remain unverified. The terminal guard remains active even if the service ignores that field.

## Development / offline verification

With peers and dev dependencies installed normally: `npm test` and `npm run typecheck`.

Without dependency installation, reuse a local piwin checkout explicitly:

```sh
PIWIN_SOURCE_ROOT=/absolute/path/to/piwin npm test
PIWIN_SOURCE_ROOT=/absolute/path/to/piwin npm run typecheck
npm pack --dry-run
```

The test-only resolver borrows real installed Host peers; it is not a fake Pi implementation or a runtime requirement. Offline tests cover the actual resource loader/provider runtime/native SSE parser, usage, async hooks, read-tool round trip, cancellation, placeholder rejection, 403/429 propagation, payload immutability/idempotence and header/session handling. Offline test HTTP requests use an injected in-memory fetch. Catalog tests cover remote metadata, paid/unsupported/withdrawn models, invalid responses, cancellation, empty-on-failure replacement, and session snapshot restoration. Host-side tests separately exercise managed installation and actual SDK/RPC session resolution.
