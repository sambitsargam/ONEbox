---
name: ONEbox
description: "Build production-style OneChain apps end-to-end with minimal back-and-forth: scaffold contracts + frontend, implement requested features, build, deploy, wire IDs, and run. Use when users say build/create/make an app, dApp, contract, dashboard, launchpad, NFT, DeFi, game, or full-stack project on OneChain."
---

# OneChain Full-Stack Builder Skill

Use this skill when a user asks to build any app on OneChain.

## Agent Behavior Contract

Follow these rules by default:

1. Start building immediately.
2. Ask questions only when a blocker prevents implementation.
3. If requirements are incomplete, assume practical defaults and continue.
4. Produce working code first, polish second.
5. After each milestone, run validation commands and fix failures.
6. Return a concise summary with deployed IDs, changed files, and run commands.

## Default Assumptions

If the user does not specify alternatives, use:

- Network: OneChain testnet
- RPC: `https://rpc-testnet.onelabs.cc:443`
- Explorer: `https://onescan.cc/testnet`
- Contract language: Move (`edition = "2024.beta"`)
- Frontend: React + TypeScript + Vite
- Wallet + chain libs: `@onelabs/dapp-kit`, `@mysten/sui`, `@tanstack/react-query`
- Package manager: `npm`

## Expected Outputs

For a normal "build xyz app on OneChain" task, deliver all of:

1. Contract project with compilable Move modules.
2. Publish transaction on testnet and captured `PackageID`.
3. Captured object IDs required by the app (shared/owned capability objects).
4. Frontend app wired to the deployed contract.
5. Wallet connect, at least one write flow, and at least one read/query flow.
6. Explorer links for transactions and objects.
7. A short runbook (install, run, deploy, test).

## Build Workflow (Mandatory Order)

1. Verify toolchain.
2. Scaffold contract + frontend.
3. Implement contract logic.
4. Build contract and fix compile errors.
5. Deploy contract and capture on-chain IDs.
6. Wire frontend env/config to deployed IDs.
7. Implement UI flows and transaction handlers.
8. Run app and validate behavior.
9. Report final outputs and next steps.

## 1) Toolchain Setup

### Prerequisites

- Rust (stable)
- Git
- Node.js 18+

### Install OneChain CLI

```bash
git clone https://github.com/one-chain-labs/onechain.git
cd onechain
cargo install --path crates/one --locked --features tracing
~/.cargo/bin/one --version
```

### PATH setup (if needed)

```bash
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
one --version
```

### Configure testnet + wallet

```bash
one client new-env --alias testnet --rpc https://rpc-testnet.onelabs.cc:443
one client switch --env testnet
one client active-env

one client new-address ed25519
one client active-address
one client faucet
one client gas
```

## 2) Contract Scaffold

Recommended structure:

```text
<app-name>/
  contracts/
    Move.toml
    sources/
  frontend/
```

### Move.toml baseline

```toml
[package]
name = "AppContracts"
version = "0.0.1"
edition = "2024.beta"

[addresses]
app = "0x0"
one = "0x2"

[dependencies]
One = { local = "../../onechain/crates/sui-framework/packages/one-framework" }
MoveStdlib = { local = "../../onechain/crates/sui-framework/packages/move-stdlib" }
```

## 3) Contract Implementation Rules

1. Use `one::` framework modules.
2. Prefer explicit capabilities and strong access controls.
3. Emit events for major state changes.
4. Use shared objects only when shared mutable state is required.
5. Keep entry functions minimal and composable.
6. Return deterministic, indexable data for frontend queries.

## 4) Build and Deploy

```bash
one move build --path contracts
one client publish --gas-budget 50000000 contracts
```

Capture and persist:

- `PackageID`
- Created object IDs
- Init capabilities/admin objects
- Publish transaction digest

## 5) Frontend Scaffold and Wiring

```bash
npm create vite@latest frontend -- --template react-ts
npm install --prefix frontend @onelabs/dapp-kit @mysten/sui @tanstack/react-query
```

### Frontend env template

`frontend/.env`:

```env
VITE_NETWORK=testnet
VITE_RPC_URL=https://rpc-testnet.onelabs.cc:443
VITE_PACKAGE_ID=0x<package_id>
VITE_PRIMARY_OBJECT_ID=0x<object_id_if_needed>
```

### Frontend integration checklist

1. Configure providers (`QueryClientProvider`, chain provider, wallet provider).
2. Add connect wallet UI.
3. Add write action(s) using signed transaction flow.
4. Add read views using object/event RPC queries.
5. Add explorer links for tx/object verification.

## 6) Definition of Done

All conditions must be true:

1. Move package builds with zero errors.
2. Contract publish succeeds on OneChain testnet.
3. IDs are correctly wired into frontend env/config.
4. Wallet connect works from UI.
5. At least one write transaction executes from UI.
6. At least one read/query view reflects on-chain data.
7. Explorer links open valid objects/transactions.

## 7) Fast-Start Command Sequence

```bash
mkdir -p MyOneApp/contracts/sources

one move build --path MyOneApp/contracts
one client publish --gas-budget 50000000 MyOneApp/contracts

npm create vite@latest MyOneApp/frontend -- --template react-ts
npm install --prefix MyOneApp/frontend @onelabs/dapp-kit @mysten/sui @tanstack/react-query
cd MyOneApp/frontend && npm run dev
```

## 8) Failure Handling Policy

If any step fails:

1. Surface the exact command and error.
2. Apply the minimal fix.
3. Re-run the failed step.
4. Continue workflow automatically.

Do not stop at planning unless the user explicitly asks for planning only.

## 9) Security and Safety Notes

1. Never expose private keys in logs/output.
2. Do not use burner/dev keys for production deployment.
3. Clearly mark dev-only shortcuts.
4. Prefer least-privilege admin/capability handling.

## 10) References

- Docs: https://docs.onelabs.cc/DevelopmentDocument
- Discord: https://discord.gg/onechain
- OneChain repo: https://github.com/one-chain-labs/onechain
- OneChain SDK: https://doc-testnet.onelabs.cc/typescript
- Medium Blog: https://onechain.medium.com/
