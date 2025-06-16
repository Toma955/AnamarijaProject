// src/StarryBackground.js
import React from "react";
import Particles from "react-tsparticles";

const starOptions = {
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: "#000" },
    fpsLimit: 60,
    particles: {
        number: { value: 100, density: { enable: true, area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: {
            value: 1,
            random: true,
            anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
        },
        size: { value: { min: 0.5, max: 1.5 }, random: true },
        move: { enable: true, speed: 0.2, outModes: "out" },
        twinkle: { particles: { enable: true, frequency: 0.05, color: "#fff", opacity: 1 } }
    }
};

export default function StarryBackground() {
    return <Particles id="tsparticles" options={starOptions} />;
}
