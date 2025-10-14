"use client";
import { useEffect, useRef } from 'react';

// Локальный WebGL фон только для Hero (высота блока), лёгкий и плавный
export default function HeroGL() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const setSize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    setSize();
    addEventListener('resize', setSize);

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, 'attribute vec2 a; void main(){gl_Position=vec4(a,0.0,1.0);}');
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, `
      precision highp float; uniform vec2 u_res; uniform float u_time;
      vec3 c1=vec3(1.0,0.82,0.40); vec3 c2=vec3(1.0,0.60,0.24); vec3 c3=vec3(1.0,0.42,0.0); vec3 c4=vec3(0.85,0.29,0.0);
      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p), f=fract(p); float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.)); vec2 u=f*f*(3.-2.*f); return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y; }
      void main(){
        vec2 uv=gl_FragCoord.xy/u_res; uv.x*=u_res.x/u_res.y; 
        float t=u_time*0.08;
        float n=noise(uv*2.5+vec2(t,-t));
        float m=noise(uv*5.0+vec2(-t*0.7,t*0.9));
        float g=smoothstep(0.2,0.8,n*0.7+m*0.3);
        vec3 col=mix(c1,c2,g); col=mix(col,c3,smoothstep(0.4,0.9,n)); col=mix(col,c4,smoothstep(0.7,1.0,m));
        // мягкая виньетка к краям
        float v=pow(smoothstep(0.0,1.2,length(uv-vec2(0.65,0.45))),1.2);
        col*=mix(1.0,0.85,v);
        gl_FragColor=vec4(col,1.0);
      }
    `);
    gl.compileShader(fs);
    const prog = gl.createProgram()!; gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog,'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    const uRes=gl.getUniformLocation(prog,'u_res'); const uTime=gl.getUniformLocation(prog,'u_time');
    let raf=0, start=performance.now();
    const loop=()=>{ const t=(performance.now()-start)/1000; gl.uniform2f(uRes,canvas.width,canvas.height); gl.uniform1f(uTime,t); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); raf=requestAnimationFrame(loop); };
    loop();
    return ()=>{ cancelAnimationFrame(raf); removeEventListener('resize', setSize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 -z-10" />;
}


