import type { MutableRefObject } from 'react';
import Beams from './Beams';
import Aurora from './backgrounds/Aurora.jsx';
import CrystalizedBall from './backgrounds/CrystalizedBall.jsx';
import CursorGrid from './backgrounds/CursorGrid.jsx';
import GradientASCII from './backgrounds/GradientASCII.jsx';
import Grainient from './backgrounds/Grainient.jsx';
import HoloMosaic from './backgrounds/HoloMosaic.jsx';
import LetterGlitch from './backgrounds/LetterGlitch.jsx';
import PixelSnow from './backgrounds/PixelSnow.jsx';
import Scanner from './backgrounds/Scanner.jsx';
import SideRays from './backgrounds/SideRays.jsx';
import SoftAurora from './backgrounds/SoftAurora.jsx';
import Topography from './backgrounds/Topography.jsx';
import type { AllDesignConfigs, WallpaperDesignId } from '../utils/wallpaperDesigns';

interface WallpaperCanvasProps {
  designId: WallpaperDesignId;
  configs: AllDesignConfigs;
  beamsClockRef: MutableRefObject<number>;
}

export function WallpaperCanvas({ designId, configs, beamsClockRef }: WallpaperCanvasProps) {
  switch (designId) {
    case 'beams': {
      const c = configs.beams;
      return (
        <Beams
          color={c.color}
          backgroundColor={c.backgroundColor}
          beamWidth={c.beamWidth}
          rotation={c.rotation}
          speed={c.speed}
          waveLength={c.waveLength}
          depth={c.depth}
          sharpness={c.sharpness}
          twist={c.twist}
          fillLight={c.fillLight}
          glow={c.glow}
          brightness={c.brightness}
          variation={c.variation}
          grain={c.grain}
          fade={c.fade}
          mouseInteraction={c.mouseInteraction}
          mouseStrength={c.mouseStrength}
          lightMode={c.lightMode}
          paused={c.paused}
          clockRef={beamsClockRef}
          className="h-full w-full"
        />
      );
    }
    case 'pixel-snow': {
      const c = configs['pixel-snow'];
      return (
        <PixelSnow
          color={c.color}
          variant={c.variant}
          density={c.density}
          speed={c.speed}
          wind={c.wind}
          sway={c.sway}
          flakeSize={c.flakeSize}
          pixelSize={c.pixelSize}
          depth={c.depth}
          brightness={c.brightness}
          glow={c.glow}
          twinkle={c.twinkle}
          accumulate={c.accumulate}
          mouseInteraction={c.mouseInteraction}
          lightMode={c.lightMode}
          paused={c.paused}
          intro={false}
          dpr={undefined}
          className="h-full w-full"
          style={{ backgroundColor: c.backgroundColor }}
        />
      );
    }
    case 'holo-mosaic': {
      const c = configs['holo-mosaic'];
      return (
        <HoloMosaic
          color={c.color}
          metalColor={c.metalColor}
          spectrum={c.spectrum}
          tileSize={c.tileSize}
          gap={c.gap}
          roundness={c.roundness}
          bevel={c.bevel}
          rotation={c.rotation}
          swirl={c.swirl}
          ripple={c.ripple}
          intensity={c.intensity}
          saturation={c.saturation}
          glitter={c.glitter}
          sheen={c.sheen}
          grain={c.grain}
          speed={c.speed}
          filter={c.filter}
          mouseInteraction={c.mouseInteraction}
          flipOnClick={c.flipOnClick}
          lightMode={c.lightMode}
          paused={c.paused}
          intro={false}
          dpr={undefined}
          className="h-full w-full"
        />
      );
    }
    case 'aurora': {
      const c = configs.aurora;
      return (
        <Aurora
          colorStops={c.colorStops}
          amplitude={c.amplitude}
          blend={c.blend}
          speed={c.speed}
          time={undefined}
          height={c.height}
          scale={c.scale}
          glow={c.glow}
          brightness={c.brightness}
          layers={c.layers}
          direction={c.direction}
          mouseInteraction={c.mouseInteraction}
          lightMode={c.lightMode}
          paused={c.paused}
          intro={false}
          dpr={undefined}
          className="h-full w-full"
          style={{ backgroundColor: c.backgroundColor }}
        />
      );
    }
    case 'gradient-ascii': {
      const c = configs['gradient-ascii'];
      return (
        <GradientASCII
          colors={c.colors}
          shape={c.shape}
          cellSize={c.cellSize}
          density={c.density}
          glyphOpacity={c.glyphOpacity}
          glow={c.glow}
          flicker={c.flicker}
          softness={c.softness}
          scale={c.scale}
          flow={c.flow}
          speed={c.speed}
          gradientOpacity={c.gradientOpacity}
          grain={c.grain}
          mouseInteraction={c.mouseInteraction}
          clickEffect={c.clickEffect}
          lightMode={c.lightMode}
          intro={false}
          dpr={undefined}
          className="h-full w-full"
          style={{ backgroundColor: c.backgroundColor }}
        />
      );
    }
    case 'letter-glitch': {
      const c = configs['letter-glitch'];
      return (
        <LetterGlitch
          glitchColors={c.glitchColors}
          baseColor={c.baseColor}
          backgroundColor={c.backgroundColor}
          fontSize={c.fontSize}
          spacing={c.spacing}
          density={c.density}
          baseOpacity={c.baseOpacity}
          glitchAmount={c.glitchAmount}
          speed={c.speed}
          smooth={c.smooth}
          interactive={c.interactive}
          cursorRadius={c.cursorRadius}
          clickEffect={c.clickEffect}
          flow={c.flow}
          edgeFade={c.edgeFade}
          centerFade={c.centerFade}
          lightMode={c.lightMode}
          intro={false}
          dpr={undefined}
          style={undefined}
          className="h-full w-full"
        />
      );
    }
    case 'grainient': {
      const c = configs.grainient;
      return (
        <Grainient
          colors={c.colors}
          type={c.type}
          angle={c.angle}
          bands={c.bands}
          speed={c.speed}
          flow={c.flow}
          scale={c.scale}
          softness={c.softness}
          silk={c.silk}
          grainAmount={c.grainAmount}
          grainSize={c.grainSize}
          grainAnimated={c.grainAnimated}
          contrast={c.contrast}
          saturation={c.saturation}
          interactive={c.interactive}
          stir={c.stir}
          clickSwirl={c.clickSwirl}
          lightMode={c.lightMode}
          intro={false}
          dpr={undefined}
          style={undefined}
          className="h-full w-full"
        />
      );
    }
    case 'crystalized-ball': {
      const c = configs['crystalized-ball'];
      return (
        <CrystalizedBall
          preset={c.preset}
          color={c.color}
          theme={c.lightMode ? 'light' : 'dark'}
          size={c.size}
          strands={undefined}
          crackle={c.crackle}
          flares={c.flares}
          glow={c.glow}
          sparks={undefined}
          particleCount={undefined}
          fill={undefined}
          motion={undefined}
          particleShape={undefined}
          depth={undefined}
          sway={undefined}
          twinkle={undefined}
          haze={undefined}
          speed={c.speed}
          dustSpeed={undefined}
          interactive={c.interactive}
          paused={c.paused}
          intro={false}
          className="h-full w-full"
          style={{ backgroundColor: c.backgroundColor }}
        />
      );
    }
    case 'scanner': {
      const c = configs.scanner;
      return (
        <Scanner
          color1={c.color1}
          color2={c.color2}
          color3={c.color3}
          speed={c.speed}
          sweepSpeed={c.sweepSpeed}
          sweepWidth={c.sweepWidth}
          trail={c.trail}
          scale={c.scale}
          bandDensity={c.bandDensity}
          glow={c.glow}
          scanDirection={c.scanDirection}
          brightness={c.brightness}
          scanline={c.scanline}
          mouseInteraction={c.mouseInteraction}
          lightMode={c.lightMode}
          intro={false}
          dpr={undefined}
          className="h-full w-full"
          style={{ backgroundColor: c.backgroundColor }}
        />
      );
    }
    case 'topography': {
      const c = configs.topography;
      return (
        <Topography
          color={c.color}
          lineCount={c.lineCount}
          lineWidth={c.lineWidth}
          elevation={c.elevation}
          scale={c.scale}
          tilt={c.tilt}
          speed={c.speed}
          direction={c.direction}
          morph={c.morph}
          glow={c.glow}
          fog={c.fog}
          hoverEffect={c.hoverEffect}
          markers={c.markers}
          mouseInteraction={c.mouseInteraction}
          lightMode={c.lightMode}
          intro={false}
          dpr={undefined}
          className="h-full w-full"
          style={{ backgroundColor: c.backgroundColor }}
        />
      );
    }
    case 'cursor-grid': {
      const c = configs['cursor-grid'];
      return (
        <CursorGrid
          cellSize={c.cellSize}
          color={c.color}
          gridColor={c.gridColor}
          radius={c.radius}
          highlight={c.highlight}
          gridStyle={c.gridStyle}
          ambient={c.ambient}
          spotlight={c.spotlight}
          gridOpacity={c.gridOpacity}
          fillOpacity={c.fillOpacity}
          clickPulse={c.clickPulse}
          lightMode={c.lightMode}
          intro={false}
          dpr={undefined}
          children={undefined}
          className="h-full w-full"
          style={{ backgroundColor: c.backgroundColor }}
        />
      );
    }
    case 'side-rays': {
      const c = configs['side-rays'];
      return (
        <SideRays
          rayColor1={c.rayColor1}
          rayColor2={c.rayColor2}
          blend={c.blend}
          origin={c.origin}
          speed={c.speed}
          intensity={c.intensity}
          spread={c.spread}
          density={c.density}
          sharpness={c.sharpness}
          glow={c.glow}
          dust={c.dust}
          followMouse={c.followMouse}
          lightMode={c.lightMode}
          intro={false}
          className="h-full w-full"
          style={{ backgroundColor: c.backgroundColor }}
        />
      );
    }
    case 'soft-aurora': {
      const c = configs['soft-aurora'];
      return (
        <SoftAurora
          color1={c.color1}
          color2={c.color2}
          speed={c.speed}
          scale={c.scale}
          brightness={c.brightness}
          noiseFrequency={c.noiseFrequency}
          noiseAmplitude={c.noiseAmplitude}
          bandHeight={c.bandHeight}
          bandSpread={c.bandSpread}
          spectrum={c.spectrum}
          tilt={c.tilt}
          enableMouseInteraction={c.enableMouseInteraction}
          clickPulse={c.clickPulse}
          lightMode={c.lightMode}
          intro={false}
          className="h-full w-full"
          style={{ backgroundColor: c.backgroundColor }}
        />
      );
    }
  }
}
