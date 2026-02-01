"use client";

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";
import { GlassPanel } from "./GlassPanel";

interface ConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  ipAddress: string;
}

/**
 * ConsoleModal - Mock SSH console for server
 */
export function ConsoleModal({ isOpen, onClose, serverName, ipAddress }: ConsoleModalProps) {
  const [history, setHistory] = useState<string[]>([
    `$ ssh root@${ipAddress}`,
    `Welcome to ${serverName}`,
    `Last login: ${new Date().toLocaleDateString()} 10:30:22 from 192.168.1.100`,
    "",
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Animation
  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "scale(1)" : "scale(0.95)",
    config: { tension: 300, friction: 25 },
  });

  const backdropSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { duration: 200 },
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom when history changes
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // Mock command responses
  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    let response: string[] = [];

    if (command === "help") {
      response = [
        "Available commands:",
        "  help          - Show this help",
        "  uptime        - Show system uptime",
        "  uname -a      - Show system info",
        "  df -h         - Show disk usage",
        "  free -m       - Show memory usage",
        "  top           - Show processes",
        "  clear         - Clear console",
        "  exit          - Close console",
      ];
    } else if (command === "uptime") {
      response = [" 10:45:22 up 15 days, 3:42, 1 user, load average: 0.42, 0.38, 0.35"];
    } else if (command === "uname -a" || command === "uname") {
      response = ["Linux vps-server 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux"];
    } else if (command === "df -h" || command === "df") {
      response = [
        "Filesystem      Size  Used Avail Use% Mounted on",
        "/dev/vda1        80G   42G   35G  55% /",
        "/dev/vda15      105M  5.3M  100M   5% /boot/efi",
        "tmpfs           2.0G     0  2.0G   0% /dev/shm",
      ];
    } else if (command === "free -m" || command === "free") {
      response = [
        "              total        used        free      shared  buff/cache   available",
        "Mem:           3944        2156         234         142        1553        1387",
        "Swap:          2047         128        1919",
      ];
    } else if (command === "top") {
      response = [
        "top - 10:45:32 up 15 days,  3:42,  1 user,  load average: 0.42, 0.38, 0.35",
        "Tasks:  98 total,   1 running,  97 sleeping,   0 stopped,   0 zombie",
        "%Cpu(s):  2.3 us,  0.5 sy,  0.0 ni, 96.8 id,  0.2 wa,  0.0 hi,  0.2 si",
        "MiB Mem :   3944.5 total,    234.2 free,   2156.1 used,   1554.2 buff/cache",
        "",
        "    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND",
        "    842 root      20   0  956124  74356  23412 S   2.3   1.8  12:45.32 node",
        "    658 postgres  20   0  214532  28316   6432 S   0.7   0.7   5:32.11 postgres",
        "    723 nginx     20   0   12452   4236   2108 S   0.3   0.1   1:12.45 nginx",
      ];
    } else if (command === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else if (command === "exit") {
      onClose();
      return;
    } else if (command === "") {
      // Empty command
    } else {
      response = [`bash: ${command.split(" ")[0]}: command not found`];
    }

    setHistory((prev) => [...prev, `$ ${cmd}`, ...response]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <animated.div
        style={backdropSpring}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <animated.div style={modalSpring} className="relative w-full max-w-3xl">
        <GlassPanel className="overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <button
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-gray-400">
                {serverName} — {ipAddress}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Console */}
          <div
            ref={historyRef}
            className="h-80 p-4 bg-gray-900 font-mono text-sm text-green-400 overflow-y-auto"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}

            {/* Input line */}
            <div className="flex items-center">
              <span className="text-green-400">$ </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
                spellCheck={false}
              />
              <span className="w-2 h-4 bg-green-400 animate-pulse" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-800 text-xs text-gray-500 flex justify-between">
            <span>Type &quot;help&quot; for commands</span>
            <span>Press ESC or type &quot;exit&quot; to close</span>
          </div>
        </GlassPanel>
      </animated.div>
    </div>
  );
}
