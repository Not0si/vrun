An **executable Node.js CLI tool** relies on three core elements: the hashbang line, execution permissions, and NPM package configuration.

---

### 1. The Hashbang (Shebang)

At the very first line of your entry script, add the hashbang instruction:

```javascript
#!/usr/bin/env node

console.log("Hello from my CLI!");
```

- `#!` — Tells Unix-like OS kernels (macOS/Linux) that this file is a runnable script.
- `/usr/bin/env` — A system utility that searches your `PATH` variable.
- `node` — Dynamically points to the active Node.js binary (works across NVM, Homebrew, or standard installs).

---

### 2. File Permissions

Grant your entry script executable permissions via the terminal:

```bash
chmod +x index.js

```

---

### 3. Package Configuration & Local Linking

Define the terminal command name in your `package.json` file under the `bin` field:

```json
{
  "name": "my-cli-tool",
  "version": "1.0.0",
  "bin": {
    "my-cmd": "./index.js"
  }
}
```

To test and run your tool locally across your system:

| Command      | Action                                                                        |
| ------------ | ----------------------------------------------------------------------------- |
| `npm link`   | Creates a global symlink on your computer using the name defined in `bin`.    |
| `my-cmd`     | Executes `./index.js` directly using Node.js without needing `node index.js`. |
| `npm unlink` | Removes the global symlink when testing is complete.                          |

---

> **Cross-Platform Compatibility:** On Unix systems, the OS reads the `#!/usr/bin/env node` line directly. On Windows (which lacks native hashbang support), `npm` reads the `bin` field during `npm link` or `npm install -g` and generates `.cmd` and PowerShell wrapper files automatically to process the hashbang correctly.
