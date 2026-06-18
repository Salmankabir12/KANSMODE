<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let {
    direction = 'right',
    speed = 1,
    borderColor = '#999',
    squareSize = 40,
    hoverFillColor = '#222',
  }: {
    direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
    speed?: number;
    borderColor?: string;
    squareSize?: number;
    hoverFillColor?: string;
  } = $props();

  let canvasEl: HTMLCanvasElement;
  let animationId: number | null = null;
  let gridOffset = $state({ x: 0, y: 0 });
  let hoveredSquare = $state<{ x: number; y: number } | null>(null);

  onMount(() => {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    function resize() {
      const w = canvasEl.offsetWidth || canvasEl.clientWidth;
      const h = canvasEl.offsetHeight || canvasEl.clientHeight;
      if (w > 0 && h > 0) {
        canvasEl.width = w;
        canvasEl.height = h;
      }
    }

    window.addEventListener('resize', resize);

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvasEl);

    requestAnimationFrame(() => resize());
    resize();

    function drawGrid() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      const startX = Math.floor(gridOffset.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.y / squareSize) * squareSize;
      ctx.lineWidth = 0.5;

      for (let x = startX; x < canvasEl.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvasEl.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.x % squareSize);
          const squareY = y - (gridOffset.y % squareSize);
          const gridX = Math.floor((x - startX) / squareSize);
          const gridY = Math.floor((y - startY) / squareSize);

          if (hoveredSquare && gridX === hoveredSquare.x && gridY === hoveredSquare.y) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      const gradient = ctx.createRadialGradient(
        canvasEl.width / 2, canvasEl.height / 2, 0,
        canvasEl.width / 2, canvasEl.height / 2,
        Math.sqrt(canvasEl.width ** 2 + canvasEl.height ** 2) / 2
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(6, 0, 16, 0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    }

    function update() {
      const s = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':
          gridOffset.x = (gridOffset.x - s + squareSize) % squareSize;
          break;
        case 'left':
          gridOffset.x = (gridOffset.x + s + squareSize) % squareSize;
          break;
        case 'up':
          gridOffset.y = (gridOffset.y + s + squareSize) % squareSize;
          break;
        case 'down':
          gridOffset.y = (gridOffset.y - s + squareSize) % squareSize;
          break;
        case 'diagonal':
          gridOffset.x = (gridOffset.x - s + squareSize) % squareSize;
          gridOffset.y = (gridOffset.y - s + squareSize) % squareSize;
          break;
      }
      drawGrid();
      animationId = requestAnimationFrame(update);
    }

    function handleMouseMove(e: MouseEvent) {
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        mouseX >= 0 &&
        mouseY >= 0 &&
        mouseX <= rect.width &&
        mouseY <= rect.height
      ) {
        hoveredSquare = {
          x: Math.floor((mouseX + (gridOffset.x % squareSize)) / squareSize),
          y: Math.floor((mouseY + (gridOffset.y % squareSize)) / squareSize),
        };
      } else {
        hoveredSquare = null;
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    animationId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      ro.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });
</script>

<canvas bind:this={canvasEl} class="w-full h-full border-none block bg-transparent"></canvas>
