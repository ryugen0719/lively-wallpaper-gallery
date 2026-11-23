export function isSoftwareWebGLContext(gl: WebGL2RenderingContext | WebGLRenderingContext | null): boolean {
  if (!gl) return true;
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const renderer = String(gl.getParameter(param) || '');
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(renderer);
  } catch {
    return false;
  }
}

export interface FrameHandle {
  raf: number;
  timer: number;
  active: boolean;
}

export function scheduleNextWebGLFrame(
  gl: WebGL2RenderingContext,
  isSoftware: boolean,
  handle: FrameHandle,
  callback: (now: number) => void
): void {
  if (!handle.active) return;
  if (!isSoftware) {
    if (!handle.raf) {
      handle.raf = requestAnimationFrame((now) => {
        handle.raf = 0;
        if (handle.active) callback(now);
      });
    }
    return;
  }

  if (handle.timer || handle.raf) return;
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  gl.flush();
  const poll = () => {
    if (!handle.active) {
      if (sync) gl.deleteSync(sync);
      handle.timer = 0;
      return;
    }
    const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
    if (status === gl.UNSIGNALED) {
      handle.timer = window.setTimeout(poll, 6);
    } else {
      if (sync) gl.deleteSync(sync);
      handle.timer = window.setTimeout(() => {
        handle.timer = 0;
        if (handle.active) callback(performance.now());
      }, 85);
    }
  };
  handle.timer = window.setTimeout(poll, 6);
}

export function cancelWebGLFrame(handle: FrameHandle): void {
  if (handle.raf) {
    cancelAnimationFrame(handle.raf);
    handle.raf = 0;
  }
  if (handle.timer) {
    window.clearTimeout(handle.timer);
    handle.timer = 0;
  }
}
