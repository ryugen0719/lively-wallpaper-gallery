import type { MutableRefObject } from 'react';
import Beams from './Beams';
import Aurora from './backgrounds/Aurora.jsx';
import GradientASCII from './backgrounds/GradientASCII.jsx';
import Grainient from './backgrounds/Grainient.jsx';
import HoloMosaic from './backgrounds/HoloMosaic.jsx';
import LetterGlitch from './backgrounds/LetterGlitch.jsx';
import PixelSnow from './backgrounds/PixelSnow.jsx';
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
  }
}
