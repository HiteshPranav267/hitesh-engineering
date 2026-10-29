// Turns content/room/riscv.vcd into content/room/waveform.json for the laptop screen.
//
// The VCD is a real run of tb_riscv_top from
// github.com/HiteshPranav267/riscv-single-cycle-rv32i, recorded with Icarus Verilog 13
// (iverilog -g2012 -s tb_riscv_top -s dump ...) where `dump` only calls
// $dumpfile/$dumpvars(0, tb_riscv_top.dut). Result of that run: PASS=10 FAIL=0.
import fs from "node:fs";

const SIGNALS = ["clk", "rst_n", "pc", "instruction", "alu_result", "reg_write"];
const text = fs.readFileSync("content/room/riscv.vcd", "utf8");

// riscv_top's own nets are declared first, so the first $var of each name is the top-level one.
const ids = {};
const widths = {};
for (const m of text.matchAll(/\$var \w+ (\d+) (\S+) (\w+)/g)) {
    const [, width, id, name] = m;
    if (SIGNALS.includes(name) && !(name in widths)) {
        widths[name] = Number(width);
        ids[id] = name;
    }
}

const changes = Object.fromEntries(SIGNALS.map((s) => [s, []]));
let t = 0;
for (const line of text.slice(text.indexOf("$enddefinitions")).split(/\r?\n/)) {
    if (line.startsWith("#")) t = Number(line.slice(1));
    else if (/^[01xz]/.test(line) && ids[line.slice(1)]) changes[ids[line.slice(1)]].push([t, line[0]]);
    else if (line.startsWith("b")) {
        const [v, id] = line.slice(1).split(" ");
        if (ids[id]) changes[ids[id]].push([t, /[xz]/.test(v) ? "x" : parseInt(v, 2).toString(16)]);
    }
}

const out = {
    source: "tb_riscv_top (riscv-single-cycle-rv32i), Icarus Verilog VCD, timescale 1ps",
    end: t,
    signals: SIGNALS.map((name) => ({ name, width: widths[name], changes: changes[name] })),
};
fs.writeFileSync("content/room/waveform.json", JSON.stringify(out));
console.log("end", t, out.signals.map((s) => `${s.name}:${s.changes.length}`).join(" "));
