"use client";

import { useEffect, useRef, useCallback } from "react";

interface WaveShaderProps {
  fadeTop?: boolean;
  className?: string;
}

const vsSource = `
  attribute vec2 a_position;
  varying vec2 v_position;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_position = a_position;
  }
`;

const fsSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_isDark;
  uniform float u_fadeTop;
  uniform float u_dpr;
  uniform float u_hover;
  varying vec2 v_position;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    ) * 2.0 - 1.0;
  }

  vec2 metaball(vec2 p, float time) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float sum = 0.0;
    float accentSum = 0.0;

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 cellId = i + neighbor;
        vec2 point = hash2(cellId);
        point = 0.5 + 0.4 * sin(time * 0.3 + 6.28 * point);
        vec2 diff = neighbor + point - f;
        float r2 = dot(diff, diff);

        float influence = max(0.0, 1.0 - r2);
        float contrib = influence * influence * influence;
        sum += contrib;

        float isAccent = step(0.92, hash(cellId + 0.5));
        float blobDelay = hash(cellId + 0.7) * 0.75;
        float blobVisible = smoothstep(blobDelay, blobDelay + 0.25, u_hover);
        accentSum += contrib * isAccent * blobVisible;
      }
    }

    float accentWeight = sum > 0.0 ? accentSum / sum : 0.0;
    return vec2(sum, accentWeight);
  }

  vec2 warpCoords(vec2 p, float time) {
    float warp1 = vnoise(p * 0.5 + time * 0.05);
    float warp2 = vnoise(p * 0.3 - time * 0.03 + 100.0);
    return p + vec2(warp1, warp2) * 0.4;
  }

  void main() {
    float scale = 0.0133;
    vec2 p = gl_FragCoord.xy * scale;

    // Wind Waker colors - exact lucumr colors
    vec3 lightBright = vec3(0.10, 0.42, 0.70);
    vec3 lightDark = vec3(0.04, 0.22, 0.44);
    vec3 lightPageBg = vec3(1.0, 1.0, 1.0);

    vec3 darkBright = vec3(0.32, 0.55, 0.82);
    vec3 darkDark = vec3(0.12, 0.24, 0.40);
    vec3 darkPageBg = vec3(0.106, 0.192, 0.337);

    // Accent colors (red from --secondary-color)
    vec3 lightAccent = vec3(0.804, 0.055, 0.055);
    vec3 darkAccent = vec3(1.0, 0.4, 0.4);

    vec3 bright = mix(lightBright, darkBright, u_isDark);
    vec3 dark = mix(lightDark, darkDark, u_isDark);
    vec3 accent = mix(lightAccent, darkAccent, u_isDark);

    float baseHeight = 50.0 * u_dpr;
    float waveAmplitude = 25.0 * u_dpr;
    float xCoord = gl_FragCoord.x / u_dpr;
    float boundary = baseHeight;
    boundary += vnoise(vec2(xCoord * 0.008, u_time * 0.08)) * waveAmplitude;
    boundary += vnoise(vec2(xCoord * 0.02, u_time * 0.04 + 50.0)) * waveAmplitude * 0.4;

    float pixelY = mix(gl_FragCoord.y, u_resolution.y - gl_FragCoord.y, u_fadeTop);
    float distToBoundary = pixelY - boundary;

    float wallRange = 40.0 * u_dpr;
    float wallInfluence = smoothstep(wallRange, 0.0, distToBoundary) * 0.25;

    vec2 p1 = p * 0.7 + vec2(u_time * 0.02, u_time * 0.015);
    vec2 meta1 = metaball(warpCoords(p1, u_time * 0.6), u_time * 0.6);
    float field1 = meta1.x + wallInfluence;
    float accent1 = meta1.y;

    vec2 p2 = p + vec2(u_time * 0.06, -u_time * 0.02);
    vec2 meta2 = metaball(warpCoords(p2 + 100.0, u_time), u_time);
    float field2 = meta2.x + wallInfluence;
    float accent2 = meta2.y;

    float taperRange = 30.0 * u_dpr;
    float taper = smoothstep(-taperRange, 0.0, distToBoundary);
    field1 *= taper;
    field2 *= taper;

    float aaWidth = 0.005 / max(u_dpr, 1.0);

    float blend1 = smoothstep(0.92 - aaWidth, 0.92 + aaWidth, field1);
    float blend2 = smoothstep(0.95 - aaWidth, 0.95 + aaWidth, field2);

    float isAccent1 = step(0.5, accent1);
    float isAccent2 = step(0.5, accent2);

    vec3 dark1 = mix(dark, accent, isAccent1 * u_hover);
    vec3 bright2 = mix(bright, accent, isAccent2 * u_hover);

    // Transparent background - only render the metaballs
    float alpha = max(blend1, blend2);
    vec3 color = mix(dark1, bright2, blend2 / max(alpha, 0.001));

    gl_FragColor = vec4(color, alpha);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function getIsDark(): number {
  if (typeof document === "undefined") return 1.0;
  const html = document.documentElement;
  if (html.classList.contains("dark")) return 1.0;
  if (html.classList.contains("light")) return 0.0;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? 1.0 : 0.0;
}

function getEffectiveDpr(): number {
  const dpr = window.devicePixelRatio;
  return dpr <= 1 ? 1.5 : dpr;
}

export default function WaveShader({ fadeTop = false, className = "" }: WaveShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const effectRef = useRef<{
    gl: WebGLRenderingContext;
    resolutionLoc: WebGLUniformLocation | null;
    timeLoc: WebGLUniformLocation | null;
    isDarkLoc: WebGLUniformLocation | null;
    dprLoc: WebGLUniformLocation | null;
    hoverLoc: WebGLUniformLocation | null;
    hoverValue: number;
    hoverTarget: number;
    needsResize: boolean;
  } | null>(null);

  const startTimeRef = useRef(performance.now());
  const lastFrameTimeRef = useRef(0);
  const isVisibleRef = useRef(true);

  const FRAME_INTERVAL = 33;

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return null;

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const isDarkLoc = gl.getUniformLocation(program, "u_isDark");
    const fadeTopLoc = gl.getUniformLocation(program, "u_fadeTop");
    const dprLoc = gl.getUniformLocation(program, "u_dpr");
    const hoverLoc = gl.getUniformLocation(program, "u_hover");

    gl.uniform1f(fadeTopLoc, fadeTop ? 1.0 : 0.0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return {
      gl,
      resolutionLoc,
      timeLoc,
      isDarkLoc,
      dprLoc,
      hoverLoc,
      hoverValue: 0,
      hoverTarget: 0,
      needsResize: true,
    };
  }, [fadeTop]);

  useEffect(() => {
    effectRef.current = initWebGL();

    const canvas = canvasRef.current;
    if (!canvas || !effectRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const handleResize = () => {
      if (effectRef.current) {
        effectRef.current.needsResize = true;
      }
    };
    window.addEventListener("resize", handleResize);

    const handleMouseEnter = () => {
      if (effectRef.current) {
        effectRef.current.hoverTarget = 1;
      }
    };
    const handleMouseLeave = () => {
      if (effectRef.current) {
        effectRef.current.hoverTarget = 0;
      }
    };

    const container = canvas.parentElement;
    container?.addEventListener("mouseenter", handleMouseEnter);
    container?.addEventListener("mouseleave", handleMouseLeave);

    const render = (timestamp: number) => {
      if (!isVisibleRef.current || !effectRef.current) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      if (timestamp - lastFrameTimeRef.current < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      const effect = effectRef.current;
      const { gl, resolutionLoc, timeLoc, isDarkLoc, dprLoc, hoverLoc } = effect;
      const elapsed = (performance.now() - startTimeRef.current) / 1000.0;
      const isDark = getIsDark();
      const effectiveDpr = getEffectiveDpr();
      const deltaTime = FRAME_INTERVAL / 1000.0;

      if (effect.needsResize && canvas) {
        canvas.width = canvas.offsetWidth * effectiveDpr;
        canvas.height = canvas.offsetHeight * effectiveDpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
        effect.needsResize = false;
      }

      const hoverSpeed = 1.0 / 2.65;
      if (effect.hoverTarget > effect.hoverValue) {
        effect.hoverValue = Math.min(
          effect.hoverTarget,
          effect.hoverValue + deltaTime * hoverSpeed,
        );
      } else if (effect.hoverTarget < effect.hoverValue) {
        effect.hoverValue = Math.max(
          effect.hoverTarget,
          effect.hoverValue - deltaTime * hoverSpeed,
        );
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform1f(isDarkLoc, isDark);
      gl.uniform1f(dprLoc, effectiveDpr);
      gl.uniform1f(hoverLoc, effect.hoverValue);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      container?.removeEventListener("mouseenter", handleMouseEnter);
      container?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initWebGL]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
